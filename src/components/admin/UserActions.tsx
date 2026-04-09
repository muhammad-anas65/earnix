'use client';

import { useState } from 'react';
import { MoreVertical, CheckCircle, XCircle, Eye, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface UserActionsProps {
  userId: string;
  userStatus: string;
}

export default function UserActions({ userId, userStatus }: UserActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action: 'approve' | 'reject' | 'delete') => {
    setIsLoading(true);
    setIsOpen(false);
    try {
      let endpoint = '';
      let method = 'POST';
      
      if (action === 'approve') endpoint = `/api/admin/users/${userId}/approve`;
      if (action === 'reject') endpoint = `/api/admin/users/${userId}/reject`;
      if (action === 'delete') {
          endpoint = `/api/admin/users/${userId}`;
          method = 'DELETE';
      }

      const res = await fetch(endpoint, { 
        method,
        headers: { 'Content-Type': 'application/json' },
        body: action === 'reject' ? JSON.stringify({ reason: 'Admin rejected' }) : undefined
      });
      
      const result = await res.json();
      
      if (result.success) {
        toast.success(result.message || `User ${action}ed successfully`);
        // Refresh the page to show updated status
        window.location.reload();
      } else {
        toast.error(result.error || `Failed to ${action} user`);
      }
    } catch (err) {
      toast.error(`Error connecting to server`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 overflow-hidden">
            {userStatus === 'pending' && (
              <>
                <button
                  onClick={() => handleAction('approve')}
                  className="w-full flex items-center px-4 py-3 text-sm text-green-600 hover:bg-green-50 transition-colors font-medium"
                >
                  <CheckCircle className="w-4 h-4 mr-3" /> Approve User
                </button>
                <button
                  onClick={() => handleAction('reject')}
                  className="w-full flex items-center px-4 py-3 text-sm text-yellow-600 hover:bg-yellow-50 transition-colors font-medium"
                >
                  <XCircle className="w-4 h-4 mr-3" /> Reject User
                </button>
              </>
            )}
            
            <button
               onClick={() => window.location.href = `/admin/users/${userId}`}
               className="w-full flex items-center px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-4 h-4 mr-3" /> View Profile
            </button>
            
            <div className="border-t border-gray-100 my-1"></div>
            
            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete this user? This cannot be undone.')) {
                  handleAction('delete');
                }
              }}
              className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-3" /> Delete User
            </button>
          </div>
        </>
      )}
    </div>
  );
}
