export const dynamic = 'force-dynamic';

import { supabaseAdmin } from '@/lib/supabase';
import { Target, Link as LinkIcon, Edit, Trash2 } from 'lucide-react';

export default async function AdminTasksPage() {
  const { data: tasks, error } = await supabaseAdmin
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
          <p className="text-gray-500 mt-1">Create and monitor the tasks that users complete to earn money.</p>
        </div>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-semibold transition shadow-lg shadow-primary-500/30">
          + Create New Task
        </button>
      </div>

      <div className="card overflow-hidden">
        {error ? (
          <div className="p-10 text-center text-red-500 font-medium">Failed to load: {error.message}</div>
        ) : (
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs text-gray-700 uppercase font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Task Name</th>
                <th className="px-6 py-4">Reward Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tasks?.length === 0 && (
                <tr><td colSpan={4} className="py-10 text-center">No tasks available. Create one to get started!</td></tr>
              )}
              {tasks?.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Target className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        {task.title}
                        <div className="text-xs text-gray-400 font-normal mt-0.5 flex items-center">
                          <LinkIcon className="w-3 h-3 mr-1" /> {task.url || 'No URL'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-green-600">
                    ₨ {task.reward_amount || '0'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      task.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {task.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <button className="p-2 hover:bg-gray-200 text-gray-500 rounded-lg transition"><Edit className="w-4 h-4" /></button>
                       <button className="p-2 hover:bg-red-100 text-red-500 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
