
import React, { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { VerificationStatus } from '../types';
import { Mail, Phone, LogOut, CheckCircle, Clock, ExternalLink, ShieldCheck, Ticket, Trash2, AlertTriangle, RefreshCw, Crown, Edit2, Save, X, PlayCircle, Download } from 'lucide-react';

const Profile: React.FC = () => {
  const { currentUser, logout, settings, submitVerification, applyReferralCode, scheduleAccountDeletion, recoverAccount, updateUserProfile } = useApp();
  const [payNum, setPayNum] = useState('');
  const [trxId, setTrxId] = useState('');
  const [refInput, setRefInput] = useState('');
  
  // Edit Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phone: '' });

  // Deletion States
  const [deletionStep, setDeletionStep] = useState(0); // 0 to 3
  const [timeLeftStr, setTimeLeftStr] = useState('');

  useEffect(() => {
    if (currentUser?.deletionScheduledAt) {
      const timer = setInterval(() => {
        const diff = (currentUser.deletionScheduledAt! + 12 * 60 * 60 * 1000) - Date.now();
        if (diff <= 0) {
          setTimeLeftStr('Expired');
          clearInterval(timer);
        } else {
          const h = Math.floor(diff / 3600000);
          const m = Math.floor((diff % 3600000) / 60000);
          setTimeLeftStr(`${h}h ${m}m remaining`);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentUser?.deletionScheduledAt]);

  if (!currentUser) return null;

  const handleEdit = () => {
    setEditForm({ name: currentUser.name, phone: currentUser.phone });
    setIsEditing(true);
  };

  const handleSave = async () => {
    await updateUserProfile(editForm.name, editForm.phone);
    setIsEditing(false);
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payNum || !trxId) return alert("Fill all details.");
    submitVerification(payNum, trxId);
  };

  const handleUseRef = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refInput) return;
    applyReferralCode(refInput);
    setRefInput('');
  };

  const handleDeletionStep = () => {
    if (deletionStep < 3) {
      setDeletionStep(prev => prev + 1);
    } else {
      scheduleAccountDeletion();
      setDeletionStep(0);
      alert("Account deletion scheduled for 12 hours later.");
    }
  };

  const inputClasses = "flex-1 p-4 rounded-2xl bg-white dark:bg-gray-700 border-none font-bold text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm";

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      {/* Deletion Warning Banner */}
      {currentUser.deletionScheduledAt && (
        <div className="bg-red-600 text-white p-6 rounded-[32px] shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <AlertTriangle size={24} />
            <div>
              <p className="font-black uppercase text-sm tracking-widest">Deletion Pending</p>
              <p className="text-xs opacity-80">Scheduled: {timeLeftStr}</p>
            </div>
          </div>
          <button 
            onClick={recoverAccount}
            className="bg-white text-red-600 px-6 py-2 rounded-full font-black text-xs uppercase flex items-center gap-2"
          >
            <RefreshCw size={14} /> Recover Account
          </button>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-[40px] p-12 border border-gray-100 dark:border-gray-700 text-center shadow-xl">
        <div className="relative inline-block mb-6">
          <div className="w-28 h-28 bg-gray-100 dark:bg-gray-700 rounded-[32px] mx-auto overflow-hidden shadow-inner">
            <img src={`https://picsum.photos/seed/${currentUser.id}/200/200`} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          {currentUser.isVerified && (
            <div className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 p-1.5 rounded-full shadow-lg border border-gray-50 dark:border-gray-700">
              <CheckCircle className="text-green-500" size={28} fill="currentColor" />
            </div>
          )}
          {currentUser.isAdFree && (
            <div className="absolute -top-4 -right-4 drop-shadow-lg text-yellow-500">
               <Crown size={48} fill="currentColor" />
            </div>
          )}
        </div>
        
        <div className="mb-4">
          {isEditing ? (
            <div className="space-y-3 max-w-xs mx-auto">
              <input 
                className="w-full p-3 rounded-xl border dark:bg-gray-700 dark:text-white text-center font-bold"
                value={editForm.name}
                onChange={e => setEditForm({...editForm, name: e.target.value})}
                placeholder="Enter Name"
              />
              <input 
                className="w-full p-3 rounded-xl border dark:bg-gray-700 dark:text-white text-center font-mono text-sm"
                value={editForm.phone}
                onChange={e => setEditForm({...editForm, phone: e.target.value})}
                placeholder="Enter Phone"
              />
              <div className="flex gap-2 justify-center">
                <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-bold flex items-center gap-1"><Save size={14}/> Save</button>
                <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs font-bold flex items-center gap-1"><X size={14}/> Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center gap-2 mb-1">
                <h2 className="text-3xl font-black dark:text-white">{currentUser.name}</h2>
                {currentUser.isAdFree && <Crown className="text-yellow-500" size={24} fill="currentColor" />}
                <button onClick={handleEdit} className="text-gray-400 hover:text-blue-600 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"><Edit2 size={16}/></button>
              </div>
              <p className="text-gray-500 font-mono text-sm">{currentUser.email}</p>
            </>
          )}
        </div>

        <p className="text-gray-400 text-xs font-black uppercase tracking-[0.2em] mb-1">{currentUser.role} Level Account</p>
        {currentUser.isAdFree && <p className="text-amber-500 text-[10px] font-black uppercase tracking-widest mb-10">{settings.premiumPackageName} Active</p>}
        {!currentUser.isAdFree && <div className="mb-10"></div>}

        {/* Quick Actions for Tutorial & Update */}
        {(settings.tutorialVideoLink || settings.moreAppsLink) && (
          <div className="grid grid-cols-2 gap-4 mb-10">
            {settings.tutorialVideoLink && (
              <a href={settings.tutorialVideoLink} target="_blank" rel="noreferrer" className="bg-red-50 dark:bg-red-900/20 p-4 rounded-2xl flex items-center gap-3 border border-red-100 dark:border-red-800 hover:scale-105 transition-transform">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center"><PlayCircle size={20}/></div>
                <div className="text-left">
                  <p className="font-bold text-red-700 dark:text-red-300 text-sm">Watch Tutorial</p>
                  <p className="text-[10px] text-red-500">How to use app</p>
                </div>
              </a>
            )}
            {settings.moreAppsLink && (
              <a href={settings.moreAppsLink} target="_blank" rel="noreferrer" className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl flex items-center gap-3 border border-blue-100 dark:border-blue-800 hover:scale-105 transition-transform">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><Download size={20}/></div>
                <div className="text-left">
                  <p className="font-bold text-blue-700 dark:text-blue-300 text-sm">Update App</p>
                  <p className="text-[10px] text-blue-500">Get latest version</p>
                </div>
              </a>
            )}
          </div>
        )}
        
        {!currentUser.hasUsedReferral && !currentUser.isVerified && (
          <div className="mb-10 p-8 bg-blue-50/50 dark:bg-blue-900/10 rounded-[32px] border border-blue-100/50 dark:border-blue-900/30">
            <h3 className="font-bold dark:text-white mb-2 flex items-center justify-center gap-2"><Ticket size={18} className="text-blue-600"/> Referral Code</h3>
            <p className="text-[10px] text-blue-700 dark:text-blue-300 mb-6 uppercase font-black tracking-widest">Unlock bonus after verification</p>
            <form onSubmit={handleUseRef} className="flex gap-2">
              <input placeholder="Enter Code" className={inputClasses} value={refInput} onChange={e => setRefInput(e.target.value)} />
              <button type="submit" className="text-white px-8 rounded-2xl font-black shadow-lg" style={{ backgroundColor: settings.themeColor }}>Apply</button>
            </form>
          </div>
        )}

        <div className="p-8 bg-gray-50 dark:bg-gray-900/50 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-inner">
           <h3 className="font-bold dark:text-white mb-6 flex items-center justify-center gap-2"><ShieldCheck size={20} className="text-blue-500"/> Account Verification</h3>
           {currentUser.isVerified ? (
             <div className="py-4">
               <p className="text-green-600 text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2"><CheckCircle size={16} /> Fully Verified</p>
             </div>
           ) : currentUser.verificationStatus === VerificationStatus.PENDING ? (
             <div className="flex flex-col items-center gap-3 py-6">
                <Clock className="text-amber-500 animate-pulse" size={32} />
                <p className="text-amber-600 text-xs font-black uppercase tracking-widest">Pending Approval</p>
             </div>
           ) : (
             <form onSubmit={handleApply} className="space-y-4">
                <a href={settings.verificationLink} target="_blank" rel="noreferrer" className="w-full py-4 flex items-center justify-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">Instructions <ExternalLink size={14} /></a>
                <div className="space-y-3 pt-4">
                  <input placeholder="Sender Phone" className={inputClasses.replace('flex-1', 'w-full')} value={payNum} onChange={e => setPayNum(e.target.value)} />
                  <input placeholder="Transaction ID" className={inputClasses.replace('flex-1', 'w-full')} value={trxId} onChange={e => setTrxId(e.target.value)} />
                  <button type="submit" className="w-full py-4 bg-gray-900 dark:bg-blue-600 text-white rounded-2xl font-black shadow-xl">Verify Now</button>
                </div>
             </form>
           )}
        </div>
      </div>

      {/* Account Deletion Area */}
      {!currentUser.deletionScheduledAt && (
        <div className="bg-red-50 dark:bg-red-900/10 rounded-[32px] p-8 border border-red-100 dark:border-red-900/30">
          <h3 className="text-red-600 font-black uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
            <Trash2 size={18}/> Danger Zone
          </h3>
          
          <div className="space-y-4">
            {deletionStep === 0 ? (
              <button 
                onClick={() => setDeletionStep(1)} 
                className="w-full p-4 bg-white dark:bg-gray-800 text-red-600 border border-red-200 rounded-2xl font-bold flex items-center justify-center gap-2"
              >
                Delete Account
              </button>
            ) : (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border-2 border-red-200 space-y-4 animate-in zoom-in-95">
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {deletionStep === 1 && `Are you sure, ${currentUser.name}?`}
                  {deletionStep === 2 && `Wait, ${currentUser.name}. Your points will be frozen.`}
                  {deletionStep === 3 && `Final Warning: ${currentUser.name}, you have 12 hours to recover after this.`}
                </p>
                <div className="flex gap-2">
                  <button onClick={handleDeletionStep} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-black text-xs uppercase">
                    {deletionStep < 3 ? 'Confirm Next' : 'Schedule Deletion'}
                  </button>
                  <button onClick={() => setDeletionStep(0)} className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-400 rounded-xl font-black text-xs uppercase">
                    Cancel
                  </button>
                </div>
                <div className="flex justify-center gap-1">
                  {[1, 2, 3].map(s => (
                    <div key={s} className={`h-1 flex-1 rounded-full ${deletionStep >= s ? 'bg-red-500' : 'bg-gray-200'}`} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-[32px] p-8 border border-gray-100 dark:border-gray-700 space-y-6 shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-gray-400">
            <Mail size={20}/> <span className="text-sm font-bold text-gray-900 dark:text-gray-200">{currentUser.email}</span>
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <Phone size={20}/> <span className="text-sm font-bold text-gray-900 dark:text-gray-200">{currentUser.phone}</span>
          </div>
        </div>
        <button onClick={logout} className="w-full flex items-center justify-center gap-3 text-red-600 font-black p-5 bg-red-50 dark:bg-red-900/10 rounded-2xl hover:bg-red-100 transition-all"><LogOut size={20}/> Logout Account</button>
      </div>
    </div>
  );
};

export default Profile;
