import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getRandomPoints, getTodayDateString } from '@/lib/utils';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: taskId } = await params;
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
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

    const { data: task } = await supabaseAdmin
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .eq('is_active', true)
      .single();

    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
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

    if (dailyLog && dailyLog.tasks_completed >= (user.plan?.daily_task_limit || 2)) {
      return NextResponse.json(
        { success: false, error: 'Daily task limit reached' },
        { status: 400 }
      );
    }

    const { data: existingCompletion } = await supabaseAdmin
      .from('user_tasks')
      .select('id')
      .eq('user_id', userId)
      .eq('task_id', taskId)
      .eq('status', 'completed')
      .single();

    if (existingCompletion) {
      return NextResponse.json(
        { success: false, error: 'Task already completed' },
        { status: 400 }
      );
    }

    const pointsEarned = getRandomPoints(task.points_min, task.points_max);
    
    const currentDailyEarnings = dailyLog?.points_earned || 0;
    const maxDailyEarnings = user.plan?.daily_earning_cap || 50;
    const actualPoints = Math.min(pointsEarned, maxDailyEarnings - currentDailyEarnings);

    if (actualPoints <= 0) {
      return NextResponse.json(
        { success: false, error: 'Daily earning cap reached' },
        { status: 400 }
      );
    }

    const { error: userTaskError } = await supabaseAdmin.from('user_tasks').insert({
      user_id: userId,
      task_id: taskId,
      status: 'completed',
      points_earned: actualPoints,
      completed_at: new Date().toISOString(),
    });

    if (userTaskError) {
      return NextResponse.json(
        { success: false, error: 'Failed to record task completion' },
        { status: 500 }
      );
    }

    if (dailyLog) {
      await supabaseAdmin
        .from('daily_task_logs')
        .update({
          tasks_completed: dailyLog.tasks_completed + 1,
          points_earned: dailyLog.points_earned + actualPoints,
        })
        .eq('user_id', userId)
        .eq('date', today);
    } else {
      await supabaseAdmin.from('daily_task_logs').insert({
        user_id: userId,
        date: today,
        tasks_completed: 1,
        points_earned: actualPoints,
      });
    }

    const { data: updatedWallet } = await supabaseAdmin
      .from('wallets')
      .update({
        pending_points: (wallet?.pending_points || 0) + actualPoints,
        total_earned: (wallet?.total_earned || 0) + actualPoints,
      })
      .eq('user_id', userId)
      .select()
      .single();

    // Referral logic: Release reward if this is the 3rd task
    const { count: totalCompleted } = await supabaseAdmin
      .from('user_tasks')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'completed');

    if (totalCompleted === 3) {
      const { data: referral } = await supabaseAdmin
        .from('referrals')
        .select('*')
        .eq('referred_id', userId)
        .eq('status', 'pending')
        .single();
      
      if (referral) {
        await supabaseAdmin
          .from('referrals')
          .update({ 
            status: 'qualified', 
            qualified_at: new Date().toISOString(),
          })
          .eq('id', referral.id);

        const { data: referrerWallet } = await supabaseAdmin
          .from('wallets')
          .select('*')
          .eq('user_id', referral.referrer_id)
          .single();

        if (referrerWallet) {
          await supabaseAdmin
            .from('wallets')
            .update({
              available_points: referrerWallet.available_points + referral.reward_points,
              total_earned: referrerWallet.total_earned + referral.reward_points,
            })
            .eq('user_id', referral.referrer_id);

          await supabaseAdmin.from('notifications').insert({
            user_id: referral.referrer_id,
            title: 'Referral Reward! 🎁',
            body: `Your referral ${user.name} completed 3 tasks. You earned ${referral.reward_points} points!`,
            type: 'referral',
          });
        }
      }
    }

    await supabaseAdmin.from('notifications').insert({
      user_id: userId,
      title: 'Task Completed! 🎉',
      body: `You earned ${actualPoints} points from "${task.title}". Points will be available after validation.`,
      type: 'task',
    });

    return NextResponse.json({
      success: true,
      data: {
        points_earned: actualPoints,
        task_title: task.title,
        pending_points: (wallet?.pending_points || 0) + actualPoints,
      },
      message: 'Task completed successfully!',
    });

  } catch (error) {
    console.error('Task completion error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
