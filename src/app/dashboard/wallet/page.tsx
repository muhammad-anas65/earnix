'use client';

import { useState, useEffect } from 'react';
import { Wallet, ArrowUpRight, ArrowDownRight, TrendingUp, History, Download, CreditCard } from 'lucide-react';
import { formatCurrency, formatPoints } from '@/lib/utils';
import Link from 'next/link';

export default function WalletPage() {
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const resp = await fetch('/api/users/me');
        const result = await resp.json();
        if (result.success) {
          setWallet(result.data.wallet);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWallet();
  }, []);

  if (loading || !wallet) {
    return <div className="p-20 text-center animate-pulse font-bold text-slate-400">Loading your balance...</div>;
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">My Wallet</h1>
          <p className="text-gray-500">Track your earnings and manage your available funds.</p>
        </div>
        <Link href="/dashboard/withdraw" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3.5 rounded-2xl font-black shadow-lg shadow-green-600/20 transition-all flex items-center">
           <CreditCard className="w-5 h-5 mr-3" /> WITHDRAW NOW
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Main balance card */}
        <div className="lg:col-span-2 p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-12 translate-x-1/2 -translate-y-1/2 bg-white/5 rounded-full w-64 h-64 blur-3xl opacity-50" />
           <div className="relative z-10">
              <div className="flex items-center space-x-3 text-slate-400 mb-6 font-bold uppercase tracking-widest text-xs">
                 <Wallet className="w-4 h-4" /> Available for Withdrawal
              </div>
              <h2 className="text-6xl font-black mb-4 tracking-tighter">
                 {formatPoints(wallet.available_points)} <span className="text-2xl text-slate-400 uppercase font-bold">Points</span>
              </h2>
              <p className="text-3xl font-bold text-green-400 opacity-90">
                 = {formatCurrency(wallet.available_points * 0.1)}
              </p>
           </div>
        </div>

        <div className="card p-8 flex flex-col justify-between border-l-8 border-yellow-500">
           <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Pending Rewards</p>
              <h3 className="text-3xl font-black text-slate-800">{formatPoints(wallet.pending_points)} pts</h3>
           </div>
           <div className="mt-4 text-amber-600 font-bold text-xs bg-amber-50 px-3 py-1.5 rounded-lg w-fit">
              Verifying tasks...
           </div>
        </div>

        <div className="card p-8 flex flex-col justify-between border-l-8 border-primary-600 font-bold">
           <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Lifetime Earnings</p>
              <h3 className="text-3xl font-black text-slate-800">{formatPoints(wallet.total_earned)} pts</h3>
           </div>
           <p className="text-xs text-slate-400 mt-4">Growth through Earnix</p>
        </div>
      </div>

      <div className="card overflow-hidden">
         <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-black text-slate-800 uppercase tracking-tight flex items-center">
               <History className="w-5 h-5 mr-3 text-slate-400" /> Recent Payout History
            </h3>
            <button className="flex items-center text-primary-600 font-bold text-xs uppercase hover:underline">
               <Download className="w-4 h-4 mr-2" /> Download Statement
            </button>
         </div>
         <div className="py-20 text-center">
            <TrendingUp className="w-16 h-16 text-slate-200 mx-auto mb-6" />
            <h4 className="text-xl font-bold text-slate-800 mb-2">No withdrawals yet.</h4>
            <p className="text-gray-500 max-w-sm mx-auto mb-8 font-medium">Once you reach the minimum withdrawal limit, you can request your first payout here.</p>
            <Link href="/dashboard/tasks" className="text-primary-600 font-black tracking-widest text-sm border-2 border-primary-500/10 px-8 py-3 rounded-2xl hover:bg-primary-50 transition-colors">
               COLLECT MORE POINTS
            </Link>
         </div>
      </div>
    </div>
  );
}
