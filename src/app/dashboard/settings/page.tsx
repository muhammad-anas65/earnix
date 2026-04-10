'use client';

import { useState, useEffect } from 'react';
import { 
  Bell, 
  Lock, 
  Eye, 
  EyeOff, 
  Shield, 
  Trash2,
  Save,
  Moon,
  Sun,
  Smartphone,
  Mail,
  AlertTriangle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { createClient } from '@/utils/supabase/client';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Notification preferences
  const [notifications, setNotifications] = useState({
    email_tasks: true,
    email_withdrawals: true,
    email_referrals: true,
    push_enabled: false,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const resp = await fetch('/api/users/me');
        const result = await resp.json();
        if (result.success) {
          setUser(result.data.user);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handlePasswordChange = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setPasswordLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      });
      
      if (error) {
        toast.error(error.message || 'Failed to update password');
      } else {
        toast.success('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    // Simulate save — in production this would call an API
    await new Promise(r => setTimeout(r, 800));
    toast.success('Notification preferences saved!');
    setSaving(false);
  };

  const handleDeleteAccount = () => {
    toast.error('Please contact support to delete your account', {
      icon: '⚠️',
      duration: 4000,
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl bg-slate-200 animate-pulse h-12 w-48" />
        <div className="bg-white rounded-2xl p-6 animate-pulse border border-slate-100 h-64" />
        <div className="bg-white rounded-2xl p-6 animate-pulse border border-slate-100 h-64" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your account preferences and security.</p>
      </div>

      {/* ── NOTIFICATION PREFERENCES ── */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
            <Bell className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">Notifications</h2>
            <p className="text-xs text-slate-400 mt-0.5">Choose how you want to be notified</p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {[
            { key: 'email_tasks', label: 'Task Updates', desc: 'Get notified about new tasks and completions', icon: Mail },
            { key: 'email_withdrawals', label: 'Withdrawal Alerts', desc: 'Notifications for withdrawal status changes', icon: Shield },
            { key: 'email_referrals', label: 'Referral Activity', desc: 'Know when someone uses your referral code', icon: Smartphone },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{item.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                </div>
              </div>
              <button
                onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                className={`relative w-11 h-6 rounded-full transition-all duration-200 ${
                  notifications[item.key as keyof typeof notifications] 
                    ? 'bg-indigo-600' 
                    : 'bg-slate-200'
                }`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-200 ${
                  notifications[item.key as keyof typeof notifications] ? 'left-[22px]' : 'left-0.5'
                }`} />
              </button>
            </div>
          ))}

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={handleSaveNotifications}
              disabled={saving}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {saving ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
              ) : (
                <><Save className="w-4 h-4" /> Save Preferences</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── SECURITY / PASSWORD ── */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
            <Lock className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">Security</h2>
            <p className="text-xs text-slate-400 mt-0.5">Update your password</p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Current Password */}
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showCurrentPass ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">New Password</label>
            <div className="relative">
              <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showNewPass ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 chars)"
                className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Confirm New Password</label>
            <div className="relative">
              <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
          </div>

          {newPassword && confirmPassword && (
            <div className={`flex items-center gap-2 text-sm font-semibold ${
              newPassword === confirmPassword ? 'text-emerald-600' : 'text-red-500'
            }`}>
              {newPassword === confirmPassword ? (
                <><CheckCircle className="w-4 h-4" /> Passwords match</>
              ) : (
                <><AlertTriangle className="w-4 h-4" /> Passwords do not match</>
              )}
            </div>
          )}

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={handlePasswordChange}
              disabled={passwordLoading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {passwordLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</>
              ) : (
                <><Lock className="w-4 h-4" /> Update Password</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── DANGER ZONE ── */}
      <div className="bg-white border border-red-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-red-50 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h2 className="text-sm font-black text-red-600 uppercase tracking-wide">Danger Zone</h2>
            <p className="text-xs text-slate-400 mt-0.5">Irreversible account actions</p>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between p-4 bg-red-50/50 border border-red-100 border-dashed rounded-xl">
            <div>
              <p className="text-sm font-bold text-slate-800">Delete Account</p>
              <p className="text-xs text-slate-400 mt-0.5">Permanently remove your account and all data</p>
            </div>
            <button
              onClick={handleDeleteAccount}
              className="flex items-center gap-2 bg-white hover:bg-red-500 hover:text-white text-red-500 border border-red-200 px-4 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
