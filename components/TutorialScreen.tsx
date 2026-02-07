import React from 'react';
import { PlayCircle, Youtube, ExternalLink } from 'lucide-react';
import { TutorialConfig } from '../types';

interface TutorialScreenProps {
  config: TutorialConfig;
}

const TutorialScreen: React.FC<TutorialScreenProps> = ({ config }) => {
  const renderIcon = (icon: string) => {
    if (icon.startsWith('data:image') || icon.startsWith('http')) {
      return <img src={icon} alt="Icon" className="w-full h-full object-cover rounded-xl" />;
    }
    return <span className="text-xl flex items-center justify-center">{icon}</span>;
  };

  const handleWatchVideo = (url?: string) => {
    if (url) window.open(url, '_blank');
  };

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 p-6 animate-in slide-in-from-right-10 duration-500 transition-colors">
      <div className="flex items-center gap-4 mb-8 px-1">
        <div className="bg-emerald-600 p-3 rounded-2xl text-white shadow-xl shadow-emerald-500/20">
          <PlayCircle size={26} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none uppercase">Academy</h2>
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[4px] mt-1.5 leading-none">The Roadmap to Profit</p>
        </div>
      </div>

      {/* Hero Video Section */}
      <div className="relative group mb-10 cursor-pointer" onClick={() => handleWatchVideo(config.heroVideoUrl)}>
        <div className="w-full aspect-video bg-slate-900 dark:bg-slate-800 rounded-[40px] overflow-hidden shadow-2xl relative border-4 border-white dark:border-slate-800 transition-colors">
          <img 
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop" 
            alt="Academy Module" 
            className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-5 shadow-2xl group-active:scale-90 transition-all border-4 border-white/20">
              <PlayCircle size={40} fill="white" />
            </div>
            <h3 className="font-black text-xl tracking-tight mb-2 uppercase">Core System Guide</h3>
            <p className="text-[10px] text-white/60 font-black uppercase tracking-[3px]">Master the cloud infrastructure</p>
          </div>
          
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
            <div className="flex gap-1.5">
              {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 bg-white/40 rounded-full"></div>)}
            </div>
            <span className="bg-red-600 text-[9px] font-black px-3 py-1 rounded-full text-white flex items-center gap-1.5 uppercase tracking-widest shadow-lg shadow-red-500/20">
              <Youtube size={12} /> Live Session
            </span>
          </div>
        </div>
      </div>

      {/* Roadmap Section */}
      <div className="mb-10">
        <h3 className="text-[12px] font-black text-slate-900 dark:text-white uppercase tracking-[5px] mb-6 flex items-center gap-3 px-1">
          <div className="w-2 h-5 bg-emerald-500 rounded-full"></div>
          Earning Protocol
        </h3>
        
        <div className="space-y-5">
          {config.steps.map((step, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-[40px] shadow-sm dark:shadow-none border border-slate-50 dark:border-slate-800 flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-2 duration-300 transition-colors" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="flex gap-5">
                <div className="w-14 h-14 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-800 overflow-hidden shadow-inner text-2xl">
                  {renderIcon(step.icon)}
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className="font-black text-slate-800 dark:text-white text-[14px] tracking-tight leading-none uppercase">{step.title}</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] font-medium leading-relaxed mt-2">{step.desc}</p>
                </div>
              </div>
              
              {step.buttonText && step.buttonUrl && (
                <button 
                  onClick={() => handleWatchVideo(step.buttonUrl)}
                  className="w-full bg-slate-50 dark:bg-slate-950 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 py-4 rounded-[28px] flex items-center justify-center gap-2.5 text-[11px] font-black uppercase tracking-[3px] border border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-900/50 transition-all active:scale-[0.98] shadow-sm"
                >
                  <PlayCircle size={16} />
                  {step.buttonText}
                  <ExternalLink size={12} className="opacity-40" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="h-32"></div>
    </div>
  );
};

export default TutorialScreen;