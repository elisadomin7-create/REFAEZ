
import React from 'react';
import { useApp } from '../store/AppContext';
import { Users, CreditCard, TrendingUp, AlertCircle, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const AdminDashboard: React.FC = () => {
  const { users, withdrawals, settings, transactions } = useApp();

  const totalPoints = users.reduce((acc, u) => acc + u.points, 0);
  const totalWithdrawn = withdrawals.filter(w => w.status === 'APPROVED').reduce((acc, w) => acc + w.amount, 0);
  const pendingRequests = withdrawals.filter(w => w.status === 'PENDING');

  // Mock data for charts
  const trafficData = [
    { name: 'Mon', users: 450 }, { name: 'Tue', users: 520 }, { name: 'Wed', users: 610 },
    { name: 'Thu', users: 580 }, { name: 'Fri', users: 720 }, { name: 'Sat', users: 850 }, { name: 'Sun', users: 790 },
  ];

  const revenueData = [
    { name: 'Week 1', points: 4500 }, { name: 'Week 2', points: 5200 }, { name: 'Week 3', points: 6100 }, { name: 'Week 4', points: 8000 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-gray-900">Admin Command Center</h2>
          <p className="text-gray-500">Real-time stats and platform overview.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-2xl font-bold text-sm shadow-sm">
          <Activity size={18} />
          System Online
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', value: users.length, color: 'bg-blue-50 text-blue-600', icon: <Users /> },
          { label: 'Total Coins', value: totalPoints.toLocaleString(), color: 'bg-yellow-50 text-yellow-600', icon: <TrendingUp /> },
          { label: 'Paid Out (BDT)', value: `${totalWithdrawn.toLocaleString()} ৳`, color: 'bg-green-50 text-green-600', icon: <CheckCircle2 /> },
          { label: 'Pending Payouts', value: pendingRequests.length, color: 'bg-orange-50 text-orange-600', icon: <AlertCircle /> },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
            </div>
            <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-500" />
            Active Traffic (Last 7 Days)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                <Tooltip />
                <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <ShieldCheck size={20} className="text-green-500" />
            Coin Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                <Tooltip />
                <Bar dataKey="points" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-xl font-bold mb-6">Anti-Fraud Alerts</h3>
        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-4">
            <AlertCircle className="text-red-500" />
            <div>
              <p className="font-bold text-red-900">Duplicate Device ID Detected</p>
              <p className="text-sm text-red-700">3 users attempting to login from same hardware (ID: WEB_TEST_002)</p>
            </div>
            <button className="ml-auto bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold">Block All</button>
          </div>
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-4">
            <Activity className="text-amber-500" />
            <div>
              <p className="font-bold text-amber-900">Rapid Task Completion</p>
              <p className="text-sm text-amber-700">User ID u_4523 completed 5 tasks in 10 seconds. Potential bot usage.</p>
            </div>
            <button className="ml-auto bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-bold">Investigate</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
