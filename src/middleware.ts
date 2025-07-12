import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session');

  const protectedPaths = ['/dashboard'];
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtected) {
    if (!JWT_SECRET) {
      console.error('JWT_SECRET is not defined. Cannot verify session.');
      return NextResponse.redirect(new URL('/admin-login', request.url));
    }

    if (!sessionCookie?.value) {
      console.log('No session cookie found. Redirecting to login.');
      return NextResponse.redirect(new URL('/admin-login', request.url));
    }

    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(sessionCookie.value, secret);

      if (payload.role !== 'admin') {
        console.log('User is not an admin. Redirecting to login.');
        return NextResponse.redirect(new URL('/admin-login', request.url));
      }
      
      // Valid session and role, allow access
      return NextResponse.next();

    } catch (err) {
      console.log('JWT verification failed:', err);
      // Invalid token, redirect to login
      const response = NextResponse.redirect(new URL('/admin-login', request.url));
      response.cookies.delete('session');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
