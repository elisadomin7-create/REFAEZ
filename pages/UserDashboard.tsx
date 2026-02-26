
import React from 'react';
import { useApp } from '../store/AppContext';
import { TrendingUp, Award, Share2, Wallet, User as UserIcon, Crown, Copy, ExternalLink } from 'lucide-react';

const UserDashboard: React.FC = () => {
  const { currentUser, settings } = useApp();

  if (!currentUser) return null;

  const referralLink = `${window.location.origin}/#ref=${currentUser.referralCode}`;

  const copyReferralLink = () => {
    if (!currentUser.isVerified) {
      alert("Verify your account to share your referral link!");
      return;
    }
    navigator.clipboard.writeText(referralLink);
    alert("Referral Link Copied!");
  };

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div 
        className="rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl group"
        style={{ backgroundColor: settings.themeColor }}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="px-4 py-1.5 bg-white/20 backdrop-blur-xl rounded-full text-[10px] font-mono font-black tracking-widest border border-white/20 uppercase">
                ID: {currentUser.uid}
              </span>
              {currentUser.isAdFree && (
                <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-4 py-1.5 rounded-full text-[10px] font-black uppercase shadow-lg animate-pulse">
                  <Crown size={12} fill="currentColor" /> {settings.premiumPackageName}
                </div>
              )}
            </div>
            <div>
              <p className="text-white/60 font-bold mb-1 uppercase tracking-[0.2em] text-[10px]">Total Balance</p>
              <div className="flex items-baseline gap-3">
                <h2 className="text-6xl font-black tracking-tighter">{currentUser.points.toLocaleString()}</h2>
                <span className="text-xl font-bold opacity-60">{settings.coinName}</span>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10">
              <p className="text-white/90 text-sm font-bold">
                ≈ {(currentUser.points * settings.conversionRate).toFixed(2)} ৳
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-xl rounded-[32px] p-6 flex flex-col items-center justify-center border border-white/10 hover:bg-white/20 transition-all cursor-default">
              <div className="w-12 h-12 rounded-2xl bg-yellow-400/20 flex items-center justify-center text-2xl mb-2">🤝</div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Referrals</p>
              <p className="text-2xl font-black">{currentUser.referralCount}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-[32px] p-6 flex flex-col items-center justify-center border border-white/10 hover:bg-white/20 transition-all cursor-default">
              <div className="w-12 h-12 rounded-2xl bg-emerald-400/20 flex items-center justify-center text-2xl mb-2">🏆</div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Rank</p>
              <p className="text-2xl font-black">Elite</p>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-[100px] group-hover:bg-white/20 transition-all duration-700"></div>
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-black/10 rounded-full blur-[60px]"></div>
      </div>

      {/* Unique Referral Link Quick Action */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-[32px] border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
            <Share2 size={24} />
          </div>
          <div>
            <h4 className="font-black dark:text-white">Quick Invite</h4>
            <p className="text-xs text-gray-400">Share your link to earn {settings.referralRewardReferrer} {settings.coinName}</p>
          </div>
        </div>
        <div className="flex w-full md:w-auto gap-2">
          <div className="flex-1 md:w-64 bg-gray-50 dark:bg-gray-900 px-4 py-3 rounded-xl border dark:border-gray-700 font-mono text-[10px] text-gray-500 truncate flex items-center">
            {referralLink}
          </div>
          <button 
            onClick={copyReferralLink}
            className="p-3 bg-blue-600 text-white rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            <Copy size={18} />
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Earning Today', value: `0 ${settings.coinName}`, icon: <TrendingUp className="text-blue-500" /> },
          { label: 'Total Earnings', value: `${currentUser.totalEarned.toFixed(0)} ${settings.coinName}`, icon: <Award className="text-yellow-500" /> },
          { label: 'Your Code', value: currentUser.referralCode, icon: <Share2 className="text-purple-500" /> },
          { label: 'Min Withdraw', value: `${settings.minWithdrawal} ৳`, icon: <Wallet className="text-green-500" /> },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
            <div className="bg-gray-50 dark:bg-gray-700 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
              {stat.icon}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Info Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white">
            <Award className="text-blue-500" /> Earning Rules
          </h3>
          <ul className="space-y-3">
            {[
              'Complete daily missions regularly.',
              'Invite verified friends to get bonuses.',
              'Maintain your streak for weekly prizes.',
              'One account per device is strictly allowed.'
            ].map((rule, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                {rule}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white">
             <ExternalLink className="text-green-500" /> Announcements
          </h3>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-900/30">
            <p className="text-sm font-bold text-blue-900 dark:text-blue-200">New missions added! 🚀</p>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">Check the mission center for high-reward tasks available for the next 24 hours.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
