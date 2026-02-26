
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { WithdrawalStatus, DepositStatus } from '../types';
import { CheckCircle2, XCircle, AlertCircle, Copy, Wallet as WalletIcon, Smartphone, Percent } from 'lucide-react';

const Wallet: React.FC = () => {
  const { currentUser, settings, withdrawals, deposits, requestWithdrawal, submitDeposit } = useApp();
  const [wAmount, setWAmount] = useState('');
  const [wMethod, setWMethod] = useState<'Bkash' | 'Nagad'>('Bkash');
  const [wAccount, setWAccount] = useState('');
  const [wError, setWError] = useState('');

  const [dAmount, setDAmount] = useState('');
  const [dMethod, setDMethod] = useState<'Bkash' | 'Nagad'>('Bkash');
  const [dTrx, setDTrx] = useState('');
  const [dSender, setDSender] = useState('');

  if (!currentUser) return null;

  const userWithdrawals = withdrawals.filter(w => w.userId === currentUser.id).reverse();
  const userDeposits = deposits.filter(d => d.userId === currentUser.id).reverse();
  const bdtBalance = currentUser.points * settings.conversionRate;

  const copyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    alert("Number copied!");
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setWError('');
    
    if (!currentUser.isVerified) {
      alert("Verify please to withdraw!");
      return;
    }
    
    const amt = parseFloat(wAmount);
    if (isNaN(amt) || amt <= 0) {
      setWError("Please enter a valid amount.");
      return;
    }
    
    if (amt < settings.minWithdrawal) {
      setWError(settings.minWithdrawalNotice || `Minimum withdrawal is ${settings.minWithdrawal} BDT.`);
      return;
    }

    if (bdtBalance < amt) {
      setWError("apnar accounte withdrol korar moto amounth nay");
      return;
    }

    requestWithdrawal(amt, wMethod, wAccount);
    setWAmount(''); setWAccount('');
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(dAmount);
    if (amt <= 0 || !dTrx || !dSender) return alert("Fill all details!");
    submitDeposit(amt, dMethod, dSender, dTrx);
    setDAmount(''); setDTrx(''); setDSender('');
    alert("Deposit request submitted!");
  };

  const currentWAmount = parseFloat(wAmount) || 0;
  const currentFee = (currentWAmount * settings.withdrawalFeePercent) / 100;
  const currentPayout = currentWAmount - currentFee;

  return (
    <div className="space-y-8 pb-24">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold dark:text-white">Balance</h3>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${currentUser.isVerified ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {currentUser.isVerified ? <CheckCircle2 /> : <XCircle />}
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Points</p>
            <p className="text-3xl font-black text-gray-900 dark:text-white">{currentUser.points.toFixed(0)} {settings.coinName}</p>
            <p className="text-4xl font-black text-green-600 mt-2">{bdtBalance.toFixed(2)} ৳</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Add Points</h3>
          <div className="grid grid-cols-2 gap-2 mb-6">
            <button onClick={() => setDMethod('Bkash')} className={`p-4 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${dMethod === 'Bkash' ? 'border-pink-500 bg-pink-50 text-pink-700' : 'border-gray-100 dark:border-gray-700'}`}>
              <Smartphone size={24}/> <span className="font-bold">Bkash</span>
            </button>
            <button onClick={() => setDMethod('Nagad')} className={`p-4 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${dMethod === 'Nagad' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-100 dark:border-gray-700'}`}>
              <Smartphone size={24}/> <span className="font-bold">Nagad</span>
            </button>
          </div>

          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-between border border-gray-100 dark:border-gray-800">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Send Money To ({dMethod})</p>
              <p className="text-lg font-black dark:text-white tracking-wider">{dMethod === 'Bkash' ? settings.bkashNumber : settings.nagadNumber}</p>
            </div>
            <button onClick={() => copyNumber(dMethod === 'Bkash' ? settings.bkashNumber : settings.nagadNumber)} className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md">
              <Copy size={18} />
            </button>
          </div>

          <form onSubmit={handleDeposit} className="space-y-3">
            <input placeholder="Sender Number" className="w-full p-3 rounded-xl dark:bg-gray-700 dark:text-white border dark:border-gray-600" value={dSender} onChange={e => setDSender(e.target.value)} />
            <input placeholder="Transaction ID (TRX)" className="w-full p-3 rounded-xl dark:bg-gray-700 dark:text-white border dark:border-gray-600" value={dTrx} onChange={e => setDTrx(e.target.value)} />
            <input type="number" placeholder="Amount (BDT)" className="w-full p-3 rounded-xl dark:bg-gray-700 dark:text-white border dark:border-gray-600" value={dAmount} onChange={e => setDAmount(e.target.value)} />
            <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200">Submit Deposit</button>
          </form>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
        <h3 className="text-xl font-bold dark:text-white mb-6">Withdraw Funds</h3>
        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl flex flex-col gap-2 border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-tight">
               <span>Minimum Withdrawal:</span>
               <span className="text-gray-900 dark:text-white">{settings.minWithdrawal} BDT</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-tight">
               <span>Service Fee:</span>
               <span className="text-red-500">{settings.withdrawalFeePercent}%</span>
            </div>
        </div>

        <form onSubmit={handleWithdraw} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setWMethod('Bkash')} className={`p-2 rounded-xl font-bold border-2 ${wMethod === 'Bkash' ? 'border-pink-500 bg-pink-50' : 'border-gray-100 dark:border-gray-700'}`}>Bkash</button>
                <button type="button" onClick={() => setWMethod('Nagad')} className={`p-2 rounded-xl font-bold border-2 ${wMethod === 'Nagad' ? 'border-orange-500 bg-orange-50' : 'border-gray-100 dark:border-gray-700'}`}>Nagad</button>
              </div>
              <input placeholder="Wallet Number" className="w-full p-3 rounded-xl dark:bg-gray-700 dark:text-white border dark:border-gray-600" value={wAccount} onChange={e => setWAccount(e.target.value)} />
            </div>
            <div className="space-y-3">
              <input type="number" placeholder="Amount (BDT)" className="w-full p-3 rounded-xl dark:bg-gray-700 dark:text-white border dark:border-gray-600" value={wAmount} onChange={e => setWAmount(e.target.value)} />
              {currentWAmount > 0 && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between text-gray-500"><span>Fee ({settings.withdrawalFeePercent}%):</span> <span className="text-red-500">-{currentFee.toFixed(2)} ৳</span></div>
                  <div className="flex justify-between font-bold text-blue-700 dark:text-blue-400"><span>Final Payout:</span> <span>{currentPayout.toFixed(2)} ৳</span></div>
                </div>
              )}
            </div>
          </div>
          
          {wError && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-xl flex items-center gap-2 animate-in fade-in zoom-in duration-200">
               <AlertCircle size={16} /> {wError}
            </div>
          )}

          <button type="submit" className={`w-full py-4 rounded-2xl font-bold shadow-lg transition-all ${currentUser.isVerified ? 'bg-gray-900 text-white hover:bg-black active:scale-[0.98]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
            {currentUser.isVerified ? 'Withdraw Funds Now' : 'Verification Required'}
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <h3 className="text-xl font-bold mb-4 dark:text-white">Withdrawal History</h3>
        <div className="space-y-4">
          {userWithdrawals.length > 0 ? userWithdrawals.map(w => (
            <div key={w.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
              <div>
                <p className="font-bold dark:text-white">{w.amount} BDT ({w.method})</p>
                <p className="text-[10px] text-gray-400">Payout: {w.payoutAmount.toFixed(2)} ৳ • {new Date(w.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                w.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                w.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
              }`}>{w.status}</span>
            </div>
          )) : <p className="text-center text-gray-400 py-8 italic text-sm">No withdrawals yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default Wallet;
