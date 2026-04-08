import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from './lib/auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Paths that require authentication
  const protectedPaths = ['/dashboard', '/api/users', '/api/tasks', '/api/wallet', '/api/withdrawals', '/api/payments'];
  
  // Paths that should NOT be accessed if logged in
  const authPaths = ['/login', '/signup'];

  const sessionToken = request.cookies.get('session')?.value;
  const session = sessionToken ? verifySession(sessionToken) : null;

  // API protection
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/')) {
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
  }

  // Dashboard protection
  if (pathname.startsWith('/dashboard') || pathname === '/payment' || pathname === '/pending-approval') {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Redirect logged in users away from auth pages
  if (authPaths.some(path => pathname.startsWith(path))) {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  const response = NextResponse.next();
  
  // Inject userId into headers for API routes to use internally
  if (session) {
    response.headers.set('x-user-id', session.userId);
  }

  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/api/:path*',
    '/login',
    '/signup',
    '/payment',
    '/pending-approval'
  ],
};
