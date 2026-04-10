'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Wallet, 
  Gift, 
  CreditCard, 
  Clock, 
  Zap,
  Users,
  Target,
  Award,
  ArrowUpRight,
  TrendingUp,
  RefreshCw,
  X,
  CheckCircle,
  Copy,
  ChevronRight
} from 'lucide-react';
import { cn, formatCurrency, formatPoints } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  description: string;
  points_min: number;
  points_max: number;
  task_type: string;
}

const TASK_ICONS: Record<string, string> = {
  survey: '📊',
  watch: '🎬',
  download: '📥',
  signup: '📝',
  click: '👆',
};

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [dailyStats, setDailyStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [referralCopied, setReferralCopied] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const resp = await fetch('/api/users/me');
      if (!resp.ok) throw new Error('Failed to load your profile');
      const result = await resp.json();
      
      if (result.success) {
        setUser(result.data.user);
        setWallet(result.data.wallet);
        setDailyStats(result.data.dailyStats);
      } else {
        throw new Error(result.error || 'Authentication error');
      }

      try {
        const tasksResp = await fetch('/api/tasks');
        const tasksResult = await tasksResp.json();
        if (tasksResult.success) {
          setTasks(tasksResult.data.tasks?.slice(0, 4) || []);
        }
      } catch {
        setTasks([]);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCopyReferral = () => {
    if (user?.referral_code) {
      navigator.clipboard.writeText(user.referral_code.toUpperCase());
      setReferralCopied(true);
      setTimeout(() => setReferralCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Hero skeleton */}
        <div className="rounded-2xl bg-slate-200 animate-pulse h-40" />
        {/* Stats skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({length: 4}).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 animate-pulse h-24 border border-slate-100" />
          ))}
        </div>
        {/* Content skeleton */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 animate-pulse border border-slate-100 h-64" />
          <div className="bg-white rounded-2xl p-6 animate-pulse border border-slate-100 h-64" />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-5">
          <X className="w-9 h-9 text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Couldn't load your dashboard</h2>
        <p className="text-slate-400 text-sm mb-6 max-w-sm">{error || "Something went wrong. Please check your connection."}</p>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-semibold text-sm shadow-md shadow-indigo-500/20 transition-all active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  const progressPct = dailyStats 
    ? Math.min((dailyStats.tasks_completed / dailyStats.daily_limit) * 100, 100)
    : 0;

  const availablePts = wallet?.available_points || 0;
  const pendingPts = wallet?.pending_points || 0;
  const totalEarned = wallet?.total_earned || 0;

  return (
    <div className="space-y-6">

      {/* ── HERO BALANCE CARD ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 rounded-2xl p-6 lg:p-8 text-white shadow-xl shadow-indigo-500/20">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/20 rounded-full blur-3xl -ml-24 -mb-24 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Balance */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Wallet className="w-4 h-4 text-indigo-300" />
              <span className="text-xs font-bold text-indigo-200 uppercase tracking-widest">Available Balance</span>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-4xl lg:text-5xl font-black tracking-tight">
                {formatPoints(availablePts)}
              </span>
              <span className="text-lg text-indigo-300 font-bold">PTS</span>
            </div>
            <p className="text-indigo-200 text-sm">
              ≈ <span className="text-white font-bold">{formatCurrency(availablePts * 0.1)}</span> withdrawable
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-3">
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4 flex-1 text-center min-w-[100px]">
              <Clock className="w-5 h-5 text-indigo-300 mx-auto mb-1.5" />
              <p className="text-xl font-black">{formatPoints(pendingPts)}</p>
              <p className="text-[10px] text-indigo-300 font-semibold uppercase tracking-wider mt-0.5">Pending</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4 flex-1 text-center min-w-[100px]">
              <TrendingUp className="w-5 h-5 text-indigo-300 mx-auto mb-1.5" />
              <p className="text-xl font-black">{formatPoints(totalEarned)}</p>
              <p className="text-[10px] text-indigo-300 font-semibold uppercase tracking-wider mt-0.5">All-time</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Link
              href="/dashboard/withdraw"
              className="bg-white text-indigo-700 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-indigo-50 transition-all shadow-lg shadow-black/10 active:scale-95"
            >
              Withdraw
            </Link>
            <Link
              href="/dashboard/tasks"
              className="bg-white/15 border border-white/25 text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-white/25 transition-all"
            >
              Earn More
            </Link>
          </div>
        </div>
      </div>

      {/* ── QUICK STATS ROW ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Today\'s Tasks', value: `${dailyStats?.tasks_completed || 0}/${dailyStats?.daily_limit || 2}`, icon: Target, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Points Today', value: formatPoints(dailyStats?.points_earned || 0), icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Global Rank', value: '#1,204', icon: Award, color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Active Referrals', value: '0', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', stat.bg)}>
              <stat.icon className={cn('w-5 h-5', stat.color)} />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-black text-slate-900 truncate">{stat.value}</p>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider truncate">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Left: Progress + Tasks */}
        <div className="lg:col-span-2 space-y-6">

          {/* Daily Progress */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Daily Progress</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {dailyStats?.tasks_completed || 0} of {dailyStats?.daily_limit || 2} tasks completed
                </p>
              </div>
              <div className={cn(
                'w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black',
                progressPct >= 100 ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-700 border border-slate-100'
              )}>
                {progressPct >= 100 ? <CheckCircle className="w-6 h-6" /> : `${Math.round(progressPct)}%`}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                {progressPct >= 100 ? '✅ Daily limit reached!' : 'Keep going!'}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">Resets at midnight</span>
            </div>
          </div>

          {/* Priority Tasks */}
          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Available Tasks</h3>
                <p className="text-xs text-slate-400 mt-0.5">Complete tasks to earn points</p>
              </div>
              <Link
                href="/dashboard/tasks"
                className="flex items-center gap-1 text-xs text-indigo-600 font-bold hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-all"
              >
                All Tasks <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-50">
              {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-2xl">
                    🎯
                  </div>
                  <p className="text-sm font-bold text-slate-500">No tasks available</p>
                  <p className="text-xs text-slate-300 mt-1">Check back soon for new opportunities</p>
                </div>
              ) : tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-slate-100 group-hover:bg-indigo-50 rounded-xl flex items-center justify-center text-xl transition-colors flex-shrink-0">
                      {TASK_ICONS[task.task_type] || '👆'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg uppercase tracking-wider">
                          +{task.points_max} pts
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 capitalize">{task.task_type}</span>
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/tasks/${task.id}`}
                    className="flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white px-3 py-2 rounded-xl transition-all flex-shrink-0"
                  >
                    Start
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Rail */}
        <div className="space-y-5">

          {/* Earnings Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Earnings</p>
              </div>
            </div>
            <p className="text-4xl font-black mb-1 tracking-tight">{formatPoints(totalEarned)}</p>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-6">Points Earned</p>
            
            <div className="space-y-3">
              {[
                { label: 'Available', value: formatPoints(availablePts), color: 'text-green-400' },
                { label: 'Pending', value: formatPoints(pendingPts), color: 'text-amber-400' },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-3 border-t border-white/5">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{row.label}</span>
                  <span className={cn('text-sm font-black', row.color)}>{row.value}</span>
                </div>
              ))}
            </div>

            <Link
              href="/dashboard/wallet"
              className="mt-5 flex items-center justify-center gap-2 w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold text-sm py-2.5 rounded-xl transition-all"
            >
              <Wallet className="w-4 h-4" />
              View Wallet
            </Link>
          </div>

          {/* Referral Card */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Refer & Earn</h3>
                <p className="text-xs text-slate-400">Get +500 pts per referral</p>
              </div>
            </div>

            {/* Referral Code */}
            <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-4 mb-4">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Your Code</p>
              <p className="text-xl font-black text-slate-900 tracking-widest">
                {user.referral_code?.toUpperCase() || 'EARNIX'}
              </p>
            </div>

            <button
              onClick={handleCopyReferral}
              className={cn(
                'flex items-center justify-center gap-2 w-full font-bold text-sm py-2.5 rounded-xl transition-all',
                referralCopied
                  ? 'bg-emerald-500 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
              )}
            >
              {referralCopied ? (
                <><CheckCircle className="w-4 h-4" /> Copied!</>
              ) : (
                <><Copy className="w-4 h-4" /> Copy Invite Link</>
              )}
            </button>
          </div>

          {/* Withdraw CTA */}
          <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-indigo-100 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <CreditCard className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Ready to withdraw?</h3>
                <p className="text-xs text-slate-400">Minimum 1,000 points</p>
              </div>
            </div>
            <Link
              href="/dashboard/withdraw"
              className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm py-2.5 rounded-xl shadow-md shadow-indigo-500/15 transition-all active:scale-95"
            >
              <Gift className="w-4 h-4" />
              Withdraw Cash
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
