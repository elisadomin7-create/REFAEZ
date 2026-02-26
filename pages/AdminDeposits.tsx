
import React from 'react';
import { useApp } from '../store/AppContext';
import { DepositStatus, VerificationStatus, WithdrawalStatus } from '../types';
import { Check, X, ShieldCheck, CreditCard, Phone, Hash, ArrowUpCircle } from 'lucide-react';

const AdminDeposits: React.FC = () => {
  const { deposits, processDeposit, verificationRequests, processVerification, withdrawals, processWithdrawal } = useApp();

  const pendingDeposits = deposits.filter(d => d.status === DepositStatus.PENDING).reverse();
  const pendingVerifications = verificationRequests.filter(v => v.status === VerificationStatus.PENDING).reverse();
  const pendingWithdrawals = withdrawals.filter(w => w.status === WithdrawalStatus.PENDING).reverse();

  return (
    <div className="space-y-12 pb-20">
      {/* Withdrawal Requests Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
          <ArrowUpCircle className="text-orange-500" size={32} /> Withdrawal Requests
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 text-xs font-bold uppercase">
                <tr>
                  <th className="px-6 py-4">User & Account</th>
                  <th className="px-6 py-4">Method</th>
                  <th className="px-6 py-4">Total / Payout</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {pendingWithdrawals.map(w => (
                  <tr key={w.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <p className="font-bold dark:text-white">{w.userName}</p>
                      <p className="text-xs text-blue-600 font-bold">{w.accountNumber}</p>
                      <p className="text-[10px] text-gray-400">{new Date(w.createdAt).toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                        w.method === 'Bkash' ? 'bg-pink-100 text-pink-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {w.method}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs line-through text-gray-400">{w.amount} ৳</span>
                        <span className="font-black text-green-600 text-lg">{w.payoutAmount.toFixed(2)} ৳</span>
                        <span className="text-[10px] text-red-400 font-bold">Fee: {w.feeAmount.toFixed(2)} ৳</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => processWithdrawal(w.id, WithdrawalStatus.APPROVED)} 
                        className="bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => processWithdrawal(w.id, WithdrawalStatus.REJECTED)} 
                        className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-bold border border-red-100 hover:bg-red-100"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
                {pendingWithdrawals.length === 0 && (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">No pending withdrawals.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Verification Requests Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
          <ShieldCheck className="text-blue-500" size={32} /> Account Verifications
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 text-xs font-bold uppercase">
                <tr>
                  <th className="px-6 py-4">User Details</th>
                  <th className="px-6 py-4">Payment Info</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {pendingVerifications.map(v => (
                  <tr key={v.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <p className="font-bold dark:text-white">{v.userName}</p>
                      <p className="text-[10px] text-gray-400">{new Date(v.timestamp).toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold flex items-center gap-1 text-gray-600 dark:text-gray-300">
                          <Phone size={12} className="text-blue-500" /> {v.paymentNumber}
                        </span>
                        <span className="text-[10px] font-mono flex items-center gap-1 text-gray-500">
                          <Hash size={10} className="text-blue-500" /> TRX: {v.transactionId}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => processVerification(v.id, VerificationStatus.APPROVED)} 
                        className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-blue-700"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => processVerification(v.id, VerificationStatus.REJECTED)} 
                        className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-bold border border-red-100 hover:bg-red-100"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
                {pendingVerifications.length === 0 && (
                  <tr><td colSpan={3} className="px-6 py-12 text-center text-gray-400 italic">No verification requests.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Deposit Requests Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
          <CreditCard className="text-green-500" size={32} /> Balance Deposits
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 text-xs font-bold uppercase">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Source</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {pendingDeposits.map(d => (
                  <tr key={d.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <p className="font-bold dark:text-white">{d.userName}</p>
                      <p className="text-[10px] text-gray-400">TRX: {d.transactionId}</p>
                    </td>
                    <td className="px-6 py-4 text-sm dark:text-gray-300">
                      <p className="font-bold text-gray-700 dark:text-gray-200">{d.method}</p>
                      <p className="text-xs text-gray-400">{d.senderNumber}</p>
                    </td>
                    <td className="px-6 py-4 font-black text-green-600">{d.amount} ৳</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => processDeposit(d.id, DepositStatus.APPROVED)} className="bg-green-100 text-green-600 p-2 rounded-xl">
                        <Check size={18} />
                      </button>
                      <button onClick={() => processDeposit(d.id, DepositStatus.REJECTED)} className="bg-red-100 text-red-600 p-2 rounded-xl">
                        <X size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {pendingDeposits.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">No pending deposits.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDeposits;
