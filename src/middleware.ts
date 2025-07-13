'use server';

import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import {jwtVerify} from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session');
  const loginUrl = new URL('/admin-login', request.url);

  if (!JWT_SECRET) {
    console.error('JWT_SECRET is not defined. Cannot verify session.');
    return NextResponse.redirect(loginUrl);
  }

  if (!sessionCookie?.value) {
    return NextResponse.redirect(loginUrl);
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const {payload} = await jwtVerify(sessionCookie.value, secret);

    if (payload.role === 'admin') {
      return NextResponse.next();
    }
    
    // If role is not admin, redirect to login
    return NextResponse.redirect(loginUrl);
  } catch (err) {
    // If token is invalid (expired, malformed, etc.), redirect to login
    console.log('JWT verification failed, redirecting to login.');
    const response = NextResponse.redirect(loginUrl);
    // Clear the invalid cookie
    response.cookies.delete('session');
    return response;
  }
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
