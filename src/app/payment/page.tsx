'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  ArrowLeft, 
  Upload, 
  CheckCircle, 
  CreditCard,
  Smartphone,
  FileText
} from 'lucide-react';
import { cn, DEFAULT_PLANS } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import toast from 'react-hot-toast';

const paymentSchema = z.object({
  transactionId: z.string().min(5, 'Transaction ID must be at least 5 characters'),
});

type PaymentForm = z.infer<typeof paymentSchema>;

export default function PaymentPage() {
  const router = useRouter();
  const { selectedPlan } = useAppStore();
  const [receipt, setReceipt] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const { register, handleSubmit, formState: { errors } } = useForm<PaymentForm>();
  
  const paymentMethods = [
    {
      name: 'EasyPaisa',
      icon: Smartphone,
      color: 'bg-green-500',
    },
    {
      name: 'JazzCash',
      icon: Smartphone,
      color: 'bg-red-500',
    },
  ];
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setReceipt(file);
      const reader = new FileReader();
      reader.onload = () => setReceiptPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, []);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setReceipt(file);
      const reader = new FileReader();
      reader.onload = () => setReceiptPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };
  
  const onSubmit = async (data: PaymentForm) => {
    if (!receipt) {
      toast.error('Please upload payment receipt');
      return;
    }
    
    if (!selectedPlan) {
      toast.error('No plan selected');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('transactionId', data.transactionId);
      formData.append('receipt', receipt);
      formData.append('planId', selectedPlan.id);
      formData.append('amount', selectedPlan.price.toString());
      
      const response = await fetch('/api/payments', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Payment submitted successfully!');
        router.push('/pending-approval');
      } else {
        toast.error(result.error || 'Payment submission failed');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!selectedPlan || selectedPlan.price === 0) {
    router.push('/signup');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="container-custom py-5">
          <div className="flex items-center justify-between">
            <Link href="/signup" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Link>
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gradient">Earnix</span>
            </Link>
            <div className="w-16" />
          </div>
        </div>
      </header>

      <div className="container-custom py-12">
        <div className="max-w-3xl mx-auto">
          {/* Plan Summary */}
          <div className="card bg-gradient-to-r from-primary-50 to-secondary-50 p-8 mb-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Selected Plan</p>
                <h3 className="text-3xl font-bold text-gray-900">{selectedPlan.display_name}</h3>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 font-medium">Amount to Pay</p>
                <h3 className="text-4xl font-bold text-primary-600">PKR {selectedPlan.price}</h3>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="card p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Methods</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {paymentMethods.map((method) => (
                <div key={method.name} className="border-2 border-gray-200 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center mr-4', method.color)}>
                      <method.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-bold text-xl text-gray-900">{method.name}</span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p><span className="text-gray-500">Account Title:</span> Earnix Payments</p>
                    <p><span className="text-gray-500">Account Number:</span> 03XX-XXXXXXX</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
              <p className="text-yellow-800">
                <strong>Important:</strong> Send the exact amount (PKR {selectedPlan.price}) to the account above and keep your payment receipt safe. 
                You will need to upload it in the next step.
              </p>
            </div>
          </div>

          {/* Payment Form */}
          <div className="card p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Submit Payment Proof</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Transaction ID */}
              <div>
                <label className="label text-lg font-medium">Transaction ID</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                  <input
                    {...register('transactionId')}
                    type="text"
                    className={cn('input pl-14 py-4 text-lg', errors.transactionId && 'input-error')}
                    placeholder="Enter your transaction ID"
                  />
                </div>
                {errors.transactionId && (
                  <p className="text-red-500 text-sm mt-2">{errors.transactionId.message}</p>
                )}
              </div>

              {/* Receipt Upload */}
              <div>
                <label className="label text-lg font-medium">Payment Receipt</label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={cn(
                    'border-3 border-dashed rounded-xl p-10 text-center transition-all',
                    isDragging 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-300 hover:border-primary-400',
                    receipt && 'border-green-500 bg-green-50'
                  )}
                >
                  {receiptPreview ? (
                    <div className="space-y-6">
                      <img 
                        src={receiptPreview} 
                        alt="Receipt" 
                        className="max-h-64 mx-auto rounded-xl shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={() => { setReceipt(null); setReceiptPreview(null); }}
                        className="text-red-600 hover:underline font-medium"
                      >
                        Remove and upload different image
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Upload className="w-10 h-10 text-gray-400" />
                      </div>
                      <p className="text-gray-600 text-lg mb-3">
                        Drag and drop your receipt here, or{' '}
                        <label className="text-primary-600 hover:underline font-semibold cursor-pointer">
                          browse
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                        </label>
                      </p>
                      <p className="text-sm text-gray-400">PNG, JPG up to 5MB</p>
                    </>
                  )}
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-gray-50 rounded-xl p-8">
                <h3 className="font-bold text-gray-900 mb-4">Payment Instructions:</h3>
                <ol className="text-gray-600 space-y-3 list-decimal list-inside">
                  <li>Open your EasyPaisa or JazzCash app</li>
                  <li>Send PKR {selectedPlan.price} to the account number shown above</li>
                  <li>Copy the Transaction ID from your payment confirmation</li>
                  <li>Take a screenshot of your payment receipt</li>
                  <li>Upload the screenshot in the field above</li>
                  <li>Submit and wait for approval (usually within 24 hours)</li>
                </ol>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-5 text-lg"
              >
                {isLoading ? 'Submitting...' : 'Submit Payment Proof'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
