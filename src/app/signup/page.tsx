'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  XCircle,
  Phone,
  Mail,
  User,
  Lock,
  Gift,
  CreditCard,
  Check
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
        if (selectedPlan.price > 0) {
          router.push('/payment');
        } else {
          router.push('/pending-approval');
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="container-custom py-5">
          <div className="flex items-center justify-between">
            <button onClick={() => step === 'details' ? setStep('plan') : router.push('/')} className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5 mr-2" />
              {step === 'details' ? 'Back' : 'Home'}
            </button>
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gradient">Earnix</span>
            </Link>
            <div className="w-24" />
          </div>
        </div>
      </header>

      <div className="container-custom py-12">
        <div className="max-w-5xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center">
              <div className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg',
                step === 'plan' ? 'bg-primary-600 text-white' : 'bg-green-500 text-white'
              )}>
                {step === 'details' ? <Check className="w-6 h-6" /> : '1'}
              </div>
              <div className="w-32 h-1 bg-gray-200 mx-4">
                <div className={cn('h-full bg-primary-600 transition-all', step === 'details' ? 'w-full' : 'w-0')} />
              </div>
              <div className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg',
                step === 'details' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
              )}>
                2
              </div>
            </div>
          </div>

          {/* Plan Selection Step */}
          {step === 'plan' && (
            <div className="animate-fade-in">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-3">Choose Your Plan</h1>
                <p className="text-lg text-gray-600">Select a plan that best fits your earning goals</p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {DEFAULT_PLANS.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => selectPlan(plan)}
                    className={cn(
                      'card-hover p-8 cursor-pointer relative text-center',
                      selectedPlan?.id === plan.id && 'ring-4 ring-primary-500'
                    )}
                  >
                    {plan.is_popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-primary text-white text-sm font-bold px-4 py-1 rounded-full">
                          Most Popular
                        </span>
                      </div>
                    )}
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{plan.display_name}</h3>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.price === 0 ? 'Free' : `PKR ${plan.price}`}
                      </span>
                    </div>
                    
                    <ul className="space-y-3 text-left">
                      <li className="flex items-center text-gray-600">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        {plan.daily_task_limit} tasks/day
                      </li>
                      <li className="flex items-center text-gray-600">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        {plan.min_points_per_task}-{plan.max_points_per_task} pts/task
                      </li>
                      <li className="flex items-center text-gray-600">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        Referral: {plan.referral_reward} pts
                      </li>
                      {plan.bonus_points > 0 && (
                        <li className="flex items-center text-secondary-600">
                          <Gift className="w-5 h-5 mr-3 flex-shrink-0" />
                          Bonus: {plan.bonus_points_max ? `${plan.bonus_points}-${plan.bonus_points_max}` : plan.bonus_points} pts
                        </li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Details Step */}
          {step === 'details' && selectedPlan && (
            <div className="animate-fade-in">
              {/* Selected Plan Summary */}
              <div className="card bg-gradient-to-r from-primary-50 to-secondary-50 p-8 mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Selected Plan</p>
                    <h3 className="text-3xl font-bold text-gray-900">{selectedPlan.display_name}</h3>
                    <p className="text-gray-600">
                      {selectedPlan.price === 0 ? 'Free Plan - No payment required' : `PKR ${selectedPlan.price} - Payment required after signup`}
                    </p>
                  </div>
                  <button 
                    onClick={() => setStep('plan')}
                    className="text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    Change Plan
                  </button>
                </div>
              </div>

              <div className="card p-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Create Your Account</h2>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="label text-lg font-medium">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                      <input
                        {...register('name')}
                        type="text"
                        className={cn('input pl-14 py-4 text-lg', errors.name && 'input-error')}
                        placeholder="Enter your full name"
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <XCircle className="w-4 h-4 mr-1" />
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="label text-lg font-medium">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                      <input
                        {...register('email')}
                        type="email"
                        className={cn('input pl-14 py-4 text-lg', errors.email && 'input-error')}
                        placeholder="Enter your email"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <XCircle className="w-4 h-4 mr-1" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="label text-lg font-medium">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                      <input
                        {...register('phone')}
                        type="tel"
                        className={cn('input pl-14 py-4 text-lg', errors.phone && 'input-error')}
                        placeholder="03XX-XXXXXXX"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <XCircle className="w-4 h-4 mr-1" />
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="label text-lg font-medium">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                      <input
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'}
                        className={cn('input pl-14 pr-14 py-4 text-lg', errors.password && 'input-error')}
                        placeholder="Create a strong password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                      </button>
                    </div>
                    
                    {password && (
                      <div className="mt-4 space-y-2">
                        {passwordRequirements.map((req, index) => (
                          <div 
                            key={index} 
                            className={cn(
                              'flex items-center text-sm',
                              req.test(password) ? 'text-green-600' : 'text-gray-400'
                            )}
                          >
                            {req.test(password) ? (
                              <CheckCircle className="w-4 h-4 mr-2" />
                            ) : (
                              <XCircle className="w-4 h-4 mr-2" />
                            )}
                            {req.label}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <XCircle className="w-4 h-4 mr-1" />
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="label text-lg font-medium">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                      <input
                        {...register('confirmPassword')}
                        type={showConfirmPassword ? 'text' : 'password'}
                        className={cn('input pl-14 pr-14 py-4 text-lg', errors.confirmPassword && 'input-error')}
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <XCircle className="w-4 h-4 mr-1" />
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Referral Code */}
                  <div>
                    <label className="label text-lg font-medium">Referral Code (Optional)</label>
                    <div className="relative">
                      <Gift className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                      <input
                        {...register('referralCode')}
                        type="text"
                        className="input pl-14 py-4 text-lg"
                        placeholder="Enter referral code if you have one"
                      />
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="terms"
                      className="mt-1 mr-3 w-5 h-5"
                      required
                    />
                    <label htmlFor="terms" className="text-base text-gray-600">
                      I agree to the{' '}
                      <Link href="/terms" className="text-primary-600 hover:underline font-medium">Terms of Service</Link>
                      {' '}and{' '}
                      <Link href="/privacy" className="text-primary-600 hover:underline font-medium">Privacy Policy</Link>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn-primary py-5 text-lg"
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </form>

                <p className="text-center text-gray-600 mt-8 text-lg">
                  Already have an account?{' '}
                  <Link href="/login" className="text-primary-600 hover:underline font-semibold">
                    Sign In
                  </Link>
                </p>
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
