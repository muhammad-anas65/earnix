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
          if (result.data.user.status === 'pending') {
            router.push('/pending-approval');
            return;
          }
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
  }, [router, pathname]);

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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row overflow-x-hidden">
      {/* Sidebar - Desktop */}
      <aside className="bg-white border-r border-slate-100 w-72 fixed left-0 top-0 h-full z-40 hidden lg:flex flex-col shadow-[10px_0_40px_-15px_rgba(0,0,0,0.03)]">
        <div className="p-8">
          <Link href="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-black text-slate-800 tracking-tight">Earnix</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 mt-4 space-y-1.5 overflow-y-auto hide-scrollbar">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center px-5 py-4 rounded-2xl transition-all duration-200 font-bold group',
                  isActive 
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <item.icon className={cn("w-5 h-5 mr-4 transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
                <span className="text-sm tracking-tight">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-6 border-t border-slate-50">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-5 py-4 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all font-bold text-sm"
          >
            <LogOut className="w-5 h-5 mr-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen pb-24 lg:pb-0">
        {/* User Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30 px-4 lg:px-10 py-4 lg:py-6">
          <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
            <div className="flex items-center space-x-4">
              <div className="lg:hidden w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="hidden lg:block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">Active Account</p>
                <h1 className="text-lg lg:text-xl font-black text-slate-900 tracking-tight">{userData?.name}</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
               <div className="hidden sm:flex items-center bg-green-50 rounded-full px-4 py-1.5 border border-green-100">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse mr-2"></div>
                  <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">{userData?.plan}</span>
               </div>
               
               <Link href="/dashboard/notifications" className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 transition-colors relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-red-500 rounded-full border-2 border-white"></span>
               </Link>
               
               <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-xl ring-4 ring-white">
                  {getInitials(userData?.name || 'U')}
               </div>
            </div>
          </div>
        </header>

        {/* Dash Page Wrapper */}
        <main className="flex-1 p-4 lg:p-10 max-w-7xl mx-auto w-full">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 px-6 py-4 flex items-center justify-between z-50 rounded-t-[2.5rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
        {navigation.slice(0, 5).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={cn(
                "flex flex-col items-center space-y-1 transition-all",
                isActive ? "text-primary-600 scale-110" : "text-slate-400"
              )}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-[10px] font-black uppercase tracking-tighter">{item.name.split(' ')[0]}</span>
            </Link>
          );
        })}
      </nav>
      <Toaster position="top-right" />
    </div>
  );
}
