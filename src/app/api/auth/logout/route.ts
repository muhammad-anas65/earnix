import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();

  // Attempt Supabase sign-out (may fail if Supabase is not configured)
  try {
    const supabaseClient = createClient(cookieStore);
    await supabaseClient.auth.signOut();
  } catch (e) {
    console.error('Supabase signOut error (non-fatal):', e);
  }

  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully',
  });

  // Delete legacy session cookie
  response.cookies.delete('session');

  // Explicitly clear all Supabase auth cookies from the response
  const allCookies = cookieStore.getAll();
  for (const cookie of allCookies) {
    if (cookie.name.startsWith('sb-') && cookie.name.includes('auth-token')) {
      response.cookies.delete(cookie.name);
    }
  }

  return response;
}
