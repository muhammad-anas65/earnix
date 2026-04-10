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

    // Fetch user with plan (with fallback if join fails)
    let user: any = null;
    const { data: userWithPlan, error: joinError } = await supabaseAdmin
      .from('users')
      .select('*, plan:plans(*)')
      .eq('id', userId)
      .single();

    if (!joinError && userWithPlan) {
      user = userWithPlan;
    } else {
      console.warn('[/api/tasks] Plan join failed, trying without join:', joinError?.message);
      const { data: userOnly } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userOnly) {
        let planData = { daily_task_limit: 2, daily_earning_cap: 50 };
        if (userOnly.plan_id) {
          const { data: planRow } = await supabaseAdmin
            .from('plans')
            .select('*')
            .eq('id', userOnly.plan_id)
            .single();
          if (planRow) planData = planRow;
        }
        user = { ...userOnly, plan: planData };
      }
    }

    if (!user) {
      return NextResponse.json({
        success: true,
        data: {
          tasks: [],
          dailyStats: { tasks_completed: 0, points_earned: 0, daily_limit: 2, limit_reached: false },
          plan: null,
        },
      });
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

    const userPlanName = user.plan?.display_name || 'Free';

    let tasksQuery = supabaseAdmin
      .from('tasks')
      .select('*')
      .eq('is_active', true)
      .contains('plan_access', [userPlanName]);

    if (completedIds.length > 0) {
      tasksQuery = tasksQuery.not('id', 'in', `(${completedIds.join(',')})`);
    }

    const { data: tasks } = await tasksQuery.order('created_at', { ascending: false });

    // Filter tasks by their repeat rules manually (once_only vs daily)
    // We already filtered by "completed today", but we need to strictly filter "once_only" tasks if they were EVER completed.
    const { data: everCompleted } = await supabaseAdmin
      .from('user_tasks')
      .select('task_id')
      .eq('user_id', userId)
      .eq('status', 'completed');
    
    const everCompletedIds = new Set(everCompleted?.map(t => t.task_id) || []);

    const filteredTasks = (tasks || []).filter(task => {
      if (task.repeat_type === 'once_only' && everCompletedIds.has(task.id)) {
        return false;
      }
      return true;
    });

    const tasksWithPoints = filteredTasks.map(task => ({
      ...task,
      points_to_earn: task.reward_points || getRandomPoints(task.points_min, task.points_max),
    }));

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
