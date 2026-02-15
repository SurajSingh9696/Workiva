import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/features/auth/server/auth.queries';
import { createSessionAndSetCookies } from '@/features/auth/server/use-cases/sessions';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { 
          error: 'No valid session',
          message: 'User not authenticated'
        },
        { status: 401 }
      );
    }

    // Create new session (this will refresh the existing one)
    await createSessionAndSetCookies(user.id as any);
    
    // Generate new CSRF token
    const csrfToken = crypto.randomBytes(32).toString('hex');
    
    const response = NextResponse.json({
      success: true,
      message: 'Session refreshed successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

    // Set the new CSRF token in header
    response.headers.set('X-CSRF-Token', csrfToken);
    
    return response;
  } catch (error) {
    console.error('Session refresh error:', error);
    return NextResponse.json(
      { 
        error: 'Refresh failed',
        message: 'Unable to refresh session'
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-CSRF-Token',
    },
  });
}