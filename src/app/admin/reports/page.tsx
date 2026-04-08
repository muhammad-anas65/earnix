export const dynamic = 'force-dynamic';

import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';

export default function AdminReportsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-500 mt-1">Deep dive into your platform's statistics and user engagement metrics.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
         <div className="card p-8">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 text-lg">Revenue Trends</h3>
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">+14.2%</span>
            </div>
            <div className="h-64 flex items-end justify-between space-x-2">
               {[40, 60, 45, 80, 50, 95, 75, 110, 85, 120, 100].map((height, i) => (
                 <div key={i} className="w-full bg-indigo-100 rounded-t-sm relative group cursor-pointer hover:bg-indigo-200 transition" style={{ height: `${height}%` }}>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition">
                      ₨ {height * 1000}
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="card p-8">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 text-lg">Active User Growth</h3>
                <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">+8.4%</span>
            </div>
            <div className="h-64 flex justify-center items-center">
               <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">Connecting to live analytics feed...</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
