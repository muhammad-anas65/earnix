import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getTodayDateString, generateReferralCode } from '@/lib/utils';

export const dynamic = 'force-dynamic';

// Default fallback data (only used when DB is completely unavailable)
const getDefaultData = (userId: string) => ({
  success: true,
  data: {
    user: {
      id: userId,
      name: 'Earnix Member',
      email: '',
      status: 'active',
      referral_code: '...',
      plan: { display_name: 'Free', daily_task_limit: 2 }
    },
    wallet: {
      available_points: 0,
      pending_points: 0,
      total_earned: 0
    },
    dailyStats: {
      tasks_completed: 0,
      points_earned: 0,
      daily_limit: 2,
    }
  }
});

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Return default data only if DB is genuinely not configured
    if (!supabaseAdmin) {
      console.warn('[/api/users/me] supabaseAdmin is null — returning defaults');
      return NextResponse.json(getDefaultData(userId));
    }

    // ── 1. Try full query with plan join ──
    let user: any = null;
    const { data: userWithPlan, error: joinError } = await supabaseAdmin
      .from('users')
      .select('*, plan:plans(*)')
      .eq('id', userId)
      .single();

    if (!joinError && userWithPlan) {
      user = userWithPlan;
    } else {
      // ── 2. Join failed — try fetching user without the plan join ──
      console.warn('[/api/users/me] Plan join failed, trying without join:', joinError?.message);
      
      const { data: userOnly, error: userOnlyError } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (!userOnlyError && userOnly) {
        // Manually attach plan data if plan_id exists
        let planData = { display_name: 'Free', daily_task_limit: 2 };
        if (userOnly.plan_id) {
          const { data: planRow } = await supabaseAdmin
            .from('plans')
            .select('*')
            .eq('id', userOnly.plan_id)
            .single();
          if (planRow) planData = planRow;
        }
        user = { ...userOnly, plan: planData };
      } else {
        console.error('[/api/users/me] User not found in DB:', userOnlyError?.message);
      }
    }

    // ── 2a. Auto-heal missing referral code ──
    if (user && !user.referral_code) {
      const newCode = generateReferralCode();
      const { data: updatedUser } = await supabaseAdmin
        .from('users')
        .update({ referral_code: newCode })
        .eq('id', userId)
        .select()
        .single();
      if (updatedUser) {
        user.referral_code = newCode;
      }
    }

    // ── 3. If user still not found, return defaults ──
    if (!user) {
      console.warn('[/api/users/me] No user record found for ID:', userId);
      return NextResponse.json(getDefaultData(userId));
    }

    // ── 4. Fetch wallet ──
    const { data: wallet } = await supabaseAdmin
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .single();

    // ── 5. Fetch daily task log ──
    const today = getTodayDateString();
    const { data: dailyLog } = await supabaseAdmin
      .from('daily_task_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single();

    // ── 6. Fetch referral count ──
    const { count: referralCount } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('referred_by', userId);

    // ── 7. Calculate Global Rank (Better way: total earned points index) ──
    // Simply count how many people have more points (performance intensive? maybe ok for now)
    const { count: higherRanked } = await supabaseAdmin
        .from('wallets')
        .select('*', { count: 'exact', head: true })
        .gt('total_earned', wallet?.total_earned || 0);

    const globalRank = (higherRanked || 0) + 1;

    return NextResponse.json({
      success: true,
      data: {
        user,
        wallet: wallet || { available_points: 0, pending_points: 0, total_earned: 0 },
        dailyStats: {
          tasks_completed: dailyLog?.tasks_completed || 0,
          points_earned: dailyLog?.points_earned || 0,
          daily_limit: user.plan?.daily_task_limit || 2,
        },
        referralCount: referralCount || 0,
        globalRank
      }
    });

  } catch (error) {
    console.error('[/api/users/me] Unexpected error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

