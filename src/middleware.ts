import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

export async function middleware(request: NextRequest) {
  if (!JWT_SECRET) {
    console.error('JWT_SECRET is not defined, redirecting to login.');
    return NextResponse.redirect(new URL('/admin-login', request.url));
  }

  const secret = new TextEncoder().encode(JWT_SECRET);
  const sessionCookie = request.cookies.get('session');

  const protectedPaths = ['/dashboard'];
  const isProtected = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path));

  if (isProtected) {
    if (!sessionCookie?.value) {
      return NextResponse.redirect(new URL('/admin-login', request.url));
    }

    try {
      const { payload } = await jwtVerify(sessionCookie.value, secret);
      if (payload.role !== 'admin') {
        throw new Error('Not an admin');
      }
      
      // Valid session, continue to the requested page
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', payload.userId as string);
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

    } catch (err) {
      // Invalid token, clear the cookie and redirect to login
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
