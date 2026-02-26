
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { AccountStatus } from '../types';
import { ShieldCheck, ShieldAlert, Ban, CheckCircle, ShieldOff, Plus, Minus, User as UserIcon, Crown, Search, Zap, Trash2, X, Clock } from 'lucide-react';

const AdminUsers: React.FC = () => {
  const { users, manageUser, verifyUser, setAdFreeStatus, deleteUser } = useApp();
  const [balanceAdjustments, setBalanceAdjustments] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  
  // Ban Modal State
  const [banModalUser, setBanModalUser] = useState<string | null>(null);
  const [banReason, setBanReason] = useState('');
  const [banDays, setBanDays] = useState('7');
  const [banStatus, setBanStatus] = useState<AccountStatus>(AccountStatus.BLOCKED);

  const handleAdjustBalance = (userId: string, isAdd: boolean) => {
    const val = parseInt(balanceAdjustments[userId] || '0');
    if (isNaN(val) || val <= 0) return;
    const change = isAdd ? val : -val;
    manageUser(userId, users.find(u => u.id === userId)?.status || AccountStatus.ACTIVE, change);
    setBalanceAdjustments(prev => ({ ...prev, [userId]: '' }));
    alert(`Balance updated!`);
  };

  const handleExecuteBan = () => {
    if (!banModalUser) return;
    manageUser(banModalUser, banStatus, 0, banReason, parseInt(banDays));
    setBanModalUser(null);
    setBanReason('');
    alert("User account updated with restrictions.");
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to PERMANENTLY DELETE ${name}? This cannot be undone.`)) {
      deleteUser(id);
      alert("User deleted successfully.");
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.uid.includes(searchQuery)
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-3xl font-black text-gray-900 dark:text-white">User Management</h2>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-xl text-sm font-bold">
           <UserIcon size={16} /> {users.length} Total Users
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Search size={18} className="text-gray-400" /></div>
        <input type="text" placeholder="Search by Name, Email, or 8-Digit UID..." className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm outline-none dark:text-white" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 text-xs font-bold uppercase">
              <tr>
                <th className="px-6 py-4">User Info</th>
                <th className="px-6 py-4">UID Code</th>
                <th className="px-6 py-4">Coins</th>
                <th className="px-6 py-4">Badges</th>
                <th className="px-6 py-4 text-right">Restrict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                         <span className="font-bold text-gray-900 dark:text-white">{u.name}</span>
                         {u.isVerified && <CheckCircle size={14} className="text-blue-500" fill="currentColor" />}
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">{u.email}</span>
                      {u.banUntil && u.banUntil > Date.now() && (
                        <span className="text-[10px] text-red-500 font-bold italic flex items-center gap-1"><Clock size={10}/> Resticted Until: {new Date(u.banUntil).toLocaleDateString()}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {/* Improved UID Visibility */}
                    <span className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-black font-mono tracking-widest border border-blue-100 dark:border-blue-800 shadow-sm">
                      {u.uid}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <span className="font-mono text-blue-600 font-bold">{u.points.toFixed(0)}</span>
                       <input type="number" className="w-12 p-1 text-xs border rounded" placeholder="Qty" value={balanceAdjustments[u.id] || ''} onChange={e => setBalanceAdjustments(prev => ({ ...prev, [u.id]: e.target.value }))} />
                       <button onClick={() => handleAdjustBalance(u.id, true)} className="p-1 bg-green-50 text-green-600 rounded hover:bg-green-100" title="Add Points"><Plus size={12} /></button>
                       <button onClick={() => handleAdjustBalance(u.id, false)} className="p-1 bg-red-50 text-red-600 rounded hover:bg-red-100" title="Deduct Points"><Minus size={12} /></button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      <button onClick={() => verifyUser(u.id, !u.isVerified)} className={`p-1 rounded ${u.isVerified ? 'text-blue-600 bg-blue-50' : 'text-gray-400 bg-gray-50'}`}><CheckCircle size={16}/></button>
                      <button onClick={() => setAdFreeStatus(u.id, !u.isAdFree)} className={`p-1 rounded ${u.isAdFree ? 'text-amber-600 bg-amber-50' : 'text-gray-400 bg-gray-50'}`}><Crown size={16}/></button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setBanModalUser(u.id)} className={`p-2 rounded-xl ${u.status !== AccountStatus.ACTIVE ? 'text-red-600 bg-red-50' : 'text-gray-400 hover:bg-gray-50'}`} title="Restrict">
                        <ShieldAlert size={18} />
                      </button>
                      <button onClick={() => handleDeleteUser(u.id, u.name)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl" title="Delete Permanent">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Advanced Restriction Modal */}
      {banModalUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-[32px] p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black dark:text-white">Restrict Account</h3>
              <button onClick={() => setBanModalUser(null)}><X /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Restriction Type</label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {[AccountStatus.ACTIVE, AccountStatus.BLOCKED, AccountStatus.BANNED].map(s => (
                    <button key={s} onClick={() => setBanStatus(s)} className={`py-2 rounded-xl text-xs font-bold border-2 ${banStatus === s ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 dark:border-gray-700 dark:text-white'}`}>{s}</button>
                  ))}
                </div>
              </div>
              {banStatus !== AccountStatus.ACTIVE && (
                <>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase">Reason for Ban/Block</label>
                    <input className="w-full mt-2 p-3 rounded-xl dark:bg-gray-700 dark:text-white border" placeholder="e.g. Fake Referral, VPN usage" value={banReason} onChange={e => setBanReason(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase">Duration (Days)</label>
                    <input type="number" className="w-full mt-2 p-3 rounded-xl dark:bg-gray-700 dark:text-white border" placeholder="30" value={banDays} onChange={e => setBanDays(e.target.value)} />
                    <p className="text-[10px] text-gray-400 mt-1">If "BANNED" permanently, set days to 0.</p>
                  </div>
                </>
              )}
              <button onClick={handleExecuteBan} className="w-full py-4 bg-red-600 text-white rounded-2xl font-black shadow-lg">Apply Restriction</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
