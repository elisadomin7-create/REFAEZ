
import React from 'react';
import { useApp } from '../store/AppContext';
import { Copy, Share2, Users, Gift, Lock } from 'lucide-react';

const Referral: React.FC = () => {
  const { currentUser, settings, users } = useApp();

  if (!currentUser) return null;

  const isVerified = currentUser.isVerified;
  const referralLink = `${window.location.origin}/#ref=${currentUser.referralCode}`;
  const referrals = users.filter(u => u.referredBy === currentUser.referralCode);

  const copyToClipboard = () => {
    if (!isVerified) {
      alert("Verify your account to unlock referrals!");
      return;
    }
    navigator.clipboard.writeText(currentUser.referralCode);
    alert("Referral Code Copied!");
  };

  const handleShare = async () => {
    if (!isVerified) {
      alert("Verify your account to unlock referrals!");
      return;
    }
    const shareData = {
      title: settings.appName,
      text: `Join ${settings.appName} and earn ${settings.coinName}! Use my referral code: ${currentUser.referralCode}`,
      url: referralLink,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        navigator.clipboard.writeText(referralLink);
        alert("Referral link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className={`rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl transition-all ${isVerified ? 'bg-gradient-to-br from-blue-600 to-indigo-700' : 'bg-gray-400'}`}>
        <div className="relative z-10 max-w-xl">
          <h2 className="text-4xl font-black mb-4 leading-tight">Refer Friends,<br/>Earn More!</h2>
          <p className="text-blue-100 text-lg opacity-90 mb-8">
            Earn <span className="font-bold text-white">{settings.referralRewardReferrer} {settings.coinName}</span> for every verified referral. 
            They get <span className="font-bold text-white">{settings.referralRewardUser} {settings.coinName}</span> bonus!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 flex items-center justify-between relative">
              {!isVerified && (
                <div className="absolute inset-0 bg-gray-800/80 backdrop-blur-sm rounded-2xl flex items-center justify-center gap-2">
                  <Lock size={18} /> <span>Verify to Unlock</span>
                </div>
              )}
              <span className="font-mono text-xl font-bold tracking-widest">{isVerified ? currentUser.referralCode : '******'}</span>
              <button onClick={copyToClipboard} className="text-blue-200 hover:text-white transition-colors">
                <Copy size={20} />
              </button>
            </div>
            <button 
              onClick={handleShare}
              className={`font-bold px-8 py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl ${isVerified ? 'bg-white text-blue-700 hover:bg-blue-50' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              <Share2 size={20} />
              Share Link
            </button>
          </div>
        </div>
        
        <div className="absolute top-10 right-10 opacity-20 hidden lg:block">
          <Users size={180} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 text-2xl">🎁</div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Referral Earnings</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{referrals.filter(u => u.isVerified).length * settings.referralRewardReferrer} {settings.coinName}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 text-2xl">👥</div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Verified Referrals</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{referrals.filter(u => u.isVerified).length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b dark:border-gray-700">
          <h3 className="text-xl font-bold dark:text-white">Referral History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <tbody className="divide-y dark:divide-gray-700">
              {referrals.length > 0 ? referrals.map((ref, idx) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900 dark:text-white">{ref.name}</p>
                    <p className="text-[10px] text-gray-400">{new Date(ref.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${ref.isVerified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {ref.isVerified ? 'Verified' : 'Pending Verification'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-green-600">
                    {ref.isVerified ? `+${settings.referralRewardReferrer}` : '0'} {settings.coinName}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-400 italic">No referrals found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Referral;
