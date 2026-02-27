import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Save, Smartphone, Link as LinkIcon, ShieldCheck, CreditCard } from 'lucide-react';

const AdminPaymentConfig: React.FC = () => {
  const { settings, updateSettings } = useApp();
  const [formData, setFormData] = useState({ ...settings });

  const handleSave = () => {
    updateSettings(formData);
    alert("Payment & Verification Settings Updated!");
  };

  const inputClasses = "w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-700 dark:text-white border-none text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all";
  const labelClasses = "block text-xs font-bold text-gray-400 uppercase mb-2";

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Payment & Verification</h2>
          <p className="text-gray-400 font-medium">Configure system payment numbers and verification links.</p>
        </div>
        <button onClick={handleSave} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black shadow-xl flex items-center gap-2 hover:-translate-y-1 transition-all">
          <Save size={20} /> Save Changes
        </button>
      </div>

      <div className="grid gap-8">
        {/* Verification Configuration */}
        <section className="bg-white dark:bg-gray-800 rounded-[32px] p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center"><ShieldCheck /></div>
            <h3 className="text-xl font-bold dark:text-white">Verification Settings</h3>
          </div>
          
          <div>
            <label className={labelClasses}>Verification Link (Form/Instruction)</label>
            <div className="relative">
              <LinkIcon className="absolute left-4 top-4 text-gray-400" size={20} />
              <input 
                className={`${inputClasses} pl-12`} 
                placeholder="https://forms.google.com/..."
                value={formData.verificationLink || ''} 
                onChange={e => setFormData({...formData, verificationLink: e.target.value})} 
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-2">Link where users will be directed for verification details.</p>
          </div>
        </section>

        {/* System Pay Configuration */}
        <section className="bg-white dark:bg-gray-800 rounded-[32px] p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center"><CreditCard /></div>
            <h3 className="text-xl font-bold dark:text-white">System Pay (Nagad & Bkash)</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>Bkash Number (Personal/Agent)</label>
              <div className="relative">
                <Smartphone className="absolute left-4 top-4 text-pink-500" size={20} />
                <input 
                  className={`${inputClasses} pl-12`} 
                  placeholder="017..."
                  value={formData.bkashNumber || ''} 
                  onChange={e => setFormData({...formData, bkashNumber: e.target.value})} 
                />
              </div>
            </div>
            
            <div>
              <label className={labelClasses}>Nagad Number (Personal/Agent)</label>
              <div className="relative">
                <Smartphone className="absolute left-4 top-4 text-orange-500" size={20} />
                <input 
                  className={`${inputClasses} pl-12`} 
                  placeholder="017..."
                  value={formData.nagadNumber || ''} 
                  onChange={e => setFormData({...formData, nagadNumber: e.target.value})} 
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminPaymentConfig;
