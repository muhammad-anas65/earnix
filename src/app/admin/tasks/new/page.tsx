'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Save, 
  Target, 
  Settings, 
  Shield, 
  Clock, 
  Zap,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

const TASK_TYPES = [
  'daily_checkin',
  'quiz',
  'interaction_task',
  'profile_completion',
  'phone_verification',
  'onboarding_task',
  'deposit_bonus',
  'referral_milestone',
  'custom'
];

const PLAN_OPTIONS = ['Free', 'Standard', 'Premium', 'Ultra Pro'];

export default function AddTaskPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    type: 'custom',
    reward_points: 10,
    difficulty: 'Easy',
    estimated_time: '5m',
    is_active: true,
    plan_access: ['Free', 'Standard', 'Premium', 'Ultra Pro'] as string[],
    repeat_type: 'once_only',
    daily_limit: 1,
    auto_approve: true,
    requires_proof: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const resp = await fetch('/api/admin/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await resp.json();
      if (result.success) {
        toast.success('Task created successfully!');
        router.push('/admin/tasks');
      } else {
        toast.error(result.error || 'Failed to create task');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePlan = (plan: string) => {
    setFormData(prev => ({
      ...prev,
      plan_access: prev.plan_access.includes(plan)
        ? prev.plan_access.filter(p => p !== plan)
        : [...prev.plan_access, plan]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <Link 
          href="/admin/tasks"
          className="flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tasks
        </Link>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${formData.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
            {formData.is_active ? 'Active' : 'Draft'}
          </span>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Construct Task</h1>
          <p className="text-slate-500 font-medium">Define a new objective for the Earnix workforce.</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Deploy Task
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <section className="bg-white border border-slate-100 rounded-3xl p-8 lg:p-12 shadow-sm space-y-8">
          <div className="flex items-center gap-4 mb-4">
             <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                <Target className="w-6 h-6 text-indigo-600" />
             </div>
             <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Intelligence Parameters</h2>
          </div>

          <div className="grid gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Objective Title</label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="e.g., Strategic Network Expansion"
                className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 ring-indigo-50 outline-none font-bold text-slate-900 transition-all"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contextual Synopsis (Short Description)</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Briefly explain the goal..."
                rows={2}
                className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 ring-indigo-50 outline-none font-bold text-slate-900 transition-all resize-none"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Operational Instructions (Full Details)</label>
              <textarea
                value={formData.instructions}
                onChange={e => setFormData({...formData, instructions: e.target.value})}
                placeholder="Step-by-step guidance for successful completion..."
                rows={5}
                className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 ring-indigo-50 outline-none font-bold text-slate-900 transition-all"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 pt-4">
             <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Task Type</label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 ring-indigo-50 outline-none font-bold text-slate-900 transition-all appearance-none cursor-pointer"
                >
                  {TASK_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ').toUpperCase()}</option>)}
                </select>
             </div>
             <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Difficulty Tier</label>
                <select 
                  value={formData.difficulty}
                  onChange={e => setFormData({...formData, difficulty: e.target.value})}
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 ring-indigo-50 outline-none font-bold text-slate-900 transition-all appearance-none cursor-pointer"
                >
                  <option value="Easy">EASY</option>
                  <option value="Medium">MEDIUM</option>
                  <option value="Hard">HARD</option>
                  <option value="Elite">ELITE</option>
                </select>
             </div>
          </div>
        </section>

        {/* Reward & Economics */}
        <section className="bg-white border border-slate-100 rounded-3xl p-8 lg:p-12 shadow-sm space-y-8">
           <div className="flex items-center gap-4 mb-4">
             <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-emerald-600" />
             </div>
             <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Economic Incentives</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
             <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Reward (Points)</label>
                <input
                  required
                  type="number"
                  value={formData.reward_points}
                  onChange={e => setFormData({...formData, reward_points: Number(e.target.value)})}
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 ring-indigo-50 outline-none font-bold text-slate-900 transition-all"
                />
             </div>
             <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Estimated Duration</label>
                <input
                  type="text"
                  value={formData.estimated_time}
                  onChange={e => setFormData({...formData, estimated_time: e.target.value})}
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 ring-indigo-50 outline-none font-bold text-slate-900 transition-all"
                  placeholder="e.g., 5m, 1h"
                />
             </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 pt-4">
             <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Repeat Protocol</label>
                <select 
                  value={formData.repeat_type}
                  onChange={e => setFormData({...formData, repeat_type: e.target.value})}
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 ring-indigo-50 outline-none font-bold text-slate-900 transition-all appearance-none cursor-pointer"
                >
                  <option value="once_only">ONCE ONLY (Unique)</option>
                  <option value="daily">DAILY REFRESH</option>
                  <option value="weekly">WEEKLY CYCLES</option>
                  <option value="unlimited">UNLIMITED</option>
                </select>
             </div>
             <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Approval Protocol</label>
                <div className="flex items-center gap-6 h-[66px] px-6 bg-slate-50 border border-slate-100 rounded-2xl">
                   <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.auto_approve}
                        onChange={e => setFormData({...formData, auto_approve: e.target.checked})}
                        className="w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-50"
                      />
                      <span className="text-sm font-bold text-slate-700">Auto Approve</span>
                   </label>
                   <label className="flex items-center gap-2 cursor-pointer border-l border-slate-200 pl-6">
                      <input 
                        type="checkbox" 
                        checked={formData.requires_proof}
                        onChange={e => setFormData({...formData, requires_proof: e.target.checked})}
                        className="w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-50"
                      />
                      <span className="text-sm font-bold text-slate-700">Needs Proof</span>
                   </label>
                </div>
             </div>
          </div>
        </section>

        {/* Access Matrix */}
        <section className="bg-white border border-slate-100 rounded-3xl p-8 lg:p-12 shadow-sm space-y-8">
           <div className="flex items-center gap-4 mb-4">
             <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-indigo-600" />
             </div>
             <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Access Matrix (Plan Entitlements)</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {PLAN_OPTIONS.map(plan => (
                <button
                  key={plan}
                  type="button"
                  onClick={() => togglePlan(plan)}
                  className={cn(
                    'px-6 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2',
                    formData.plan_access.includes(plan)
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200'
                      : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                  )}
                >
                  {plan}
                </button>
             ))}
          </div>
        </section>

        {/* Global Controls */}
        <div className="flex items-center justify-between p-8 bg-slate-50 rounded-3xl">
           <div className="flex items-center gap-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.is_active}
                  onChange={e => setFormData({...formData, is_active: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                <span className="ms-3 text-sm font-bold text-slate-900">Live Status</span>
              </label>
           </div>
           
           <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => router.push('/admin/tasks')}
                className="px-6 py-3 rounded-xl text-slate-400 font-bold hover:text-slate-900 transition-all"
              >
                Discard Changes
              </button>
           </div>
        </div>
      </form>
    </div>
  );
}
