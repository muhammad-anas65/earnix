export const dynamic = 'force-dynamic';

import { supabaseAdmin } from '@/lib/supabase';
import { Wallet } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import WithdrawalActions from '@/components/admin/WithdrawalActions';

export default async function AdminWithdrawalsPage() {
  const { data: withdrawals, error } = await supabaseAdmin
    .from('withdrawals')
    .select('*, users(name, email)')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Withdrawal Requests</h1>
          <p className="text-gray-500 mt-1">Review and process user payout requests securely.</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        {error ? (
          <div className="p-10 text-center text-red-500 font-medium">Failed to load: {error.message}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="bg-gray-50 text-xs text-gray-700 uppercase font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Requested By</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Method / Details</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {withdrawals?.length === 0 && (
                  <tr><td colSpan={5} className="py-10 text-center">No withdrawal requests found.</td></tr>
                )}
                {withdrawals?.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {req.users?.name || 'Unknown'}
                      <div className="text-xs text-gray-400 font-normal">{req.users?.email}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {formatCurrency(req.amount || 0)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="uppercase text-xs font-bold tracking-wider text-purple-700 bg-purple-100 px-2 py-1 rounded">
                        {req.method_type}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">{req.account_details}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        req.status === 'approved' ? 'bg-green-100 text-green-700' :
                        req.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {req.status === 'pending' ? (
                        <WithdrawalActions withdrawalId={req.id} />
                      ) : (
                        <span className="text-gray-400 text-xs italic">Processed</span>
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
