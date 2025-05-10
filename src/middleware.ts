import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  // Auth routes that logged-in users shouldn't access
  const isAuthRoute = ['/login', '/signup'].includes(pathname);
  
  if (sessionCookie && isAuthRoute) {
    // If logged in and trying to access login/signup, redirect to dashboard
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Protected routes that require authentication
  const isProtectedRoute = ['/dashboard'].includes(pathname);
  
  if (!sessionCookie && isProtectedRoute) {
    // If not logged in and trying to access protected route, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protected routes
    '/dashboard',
    // Auth routes
    '/login',
    '/signup'
  ]
};