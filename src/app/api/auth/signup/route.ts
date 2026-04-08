import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabase';
import { generateReferralCode } from '@/lib/utils';
import { createSession } from '@/lib/auth';

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

    const passwordHash = await bcrypt.hash(password, 12);

    const { data: plan } = await supabaseAdmin
      .from('plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (!plan) {
      return NextResponse.json(
        { success: false, error: 'Invalid plan selected' },
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
        referredById = referrer.id;
      }
    }

    const userReferralCode = generateReferralCode();

    const { data: newUser, error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        name,
        email,
        phone,
        password_hash: passwordHash,
        plan_id: planId,
        referral_code: userReferralCode,
        referred_by: referredById,
        status: 'pending',
      })
      .select()
      .single();

    if (userError || !newUser) {
      return NextResponse.json(
        { success: false, error: 'Failed to create user' },
        { status: 500 }
      );
    }

    await supabaseAdmin.from('wallets').insert({
      user_id: newUser.id,
      available_points: 0,
      pending_points: 0,
      locked_points: 0,
      total_earned: 0,
      total_withdrawn: 0,
    });

    if (referredById) {
      await supabaseAdmin.from('referrals').insert({
        referrer_id: referredById,
        referred_id: newUser.id,
        status: 'pending',
        tasks_completed: 0,
        reward_sent: false,
        reward_points: plan.referral_reward,
      });
    }

    const token = await createSession({
      userId: newUser.id,
      email: newUser.email,
      role: 'user',
    });

    const response = NextResponse.json({
      success: true,
      data: {
        uid: newUser.id,
        email: newUser.email,
        status: newUser.status,
        needsPayment: plan.price > 0,
      },
      message: 'Account created successfully',
    });

    response.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
