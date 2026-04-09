'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Clock, CheckCircle, CreditCard, AlertCircle } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function PendingApprovalPage() {
  const router = useRouter();
  const { selectedPlan } = useAppStore();
  const [timeLeft, setTimeLeft] = useState({
    hours: 24,
    minutes: 0,
    seconds: 0,
  });
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is already active and get creation date
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/users/me');
        const result = await res.json();
        if (result.success) {
          if (result.data.user.status === 'active') {
            router.push('/dashboard');
            return true;
          }
          setCreatedAt(result.data.user.created_at);
        }
      } catch (err) {
        console.error('Error fetching user status:', err);
      } finally {
        setIsDataLoading(false);
      }
      return false;
    };
    
    // Initial check
    checkStatus();

    // Set up polling every 5 seconds
    const pollInterval = setInterval(async () => {
      const isApproved = await checkStatus();
      if (isApproved) {
        clearInterval(pollInterval);
      }
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [router]);

  useEffect(() => {
    if (!createdAt) return;

    const creationTime = new Date(createdAt);
    const endTime = new Date(creationTime.getTime() + 24 * 60 * 60 * 1000); // 24 hours from creation
    
    const updateTimer = () => {
      const now = new Date();
      const diff = endTime.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft({ hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(interval);
  }, [createdAt]);
  
  const tips = [
    'Make sure your payment proof is clear and readable',
    'Double-check your phone number and email',
    'Keep your payment receipt safe',
    'Check your email for updates',
  ];

  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center space-x-3">
            <div className="w-14 h-14 bg-gradient-primary rounded-xl flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold text-gradient">Earnix</span>
          </Link>
        </div>
        
        {/* Main Card */}
        <div className="card p-12 text-center">
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <Clock className="w-12 h-12 text-yellow-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Account Under Review</h1>
          <p className="text-lg text-gray-600 mb-10">
            Your account is currently being reviewed by our team.<br />
            We&apos;ll notify you via email once approved.
          </p>
          
          {/* Countdown Timer */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-10">
            <p className="text-sm text-gray-500 mb-6 font-medium">Estimated Review Time</p>
            <div className="flex justify-center space-x-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-gray-900">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <div className="text-sm text-gray-500 mt-2">Hours</div>
              </div>
              <div className="text-5xl font-bold text-gray-300">:</div>
              <div className="text-center">
                <div className="text-5xl font-bold text-gray-900">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <div className="text-sm text-gray-500 mt-2">Minutes</div>
              </div>
              <div className="text-5xl font-bold text-gray-300">:</div>
              <div className="text-center">
                <div className="text-5xl font-bold text-gray-900">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <div className="text-sm text-gray-500 mt-2">Seconds</div>
              </div>
            </div>
          </div>
          
          {/* Selected Plan */}
          {selectedPlan && (
            <div className="bg-primary-50 rounded-xl p-6 mb-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="w-6 h-6 text-primary-600 mr-4" />
                  <span className="text-gray-700 font-medium">Selected Plan</span>
                </div>
                <div>
                  <span className="font-bold text-gray-900 text-lg">{selectedPlan.display_name}</span>
                  {selectedPlan.price > 0 && (
                    <span className="text-gray-500 ml-2">
                      (PKR {selectedPlan.price})
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Status Indicator */}
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 mb-10">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span>Account Created</span>
            </div>
            <div className="w-8 h-px bg-gray-300" />
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-yellow-500 mr-2" />
              <span>Under Review</span>
            </div>
            <div className="w-8 h-px bg-gray-300" />
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-gray-300 mr-2" />
              <span>Pending Activation</span>
            </div>
          </div>
          
          {/* Tips */}
          <div className="bg-blue-50 rounded-xl p-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 text-blue-600 mr-2" />
              Tips for Faster Approval
            </h3>
            <ul className="space-y-3">
              {tips.map((tip, index) => (
                <li key={index} className="flex items-start text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Contact Support */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-2">Need help? Contact our support team</p>
          <a 
            href="mailto:support@earnix.pk" 
            className="text-primary-600 hover:underline font-medium"
          >
            support@earnix.pk
          </a>
        </div>
      </div>
    </div>
  );
}
