import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from './lib/auth';
import { createServerClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authPaths   = ['/login', '/signup', '/forgot-password'];
  const isUserPath  = pathname.startsWith('/dashboard') || pathname === '/payment' || pathname === '/pending-approval';
  const isAdminPath = pathname.startsWith('/admin');
  const isApiPath   = pathname.startsWith('/api/');

  // ── START with a mutable copy of the request headers ──────────────────────
  const requestHeaders = new Headers(request.headers);

  // ── BUILD supabase response so cookies are refreshed ──────────────────────
  let supabaseResponse = NextResponse.next({ request: { headers: requestHeaders } });

  let supabaseUser: { id: string; user_metadata: Record<string, any> } | null = null;

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() { return request.cookies.getAll(); },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => requestHeaders.set(`cookie`, `${name}=${value}`));
            supabaseResponse = NextResponse.next({ request: { headers: requestHeaders } });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      });
      const { data: { user } } = await supabase.auth.getUser();
      supabaseUser = user as any;
    } catch {
      // Supabase not configured — continue without session
    }
  }

  // ── LEGACY session cookie (admin JWT) ─────────────────────────────────────
  const sessionToken  = request.cookies.get('session')?.value;
  const legacySession = sessionToken ? await verifySession(sessionToken) : null;

  const isAdmin    = legacySession?.role === 'admin';
  const isAuthUser = !!supabaseUser;
  const currentUserId = supabaseUser?.id || legacySession?.userId;

  // ── HELPER: redirect while preserving refreshed cookies ───────────────────
  const redirectTo = (url: string) => {
    const res = NextResponse.redirect(new URL(url, request.url));
    supabaseResponse.cookies.getAll().forEach(({ name, value, ...opts }) =>
      res.cookies.set(name, value, opts as any)
    );
    return res;
  };

  // ─────────────────────────────────────────────────────────────────────────
  // API ROUTE PROTECTION
  // ─────────────────────────────────────────────────────────────────────────
  if (
    isApiPath &&
    !pathname.startsWith('/api/auth/') &&
    !pathname.startsWith('/api/admin/login') &&
    !pathname.startsWith('/api/admin/register')
  ) {
    // Admin-only API
    if (pathname.startsWith('/api/admin/') && !isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin Only' }, { status: 403 });
    }

    // User API — must be logged in via Supabase or legacy admin session
    if (!pathname.startsWith('/api/admin/') && !isAuthUser && !isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // USER DASHBOARD BOUNDARY
  // ─────────────────────────────────────────────────────────────────────────
  if (isUserPath) {
    if (!isAuthUser) return redirectTo('/login');

    const status = supabaseUser?.user_metadata?.status;

    if (status === 'pending') {
      if (pathname.startsWith('/dashboard')) return redirectTo('/pending-approval');
    } else if (status === 'active') {
      if (pathname === '/pending-approval' || pathname === '/payment') return redirectTo('/dashboard');
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ADMIN DASHBOARD BOUNDARY
  // ─────────────────────────────────────────────────────────────────────────
  if (isAdminPath) {
    if (pathname === '/admin/login' || pathname === '/admin/register') {
      if (isAdmin) return redirectTo('/admin');
      return supabaseResponse;
    }
    if (!isAdmin) return redirectTo('/admin/login');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // AUTH PATH PROTECTION (already logged in)
  // ─────────────────────────────────────────────────────────────────────────
  if (authPaths.some(p => pathname.startsWith(p))) {
    if (isAuthUser) return redirectTo('/dashboard');
    if (isAdmin)    return redirectTo('/admin');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // FORWARD userId TO API ROUTE HANDLERS via REQUEST header
  // This is the critical fix: we inject into the *request* headers so that
  // route.ts files can read it with request.headers.get('x-user-id').
  // ─────────────────────────────────────────────────────────────────────────
  if (currentUserId) {
    // Build a brand-new response that passes the modified request headers
    const headersWithUserId = new Headers(requestHeaders);
    headersWithUserId.set('x-user-id', currentUserId);

    const finalResponse = NextResponse.next({ request: { headers: headersWithUserId } });

    // Copy any auth cookies from supabaseResponse into the final response
    supabaseResponse.cookies.getAll().forEach(({ name, value, ...opts }) =>
      finalResponse.cookies.set(name, value, opts as any)
    );

    return finalResponse;
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
    '/pending-approval',
  ],
};
