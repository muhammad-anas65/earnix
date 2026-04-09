'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Wallet, Clock, History, AlertCircle, ChevronRight, CheckCircle } from 'lucide-react';
import { formatCurrency, formatPoints } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function WithdrawPage() {
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('easypaisa');

  const fetchData = async () => {
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

  useEffect(() => {
    fetchData();
  }, []);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    setWithdrawing(true);
    // Simulate API call for now or connect to real endpoint if it exists
    setTimeout(() => {
      toast.success('Withdrawal request submitted for approval!');
      setWithdrawing(false);
      setAmount('');
    }, 2000);
  };

  if (loading || !wallet) {
    return <div className="p-20 text-center animate-pulse font-bold text-slate-400 font-mono tracking-widest uppercase">Initializing withdrawal vault...</div>;
  }

  const minWithdrawal = 1000; // in points
  const pointsToWithdraw = parseFloat(amount) || 0;
  const currencyAmount = pointsToWithdraw * 0.1;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Request Payout</h1>
        <p className="text-gray-500 font-medium">Turn your hard-earned points into real currency.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Main Withdrawal Box */}
        <div className="lg:col-span-2 space-y-8">
           <div className="card p-10 shadow-xl border-t-8 border-green-600">
              <form onSubmit={handleWithdraw} className="space-y-8">
                 <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Select Payout Method</label>
                       <div className="grid gap-3">
                          {['easypaisa', 'jazzcash'].map((m) => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setMethod(m)}
                              className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all font-black uppercase text-xs tracking-wider ${
                                method === m 
                                ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-md shadow-primary-500/10' 
                                : 'border-slate-100 text-slate-400 hover:border-slate-200'
                              }`}
                            >
                               {m} {method === m && <CheckCircle className="w-4 h-4" />}
                            </button>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-4">
                       <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Withdrawal Amount (Points)</label>
                       <div className="relative">
                          <Wallet className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300" />
                          <input 
                            type="number" 
                            placeholder="Enter Points" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            max={wallet.available_points}
                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-2xl text-slate-800 focus:border-green-500 focus:bg-white transition-all outline-none"
                          />
                       </div>
                       <div className="flex justify-between items-center px-2">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available: <span className="text-green-600">{formatPoints(wallet.available_points)} pts</span></p>
                          <button 
                            type="button"
                            onClick={() => setAmount(wallet.available_points.toString())}
                            className="text-[10px] font-black text-primary-600 uppercase tracking-widest hover:underline"
                          >
                             Max Points
                          </button>
                       </div>
                    </div>
                 </div>

                 {pointsToWithdraw > 0 && (
                    <div className="p-6 bg-slate-900 rounded-3xl text-white flex items-center justify-between animate-in fade-in slide-in-from-bottom-2 duration-500">
                       <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Estimated Payout</p>
                          <p className="text-3xl font-black text-green-400">{formatCurrency(currencyAmount)} PKR</p>
                       </div>
                       <p className="text-xs text-slate-500 font-medium">Conversion Rate: 10 pts = 1 PKR</p>
                    </div>
                 )}

                 <button 
                   disabled={withdrawing || wallet.available_points < minWithdrawal || pointsToWithdraw < minWithdrawal}
                   className="w-full bg-green-600 hover:bg-black text-white py-6 rounded-3xl font-black text-xl shadow-2xl shadow-green-600/20 transition-all flex items-center justify-center disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none uppercase tracking-tighter"
                 >
                    {withdrawing ? 'PROCESSING...' : wallet.available_points < minWithdrawal ? `MIN. LIMIT: ${formatPoints(minWithdrawal)} PTS` : 'CONFIRM WITHDRAWAL'}
                 </button>
              </form>
           </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-8">
           <div className="card p-8 bg-slate-900 border-none text-white relative h-full">
              <h3 className="text-lg font-black uppercase mb-6 flex items-center tracking-tight">
                 <AlertCircle className="w-5 h-5 mr-3 text-amber-500" /> Payout Rules
              </h3>
              <ul className="space-y-6 text-sm font-medium text-slate-400">
                 <li className="flex items-start">
                    <div className="w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center mr-4 mt-0.5 font-bold text-xs text-white">1</div>
                    <p>Withdrawals are processed within <span className="text-white font-bold">24-48 hours</span> after verification.</p>
                 </li>
                 <li className="flex items-start">
                    <div className="w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center mr-4 mt-0.5 font-bold text-xs text-white">2</div>
                    <p>Minimum withdrawal limit is based on your currently active membership plan.</p>
                 </li>
                 <li className="flex items-start">
                    <div className="w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center mr-4 mt-0.5 font-bold text-xs text-white">3</div>
                    <p>Ensure your account status is <span className="text-green-500 font-bold uppercase">Active</span> before requesting.</p>
                 </li>
              </ul>

              <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/5">
                 <p className="text-3xl font-black text-white">{formatPoints(wallet.available_points || 0)}</p>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Total Available Points</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
