'use client';

import { useState, useEffect } from 'react';
import { 
  Copy,
  Share2,
  Users,
  CheckCircle,
  Clock,
  Gift,
  TrendingUp,
  Zap,
  Loader2,
  RefreshCw,
  X
} from 'lucide-react';
import { cn, formatPoints, formatDate, getInitials } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Referral {
  id: string;
  referred_name: string;
  referred_email: string;
  status: 'pending' | 'qualified' | 'expired';
  reward_points: number;
  created_at: string;
}

interface ReferralStats {
  totalReferrals: number;
  qualifiedReferrals: number;
  pendingReferrals: number;
  totalEarned: number;
}

export default function ReferralsPage() {
  const [referralCode, setReferralCode] = useState('');
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [stats, setStats] = useState<ReferralStats>({ totalReferrals: 0, qualifiedReferrals: 0, pendingReferrals: 0, totalEarned: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const resp = await fetch('/api/referrals');
      const result = await resp.json();
      if (result.success) {
        setReferralCode(result.data.referralCode);
        setReferrals(result.data.referrals);
        setStats(result.data.stats);
      } else {
        setError(result.error || 'Failed to load referrals');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load referral data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const copyCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode.toUpperCase());
      setCopied(true);
      toast.success('Referral code copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyLink = () => {
    const link = `${window.location.origin}/signup?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    toast.success('Referral link copied!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const shareCode = async () => {
    const shareData = {
      title: 'Join Earnix!',
      text: `Use my referral code ${referralCode.toUpperCase()} to join Earnix and start earning!`,
      url: `${window.location.origin}/signup?ref=${referralCode}`,
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (e) {
        copyLink();
      }
    } else {
      copyLink();
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl bg-slate-200 animate-pulse h-12 w-48" />
        <div className="rounded-2xl bg-gradient-to-br from-indigo-200 to-violet-200 animate-pulse h-64" />
        <div className="grid sm:grid-cols-4 gap-4">
          {Array.from({length: 4}).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 animate-pulse h-24 border border-slate-100" />
          ))}
        </div>
        <div className="bg-white rounded-2xl p-6 animate-pulse border border-slate-100 h-64" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-5">
          <X className="w-9 h-9 text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Couldn&apos;t load referrals</h2>
        <p className="text-slate-400 text-sm mb-6 max-w-sm">{error}</p>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-semibold text-sm shadow-md shadow-indigo-500/20 transition-all active:scale-95"
        >
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Referrals</h1>
        <p className="text-slate-400 text-sm mt-1">Invite friends and earn bonus points when they join.</p>
      </div>

      {/* ── REFERRAL CODE HERO ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 rounded-2xl p-6 lg:p-8 text-white shadow-xl shadow-indigo-500/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/20 rounded-full blur-3xl -ml-24 -mb-24 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
              <Gift className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h2 className="text-lg font-black">Invite Friends & Earn</h2>
              <p className="text-xs text-indigo-200">Share your unique code and earn rewards!</p>
            </div>
          </div>

          {/* Referral Code Box */}
          <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl p-5 mb-5">
            <p className="text-[10px] text-indigo-200 font-bold uppercase tracking-widest mb-2">Your Unique Referral Code</p>
            <div className="flex items-center justify-between gap-4">
              <p className="font-mono font-black text-3xl lg:text-4xl tracking-widest">
                {referralCode?.toUpperCase() || 'N/A'}
              </p>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={copyCode}
                  className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-all active:scale-95"
                  title="Copy code"
                >
                  {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
                <button
                  onClick={shareCode}
                  className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-all active:scale-95"
                  title="Share"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Copy Link Button */}
          <button
            onClick={copyLink}
            className={cn(
              'flex items-center justify-center gap-2 w-full font-bold text-sm py-3 rounded-xl transition-all active:scale-95',
              copiedLink
                ? 'bg-emerald-500 text-white'
                : 'bg-white text-indigo-700 hover:bg-indigo-50 shadow-lg shadow-black/10'
            )}
          >
            {copiedLink ? (
              <><CheckCircle className="w-4 h-4" /> Link Copied!</>
            ) : (
              <><Copy className="w-4 h-4" /> Copy Referral Link</>
            )}
          </button>
        </div>
      </div>

      {/* ── STATS ROW ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Referrals', value: stats.totalReferrals, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Qualified', value: stats.qualifiedReferrals, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Pending', value: stats.pendingReferrals, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Points Earned', value: formatPoints(stats.totalEarned), icon: TrendingUp, color: 'text-violet-600', bg: 'bg-violet-50' },
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

      {/* ── HOW IT WORKS ── */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-5">How It Works</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: '1', title: 'Share Your Code', desc: 'Send your unique referral code to friends' },
            { step: '2', title: 'Friend Signs Up', desc: 'They create an account using your code' },
            { step: '3', title: 'Earn Rewards', desc: 'Get points as soon as they sign up' },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-4">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-black text-sm flex-shrink-0 border border-indigo-100">
                {item.step}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">{item.title}</h4>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── REFERRALS LIST ── */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Your Referrals</h3>
          <p className="text-xs text-slate-400 mt-0.5">People who joined using your code</p>
        </div>

        {referrals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border-2 border-dashed border-slate-200">
              <Users className="w-8 h-8 text-slate-200" />
            </div>
            <h4 className="text-base font-bold text-slate-500 mb-1">No referrals yet</h4>
            <p className="text-xs text-slate-300 max-w-sm">Share your referral code with friends and family to start earning bonus points!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {referrals.map((ref) => (
              <div key={ref.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                    {getInitials(ref.referred_name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{ref.referred_name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Joined {formatDate(ref.created_at)}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  {ref.status === 'qualified' ? (
                    <div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                        <CheckCircle className="w-3 h-3" /> Qualified
                      </span>
                      <p className="text-xs font-bold text-emerald-600 mt-1">+{ref.reward_points} pts</p>
                    </div>
                  ) : (
                    <div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                        <Clock className="w-3 h-3" /> Pending
                      </span>
                      <p className="text-xs text-slate-400 mt-1">Reward processing</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
