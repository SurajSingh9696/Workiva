import { NextResponse, type NextRequest } from 'next/server';

// Rate limiting storage (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// CSRF protection uses double-submit cookies (header must match cookie)

// Security headers configuration
const securityHeaders = {
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://vercel.live wss://vercel.live https://we2plp04mq.ufs.sh",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ')
};

// Rate limiting configuration
const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // per IP
  authMaxRequests: 5, // for auth endpoints
  authWindowMs: 15 * 60 * 1000 // 15 minutes for auth
};

// Protected routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/employer-dashboard', 
  '/admin',
  '/api/protected'
];

// Authentication routes
const AUTH_ROUTES = ['/login', '/register'];

// API routes that need CSRF protection
const API_ROUTES = ['/api/auth'];

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const remoteAddr = request.headers.get('x-vercel-forwarded-for');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }

  if (remoteAddr) {
    return remoteAddr;
  }
  
  // Fallback - in Edge Runtime, request.ip is not available
  return request.nextUrl.hostname || 'unknown';
}

function isRateLimited(ip: string, isAuthRoute: boolean = false): boolean {
  const now = Date.now();
  const key = `${ip}:${isAuthRoute ? 'auth' : 'general'}`;
  const limit = isAuthRoute ? RATE_LIMIT.authMaxRequests : RATE_LIMIT.maxRequests;
  const window = isAuthRoute ? RATE_LIMIT.authWindowMs : RATE_LIMIT.windowMs;
  
  const stored = rateLimitStore.get(key);
  
  if (!stored || now > stored.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + window });
    return false;
  }
  
  if (stored.count >= limit) {
    return true;
  }
  
  stored.count++;
  return false;
}

function generateCSRFToken(): string {
  // Use Web Crypto API instead of Node.js crypto for Edge Runtime compatibility
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

function validateCSRFToken(headerToken: string | null, cookieToken: string | null): boolean {
  if (!headerToken || !cookieToken) return false;
  return headerToken === cookieToken;
}

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some(route => pathname.startsWith(route));
}

function isAPIRoute(pathname: string): boolean {
  return API_ROUTES.some(route => pathname.startsWith(route));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getClientIP(request);
  
  // Create response
  const response = NextResponse.next();
  
  // Add security headers to all responses
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Rate limiting
  const isAuth = isAuthRoute(pathname);
  if (isRateLimited(ip, isAuth)) {
    return new NextResponse(
      JSON.stringify({ 
        error: 'Too many requests',
        message: isAuth 
          ? 'Too many login attempts. Please try again later.' 
          : 'Rate limit exceeded. Please try again later.'
      }),
      { 
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '900', // 15 minutes
          ...Object.fromEntries(Object.entries(securityHeaders))
        }
      }
    );
  }

  // Get session cookie
  const sessionCookie = request.cookies.get('session');
  
  // Handle protected routes
  if (isProtectedRoute(pathname)) {
    if (!sessionCookie?.value) {
      // Redirect to login for protected routes
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // Handle API routes - CSRF protection (double-submit cookie)
  if (isAPIRoute(pathname) && request.method !== 'GET') {
    const csrfHeader = request.headers.get('x-csrf-token');
    const csrfCookie = request.cookies.get('csrf-token')?.value || null;
    const sessionId = sessionCookie?.value;
    
    if (!sessionId || !validateCSRFToken(csrfHeader, csrfCookie)) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'CSRF token missing or invalid',
          message: 'Request blocked for security reasons'
        }),
        { 
          status: 403,
          headers: {
            'Content-Type': 'application/json',
            ...Object.fromEntries(Object.entries(securityHeaders))
          }
        }
      );
    }
  }
  
  // Ensure CSRF cookie exists for authenticated users
  if (sessionCookie?.value && !request.cookies.get('csrf-token')?.value) {
    const csrfToken = generateCSRFToken();
    response.cookies.set('csrf-token', csrfToken, {
      httpOnly: false,
      secure: request.nextUrl.protocol === 'https:',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24
    });
    response.headers.set('X-CSRF-Token', csrfToken);
  }

  // Mobile-friendly headers
  if (request.headers.get('user-agent')?.toLowerCase().includes('mobi')) {
    response.headers.set('X-Mobile-Optimized', 'true');
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
  }

  // Add security headers for mobile apps
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};