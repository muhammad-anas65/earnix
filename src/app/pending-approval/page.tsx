'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Clock, CheckCircle, CreditCard, AlertCircle } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export default function PendingApprovalPage() {
  const router = useRouter();
  const { selectedPlan } = useAppStore();
  const [timeLeft, setTimeLeft] = useState({
    hours: 24,
    minutes: 0,
    seconds: 0,
  });
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is already active and get creation date
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/users/me');
        const result = await res.json();
        if (result.success) {
          if (result.data.user.status === 'active') {
            router.push('/dashboard');
            return true;
          }
          setCreatedAt(result.data.user.created_at);
        }
      } catch (err) {
        console.error('Error fetching user status:', err);
      } finally {
        setIsDataLoading(false);
      }
      return false;
    };
    
    // Initial check
    checkStatus();

    // Set up polling every 15 seconds
    const pollInterval = setInterval(async () => {
      const isApproved = await checkStatus();
      if (isApproved) {
        clearInterval(pollInterval);
      }
    }, 15000);

    return () => clearInterval(pollInterval);
  }, [router]);

  useEffect(() => {
    if (!createdAt) return;

    const creationTime = new Date(createdAt);
    const endTime = new Date(creationTime.getTime() + 24 * 60 * 60 * 1000); // 24 hours from creation
    
    const updateTimer = () => {
      const now = new Date();
      const diff = endTime.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft({ hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(interval);
  }, [createdAt]);
  
  const tips = [
    'Make sure your payment proof is clear and readable',
    'Double-check your phone number and email',
    'Keep your payment receipt safe',
    'Check your email for updates',
  ];

  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-indigo-50/50 rounded-full blur-[120px] -mr-32 -mt-32 opacity-40"></div>
      <div className="absolute bottom-0 left-0 w-[50vw] h-[50vh] bg-primary-50/30 rounded-full blur-[120px] -ml-32 -mb-32 opacity-40"></div>

      <div className="max-w-3xl w-full relative z-10">
        {/* Elite Branding */}
        <div className="text-center mb-12 lg:mb-16">
          <Link href="/" className="inline-flex items-center space-x-4">
            <div className="w-16 h-16 bg-slate-900 rounded-[2rem] flex items-center justify-center shadow-2xl">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <span className="text-4xl font-black text-slate-900 tracking-tighter">Earnix</span>
          </Link>
        </div>
        
        {/* Main Card */}
        <div className="premium-card !p-8 md:!p-16 text-center shadow-[0_32px_64px_-12px_rgba(0,0,0,0.06)]">
          <div className="relative inline-block mb-10">
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center relative z-10 border border-indigo-100 animate-pulse">
              <Clock className="w-12 h-12 text-indigo-600" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-100/50 rounded-full blur-xl scale-0 animate-ping opacity-30"></div>
          </div>
          
          <h1 className="text-3xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tighter uppercase lg:normal-case">Account Under Review</h1>
          <p className="text-lg text-slate-500 font-medium mb-12 max-w-lg mx-auto">
            Our audit team is verifying your registration. You will receive an email confirmation once activated.
          </p>
          
          {/* Countdown Timer */}
          <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 lg:p-12 mb-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16 blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-1000"></div>
            
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Estimated Activation Window</p>
            <div className="flex justify-center space-x-4 lg:space-x-8 px-4">
              {[
                { val: timeLeft.hours, label: 'Hours' },
                { val: timeLeft.minutes, label: 'Minutes' },
                { val: timeLeft.seconds, label: 'Seconds' }
              ].map((t, idx) => (
                <div key={idx} className="flex items-center">
                  <div className="text-center group-hover:transform group-hover:scale-110 transition-transform">
                    <div className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tighter px-4 py-2 bg-white rounded-2xl shadow-sm border border-slate-100">
                      {String(t.val).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">{t.label}</div>
                  </div>
                  {idx < 2 && <div className="text-2xl lg:text-4xl font-black text-slate-200 ml-4 lg:ml-8">:</div>}
                </div>
              ))}
            </div>
          </div>
          
          {/* Selected Plan Summary Dashboard Style */}
          {selectedPlan && (
            <div className="bg-slate-900 rounded-3xl p-6 lg:p-8 text-white text-left mb-12 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl -mr-24 -mt-24"></div>
               <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mr-4">
                       <CreditCard className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">ONBOARDING TIER</p>
                      <h4 className="text-xl font-black">{selectedPlan.display_name}</h4>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">PLAN VALUE</p>
                    <p className="text-2xl font-black text-white">₨ {selectedPlan.price.toLocaleString()}</p>
                  </div>
               </div>
            </div>
          )}
          
          {/* Progress Timeline Mobile Optimized */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 relative">
             {[
               { icon: CheckCircle, label: 'Registered', status: 'done', color: 'text-emerald-500', bg: 'bg-emerald-50' },
               { icon: Clock, label: 'In Review', status: 'current', color: 'text-amber-500', bg: 'bg-amber-50' },
               { icon: AlertCircle, label: 'Active', status: 'pending', color: 'text-slate-200', bg: 'bg-slate-50' }
             ].map((item, i) => (
                <div key={i} className="flex flex-row md:flex-col items-center gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', item.bg)}>
                    <item.icon className={cn('w-6 h-6', item.color)} />
                  </div>
                  <div className="text-left md:text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 leading-none">Status</p>
                    <p className="text-sm font-black text-slate-900 tracking-tight leading-none">{item.label}</p>
                  </div>
                </div>
             ))}
          </div>
          
          {/* Dynamic Guidance */}
          <div className="premium-card bg-slate-50 border-slate-100 !p-8 lg:!p-10 text-left">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-indigo-600" /> Expedited Flow Guidance
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-100 group hover:border-indigo-100 transition-colors">
                  <div className="w-6 h-6 bg-slate-50 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    {index + 1}
                  </div>
                  <p className="text-xs text-slate-600 font-bold leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Help Signal */}
        <div className="mt-16 text-center space-y-4">
          <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Operational Assistance Required?</p>
          <a 
            href="mailto:support@earnix.pk" 
            className="inline-flex items-center px-10 py-5 bg-white border border-slate-100 shadow-xl rounded-2xl text-xs font-black text-indigo-600 uppercase tracking-widest hover:bg-slate-50 transition-all hover:-translate-y-1"
          >
            Signal Liaison Node (Support)
          </a>
        </div>
      </div>
    </div>
  );
}
