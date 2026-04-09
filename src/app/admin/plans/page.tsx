'use client';

import { Zap, Plus, Edit, Trash2, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function PlansManagementPage() {
  const plans = [
    { id: 'free', name: 'Free', price: 0, tasks: 5, referrals: '5%', status: 'active' },
    { id: 'premium', name: 'Premium', price: 5000, tasks: 15, referrals: '10%', status: 'active' },
    { id: 'ultra', name: 'Ultra Max', price: 15000, tasks: 50, referrals: '20%', status: 'active' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Membership Plans</h1>
          <p className="text-gray-500 mt-1">Configure user tiers, pricing, and earning limits.</p>
        </div>
        <button className="bg-primary-600 hover:bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center transition-all shadow-lg shadow-primary-500/10">
           <Plus className="w-5 h-5 mr-2" /> CREATE NEW PLAN
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         {plans.map(plan => (
           <div key={plan.id} className="card p-8 border-t-8 border-primary-600 hover:shadow-2xl transition-shadow relative group">
              <div className="flex items-start justify-between mb-8">
                 <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center">
                    <Zap className="w-8 h-8 text-primary-600" />
                 </div>
                 <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase tracking-widest border border-green-100">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> {plan.status}
                 </span>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-4xl font-black text-slate-800 mb-8">
                 {plan.price === 0 ? 'FREE' : formatCurrency(plan.price)}
              </p>

              <div className="space-y-4 mb-10">
                 <div className="flex items-center justify-between text-sm py-2 border-b border-gray-50">
                    <span className="text-gray-500 font-medium">Daily Task Limit</span>
                    <span className="font-bold text-gray-900">{plan.tasks} Tasks</span>
                 </div>
                 <div className="flex items-center justify-between text-sm py-2 border-b border-gray-50">
                    <span className="text-gray-500 font-medium">Referral Bonus</span>
                    <span className="font-bold text-gray-900">{plan.referrals}</span>
                 </div>
                 <div className="flex items-center justify-between text-sm py-2">
                    <span className="text-gray-500 font-medium">Platform Access</span>
                    <span className="font-bold text-gray-900">Priority Support</span>
                 </div>
              </div>

              <div className="flex items-center space-x-3">
                 <button className="flex-1 bg-gray-50 hover:bg-gray-100 py-3 rounded-xl font-bold text-gray-600 text-sm flex items-center justify-center transition-colors border border-gray-100">
                    <Edit className="w-4 h-4 mr-2" /> EDIT
                 </button>
                 <button className="p-3 bg-red-50 hover:bg-red-500 hover:text-white rounded-xl text-red-500 transition-all border border-red-100">
                    <Trash2 className="w-4 h-4" />
                 </button>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
}
