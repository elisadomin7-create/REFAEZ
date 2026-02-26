
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Save, Globe, Bell, Key, Info, AlertTriangle, CheckCircle, Plus, Globe2, Copy, ExternalLink, ShieldAlert } from 'lucide-react';

const AdminSettings: React.FC = () => {
  const { settings, updateSettings, broadcastNotification } = useApp();
  const [formData, setFormData] = useState({ ...settings });
  const [notif, setNotif] = useState({ title: '', message: '' });
  
  const [newAdPost, setNewAdPost] = useState({ providerName: '', adKeyOrCode: '', placement: 'MISSIONS' as any });

  const handleSave = () => {
    updateSettings(formData);
    alert("System updated successfully!");
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notif.title || !notif.message) return;
    broadcastNotification(notif.title, notif.message);
    setNotif({ title: '', message: '' });
    alert("Global Announcement Sent!");
  };

  const addAdPost = () => {
    if (!newAdPost.providerName || !newAdPost.adKeyOrCode) return;
    const updatedPosts = [...formData.adPosts, { ...newAdPost, id: 'post_' + Date.now(), isActive: true }];
    setFormData({ ...formData, adPosts: updatedPosts });
    setNewAdPost({ providerName: '', adKeyOrCode: '', placement: 'MISSIONS' });
  };

  const copyDomain = () => {
    navigator.clipboard.writeText(window.location.hostname);
    alert("Hostname copied: " + window.location.hostname);
  };

  const inputClasses = "w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-700 dark:text-white border-none text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all";

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">App Control</h2>
          <p className="text-gray-400 font-medium">Configure ads, branding, and rules.</p>
        </div>
        <button onClick={handleSave} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl flex items-center gap-2 hover:-translate-y-1 transition-all">
          <Save size={20} /> Deploy Changes
        </button>
      </div>

      <div className="grid gap-8">
        {/* Firebase Error Troubleshooting */}
        <section className="bg-red-50 dark:bg-red-950/20 rounded-[32px] p-8 border-2 border-red-200 dark:border-red-900 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-red-500 text-white flex items-center justify-center shadow-lg"><AlertTriangle size={28} /></div>
            <div>
              <h3 className="text-xl font-black text-red-900 dark:text-red-200 uppercase tracking-tight">গুগল লগইন ঠিক করার নিয়ম (Fix Google Login)</h3>
              <p className="text-sm text-red-700 dark:text-red-400 font-medium">আপনি AI Studio ব্যবহার করছেন, তাই নিচের ডোমেইনটি ফায়ারবেসে অ্যাড করতে হবে:</p>
            </div>
          </div>
          
          <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">১. <a href="https://console.firebase.google.com/" target="_blank" className="text-blue-600 underline inline-flex items-center gap-1">Firebase Console</a> এ যান।</p>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">২. <b className="text-blue-600">Authentication &gt; Settings &gt; Authorized domains</b> এ যান।</p>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">৩. <b className="text-red-600">Add domain</b> বাটনে ক্লিক করে নিচের টেক্সটটি পেস্ট করুন:</p>
            </div>
            
            <div className="p-6 bg-yellow-100 dark:bg-gray-900 rounded-2xl border-4 border-dashed border-red-500 flex flex-col items-center gap-4">
              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Copy this exact domain</span>
              <code className="text-xl md:text-2xl font-black text-blue-700 dark:text-blue-400 break-all text-center">{window.location.hostname}</code>
              <button 
                onClick={copyDomain} 
                className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
              >
                <Copy size={20} /> Copy Domain Name
              </button>
            </div>
          </div>
        </section>

        {/* Earning Control */}
        <section className="bg-white dark:bg-gray-800 rounded-[32px] p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
           <div className="flex items-center gap-4 mb-6">
             <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center"><CheckCircle /></div>
             <h3 className="text-xl font-bold dark:text-white">System Status</h3>
           </div>
           <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setFormData({...formData, isEarningEnabled: !formData.isEarningEnabled})}
                className={`p-4 rounded-2xl font-black text-xs uppercase tracking-widest border-2 transition-all ${formData.isEarningEnabled ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}
              >
                Earning: {formData.isEarningEnabled ? 'Enabled' : 'Disabled'}
              </button>
              <button 
                onClick={() => setFormData({...formData, isReferralSystemEnabled: !formData.isReferralSystemEnabled})}
                className={`p-4 rounded-2xl font-black text-xs uppercase tracking-widest border-2 transition-all ${formData.isReferralSystemEnabled ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-red-50 border-red-200 text-red-700'}`}
              >
                Referral: {formData.isReferralSystemEnabled ? 'Active' : 'Off'}
              </button>
           </div>
        </section>

        {/* Ad Posting Section */}
        <section className="bg-white dark:bg-gray-800 rounded-[32px] p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><Globe2 /></div>
            <div>
              <h3 className="text-xl font-bold dark:text-white">Website Ad Control</h3>
              <p className="text-xs text-gray-400">Add Adsterra, Monetag, or any Script ads.</p>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-[28px] border dark:border-gray-700 space-y-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                placeholder="Provider Name (e.g. Adsterra)" 
                className={inputClasses} 
                value={newAdPost.providerName} 
                onChange={e => setNewAdPost({...newAdPost, providerName: e.target.value})} 
              />
              <select 
                className={inputClasses} 
                value={newAdPost.placement} 
                onChange={e => setNewAdPost({...newAdPost, placement: e.target.value as any})}
              >
                <option value="MISSIONS">Missions Page</option>
                <option value="DASHBOARD">Dashboard Banner</option>
                <option value="WALLET">Wallet Page</option>
              </select>
            </div>
            <textarea 
              placeholder="Paste Ad Code / Script here..." 
              className={`${inputClasses} h-24 font-mono text-xs`} 
              value={newAdPost.adKeyOrCode} 
              onChange={e => setNewAdPost({...newAdPost, adKeyOrCode: e.target.value})} 
            />
            <button onClick={addAdPost} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg hover:bg-indigo-700">
              <Plus size={18}/> Publish Ad Code
            </button>
          </div>
        </section>

        {/* Global Announcement */}
        <section className="bg-white dark:bg-gray-800 rounded-[32px] p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center"><Bell /></div>
            <h3 className="text-xl font-bold dark:text-white">Global Broadcast</h3>
          </div>
          <form onSubmit={handleBroadcast} className="space-y-4">
            <input placeholder="Notice Title" className={inputClasses} value={notif.title} onChange={e => setNotif({...notif, title: e.target.value})} />
            <textarea placeholder="Write message to all users..." className={`${inputClasses} h-24`} value={notif.message} onChange={e => setNotif({...notif, message: e.target.value})} />
            <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-all">Send Global Notification</button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default AdminSettings;
