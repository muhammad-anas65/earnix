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
    <div className="space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Available Balance */}
        <div className="card p-7 hover-scale border-l-4 border-green-500 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center">
              <Wallet className="w-7 h-7 text-green-600" />
            </div>
            <span className="text-green-600 text-xs font-bold bg-green-50 px-3 py-1 rounded-full border border-green-100 uppercase tracking-wider">
              Ready
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            {formatPoints(wallet.available_points)} pts
          </h3>
          <p className="text-gray-500 font-medium text-sm">
            ≈ {formatCurrency(wallet.available_points * 0.1)}
          </p>
        </div>
        
        {/* Pending Balance */}
        <div className="card p-7 hover-scale border-l-4 border-yellow-500 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center">
              <Clock className="w-7 h-7 text-yellow-600" />
            </div>
            <span className="text-yellow-600 text-xs font-bold bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100 uppercase tracking-wider">
              Holding
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            {formatPoints(wallet.pending_points)} pts
          </h3>
          <p className="text-gray-500 font-medium text-sm">Verification in progress</p>
        </div>
        
        {/* Today's Progress */}
        <div className="card p-7 hover-scale border-l-4 border-primary-500 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center">
              <Zap className="w-7 h-7 text-primary-600" />
            </div>
            <span className="text-primary-600 text-xs font-bold bg-primary-50 px-3 py-1 rounded-full border border-primary-100 uppercase tracking-wider">
              Daily
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            {dailyStats.tasks_completed}/{dailyStats.daily_limit} tasks
          </h3>
          <p className="text-gray-500 font-medium text-sm">Task limit resets daily</p>
        </div>
        
        {/* Total Earned */}
        <div className="card p-7 hover-scale border-l-4 border-indigo-500 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center">
              <Award className="w-7 h-7 text-indigo-600" />
            </div>
            <span className="text-indigo-600 text-xs font-bold bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 uppercase tracking-wider">
              Total
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            {formatPoints(wallet.total_earned)} pts
          </h3>
          <p className="text-gray-500 font-medium text-sm">Overall performance</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Tasks Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card overflow-hidden">
            <div className="p-7 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Earn Points</h2>
                  <p className="text-gray-500 mt-0.5 text-sm">Complete available tasks to fill your wallet</p>
                </div>
                <Link href="/dashboard/tasks" className="text-primary-600 hover:text-primary-700 font-bold text-sm bg-primary-50 px-4 py-2 rounded-lg transition-colors">
                  View All
                </Link>
              </div>
              
              {/* Daily Progress Bar */}
              <div className="mt-8">
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-slate-600 font-bold">Daily Task Limit</span>
                  <span className="font-bold text-primary-600">{dailyStats.tasks_completed} / {dailyStats.daily_limit} completed</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-4 relative overflow-hidden ring-4 ring-white shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-indigo-600 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min((dailyStats.tasks_completed / dailyStats.daily_limit) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {tasks.length === 0 ? (
                <div className="p-20 text-center">
                   <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                   <p className="text-gray-500 font-medium">No tasks currently available for your plan.</p>
                </div>
              ) : tasks.map((task) => (
                <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-6">
                      <div className="w-16 h-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-3xl shadow-sm group-hover:shadow-md transition-shadow">
                        {getTaskIcon(task.task_type)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-xl">{task.title}</h3>
                        <p className="text-gray-500 mt-1 line-clamp-1">{task.description}</p>
                        <div className="flex items-center mt-3 bg-yellow-50 w-fit px-3 py-1 rounded-lg border border-yellow-100">
                          <Star className="w-4 h-4 text-yellow-500 mr-2 fill-yellow-500" />
                          <span className="font-bold text-yellow-700 text-sm">
                            {task.points_min}-{task.points_max} pts reward
                          </span>
                        </div>
                      </div>
                    </div>
                    <Link 
                      href={`/dashboard/tasks/${task.id}`}
                      className="bg-slate-900 hover:bg-black text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-slate-900/10 transition-all flex items-center"
                    >
                      Process <ChevronRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          {/* Referral Card */}
          <div className="p-8 bg-gradient-to-br from-indigo-600 via-primary-600 to-primary-700 rounded-3xl text-white shadow-xl shadow-primary-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 translate-x-1/2 -translate-y-1/2 bg-white/10 rounded-full w-40 h-40 blur-2xl" />
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <h3 className="font-black text-2xl uppercase tracking-tighter">Refer & Earn</h3>
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <p className="text-white/80 font-medium mb-8 leading-relaxed relative z-10">
              Earn an extra <span className="text-white font-bold">500 points</span> for every friend who joins Earnix with your code!
            </p>
            
            <div className="bg-black/10 backdrop-blur-md rounded-2xl p-5 mb-8 border border-white/5 relative z-10">
              <p className="text-[10px] uppercase font-black tracking-widest text-white/50 mb-2">My Exclusive Code</p>
              <p className="font-mono font-black text-3xl tracking-widest">{user.referral_code?.toUpperCase()}</p>
            </div>
            
            <button className="w-full bg-white text-primary-700 font-black py-4 rounded-2xl hover:bg-slate-50 transition-all shadow-lg shadow-black/10 relative z-10">
              INVITE FRIENDS
            </button>
          </div>

          {/* Activity Feed */}
          <div className="card overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Referral Network</h3>
              <Link href="/dashboard/referrals" className="text-xs text-primary-600 font-bold uppercase hover:underline">Manage</Link>
            </div>
            <div className="divide-y divide-gray-50">
              {mockReferrals.map((ref) => (
                <div key={ref.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-11 h-11 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500 border-2 border-white shadow-sm">
                      {getInitials(ref.referred_name)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{ref.referred_name}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{formatDateTime(ref.created_at)}</p>
                    </div>
                  </div>
                  <span className={cn(
                    'text-[10px] font-black px-3 py-1.5 rounded-lg border uppercase tracking-widest',
                    ref.status === 'qualified' 
                      ? 'bg-green-50 text-green-700 border-green-100' 
                      : 'bg-amber-50 text-amber-700 border-amber-100'
                  )}>
                    {ref.status === 'qualified' ? `+${ref.reward_points} pts` : 'In Progress'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Support Widget */}
          <div className="card p-6 bg-slate-50 border-2 border-dashed border-slate-200 flex items-center space-x-4">
             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <Settings className="w-6 h-6 text-slate-400" />
             </div>
             <div>
                <p className="text-sm font-bold text-slate-800">Support Center</p>
                <p className="text-xs text-slate-500">Need help? We're available 24/7</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
