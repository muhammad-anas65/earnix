'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Wallet,
  TrendingUp,
  ArrowUpRight,
  Clock,
  CheckCircle,
  Target,
  Gift,
  DollarSign,
  UserPlus,
  Activity,
  BarChart2,
  RefreshCw,
  Coins,
  ShieldCheck
} from 'lucide-react';
import { cn, formatCurrency, formatPoints } from '@/lib/utils';
import UserActions from '@/components/admin/UserActions';




export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [recentWithdrawals, setRecentWithdrawals] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardData = async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);
    setError(null);
    try {
      // 1. Fetch Stats
      const statsResp = await fetch('/api/admin/stats');
      const statsResult = await statsResp.json();
      
      // 2. Fetch Pending Users
      const usersResp = await fetch('/api/admin/users?status=pending');
      const usersResult = await usersResp.json();
      
      // 3. Fetch Recent Withdrawals
      const withdrawalsResp = await fetch('/api/admin/withdrawals');
      const withdrawalsResult = await withdrawalsResp.json();

      if (statsResult.success) {
        setStats(statsResult.data);
      }

      if (usersResult.success) {
        setPendingApprovals(Array.isArray(usersResult.data) ? usersResult.data.slice(0, 5) : []);
      }

      if (withdrawalsResult.success) {
        setRecentWithdrawals(Array.isArray(withdrawalsResult.data) ? withdrawalsResult.data.slice(0, 5) : []);
      }

    } catch (err: any) {
      console.error('Admin dashboard fetch error:', err);
      setError(err.message || 'Error loading dashboard');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const STAT_CONFIGS = stats ? [
    { title: 'Total Users', value: stats.totalUsers, change: stats.deltas.users, icon: Users, bg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { title: 'Active Users', value: stats.activeUsers, change: 0, icon: Activity, bg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
    { title: 'Pending Approvals', value: stats.pendingUsers, change: 0, icon: Clock, bg: 'bg-amber-50', iconColor: 'text-amber-600' },
    { title: 'Points Global', value: formatPoints(stats.totalPoints), change: stats.deltas.points, icon: Coins, bg: 'bg-violet-50', iconColor: 'text-violet-600' },
    { title: 'Withdrawals', value: formatCurrency(stats.totalWithdrawals), change: 0, icon: Wallet, bg: 'bg-rose-50', iconColor: 'text-rose-600' },
    { title: 'Revenue Total', value: formatCurrency(stats.totalRevenue), change: stats.deltas.revenue, icon: DollarSign, bg: 'bg-teal-50', iconColor: 'text-teal-600' },
  ] : [];

  const AUX_METRICS = stats ? [
    { label: 'Active Tasks', value: formatPoints(stats.tasksDone), icon: Target, trend: '+8.4%', up: true },
    { label: 'Conversion Rate', value: '100%', icon: ShieldCheck, trend: '+0.0%', up: true },
  ] : [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <div className="h-7 w-48 bg-slate-200 rounded-xl animate-pulse mb-2" />
            <div className="h-4 w-64 bg-slate-100 rounded-lg animate-pulse" />
          </div>
          <div className="h-9 w-32 bg-slate-200 rounded-xl animate-pulse" />
        </div>
        {/* Stats skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({length: 6}).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 animate-pulse border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-slate-100 rounded-xl" />
                <div className="h-5 w-12 bg-slate-100 rounded-lg" />
              </div>
              <div className="h-7 w-16 bg-slate-200 rounded-lg mb-2" />
              <div className="h-3 w-24 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          {Array.from({length: 2}).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse border border-slate-100 h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-5 shadow-sm">
          <BarChart2 className="w-9 h-9 text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Dashboard Unavailable</h2>
        <p className="text-slate-400 mb-6 max-w-sm text-sm">{error}</p>
        <button
          onClick={() => fetchDashboardData()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-semibold text-sm shadow-md shadow-indigo-500/20 transition-all active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── PAGE HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Platform Overview</h1>
          <p className="text-slate-500 text-sm mt-0.5">Welcome back — here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Time Range Filter */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 gap-0.5 shadow-sm">
            {['24h', '7d', '30d'].map((range) => (
              <button
                key={range}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all',
                  range === '7d'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-700'
                )}
              >
                {range}
              </button>
            ))}
          </div>
          <button
            onClick={() => fetchDashboardData(true)}
            className={cn(
              'p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl border border-slate-200 bg-white shadow-sm transition-all',
              isRefreshing && 'animate-spin text-indigo-500'
            )}
            disabled={isRefreshing}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── STATS GRID ── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {(STAT_CONFIGS as any[]).map((stat: any, index: number) => (
          <div
            key={index}
            className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', stat.bg)}>
                <stat.icon className={cn('w-5 h-5', stat.iconColor)} />
              </div>
              <span className={cn(
                'text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider',
                (typeof stat.change === 'number' ? stat.change : 0) >= 0
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-red-50 text-red-600'
              )}>
                {(typeof stat.change === 'number' ? stat.change : 0) >= 0 ? '+' : ''}{stat.change}%
              </span>
            </div>
            <p className="text-2xl font-black text-slate-900 tracking-tight mb-0.5">{stat.value}</p>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Verification Queue */}
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">Verification Queue</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">{pendingApprovals.length} pending decisions</p>
            </div>
            <Link
              href="/admin/approvals"
              className="flex items-center gap-1.5 text-xs text-indigo-600 font-bold hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-all"
            >
              View All
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

            <div className="divide-y divide-slate-50">
            {pendingApprovals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                  <CheckCircle className="w-7 h-7 text-slate-200" />
                </div>
                <p className="text-sm font-bold text-slate-400">All caught up!</p>
                <p className="text-xs text-slate-300 mt-1">No pending verifications</p>
              </div>
            ) : (pendingApprovals as any[]).map((user: any) => (
              <div key={user.id} className="px-6 py-4 hover:bg-slate-50 transition-colors group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-black text-sm group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider">
                      {user.plan?.display_name || 'FREE'}
                    </span>
                    <UserActions userId={user.id} userStatus={user.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Withdrawal Ledger */}
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">Withdrawal Ledger</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Latest payment requests</p>
            </div>
            <Link
              href="/admin/withdrawals"
              className="flex items-center gap-1.5 text-xs text-indigo-600 font-bold hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-all"
            >
              View All
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-50">
            {(recentWithdrawals as any[]).map((w: any) => (
              <div key={w.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{w.user?.name || w.user || 'Unknown User'}</p>
                      <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wider">via {w.method}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-slate-900">₨ {w.amount.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{new Date(w.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={cn(
                    'text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider border',
                    w.status === 'pending'
                      ? 'bg-amber-50 text-amber-600 border-amber-100'
                      : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                  )}>
                    {w.status}
                  </span>
                  {w.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push('/admin/withdrawals')}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow-sm shadow-indigo-500/20 transition-all active:scale-95"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => router.push('/admin/withdrawals')}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── AUX METRICS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(AUX_METRICS as any[]).map((m: any, i: number) => (
          <div
            key={i}
            className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center">
                <m.icon className="w-5 h-5 text-slate-500" />
              </div>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-wider">
                {m.trend}
              </span>
            </div>
            <p className="text-2xl font-black text-slate-900 tracking-tight mb-0.5">{m.value}</p>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">{m.label}</p>
          </div>
        ))}
      </div>

      {/* ── QUICK LINKS ── */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black tracking-tight mb-1">Quick Actions</h3>
            <p className="text-indigo-200 text-sm">Manage your platform from one place</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Manage Users', href: '/admin/users' },
              { label: 'View Reports', href: '/admin/reports' },
              { label: 'Add Task', href: '/admin/tasks' },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="bg-white/15 hover:bg-white/25 border border-white/20 text-white font-bold text-sm px-4 py-2 rounded-xl transition-all backdrop-blur-sm"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
