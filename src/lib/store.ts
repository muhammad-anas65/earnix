import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Wallet, Plan } from '@/types';

interface AuthState {
  user: User | null;
  wallet: Wallet | null;
  plan: Plan | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setWallet: (wallet: Wallet | null) => void;
  setPlan: (plan: Plan | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      wallet: null,
      plan: null,
      isAuthenticated: false,
      isLoading: true,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setWallet: (wallet) => set({ wallet }),
      setPlan: (plan) => set({ plan }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, wallet: null, plan: null, isAuthenticated: false }),
    }),
    {
      name: 'earnix-auth',
    }
  )
);

interface AppState {
  selectedPlan: Plan | null;
  referralCode: string | null;
  setSelectedPlan: (plan: Plan | null) => void;
  setReferralCode: (code: string | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      selectedPlan: null,
      referralCode: null,
      setSelectedPlan: (selectedPlan) => set({ selectedPlan }),
      setReferralCode: (referralCode) => set({ referralCode }),
    }),
    {
      name: 'earnix-app',
    }
  )
);
