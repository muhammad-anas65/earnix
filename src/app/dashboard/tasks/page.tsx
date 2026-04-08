'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  TrendingUp,
  Wallet,
  Gift,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ChevronRight,
  Menu,
  X,
  Bell as BellIcon,
  Star,
  Target,
  Settings,
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { cn, formatPoints, formatCurrency } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  description: string;
  points_min: number;
  points_max: number;
  task_type: string;
}

// Real tasks are fetched from API

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', active: true },
  { icon: Target, label: 'Tasks', href: '/dashboard/tasks', active: false },
  { icon: Gift, label: 'Referrals', href: '/dashboard/referrals', active: false },
  { icon: Wallet, label: 'Wallet', href: '/dashboard/wallet', active: false },
  { icon: TrendingUp, label: 'Withdraw', href: '/dashboard/withdraw', active: false },
  { icon: BellIcon, label: 'Notifications', href: '/dashboard/notifications', active: false },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings', active: false },
];

export default function TasksPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>;
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Mobile Overlay */}
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
          {navItems.map((item) => (
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

      {/* Main Content */}
      <main className="flex-1 lg:ml-0">
        {/* Header */}
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
                <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
                <p className="text-gray-500">Complete tasks and earn points</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-primary-100 text-primary-700 px-4 py-2 rounded-xl font-semibold">
                {dailyProgress.completed}/{dailyProgress.limit} today
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 lg:p-10">
          {/* Progress Card */}
          <div className="card p-8 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Daily Progress</h2>
                <p className="text-gray-500">{dailyProgress.limit - dailyProgress.completed} tasks remaining today</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold text-primary-600">{formatPoints(dailyProgress.points)}</span>
                <p className="text-gray-500">points earned today</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-gradient-primary h-4 rounded-full transition-all"
                style={{ width: `${(dailyProgress.completed / dailyProgress.limit) * 100}%` }}
              />
            </div>
          </div>

          {/* Tasks List */}
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="card p-6 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-5">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl">
                      {getTaskIcon(task.task_type)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{task.title}</h3>
                      <p className="text-gray-500 mt-1">{task.description}</p>
                      <div className="flex items-center mt-3">
                        <Star className="w-5 h-5 text-yellow-400 mr-2" />
                        <span className="font-semibold text-gray-700">
                          {task.points_min}-{task.points_max} points
                        </span>
                        <span className="ml-4 badge bg-gray-100 text-gray-600 capitalize">
                          {task.task_type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/dashboard/tasks/${task.id}`} className="btn-primary py-3 px-8 text-center">
                    Start
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
