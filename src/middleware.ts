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

  const isUserPath = pathname.startsWith('/dashboard') || pathname === '/payment' || pathname === '/pending-approval';
  const isAdminPath = pathname.startsWith('/admin');

  // API Route Protection
  if (pathname.startsWith('/api/') && 
      !pathname.startsWith('/api/auth/') && 
      !pathname.startsWith('/api/admin/login') && 
      !pathname.startsWith('/api/admin/register')) {
    
    // Admin API access - requires isAdmin
    if (pathname.startsWith('/api/admin/') && !isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin Only' }, { status: 403 });
    }

    // Standard User API access - requires isAuthUser
    if (!pathname.startsWith('/api/admin/') && !isAuthUser && !isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
  }

  // User Dashboard Boundary
  if (isUserPath) {
    if (!isAuthUser) {
      return redirectTo('/login');
    }

    const { status } = user.user_metadata;

    // Strict block: Admin cannot perform user tasks in user UI by default to avoid mixing
    if (isAdmin && !isAuthUser) {
      return redirectTo('/admin');
    }

    // Pending User Logic
    if (status === 'pending') {
      if (pathname.startsWith('/dashboard')) {
        return redirectTo('/pending-approval');
      }
    } else if (status === 'active') {
      if (pathname === '/pending-approval' || pathname === '/payment') {
        return redirectTo('/dashboard');
      }
    }
  }

  // Admin Dashboard Boundary
  if (isAdminPath) {
    if (pathname === '/admin/login' || pathname === '/admin/register') {
      if (isAdmin) {
        return redirectTo('/admin');
      }
      return supabaseResponse;
    }

    if (!isAdmin) {
      // If they are a normal user, don't let them see admin login either if they try to hack
      return redirectTo('/admin/login');
    }
  }

  // Auth Path Protection
  if (authPaths.some(path => pathname.startsWith(path))) {
    if (isAuthUser) {
      return redirectTo('/dashboard');
    }
    if (isAdmin) {
      return redirectTo('/admin');
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
