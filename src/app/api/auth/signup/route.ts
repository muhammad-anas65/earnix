import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateReferralCode } from '@/lib/utils';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import AdminAlertService from '@/lib/alerts';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, password, planId, referralCode } = body;

    if (!name || !email || !phone || !password || !planId) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .or(`email.eq.${email},phone.eq.${phone}`)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email or phone already exists' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabaseClient = createClient(cookieStore);

    // Temporarily set status for metadata based on plan
    const initialStatus = planId === 'free' || planId === 'Free Plan' ? 'active' : 'pending';

    const { data: authData, error: authError } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone,
          status: initialStatus,
        }
      }
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { success: false, error: authError?.message || 'Failed to sign up via Supabase Auth' },
        { status: 400 }
      );
    }

    // Refined plan lookup: Detect if planId is a UUID or a Name string
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(planId);
    
    let planQuery = supabaseAdmin.from('plans').select('*');
    if (isUuid) {
      planQuery = planQuery.eq('id', planId);
    } else {
      planQuery = planQuery.eq('name', planId);
    }
    
    const { data: plan, error: planError } = await planQuery.maybeSingle();

    if (!plan) {
      console.error('Plan not found for ID/Name:', planId, planError);
      return NextResponse.json(
        { success: false, error: 'Invalid plan selected. Please try again or contact support.' },
        { status: 400 }
      );
    }

    let referredById = null;
    if (referralCode) {
      const { data: referrer } = await supabaseAdmin
        .from('users')
        .select('id, status')
        .eq('referral_code', referralCode)
        .eq('status', 'active')
        .single();
      
      if (referrer) {
        if (referrer.id === authData.user.id) {
           AdminAlertService.suspiciousActivity({ name: name, email: email }, { 
             type: 'Referral Abuse', 
             risk: 'HIGH', 
             reason: 'Self-referral attempt detected' 
           });
        } else {
           referredById = referrer.id;
        }
      }
    }

    const userReferralCode = generateReferralCode();

    const isFreePlan = plan.price === 0;
    const userStatus = isFreePlan ? 'active' : 'pending';

    const { data: newUser, error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authData.user.id,
        name,
        email,
        phone,
        password_hash: '', // Handled by Supabase Auth
        plan_id: plan.id,
        referral_code: userReferralCode,
        referred_by: referredById,
        status: userStatus,
      })
      .select()
      .single();

    if (userError || !newUser) {
      console.error('User profile insert error:', userError);
      // Rollback Auth user if custom insert fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { success: false, error: 'Failed to create user profile: ' + (userError?.message || 'Unknown error') },
        { status: 500 }
      );
    }

    // Create Wallet
    const { error: walletError } = await supabaseAdmin.from('wallets').insert({
      user_id: newUser.id,
      available_points: 0,
      pending_points: 0,
      locked_points: 0,
      total_earned: 0,
      total_withdrawn: 0,
    });

    if (walletError) {
      console.error('Wallet creation error:', walletError);
      // We don't rollback here yet, but we log it. Ideally we should.
    }

    if (referredById) {
      const { error: refError } = await supabaseAdmin.from('referrals').insert({
        referrer_id: referredById,
        referred_id: newUser.id,
        status: 'pending',
        tasks_completed: 0,
        reward_sent: false,
        reward_points: plan.referral_reward || 0,
      });
      if (refError) console.error('Referral record error:', refError);
    }

    // Send Alert to Google Chat
    AdminAlertService.newUser({
      ...newUser,
      plan_id: plan.display_name
    });

    // Audit pending queue size
    AdminAlertService.checkPendingThreshold();

    return NextResponse.json({
      success: true,
      data: {
        uid: newUser.id,
        email: newUser.email,
        status: newUser.status,
        needsPayment: !isFreePlan,
      },
      message: 'Account created successfully',
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
