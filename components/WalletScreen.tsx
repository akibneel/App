import React from 'react';
import { Transaction, TaskStatus, AppConfig } from '../types';
import { ArrowDownLeft, ArrowUpRight, History, Wallet, Clock, CreditCard } from 'lucide-react';

interface WalletScreenProps {
  balance: { total: number; available: number; pending: number };
  appConfig: AppConfig;
  transactions: Transaction[];
  onWithdrawClick: () => void;
}

const WalletScreen: React.FC<WalletScreenProps> = ({ balance, appConfig, transactions, onWithdrawClick }) => {
  return (
    <div className="p-6 animate-in slide-in-from-right-10 duration-500">
      <div className="flex items-center gap-3 mb-6 px-1">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-2.5 rounded-2xl text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-100 dark:border-emerald-800">
          <Wallet size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-none">My Wallet</h2>
          <p className="text-[9px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Earnings & Payouts</p>
        </div>
      </div>

      {/* Hero Balance Card */}
      <div className="bg-slate-900 dark:bg-slate-900 rounded-[40px] p-8 text-white mb-8 shadow-2xl relative overflow-hidden border border-transparent dark:border-slate-800">
        {/* Abstract background highlights */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-20 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <p className="text-slate-400 text-[10px] font-medium uppercase tracking-widest mb-1.5 opacity-60">Main Balance (Available)</p>
          <div className="flex items-baseline gap-2 mb-8">
            <span className="text-2xl font-semibold text-emerald-500">৳</span>
            <h1 className="text-5xl font-bold tracking-tighter leading-none">{balance.available.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h1>
          </div>
          
          <div className="w-full">
            <div className="bg-white/5 p-5 rounded-[28px] border border-white/10 backdrop-blur-md flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-400/10 flex items-center justify-center">
                  <Clock size={16} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-[9px] font-medium uppercase tracking-widest">In Review</p>
                  <p className="text-sm font-semibold text-white">৳{balance.pending.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions / Withdrawal */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-5 px-1">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-[11px] uppercase tracking-widest flex items-center gap-2">
            <CreditCard size={15} className="text-emerald-500" /> Withdrawal Gateways
          </h3>
          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full uppercase tracking-tighter">Min ৳{appConfig.minWithdrawal}</span>
        </div>
        
        <div className="grid grid-cols-4 gap-3">
          {appConfig.withdrawalMethods.map((gateway) => (
            <button 
              key={gateway.id}
              onClick={onWithdrawClick}
              className="bg-white dark:bg-slate-900 p-4 rounded-[28px] shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800 hover:border-emerald-500/30 hover:bg-emerald-50/20 dark:hover:bg-emerald-900/10 transition-all group flex flex-col items-center justify-center gap-3 active:scale-95"
            >
              <div className="h-9 w-full flex items-center justify-center overflow-hidden">
                 <img src={gateway.icon} alt={gateway.name} className="h-full object-contain filter transition-all group-hover:scale-110" />
              </div>
              <span className="text-[8px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest group-hover:text-emerald-600 dark:group-hover:text-emerald-400">{gateway.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent History Preview */}
      <div>
        <div className="flex justify-between items-center mb-5 px-1">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-[11px] uppercase tracking-widest flex items-center gap-2">
            <History size={15} className="text-emerald-500" /> Recent Activity
          </h3>
        </div>
        
        <div className="space-y-4">
          {transactions.slice(0, 5).map(tx => (
            <div key={tx.id} className="bg-white dark:bg-slate-900 rounded-[32px] p-5 shadow-sm dark:shadow-none border border-slate-50 dark:border-slate-800 flex items-center gap-4 animate-in fade-in duration-300">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                tx.type === 'WITHDRAWAL' 
                  ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-500 dark:text-rose-400 border-rose-100 dark:border-rose-900/30' 
                  : tx.status === TaskStatus.APPROVED 
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30' 
                    : 'bg-amber-50 dark:bg-amber-900/20 text-amber-500 dark:text-amber-400 border-amber-100 dark:border-amber-900/30'
              }`}>
                {tx.type === 'WITHDRAWAL' ? <ArrowDownLeft size={20} /> : tx.status === TaskStatus.APPROVED ? <ArrowUpRight size={20} /> : <Clock size={20} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 dark:text-slate-200 text-[13px] truncate tracking-tight leading-none">{tx.taskName}</p>
                <div className="flex items-center gap-1.5 mt-2">
                   <p className="text-[9px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-widest">{tx.date}</p>
                   <span className="w-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full"></span>
                   <span className={`text-[8px] font-semibold uppercase tracking-widest ${tx.status === TaskStatus.APPROVED ? 'text-emerald-600 dark:text-emerald-400' : tx.status === TaskStatus.PENDING ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {tx.status}
                  </span>
                </div>
              </div>
              <div className="text-right pl-2">
                <p className={`text-[15px] font-bold tracking-tight ${tx.type === 'WITHDRAWAL' || tx.status === TaskStatus.REJECTED ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-slate-100'}`}>
                  {tx.type === 'WITHDRAWAL' ? '-' : '+'}৳{tx.amount.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
          
          {transactions.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-[40px] border-2 border-dashed border-slate-100 dark:border-slate-800">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <History className="text-slate-200 dark:text-slate-700" size={32} />
              </div>
              <p className="text-slate-400 dark:text-slate-500 font-medium uppercase tracking-widest text-[9px]">Transactions will appear here</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="h-32"></div>
    </div>
  );
};

export default WalletScreen;