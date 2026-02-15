import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/features/auth/server/auth.queries';

export async function GET(request: NextRequest) {
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

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Session validation error:', error);
    return NextResponse.json(
      { 
        error: 'Validation failed',
        message: 'Unable to validate session'
      },
      { status: 500 }
    );
  }
}