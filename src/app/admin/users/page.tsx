export const dynamic = 'force-dynamic';

import { supabaseAdmin } from '@/lib/supabase';
import { Mail, Phone, Star } from 'lucide-react';
import UserActions from '@/components/admin/UserActions';
import { cn } from '@/lib/utils';

export default async function AdminUsersPage() {
  const { data: users, error } = await supabaseAdmin
    .from('users')
    .select(`
      *,
      wallet:wallets(*),
      plan:plans(*)
    `);

  if (error) {
    return <div className="p-10 text-red-500 font-bold">Error loading users. {error.message}</div>;
  }

  return (
    <div className="space-y-10 lg:space-y-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-2 px-1">Network Oversight</p>
           <h1 className="text-3xl lg:text-6xl font-black text-slate-900 tracking-tighter">Identity Management</h1>
           <p className="text-slate-500 font-medium mt-2">Scale and monitor all active nodes within the ecosystem.</p>
        </div>
        <div className="flex items-center space-x-2 px-6 py-3 bg-slate-900 text-white rounded-2xl shadow-xl">
           <Zap className="w-5 h-5 text-indigo-400" />
           <span className="text-[10px] font-black uppercase tracking-widest leading-none">Total Nodes: {users?.length || 0}</span>
        </div>
      </div>

      <div className="premium-card !p-0 overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Entity</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Communication Channel</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status / Tier</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Yield Performance</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users?.length === 0 ? (
                <tr>
                   <td colSpan={5} className="py-32 text-center">
                     <div className="flex flex-col items-center">
                        <Users className="w-16 h-16 text-slate-200 mb-6" />
                        <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">Database Static</h4>
                        <p className="text-slate-400 font-medium mt-1">No registered entities detected in current cycle.</p>
                     </div>
                   </td>
                </tr>
              ) : users?.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 transition-all group">
                  <td className="px-8 py-8">
                    <div className="flex items-center space-x-5">
                      <div className="w-16 h-16 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 font-black text-xl group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all duration-500 shadow-sm">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-lg tracking-tight group-hover:text-indigo-600 transition-colors">{user.name}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">INITIATED: {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="space-y-3">
                       <div className="flex items-center text-sm font-bold text-slate-500">
                          <Mail className="w-4 h-4 mr-3 text-slate-300" /> {user.email}
                       </div>
                       <div className="flex items-center text-sm font-bold text-slate-500">
                          <Phone className="w-4 h-4 mr-3 text-slate-300" /> {user.phone || 'NO PROTOCOL'}
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex flex-col items-start space-y-3">
                       <span className={cn('px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border', 
                          user.status === 'active' ? 'bg-green-50 text-green-700 border-green-100' : 
                          user.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                          'bg-red-50 text-red-700 border-red-100'
                       )}>
                          {user.status}
                       </span>
                       <div className="flex items-center text-xs font-black text-slate-900 uppercase tracking-tight">
                          <Zap className="w-4 h-4 mr-2 text-indigo-500" />
                          {user.plan?.display_name || 'FREE TIER'}
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-8 text-right">
                    <div className="text-2xl font-black text-slate-900 tracking-tighter">₨ {(user.wallet?.[0]?.available_points || 0) * 0.1}</div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{user.wallet?.[0]?.available_points || 0} UNITS</p>
                  </td>
                  <td className="px-8 py-8 text-center">
                     <UserActions userId={user.id} userStatus={user.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
