import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPoints(points: number): string {
  return new Intl.NumberFormat('en-PK').format(points);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function timeAgo(date: string | Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];
  
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }
  
  return 'Just now';
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    suspended: 'bg-red-100 text-red-800',
    rejected: 'bg-red-100 text-red-800',
    approved: 'bg-green-100 text-green-800',
    paid: 'bg-green-100 text-green-800',
    qualified: 'bg-green-100 text-green-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'ERNX-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function pointsToCurrency(points: number): number {
  return points * 0.1;
}

export function currencyToPoints(amount: number): number {
  return Math.ceil(amount / 0.1);
}

export function getRandomPoints(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export const DEFAULT_PLANS = [
  {
    id: 'free',
    name: 'free' as const,
    display_name: 'Free',
    price: 0,
    daily_task_limit: 2,
    min_points_per_task: 5,
    max_points_per_task: 12,
    daily_earning_cap: 50,
    withdrawal_threshold: 800,
    referral_reward: 100,
    bonus_points: 10,
    bonus_points_max: 20,
    is_popular: false,
    is_active: true,
  },
  {
    id: 'standard',
    name: 'standard' as const,
    display_name: 'Standard',
    price: 500,
    daily_task_limit: 5,
    min_points_per_task: 10,
    max_points_per_task: 25,
    daily_earning_cap: 150,
    withdrawal_threshold: 500,
    referral_reward: 150,
    bonus_points: 300,
    is_popular: false,
    is_active: true,
  },
  {
    id: 'premium',
    name: 'premium' as const,
    display_name: 'Premium',
    price: 1199,
    daily_task_limit: 10,
    min_points_per_task: 20,
    max_points_per_task: 50,
    daily_earning_cap: 300,
    withdrawal_threshold: 300,
    referral_reward: 250,
    bonus_points: 900,
    is_popular: true,
    is_active: true,
  },
  {
    id: 'ultra',
    name: 'ultra' as const,
    display_name: 'Ultra Pro',
    price: 1699,
    daily_task_limit: 15,
    min_points_per_task: 30,
    max_points_per_task: 80,
    daily_earning_cap: 500,
    withdrawal_threshold: 200,
    referral_reward: 350,
    bonus_points: 1500,
    is_popular: false,
    is_active: true,
  },
];
