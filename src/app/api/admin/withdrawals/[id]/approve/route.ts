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
      .select('*, user:users(*)')
      .eq('id', withdrawalId)
      .single();

    if (fetchError || !withdrawal) {
      return NextResponse.json({ success: false, error: 'Withdrawal not found' }, { status: 404 });
    }

    if (withdrawal.status !== 'pending') {
      return NextResponse.json({ success: false, error: 'Withdrawal already processed' }, { status: 400 });
    }

    // 2. Update status to completed
    const { error: updateError } = await supabaseAdmin
      .from('withdrawals')
      .update({ status: 'completed' })
      .eq('id', withdrawalId);

    if (updateError) throw updateError;

    // 3. Update wallet records
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
          total_withdrawn: (wallet.total_withdrawn || 0) + (withdrawal.amount || 0)
        })
        .eq('user_id', withdrawal.user_id);
    }

    // 4. Notify user
    await supabaseAdmin.from('notifications').insert({
      user_id: withdrawal.user_id,
      title: 'Withdrawal Approved! ✅',
      body: `Your withdrawal for ${withdrawal.amount} PKR has been processed and sent.`,
      type: 'withdrawal_approved',
    });

    return NextResponse.json({ success: true, message: 'Withdrawal approved and funds released' });

  } catch (error: any) {
    console.error('Withdrawal approval error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
