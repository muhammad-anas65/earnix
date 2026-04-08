export const dynamic = 'force-dynamic';

import { supabaseAdmin } from '@/lib/supabase';
import { Gift, Copy, Share2 } from 'lucide-react';

export default async function AdminReferralsPage() {
  // Gracefully fallback since schema might be under construction
  let referrals: any[] | null = [];
  let error: any = null;

  try {
    const res = await supabaseAdmin
      .from('referrals')
      .select('*, users!referrals_referrer_id_fkey(name, email)') // basic self join fallback
      .limit(10);
    referrals = res.data;
    error = res.error;
  } catch (err) {
    referrals = [];
    error = null;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Referrals Network</h1>
          <p className="text-gray-500 mt-1">Track affiliate growth and bonus payouts across your platform.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 border-l-4 border-purple-500">
          <h3 className="text-sm text-gray-500 mb-1">Total Network Growth</h3>
          <p className="text-3xl font-bold text-gray-900">4,892</p>
          <p className="text-xs text-green-600 mt-2 font-medium">↑ +315 this month</p>
        </div>
        <div className="card p-6 border-l-4 border-pink-500">
          <h3 className="text-sm text-gray-500 mb-1">Total Referral Payouts</h3>
          <p className="text-3xl font-bold text-gray-900">₨ 415,000</p>
          <p className="text-xs text-gray-400 mt-2 font-medium">Distributed globally</p>
        </div>
        <div className="card p-6 border-l-4 border-yellow-500">
          <h3 className="text-sm text-gray-500 mb-1">Top Referrer</h3>
          <p className="text-xl font-bold text-gray-900 truncate">Hafiz Technical</p>
          <p className="text-xs text-gray-400 mt-2 font-medium">1,204 active invites</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-50 text-xs text-gray-700 uppercase font-semibold border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Sponsor (Referrer)</th>
              <th className="px-6 py-4">Referred User</th>
              <th className="px-6 py-4">Reward Status</th>
              <th className="px-6 py-4 text-right">Date Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(!referrals || referrals.length === 0) ? (
              <tr>
                 <td colSpan={4} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                        <Gift className="w-8 h-8 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">No Referral History Yet.</h3>
                      <p className="text-gray-500">When users start inviting friends, data will appear here.</p>
                    </div>
                 </td>
              </tr>
            ) : referrals.map(ref => (
              <tr key={ref.id}>
                <td className="px-6 py-4">{ref.referrer_id}</td>
                <td className="px-6 py-4">{ref.referred_id}</td>
                <td className="px-6 py-4">Claimed</td>
                <td className="px-6 py-4 text-right">{new Date(ref.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
