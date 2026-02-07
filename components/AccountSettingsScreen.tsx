
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
    <div className="min-h-full bg-slate-50 animate-in slide-in-from-right-10 duration-500">
      <div className="bg-white p-6 flex items-center gap-4 sticky top-0 z-10 border-b border-slate-100">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-slate-800" />
        </button>
        <h2 className="text-xl font-black text-slate-800 tracking-tight">Account Settings</h2>
      </div>

      <div className="p-6">
        <div className="bg-white p-6 rounded-[32px] custom-shadow mb-8 border border-slate-50">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
              {formData.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800">{formData.name}</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Official Member</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-3 rounded-2xl border border-emerald-100 mb-2">
            <ShieldCheck size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Account Status: Verified</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">Full Legal Name</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <User size={18} />
              </div>
              <input 
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-white p-4 pl-12 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 focus:outline-none transition-all custom-shadow text-black font-bold"
                required
              />
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 py-6 rounded-[32px] text-white font-black text-[13px] shadow-2xl active:scale-[0.98] disabled:bg-slate-200 disabled:shadow-none transition-all flex items-center justify-center gap-3 uppercase tracking-[3px]"
            >
              {isSubmitting ? (
                <span className="animate-pulse">Updating...</span>
              ) : (
                <>
                  Save Changes <Save size={18} />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Secure Settings v2.0</p>
        </div>
      </div>
      
      <div className="h-32"></div>
    </div>
  );
};

export default AccountSettingsScreen;
