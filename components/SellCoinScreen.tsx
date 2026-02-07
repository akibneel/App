
import React, { useState } from 'react';
import { ArrowLeft, Send, BadgeCent, Info, TrendingUp, RefreshCcw } from 'lucide-react';

interface SellCoinScreenProps {
  onSellSubmit: (coinAmount: number, takaAmount: number) => void;
  onBack: () => void;
}

const SellCoinScreen: React.FC<SellCoinScreenProps> = ({ onSellSubmit, onBack }) => {
  const [amount, setAmount] = useState('1000');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const RATE = 0.085; // ৳85 per 1000 coins = 0.085 per coin
  const numAmount = parseInt(amount) || 0;
  const takaValue = numAmount * RATE;
  const canSubmit = numAmount >= 1000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      onSellSubmit(numAmount, takaValue);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-full bg-slate-50 animate-in slide-in-from-right-10 duration-500">
      <div className="bg-white p-6 flex items-center gap-4 sticky top-0 z-10 border-b border-slate-100">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-slate-800" />
        </button>
        <h2 className="text-xl font-bold text-slate-800">Sell Coins</h2>
      </div>

      <div className="p-6">
        {/* Market Rate Card */}
        <div className="bg-amber-500 p-6 rounded-[32px] text-white mb-8 shadow-xl shadow-amber-100 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={14} />
              <p className="text-amber-100 text-[10px] font-black uppercase tracking-widest">Live Market Rate</p>
            </div>
            <h3 className="text-3xl font-black">৳85.00 <span className="text-sm font-medium opacity-80">/ 1,000 Coins</span></h3>
          </div>
          <div className="absolute top-0 right-0 p-4 text-white/10">
            <BadgeCent size={100} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount Input */}
          <div>
            <label className="block text-slate-800 font-bold mb-2 text-sm ml-1 uppercase tracking-wider">Amount of Coins to Sell</label>
            <div className="relative">
              <input 
                type="number"
                min="1000"
                step="100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-white p-5 rounded-3xl border-2 border-slate-100 focus:border-amber-500 focus:outline-none transition-all custom-shadow text-black font-black text-2xl pl-16"
                required
              />
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-500">
                <BadgeCent size={28} />
              </div>
            </div>
            <div className="flex justify-between mt-2 px-1">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Minimum: 1,000 Coins</p>
            </div>
          </div>

          {/* Conversion Result */}
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 border-dashed flex flex-col items-center justify-center gap-2">
            <div className="bg-slate-50 p-2 rounded-full text-slate-400">
              <RefreshCcw size={20} className={isSubmitting ? 'animate-spin' : ''} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">You will receive</p>
            <h4 className="text-4xl font-black text-slate-900 tracking-tight">৳{takaValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              disabled={isSubmitting || !canSubmit}
              className="w-full bg-amber-500 py-6 rounded-[32px] text-white font-black text-lg shadow-xl shadow-amber-100 active:scale-[0.98] disabled:bg-slate-200 disabled:shadow-none transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
            >
              {isSubmitting ? (
                <span className="animate-pulse">Exchanging...</span>
              ) : (
                <>
                  Confirm Sale <Send size={20} />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 p-6 bg-slate-100 rounded-[32px] flex gap-4">
          <Info className="text-slate-400 shrink-0" size={24} />
          <div>
            <p className="text-slate-900 font-black text-xs uppercase mb-1 tracking-wider">Instant Exchange</p>
            <p className="text-slate-500 text-[11px] leading-relaxed font-medium">
              Coin sales are processed instantly. The Taka amount will be added to your available balance immediately after confirmation.
            </p>
          </div>
        </div>
      </div>
      
      <div className="h-28"></div>
    </div>
  );
};

export default SellCoinScreen;
