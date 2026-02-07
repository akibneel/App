
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
      {/* Vibrant Emerald Header Card */}
      <div className="bg-emerald-500 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 pt-6 pb-10 px-6 rounded-b-[40px] text-white relative shadow-2xl shadow-emerald-500/20 border-b border-white/10 overflow-hidden">
        {/* Decorative background glass elements */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-24 -right-12 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-3 bg-white/20 pl-1.5 pr-4 py-1.5 rounded-2xl border border-white/20 backdrop-blur-md">
              <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-md">
                <ShieldCheck size={16} />
              </div>
              <div>
                <h2 className="text-[11px] font-black leading-none tracking-tight">{userName}</h2>
                <p className="text-[7px] font-bold text-emerald-100 uppercase tracking-widest mt-0.5">Verified Profile</p>
              </div>
            </div>
            
            <button className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-md border border-white/20 relative active:scale-90 transition-all hover:bg-white/30">
              <Bell size={18} className="text-white" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-emerald-900"></span>
            </button>
          </div>

          <div className="text-center">
            <div className="inline-block mb-2">
              <p className="text-white/80 text-[9px] font-black uppercase tracking-[4px]">Available Balance</p>
            </div>
            
            <div className="flex items-baseline justify-center gap-1.5 mb-4">
              <span className="text-2xl font-black text-white/60">৳</span>
              <h1 className="text-5xl font-black tracking-tighter balance-glow leading-none text-white">
                {balance.available.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </h1>
            </div>
            
            <div className="flex justify-center">
              <div className="flex items-center gap-2 bg-black/10 backdrop-blur-lg border border-white/10 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                <span className="text-white/90 font-black text-[10px] uppercase tracking-wider">
                  Pending: <span className="text-white">৳{balance.pending.toLocaleString()}</span>
                </span>
                <Clock size={12} className="text-white/40 ml-1" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 mt-8">
        <div className="flex justify-between items-center mb-6 px-1">
          <h3 className="font-black text-slate-800 text-sm uppercase tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
            Daily Tasks
          </h3>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{tasks.length} Active</span>
        </div>

        <div className="space-y-4">
          {tasks.map((task, index) => {
            const btnColorClass = earnRelatedColors[index % earnRelatedColors.length];
            return (
              <div 
                key={task.id} 
                className="bg-white p-4 rounded-[30px] flex items-center gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] active:scale-[0.98] transition-all cursor-pointer border border-slate-100/50 animate-in slide-in-from-top-2 fade-in duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => onTaskClick(task)}
              >
                {/* Leading Icon Box: Square Shape */}
                <div className={`${task.color} w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner shrink-0 overflow-hidden relative`}>
                  <div className="absolute inset-0 bg-white/10"></div>
                  {renderIcon(task.icon)}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-slate-800 text-[13px] truncate tracking-tight">{task.title}</h4>
                  </div>
                  <div className="flex flex-col mt-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 font-black text-[12px] tracking-tight">
                        ৳{task.rate} <span className="text-[8px] text-slate-400 font-bold uppercase ml-0.5">/ {getUnitLabel(task.rateType)}</span>
                      </span>
                      {task.tutorialUrl && (
                        <button 
                          onClick={(e) => handleOpenTutorial(e, task.tutorialUrl!)}
                          className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-tighter hover:bg-blue-100 active:scale-90 transition-all"
                        >
                          <PlayCircle size={10} /> Video
                        </button>
                      )}
                    </div>
                    <span className="text-slate-400 text-[8px] font-black uppercase tracking-tighter mt-0.5">
                      Limit: {task.limit}
                    </span>
                  </div>
                </div>

                {/* Trailing Button Box: Bigger and More Visible (Wider rectangle) */}
                <button className={`${btnColorClass} text-white w-24 h-14 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-black/10 shrink-0 flex items-center justify-center text-center transition-all active:scale-95 active:brightness-90`}>
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
