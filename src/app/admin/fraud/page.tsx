'use client';

import { Shield, AlertTriangle, UserX, Eye, Search, Filter } from 'lucide-react';

export default function FraudMonitoringPage() {
  const alerts = [
    { id: '1', user: 'Ahsan Malik', type: 'Multiple Accounts', severity: 'high', date: '2024-01-20 11:30 AM' },
    { id: '2', user: 'Sara Khan', type: 'Suspicious Referral Pattern', severity: 'medium', date: '2024-01-20 10:45 AM' },
    { id: '3', user: 'Zubair Ahmad', type: 'Proxy/VPN Detected', severity: 'low', date: '2024-01-19 09:15 PM' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Fraud Monitoring</h1>
        <p className="text-gray-500 mt-1">Identify and manage suspicious activities across the network.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
         <div className="card p-6 border-l-4 border-red-500">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-2">High Risk Alerts</h3>
            <p className="text-4xl font-bold text-red-600">12</p>
         </div>
         <div className="card p-6 border-l-4 border-amber-500">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-2">Flagged IPs</h3>
            <p className="text-4xl font-bold text-amber-600">45</p>
         </div>
         <div className="card p-6 border-l-4 border-blue-500">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-2">Solved Cases</h3>
            <p className="text-4xl font-bold text-blue-600">1,204</p>
         </div>
      </div>

      <div className="card overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-4">
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="Search suspicious users..." className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none" />
               </div>
               <button className="flex items-center text-sm font-bold text-gray-600 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Filter className="w-4 h-4 mr-2" /> Filter
               </button>
            </div>
        </div>

        <div className="divide-y divide-gray-100">
           {alerts.map(alert => (
             <div key={alert.id} className="p-6 hover:bg-gray-50/50 flex items-center justify-between transition-colors">
                <div className="flex items-center space-x-5">
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      alert.severity === 'high' ? 'bg-red-100 text-red-600' : 
                      alert.severity === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                   }`}>
                      <AlertTriangle className="w-6 h-6" />
                   </div>
                   <div>
                      <p className="font-bold text-gray-900">{alert.type}</p>
                      <p className="text-sm text-gray-500">User: <span className="font-bold text-primary-600 underline cursor-pointer">{alert.user}</span></p>
                   </div>
                </div>
                <div className="flex items-center space-x-4">
                   <div className="text-right mr-6">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">Occurred</p>
                      <p className="text-sm font-medium text-gray-700">{alert.date}</p>
                   </div>
                   <button className="p-2 hover:bg-gray-200 rounded-lg text-gray-400 transition-colors"><Eye className="w-5 h-5" /></button>
                   <button className="p-2 hover:bg-red-100 rounded-lg text-red-400 transition-colors"><UserX className="w-5 h-5" /></button>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
