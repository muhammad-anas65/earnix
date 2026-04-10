'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Star,
  Target,
  ChevronRight,
  TrendingUp,
  Clock,
  Zap,
  ArrowRight
} from 'lucide-react';
import { cn, formatPoints } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  description: string;
  reward_points: number;
  difficulty: string;
  estimated_time: string;
  type: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dailyStats, setDailyStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const resp = await fetch('/api/tasks');
      const result = await resp.json();
      if (result.success) {
        setTasks(result.data.tasks);
        setDailyStats(result.data.dailyStats);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-12">
        <div className="h-32 bg-slate-100 animate-pulse rounded-[3rem] w-2/3" />
        <div className="h-64 bg-slate-100 animate-pulse rounded-[3rem]" />
        <div className="space-y-6">
          <div className="h-40 bg-slate-50 animate-pulse rounded-[2.5rem]" />
          <div className="h-40 bg-slate-50 animate-pulse rounded-[2.5rem]" />
        </div>
      </div>
    );
  }

  const dailyProgress = { 
    completed: dailyStats?.tasks_completed || 0, 
    limit: dailyStats?.daily_limit || 2,
    points: dailyStats?.points_earned || 0
  };

  const getTaskIcon = (type: string) => {
    const icons: Record<string, string> = {
      daily_checkin: '📅',
      quiz: '❓',
      interaction_task: '🖱️',
      profile_completion: '👤',
      phone_verification: '📱',
      onboarding_task: '🌟',
      deposit_bonus: '💰',
      referral_milestone: '🏆',
      custom: '🎯'
    };
    return icons[type] || '🎯';
  };

  return (
    <div className="space-y-10 lg:space-y-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl lg:text-6xl font-black text-slate-900 tracking-tighter uppercase">Verified Tasks</h1>
          <p className="text-slate-500 font-medium mt-2">Browse daily opportunities and secure your rewards instantly.</p>
        </div>
        <div className="flex items-center space-x-2 px-6 py-3 bg-slate-900 text-white rounded-2xl shadow-xl">
           <Zap className="w-5 h-5 text-indigo-400" />
           <span className="text-[10px] font-black uppercase tracking-widest leading-none">Global Sync: Active</span>
        </div>
      </div>

      {/* High-Impact Progress Monitor */}
      <div className="premium-card relative overflow-hidden !p-0">
         <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/50 rounded-full blur-[100px] -mr-48 -mt-48 opacity-40"></div>
         <div className="p-8 lg:p-12 relative z-10 grid md:grid-cols-3 items-center gap-12">
            <div className="md:col-span-2">
               <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100">
                     <Clock className="w-5 h-5 text-indigo-600" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Daily Quota Utilization</span>
               </div>
               <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-none mb-4 uppercase">
                  Efficiency Index
               </h2>
               <p className="text-slate-500 font-medium">
                  You've fulfilled <span className="text-indigo-600 font-black">{dailyProgress.completed} tasks</span> out of your <span className="font-bold text-slate-900">{dailyProgress.limit} daily unit capacity</span>.
               </p>
            </div>
            
            <div className="bg-slate-900 rounded-[2rem] p-10 text-white shadow-2xl shadow-slate-200 text-center">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Total Points Harvested</p>
               <h3 className="text-4xl font-black tracking-tighter mb-1 text-primary-400">{formatPoints(dailyProgress.points)}</h3>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">24H CYCLE</p>
            </div>
         </div>
         
         <div className="px-8 lg:px-12 pb-12">
            <div className="relative pt-1">
              <div className="overflow-hidden h-4 flex rounded-full bg-slate-100 ring-[12px] ring-slate-50/50">
                <div 
                  style={{ width: `${Math.min((dailyProgress.completed / dailyProgress.limit) * 100, 100)}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600 transition-all duration-1000 ease-out"
                ></div>
              </div>
            </div>
         </div>
      </div>

      {/* Optimized Task Feed */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Operational Feed</h3>
           <div className="flex items-center space-x-4">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Real-time Updates</span>
           </div>
        </div>

        <div className="grid gap-6">
          {tasks.length === 0 ? (
             <div className="premium-card !p-32 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border-2 border-dashed border-slate-200">
                   <Target className="w-10 h-10 text-slate-200" />
                </div>
                <h4 className="text-2xl font-black text-slate-900 mb-2 tracking-tight uppercase">
                   {dailyProgress.completed >= dailyProgress.limit 
                     ? "Daily Quota Reached" 
                     : "No Tasks Available"}
                </h4>
                <p className="text-slate-400 font-medium max-w-sm mx-auto">
                   {dailyProgress.completed >= dailyProgress.limit 
                     ? "You have successfully completed your tasks for today. Return tomorrow for a fresh quota." 
                     : "There are no new tasks in your segment at the moment. Please check back shortly for updates."}
                </p>
             </div>
          ) : tasks.map((task) => (
            <div key={task.id} className="premium-card group !p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8 hover:bg-slate-950 hover:text-white transition-all duration-500">
              <div className="flex items-start lg:items-center space-x-8">
                <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] flex items-center justify-center text-5xl shadow-sm group-hover:bg-white/10 group-hover:scale-105 transition-all duration-500 shrink-0">
                  {getTaskIcon(task.type)}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-indigo-50 group-hover:bg-indigo-600 rounded-lg text-indigo-600 group-hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">
                       {task.type.replace('_', ' ')}
                    </span>
                    <span className="px-3 py-1 bg-emerald-50 group-hover:bg-emerald-600 rounded-lg text-emerald-600 group-hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">
                       REWARD: {task.reward_points} PTS
                    </span>
                    <span className="px-3 py-1 bg-slate-100 group-hover:bg-white/10 rounded-lg text-slate-500 group-hover:text-slate-300 text-[10px] font-black uppercase tracking-widest transition-colors">
                       {task.difficulty} • {task.estimated_time}
                    </span>
                  </div>
                  <h3 className="font-black text-3xl tracking-tight mb-3 uppercase">{task.title}</h3>
                  <p className="text-slate-500 group-hover:text-slate-400 font-medium max-w-xl text-lg leading-relaxed">{task.description}</p>
                </div>
              </div>
              <Link 
                href={`/dashboard/tasks/${task.id}`} 
                className="bg-slate-900 group-hover:bg-white text-white group-hover:text-slate-900 py-6 px-14 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-slate-200 group-hover:shadow-none transition-all active:scale-95 flex items-center shrink-0"
              >
                EXECUTE <ArrowRight className="w-4 h-4 ml-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
