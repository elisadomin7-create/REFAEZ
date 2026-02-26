
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Save, Users, MessageCircle, Facebook, Send, Bot, Key } from 'lucide-react';

const AdminSystemConfig: React.FC = () => {
  const { settings, updateSettings } = useApp();
  const [formData, setFormData] = useState({ ...settings });

  const handleSave = () => {
    updateSettings(formData);
    alert("System Configuration Updated Successfully!");
  };

  const inputClasses = "w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-700 dark:text-white border-none text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all";
  const labelClasses = "block text-xs font-bold text-gray-400 uppercase mb-2";

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">System Configuration</h2>
          <p className="text-gray-400 font-medium">Manage rewards, support links, and AI settings.</p>
        </div>
        <button onClick={handleSave} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black shadow-xl flex items-center gap-2 hover:-translate-y-1 transition-all">
          <Save size={20} /> Save Changes
        </button>
      </div>

      <div className="grid gap-8">
        {/* Referral Rewards Section */}
        <section className="bg-white dark:bg-gray-800 rounded-[32px] p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center"><Users /></div>
            <h3 className="text-xl font-bold dark:text-white">Referral Rewards</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>Referrer Bonus (Points)</label>
              <input 
                type="number" 
                className={inputClasses} 
                value={formData.referralRewardReferrer} 
                onChange={e => setFormData({...formData, referralRewardReferrer: Number(e.target.value)})} 
              />
              <p className="text-[10px] text-gray-400 mt-2">Points given to the user who shared the link.</p>
            </div>
            <div>
              <label className={labelClasses}>New User Bonus (Points)</label>
              <input 
                type="number" 
                className={inputClasses} 
                value={formData.referralRewardUser} 
                onChange={e => setFormData({...formData, referralRewardUser: Number(e.target.value)})} 
              />
              <p className="text-[10px] text-gray-400 mt-2">Points given to the new user who joined.</p>
            </div>
          </div>
        </section>

        {/* Support Links Section */}
        <section className="bg-white dark:bg-gray-800 rounded-[32px] p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center"><MessageCircle /></div>
            <h3 className="text-xl font-bold dark:text-white">Support & Social Links</h3>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <Facebook className="absolute left-4 top-4 text-blue-600" size={20} />
              <input 
                className={`${inputClasses} pl-12`} 
                placeholder="Facebook Page/Group Link"
                value={formData.facebookLink} 
                onChange={e => setFormData({...formData, facebookLink: e.target.value})} 
              />
            </div>
            <div className="relative">
              <Send className="absolute left-4 top-4 text-sky-500" size={20} />
              <input 
                className={`${inputClasses} pl-12`} 
                placeholder="Telegram Channel/Group Link"
                value={formData.telegramLink} 
                onChange={e => setFormData({...formData, telegramLink: e.target.value})} 
              />
            </div>
            <div className="relative">
              <MessageCircle className="absolute left-4 top-4 text-green-500" size={20} />
              <input 
                className={`${inputClasses} pl-12`} 
                placeholder="WhatsApp Group/Number Link"
                value={formData.whatsappLink} 
                onChange={e => setFormData({...formData, whatsappLink: e.target.value})} 
              />
            </div>
            <div>
              <label className={labelClasses}>Minimum Withdrawal Notice</label>
              <input 
                className={inputClasses} 
                placeholder="e.g. Minimum withdrawal is 500 BDT. Please earn more."
                value={formData.minWithdrawalNotice || ''} 
                onChange={e => setFormData({...formData, minWithdrawalNotice: e.target.value})} 
              />
              <p className="text-[10px] text-gray-400 mt-2">This message will be shown if user tries to withdraw less than minimum.</p>
            </div>
          </div>
        </section>

        {/* AI Assistant Configuration */}
        <section className="bg-white dark:bg-gray-800 rounded-[32px] p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center"><Bot /></div>
            <div>
              <h3 className="text-xl font-bold dark:text-white">AI Assistant Settings</h3>
              <p className="text-xs text-gray-400">Configure the Gemini AI helper for users.</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className={labelClasses}>AI Provider</label>
              <select 
                className={inputClasses} 
                value={formData.aiProvider || 'GEMINI'} 
                onChange={e => setFormData({...formData, aiProvider: e.target.value as any})}
              >
                <option value="GEMINI">Google Gemini (Recommended)</option>
                <option value="OPENROUTER">OpenRouter / OpenAI Compatible</option>
              </select>
            </div>

            <div>
              <label className={labelClasses}>API Key ({formData.aiProvider || 'GEMINI'})</label>
              <div className="relative">
                <Key className="absolute left-4 top-4 text-gray-400" size={20} />
                <input 
                  type="password"
                  className={`${inputClasses} pl-12 font-mono text-xs`} 
                  placeholder="Paste your Gemini API Key here..."
                  value={formData.geminiApiKey || ''} 
                  onChange={e => setFormData({...formData, geminiApiKey: e.target.value})} 
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-2">
                Get your key from <a href="https://aistudio.google.com/" target="_blank" className="text-blue-500 underline">Google AI Studio</a>.
              </p>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
              <h4 className="font-bold text-blue-800 dark:text-blue-200 text-sm mb-2">AI Knowledge Base (Read-Only)</h4>
              <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                The AI is automatically trained on public app info: 
                <span className="font-bold"> Daily Missions, Referral Rewards ({formData.referralRewardReferrer} pts), Withdrawals (Min {formData.minWithdrawal} BDT), and Conversion Rates.</span>
                <br/><br/>
                <span className="font-bold text-red-500">Note:</span> The AI does NOT have access to admin secrets, user passwords, or private database fields. It only knows what users need to know.
              </p>
            </div>
          </div>
        </section>

        {/* External Content Configuration */}
        <section className="bg-white dark:bg-gray-800 rounded-[32px] p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center"><Send /></div>
            <h3 className="text-xl font-bold dark:text-white">External Content</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className={labelClasses}>Tutorial Video Link (YouTube/Drive)</label>
              <input 
                className={inputClasses} 
                placeholder="https://youtube.com/watch?v=..."
                value={formData.tutorialVideoLink || ''} 
                onChange={e => setFormData({...formData, tutorialVideoLink: e.target.value})} 
              />
              <p className="text-[10px] text-gray-400 mt-2">This video will be shown to users as a tutorial inside the app.</p>
            </div>
            <div>
              <label className={labelClasses}>More Apps / Update Link</label>
              <input 
                className={inputClasses} 
                placeholder="https://play.google.com/store/apps/details?id=..."
                value={formData.moreAppsLink || ''} 
                onChange={e => setFormData({...formData, moreAppsLink: e.target.value})} 
              />
              <p className="text-[10px] text-gray-400 mt-2">Link to download your other apps or update this app.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminSystemConfig;
