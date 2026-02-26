
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Palette, Type, Coins, Image as ImageIcon, CheckCircle2, Save, RefreshCcw, Layout, Share2, DollarSign, CreditCard, Crown } from 'lucide-react';

const AdminCustomizer: React.FC = () => {
  const { settings, updateSettings } = useApp();
  const [formData, setFormData] = useState({ ...settings });

  const handleSave = () => {
    updateSettings(formData);
    alert("App Customization Applied Successfully!");
  };

  const colors = [
    { name: 'Classic Blue', hex: '#3b82f6' },
    { name: 'Deep Purple', hex: '#8b5cf6' },
    { name: 'Emerald Green', hex: '#10b981' },
    { name: 'Ruby Red', hex: '#ef4444' },
    { name: 'Vibrant Orange', hex: '#f97316' },
    { name: 'Premium Black', hex: '#111827' },
  ];

  const inputClasses = "w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-700 dark:text-white border-2 border-transparent focus:border-blue-500 outline-none font-bold transition-all";

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">App Customizer</h2>
          <p className="text-gray-400 font-medium">Build your brand and control app economy.</p>
        </div>
        <button onClick={handleSave} className="bg-gray-900 dark:bg-blue-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl flex items-center gap-2 hover:-translate-y-1 active:scale-95 transition-all">
          <Save size={20} /> Apply Design
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Branding & Identity */}
        <section className="bg-white dark:bg-gray-800 rounded-[40px] p-8 border border-gray-100 dark:border-gray-700 shadow-sm space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center"><Layout /></div>
            <h3 className="text-xl font-bold dark:text-white">Brand Identity</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">App Name</label>
              <div className="relative">
                <Type className="absolute left-4 top-4 text-gray-400" size={18} />
                <input className={`${inputClasses} pl-12`} value={formData.appName} onChange={e => setFormData({...formData, appName: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">App Logo URL</label>
              <div className="relative">
                <ImageIcon className="absolute left-4 top-4 text-gray-400" size={18} />
                <input className={`${inputClasses} pl-12 font-mono text-xs`} value={formData.appLogoUrl} onChange={e => setFormData({...formData, appLogoUrl: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Premium Package Name</label>
              <div className="relative">
                <Crown className="absolute left-4 top-4 text-amber-500" size={18} />
                <input className={`${inputClasses} pl-12`} placeholder="e.g. Premium King, VIP Member" value={formData.premiumPackageName} onChange={e => setFormData({...formData, premiumPackageName: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="pt-4">
             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-4 block">Theme Primary Color</label>
             <div className="grid grid-cols-3 gap-3">
               {colors.map(c => (
                 <button 
                  key={c.hex} 
                  onClick={() => setFormData({...formData, themeColor: c.hex})}
                  className={`p-3 rounded-2xl border-2 flex items-center gap-2 transition-all ${formData.themeColor === c.hex ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-transparent bg-gray-50 dark:bg-gray-900'}`}
                 >
                   <div className="w-5 h-5 rounded-full shadow-inner" style={{ backgroundColor: c.hex }}></div>
                   <span className="text-[10px] font-bold dark:text-gray-300">{c.name}</span>
                 </button>
               ))}
             </div>
          </div>
        </section>

        {/* Economy Dashboard */}
        <section className="bg-white dark:bg-gray-800 rounded-[40px] p-8 border border-gray-100 dark:border-gray-700 shadow-sm space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center"><Coins /></div>
            <h3 className="text-xl font-bold dark:text-white">App Economy</h3>
          </div>

          <div className="grid gap-6">
            <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl border border-emerald-100 dark:border-emerald-800">
               <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Conversion Rate</span>
                  <DollarSign size={16} className="text-emerald-600" />
               </div>
               <div className="flex items-center gap-4">
                  <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-2xl text-center shadow-inner">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">1 Point</p>
                    <p className="text-xl font-black dark:text-white">=</p>
                  </div>
                  <div className="flex-1">
                    <input 
                      type="number" 
                      step="0.01"
                      className="w-full p-4 rounded-2xl bg-white dark:bg-gray-800 text-center font-black text-emerald-600 border-2 border-emerald-200 outline-none" 
                      value={formData.conversionRate} 
                      onChange={e => setFormData({...formData, conversionRate: parseFloat(e.target.value)})} 
                    />
                  </div>
                  <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-2xl text-center shadow-inner">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">BDT Value</p>
                    <p className="text-xl font-black dark:text-white">৳</p>
                  </div>
               </div>
               <p className="text-[10px] text-emerald-600/60 mt-4 text-center font-bold">Example: 0.5 means 100 Points = 50 BDT</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Custom Coin Name</label>
                <div className="relative">
                  <RefreshCcw className="absolute left-4 top-4 text-gray-400" size={18} />
                  <input className={`${inputClasses} pl-12`} placeholder="e.g. EarnCoin, GoldCash" value={formData.coinName} onChange={e => setFormData({...formData, coinName: e.target.value})} />
                </div>
              </div>
              
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Min Withdrawal Limit (BDT)</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-4 text-gray-400" size={18} />
                  <input type="number" className={`${inputClasses} pl-12`} value={formData.minWithdrawal} onChange={e => setFormData({...formData, minWithdrawal: parseInt(e.target.value)})} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Preview (Simulated) */}
        <section className="lg:col-span-2 bg-gray-50 dark:bg-gray-900 rounded-[40px] p-8 border-2 border-dashed border-gray-200 dark:border-gray-800">
           <div className="flex items-center gap-3 mb-8">
             <div className="w-3 h-3 rounded-full bg-red-400"></div>
             <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
             <div className="w-3 h-3 rounded-full bg-green-400"></div>
             <span className="text-xs font-black text-gray-400 uppercase ml-4">User Interface Preview</span>
           </div>
           
           <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-[32px] overflow-hidden shadow-2xl border dark:border-gray-700">
              <div className="p-4 flex items-center gap-3 border-b dark:border-gray-700">
                <img src={formData.appLogoUrl} className="w-6 h-6 object-contain" />
                <span className="font-black text-sm" style={{ color: formData.themeColor }}>{formData.appName}</span>
              </div>
              <div className="p-8 space-y-6">
                 <div className="p-6 rounded-3xl text-white shadow-lg" style={{ backgroundColor: formData.themeColor }}>
                    <p className="text-[10px] opacity-80 uppercase font-black">{formData.premiumPackageName} Dashboard</p>
                    <h4 className="text-3xl font-black">500 {formData.coinName}</h4>
                    <p className="text-xs mt-1 opacity-90">≈ {(500 * formData.conversionRate).toFixed(0)} BDT Cash</p>
                 </div>
                 <button className="w-full py-4 rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-lg" style={{ backgroundColor: formData.themeColor }}>
                    Withdraw Now
                 </button>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
};

export default AdminCustomizer;
