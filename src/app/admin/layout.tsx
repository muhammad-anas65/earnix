'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Wallet,
  Target,
  Gift,
  FileText,
  Settings,
  BarChart3,
  LogOut,
  Menu,
  X,
  XCircle,
  TrendingUp,
  Bell,
  Search,
  Shield,
  Zap,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { cn, getInitials } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, badge: null },
  { name: 'Users', href: '/admin/users', icon: Users, badge: null },
  { name: 'Approvals', href: '/admin/approvals', icon: CreditCard, badge: '3' },
  { name: 'Withdrawals', href: '/admin/withdrawals', icon: Wallet, badge: null },
  { name: 'Plans', href: '/admin/plans', icon: Zap, badge: null },
  { name: 'Tasks', href: '/admin/tasks', icon: Target, badge: null },
  { name: 'Referrals', href: '/admin/referrals', icon: Gift, badge: null },
  { name: 'Fraud', href: '/admin/fraud', icon: Shield, badge: null },
  { name: 'Payments', href: '/admin/payments', icon: FileText, badge: null },
  { name: 'Reports', href: '/admin/reports', icon: BarChart3, badge: null },
  { name: 'Settings', href: '/admin/settings', icon: Settings, badge: null },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminData, setAdminData] = useState<{name?: string; email?: string} | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmin = async () => {
      if (pathname === '/admin/login' || pathname === '/admin/register') {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch('/api/admin/me');
        const result = await res.json();
        
        if (result.success) {
          setAdminData(result.data);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.push('/admin/login');
        }
      } catch (err) {
        console.error('Admin fetch error:', err);
        setIsAuthenticated(false);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdmin();
  }, [router, pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  if (pathname === '/admin/login' || pathname === '/admin/register') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-indigo-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <TrendingUp className="w-8 h-8 text-indigo-400" />
          </div>
          <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-sm font-medium">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-400 mb-6 text-sm">You don't have permission to access the admin area.</p>
          <Link href="/admin/login" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-2xl w-full inline-block transition-all">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  const sidebarW = sidebarExpanded ? 'w-64' : 'w-[72px]';

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex overflow-x-hidden">

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className={cn(
        'bg-[#0D1117] text-white fixed left-0 top-0 h-full z-40 transition-all duration-300 hidden lg:flex flex-col border-r border-white/[0.04]',
        sidebarW
      )}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/[0.06] flex-shrink-0">
          <Link href="/admin" className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25 flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            {sidebarExpanded && (
              <div className="min-w-0 overflow-hidden">
                <span className="text-base font-black text-white block leading-tight">Earnix</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Admin Panel</span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all flex-shrink-0"
          >
            {sidebarExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-2.5 space-y-0.5 overflow-y-auto overflow-x-hidden" style={{scrollbarWidth:'none'}}>
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                title={!sidebarExpanded ? item.name : undefined}
                className={cn(
                  'flex items-center gap-3 px-2.5 py-2.5 rounded-xl transition-all duration-150 group relative',
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:bg-white/[0.06] hover:text-white'
                )}
              >
                <item.icon className={cn(
                  'w-5 h-5 flex-shrink-0 transition-colors',
                  isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'
                )} />
                {sidebarExpanded && (
                  <span className="text-sm font-semibold truncate">{item.name}</span>
                )}
                {sidebarExpanded && item.badge && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center flex-shrink-0">
                    {item.badge}
                  </span>
                )}
                {!sidebarExpanded && item.badge && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-2.5 py-4 border-t border-white/[0.06] flex-shrink-0 space-y-1">
          {/* Admin Info */}
          {sidebarExpanded && (
            <div className="flex items-center gap-3 px-2.5 py-2.5 rounded-xl mb-1">
              <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                {getInitials(adminData?.name || 'AD')}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{adminData?.name || 'Administrator'}</p>
                <p className="text-[10px] text-slate-500 truncate">{adminData?.email || ''}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            title={!sidebarExpanded ? 'Logout' : undefined}
            className="flex items-center gap-3 w-full px-2.5 py-2.5 text-slate-500 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarExpanded && <span className="text-sm font-semibold">Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN AREA ── */}
      <main className={cn(
        'flex-1 flex flex-col min-h-screen transition-all duration-300',
        sidebarExpanded ? 'lg:ml-64' : 'lg:ml-[72px]'
      )}>
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 px-4 lg:px-8 h-16 flex items-center flex-shrink-0">
          <div className="flex items-center justify-between w-full gap-4">
            {/* Left: Mobile menu + Search */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-72 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-300 transition-all">
                <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search users, payments..."
                  className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full"
                />
              </div>
            </div>

            {/* Right: Admin info */}
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>

              <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-slate-200">
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-800 leading-tight">{adminData?.name || 'Administrator'}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Admin</p>
                </div>
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white text-sm font-black shadow-md">
                  {getInitials(adminData?.name || 'AD')}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 lg:p-8 max-w-[1600px] w-full mx-auto">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {children}
          </div>
        </div>
      </main>

      {/* ── MOBILE SIDEBAR OVERLAY ── */}
      {mobileSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          onClick={() => setMobileSidebarOpen(false)}
        >
          <div
            className="bg-[#0D1117] w-72 h-full shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-16 flex items-center justify-between px-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-base font-black text-white block leading-tight">Earnix</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Admin Panel</span>
                </div>
              </div>
              <button onClick={() => setMobileSidebarOpen(false)} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto" style={{scrollbarWidth:'none'}}>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-semibold text-sm',
                    pathname === item.href
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'text-slate-400 hover:bg-white/[0.06] hover:text-white'
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="ml-auto bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
            <div className="px-3 py-4 border-t border-white/[0.06]">
              <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/[0.04] mb-2">
                <div className="w-9 h-9 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center text-white text-sm font-black flex-shrink-0">
                  {getInitials(adminData?.name || 'AD')}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">{adminData?.name || 'Administrator'}</p>
                  <p className="text-xs text-slate-500 truncate">{adminData?.email || 'admin@earnix.com'}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-2.5 text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all text-sm font-semibold"
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
