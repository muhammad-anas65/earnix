import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .update({ status: 'active' })
      .eq('id', userId)
      .select()
      .single();

    if (userError || !user) {
      return NextResponse.json({ success: false, error: 'Failed to approve user' }, { status: 500 });
    }

    // Optionally award bonus points here if specified in plan
    const { data: plan } = await supabaseAdmin.from('plans').select('*').eq('id', user.plan_id).single();
    if (plan && plan.bonus_points > 0) {
      const { data: wallet } = await supabaseAdmin.from('wallets').select('*').eq('user_id', userId).single();
      if (wallet) {
        await supabaseAdmin.from('wallets')
          .update({
            available_points: wallet.available_points + plan.bonus_points,
            total_earned: wallet.total_earned + plan.bonus_points
          })
          .eq('user_id', userId);
      }
    }

    await supabaseAdmin.from('notifications').insert({
      user_id: userId,
      title: 'Account Approved! 🚀',
      body: 'Your account has been approved. You can now start completing tasks and earning points.',
      type: 'approval',
    });

    return NextResponse.json({ success: true, message: 'User approved successfully' });

  } catch (error) {
    console.error('Admin approval error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
