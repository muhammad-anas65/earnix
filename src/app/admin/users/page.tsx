export const dynamic = 'force-dynamic';

import { supabaseAdmin } from '@/lib/supabase';
import { Mail, Phone, Calendar, Star, MoreVertical } from 'lucide-react';

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
                    <div className="space-y-1">
                      <div className="flex items-center text-gray-600">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {user.email}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {user.phone || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-1 ${
                      user.status === 'active' ? 'bg-green-100 text-green-700' : 
                      user.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {user.status || 'inactive'}
                    </span>
                    <p className="text-xs text-gray-500 flex items-center items-center mt-1 font-medium">
                      <Star className="w-3 h-3 mr-1 text-purple-500" /> 
                      {user.plan?.display_name || 'Free Plan'}
                    </p>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    ₨ {user.wallet?.total_earned || 0}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5 text-gray-500" />
                    </button>
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
