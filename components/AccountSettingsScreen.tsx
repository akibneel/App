import React, { useState } from 'react';
import { ArrowLeft, Save, User, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';

interface AccountSettingsScreenProps {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
  onBack: () => void;
}

const AccountSettingsScreen: React.FC<AccountSettingsScreenProps> = ({ profile, onSave, onBack }) => {
  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API delay
    setTimeout(() => {
      onSave(formData);
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 animate-in slide-in-from-right-10 duration-500 transition-colors">
      <div className="bg-white dark:bg-slate-900 p-6 flex items-center gap-4 sticky top-0 z-10 border-b border-slate-100 dark:border-slate-800 transition-colors">
        <button onClick={onBack} className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all active:scale-90 text-slate-800 dark:text-slate-100">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Account Settings</h2>
      </div>

      <div className="p-6">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm dark:shadow-none mb-10 border border-slate-50 dark:border-slate-800 transition-colors">
          <div className="flex items-center gap-5 mb-8">
            <div className="w-20 h-20 bg-emerald-500 rounded-[30px] flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-emerald-500/20">
              {formData.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{formData.name}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[4px] mt-2">Certified Member</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-5 py-4 rounded-3xl border border-emerald-100 dark:border-emerald-900/30 transition-colors">
            <ShieldCheck size={20} />
            <span className="text-[11px] font-black uppercase tracking-[3px]">Trust Level: High Verification</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[4px] ml-1.5">Official Display Name</label>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 group-focus-within:text-emerald-600 transition-colors">
                <User size={20} />
              </div>
              <input 
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-white dark:bg-slate-900 p-5 pl-14 rounded-3xl border-2 border-slate-100 dark:border-slate-800 focus:border-emerald-500 focus:outline-none transition-all text-slate-900 dark:text-white font-bold"
                required
              />
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-slate-900 dark:bg-emerald-600 py-6 rounded-[35px] text-white font-black text-[14px] shadow-2xl dark:shadow-none active:scale-[0.98] disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:shadow-none transition-all flex items-center justify-center gap-3 uppercase tracking-[4px]"
            >
              {isSubmitting ? (
                <span className="animate-pulse">Processing...</span>
              ) : (
                <>
                  Commit Changes <Save size={20} />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-12 text-center">
          <p className="text-slate-300 dark:text-slate-700 text-[10px] font-black uppercase tracking-[5px]">Encrypted Settings Module</p>
        </div>
      </div>
      
      <div className="h-32"></div>
    </div>
  );
};

export default AccountSettingsScreen;