'use client';

import { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface TaskActionsProps {
  taskId: string;
}

export default function TaskActions({ taskId }: TaskActionsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/tasks/${taskId}`, {
        method: 'DELETE',
      });
      
      const result = await res.json();
      
      if (result.success) {
        toast.success('Task deleted successfully');
        window.location.reload();
      } else {
        toast.error(result.error || 'Failed to delete task');
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
        onClick={() => window.location.href = `/admin/tasks/${taskId}/edit`}
        disabled={isLoading}
        className="p-2 hover:bg-gray-200 text-gray-500 rounded-lg transition"
      >
        <Edit className="w-4 h-4" />
      </button>
      <button 
        onClick={handleDelete}
        disabled={isLoading}
        className="p-2 hover:bg-red-100 text-red-500 rounded-lg transition"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
