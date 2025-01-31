import { NextResponse } from 'next/server';

// Define public paths that don't require authentication
const PUBLIC_PATHS = ['/auth/login', '/auth/register', '/auth/forgot-password'];

export function middleware(request) {
  // Get the path from the request URL
  const path = request.nextUrl.pathname;
  
  // Get token from cookies or local storage
  const token = request.cookies.get('authToken')?.value || 
                request.headers.get('authorization')?.split(' ')[1];

  // Check if it's a public path
  const isPublicPath = PUBLIC_PATHS.includes(path);

  // If there's no token and the path isn't public, redirect to login
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // If there's a token and trying to access auth pages, redirect to home
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Configure which paths should trigger the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};