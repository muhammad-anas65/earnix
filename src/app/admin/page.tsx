'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  CreditCard, 
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  XCircle,
  Target,
  Gift,
  DollarSign,
  UserPlus,
  Activity
} from 'lucide-react';
import { 
  cn, 
  formatCurrency, 
  formatPoints, 
  formatDateTime, 
  getInitials 
} from '@/lib/utils';
import UserActions from '@/components/admin/UserActions';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [recentWithdrawals, setRecentWithdrawals] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const usersResp = await fetch('/api/admin/users?status=pending');
      if (!usersResp.ok) throw new Error('Failed to fetch dashboard data');
      const usersResult = await usersResp.json();
      
      if (usersResult.success && Array.isArray(usersResult.data)) {
        setPendingApprovals(usersResult.data.slice(0, 5));
      } else {
        setPendingApprovals([]);
      }

      setStats([
        { title: 'Total Users', value: '1,240', change: 12.5, icon: Users, color: 'bg-blue-500' },
        { title: 'Active Users', value: '850', change: 8.2, icon: Activity, color: 'bg-green-500' },
        { title: 'Pending Approvals', value: usersResult.data?.length || 0, change: 0, icon: Clock, color: 'bg-yellow-500' },
        { title: 'Total Points Issued', value: '1.2M', change: 18.3, icon: Target, color: 'bg-purple-500' },
        { title: 'Withdrawals Today', value: '₨ 12,500', change: -5.2, icon: Wallet, color: 'bg-red-500' },
        { title: 'Revenue (Month)', value: '₨ 250k', change: 22.1, icon: DollarSign, color: 'bg-indigo-500' },
      ]);

      setRecentWithdrawals([
        { id: '1', user: 'John Doe', amount: 5000, method: 'easypaisa', status: 'pending', created_at: '2024-01-20 11:30 AM' },
        { id: '2', user: 'Jane Smith', amount: 3000, method: 'jazzcash', status: 'approved', created_at: '2024-01-20 10:15 AM' },
      ]);

    } catch (err: any) {
      console.error('Admin dashboard fetch error:', err);
      setError(err.message || 'Error loading dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
          <XCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Error</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <button 
          onClick={() => fetchDashboardData()}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 lg:space-y-12">
      {/* Header with Control Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tight">Platform Intelligence</h1>
          <p className="text-slate-500 font-medium mt-2">Real-time operational overview across all segments.</p>
        </div>
        
        <div className="flex items-center space-x-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
          {['24h', '7d', '30d'].map((range) => (
            <button
              key={range}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                range === '7d' 
                  ? 'bg-slate-900 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-slate-900'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* High Density Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="premium-card !p-6 group hover:bg-slate-900 hover:text-white transition-all duration-500">
            <div className="flex items-center justify-between mb-6">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center text-[10px] font-black px-2 py-1 rounded-lg ${
                stat.change >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {stat.change >= 0 ? '↑' : '↓'}{Math.abs(stat.change)}%
              </div>
            </div>
            <p className="text-2xl lg:text-3xl font-black tracking-tighter mb-1">{stat.value}</p>
            <p className="text-[10px] text-slate-400 group-hover:text-slate-500 font-black uppercase tracking-widest">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Verification Queue - High Density */}
        <div className="premium-card overflow-hidden !p-0">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Verification Queue</h2>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">{pendingApprovals.length} PENDING DECISIONS</p>
            </div>
            <Link href="/admin/approvals" className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all">
              <ArrowUpRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {pendingApprovals.length === 0 ? (
               <div className="p-20 text-center">
                  <Clock className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Everything Processed</p>
               </div>
            ) : pendingApprovals.map((user) => (
              <div key={user.id} className="p-8 hover:bg-slate-50 transition-all group">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-[1.25rem] flex items-center justify-center text-indigo-600 font-black text-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-black text-slate-900 tracking-tight leading-none mb-1">{user.name}</p>
                      <p className="text-xs font-medium text-slate-400">{user.email}</p>
                    </div>
                  </div>
                  <div className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">
                    {user.plan?.display_name || 'FREE'}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                   <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status: {user.payment_status}</span>
                   </div>
                   <UserActions userId={user.id} userStatus={user.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Withdrawal Ledger */}
        <div className="premium-card overflow-hidden !p-0">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Withdrawal Ledger</h2>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">LATEST TREASURY OUTFLOWS</p>
            </div>
            <Link href="/admin/withdrawals" className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all">
              <ArrowUpRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentWithdrawals.map((withdrawal) => (
              <div key={withdrawal.id} className="p-8 hover:bg-slate-50 transition-all">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-6">
                     <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shadow-sm">
                        <Wallet className="w-6 h-6 text-slate-400" />
                     </div>
                     <div>
                        <p className="font-black text-slate-900 tracking-tight text-lg mb-1">{withdrawal.user}</p>
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">VIA {withdrawal.method}</p>
                     </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black tracking-tighter text-slate-900">₨ {withdrawal.amount.toLocaleString()}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{withdrawal.created_at}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                   <span className={cn(
                      'px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border',
                      withdrawal.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-green-50 text-green-700 border-green-100'
                   )}>
                      {withdrawal.status}
                   </span>
                    {withdrawal.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => router.push('/admin/withdrawals')}
                          className="px-6 py-3 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-200 hover:scale-105 active:scale-95 transition-all"
                        >
                          PAY NOW
                        </button>
                        <button 
                          onClick={() => router.push('/admin/withdrawals')}
                          className="px-6 py-3 bg-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"
                        >
                          REJECT
                        </button>
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Auxiliary Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'User Growth', value: '+234', icon: UserPlus, trend: '+15.2%' },
           { label: 'Task Throughput', value: '12.4k', icon: Target, trend: '+8.4%' },
           { label: 'Network Points', value: '1.2M', icon: Gift, trend: '+12.1%' },
           { label: 'Conversion Velocity', value: '68%', icon: Activity, trend: '+3.2%' },
         ].map((aux, i) => (
           <div key={i} className="premium-card !p-8 border-2 border-dashed border-slate-100 !bg-transparent hover:border-indigo-200 hover:bg-indigo-50/10 transition-all">
              <div className="flex items-center justify-between mb-6">
                 <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                    <aux.icon className="w-6 h-6 text-slate-400" />
                 </div>
                 <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">{aux.trend}</span>
              </div>
              <p className="text-3xl font-black text-slate-900 tracking-tighter mb-1">{aux.value}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{aux.label}</p>
           </div>
         ))}
      </div>
    </div>
  );
}
