'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Wallet, 
  Gift, 
  CreditCard, 
  Clock, 
  ChevronRight,
  Zap,
  Users,
  Star,
  ArrowUpRight,
  Target,
  Award,
  Menu,
  X,
  Bell as BellIcon,
  Settings
} from 'lucide-react';
import { cn, formatCurrency, formatPoints, formatDateTime, getInitials, DEFAULT_PLANS } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  description: string;
  points_min: number;
  points_max: number;
  task_type: string;
}

interface Referral {
  id: string;
  referred_name: string;
  status: string;
  reward_points: number;
  created_at: string;
}

const mockReferrals: Referral[] = [
  { id: '1', referred_name: 'Fatima Bibi', status: 'qualified', reward_points: 250, created_at: '2024-01-15' },
  { id: '2', referred_name: 'Muhammad Ali', status: 'pending', reward_points: 0, created_at: '2024-01-18' },
];

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [dailyStats, setDailyStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const resp = await fetch('/api/users/me');
      if (!resp.ok) throw new Error('Failed to fetch user data');
      const result = await resp.json();
      
      if (result.success) {
        setUser(result.data.user);
        setWallet(result.data.wallet);
        setDailyStats(result.data.dailyStats);
      } else {
        throw new Error(result.error || 'Authentication error');
      }

      const tasksResp = await fetch('/api/tasks');
      const tasksResult = await tasksResp.json();
      if (tasksResult.success) {
        setTasks(tasksResult.data.tasks?.slice(0, 5) || []);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
          <X className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-500 mb-6 max-w-md">{error || "We couldn't load your profile. Please check your connection and try again."}</p>
        <button 
          onClick={() => fetchData()}
          className="bg-primary-600 text-white px-6 py-2 rounded-xl font-bold"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  const getTaskIcon = (type: string) => {
    const icons: Record<string, string> = {
      survey: '📊',
      watch: '🎬',
      download: '📥',
      signup: '📝',
      click: '👆',
    };
    return icons[type] || '👆';
  };

  return (
    <div className="space-y-8 lg:space-y-12">
      {/* Dynamic Welcome Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tight">Your Earnings</h2>
          <p className="text-slate-500 font-medium mt-2">Manage your assets and track your daily performance.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link href="/dashboard/withdraw" className="btn-premium py-3 px-6 text-sm">Withdraw Cash</Link>
          <Link href="/dashboard/tasks" className="btn-ghost py-3 px-6 text-sm">View Tasks</Link>
        </div>
      </div>

      {/* Main Balance Card - High Impact */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-primary-600 to-primary-700 rounded-[2.5rem] p-8 lg:p-12 text-white shadow-2xl shadow-primary-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="relative z-10 grid lg:grid-cols-3 gap-12 lg:gap-8 items-center">
           <div className="lg:col-span-2">
             <div className="flex items-center space-x-3 mb-6">
                <Wallet className="w-6 h-6 text-indigo-200" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-100">Total Available Points</span>
             </div>
             <div className="flex flex-col md:flex-row md:items-baseline md:space-x-4">
                <h3 className="text-5xl lg:text-7xl font-black tracking-tighter mb-2">{formatPoints(wallet.available_points)}</h3>
                <span className="text-2xl text-indigo-200 font-bold">PTS</span>
             </div>
             <p className="text-xl text-indigo-100/80 font-medium mt-2">
               Approximately <span className="text-white font-black">{formatCurrency(wallet.available_points * 0.1)}</span> Ready
             </p>
           </div>
           
           <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8">
              <div className="flex items-center justify-between mb-6">
                <Clock className="w-5 h-5 text-indigo-200" />
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Pending Review</span>
              </div>
              <p className="text-3xl font-black mb-1">{formatPoints(wallet.pending_points)} <span className="text-sm font-bold opacity-60">PTS</span></p>
              <p className="text-xs font-medium text-indigo-100/60 uppercase tracking-widest">Verification Status: active</p>
           </div>
        </div>
      </div>

      {/* Grid: Tasks & Secondary Metrics */}
      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2 space-y-10">
          
          {/* Daily Progress */}
          <div className="premium-card !p-10">
            <div className="flex items-center justify-between mb-10">
               <div>
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight">Daily Efficiency</h3>
                 <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-tight">Track your points generation velocity</p>
               </div>
               <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary-600 font-black">
                  {Math.round((dailyStats.tasks_completed / dailyStats.daily_limit) * 100)}%
               </div>
            </div>
            
            <div className="relative pt-1">
              <div className="flex mb-4 items-center justify-between">
                <div>
                  <span className="text-[10px] font-black inline-block py-1 px-3 uppercase rounded-full text-primary-600 bg-primary-50">
                    Velocity Tracking
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black inline-block text-primary-600 uppercase tracking-widest">
                    {dailyStats.tasks_completed} / {dailyStats.daily_limit} TARGET REACHED
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-6 mb-4 text-xs flex rounded-full bg-slate-100 ring-8 ring-slate-50/50">
                <div 
                  style={{ width: `${Math.min((dailyStats.tasks_completed / dailyStats.daily_limit) * 100, 100)}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600 transition-all duration-1000"
                ></div>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-6">Next Reset In: 08:42:12</p>
            </div>
          </div>

          {/* Quick Tasks */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
               <h3 className="text-2xl font-black text-slate-900 tracking-tight">Priority Work</h3>
               <Link href="/dashboard/tasks" className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">All Tasks</Link>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {tasks.length === 0 ? (
                <div className="premium-card text-center !p-20">
                   <Target className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                   <p className="text-slate-400 font-bold uppercase tracking-widest">No Priority Tasks Match Your Plan</p>
                </div>
              ) : tasks.map((task) => (
                <div key={task.id} className="premium-card group !p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-900 hover:text-white transition-all duration-500">
                  <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-white/10 group-hover:scale-110 transition-all">
                      {getTaskIcon(task.task_type)}
                    </div>
                    <div>
                      <h4 className="font-black tracking-tight text-lg mb-1">{task.title}</h4>
                      <p className="text-slate-400 group-hover:text-slate-300 text-sm font-medium line-clamp-1">{task.description}</p>
                      <div className="mt-3 flex items-center space-x-3">
                         <div className="px-3 py-1 bg-amber-50 group-hover:bg-amber-500 group-hover:text-white rounded-lg text-amber-600 text-[10px] font-black uppercase tracking-widest transition-colors">
                            REWARD: {task.points_max} PTS
                         </div>
                         <div className="px-3 py-1 bg-indigo-50 group-hover:bg-indigo-500 group-hover:text-white rounded-lg text-indigo-600 text-[10px] font-black uppercase tracking-widest transition-colors">
                            {task.task_type}
                         </div>
                      </div>
                    </div>
                  </div>
                  <Link 
                    href={`/dashboard/tasks/${task.id}`}
                    className="md:w-32 py-4 bg-slate-900 text-white group-hover:bg-white group-hover:text-slate-900 rounded-2xl text-center text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95"
                  >
                    START WORK
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Rail: Community & Stats */}
        <div className="space-y-8">
           {/* High Impact Stats Card */}
           <div className="premium-card !p-8 border-none bg-slate-900 text-white shadow-2xl shadow-slate-200">
              <div className="flex items-center space-x-3 mb-8">
                 <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
                    <TrendingUp className="w-6 h-6 text-white" />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Career Earnings</span>
              </div>
              <p className="text-4xl font-black mb-2 tracking-tighter">{formatPoints(wallet.total_earned)}</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-10">Earnings Velocity: HIGH</p>
              
              <div className="space-y-6 mb-8">
                 <div className="flex items-center justify-between text-xs py-4 border-t border-white/5">
                    <span className="text-slate-400 font-bold uppercase tracking-widest">Global Rank</span>
                    <span className="font-black text-indigo-400">#1,204</span>
                 </div>
                 <div className="flex items-center justify-between text-xs py-4 border-t border-white/5">
                    <span className="text-slate-400 font-bold uppercase tracking-widest">Active Referrals</span>
                    <span className="font-black text-secondary">08 QUALIFIED</span>
                 </div>
              </div>
           </div>

           {/* Referral Action */}
           <div className="premium-card !p-10 !bg-secondary-50 border-secondary-100/50">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-8">
                 <Users className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter">Refer & Scale</h3>
              <p className="text-slate-500 font-medium text-sm mb-8 leading-relaxed">
                 Scale your earnings exponentially by inviting your network. You get <span className="text-secondary font-black">500 PTS</span> for every successful approval.
              </p>
              
              <div className="p-5 bg-white rounded-2xl border border-secondary-200 mb-8 border-dashed">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">My Code:</p>
                 <p className="text-2xl font-black text-slate-900 tracking-[0.2em]">{user.referral_code?.toUpperCase()}</p>
              </div>
              
              <button className="btn-premium !bg-secondary !shadow-secondary/20 w-full py-5 text-sm">
                 COPY INVITE LINK
              </button>
           </div>

           {/* Support widget */}
           <div className="p-8 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                 <Settings className="w-6 h-6 text-slate-400" />
              </div>
              <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-2">Support Protocol</h4>
              <p className="text-xs text-slate-400 font-medium">Verified support response within 12 hours.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
