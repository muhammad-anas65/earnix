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
  Target,
  Menu,
  X,
  User,
  Zap,
  ChevronRight
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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
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
        router.push('/login');
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Zap className="w-7 h-7 text-indigo-600" />
          </div>
          <div className="w-7 h-7 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex overflow-x-hidden">

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="bg-white border-r border-slate-200/80 w-60 fixed left-0 top-0 h-full z-40 hidden lg:flex flex-col shadow-sm">
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-slate-100 flex-shrink-0">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-black text-slate-800 tracking-tight">Earnix</span>
          </Link>
        </div>
        
        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto" style={{scrollbarWidth:'none'}}>
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group',
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <item.icon className={cn(
                  'w-5 h-5 flex-shrink-0 transition-colors',
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
                )} />
                <span className="text-sm font-semibold">{item.name}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-indigo-200" />}
              </Link>
            );
          })}
        </nav>
        
        {/* User Footer */}
        <div className="px-3 py-4 border-t border-slate-100 flex-shrink-0 space-y-1">
          {userData && (
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                {getInitials(userData.name || 'U')}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{userData.name}</p>
                <p className="text-[10px] text-indigo-600 font-semibold">{userData.plan} Plan</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-semibold">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen pb-20 lg:pb-0">
        {/* Header */}
        <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 px-4 lg:px-8 h-16 flex items-center flex-shrink-0">
          <div className="flex items-center justify-between w-full">
            {/* Left */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="lg:hidden">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/20">
                  <Zap className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="hidden lg:block">
                <h1 className="text-sm font-black text-slate-900">
                  {navigation.find(n => pathname === n.href || (n.href !== '/dashboard' && pathname.startsWith(n.href)))?.name || 'Dashboard'}
                </h1>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
                  {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
              {userData?.plan && (
                <div className="hidden sm:flex items-center gap-1.5 bg-green-50 border border-green-100 rounded-full px-3 py-1.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">{userData.plan}</span>
                </div>
              )}

              <Link href="/dashboard/notifications" className="relative p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border-2 border-white" />
              </Link>

              <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white text-sm font-black shadow-md ring-2 ring-white">
                {getInitials(userData?.name || 'U')}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
            {children}
          </div>
        </main>
      </div>

      {/* ── MOBILE SIDEBAR OVERLAY ── */}
      {mobileSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          onClick={() => setMobileSidebarOpen(false)}
        >
          <div
            className="bg-white w-64 h-full shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/20">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-black text-slate-800">Earnix</span>
              </div>
              <button onClick={() => setMobileSidebarOpen(false)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto" style={{scrollbarWidth:'none'}}>
              {navigation.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-semibold text-sm',
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    )}
                  >
                    <item.icon className={cn('w-5 h-5 flex-shrink-0', isActive ? 'text-white' : 'text-slate-400')} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="px-3 py-4 border-t border-slate-100">
              {userData && (
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                    {getInitials(userData.name || 'U')}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{userData.name}</p>
                    <p className="text-[10px] text-indigo-600 font-semibold">{userData.plan} Plan</p>
                  </div>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-2.5 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all text-sm font-semibold"
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 z-40 flex items-center justify-around px-2 py-2">
        {navigation.slice(0, 5).map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all',
                isActive ? 'text-indigo-600' : 'text-slate-400'
              )}
            >
              <div className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center transition-all',
                isActive ? 'bg-indigo-50' : ''
              )}>
                <item.icon className={cn('w-5 h-5', isActive && 'scale-110')} />
              </div>
              <span className="text-[10px] font-bold tracking-tight">{item.name.split(' ')[0]}</span>
            </Link>
          );
        })}
      </nav>

      <Toaster position="top-right" toastOptions={{
        style: { borderRadius: '12px', fontWeight: 600, fontSize: '14px' }
      }} />
    </div>
  );
}
