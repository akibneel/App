
import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, Star, Users, CheckCircle2 } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate official server-side verification
    setTimeout(() => {
      onLogin();
      setIsLoading(false);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col animate-in fade-in duration-700">
      {/* Top Banner / Social Proof */}
      <div className="bg-slate-900 px-6 py-3 flex items-center justify-between overflow-hidden relative">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-5 h-5 rounded-full border-2 border-slate-900 bg-slate-700 ring-1 ring-white/10"></div>
            ))}
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">120k+ Users Verified</span>
        </div>
        <div className="flex items-center gap-1 text-amber-400">
          <Star size={10} fill="currentColor" />
          <span className="text-[10px] font-black italic">OFFICIAL PARTNER</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col px-8 pb-12 pt-10 overflow-y-auto no-scrollbar">
        {/* Brand Identity */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-green-600 rounded-[24px] flex items-center justify-center shadow-2xl shadow-green-200 mb-4 relative">
            <span className="text-white text-3xl font-black">৳</span>
          </div>
          
          <h1 className="text-2xl font-black text-slate-900 text-center tracking-tight mb-1">
            {authMode === 'LOGIN' ? 'Welcome Back' : 'Get Started'}
          </h1>
          <p className="text-slate-500 text-center text-xs font-medium max-w-[280px]">
            {authMode === 'LOGIN' 
              ? 'Access your earning dashboard securely.' 
              : 'Join the official micro-tasking network in BD.'}
          </p>
        </div>

        {/* Professional Tab Switcher */}
        <div className="bg-slate-100 p-1 rounded-2xl flex mb-8 relative">
          <div 
            className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-sm transition-transform duration-300 ease-out ${authMode === 'SIGNUP' ? 'translate-x-full' : 'translate-x-0'}`}
          />
          <button 
            onClick={() => setAuthMode('LOGIN')}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest relative z-10 transition-colors ${authMode === 'LOGIN' ? 'text-slate-900' : 'text-slate-400'}`}
          >
            Log In
          </button>
          <button 
            onClick={() => setAuthMode('SIGNUP')}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest relative z-10 transition-colors ${authMode === 'SIGNUP' ? 'text-slate-900' : 'text-slate-400'}`}
          >
            Sign Up
          </button>
        </div>

        {/* Official Email Form */}
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          {authMode === 'SIGNUP' && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <User size={18} />
                </div>
                <input 
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-slate-50 p-4 pl-12 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none focus:border-green-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail size={18} />
              </div>
              <input 
                type="email"
                required
                placeholder="name@official.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-slate-50 border-2 border-slate-50 p-4 pl-12 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none focus:border-green-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2 px-1">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
              {authMode === 'LOGIN' && (
                <button type="button" className="text-[10px] font-bold text-green-600 hover:text-green-700">Forgot?</button>
              )}
            </div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock size={18} />
              </div>
              <input 
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-slate-50 border-2 border-slate-50 p-4 pl-12 pr-12 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none focus:border-green-500 focus:bg-white transition-all"
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
            className="w-full bg-green-600 p-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-green-100 active:scale-[0.98] transition-all disabled:opacity-50 mt-6"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span className="font-black text-white text-sm uppercase tracking-widest">
                  {authMode === 'LOGIN' ? 'Secure Login' : 'Create Official Account'}
                </span>
                <ArrowRight size={18} className="text-white/60" />
              </>
            )}
          </button>
        </form>

        {/* Benefits List for Sign Up */}
        {authMode === 'SIGNUP' && (
          <div className="mt-8 grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <CheckCircle2 size={14} className="text-green-500" />
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-tight">Verified Payouts</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <CheckCircle2 size={14} className="text-green-500" />
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-tight">SSL Protection</span>
            </div>
          </div>
        )}

        <div className="mt-auto pt-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-[1px] bg-slate-100 flex-1"></div>
            <Users size={14} className="text-slate-300" />
            <div className="h-[1px] bg-slate-100 flex-1"></div>
          </div>
          
          <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-3xl border border-slate-100">
            <div className="bg-white p-2.5 rounded-2xl shadow-sm">
              <ShieldCheck size={20} className="text-green-600 shrink-0" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-slate-800 uppercase tracking-wider mb-0.5">Secure Data Protocol</p>
              <p className="text-[10px] text-slate-500 leading-tight font-medium">
                We use bank-grade encryption to protect your account. Your earnings are safe and verified daily.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
