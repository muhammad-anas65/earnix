'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  TrendingUp,
  Wallet,
  Gift,
  CreditCard,
  Menu,
  X,
  Copy,
  Share2,
  Users,
  CheckCircle,
  Clock
} from 'lucide-react';
import { cn, formatPoints, formatDateTime, getInitials } from '@/lib/utils';

interface Referral {
  id: string;
  referred_name: string;
  status: 'pending' | 'qualified' | 'expired';
  reward_points: number;
  created_at: string;
}

const mockReferrals: Referral[] = [
  { id: '1', referred_name: 'Fatima Bibi', status: 'qualified', reward_points: 250, created_at: '2024-01-15' },
  { id: '2', referred_name: 'Muhammad Ali', status: 'pending', reward_points: 0, created_at: '2024-01-18' },
  { id: '3', referred_name: 'Ayesha Khan', status: 'qualified', reward_points: 250, created_at: '2024-01-20' },
];

const mockStats = {
  totalReferrals: 12,
  qualifiedReferrals: 8,
  pendingReferrals: 4,
  totalEarned: 2000,
};

const referralCode = 'ERNX-ABC123';

export default function ReferralsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'lg:hidden fixed left-0 top-0 h-full w-72 bg-white z-50 transform transition-transform',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">Earnix</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          {[
            { icon: TrendingUp, label: 'Dashboard', href: '/dashboard' },
            { icon: Gift, label: 'Referrals', href: '/dashboard/referrals', active: true },
            { icon: Wallet, label: 'Wallet', href: '/dashboard/wallet' },
            { icon: CreditCard, label: 'Withdraw', href: '/dashboard/withdraw' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center px-5 py-4 rounded-xl transition-all',
                item.active 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              <item.icon className="w-6 h-6" />
              <span className="ml-4 font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1">
        <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-5">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Referrals</h1>
                <p className="text-gray-500">Invite friends and earn bonus points</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10">
          {/* Referral Code Card */}
          <div className="card bg-gradient-to-br from-primary-600 to-secondary-600 text-white p-10 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Invite Friends & Earn</h3>
                <p className="text-white/80">Share your code and earn up to 350 points per qualified referral!</p>
              </div>
              <Users className="w-16 h-16 text-white/30" />
            </div>
            
            <div className="bg-white/20 rounded-2xl p-6 mb-6">
              <p className="text-sm text-white/70 mb-2">Your Referral Code</p>
              <div className="flex items-center justify-between">
                <p className="font-mono font-bold text-3xl">{referralCode}</p>
                <div className="flex space-x-3">
                  <button 
                    onClick={copyCode}
                    className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-colors"
                  >
                    {copied ? <CheckCircle className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                  </button>
                  <button className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-colors">
                    <Share2 className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold">{mockStats.totalReferrals}</p>
                <p className="text-sm text-white/70">Total</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">{mockStats.qualifiedReferrals}</p>
                <p className="text-sm text-white/70">Qualified</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">{mockStats.pendingReferrals}</p>
                <p className="text-sm text-white/70">Pending</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">{formatPoints(mockStats.totalEarned)}</p>
                <p className="text-sm text-white/70">Points Earned</p>
              </div>
            </div>
          </div>

          {/* How it Works */}
          <div className="card p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">How It Works</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 font-bold mr-4">1</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Share Your Code</h4>
                  <p className="text-gray-500 text-sm">Share your unique referral code with friends</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 font-bold mr-4">2</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Friend Signs Up</h4>
                  <p className="text-gray-500 text-sm">Your friend creates an account using your code</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 font-bold mr-4">3</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Earn Rewards</h4>
                  <p className="text-gray-500 text-sm">Get points when they complete 3 tasks</p>
                </div>
              </div>
            </div>
          </div>

          {/* Referrals List */}
          <div className="card">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Your Referrals</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {mockReferrals.map((ref) => (
                <div key={ref.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600">
                        {getInitials(ref.referred_name)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{ref.referred_name}</p>
                        <p className="text-sm text-gray-500">Referred on {formatDateTime(ref.created_at)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {ref.status === 'qualified' ? (
                        <div>
                          <span className="badge bg-green-100 text-green-700 mb-1">Qualified</span>
                          <p className="text-sm font-semibold text-green-600">{ref.reward_points} points earned</p>
                        </div>
                      ) : (
                        <div>
                          <span className="badge bg-yellow-100 text-yellow-700 mb-1">Pending</span>
                          <p className="text-sm text-gray-500">Needs 3 tasks</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
