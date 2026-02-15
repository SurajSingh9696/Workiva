/**
 * Cookie utilities for client-side operations
 * Mobile-optimized cookie handling
 */

'use client';

export interface CookieOptions {
  expires?: Date | string | number;
  maxAge?: number;
  domain?: string;
  path?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  httpOnly?: boolean;
}

/**
 * Get cookie value by name
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue ? decodeURIComponent(cookieValue) : null;
  }
  
  return null;
}

/**
 * Set cookie with enhanced mobile compatibility
 */
export function setCookie(
  name: string, 
  value: string, 
  options: CookieOptions = {}
): void {
  if (typeof document === 'undefined') return;
  
  const {
    expires,
    maxAge,
    domain,
    path = '/',
    secure = isSecureContext(),
    sameSite = 'lax',
    httpOnly = false
  } = options;
  
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  
  if (maxAge !== undefined) {
    cookieString += `; Max-Age=${maxAge}`;
  } else if (expires) {
    const expiresDate = expires instanceof Date ? expires : new Date(expires);
    cookieString += `; Expires=${expiresDate.toUTCString()}`;
  }
  
  if (domain) {
    cookieString += `; Domain=${domain}`;
  }
  
  cookieString += `; Path=${path}`;
  
  if (secure) {
    cookieString += `; Secure`;
  }
  
  cookieString += `; SameSite=${sameSite}`;
  
  // Note: HttpOnly cannot be set from client-side JavaScript
  // It's included here for completeness but will be ignored by browsers
  
  try {
    document.cookie = cookieString;
  } catch (error) {
    console.warn('Failed to set cookie:', error);
  }
}

/**
 * Remove cookie by name
 */
export function removeCookie(
  name: string, 
  options: Pick<CookieOptions, 'domain' | 'path'> = {}
): void {
  setCookie(name, '', {
    ...options,
    expires: new Date(0),
    maxAge: 0
  });
}

/**
 * Check if all cookies are available (for mobile compatibility)
 */
export function areCookiesEnabled(): boolean {
  if (typeof document === 'undefined') return false;
  
  try {
    const testCookie = 'test_cookies_enabled';
    setCookie(testCookie, 'test', { maxAge: 1 });
    const enabled = getCookie(testCookie) === 'test';
    removeCookie(testCookie);
    return enabled;
  } catch {
    return false;
  }
}

/**
 * Get all cookies as an object
 */
export function getAllCookies(): Record<string, string> {
  if (typeof document === 'undefined') return {};
  
  const cookies: Record<string, string> = {};
  
  if (document.cookie) {
    document.cookie.split(';').forEach(cookie => {
      const [name, ...valueParts] = cookie.trim().split('=');
      if (name && valueParts.length > 0) {
        const value = valueParts.join('=');
        cookies[decodeURIComponent(name)] = decodeURIComponent(value);
      }
    });
  }
  
  return cookies;
}

/**
 * Check if the current context is secure (HTTPS)
 */
export function isSecureContext(): boolean {
  const win = typeof window !== 'undefined' ? window : undefined;
  if (!win) return false;
  
  // Check if we're in a secure context
  if (typeof win.isSecureContext === 'boolean') {
    return win.isSecureContext;
  }
  
  // Fallback: check protocol
  return win.location?.protocol === 'https:';
}

/**
 * Mobile-specific cookie settings
 */
export function getMobileCookieDefaults(): CookieOptions {
  return {
    secure: isSecureContext(),
    sameSite: 'lax', // Better mobile compatibility than 'strict'
    path: '/',
    // Longer expiry for mobile apps to reduce re-authentication
    maxAge: 30 * 24 * 60 * 60, // 30 days
  };
}

/**
 * Set authentication cookie with mobile optimizations
 */
export function setAuthCookie(token: string, remember: boolean = false): void {
  const options = getMobileCookieDefaults();
  
  if (!remember) {
    // Session cookie (expires when browser closes)
    delete options.maxAge;
  }
  
  setCookie('session', token, options);
}

/**
 * Clear all authentication-related cookies
 */
export function clearAuthCookies(): void {
  const authCookies = ['session', 'csrf-token', 'user-preferences'];
  const options = { path: '/' };
  
  authCookies.forEach(name => {
    removeCookie(name, options);
  });
}