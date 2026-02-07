
import React, { useState } from 'react';
import { Transaction, TaskStatus } from '../types';
import { History, Search, Filter, ArrowUpRight, ArrowDownLeft, Calendar, Info } from 'lucide-react';

interface HistoryScreenProps {
  transactions: Transaction[];
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ transactions }) => {
  const [filter, setFilter] = useState<'ALL' | 'EARNING' | 'WITHDRAWAL'>('ALL');

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'ALL') return true;
    return tx.type === filter;
  });

  return (
    <div className="p-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 p-2 rounded-xl text-white">
            <History size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">History</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your Activity</p>
          </div>
        </div>
        <button className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm text-slate-400">
          <Search size={20} />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-white p-1 rounded-2xl border border-slate-100 mb-6 custom-shadow">
        {(['ALL', 'EARNING', 'WITHDRAWAL'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
              filter === f ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'
            }`}
          >
            {f === 'EARNING' ? 'Earnings' : f === 'WITHDRAWAL' ? 'Payouts' : 'All'}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((tx) => (
            <div key={tx.id} className="bg-white rounded-[28px] p-5 custom-shadow border border-slate-50 transition-all active:scale-[0.99]">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  tx.type === 'WITHDRAWAL' 
                    ? 'bg-red-50 text-red-600' 
                    : tx.status === TaskStatus.APPROVED 
                      ? 'bg-green-50 text-green-600' 
                      : 'bg-amber-50 text-amber-600'
                }`}>
                  {tx.type === 'WITHDRAWAL' ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-black text-slate-800 text-sm truncate">{tx.taskName}</h4>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      tx.status === TaskStatus.APPROVED ? 'bg-green-100 text-green-700' : 
                      tx.status === TaskStatus.PENDING ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar size={12} />
                      <span className="text-[10px] font-bold uppercase">{tx.date}</span>
                    </div>
                    <p className={`text-sm font-black ${tx.type === 'WITHDRAWAL' ? 'text-red-500' : 'text-slate-900'}`}>
                      {tx.type === 'WITHDRAWAL' ? '-' : '+'}৳{tx.amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
              
              {tx.details && (
                <div className="mt-4 pt-3 border-t border-slate-50 flex gap-2 items-start">
                  <Info size={12} className="text-slate-300 mt-0.5 shrink-0" />
                  <p className="text-[10px] text-slate-500 italic leading-relaxed">
                    {tx.details}
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <History className="text-slate-200" size={32} />
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No activity found</p>
          </div>
        )}
      </div>

      <div className="h-28"></div>
    </div>
  );
};

export default HistoryScreen;
