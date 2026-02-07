
import React from 'react';
import { PlayCircle, CheckCircle, Info, ChevronRight, Youtube, BookOpen, Star, ExternalLink } from 'lucide-react';
import { TutorialConfig } from '../types';

interface TutorialScreenProps {
  config: TutorialConfig;
}

const TutorialScreen: React.FC<TutorialScreenProps> = ({ config }) => {
  const getIcon = (type: string) => {
    switch(type) {
      case 'check': return <CheckCircle className="text-emerald-500" />;
      case 'book': return <BookOpen className="text-blue-500" />;
      case 'info': return <Info className="text-amber-500" />;
      case 'star': return <Star className="text-emerald-500" />;
      default: return <CheckCircle className="text-emerald-500" />;
    }
  };

  const handleWatchVideo = (url?: string) => {
    if (url) window.open(url, '_blank');
  };

  return (
    <div className="p-6 animate-in slide-in-from-right-10 duration-500">
      <div className="flex items-center gap-3 mb-6 px-1">
        <div className="bg-emerald-600 p-2.5 rounded-2xl text-white shadow-xl shadow-emerald-100">
          <PlayCircle size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Tutorial</h2>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Learn to Earn</p>
        </div>
      </div>

      {/* Hero Video Section */}
      <div className="relative group mb-8 cursor-pointer" onClick={() => handleWatchVideo(config.heroVideoUrl)}>
        <div className="w-full aspect-video bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl relative border-4 border-white">
          <img 
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop" 
            alt="Tutorial Thumbnail" 
            className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-xl group-active:scale-90 transition-all">
              <PlayCircle size={32} fill="white" />
            </div>
            <h3 className="font-black text-lg tracking-tight mb-1">Watch Official Guide</h3>
            <p className="text-[10px] text-white/60 font-black uppercase tracking-widest">Master the TakaEarn process</p>
          </div>
          
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
            <div className="flex gap-1">
              {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 bg-white/40 rounded-full"></div>)}
            </div>
            <span className="bg-red-600 text-[8px] font-black px-2 py-0.5 rounded-full text-white flex items-center gap-1">
              <Youtube size={10} /> LIVE SESSION
            </span>
          </div>
        </div>
      </div>

      {/* Roadmap Section */}
      <div className="mb-8">
        <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-5 flex items-center gap-2">
          <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
          Earning Roadmap
        </h3>
        
        <div className="space-y-4">
          {config.steps.map((step, idx) => (
            <div key={idx} className="bg-white p-5 rounded-[32px] shadow-sm border border-slate-50 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100">
                  {getIcon(step.iconType)}
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-slate-800 text-[13px] tracking-tight">{step.title}</h4>
                  <p className="text-slate-500 text-[10px] font-medium leading-tight mt-0.5">{step.desc}</p>
                </div>
              </div>
              
              {step.buttonText && step.buttonUrl && (
                <button 
                  onClick={() => handleWatchVideo(step.buttonUrl)}
                  className="w-full bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 py-3 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest border border-slate-100 hover:border-emerald-200 transition-all active:scale-[0.98]"
                >
                  <PlayCircle size={14} />
                  {step.buttonText}
                  <ExternalLink size={10} className="opacity-40" />
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
