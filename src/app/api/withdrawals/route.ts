import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { amount, method, recipientName, recipientPhone } = body;

    if (!amount || !method || !recipientName || !recipientPhone) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    const { data: user } = await supabaseAdmin
      .from('users')
      .select('*, plan:plans(*)')
      .eq('id', userId)
      .single();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.status !== 'active') {
      return NextResponse.json(
        { success: false, error: 'Account is not active' },
        { status: 403 }
      );
    }

    const { data: wallet } = await supabaseAdmin
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!wallet) {
      return NextResponse.json(
        { success: false, error: 'Wallet not found' },
        { status: 404 }
      );
    }

    const minWithdrawal = user.plan?.withdrawal_threshold || 800;
    const pointsNeeded = Math.ceil((amount / 10) * 100);

    if (amount < minWithdrawal) {
      return NextResponse.json(
        { success: false, error: `Minimum withdrawal is ${minWithdrawal} PKR` },
        { status: 400 }
      );
    }

    if (wallet.available_points < pointsNeeded) {
      return NextResponse.json(
        { success: false, error: 'Insufficient points balance' },
        { status: 400 }
      );
    }

    const { data: pendingWithdrawals } = await supabaseAdmin
      .from('withdrawals')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'pending');

    if (pendingWithdrawals && pendingWithdrawals.length > 0) {
      return NextResponse.json(
        { success: false, error: 'You already have a pending withdrawal request' },
        { status: 400 }
      );
    }

    const { data: withdrawal, error: withdrawalError } = await supabaseAdmin
      .from('withdrawals')
      .insert({
        user_id: userId,
        amount,
        points_used: pointsNeeded,
        method,
        recipient_name: recipientName,
        recipient_phone: recipientPhone,
        status: 'pending',
      })
      .select()
      .single();

    if (withdrawalError || !withdrawal) {
      return NextResponse.json(
        { success: false, error: 'Failed to create withdrawal request' },
        { status: 500 }
      );
    }

    await supabaseAdmin
      .from('wallets')
      .update({
        available_points: wallet.available_points - pointsNeeded,
        locked_points: wallet.locked_points + pointsNeeded,
      })
      .eq('user_id', userId);

    await supabaseAdmin.from('notifications').insert({
      user_id: userId,
      title: 'Withdrawal Request Submitted',
      body: `Your withdrawal request for ${amount} PKR has been submitted.`,
      type: 'withdrawal',
    });

    return NextResponse.json({
      success: true,
      data: {
        withdrawal_id: withdrawal.id,
        amount,
        points_used: pointsNeeded,
        status: 'pending',
      },
      message: 'Withdrawal request submitted successfully!',
    });

  } catch (error) {
    console.error('Withdrawal error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
