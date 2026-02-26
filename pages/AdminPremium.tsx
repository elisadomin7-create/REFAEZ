
import React from 'react';
import { useApp } from '../store/AppContext';
import { Crown, User as UserIcon, ShieldX, CheckCircle, Search } from 'lucide-react';

const AdminPremium: React.FC = () => {
  const { users, setAdFreeStatus, settings } = useApp();
  const premiumUsers = users.filter(u => u.isAdFree);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
             <Crown className="text-yellow-500" size={32} fill="currentColor" /> {settings.premiumPackageName} Members
          </h2>
          <p className="text-gray-500 font-medium">Manage all users with your custom {settings.premiumPackageName} status.</p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 px-6 py-2 rounded-2xl font-black text-sm border border-yellow-100 dark:border-yellow-900/30 flex items-center gap-2">
          <Crown size={18} fill="currentColor" /> {premiumUsers.length} Active {settings.premiumPackageName}s
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-[32px] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-8 py-4">Member Name</th>
                <th className="px-8 py-4">UID Code</th>
                <th className="px-8 py-4">Current Points</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {premiumUsers.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center text-yellow-600 relative">
                        <UserIcon size={20} />
                        <div className="absolute -top-1 -right-1"><Crown size={12} fill="currentColor" /></div>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{u.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="font-mono font-black text-blue-600 dark:text-blue-400 text-sm tracking-widest bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-lg border border-blue-100 dark:border-blue-900/30 shadow-sm">
                      {u.uid}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <p className="font-black text-gray-900 dark:text-white">{u.points.toFixed(0)} <span className="text-[10px] opacity-40">{settings.coinName}</span></p>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => { if(confirm(`Revoke ${settings.premiumPackageName} status?`)) setAdFreeStatus(u.id, false); }}
                      className="text-red-500 hover:bg-red-50 p-3 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ShieldX size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {premiumUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center opacity-30">
                       <ShieldX size={48} />
                       <p className="mt-4 font-black uppercase tracking-widest text-sm">No {settings.premiumPackageName} Members found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPremium;
