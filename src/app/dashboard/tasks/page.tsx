'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Star,
  Target,
  ChevronRight,
  TrendingUp,
  Clock,
  Zap
} from 'lucide-react';
import { cn, formatPoints } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  description: string;
  points_min: number;
  points_max: number;
  task_type: string;
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

  if (isLoading || !dailyStats) {
    return <div className="p-20 text-center animate-pulse font-bold text-slate-400">Syncing available tasks...</div>;
  }

  const dailyProgress = { 
    completed: dailyStats.tasks_completed, 
    limit: dailyStats.daily_limit,
    points: dailyStats.points_earned
  };

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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Available Tasks</h1>
        <p className="text-gray-500 font-medium">Complete these simple tasks to boost your points balance immediately.</p>
      </div>

      {/* Progress Card */}
      <div className="card p-8 bg-white shadow-sm border border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-12 translate-x-1/2 -translate-y-1/2 bg-primary-50 rounded-full w-48 h-48 -z-0" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <h2 className="text-xl font-black text-slate-800 flex items-center">
              <Clock className="w-5 h-5 mr-3 text-primary-500" /> Daily Target
            </h2>
            <p className="text-gray-500 font-medium mt-1">
              You've completed <span className="text-primary-600 font-black">{dailyProgress.completed}</span> out of <span className="font-bold text-slate-800">{dailyProgress.limit}</span> tasks today.
            </p>
          </div>
          <div className="bg-slate-900 text-white px-8 py-4 rounded-2xl text-center shadow-xl shadow-slate-900/10">
            <span className="text-2xl font-black block">{formatPoints(dailyProgress.points)}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Earned Today</span>
          </div>
        </div>

        <div className="mt-8">
          <div className="w-full bg-slate-100 rounded-full h-4 ring-1 ring-slate-100">
            <div 
              className="bg-gradient-to-r from-primary-500 to-indigo-600 h-full rounded-full transition-all duration-1000"
              style={{ width: `${(dailyProgress.completed / dailyProgress.limit) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid gap-6">
        {tasks.length === 0 ? (
           <div className="card p-20 text-center">
              <Zap className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500 font-bold">No tasks available right now. Check back later!</p>
           </div>
        ) : tasks.map((task) => (
          <div key={task.id} className="card p-6 hover:shadow-xl hover:-translate-y-1 transition-all border border-transparent hover:border-primary-100 group">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 text-center md:text-left">
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-4xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                  {getTaskIcon(task.task_type)}
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-2xl tracking-tight">{task.title}</h3>
                  <p className="text-gray-500 mt-1 font-medium max-w-lg">{task.description}</p>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
                    <div className="badge bg-amber-50 text-amber-700 border-amber-100 flex items-center font-bold px-3 py-1.5 uppercase tracking-widest text-[10px]">
                      <Star className="w-3 h-3 mr-2 fill-amber-500" /> {task.points_min}-{task.points_max} pts Reward
                    </div>
                    <div className="badge bg-slate-100 text-slate-600 border-slate-200 font-black px-3 py-1.5 uppercase tracking-widest text-[10px]">
                      {task.task_type} Task
                    </div>
                  </div>
                </div>
              </div>
              <Link 
                href={`/dashboard/tasks/${task.id}`} 
                className="w-full md:w-auto bg-primary-600 hover:bg-black text-white px-10 py-5 rounded-2xl font-black shadow-lg shadow-primary-600/20 transition-all flex items-center justify-center"
              >
                GO TO TASK <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
