'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Zap, 
  ShieldCheck, 
  AlertCircle,
  Loader2,
  ChevronRight,
  Target,
  Gift
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { cn, formatPoints } from '@/lib/utils';

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [task, setTask] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const resp = await fetch('/api/tasks');
        const result = await resp.json();
        if (result.success) {
          const found = result.data.tasks.find((t: any) => t.id === params.id);
          if (found) {
            setTask(found);
          } else {
            toast.error('Task not found or already completed');
            router.push('/dashboard/tasks');
          }
        }
      } catch (err) {
        toast.error('Failed to load task details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTask();
  }, [params.id, router]);

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      const resp = await fetch(`/api/tasks/${params.id}/complete`, {
        method: 'POST'
      });
      const result = await resp.json();
      
      if (result.success) {
        toast.success(`Objective Secured! +${task.reward_points} Points Earned`);
        router.push('/dashboard/tasks');
      } else {
        toast.error(result.error || 'Failed to authorize completion');
      }
    } catch (err) {
      toast.error('Operation failed. Connection interrupted.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-slate-300" />
      </div>
    );
  }

  if (!task) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Premium Back Navigation */}
      <Link 
        href="/dashboard/tasks" 
        className="inline-flex items-center text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-3" /> Back to Matrix
      </Link>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Left Column: Instructions & Execution */}
        <div className="lg:col-span-2 space-y-10">
          <div className="premium-card relative overflow-hidden !p-12">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-[80px] -mr-32 -mt-32 opacity-30"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                 <div className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">
                    Operation: {task.type.replace('_', ' ')}
                 </div>
                 <div className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    {task.difficulty} Tier
                 </div>
              </div>

              <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tighter mb-6 uppercase">
                {task.title}
              </h1>
              
              <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 mb-10">
                <p className="text-lg text-slate-600 font-medium leading-relaxed italic">
                  &quot;{task.description}&quot;
                </p>
              </div>

              <div className="space-y-8 mb-12">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                   <Target className="w-5 h-5 text-indigo-600" /> Operational Protocol
                </h3>
                <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-loose space-y-4">
                   {task.instructions?.split('\n').map((line: string, i: number) => (
                     <p key={i} className="flex items-start gap-4">
                        <span className="w-6 h-6 bg-slate-200 text-slate-900 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-1">{i+1}</span>
                        {line}
                     </p>
                   )) || <p>Simply follow the visual cues and click the completion button below once the requirements are met.</p>}
                </div>
              </div>

              <button
                onClick={handleComplete}
                disabled={isSubmitting}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-8 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] transition-all shadow-2xl shadow-slate-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4"
              >
                {isSubmitting ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Zap className="w-5 h-5 text-indigo-400" />
                    Authorize Completion
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Reward Matrix & Verification */}
        <div className="space-y-8">
           <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mb-16"></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Contract Yield</p>
              <div className="flex items-baseline gap-2 mb-8">
                 <h2 className="text-6xl font-black tracking-tighter text-white">{task.reward_points}</h2>
                 <span className="text-sm font-black text-indigo-400 tracking-widest uppercase">Points</span>
              </div>
              
              <div className="space-y-4 py-8 border-y border-white/10">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimated Time</span>
                    <span className="text-xs font-black text-white">{task.estimated_time}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verification</span>
                    <span className="text-xs font-black text-emerald-400">INSTANT DATA SYNC</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Protocol</span>
                    <span className="text-xs font-black text-white">{task.repeat_type.toUpperCase()}</span>
                 </div>
              </div>

              <div className="mt-8 flex items-center gap-3 text-indigo-300">
                 <ShieldCheck className="w-5 h-5" />
                 <span className="text-[10px] font-bold uppercase tracking-widest">Secured Encryption Active</span>
              </div>
           </div>

           <div className="premium-card !p-8 bg-slate-50 border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                 <AlertCircle className="w-5 h-5 text-slate-400" />
                 <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Compliance Node</h4>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Ensure you have fulfilled all protocol requirements before authorization. Attempting to bypass validation may result in account flags.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
