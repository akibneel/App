import React from 'react';
import { Task } from '../types';
import { Bell, ShieldCheck, Clock, PlayCircle } from 'lucide-react';

interface HomeScreenProps {
  balance: { total: number; available: number; pending: number };
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  userName: string;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ balance, tasks, onTaskClick, userName }) => {
  const earnRelatedColors = [
    'bg-emerald-600',
    'bg-green-600',
    'bg-teal-600',
    'bg-amber-500',
    'bg-emerald-500',
    'bg-green-500',
    'bg-lime-600',
    'bg-cyan-600'
  ];

  const renderIcon = (icon: string) => {
    if (icon.startsWith('data:image') || icon.startsWith('http')) {
      return <img src={icon} alt="Icon" className="w-full h-full object-cover rounded-xl" />;
    }
    return icon;
  };

  const getUnitLabel = (type: string) => {
    return `1 ${type}`;
  };

  const handleOpenTutorial = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    window.open(url, '_blank');
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Sleek Emerald Header Card - Reduced padding and size */}
      <div className="bg-emerald-500 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 pt-4 pb-6 px-5 rounded-b-[32px] text-white relative shadow-xl shadow-emerald-500/10 border-b border-white/10 overflow-hidden">
        {/* Decorative background glass elements */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-16 -right-12 w-48 h-48 bg-teal-400/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            {/* Animated Profile Badge */}
            <div className="flex items-center gap-2 bg-white/15 pl-1 pr-3 py-1 rounded-xl border border-white/10 backdrop-blur-md animate-in slide-in-from-left-8 duration-1000">
              <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-emerald-600 shadow-sm animate-pulse">
                <ShieldCheck size={14} />
              </div>
              <div>
                <h2 className="text-[10px] font-semibold leading-none tracking-tight">{userName}</h2>
                <p className="text-[6px] font-medium text-emerald-100 uppercase tracking-widest mt-0.5">Verified Profile</p>
              </div>
            </div>
            
            <button className="bg-white/15 p-2 rounded-xl backdrop-blur-md border border-white/10 relative active:scale-90 transition-all hover:bg-white/20">
              <Bell size={16} className="text-white" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-emerald-900"></span>
            </button>
          </div>

          <div className="text-center">
            <div className="inline-block mb-1">
              <p className="text-white/70 text-[8px] font-medium uppercase tracking-[3px]">Available Balance</p>
            </div>
            
            <div className="flex items-baseline justify-center gap-1 mb-3">
              <span className="text-lg font-semibold text-white/50">৳</span>
              <h1 className="text-3xl font-bold tracking-tighter balance-glow leading-none text-white">
                {balance.available.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </h1>
            </div>
            
            <div className="flex justify-center">
              <div className="flex items-center gap-2 bg-black/15 backdrop-blur-lg border border-white/5 px-3 py-1.5 rounded-full">
                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></div>
                <span className="text-white/90 font-medium text-[9px] uppercase tracking-wider">
                  Pending: <span className="text-white font-bold">৳{balance.pending.toLocaleString()}</span>
                </span>
                <Clock size={10} className="text-white/40 ml-0.5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 mt-6">
        <div className="flex justify-between items-center mb-5 px-1">
          <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-tight flex items-center gap-2">
            <span className="w-1 h-5 bg-emerald-500 rounded-full"></span>
            Daily Tasks
          </h3>
          <span className="text-[9px] font-medium text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">{tasks.length} Active</span>
        </div>

        <div className="space-y-3.5">
          {tasks.map((task, index) => {
            const btnColorClass = earnRelatedColors[index % earnRelatedColors.length];
            return (
              <div 
                key={task.id} 
                className="bg-white p-3.5 rounded-[28px] flex items-center gap-4 shadow-[0_4px_20px_rgb(0,0,0,0.03)] active:scale-[0.98] transition-all cursor-pointer border border-slate-100/50 animate-in slide-in-from-top-2 fade-in duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => onTaskClick(task)}
              >
                {/* Leading Icon Box */}
                <div className={`${task.color} w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-inner shrink-0 overflow-hidden relative`}>
                  <div className="absolute inset-0 bg-white/10"></div>
                  {renderIcon(task.icon)}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-slate-800 text-[12px] truncate tracking-tight">{task.title}</h4>
                  </div>
                  <div className="flex flex-col mt-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold text-[11px] tracking-tight">
                        ৳{task.rate} <span className="text-[7px] text-slate-400 font-medium uppercase ml-0.5">/ {getUnitLabel(task.rateType)}</span>
                      </span>
                      {task.tutorialUrl && (
                        <button 
                          onClick={(e) => handleOpenTutorial(e, task.tutorialUrl!)}
                          className="flex items-center gap-1 bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full text-[6px] font-semibold uppercase tracking-tighter hover:bg-blue-100 active:scale-90 transition-all"
                        >
                          <PlayCircle size={8} /> Video
                        </button>
                      )}
                    </div>
                    <span className="text-slate-400 text-[7px] font-medium uppercase tracking-tighter mt-0.5">
                      Limit: {task.limit}
                    </span>
                  </div>
                </div>

                {/* Trailing Button Box */}
                <button className={`${btnColorClass} text-white w-20 h-12 rounded-xl text-[10px] font-semibold uppercase tracking-widest shadow-md shadow-black/5 shrink-0 flex items-center justify-center text-center transition-all active:scale-95 active:brightness-90`}>
                  {task.buttonText || 'Submit'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="h-24"></div>
    </div>
  );
};

export default HomeScreen;