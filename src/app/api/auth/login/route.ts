import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabaseClient = createClient(cookieStore);

    const { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { success: false, error: authError?.message || 'Invalid email or password' },
        { status: 401 }
      );
    }

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select(`
        *,
        plan:plans(*),
        wallet:wallets(*)
      `)
      .eq('id', authData.user.id)
      .single();

    if (error || !user) {
      console.error('Login: User profile not found for ID:', authData.user.id, 'Error:', error);
      return NextResponse.json(
        { success: false, error: 'User profile not found. Please contact support.' },
        { status: 404 }
      );
    }

    await supabaseAdmin
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', user.id);

    delete user.password_hash;

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          status: user.status,
          plan: user.plan,
          referral_code: user.referral_code,
        },
        wallet: user.wallet,
      },
      message: 'Login successful',
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
