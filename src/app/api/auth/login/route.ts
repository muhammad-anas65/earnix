import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createClient } from '@/utils/supabase/server';
import { generateReferralCode } from '@/lib/utils';
import { cookies } from 'next/headers';
import AdminAlertService from '@/lib/alerts';

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

    // Step 1: Authenticate with Supabase Auth
    const { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      if (email) AdminAlertService.trackFailedLogin(email);
      return NextResponse.json(
        { success: false, error: authError?.message || 'Invalid email or password' },
        { status: 401 }
      );
    }

    const authUser = authData.user;

    // Step 2: Fetch the user profile from our users table
    let { data: user, error: profileError } = await supabaseAdmin
      .from('users')
      .select(`*, plan:plans(*), wallet:wallets(*)`)
      .eq('id', authUser.id)
      .single();

    // Step 3: If profile is missing, auto-create it (recovery for broken signups)
    if (profileError || !user) {
      console.warn('Login: Profile missing for auth user, auto-creating...', authUser.id);

      // Get the default free plan
      const { data: freePlan } = await supabaseAdmin
        .from('plans')
        .select('*')
        .or('price.eq.0,name.ilike.%free%')
        .order('price', { ascending: true })
        .limit(1)
        .single();

      const referralCode = generateReferralCode();
      const userName = authUser.user_metadata?.name
        || authUser.user_metadata?.full_name
        || email.split('@')[0];
      const userPhone = authUser.user_metadata?.phone || '';

      // Insert missing profile
      const { data: newUser, error: insertError } = await supabaseAdmin
        .from('users')
        .insert({
          id: authUser.id,
          name: userName,
          email: authUser.email,
          phone: userPhone,
          password_hash: '',
          plan_id: freePlan?.id || null,
          referral_code: referralCode,
          status: 'active',
        })
        .select()
        .single();

      if (insertError || !newUser) {
        console.error('Login: Failed to auto-create profile:', insertError);
        return NextResponse.json(
          { success: false, error: 'Account setup incomplete. Please contact support.' },
          { status: 500 }
        );
      }

      // Create wallet if missing
      await supabaseAdmin.from('wallets').upsert({
        user_id: authUser.id,
        available_points: 0,
        pending_points: 0,
        locked_points: 0,
        total_earned: 0,
        total_withdrawn: 0,
      }, { onConflict: 'user_id' });

      // Re-fetch full profile with relations
      const { data: repairedUser } = await supabaseAdmin
        .from('users')
        .select(`*, plan:plans(*), wallet:wallets(*)`)
        .eq('id', authUser.id)
        .single();

      user = repairedUser;
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Failed to load user profile. Please try again.' },
        { status: 500 }
      );
    }

    // Step 4: Update last login timestamp and IP
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    await supabaseAdmin
      .from('users')
      .update({ 
        last_login_at: new Date().toISOString(),
        ip_address: ip
      })
      .eq('id', user.id);

    // Remove sensitive field
    const { password_hash, ...safeUser } = user;

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
