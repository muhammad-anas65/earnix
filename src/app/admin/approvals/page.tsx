'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Eye,
  Clock,
  User,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  MoreVertical
} from 'lucide-react';
import { cn, formatCurrency, formatDateTime } from '@/lib/utils';

interface PendingUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: {
    id: string;
    name: string;
    display_name: string;
    price: number;
  };
  payments?: {
    id: string;
    transaction_id: string;
    receipt_url: string;
    status: string;
    created_at: string;
  }[];
  referred_by?: string;
  created_at: string;
}

export default function ApprovalsPage() {
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const resp = await fetch(`/api/admin/users?status=pending&search=${searchQuery}`);
      const result = await resp.json();
      if (result.success && Array.isArray(result.data)) {
        setUsers(result.data);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchQuery]);

  const handleApprove = async (user: PendingUser) => {
    try {
      const resp = await fetch(`/api/admin/users/${user.id}/approve`, { method: 'POST' });
      const result = await resp.json();
      if (result.success) {
        setUsers(users.filter(u => u.id !== user.id));
        alert('User approved successfully!');
      } else {
        alert(result.error || 'Failed to approve user');
      }
    } catch (err) {
      alert('Error connecting to server');
    }
  };

  const handleReject = async (user: PendingUser) => {
    const reason = prompt('Reason for rejection:');
    if (reason === null) return;

    try {
      const resp = await fetch(`/api/admin/users/${user.id}/reject`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      const result = await resp.json();
      if (result.success) {
        setUsers(users.filter(u => u.id !== user.id));
        alert('User rejected.');
      }
    } catch (err) {
      alert('Error connecting to server');
    }
  };

  const filteredUsers = users; // Filtering moved to API for search, keeping status filter here if needed

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pending Approvals</h1>
          <p className="text-gray-500 mt-1">Review and approve new user registrations</p>
        </div>
        <div className="bg-yellow-100 text-yellow-800 px-5 py-3 rounded-xl flex items-center font-semibold">
          <Clock className="w-5 h-5 mr-2" />
          {filteredUsers.length} pending
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-12"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input w-auto"
            >
              <option value="all">All Users</option>
              <option value="payment">Paid Plans</option>
              <option value="free">Free Plans</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Referred By</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold mr-4">
                        {user.name?.split(' ').map(n => n[0]).join('') || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="badge bg-purple-100 text-purple-700">{user.plan?.display_name || 'N/A'}</span>
                    {user.plan?.price > 0 && (
                      <p className="text-sm text-gray-500 mt-1">{formatCurrency(user.plan.price)}</p>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    {user.plan?.price === 0 ? (
                      <span className="badge bg-gray-100 text-gray-600">Free</span>
                    ) : (
                      <div>
                        {user.payments && user.payments.length > 0 ? (
                          <>
                            <span className={`badge ${
                              user.payments[0].status === 'pending' 
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-green-100 text-green-700'
                            }`}>
                              {user.payments[0].status}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">ID: {user.payments[0].transaction_id}</p>
                            <a 
                              href={user.payments[0].receipt_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-primary-600 hover:underline flex items-center mt-1"
                            >
                              <Eye className="w-3 h-3 mr-1" /> View Receipt
                            </a>
                          </>
                        ) : (
                          <span className="badge bg-blue-100 text-blue-700">Expecting Payment</span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    {user.referred_by ? (
                      <span className="badge bg-blue-100 text-blue-700">{user.referred_by}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-500">
                    {user.created_at}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleApprove(user)}
                        className="p-2 hover:bg-green-100 rounded-lg text-green-600"
                        title="Approve"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleReject(user)}
                        className="p-2 hover:bg-red-100 rounded-lg text-red-600"
                        title="Reject"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="p-16 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No pending approvals found</p>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">User Details</h2>
              <button 
                onClick={() => setSelectedUser(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-xl">
                  {selectedUser.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedUser.name}</h3>
                  <p className="text-gray-500">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <Phone className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">Phone</span>
                  </div>
                  <p className="font-semibold">{selectedUser.phone}</p>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <CreditCard className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">Plan</span>
                  </div>
                  <p className="font-semibold">{selectedUser.plan?.display_name || 'N/A'}</p>
                  {selectedUser.plan?.price > 0 && (
                    <p className="text-sm text-gray-500">{formatCurrency(selectedUser.plan.price)}</p>
                  )}
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">Applied</span>
                  </div>
                  <p className="font-semibold">{selectedUser.created_at}</p>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <User className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">Referred By</span>
                  </div>
                  <p className="font-semibold">{selectedUser.referred_by || 'Direct'}</p>
                </div>
              </div>

              {selectedUser.plan?.price > 0 && (
                <div className="border-2 border-gray-200 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Payment Information</h4>
                  {selectedUser.payments && selectedUser.payments.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Transaction ID:</span>
                        <span className="font-semibold">{selectedUser.payments[0].transaction_id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Status:</span>
                        <span className={`badge ${
                          selectedUser.payments[0].status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {selectedUser.payments[0].status}
                        </span>
                      </div>
                      <div className="pt-2">
                        <p className="text-sm text-gray-500 mb-2">Payment Receipt:</p>
                        <a 
                          href={selectedUser.payments[0].receipt_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <img 
                            src={selectedUser.payments[0].receipt_url} 
                            alt="Receipt" 
                            className="w-full h-auto rounded-lg border hover:scale-[1.02] transition-transform"
                          />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-blue-50 text-blue-700 rounded-lg text-sm">
                      User has not submitted payment proof yet.
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 flex items-center justify-end space-x-4">
              <button
                onClick={() => {
                  setSelectedUser(null);
                  handleReject(selectedUser);
                }}
                className="btn-danger px-8"
              >
                Reject
              </button>
              <button
                onClick={() => {
                  setSelectedUser(null);
                  handleApprove(selectedUser);
                }}
                className="btn-success px-8"
              >
                Approve User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
