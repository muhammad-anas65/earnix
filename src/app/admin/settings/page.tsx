'use client';

import { Settings, Shield, Bell, Key, Globe, Database } from 'lucide-react';
import { useState } from 'react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
          <p className="text-gray-500 mt-1">Configure global application preferences and security rules.</p>
        </div>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-semibold transition">
          Save Changes
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
         <div className="w-full lg:w-64 flex-shrink-0">
            <div className="card overflow-hidden">
               <div className="flex flex-col">
                  {[
                    { id: 'general', icon: Globe, label: 'General' },
                    { id: 'security', icon: Shield, label: 'Security & Auth' },
                    { id: 'api', icon: Key, label: 'API Keys' },
                    { id: 'notifications', icon: Bell, label: 'Notifications' },
                    { id: 'database', icon: Database, label: 'Database Backup' },
                  ].map((tab) => (
                    <button 
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-3 px-5 py-4 text-left font-medium transition ${
                        activeTab === tab.id 
                        ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600' 
                        : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'
                      }`}
                    >
                      <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-primary-600' : 'text-gray-400'}`} />
                      {tab.label}
                    </button>
                  ))}
               </div>
            </div>
         </div>

         <div className="flex-1 card p-8">
            {activeTab === 'general' && (
              <div className="space-y-6 max-w-2xl">
                 <h2 className="text-xl font-bold text-gray-900 mb-4">General Details</h2>
                 <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Platform Name</label>
                    <input type="text" defaultValue="Earnix Platform" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                 </div>
                 <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Support Email</label>
                    <input type="email" defaultValue="support@earnix.com" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                 </div>
                 <div className="pt-4">
                    <label className="flex items-center gap-3">
                       <input type="checkbox" defaultChecked className="w-5 h-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500" />
                       <span className="text-gray-700 font-medium">Enable Maintenance Mode (Disable user logins)</span>
                    </label>
                 </div>
              </div>
            )}

            {activeTab !== 'general' && (
               <div className="py-20 text-center">
                  <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4 animate-spin-slow" />
                  <h3 className="text-lg font-bold text-gray-900">Advanced Configuration Options</h3>
                  <p className="text-gray-500 mt-2">This module is currently being optimized for Edge networking.</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
