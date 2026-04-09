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
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-500 mt-1">Manage and view all registered users across the platform.</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs text-gray-700 uppercase font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Plan / Status</th>
                <th className="px-6 py-4">Wallet Income</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    No users found in database.
                  </td>
                </tr>
              ) : null}
              {users?.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-400">Joined: {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-gray-700 mb-1">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" /> {user.email}
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" /> {user.phone || 'No phone'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn('px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 inline-block', 
                      user.status === 'active' ? 'bg-green-100 text-green-700' : 
                      user.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-red-100 text-red-700'
                    )}>
                      {user.status}
                    </span>
                    <div className="flex items-center font-bold text-gray-900">
                      <Star className="w-4 h-4 mr-1 text-primary-500" />
                      {user.plan?.display_name || 'Free Plan'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">Rs {user.wallet?.[0]?.available_points || 0}</div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Total Points</p>
                  </td>
                  <td className="px-6 py-4 text-right">
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
