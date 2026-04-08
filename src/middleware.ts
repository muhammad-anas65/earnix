import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from './lib/auth';
import { updateSession } from './utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protectedPaths = ['/dashboard', '/api/users', '/api/tasks', '/api/wallet', '/api/withdrawals', '/api/payments'];
  const authPaths = ['/login', '/signup', '/forgot-password'];

  const { supabaseResponse, user } = await updateSession(request);
  
  const sessionToken = request.cookies.get('session')?.value;
  const legacySession = sessionToken ? await verifySession(sessionToken) : null;

  const isAdmin = legacySession?.role === 'admin';
  const isAuthUser = !!user;
  const currentUserId = user?.id || legacySession?.userId;

  const redirectTo = (url: string) => {
    const res = NextResponse.redirect(new URL(url, request.url));
    supabaseResponse.headers.forEach((value, key) => {
      res.headers.append(key, value);
    });
    return res;
  };

  if (pathname.startsWith('/api/') && 
      !pathname.startsWith('/api/auth/') && 
      !pathname.startsWith('/api/admin/login') && 
      !pathname.startsWith('/api/admin/register')) {
    if (!isAuthUser && !isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
  }

  if (pathname.startsWith('/dashboard') || pathname === '/payment' || pathname === '/pending-approval') {
    if (!isAuthUser) {
      return redirectTo('/login');
    }
  }

  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login' || pathname === '/admin/register') {
      if (isAdmin) {
        return redirectTo('/admin');
      }
      return supabaseResponse;
    }

    if (!isAdmin) {
      return redirectTo('/admin/login');
    }
  }

  if (authPaths.some(path => pathname.startsWith(path))) {
    if (isAuthUser) {
      return redirectTo('/dashboard');
    }
  }

  if (currentUserId) {
    supabaseResponse.headers.set('x-user-id', currentUserId);
  }

  return supabaseResponse;
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
