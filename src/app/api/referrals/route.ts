import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({
        success: true,
        data: {
          referralCode: 'EARNIX',
          referrals: [],
          stats: { totalReferrals: 0, qualifiedReferrals: 0, pendingReferrals: 0, totalEarned: 0 },
        },
      });
    }

    // Get the user's referral code
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('referral_code')
      .eq('id', userId)
      .single();

    // Get all referrals where this user is the referrer
    const { data: referrals } = await supabaseAdmin
      .from('referrals')
      .select('*, referred:referred_id(name, email, created_at)')
      .eq('referrer_id', userId)
      .order('created_at', { ascending: false });

    // If the join syntax doesn't work, fall back
    let referralList = referrals || [];
    
    // If the join failed (referred is null), try fetching names separately
    if (referralList.length > 0 && !referralList[0].referred) {
      const referredIds = referralList.map(r => r.referred_id).filter(Boolean);
      if (referredIds.length > 0) {
        const { data: referredUsers } = await supabaseAdmin
          .from('users')
          .select('id, name, email, created_at')
          .in('id', referredIds);

        const userMap = new Map((referredUsers || []).map(u => [u.id, u]));
        referralList = referralList.map(r => ({
          ...r,
          referred: userMap.get(r.referred_id) || { name: 'User', email: '', created_at: r.created_at },
        }));
      }
    }

    const qualifiedCount = referralList.filter(r => r.status === 'qualified').length;
    const pendingCount = referralList.filter(r => r.status === 'pending').length;
    const totalEarned = referralList
      .filter(r => r.status === 'qualified')
      .reduce((sum, r) => sum + (r.reward_points || 0), 0);

    return NextResponse.json({
      success: true,
      data: {
        referralCode: user?.referral_code || 'N/A',
        referrals: referralList.map(r => ({
          id: r.id,
          referred_name: r.referred?.name || 'User',
          referred_email: r.referred?.email || '',
          status: r.status,
          reward_points: r.reward_points || 0,
          created_at: r.referred?.created_at || r.created_at,
        })),
        stats: {
          totalReferrals: referralList.length,
          qualifiedReferrals: qualifiedCount,
          pendingReferrals: pendingCount,
          totalEarned,
        },
      },
    });

  } catch (error) {
    console.error('[/api/referrals] Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
