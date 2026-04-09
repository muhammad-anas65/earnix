export const dynamic = 'force-dynamic';

import { supabaseAdmin } from '@/lib/supabase';
import { 
    User, 
    Mail, 
    Phone, 
    Calendar, 
    Wallet, 
    Star, 
    ArrowLeft, 
    CheckCircle, 
    XCircle,
    Activity,
    Users,
    Gift
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import Link from 'next/link';

export default async function UserDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: userId } = await params;

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('*, plan:plans(*), wallet:wallets(*)')
    .eq('id', userId)
    .single();

  if (error || !user) {
    return (
      <div className="p-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">User not found</h2>
        <Link href="/admin/users" className="text-primary-600 hover:underline">Back to users management</Link>
      </div>
    );
  }

  const wallet = user.wallet?.[0] || { available_points: 0, total_earned: 0, pending_withdrawals: 0 };

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/users" className="flex items-center text-gray-500 hover:text-gray-900 transition-colors mb-4 inline-flex">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Users
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-5">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-xl">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <div className="flex items-center mt-1 space-x-4">
                <p className="text-gray-500 flex items-center"><Mail className="w-4 h-4 mr-1.5" /> {user.email}</p>
                <div className={cn('px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider', 
                  user.status === 'active' ? 'bg-green-100 text-green-700' : 
                  user.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                  'bg-red-100 text-red-700'
                )}>
                  {user.status}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="card p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <User className="w-5 h-5 mr-2 text-primary-600" /> Account Profile
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-1">Full Name</p>
                <p className="text-lg font-semibold text-gray-900">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-1">Email Address</p>
                <p className="text-lg font-semibold text-gray-900">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-1">Phone Number</p>
                <p className="text-lg font-semibold text-gray-900">{user.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-1">Join Date</p>
                <p className="text-lg font-semibold text-gray-900">{formatDateTime(user.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-1">Role</p>
                <div className="flex items-center text-lg font-semibold text-gray-900">
                    <Star className="w-5 h-5 mr-2 text-yellow-500 fill-yellow-500" /> User
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-1">Referred By</p>
                <p className="text-lg font-semibold text-gray-900">{user.referred_by || 'Direct Signup'}</p>
              </div>
            </div>
          </div>

          <div className="card p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-primary-600" /> Recent Activity
            </h2>
            <div className="py-10 text-center text-gray-500 italic">
                Active auditing of user tasks and referral history is being synchronized...
            </div>
          </div>
        </div>

        {/* Financial Sidebar */}
        <div className="space-y-8">
          <div className="card p-8 bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-0">
            <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Wallet className="w-7 h-7 text-white" />
                </div>
                <Users className="w-6 h-6 text-white/40" />
            </div>
            <p className="text-indigo-100 font-bold uppercase tracking-widest text-xs mb-1">Available Points</p>
            <h3 className="text-4xl font-bold mb-8">Rs {wallet.available_points}</h3>
            
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                <div>
                   <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest mb-1">Total Earned</p>
                   <p className="font-bold">Rs {wallet.total_earned}</p>
                </div>
                <div>
                   <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest mb-1">Pending Payouts</p>
                   <p className="font-bold">Rs {wallet.pending_withdrawals}</p>
                </div>
            </div>
          </div>

          <div className="card p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Gift className="w-5 h-5 mr-2 text-primary-600" /> Current Plan
            </h2>
            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">Plan Name</span>
                    <span className="font-bold text-primary-600 uppercase tracking-wider text-xs">{user.plan?.display_name || 'Free'}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">Daily Task Limit</span>
                    <span className="font-bold text-gray-900">{user.plan?.daily_task_limit || 2}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Earning Cap</span>
                    <span className="font-bold text-gray-900">Rs {user.plan?.daily_earning_cap || 50}</span>
                </div>
            </div>
            <button className="w-full py-4 text-sm font-bold bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                Change User Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Utility to merge classes safely as this is a server component we manually need cn
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
