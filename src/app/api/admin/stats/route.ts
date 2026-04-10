import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // 1. Total Users
    const { count: totalUsers } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true });

    // 2. Active vs Pending
    const { count: activeUsers } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    const { count: pendingUsers } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // 3. Total Points
    const { data: walletStats } = await supabaseAdmin
      .from('wallets')
      .select('available_points, pending_points');
    
    const totalPoints = walletStats?.reduce((acc, curr) => acc + (curr.available_points || 0) + (curr.pending_points || 0), 0) || 0;

    // 4. Approved Revenue (Approved Payments)
    // We assume payment_submissions has an 'amount' or the plan price
    const { data: successfulPayments } = await supabaseAdmin
      .from('payment_submissions')
      .select('amount')
      .eq('status', 'approved');
    
    const totalRevenue = successfulPayments?.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) || 0;

    // 5. Total Withdrawals (Completed)
    const { data: successfulWithdrawals } = await supabaseAdmin
        .from('withdrawals')
        .select('amount')
        .eq('status', 'completed');
    
    const totalWithdrawals = successfulWithdrawals?.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) || 0;

    // 6. Recent Tasks
    const { count: tasksDone } = await supabaseAdmin
        .from('user_tasks')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');

    return NextResponse.json({
      success: true,
      data: {
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        pendingUsers: pendingUsers || 0,
        totalPoints,
        totalRevenue,
        totalWithdrawals,
        tasksDone: tasksDone || 0,
        // Mocking some deltas for UI (could be calculated if we had history)
        deltas: {
            users: 5.2,
            points: 12.1,
            revenue: 8.4
        }
      }
    });

  } catch (error: any) {
    console.error('Stats fetch error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
