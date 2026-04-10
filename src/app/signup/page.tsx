'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  ArrowLeft, 
  Upload, 
  CheckCircle, 
  Check,
  CreditCard,
  Smartphone,
  FileText,
  Shield,
  ShieldCheck,
  AlertTriangle,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Gift,
  Zap
} from 'lucide-react';
import { cn, DEFAULT_PLANS } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import toast from 'react-hot-toast';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(11, 'Please enter a valid phone number'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
  referralCode: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupForm = z.infer<typeof signupSchema>;

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedPlan, setSelectedPlan, referralCode, setReferralCode } = useAppStore();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState<'plan' | 'details'>('plan');
  const [isLoading, setIsLoading] = useState(false);
  
  const planParam = searchParams.get('plan');
  const refParam = searchParams.get('ref');
  
  useEffect(() => {
    if (planParam) {
      const plan = DEFAULT_PLANS.find(p => p.id === planParam);
      if (plan) {
        setSelectedPlan(plan);
        setStep('details');
      }
    }
    if (refParam) {
      setReferralCode(refParam);
    }
  }, [planParam, refParam, setSelectedPlan, setReferralCode]);
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      referralCode: refParam || referralCode || '',
    },
  });
  
  const password = watch('password');
  
  const passwordRequirements = [
    { test: (p: string) => p?.length >= 8, label: 'At least 8 characters' },
    { test: (p: string) => /[A-Z]/.test(p || ''), label: 'One uppercase letter' },
    { test: (p: string) => /[a-z]/.test(p || ''), label: 'One lowercase letter' },
    { test: (p: string) => /[0-9]/.test(p || ''), label: 'One number' },
    { test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p || ''), label: 'One special character' },
  ];
  
  const onSubmit = async (data: SignupForm) => {
    if (!selectedPlan) {
      toast.error('Please select a plan first');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          planId: selectedPlan.id,
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Account created successfully!');
        console.log('Plan price:', selectedPlan.price, 'Redirecting to:', selectedPlan.price > 0 ? '/payment' : '/dashboard');
        if (selectedPlan.price > 0) {
          // Force page reload to ensure session cookie is set before middleware check
          window.location.href = '/payment';
        } else {
          window.location.href = '/dashboard';
        }
      } else {
        toast.error(result.error || 'Failed to create account');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const selectPlan = (plan: typeof DEFAULT_PLANS[0]) => {
    setSelectedPlan(plan);
    setStep('details');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Premium Header */}
      <header className="fixed top-0 left-0 right-0 z-50 nav-blur">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-24">
          <button onClick={() => step === 'details' ? setStep('plan') : router.push('/')} className="flex items-center text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-3" />
            {step === 'details' ? 'Back' : 'Abort'}
          </button>
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">Earnix</span>
          </Link>
          <div className="w-24 hidden md:block" />
        </div>
      </header>

      <div className="pt-32 pb-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Progress Indicator */}
          <div className="flex flex-col items-center mb-16 lg:mb-20">
             <div className="flex items-center mb-6">
                <div className={cn(
                  'w-12 h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center font-black text-xs lg:text-sm tracking-widest transition-all duration-500',
                  step === 'plan' ? 'bg-slate-900 text-white shadow-2xl scale-110' : 'bg-green-500 text-white'
                )}>
                  {step === 'details' ? <Check className="w-5 h-5 lg:w-6 lg:h-6" /> : '01'}
                </div>
                <div className="w-16 lg:w-48 h-1 bg-slate-100 mx-3 lg:mx-4 overflow-hidden rounded-full">
                  <div className={cn('h-full bg-slate-900 transition-all duration-1000', step === 'details' ? 'w-full' : 'w-0')} />
                </div>
                <div className={cn(
                  'w-12 h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center font-black text-xs lg:text-sm tracking-widest transition-all duration-500',
                  step === 'details' ? 'bg-slate-900 text-white shadow-2xl scale-110' : 'bg-slate-50 text-slate-300 border border-slate-100'
                )}>
                  02
                </div>
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
               {step === 'plan' ? 'Step 1: Choose Your Plan' : 'Step 2: Enter Your Details'}
             </p>
          </div>

          {/* Plan Selection Step */}
          {step === 'plan' && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="text-center mb-16 lg:mb-20">
                <h1 className="text-3xl lg:text-7xl font-black text-slate-900 mb-6 tracking-tighter uppercase lg:normal-case">Choose Your <span className="text-gradient">Plan.</span></h1>
                <p className="text-base lg:text-lg text-slate-500 font-medium max-w-2xl mx-auto">Select a plan that fits your earning goals.</p>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {DEFAULT_PLANS.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => selectPlan(plan)}
                    className="premium-card cursor-pointer !p-8 lg:!p-10 group hover:bg-slate-900 hover:text-white transition-all duration-500 relative"
                  >
                    {plan.is_popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className="bg-indigo-600 text-white text-[10px] font-black px-6 py-2 rounded-full shadow-xl uppercase tracking-widest">
                          Most Popular
                        </span>
                      </div>
                    )}
                    
                    <h3 className="text-lg lg:text-xl font-black mb-4 lg:mb-6 uppercase tracking-tight">{plan.display_name}</h3>
                    <div className="mb-6 lg:mb-8">
                      <span className="text-3xl lg:text-4xl font-black">
                        {plan.price === 0 ? 'Free' : `₨ ${plan.price.toLocaleString()}`}
                      </span>
                    </div>
                    
                    <ul className="space-y-3 lg:space-y-4 mb-8 lg:mb-10 text-slate-500 group-hover:text-slate-400 transition-colors">
                      <li className="flex items-center text-xs lg:text-sm font-bold">
                        <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-indigo-500 mr-3 lg:mr-4" />
                        {plan.daily_task_limit} daily tasks
                      </li>
                      <li className="flex items-center text-xs lg:text-sm font-bold">
                        <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-indigo-500 mr-3 lg:mr-4" />
                        Up to {plan.max_points_per_task} pts/task
                      </li>
                      <li className="flex items-center text-xs lg:text-sm font-bold">
                        <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-indigo-500 mr-3 lg:mr-4" />
                        {plan.referral_reward} pts Referral
                      </li>
                    </ul>
                    
                    <div className="w-full py-4 text-center text-[10px] font-black uppercase tracking-[0.2em] border border-slate-100 group-hover:border-white/10 rounded-2xl transition-all">
                       Select Plan
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Details Step */}
          {step === 'details' && selectedPlan && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-3xl mx-auto">
              {/* Selected Plan Summary */}
              <div className="premium-card !p-6 lg:!p-8 !bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 lg:gap-8 mb-10 lg:mb-12">
                 <div className="flex items-center space-x-6">
                    <div className="w-14 h-14 lg:w-16 lg:h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                       <Zap className="w-6 h-6 lg:w-8 lg:h-8 text-primary-400" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">SELECTED PLAN</p>
                       <h3 className="text-2xl lg:text-3xl font-black tracking-tight">{selectedPlan.display_name}</h3>
                    </div>
                 </div>
                 <button 
                   onClick={() => setStep('plan')}
                   className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                 >
                   Change Plan
                 </button>
              </div>

              <div className="premium-card !p-8 md:!p-10 lg:!p-16">
                <h2 className="text-3xl lg:text-5xl font-black text-slate-900 mb-10 lg:mb-12 tracking-tighter">Create Your Account</h2>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 lg:space-y-10">
                  <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                     {/* Name */}
                     <div className="space-y-3 lg:space-y-4">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                       <div className="relative">
                         <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                         <input
                           {...register('name')}
                           type="text"
                           className={cn('w-full pl-16 pr-6 py-4 lg:py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 ring-indigo-50 outline-none font-bold text-slate-900 transition-all text-sm lg:text-base', errors.name && 'border-red-500 ring-red-50')}
                           placeholder="Full Name"
                         />
                       </div>
                     </div>

                     {/* Email */}
                     <div className="space-y-3 lg:space-y-4">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                       <div className="relative">
                         <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                         <input
                           {...register('email')}
                           type="email"
                           className={cn('w-full pl-16 pr-6 py-4 lg:py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 ring-indigo-50 outline-none font-bold text-slate-900 transition-all text-sm lg:text-base', errors.email && 'border-red-500 ring-red-50')}
                           placeholder="name@example.com"
                         />
                       </div>
                     </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-3 lg:space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        {...register('phone')}
                        type="tel"
                        className={cn('w-full pl-16 pr-6 py-4 lg:py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 ring-indigo-50 outline-none font-bold text-slate-900 transition-all text-sm lg:text-base', errors.phone && 'border-red-500 ring-red-50')}
                        placeholder="03XX-XXXXXXX"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                     {/* Password */}
                     <div className="space-y-3 lg:space-y-4">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Create Password</label>
                       <div className="relative">
                         <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                         <input
                           {...register('password')}
                           type={showPassword ? 'text' : 'password'}
                           className={cn('w-full pl-16 pr-14 py-4 lg:py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 ring-indigo-50 outline-none font-bold text-slate-900 transition-all text-sm lg:text-base', errors.password && 'border-red-500 ring-red-50')}
                           placeholder="Create password"
                         />
                         <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400">
                           {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                         </button>
                       </div>
                     </div>

                     {/* Confirm Password */}
                     <div className="space-y-3 lg:space-y-4">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confirm Password</label>
                       <div className="relative">
                         <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                         <input
                           {...register('confirmPassword')}
                           type={showConfirmPassword ? 'text' : 'password'}
                           className={cn('w-full pl-16 pr-14 py-4 lg:py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 ring-indigo-50 outline-none font-bold text-slate-900 transition-all text-sm lg:text-base', errors.confirmPassword && 'border-red-500 ring-red-50')}
                           placeholder="Confirm password"
                         />
                         <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400">
                           {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                         </button>
                       </div>
                     </div>
</div>

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              'h-full transition-all duration-500 rounded-full',
                              passwordRequirements.filter(r => r.test(password)).length >= 5 ? 'bg-green-500' :
                              passwordRequirements.filter(r => r.test(password)).length >= 3 ? 'bg-yellow-500' : 'bg-red-500',
                              passwordRequirements.filter(r => r.test(password)).length >= 5 ? 'w-full' :
                              passwordRequirements.filter(r => r.test(password)).length >= 3 ? 'w-3/5' : 'w-1/5'
                            )} 
                          />
                        </div>
                        <span className={cn(
                          'text-[10px] font-black uppercase tracking-widest',
                          passwordRequirements.filter(r => r.test(password)).length >= 5 ? 'text-green-600' :
                          passwordRequirements.filter(r => r.test(password)).length >= 3 ? 'text-yellow-600' : 'text-red-500'
                        )}>
                          {passwordRequirements.filter(r => r.test(password)).length >= 5 ? 'Strong' :
                           passwordRequirements.filter(r => r.test(password)).length >= 3 ? 'Medium' : 'Weak'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {passwordRequirements.map((req, index) => {
                          const isMet = req.test(password);
                          return (
                            <div 
                              key={index} 
                              className={cn(
                                'flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300',
                                isMet ? 'bg-green-50 text-green-700' : 'bg-slate-50 text-slate-400'
                              )}
                            >
                              {isMet ? (
                                <ShieldCheck className="w-4 h-4 text-green-500" />
                              ) : (
                                <Shield className="w-4 h-4" />
                              )}
                              <span className="text-[10px] font-bold">{req.label}</span>
                            </div>
                          );
                        })}
                      </div>
                      
                      {passwordRequirements.filter(r => r.test(password)).length < 3 && (
                        <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl">
                          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                          <p className="text-red-700 text-xs font-bold">
                            Your password is weak. Please meet at least 3 requirements to create a strong password that keeps your account secure.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                   {/* Referral Code */}
                   <div className="space-y-3 lg:space-y-4">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Referral Code (Optional)</label>
                    <div className="relative">
                      <Gift className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        {...register('referralCode')}
                        type="text"
                        className="w-full pl-16 pr-6 py-4 lg:py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 ring-indigo-50 outline-none font-bold text-slate-900 transition-all text-sm lg:text-base"
                        placeholder="ENTER-CODE"
                      />
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={cn(
                        'w-full py-5 lg:py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-2xl active:scale-[0.98]',
                        isLoading ? 'bg-slate-200 text-slate-400' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200'
                      )}
                    >
                      {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                    </button>
                    <p className="text-center text-slate-400 font-bold text-[10px] lg:text-xs mt-10 uppercase tracking-widest">
                       Already have an account? <Link href="/login" className="text-indigo-600 hover:underline">Sign In Now</Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-xl">Loading...</div></div>}>
      <SignupContent />
    </Suspense>
  );
}
