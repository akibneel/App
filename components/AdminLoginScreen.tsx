import React, { useState } from 'react';
import { ShieldAlert, Lock, User, ArrowRight, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import { AdminCredentials } from '../types';

interface AdminLoginScreenProps {
  credentials: AdminCredentials;
  onLoginSuccess: () => void;
  onBack: () => void;
}

const AdminLoginScreen: React.FC<AdminLoginScreenProps> = ({ credentials, onLoginSuccess, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setIsLoading(true);

    setTimeout(() => {
      if (username === credentials.username && password === credentials.password) {
        onLoginSuccess();
      } else {
        setError(true);
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-full bg-slate-950 flex flex-col p-8 animate-in fade-in duration-500 overflow-hidden relative">
      {/* Decorative background effects */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Back Button */}
      <button 
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onBack();
        }} 
        className="self-start p-3 bg-white/5 rounded-2xl text-white/40 hover:text-white hover:bg-white/10 transition-all mb-12 border border-white/5 relative z-20 active:scale-90"
      >
        <ArrowLeft size={20} />
      </button>

      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full relative z-10">
        <div className="flex flex-col items-center mb-10">
          <div className={`w-20 h-20 rounded-[30px] flex items-center justify-center mb-6 border-2 transition-all duration-500 ${error ? 'border-rose-500 bg-rose-500/10 text-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.3)]' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]'}`}>
            {error ? <AlertCircle size={32} /> : <ShieldCheck size={32} />}
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight text-center">Restricted Access</h2>
          <p className="text-[10px] font-medium text-white/30 uppercase tracking-[4px] mt-2 text-center">Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[9px] font-medium text-white/40 uppercase tracking-widest ml-1">Admin Identity</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-emerald-500 transition-colors">
                <User size={18} />
              </div>
              <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 p-5 pl-12 rounded-3xl text-white font-semibold focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-all"
                placeholder="Username"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-medium text-white/40 uppercase tracking-widest ml-1">Secure Key</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-emerald-500 transition-colors">
                <Lock size={18} />
              </div>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 p-5 pl-12 rounded-3xl text-white font-semibold focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex items-center gap-3 animate-in shake duration-500">
              <AlertCircle size={16} className="text-rose-500 shrink-0" />
              <p className="text-rose-500 text-[10px] font-semibold uppercase tracking-wider">Invalid Admin Credentials</p>
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-slate-900 py-6 rounded-3xl font-semibold text-[12px] uppercase tracking-[3px] shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-3 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>Verify Access <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <p className="text-[9px] text-white/20 text-center font-medium uppercase tracking-widest mt-12 leading-relaxed px-4">
          Attempting to bypass this gate will log your IP address and device fingerprint for security review.
        </p>
      </div>
    </div>
  );
};

export default AdminLoginScreen;