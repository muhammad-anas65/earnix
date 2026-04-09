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
  ChevronDown,
  Eye,
  Shield,
  Zap
} from 'lucide-react';
import { cn, formatCurrency, formatDateTime, getInitials } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Approvals', href: '/admin/approvals', icon: CreditCard },
  { name: 'Withdrawals', href: '/admin/withdrawals', icon: Wallet },
  { name: 'Plans', href: '/admin/plans', icon: Zap },
  { name: 'Tasks', href: '/admin/tasks', icon: Target },
  { name: 'Referrals', href: '/admin/referrals', icon: Gift },
  { name: 'Fraud', href: '/admin/fraud', icon: Shield },
  { name: 'Payments', href: '/admin/payments', icon: FileText },
  { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminData, setAdminData] = useState<{name?: string; email?: string} | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmin = async () => {
      // Don't fetch if we're on login or register pages
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-6 font-medium">You don't have permission to access the admin area.</p>
          <Link href="/admin/login" className="btn-primary inline-block w-full">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex overflow-x-hidden">
      {/* Sidebar - Desktop */}
      <aside className={cn(
        'bg-[#0F172A] text-white fixed left-0 top-0 h-full z-40 transition-all duration-300 hidden lg:flex flex-col shadow-2xl',
        sidebarOpen ? 'w-80' : 'w-24'
      )}>
        <div className="p-8 border-b border-slate-800/50 flex items-center justify-between">
          <Link href="/admin" className="flex items-center space-x-3 overflow-hidden">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30 flex-shrink-0">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            {sidebarOpen && (
              <div className="whitespace-nowrap transition-all duration-300">
                <span className="text-xl font-black tracking-tight block">Earnix</span>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Management</p>
              </div>
            )}
          </Link>
        </div>
        
        <nav className="flex-1 p-4 mt-6 space-y-1.5 overflow-y-auto hide-scrollbar">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center px-5 py-4 rounded-2xl transition-all duration-200 group relative',
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                )}
              >
                <item.icon className={cn("w-6 h-6 shrink-0 transition-colors", isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300")} />
                {sidebarOpen && <span className="ml-4 font-bold text-sm tracking-tight">{item.name}</span>}
                {!sidebarOpen && isActive && <div className="absolute right-0 w-1.5 h-6 bg-indigo-500 rounded-l-full"></div>}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-6 border-t border-slate-800/50">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-5 py-4 text-slate-500 hover:bg-red-500/10 hover:text-red-400 rounded-2xl transition-all font-bold text-sm"
          >
            <LogOut className="w-6 h-6 shrink-0" />
            {sidebarOpen && <span className="ml-4">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <main className={cn('flex-1 flex flex-col min-h-screen transition-all duration-300', sidebarOpen ? 'lg:ml-80' : 'lg:ml-24')}>
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-6 lg:px-12 py-5">
          <div className="flex items-center justify-between mx-auto w-full">
            <div className="flex items-center space-x-6">
               <button 
                 onClick={() => setSidebarOpen(!sidebarOpen)}
                 className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl transition-all shadow-sm"
               >
                 <Menu className="w-5 h-5" />
               </button>
               
               <div className="hidden md:flex items-center relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search anything..." 
                    className="pl-12 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white w-80 transition-all font-medium"
                  />
               </div>
            </div>
            
            <div className="flex items-center space-x-4">
               <div className="hidden sm:flex flex-col text-right mr-4 border-r border-slate-100 pr-6">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Administrator</span>
                  <span className="text-sm font-black text-slate-900">{adminData?.name}</span>
               </div>
               
               <button className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-3 right-3 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white"></span>
               </button>
               
               <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black shadow-xl ring-4 ring-slate-100">
                  {getInitials(adminData?.name || 'AD')}
               </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="p-6 lg:p-12 max-w-[1600px] w-full mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
           {children}
        </div>
      </main>
      
      {/* Mobile Drawer (Same component logic as before but better UI) */}
      {!sidebarOpen && (
        <button 
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl z-50 flex items-center justify-center active:scale-95 transition-all"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50" onClick={() => setSidebarOpen(false)}>
          <div className="bg-[#0F172A] w-72 h-full shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-8 border-b border-slate-800/50 flex items-center justify-between">
              <span className="text-2xl font-black text-white">Earnix</span>
              <button onClick={() => setSidebarOpen(false)} className="p-2 text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
            </div>
            <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
               {navigation.map((item) => (
                 <Link
                   key={item.name}
                   href={item.href}
                   onClick={() => setSidebarOpen(false)}
                   className={cn(
                     'flex items-center px-5 py-4 rounded-xl transition-all font-bold',
                     pathname === item.href ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400'
                   )}
                 >
                   <item.icon className="w-6 h-6 mr-4" />
                   <span className="text-sm">{item.name}</span>
                 </Link>
               ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
