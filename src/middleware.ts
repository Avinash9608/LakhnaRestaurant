import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-fallback-secret');

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session');

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/admin-login', request.url));
    }

    try {
      const { payload } = await jwtVerify(sessionCookie.value, secret);
      if (payload.role !== 'admin') {
        throw new Error('Not an admin');
      }
      // Valid session, continue to the dashboard
      return NextResponse.next();
    } catch (err) {
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL('/admin-login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
