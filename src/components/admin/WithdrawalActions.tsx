'use client';

import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface WithdrawalActionsProps {
  withdrawalId: string;
}

export default function WithdrawalActions({ withdrawalId }: WithdrawalActionsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action: 'approve' | 'reject') => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/withdrawals/${withdrawalId}/${action}`, {
        method: 'POST',
      });
      
      const result = await res.json();
      
      if (result.success) {
        toast.success(`Withdrawal ${action}ed successfully`);
        window.location.reload();
      } else {
        toast.error(result.error || `Failed to ${action} withdrawal`);
      }
    } catch (err) {
      toast.error('Error connecting to server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <button 
        onClick={() => handleAction('approve')}
        disabled={isLoading}
        className="flex items-center gap-1 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold transition disabled:opacity-50"
      >
        <CheckCircle className="w-4 h-4" /> Approve
      </button>
      <button 
        onClick={() => {
            if(confirm('Reject this withdrawal?')) handleAction('reject');
        }}
        disabled={isLoading}
        className="flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold transition disabled:opacity-50"
      >
        <XCircle className="w-4 h-4" /> Reject
      </button>
    </div>
  );
}
