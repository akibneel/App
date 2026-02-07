import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, Star, Users, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { UserAccount } from '../types';

interface LoginScreenProps {
  onLogin: (user: UserAccount) => void;
  onSignup: (user: UserAccount) => void;
  onAuthAttempt: (email: string, password?: string) => { success: boolean, error?: string, user?: UserAccount };
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onSignup, onAuthAttempt }) => {
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Simulate Server Round-trip
    setTimeout(() => {
      const emailLower = formData.email.toLowerCase().trim();
      
      if (authMode === 'LOGIN') {
        const result = onAuthAttempt(emailLower, formData.password);
        if (result.success && result.user) {
          onLogin(result.user);
        } else {
          setError(result.error || 'Authorization failed.');
          setIsLoading(false);
        }
      } else {
        // Signup Mode: Check if already exists first
        const checkResult = onAuthAttempt(emailLower);
        if (checkResult.success || checkResult.error?.includes('restricted')) {
           setError('This email is already in use.');
           setIsLoading(false);
        } else {
          const newUser: UserAccount = {
            name: formData.fullName,
            email: emailLower,
            password: formData.password
          };
          onSignup(newUser);
          setAuthMode('LOGIN');
          setFormData({ fullName: '', email: '', password: '' });
          setIsLoading(false);
        }
      }
    }, 1200); // Mimic server latency
  };

  return (
    <div className="min-h-screen bg-white flex flex-col animate-in fade-in duration-700">
      <div className="flex-1 flex flex-col px-8 pb-12 pt-10 overflow-y-auto no-scrollbar">
        {/* Brand Identity */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-green-600 rounded-[24px] flex items-center justify-center shadow-2xl shadow-green-200 mb-4 relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-all"></div>
            <span className="text-white text-3xl font-semibold relative z-10">৳</span>
          </div>
          
          <h1 className="text-2xl font-bold text-slate-900 text-center tracking-tight mb-1">
            {authMode === 'LOGIN' ? 'Access Secure Server' : 'Cloud Registration'}
          </h1>
          <p className="text-slate-500 text-center text-xs font-medium max-w-[280px]">
            {authMode === 'LOGIN' 
              ? 'Enter credentials to fetch your cloud profile.' 
              : 'Data will be automatically saved to our global server.'}
          </p>
        </div>

        {/* Professional Tab Switcher */}
        <div className="bg-slate-100 p-1 rounded-2xl flex mb-6 relative">
          <div 
            className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-sm transition-transform duration-300 ease-out ${authMode === 'SIGNUP' ? 'translate-x-full' : 'translate-x-0'}`}
          />
          <button 
            onClick={() => { if(!isLoading) { setAuthMode('LOGIN'); setError(null); } }}
            className={`flex-1 py-3 text-[10px] font-semibold uppercase tracking-widest relative z-10 transition-colors ${authMode === 'LOGIN' ? 'text-slate-900' : 'text-slate-400'}`}
          >
            Log In
          </button>
          <button 
            onClick={() => { if(!isLoading) { setAuthMode('SIGNUP'); setError(null); } }}
            className={`flex-1 py-3 text-[10px] font-semibold uppercase tracking-widest relative z-10 transition-colors ${authMode === 'SIGNUP' ? 'text-slate-900' : 'text-slate-400'}`}
          >
            Sign Up
          </button>
        </div>

        {/* Error Messaging */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 animate-in shake duration-500">
            <div className="bg-rose-500 p-1 rounded-lg shrink-0">
               <AlertCircle className="text-white" size={14} />
            </div>
            <div className="flex-1">
              <h4 className="text-[10px] font-semibold text-rose-700 uppercase tracking-widest leading-none mb-1">Authorization Failed</h4>
              <p className="text-rose-600 text-[11px] font-medium leading-tight">{error}</p>
            </div>
          </div>
        )}

        {/* Official Auth Form */}
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          {authMode === 'SIGNUP' && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest ml-1 mb-2">Full Legal Name</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors">
                  <User size={18} />
                </div>
                <input 
                  type="text"
                  required
                  disabled={isLoading}
                  placeholder="Your full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-slate-50 p-4 pl-12 rounded-2xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-green-500 focus:bg-white transition-all shadow-sm disabled:opacity-50"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest ml-1 mb-2">Email Address</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors">
                <Mail size={18} />
              </div>
              <input 
                type="email"
                required
                disabled={isLoading}
                placeholder="name@server.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-slate-50 border-2 border-slate-50 p-4 pl-12 rounded-2xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-green-500 focus:bg-white transition-all shadow-sm disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2 px-1">
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Secret Password</label>
            </div>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors">
                <Lock size={18} />
              </div>
              <input 
                type={showPassword ? 'text' : 'password'}
                required
                disabled={isLoading}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-slate-50 border-2 border-slate-50 p-4 pl-12 pr-12 rounded-2xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-green-500 focus:bg-white transition-all shadow-sm disabled:opacity-50"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-900 p-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-slate-200 active:scale-[0.98] transition-all disabled:opacity-50 mt-6"
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <RefreshCw className="text-emerald-500 animate-spin" size={18} />
                <span className="font-semibold text-white text-[10px] uppercase tracking-[2px]">Syncing with Server...</span>
              </div>
            ) : (
              <>
                <span className="font-semibold text-white text-[12px] uppercase tracking-[2px]">
                  {authMode === 'LOGIN' ? 'Authorized Access' : 'Save to Cloud'}
                </span>
                <ArrowRight size={18} className="text-white/60" />
              </>
            )}
          </button>
        </form>

        <div className="mt-auto pt-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-[1px] bg-slate-100 flex-1"></div>
            <div className="px-3 py-1 bg-slate-50 rounded-full border border-slate-100 text-[8px] font-semibold text-slate-400 uppercase tracking-widest">
              Server Persistence Active
            </div>
            <div className="h-[1px] bg-slate-100 flex-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;