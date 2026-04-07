'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Wallet, 
  Gift, 
  CreditCard, 
  Bell, 
  Settings,
  LogOut,
  TrendingUp,
  CheckCircle,
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
  Bell as BellIcon
} from 'lucide-react';
import { cn, formatCurrency, formatPoints, formatDateTime, getInitials, DEFAULT_PLANS } from '@/lib/utils';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  referral_code: string;
  plan_id: string;
  plan?: typeof DEFAULT_PLANS[0];
  status: string;
}

interface WalletData {
  available_points: number;
  pending_points: number;
  locked_points: number;
  total_earned: number;
  total_withdrawn: number;
}

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

const mockUser: User = {
  id: '1',
  name: 'Ahmed Khan',
  email: 'ahmed@example.com',
  phone: '+92 300 1234567',
  referral_code: 'ERNX-ABC123',
  plan_id: 'premium',
  plan: DEFAULT_PLANS.find(p => p.id === 'premium'),
  status: 'active',
};

const mockWallet: WalletData = {
  available_points: 2450,
  pending_points: 320,
  locked_points: 500,
  total_earned: 5420,
  total_withdrawn: 1200,
};

const mockTasks: Task[] = [
  { id: '1', title: 'Complete Survey Task', description: 'Answer a short survey', points_min: 20, points_max: 50, task_type: 'survey' },
  { id: '2', title: 'Watch Video Ad', description: 'Watch for 30 seconds', points_min: 15, points_max: 30, task_type: 'watch' },
  { id: '3', title: 'App Download', description: 'Download and install', points_min: 25, points_max: 50, task_type: 'download' },
  { id: '4', title: 'Daily Check-in', description: 'Login and claim bonus', points_min: 10, points_max: 20, task_type: 'click' },
  { id: '5', title: 'Sign Up Offer', description: 'Sign up for partner app', points_min: 30, points_max: 80, task_type: 'signup' },
];

const mockReferrals: Referral[] = [
  { id: '1', referred_name: 'Fatima Bibi', status: 'qualified', reward_points: 250, created_at: '2024-01-15' },
  { id: '2', referred_name: 'Muhammad Ali', status: 'pending', reward_points: 0, created_at: '2024-01-18' },
];

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', active: true },
  { icon: Target, label: 'Tasks', href: '/dashboard/tasks', active: false },
  { icon: Gift, label: 'Referrals', href: '/dashboard/referrals', active: false },
  { icon: Wallet, label: 'Wallet', href: '/dashboard/wallet', active: false },
  { icon: CreditCard, label: 'Withdraw', href: '/dashboard/withdraw', active: false },
  { icon: BellIcon, label: 'Notifications', href: '/dashboard/notifications', active: false },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings', active: false },
];

export default function DashboardPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      {/* Sidebar - Desktop */}
      <aside className={cn(
        'bg-white border-r border-gray-200 fixed left-0 top-0 h-full z-40 transition-all duration-300 hidden lg:block',
        sidebarOpen ? 'w-72' : 'w-20'
      )}>
        <div className="p-6 border-b border-gray-100">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            {sidebarOpen && <span className="text-2xl font-bold text-gradient">Earnix</span>}
          </Link>
        </div>
        
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center px-5 py-4 rounded-xl transition-all',
                item.active 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              <item.icon className="w-6 h-6" />
              {sidebarOpen && <span className="ml-4 font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>
        
        <div className="absolute bottom-6 left-4 right-4">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center w-full px-5 py-4 text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
          >
            <LogOut className="w-6 h-6" />
            {sidebarOpen && <span className="ml-4 font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={cn(
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
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-20">
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
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500">Welcome back, {mockUser.name}!</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/notifications" className="relative p-3 hover:bg-gray-100 rounded-xl">
                <BellIcon className="w-6 h-6 text-gray-600" />
                <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full"></span>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-lg">
                  {getInitials(mockUser.name)}
                </div>
                <div className="hidden md:block">
                  <p className="font-semibold text-gray-900">{mockUser.name}</p>
                  <p className="text-sm text-gray-500">{mockUser.plan?.display_name} Plan</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 lg:p-10">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {/* Available Balance */}
            <div className="card p-7">
              <div className="flex items-center justify-between mb-5">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
                  <Wallet className="w-7 h-7 text-green-600" />
                </div>
                <span className="text-green-500 text-sm font-semibold flex items-center">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  Available
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {formatPoints(mockWallet.available_points)} pts
              </h3>
              <p className="text-gray-500">
                = {formatCurrency(mockWallet.available_points * 0.1)}
              </p>
            </div>
            
            {/* Pending Balance */}
            <div className="card p-7">
              <div className="flex items-center justify-between mb-5">
                <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center">
                  <Clock className="w-7 h-7 text-yellow-600" />
                </div>
                <span className="text-yellow-500 text-sm font-semibold flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Pending
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {formatPoints(mockWallet.pending_points)} pts
              </h3>
              <p className="text-gray-500">Processing rewards</p>
            </div>
            
            {/* Today's Progress */}
            <div className="card p-7">
              <div className="flex items-center justify-between mb-5">
                <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center">
                  <Zap className="w-7 h-7 text-primary-600" />
                </div>
                <span className="text-primary-500 text-sm font-semibold">
                  3/10 tasks
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                145 pts
              </h3>
              <p className="text-gray-500">Earned today</p>
            </div>
            
            {/* Total Earned */}
            <div className="card p-7">
              <div className="flex items-center justify-between mb-5">
                <div className="w-14 h-14 bg-secondary-100 rounded-2xl flex items-center justify-center">
                  <Award className="w-7 h-7 text-secondary-600" />
                </div>
                <span className="text-secondary-500 text-sm font-semibold flex items-center">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  All Time
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {formatPoints(mockWallet.total_earned)} pts
              </h3>
              <p className="text-gray-500">Total earned</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Tasks Section */}
            <div className="lg:col-span-2">
              <div className="card">
                <div className="p-7 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Available Tasks</h2>
                    <Link href="/dashboard/tasks" className="text-primary-600 hover:underline font-semibold">
                      View All
                    </Link>
                  </div>
                  
                  {/* Daily Progress Bar */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between text-sm mb-3">
                      <span className="text-gray-600 font-medium">Daily Progress</span>
                      <span className="font-semibold">3/{mockUser.plan?.daily_task_limit || 10} tasks</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-primary h-3 rounded-full transition-all"
                        style={{ width: '30%' }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {mockTasks.map((task) => (
                    <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-5">
                          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl">
                            {getTaskIcon(task.task_type)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{task.title}</h3>
                            <p className="text-gray-500 mt-1">{task.description}</p>
                            <div className="flex items-center mt-3">
                              <Star className="w-5 h-5 text-yellow-400 mr-2" />
                              <span className="font-semibold text-gray-700">
                                {task.points_min}-{task.points_max} points
                              </span>
                            </div>
                          </div>
                        </div>
                        <Link 
                          href={`/dashboard/tasks/${task.id}`}
                          className="btn-primary py-3 px-6 text-sm"
                        >
                          Start
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Referral Card */}
              <div className="card p-8 bg-gradient-to-br from-primary-600 to-secondary-600 text-white">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-xl">Refer & Earn</h3>
                  <Users className="w-7 h-7" />
                </div>
                <p className="text-white/80 mb-5">
                  Invite friends and earn up to 350 points when they qualify!
                </p>
                <div className="bg-white/20 rounded-xl p-4 mb-5">
                  <p className="text-xs text-white/70 mb-2">Your Referral Code</p>
                  <p className="font-mono font-bold text-2xl">{mockUser.referral_code}</p>
                </div>
                <button className="w-full bg-white text-primary-600 font-bold py-4 rounded-xl hover:bg-white/90 transition-colors">
                  Share Code
                </button>
              </div>

              {/* Recent Referrals */}
              <div className="card p-7">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-gray-900">Recent Referrals</h3>
                  <Link href="/dashboard/referrals" className="text-primary-600 hover:underline font-semibold">
                    View All
                  </Link>
                </div>
                <div className="space-y-5">
                  {mockReferrals.map((ref) => (
                    <div key={ref.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600">
                          {getInitials(ref.referred_name)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{ref.referred_name}</p>
                          <p className="text-xs text-gray-500">{formatDateTime(ref.created_at)}</p>
                        </div>
                      </div>
                      <span className={cn(
                        'badge',
                        ref.status === 'qualified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      )}>
                        {ref.status === 'qualified' ? `${ref.reward_points} pts` : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card p-7">
                <h3 className="font-bold text-gray-900 mb-5">Quick Actions</h3>
                <div className="space-y-3">
                  <Link 
                    href="/dashboard/withdraw"
                    className="flex items-center justify-between p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                  >
                    <div className="flex items-center">
                      <CreditCard className="w-6 h-6 text-green-600 mr-4" />
                      <span className="font-semibold text-gray-900">Withdraw</span>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  </Link>
                  <Link 
                    href="/dashboard/tasks"
                    className="flex items-center justify-between p-4 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors"
                  >
                    <div className="flex items-center">
                      <Target className="w-6 h-6 text-primary-600 mr-4" />
                      <span className="font-semibold text-gray-900">Complete Tasks</span>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
