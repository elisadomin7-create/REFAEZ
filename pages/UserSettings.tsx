
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Moon, Sun, Languages, Headset, ShieldCheck, Crown, ExternalLink, AlertTriangle } from 'lucide-react';

const UserSettings: React.FC = () => {
  const { settings, updateSettings, buyAdFree, currentUser } = useApp();
  const [confirmStep, setConfirmStep] = useState(0); // 0: None, 1: First, 2: Second

  const toggleTheme = () => {
    updateSettings({ ...settings, theme: settings.theme === 'LIGHT' ? 'DARK' : 'LIGHT' });
  };

  const toggleLanguage = () => {
    updateSettings({ ...settings, language: settings.language === 'EN' ? 'BN' : 'EN' });
  };

  const handlePurchase = () => {
    buyAdFree();
    setConfirmStep(0);
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black dark:text-white">Settings</h2>
        <p className="text-gray-500">Personalize your experience</p>
      </div>

      {/* Ad-Free Premium Card */}
      {!currentUser.isAdFree && (
        <div className="bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <Crown size={24} fill="currentColor" />
                <h3 className="text-2xl font-black uppercase tracking-wider">{settings.premiumPackageName}</h3>
              </div>
              <p className="opacity-90 max-w-xs">Remove all external ads and earn more efficiently. One-time purchase.</p>
            </div>
            <div className="text-center">
              <p className="text-sm opacity-80 mb-1">Price</p>
              <p className="text-3xl font-black mb-4">{settings.adFreeSubscriptionPrice} ৳</p>
              <button 
                onClick={() => setConfirmStep(1)}
                className="bg-white text-orange-600 px-8 py-3 rounded-2xl font-black shadow-lg hover:scale-105 transition-transform"
              >
                Buy Now
              </button>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-20 transform rotate-12">
            <ShieldCheck size={180} />
          </div>
        </div>
      )}

      {/* 2-Step Confirmation Modal */}
      {confirmStep > 0 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-[32px] p-8 max-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-black text-center dark:text-white mb-2">
              {confirmStep === 1 ? 'Confirm Purchase?' : 'Final Confirmation'}
            </h3>
            <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed">
              {confirmStep === 1 
                ? `You are about to spend ${settings.adFreeSubscriptionPrice} BDT worth of ${settings.coinName} for ${settings.premiumPackageName} access.` 
                : 'This action cannot be undone. Are you absolutely sure you want to proceed?'}
            </p>
            <div className="space-y-3">
              <button 
                onClick={() => confirmStep === 1 ? setConfirmStep(2) : handlePurchase()}
                className="w-full py-4 bg-orange-600 text-white rounded-2xl font-black shadow-lg shadow-orange-200"
              >
                {confirmStep === 1 ? 'Yes, Continue' : 'Yes, Buy Now!'}
              </button>
              <button 
                onClick={() => setConfirmStep(0)}
                className="w-full py-4 text-gray-400 font-bold hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {currentUser.isAdFree && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-6 rounded-3xl flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-2xl flex items-center justify-center text-green-600">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 className="font-bold dark:text-white">{settings.premiumPackageName} Active</h4>
            <p className="text-sm text-green-600">You are a Pro Subscriber. Enjoy the smooth experience!</p>
          </div>
        </div>
      )}

      {/* Toggles */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm divide-y dark:divide-gray-700">
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-500">
              {settings.theme === 'DARK' ? <Moon size={20}/> : <Sun size={20}/>}
            </div>
            <div>
              <p className="font-bold dark:text-white">Appearance</p>
              <p className="text-xs text-gray-500">Toggle Dark or Light mode</p>
            </div>
          </div>
          <button 
            onClick={toggleTheme}
            className={`w-14 h-8 rounded-full relative transition-colors ${settings.theme === 'DARK' ? 'bg-blue-600' : 'bg-gray-200'}`}
          >
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${settings.theme === 'DARK' ? 'left-7' : 'left-1'}`}></div>
          </button>
        </div>

        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-500">
              <Languages size={20}/>
            </div>
            <div>
              <p className="font-bold dark:text-white">Language</p>
              <p className="text-xs text-gray-500">Switch between English & Bengali</p>
            </div>
          </div>
          <button 
            onClick={toggleLanguage}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-xl font-bold dark:text-white border dark:border-gray-600"
          >
            {settings.language === 'EN' ? 'English' : 'বাংলা'}
          </button>
        </div>

        <a href="/help" className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-500">
              <Headset size={20}/>
            </div>
            <div>
              <p className="font-bold dark:text-white">Helpline</p>
              <p className="text-xs text-gray-500">Need help? Talk to us.</p>
            </div>
          </div>
          <ExternalLink size={18} className="text-gray-400" />
        </a>
      </div>
    </div>
  );
};

export default UserSettings;
