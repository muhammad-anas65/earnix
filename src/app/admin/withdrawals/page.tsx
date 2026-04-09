export const dynamic = 'force-dynamic';

import { supabaseAdmin } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users,
  Search,
  Zap,
  CreditCard,
  Building
} from 'lucide-react';
import { cn } from '@/lib/utils';
import WithdrawalActions from '@/components/admin/WithdrawalActions';

export default async function AdminWithdrawalsPage() {
  const { data: withdrawals, error } = await supabaseAdmin
    .from('withdrawals')
    .select('*, users(name, email)')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-10 lg:space-y-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-2 px-1">Treasury Operations</p>
           <h1 className="text-3xl lg:text-6xl font-black text-slate-900 tracking-tighter">Withdrawal Ledger</h1>
           <p className="text-slate-500 font-medium mt-2">Verify and execute liquidity exits across the network.</p>
        </div>
        <div className="flex items-center space-x-2 px-6 py-3 bg-slate-900 text-white rounded-2xl shadow-xl">
           <Zap className="w-5 h-5 text-indigo-400" />
           <span className="text-[10px] font-black uppercase tracking-widest leading-none">Global Cap: PRK 1.2M</span>
        </div>
      </div>

      <div className="premium-card !p-0 overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.06)]">
        {error ? (
          <div className="py-32 text-center text-red-500 font-black uppercase tracking-widest">
             CRITICAL DATABASE ERROR: {error.message}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Beneficiary</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Volume (₨)</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Method / Protocol</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status / Intelligence</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {withdrawals?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-32 text-center">
                       <div className="flex flex-col items-center">
                          <Wallet className="w-16 h-16 text-slate-200 mb-6" />
                          <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">Ledger Empty</h4>
                          <p className="text-slate-400 font-medium mt-1">No active liquidity requests detected in this cycle.</p>
                       </div>
                    </td>
                  </tr>
                ) : withdrawals?.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-all group">
                    <td className="px-8 py-8">
                      <div className="flex items-center space-x-5">
                        <div className="w-16 h-16 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 font-black text-xl group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all duration-500 shadow-sm">
                          {req.users?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-lg tracking-tight group-hover:text-indigo-600 transition-colors">
                            {req.users?.name || 'ANONYMOUS NODE'}
                          </p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{req.users?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                       <div className="flex items-center space-x-3">
                          <div className="text-2xl font-black text-slate-900 tracking-tighter">
                            {formatCurrency(req.amount || 0)}
                          </div>
                       </div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Requested: {new Date(req.created_at).toLocaleDateString()}</p>
                    </td>
                    <td className="px-8 py-8">
                       <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 group-hover:bg-white transition-colors">
                          <div className="flex items-center mb-2">
                             <CreditCard className="w-3 h-3 text-indigo-500 mr-2" />
                             <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">{req.method_type}</span>
                          </div>
                          <p className="text-xs font-bold text-slate-500 leading-relaxed font-mono">{req.account_details}</p>
                       </div>
                    </td>
                    <td className="px-8 py-8">
                       <div className="flex flex-col items-start space-y-3">
                          <span className={cn('px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border shadow-sm', 
                            req.status === 'approved' ? 'bg-green-50 text-green-700 border-green-100' : 
                            req.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' : 
                            'bg-amber-50 text-amber-700 border-amber-100'
                          )}>
                            {req.status}
                          </span>
                          <div className="flex items-center text-[10px] text-slate-400 font-black uppercase tracking-widest">
                             <Clock className="w-3 h-3 mr-2" />
                             {req.status === 'pending' ? 'Verification Stage' : 'Audit Complete'}
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-8 text-center">
                      {req.status === 'pending' ? (
                        <WithdrawalActions withdrawalId={req.id} />
                      ) : (
                        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest">
                           <CheckCircle className="w-3 h-3" />
                           <span>EXECUTED</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
