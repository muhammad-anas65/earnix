import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getTodayDateString } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*, plan:plans(*)')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const { data: wallet } = await supabaseAdmin
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .single();

    const today = getTodayDateString();
    const { data: dailyLog } = await supabaseAdmin
      .from('daily_task_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single();

    return NextResponse.json({
      success: true,
      data: {
        user,
        wallet,
        dailyStats: {
          tasks_completed: dailyLog?.tasks_completed || 0,
          points_earned: dailyLog?.points_earned || 0,
          daily_limit: user.plan?.daily_task_limit || 2,
        }
      }
    });

  } catch (error) {
    console.error('User fetch error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
