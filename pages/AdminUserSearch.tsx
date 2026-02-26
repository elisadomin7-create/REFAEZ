
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Search, User as UserIcon, ShieldCheck, Crown, Ban, CreditCard, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';
import { AccountStatus } from '../types';

const AdminUserSearch: React.FC = () => {
  const { users, manageUser, verifyUser, setAdFreeStatus, deleteUser } = useApp();
  const [uidQuery, setUidQuery] = useState('');
  const [foundUser, setFoundUser] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.uid === uidQuery.trim());
    if (user) {
      setFoundUser(user);
    } else {
      alert("No user found with this UID.");
      setFoundUser(null);
    }
  };

  const updateFoundUserLocally = (id: string) => {
    const updated = users.find(u => u.id === id);
    setFoundUser(updated);
  };

  const handleBalance = (isAdd: boolean) => {
    const amt = prompt(`Enter points to ${isAdd ? 'ADD' : 'DEDUCT'}:`);
    if (!amt) return;
    const change = isAdd ? parseInt(amt) : -parseInt(amt);
    manageUser(foundUser.id, foundUser.status, change);
    setTimeout(() => updateFoundUserLocally(foundUser.id), 100);
  };

  const toggleStatus = () => {
    const newStatus = foundUser.status === AccountStatus.ACTIVE ? AccountStatus.BLOCKED : AccountStatus.ACTIVE;
    manageUser(foundUser.id, newStatus);
    setTimeout(() => updateFoundUserLocally(foundUser.id), 100);
  };

  const inputClasses = "w-full p-4 pl-12 rounded-2xl bg-white dark:bg-gray-800 dark:text-white border-2 border-gray-100 dark:border-gray-700 focus:border-blue-500 outline-none font-bold shadow-sm transition-all";

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-gray-900 dark:text-white">User Controller</h2>
        <p className="text-gray-500 font-medium">Search and modify specific user data by UID.</p>
      </div>

      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-4 top-4 text-gray-400" size={20} />
        <input 
          placeholder="Enter 8-Digit UID (e.g. 10000001)" 
          className={inputClasses}
          value={uidQuery}
          onChange={e => setUidQuery(e.target.value)}
        />
        <button type="submit" className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white px-6 rounded-xl font-black text-sm shadow-lg hover:bg-blue-700 transition-colors">
          Find User
        </button>
      </form>

      {foundUser ? (
        <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-[40px] p-8 border border-gray-100 dark:border-gray-700 shadow-xl flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-[32px] bg-gray-100 dark:bg-gray-700 overflow-hidden shadow-inner">
                <img src={`https://picsum.photos/seed/${foundUser.id}/200/200`} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              {foundUser.isAdFree && <Crown className="absolute -top-4 -right-4 text-yellow-500 drop-shadow-lg" size={48} fill="currentColor" />}
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <h3 className="text-3xl font-black dark:text-white">{foundUser.name}</h3>
                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg text-xs font-black tracking-widest uppercase">UID: {foundUser.uid}</span>
              </div>
              <p className="text-gray-400 font-medium">{foundUser.email} • {foundUser.phone}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${foundUser.status === AccountStatus.ACTIVE ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                   Status: {foundUser.status}
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${foundUser.isVerified ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                   {foundUser.isVerified ? 'Verified Account' : 'Unverified'}
                </div>
              </div>
            </div>

            <div className="text-center md:text-right">
              <p className="text-xs text-gray-400 font-black uppercase mb-1">Total Points</p>
              <h4 className="text-4xl font-black text-blue-600">{foundUser.points.toFixed(0)}</h4>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-[32px] border dark:border-gray-700 shadow-sm space-y-4">
               <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><CreditCard size={14}/> Wallet Control</h5>
               <div className="flex gap-2">
                 <button onClick={() => handleBalance(true)} className="flex-1 py-3 bg-green-50 text-green-700 rounded-xl font-bold text-sm">+ Add</button>
                 <button onClick={() => handleBalance(false)} className="flex-1 py-3 bg-red-50 text-red-700 rounded-xl font-bold text-sm">- Deduct</button>
               </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-[32px] border dark:border-gray-700 shadow-sm space-y-4">
               <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><ShieldCheck size={14}/> Account Badges</h5>
               <div className="flex gap-2">
                 <button onClick={() => { verifyUser(foundUser.id, !foundUser.isVerified); setTimeout(() => updateFoundUserLocally(foundUser.id), 100); }} className={`flex-1 py-3 rounded-xl font-bold text-sm ${foundUser.isVerified ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>Verify</button>
                 <button onClick={() => { setAdFreeStatus(foundUser.id, !foundUser.isAdFree); setTimeout(() => updateFoundUserLocally(foundUser.id), 100); }} className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 ${foundUser.isAdFree ? 'bg-yellow-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}><Crown size={14}/> Premium</button>
               </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-[32px] border dark:border-gray-700 shadow-sm space-y-4">
               <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Ban size={14}/> Restrictions</h5>
               <div className="flex gap-2">
                 <button onClick={toggleStatus} className={`flex-1 py-3 rounded-xl font-bold text-sm ${foundUser.status === AccountStatus.ACTIVE ? 'bg-red-50 text-red-600' : 'bg-green-600 text-white'}`}>
                    {foundUser.status === AccountStatus.ACTIVE ? 'Block' : 'Unblock'}
                 </button>
                 <button onClick={() => { if(confirm('Delete user permanent?')) { deleteUser(foundUser.id); setFoundUser(null); } }} className="p-3 bg-gray-900 text-white rounded-xl"><Trash2 size={18}/></button>
               </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center text-center opacity-30">
          <AlertTriangle size={80} />
          <h3 className="text-2xl font-black mt-4 uppercase tracking-widest">Search a UID</h3>
          <p className="font-medium">Enter a valid UID to start controlling the user account.</p>
        </div>
      )}
    </div>
  );
};

export default AdminUserSearch;
