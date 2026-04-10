import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getRandomPoints, getTodayDateString } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Return empty tasks gracefully if DB is not configured
    if (!supabaseAdmin) {
      return NextResponse.json({
        success: true,
        data: {
          tasks: [],
          dailyStats: { tasks_completed: 0, points_earned: 0, daily_limit: 2, limit_reached: false },
          plan: null,
        },
      });
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

    const today = getTodayDateString();
    const { data: dailyLog } = await supabaseAdmin
      .from('daily_task_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single();

    const { data: completedTaskIds } = await supabaseAdmin
      .from('user_tasks')
      .select('task_id')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .gte('completed_at', new Date(today).toISOString());

    const completedIds = completedTaskIds?.map(t => t.task_id) || [];

    const { data: tasks } = await supabaseAdmin
      .from('tasks')
      .select('*')
      .eq('is_active', true)
      .not('id', 'in', `(${completedIds.join(',')})`)
      .order('created_at', { ascending: false });

    const tasksWithPoints = tasks?.map(task => ({
      ...task,
      points_to_earn: getRandomPoints(task.points_min, task.points_max),
    })) || [];

    return NextResponse.json({
      success: true,
      data: {
        tasks: tasksWithPoints,
        dailyStats: {
          tasks_completed: dailyLog?.tasks_completed || 0,
          points_earned: dailyLog?.points_earned || 0,
          daily_limit: user.plan?.daily_task_limit || 2,
          limit_reached: (dailyLog?.tasks_completed || 0) >= (user.plan?.daily_task_limit || 2),
        },
        plan: user.plan,
      },
    });

  } catch (error) {
    console.error('Tasks fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
