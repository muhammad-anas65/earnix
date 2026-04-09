'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Wallet, 
  Gift, 
  CreditCard, 
  Bell, 
  Settings,
  LogOut,
  TrendingUp,
  Target,
  Menu,
  X,
  User,
  Zap
} from 'lucide-react';
import { cn, getInitials } from '@/lib/utils';
import { Toaster } from 'react-hot-toast';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Tasks', href: '/dashboard/tasks', icon: Target },
  { name: 'My Wallet', href: '/dashboard/wallet', icon: Wallet },
  { name: 'Withdraw', href: '/dashboard/withdraw', icon: CreditCard },
  { name: 'Referrals', href: '/dashboard/referrals', icon: Gift },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState<{name?: string; plan?: string} | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/users/me');
        const result = await res.json();
        
        if (result.success) {
          setUserData({
            name: result.data.user.name,
            plan: result.data.user.plan?.display_name || 'Free'
          });
        } else {
          router.push('/login');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="bg-white border-r border-gray-100 w-64 fixed left-0 top-0 h-full z-40 hidden lg:block shadow-sm">
        <div className="p-8 border-b border-gray-50">
          <Link href="/dashboard" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">Earnix</span>
          </Link>
        </div>
        
        <nav className="p-4 mt-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center px-4 py-3.5 rounded-xl transition-all font-medium',
                  isActive 
                    ? 'bg-primary-50 text-primary-600' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 text-sm'
                )}
              >
                <item.icon className={cn("w-5 h-5 mr-3 shrink-0", isActive ? "text-primary-600" : "text-gray-400")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="absolute bottom-8 left-6 right-6">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3.5 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all text-sm font-medium"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50" onClick={() => setSidebarOpen(false)}>
          <div className="bg-white w-72 h-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-primary-600">Earnix</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-2 text-gray-400">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'flex items-center px-4 py-3.5 rounded-xl transition-all font-medium',
                      isActive 
                        ? 'bg-primary-50 text-primary-600' 
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 text-sm'
                    )}
                  >
                    <item.icon className={cn("w-5 h-5 mr-3 shrink-0", isActive ? "text-primary-600" : "text-gray-400")} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* User Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 lg:px-10 py-4">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">Welcome back</p>
                <h1 className="text-lg font-bold text-slate-800">{userData?.name}</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
               <div className="hidden md:flex items-center bg-primary-50 rounded-full px-4 py-2 border border-primary-100">
                  <TrendingUp className="w-4 h-4 text-primary-600 mr-2" />
                  <span className="text-xs font-bold text-primary-700 whitespace-nowrap">{userData?.plan} Member</span>
               </div>
               
               <Link href="/dashboard/notifications" className="relative p-2.5 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
               </Link>
               
               <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md shadow-primary-500/30">
                  {getInitials(userData?.name || 'User')}
               </div>
            </div>
          </div>
        </header>

        {/* Dash Page Wrapper */}
        <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
