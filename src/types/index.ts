export type PlanName = 'free' | 'standard' | 'premium' | 'ultra';
export type UserStatus = 'pending' | 'active' | 'suspended' | 'rejected';
export type PaymentStatus = 'pending' | 'approved' | 'rejected';
export type WithdrawalStatus = 'pending' | 'approved' | 'rejected' | 'paid';
export type TaskStatus = 'available' | 'completed' | 'pending_verification' | 'rejected';
export type ReferralStatus = 'pending' | 'qualified' | 'expired';
export type AdminRole = 'super_admin' | 'admin' | 'support';

export interface Plan {
  id: string;
  name: PlanName;
  display_name: string;
  price: number;
  daily_task_limit: number;
  min_points_per_task: number;
  max_points_per_task: number;
  daily_earning_cap: number;
  withdrawal_threshold: number;
  referral_reward: number;
  bonus_points: number;
  bonus_points_max?: number;
  is_popular: boolean;
  is_active: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password_hash?: string;
  referral_code: string;
  referred_by?: string;
  plan_id: string;
  plan?: Plan;
  status: UserStatus;
  device_id?: string;
  ip_address?: string;
  created_at: string;
  updated_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  available_points: number;
  pending_points: number;
  locked_points: number;
  total_earned: number;
  total_withdrawn: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  points_min: number;
  points_max: number;
  task_type: 'click' | 'watch' | 'survey' | 'download' | 'signup';
  is_active: boolean;
}

export interface UserTask {
  id: string;
  user_id: string;
  task_id: string;
  task?: Task;
  status: TaskStatus;
  points_earned: number;
  completed_at?: string;
}

export interface DailyTaskLog {
  user_id: string;
  date: string;
  tasks_completed: number;
  points_earned: number;
}

export interface Payment {
  id: string;
  user_id: string;
  user?: User;
  plan_id: string;
  plan?: Plan;
  transaction_id: string;
  amount: number;
  receipt_image: string;
  status: PaymentStatus;
  admin_notes?: string;
  processed_by?: string;
  processed_at?: string;
  created_at: string;
}

export interface Withdrawal {
  id: string;
  user_id: string;
  user?: User;
  amount: number;
  points_used: number;
  method: 'easypaisa' | 'jazzcash';
  recipient_name: string;
  recipient_phone: string;
  status: WithdrawalStatus;
  admin_notes?: string;
  processed_by?: string;
  processed_at?: string;
  created_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  referrer?: User;
  referred?: User;
  status: ReferralStatus;
  tasks_completed: number;
  reward_sent: boolean;
  reward_points: number;
  qualified_at?: string;
  created_at: string;
}

export interface Admin {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  is_active: boolean;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

export interface FraudLog {
  id: string;
  user_id?: string;
  event_type: string;
  details: Record<string, unknown>;
  ip_address?: string;
  device_id?: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'task' | 'referral' | 'withdrawal' | 'bonus';
  amount: number;
  description: string;
  created_at: string;
}
