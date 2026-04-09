'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
import { formatCurrency, formatPoints, formatDateTime } from '@/lib/utils';
import UserActions from '@/components/admin/UserActions';

export default function AdminDashboardPage() {
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
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of your platform performance</p>
        </div>
        
        <div className="flex items-center space-x-2 bg-white rounded-xl p-1 border">
          {['24h', '7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                range === '7d' 
                  ? 'bg-primary-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-10">
        {stats.map((stat, index) => (
          <div key={index} className="card p-7">
            <div className="flex items-center justify-between mb-5">
              <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center`}>
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              <span className={`flex items-center text-sm font-semibold ${
                stat.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change >= 0 ? (
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                )}
                {Math.abs(stat.change)}%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-500">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Pending Approvals */}
        <div className="card">
          <div className="p-7 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Pending Approvals</h2>
              <p className="text-sm text-gray-500">{pendingApprovals.length} users waiting</p>
            </div>
            <Link href="/admin/approvals" className="text-primary-600 hover:underline font-semibold">
              View All
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {pendingApprovals.length === 0 ? (
               <div className="p-10 text-center text-gray-500">No pending approvals</div>
            ) : pendingApprovals.map((user) => (
              <div key={user.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                      {user.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="badge bg-purple-100 text-purple-700 mb-1">{user.plan?.display_name || 'Free'}</span>
                    <p className="text-xs text-gray-500">{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className={`badge ${
                    user.payment_status === 'submitted' 
                      ? 'bg-yellow-100 text-yellow-700' 
                      : user.payment_status === 'pending'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {user.payment_status === 'none' ? 'Free Plan' : user.payment_status}
                  </span>
                  <div className="flex space-x-2">
                    <UserActions userId={user.id} userStatus={user.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Withdrawals */}
        <div className="card">
          <div className="p-7 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Recent Withdrawals</h2>
              <p className="text-sm text-gray-500">Latest withdrawal requests</p>
            </div>
            <Link href="/admin/withdrawals" className="text-primary-600 hover:underline font-semibold">
              View All
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentWithdrawals.map((withdrawal) => (
              <div key={withdrawal.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{withdrawal.user}</p>
                    <p className="text-sm text-gray-500">
                      {withdrawal.method === 'easypaisa' ? 'EasyPaisa' : 'JazzCash'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatCurrency(withdrawal.amount)}</p>
                    <p className="text-xs text-gray-500">{withdrawal.created_at}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className={`badge ${
                    withdrawal.status === 'paid' 
                      ? 'bg-green-100 text-green-700' 
                      : withdrawal.status === 'approved'
                      ? 'bg-blue-100 text-blue-700'
                      : withdrawal.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {withdrawal.status}
                  </span>
                  {withdrawal.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button className="px-4 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 font-semibold">
                        Approve
                      </button>
                      <button className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-semibold">
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

      {/* Quick Stats Cards */}
      <div className="grid lg:grid-cols-4 gap-6 mt-8">
        <Link href="/admin/users" className="card p-7 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-2">New Users Today</p>
              <p className="text-4xl font-bold text-gray-900">+234</p>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
              <UserPlus className="w-7 h-7 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-4 font-semibold">↑ 15% from yesterday</p>
        </Link>

        <Link href="/admin/tasks" className="card p-7 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-2">Tasks Completed</p>
              <p className="text-4xl font-bold text-gray-900">12,456</p>
            </div>
            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
              <Target className="w-7 h-7 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-4 font-semibold">↑ 8% from yesterday</p>
        </Link>

        <Link href="/admin/referrals" className="card p-7 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-2">Referrals</p>
              <p className="text-4xl font-bold text-gray-900">1,892</p>
            </div>
            <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center">
              <Gift className="w-7 h-7 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-4 font-semibold">↑ 23% from yesterday</p>
        </Link>

        <div className="card p-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-2">Conversion Rate</p>
              <p className="text-4xl font-bold text-gray-900">68%</p>
            </div>
            <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-yellow-600" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-4 font-semibold">↑ 5% from last week</p>
        </div>
      </div>
    </div>
  );
}
