import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const withdrawalId = params.id;

    // 1. Fetch withdrawal record
    const { data: withdrawal, error: fetchError } = await supabaseAdmin
      .from('withdrawals')
      .select('*')
      .eq('id', withdrawalId)
      .single();

    if (fetchError || !withdrawal) {
      return NextResponse.json({ success: false, error: 'Withdrawal not found' }, { status: 404 });
    }

    if (withdrawal.status !== 'pending') {
      return NextResponse.json({ success: false, error: 'Withdrawal already processed' }, { status: 400 });
    }

    // 2. Update status to rejected
    const { error: updateError } = await supabaseAdmin
      .from('withdrawals')
      .update({ status: 'rejected' })
      .eq('id', withdrawalId);

    if (updateError) throw updateError;

    // 3. Refund points back to available_points
    const { data: wallet } = await supabaseAdmin
      .from('wallets')
      .select('*')
      .eq('user_id', withdrawal.user_id)
      .single();

    if (wallet) {
      await supabaseAdmin
        .from('wallets')
        .update({
          locked_points: Math.max(0, wallet.locked_points - withdrawal.points_used),
          available_points: wallet.available_points + withdrawal.points_used
        })
        .eq('user_id', withdrawal.user_id);
    }

    // 4. Notify user
    await supabaseAdmin.from('notifications').insert({
      user_id: withdrawal.user_id,
      title: 'Withdrawal Rejected ❌',
      body: `Your withdrawal for ${withdrawal.amount} PKR was rejected and points have been refunded to your wallet.`,
      type: 'withdrawal_rejected',
    });

    return NextResponse.json({ success: true, message: 'Withdrawal rejected and points refunded' });

  } catch (error: any) {
    console.error('Withdrawal rejection error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
