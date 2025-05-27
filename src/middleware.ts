import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  // if already logged in skip /login and /signup
  const isAuthRoute = ['/login', '/signup'].includes(pathname);
  if (sessionCookie && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // protected routes
  const isProtectedRoute = ['/profile', '/recipes/new'].includes(pathname);
  if (!sessionCookie && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // admin routes
  const isAdminRoute = pathname.startsWith('/admin');
  if (isAdminRoute) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile',
    '/login',
    '/signup',
    '/recipes/new',
    '/admin/:path*'
  ]
};