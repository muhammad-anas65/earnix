'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  TrendingUp,
  Wallet,
  Gift,
  CreditCard,
  Smartphone,
  Menu,
  X,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { cn, formatPoints, formatCurrency } from '@/lib/utils';

const withdrawSchema = z.object({
  amount: z.number().min(200, 'Minimum withdrawal is PKR 200'),
  method: z.enum(['easypaisa', 'jazzcash']),
  recipientName: z.string().min(2, 'Name is required'),
  recipientPhone: z.string().min(11, 'Valid phone number required'),
});

type WithdrawForm = z.infer<typeof withdrawSchema>;

const mockWallet = {
  available_points: 2450,
  pending_points: 320,
  locked_points: 500,
  inPKR: 245,
};

export default function WithdrawPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<WithdrawForm>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: {
      amount: 0,
      method: 'easypaisa',
    },
  });
  
  const amount = watch('amount');
  const minWithdrawal = 200;

  const onSubmit = async (data: WithdrawForm) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/withdrawals', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': 'mock-user-id',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('Withdrawal request submitted successfully!');
      } else {
        alert(result.error || 'Failed to submit withdrawal');
      }
    } catch (error) {
      alert('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'lg:hidden fixed left-0 top-0 h-full w-72 bg-white z-50 transform transition-transform',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">Earnix</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          {[
            { icon: TrendingUp, label: 'Dashboard', href: '/dashboard' },
            { icon: Wallet, label: 'Wallet', href: '/dashboard/wallet' },
            { icon: Gift, label: 'Referrals', href: '/dashboard/referrals' },
            { icon: CreditCard, label: 'Withdraw', href: '/dashboard/withdraw', active: true },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center px-5 py-4 rounded-xl transition-all',
                item.active 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              <item.icon className="w-6 h-6" />
              <span className="ml-4 font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1">
        <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-5">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Withdraw</h1>
                <p className="text-gray-500">Transfer your earnings to your account</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10">
          <div className="max-w-2xl mx-auto">
            {/* Balance Card */}
            <div className="card bg-gradient-to-br from-primary-600 to-secondary-600 text-white p-8 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 mb-2">Available Balance</p>
                  <p className="text-4xl font-bold mb-1">{formatPoints(mockWallet.available_points)} points</p>
                  <p className="text-white/80">= {formatCurrency(mockWallet.inPKR)}</p>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Wallet className="w-8 h-8" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/20">
                <div>
                  <p className="text-sm text-white/70">Pending</p>
                  <p className="text-xl font-semibold">{formatPoints(mockWallet.pending_points)} pts</p>
                </div>
                <div>
                  <p className="text-sm text-white/70">Locked</p>
                  <p className="text-xl font-semibold">{formatPoints(mockWallet.locked_points)} pts</p>
                </div>
              </div>
            </div>

            {/* Withdrawal Form */}
            <div className="card p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Request Withdrawal</h3>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Payment Method */}
                <div>
                  <label className="label font-medium mb-3">Payment Method</label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="cursor-pointer">
                      <input type="radio" {...register('method')} value="easypaisa" className="sr-only peer" />
                      <div className="p-4 border-2 border-gray-200 rounded-xl peer-checked:border-primary-500 peer-checked:bg-primary-50 transition-all">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                            <Smartphone className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold">EasyPaisa</p>
                            <p className="text-sm text-gray-500">Instant transfer</p>
                          </div>
                        </div>
                      </div>
                    </label>
                    <label className="cursor-pointer">
                      <input type="radio" {...register('method')} value="jazzcash" className="sr-only peer" />
                      <div className="p-4 border-2 border-gray-200 rounded-xl peer-checked:border-primary-500 peer-checked:bg-primary-50 transition-all">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                            <Smartphone className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold">JazzCash</p>
                            <p className="text-sm text-gray-500">Instant transfer</p>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Recipient Name */}
                <div>
                  <label className="label font-medium">Account Name</label>
                  <input
                    {...register('recipientName')}
                    type="text"
                    className="input"
                    placeholder="Enter your account name"
                  />
                  {errors.recipientName && (
                    <p className="text-red-500 text-sm mt-1">{errors.recipientName.message}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="label font-medium">Phone Number</label>
                  <input
                    {...register('recipientPhone')}
                    type="tel"
                    className="input"
                    placeholder="03XX-XXXXXXX"
                  />
                  {errors.recipientPhone && (
                    <p className="text-red-500 text-sm mt-1">{errors.recipientPhone.message}</p>
                  )}
                </div>

                {/* Amount */}
                <div>
                  <label className="label font-medium">Amount (PKR)</label>
                  <input
                    {...register('amount', { valueAsNumber: true })}
                    type="number"
                    className="input text-2xl font-bold"
                    placeholder="Enter amount"
                  />
                  {errors.amount && (
                    <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    Minimum withdrawal: {formatCurrency(minWithdrawal)} • 
                    Your balance: {formatCurrency(mockWallet.inPKR)}
                  </p>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> 100 points = 10 PKR. Your points will be converted at this rate.
                    Withdrawal requests are usually processed within 24-48 hours.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary py-4 text-lg"
                >
                  {isLoading ? 'Processing...' : 'Submit Withdrawal Request'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
