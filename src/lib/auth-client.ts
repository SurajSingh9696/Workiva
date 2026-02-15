/**
 * Client-side authentication utilities for mobile compatibility and security
 */

'use client';

import { getCookie } from './cookie-utils';

export interface AuthConfig {
  apiVersion?: string;
  baseURL?: string;
  timeout?: number;
  retryAttempts?: number;
}

export class AuthClient {
  private config: AuthConfig;
  private csrfToken: string | null = null;

  constructor(config: AuthConfig = {}) {
    this.config = {
      apiVersion: 'v1',
      baseURL: process.env.NEXT_PUBLIC_API_URL || '',
      timeout: 10000,
      retryAttempts: 3,
      ...config,
    };
    
    // Initialize CSRF token from cookie or header
    this.initializeCSRFToken();
  }

  private initializeCSRFToken(): void {
    // Try to get CSRF token from cookie first
    this.csrfToken = getCookie('csrf-token');
    
    // If not in cookie, try to get from meta tag (set by server)
    if (!this.csrfToken) {
      const metaTag = document.querySelector('meta[name="csrf-token"]');
      this.csrfToken = metaTag?.getAttribute('content') || null;
    }

    // If still no token, try to get from response header in previous requests
    if (!this.csrfToken && typeof window !== 'undefined') {
      this.csrfToken = sessionStorage.getItem('csrf-token');
    }
  }

  public getCSRFToken(): string | null {
    return this.csrfToken;
  }

  public updateCSRFToken(token: string): void {
    this.csrfToken = token;
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('csrf-token', token);
    }
  }

  /**
   * Enhanced fetch wrapper with mobile-specific optimizations
   */
  public async secureRequest(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const headers = new Headers(options.headers);
    
    // Add CSRF token for non-GET requests
    if (this.csrfToken && options.method !== 'GET') {
      headers.set('X-CSRF-Token', this.csrfToken);
    }

    // Add mobile-specific headers
    if (this.isMobileDevice()) {
      headers.set('X-Mobile-Request', 'true');
      headers.set('X-Requested-With', 'XMLHttpRequest');
    }

    // Add timing headers for performance monitoring
    headers.set('X-Request-Start', Date.now().toString());
    
    // Content type for JSON requests
    if (!headers.has('Content-Type') && options.body) {
      headers.set('Content-Type', 'application/json');
    }

    const enhancedOptions: RequestInit = {
      ...options,
      headers,
      credentials: 'include', // Important for cookie-based sessions
      signal: AbortSignal.timeout(this.config.timeout!),
    };

    let lastError: Error | null = null;
    
    // Retry logic for mobile network instability
    for (let attempt = 1; attempt <= this.config.retryAttempts!; attempt++) {
      try {
        const response = await fetch(url, enhancedOptions);
        
        // Update CSRF token if provided in response
        const newCSRFToken = response.headers.get('X-CSRF-Token');
        if (newCSRFToken) {
          this.updateCSRFToken(newCSRFToken);
        }
        
        // Handle authentication errors
        if (response.status === 401) {
          this.handleAuthError();
          throw new Error('Authentication required');
        }
        
        // Handle rate limiting
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 60000;
          
          if (attempt < this.config.retryAttempts!) {
            await this.delay(waitTime);
            continue;
          }
        }
        
        return response;
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on client errors (4xx)
        if (error instanceof TypeError && error.message.includes('4')) {
          throw error;
        }
        
        // Exponential backoff for retries
        if (attempt < this.config.retryAttempts!) {
          await this.delay(Math.pow(2, attempt) * 1000);
        }
      }
    }
    
    throw lastError || new Error('Request failed after retries');
  }

  /**
   * Mobile-optimized login with enhanced error handling
   */
  public async login(credentials: { email: string; password: string }) {
    try {
      const response = await this.secureRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          message: 'Login failed' 
        }));
        throw new Error(errorData.message || 'Login failed');
      }

      // Handle successful login
      const data = await response.json();
      
      // Update CSRF token
      const csrfToken = response.headers.get('X-CSRF-Token');
      if (csrfToken) {
        this.updateCSRFToken(csrfToken);
      }

      return data;
    } catch (error) {
      this.handleAuthError(error as Error);
      throw error;
    }
  }

  /**
   * Secure logout with session cleanup
   */
  public async logout(): Promise<void> {
    try {
      await this.secureRequest('/api/auth/logout', {
        method: 'POST',
      });
    } finally {
      // Clean up client-side state regardless of server response
      this.csrfToken = null;
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('csrf-token');
        localStorage.removeItem('user-preferences');
      }
    }
  }

  /**
   * Check if current environment is mobile
   */
  private isMobileDevice(): boolean {
    if (typeof navigator === 'undefined') return false;
    
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
    
    return mobileKeywords.some(keyword => userAgent.includes(keyword)) ||
           (window.innerWidth <= 768);
  }

  /**
   * Handle authentication errors
   */
  private handleAuthError(error?: Error): void {
    // Clear authentication state
    this.csrfToken = null;
    
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('csrf-token');
      
      // Show user-friendly error message
      if (error?.message.includes('rate limit')) {
        alert('Too many login attempts. Please try again in 15 minutes.');
      } else if (error?.message.includes('network')) {
        alert('Network connection error. Please check your internet and try again.');
      }
      
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      }
    }
  }

  /**
   * Delay utility for retries
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Validate session health
   */
  public async validateSession(): Promise<boolean> {
    try {
      const response = await this.secureRequest('/api/auth/validate', {
        method: 'GET',
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Refresh session if needed
   */
  public async refreshSession(): Promise<boolean> {
    try {
      const response = await this.secureRequest('/api/auth/refresh', {
        method: 'POST',
      });
      
      if (response.ok) {
        const csrfToken = response.headers.get('X-CSRF-Token');
        if (csrfToken) {
          this.updateCSRFToken(csrfToken);
        }
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}

// Singleton instance for global use
export const authClient = new AuthClient();

// React hook for auth client
export function useAuthClient(): AuthClient {
  return authClient;
}