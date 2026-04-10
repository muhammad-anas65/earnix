'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Lock,
  Mail,
  CreditCard,
  Phone,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });
  
  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Welcome back!');
        
        if (result.data?.user?.status === 'pending') {
          router.push('/pending-approval');
        } else {
          router.push('/dashboard');
        }
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-hidden">
      {/* Dynamic Background Element */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-indigo-50/50 rounded-full blur-[120px] -mr-24 -mt-24 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-[50vw] h-[50vh] bg-primary-50/30 rounded-full blur-[120px] -ml-24 -mb-24 opacity-50"></div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Elite Branding */}
        <div className="text-center mb-16">
          <Link href="/" className="inline-flex items-center space-x-4 group">
            <div className="w-16 h-16 bg-slate-900 rounded-[2rem] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <span className="text-4xl font-black text-slate-900 tracking-tighter">Earnix</span>
          </Link>
        </div>

        <div className="premium-card !p-8 md:!p-12 lg:!p-20 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)]">
          <div className="text-center mb-12 lg:mb-16">
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-black text-slate-900 mb-4 tracking-tighter">Welcome <span className="text-gradient">Back.</span></h1>
            <p className="text-slate-500 font-medium text-base lg:text-lg">Sign in to manage your earnings and tasks.</p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 lg:space-y-10">
            <div className="space-y-3 lg:space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 lg:w-6 lg:h-6 text-slate-400" />
                <input
                  {...register('email')}
                  type="email"
                  className={cn('w-full pl-14 lg:pl-16 pr-6 py-5 lg:py-6 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 ring-indigo-50 outline-none font-bold text-slate-900 transition-all text-base lg:text-lg', errors.email && 'border-red-500 ring-red-50')}
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-[10px] font-black uppercase tracking-widest ml-2">{errors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-3 lg:space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Your Password</label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 lg:w-6 lg:h-6 text-slate-400" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className={cn('w-full pl-14 lg:pl-16 pr-14 lg:pr-16 py-5 lg:py-6 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 ring-indigo-50 outline-none font-bold text-slate-900 transition-all text-base lg:text-lg', errors.password && 'border-red-500 ring-red-50')}
                  placeholder="Your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5 lg:w-6 lg:h-6" /> : <Eye className="w-5 h-5 lg:w-6 lg:h-6" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-[10px] font-black uppercase tracking-widest ml-2">{errors.password.message}</p>
              )}
            </div>
            
            <div className="flex items-center justify-between px-2">
              <label className="flex items-center group cursor-pointer">
                <div className="relative">
                   <input type="checkbox" className="sr-only peer" />
                   <div className="w-5 h-5 lg:w-6 lg:h-6 bg-slate-100 border border-slate-200 rounded-lg peer-checked:bg-slate-900 peer-checked:border-slate-900 transition-all"></div>
                   <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 lg:w-4 lg:h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <span className="ml-3 text-[10px] lg:text-xs font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-900 transition-colors">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">
                Forgot Password?
              </Link>
            </div>
            
            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  'w-full py-5 lg:py-7 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-2xl active:scale-[0.98]',
                  isLoading ? 'bg-slate-200 text-slate-400' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200'
                )}
              >
                {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
              </button>
              
              <p className="text-center text-slate-400 font-bold text-[10px] lg:text-xs mt-10 lg:mt-12 uppercase tracking-widest">
                Don't have an account? <Link href="/signup" className="text-indigo-600 hover:underline">Create Account</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
