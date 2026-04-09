'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, Shield, Camera, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading || !user) {
    return <div className="p-20 text-center animate-pulse">Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Account Profile</h1>
        <p className="text-gray-500">Manage your personal information and account security.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Avatar Sidebar */}
        <div className="card p-8 flex flex-col items-center">
          <div className="relative group">
            <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-4xl font-black border-4 border-white shadow-xl">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <button className="absolute bottom-0 right-0 bg-slate-900 text-white p-2.5 rounded-full shadow-lg hover:scale-110 transition-transform">
              <Camera className="w-5 h-5" />
            </button>
          </div>
          <h2 className="mt-6 text-xl font-bold text-slate-800">{user.name}</h2>
          <p className="text-sm font-bold text-primary-600 bg-primary-50 px-4 py-1.5 rounded-full mt-2 border border-primary-100 uppercase tracking-widest">{user.plan?.display_name || 'Free'} Plan</p>
          
          <div className="w-full mt-8 pt-8 border-t border-gray-100 space-y-4">
             <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400 font-medium">Joined</span>
                <span className="text-slate-800 font-bold">{new Date(user.created_at).toLocaleDateString()}</span>
             </div>
             <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400 font-medium">Status</span>
                <span className="text-green-600 font-bold uppercase tracking-wider">{user.status}</span>
             </div>
          </div>
        </div>

        {/* Info Form */}
        <div className="md:col-span-2 space-y-6">
           <div className="card p-8">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                 <Shield className="w-5 h-5 mr-3 text-primary-600" /> General Information
              </h3>
              
              <div className="space-y-6">
                 <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                       <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">Full Name</label>
                       <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input readOnly value={user.name} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-800 font-bold outline-none cursor-not-allowed" />
                       </div>
                    </div>
                    <div>
                       <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">Referral Code</label>
                       <div className="relative">
                          <input readOnly value={user.referral_code?.toUpperCase()} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-800 font-mono font-bold outline-none cursor-not-allowed" />
                       </div>
                    </div>
                 </div>

                 <div>
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">Email Address</label>
                    <div className="relative">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                       <input readOnly value={user.email} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-800 font-bold outline-none cursor-not-allowed" />
                    </div>
                 </div>

                 <div>
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">Phone Number</label>
                    <div className="relative">
                       <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                       <input readOnly value={user.phone || 'Not provided'} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-800 font-bold outline-none cursor-not-allowed" />
                    </div>
                 </div>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-100">
                 <button disabled className="bg-slate-200 text-slate-400 px-8 py-3.5 rounded-xl font-bold text-sm cursor-not-allowed flex items-center">
                    <Save className="w-4 h-4 mr-2" /> Save Profile Changes
                 </button>
                 <p className="mt-3 text-[10px] text-gray-400 font-medium">To keep our network secure, please contact support to change your registered identity.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
