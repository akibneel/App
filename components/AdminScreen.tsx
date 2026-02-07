import React, { useState, useRef } from 'react';
import { Submission, TaskStatus, Task, TutorialConfig, TutorialStep, AppAnalytics, AdminCredentials, AppConfig, WithdrawalMethod, Transaction } from '../types';
import { ShieldAlert, Check, X, User, Edit3, Plus, Trash2, CheckCircle2, Image as ImageIcon, Upload, ArrowLeft, PlayCircle, Video, ListOrdered, Link, PlusCircle, Layout, MessageSquare, Megaphone, Users, Zap, PlaySquare, Lock, Save, FileText, Smartphone, DollarSign, Globe, ExternalLink, CreditCard, Landmark } from 'lucide-react';

interface AdminScreenProps {
  analytics: AppAnalytics;
  submissions: Submission[];
  withdrawals: Transaction[];
  tasks: Task[];
  tutorialConfig: TutorialConfig;
  appConfig: AppConfig;
  adminCredentials: AdminCredentials;
  onUpdateAdminCredentials: (creds: AdminCredentials) => void;
  onAction: (id: string, status: TaskStatus, approvedQuantity?: number) => void;
  onWithdrawAction: (id: string, status: TaskStatus) => void;
  onAddTask: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onUpdateTutorialConfig: (config: TutorialConfig) => void;
  onUpdateAppConfig: (config: AppConfig) => void;
  onBack: () => void;
}

const AdminScreen: React.FC<AdminScreenProps> = ({ 
  analytics, submissions, withdrawals, tasks, tutorialConfig, appConfig, adminCredentials, 
  onUpdateAdminCredentials, onAction, onWithdrawAction, onAddTask, onUpdateTask, 
  onDeleteTask, onUpdateTutorialConfig, onUpdateAppConfig, onBack 
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'LEADS' | 'RECEIVED' | 'WITHDRAWALS' | 'TASKS' | 'TUTORIAL_MANAGE' | 'FINANCE' | 'SECURITY'>('OVERVIEW');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [viewingScreenshot, setViewingScreenshot] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const taskLogoInputRef = useRef<HTMLInputElement>(null);
  
  // Local state for manual quantity/rate overrides in leads/received
  const [manualAdjustments, setManualAdjustments] = useState<Record<string, { quantity: number; rate: number }>>({});

  // Security State
  const [secUsername, setSecUsername] = useState(adminCredentials.username);
  const [secPassword, setSecPassword] = useState(adminCredentials.password);

  // Task Form State
  const [formTask, setFormTask] = useState<{
    title: string;
    rate: string;
    rateType: string;
    buttonText: string;
    limit: string;
    icon: string;
    color: string;
    category: 'Social' | 'Survey' | 'Ads' | 'Bonus';
    tutorialUrl: string;
    description: string;
  }>({
    title: '', rate: '5', rateType: 'Per ID', buttonText: 'Submit', limit: '100', icon: '📋', color: 'bg-emerald-500', category: 'Social', tutorialUrl: '', description: ''
  });

  const resetForm = () => {
    setFormTask({ title: '', rate: '5', rateType: 'Per ID', buttonText: 'Submit', limit: '100', icon: '📋', color: 'bg-emerald-500', category: 'Social', tutorialUrl: '', description: '' });
    setEditingTask(null);
    setShowTaskForm(false);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setFormTask({
      title: task.title,
      rate: task.rate.toString(),
      rateType: task.rateType,
      buttonText: task.buttonText,
      limit: task.limit.toString(),
      icon: task.icon,
      color: task.color,
      category: task.category,
      tutorialUrl: task.tutorialUrl || '',
      description: task.description || ''
    });
    setShowTaskForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    const taskData: Task = {
      id: editingTask ? editingTask.id : `t${Date.now()}`,
      title: formTask.title,
      rate: parseFloat(formTask.rate),
      rateType: formTask.rateType,
      buttonText: formTask.buttonText,
      limit: parseInt(formTask.limit),
      completed: editingTask ? editingTask.completed : 0,
      icon: formTask.icon,
      color: formTask.color,
      category: formTask.category,
      tutorialUrl: formTask.tutorialUrl,
      description: formTask.description
    };
    if (editingTask) onUpdateTask(taskData);
    else onAddTask(taskData);
    resetForm();
  };

  const handleUpdateSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAdminCredentials({ username: secUsername, password: secPassword });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormTask(prev => ({ ...prev, icon: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdjustment = (id: string, field: 'quantity' | 'rate', value: number, initialQty: number, initialRate: number) => {
    setManualAdjustments(prev => {
      const current = prev[id] || { quantity: initialQty, rate: initialRate };
      return { ...prev, [id]: { ...current, [field]: value } };
    });
  };

  const renderIcon = (icon: string, className: string = "w-full h-full object-cover rounded-xl") => {
    if (icon.startsWith('data:image') || icon.startsWith('http')) {
      return <img src={icon} alt="Icon" className={className} />;
    }
    return <span className="text-xl flex items-center justify-center">{icon}</span>;
  };

  const SubmissionList = ({ groupedItems, tabType }: { groupedItems: Record<string, Submission[]>, tabType: 'LEADS' | 'RECEIVED' }) => {
    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        {Object.keys(groupedItems).sort((a,b)=>b.localeCompare(a)).map((dateKey) => (
          <div key={dateKey} className="space-y-4">
            <div className="flex items-center gap-3 px-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[4px]">{dateKey} {tabType === 'RECEIVED' ? 'RECEIVED' : 'QUEUE'}</span>
            </div>
            <div className="space-y-4">
              {groupedItems[dateKey].map((sub) => {
                const adj = manualAdjustments[sub.id] || { quantity: sub.userQuantity, rate: sub.rate };
                return (
                  <div key={sub.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-5 shadow-sm transition-colors flex flex-col gap-5">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                          <User size={18} />
                        </div>
                        <div>
                          <h4 className="font-bold text-[13px] text-slate-800 dark:text-slate-100 tracking-tight leading-none">{sub.userName}</h4>
                          <p className="text-[8px] font-medium text-slate-500 uppercase mt-1 tracking-widest">{sub.userEmail}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between mb-3">
                         <h5 className="font-bold text-slate-900 dark:text-white text-[11px] uppercase tracking-tight">{sub.taskTitle}</h5>
                         {sub.screenshot && (
                           <button onClick={() => setViewingScreenshot(sub.screenshot || null)} className="text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                             <ImageIcon size={12} /> View Proof
                           </button>
                         )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-2">
                        <div className="space-y-1">
                          <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest ml-1">Manual Qty</label>
                          <input 
                            type="number" 
                            value={adj.quantity}
                            onChange={(e) => handleAdjustment(sub.id, 'quantity', parseInt(e.target.value) || 0, sub.userQuantity, sub.rate)}
                            className="w-full bg-white dark:bg-slate-800 p-2 rounded-xl text-[11px] font-bold dark:text-white border border-transparent focus:border-emerald-500 outline-none" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest ml-1">Manual Rate (৳)</label>
                          <input 
                            type="number" 
                            value={adj.rate}
                            onChange={(e) => handleAdjustment(sub.id, 'rate', parseFloat(e.target.value) || 0, sub.userQuantity, sub.rate)}
                            className="w-full bg-white dark:bg-slate-800 p-2 rounded-xl text-[11px] font-bold dark:text-white border border-transparent focus:border-emerald-500 outline-none" 
                          />
                        </div>
                      </div>
                      <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Adjusted Total</span>
                        <span className="text-[14px] font-black text-emerald-600 dark:text-emerald-400">৳{(adj.quantity * adj.rate).toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                       <button onClick={() => onAction(sub.id, TaskStatus.REJECTED)} className="flex-1 bg-rose-50 dark:bg-rose-900/20 text-rose-500 h-11 rounded-2xl border border-rose-100 dark:border-rose-900/30 flex items-center justify-center font-bold text-[10px] uppercase tracking-widest">Reject</button>
                       <button onClick={() => onAction(sub.id, tabType === 'LEADS' ? TaskStatus.RECEIVED : TaskStatus.APPROVED, adj.quantity)} className={`flex-1 ${tabType === 'LEADS' ? 'bg-blue-600' : 'bg-emerald-600'} text-white h-11 rounded-2xl shadow-lg font-bold text-[10px] uppercase tracking-widest`}>
                          {tabType === 'LEADS' ? 'Receive' : 'Approve'}
                       </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const FinanceManagement = () => {
    const [minWithdrawal, setMinWithdrawal] = useState(appConfig.minWithdrawal.toString());
    const [showGatewayForm, setShowGatewayForm] = useState(false);
    const [gatewayForm, setGatewayForm] = useState<WithdrawalMethod>({ id: '', name: '', icon: '', color: 'border-slate-200', activeBg: 'bg-slate-50' });
    const gatewayLogoRef = useRef<HTMLInputElement>(null);

    const handleSaveConfig = () => {
      onUpdateAppConfig({ ...appConfig, minWithdrawal: parseFloat(minWithdrawal) || 0 });
    };

    const handleGatewayLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setGatewayForm(prev => ({ ...prev, icon: reader.result as string }));
        reader.readAsDataURL(file);
      }
    };

    const handleAddGateway = () => {
      if (!gatewayForm.name || !gatewayForm.icon) return;
      const id = gatewayForm.name.toLowerCase().replace(/\s/g, '-');
      const newMethod = { ...gatewayForm, id };
      onUpdateAppConfig({ ...appConfig, withdrawalMethods: [...appConfig.withdrawalMethods, newMethod] });
      setShowGatewayForm(false);
      setGatewayForm({ id: '', name: '', icon: '', color: 'border-slate-200', activeBg: 'bg-slate-50' });
    };

    const handleDeleteGateway = (id: string) => {
      onUpdateAppConfig({ ...appConfig, withdrawalMethods: appConfig.withdrawalMethods.filter(m => m.id !== id) });
    };

    return (
      <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
        <div className="bg-white dark:bg-slate-900 p-7 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm">
           <h4 className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-[4px] mb-6">Global Threshold</h4>
           <div className="space-y-4">
              <div className="relative">
                <input 
                  type="number" 
                  value={minWithdrawal} 
                  onChange={e => setMinWithdrawal(e.target.value)} 
                  className="w-full bg-slate-50 dark:bg-slate-950 p-5 rounded-3xl text-xl font-black dark:text-white border-2 border-transparent focus:border-emerald-500 outline-none transition-all pl-12" 
                />
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-600 dark:text-emerald-400 font-bold text-xl">৳</span>
              </div>
              <button onClick={handleSaveConfig} className="w-full bg-slate-900 dark:bg-emerald-600 text-white py-5 rounded-3xl font-bold text-[11px] uppercase tracking-[3px] active:scale-95 transition-all">Update Minimum Amount</button>
           </div>
        </div>

        <div className="space-y-4">
           <div className="flex justify-between items-center px-1">
             <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[4px]">Payment Gateways</h4>
             <button onClick={() => setShowGatewayForm(true)} className="bg-emerald-600 text-white p-2 rounded-xl active:scale-90 transition-all"><Plus size={16} /></button>
           </div>

           {showGatewayForm && (
             <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-emerald-500/30 shadow-xl space-y-4 animate-in zoom-in-95 duration-200">
                <div className="flex gap-4">
                   <div onClick={() => gatewayLogoRef.current?.click()} className="w-16 h-16 bg-slate-50 dark:bg-slate-950 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 cursor-pointer overflow-hidden">
                      {gatewayForm.icon ? <img src={gatewayForm.icon} className="w-full h-full object-contain" /> : <ImageIcon className="text-slate-300" />}
                   </div>
                   <input type="file" ref={gatewayLogoRef} className="hidden" onChange={handleGatewayLogo} accept="image/*" />
                   <input 
                    type="text" 
                    placeholder="Gateway Name (e.g. bKash)" 
                    value={gatewayForm.name}
                    onChange={e => setGatewayForm({...gatewayForm, name: e.target.value})}
                    className="flex-1 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl text-xs font-bold dark:text-white border-none focus:ring-2 focus:ring-emerald-500" 
                   />
                </div>
                <div className="flex gap-2">
                   <button onClick={() => setShowGatewayForm(false)} className="flex-1 bg-slate-50 dark:bg-slate-800 py-4 rounded-2xl font-bold text-[10px] text-slate-400 uppercase tracking-widest">Cancel</button>
                   <button onClick={handleAddGateway} className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest">Add Gateway</button>
                </div>
             </div>
           )}

           <div className="grid grid-cols-2 gap-3">
             {appConfig.withdrawalMethods.map(m => (
               <div key={m.id} className="bg-white dark:bg-slate-900 p-4 rounded-[32px] border border-slate-100 dark:border-slate-800 flex items-center justify-between group">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img src={m.icon} className="w-8 h-8 object-contain shrink-0" />
                    <span className="text-[10px] font-black text-slate-800 dark:text-white truncate uppercase tracking-tighter">{m.name}</span>
                  </div>
                  <button onClick={() => handleDeleteGateway(m.id)} className="p-2 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
               </div>
             ))}
           </div>
        </div>
      </div>
    );
  };

  const RoadmapManagement = () => {
    const [editingStepId, setEditingStepId] = useState<string | null>(null);
    const [stepForm, setStepForm] = useState<TutorialStep>({ id: '', title: '', desc: '', icon: '🌟', buttonText: '', buttonUrl: '' });
    const stepLogoRef = useRef<HTMLInputElement>(null);

    const [heroVideo, setHeroVideo] = useState(tutorialConfig.heroVideoUrl);
    const [supportTele, setSupportTele] = useState(tutorialConfig.supportTelegram);
    const [channelTele, setChannelTele] = useState(tutorialConfig.telegramChannel);

    const handleSaveMeta = () => {
      onUpdateTutorialConfig({ ...tutorialConfig, heroVideoUrl: heroVideo, supportTelegram: supportTele, telegramChannel: channelTele });
    };

    const handleSaveStep = () => {
      if (!stepForm.title || !stepForm.desc) return;
      const newSteps = [...tutorialConfig.steps];
      if (editingStepId) {
        const idx = newSteps.findIndex(s => s.id === editingStepId);
        newSteps[idx] = { ...stepForm };
      } else {
        newSteps.push({ ...stepForm, id: `step-${Date.now()}` });
      }
      onUpdateTutorialConfig({ ...tutorialConfig, steps: newSteps });
      setEditingStepId(null);
      setStepForm({ id: '', title: '', desc: '', icon: '🌟', buttonText: '', buttonUrl: '' });
    };

    const handleDeleteStep = (id: string) => {
      onUpdateTutorialConfig({ ...tutorialConfig, steps: tutorialConfig.steps.filter(s => s.id !== id) });
    };

    const handleStepLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setStepForm(prev => ({ ...prev, icon: reader.result as string }));
        reader.readAsDataURL(file);
      }
    };

    return (
      <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
        <div className="bg-white dark:bg-slate-900 p-7 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
           <h4 className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-[4px] mb-2">Platform Metadata</h4>
           <div className="space-y-3">
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl">
                 <Video className="text-slate-400 shrink-0" size={18} />
                 <input type="text" placeholder="Hero Video URL" value={heroVideo} onChange={e => setHeroVideo(e.target.value)} className="w-full bg-transparent text-[11px] font-bold dark:text-white outline-none" />
              </div>
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl">
                 <Smartphone className="text-slate-400 shrink-0" size={18} />
                 <input type="text" placeholder="Telegram Support Username" value={supportTele} onChange={e => setSupportTele(e.target.value)} className="w-full bg-transparent text-[11px] font-bold dark:text-white outline-none" />
              </div>
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl">
                 <Megaphone className="text-slate-400 shrink-0" size={18} />
                 <input type="text" placeholder="Telegram Channel Username" value={channelTele} onChange={e => setChannelTele(e.target.value)} className="w-full bg-transparent text-[11px] font-bold dark:text-white outline-none" />
              </div>
              <button onClick={handleSaveMeta} className="w-full bg-slate-900 dark:bg-emerald-600 text-white py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest active:scale-95 transition-all">Apply Global Changes</button>
           </div>
        </div>

        <div className="space-y-4">
           <div className="flex justify-between items-center px-1">
             <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[4px]">Earning Roadmap</h4>
             <button onClick={() => { setEditingStepId(null); setStepForm({ id: '', title: '', desc: '', icon: '🌟', buttonText: '', buttonUrl: '' }); }} className="bg-emerald-600 text-white p-2 rounded-xl active:scale-90 transition-all"><Plus size={16} /></button>
           </div>

           <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl space-y-4">
              <div className="flex gap-4 items-center">
                 <div onClick={() => stepLogoRef.current?.click()} className="w-20 h-20 rounded-[28px] bg-slate-50 dark:bg-slate-950 border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center cursor-pointer overflow-hidden text-2xl">
                    {renderIcon(stepForm.icon)}
                 </div>
                 <input type="file" ref={stepLogoRef} className="hidden" onChange={handleStepLogo} accept="image/*" />
                 <div className="flex-1 space-y-3">
                    <input type="text" placeholder="Step Title" value={stepForm.title} onChange={e => setStepForm({...stepForm, title: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl text-[11px] font-black dark:text-white outline-none border-none focus:ring-2 focus:ring-emerald-500" />
                    <textarea placeholder="Step Description" value={stepForm.desc} onChange={e => setStepForm({...stepForm, desc: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl text-[10px] font-medium dark:text-white outline-none border-none focus:ring-2 focus:ring-emerald-500 resize-none h-16"></textarea>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                 <input type="text" placeholder="Action Label" value={stepForm.buttonText} onChange={e => setStepForm({...stepForm, buttonText: e.target.value})} className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl text-[10px] font-bold dark:text-white outline-none border-none focus:ring-2 focus:ring-emerald-500" />
                 <input type="text" placeholder="Action URL" value={stepForm.buttonUrl} onChange={e => setStepForm({...stepForm, buttonUrl: e.target.value})} className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl text-[10px] font-bold dark:text-white outline-none border-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <button onClick={handleSaveStep} className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-bold text-[11px] uppercase tracking-[3px] shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
                 <PlusCircle size={18} /> {editingStepId ? 'Update Entry' : 'Add to Roadmap'}
              </button>
           </div>

           <div className="space-y-3">
             {tutorialConfig.steps.map(step => (
               <div key={step.id} className="bg-white dark:bg-slate-900 p-5 rounded-[32px] border border-slate-100 dark:border-slate-800 flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-950 shrink-0 overflow-hidden flex items-center justify-center text-xl">
                     {renderIcon(step.icon)}
                  </div>
                  <div className="flex-1 overflow-hidden">
                     <h5 className="text-[12px] font-bold text-slate-800 dark:text-slate-100 truncate">{step.title}</h5>
                     <p className="text-[9px] font-medium text-slate-400 dark:text-slate-500 truncate leading-none mt-1">{step.desc}</p>
                  </div>
                  <div className="flex gap-2">
                     <button onClick={() => { setStepForm(step); setEditingStepId(step.id); }} className="p-2 text-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-xl"><Edit3 size={16} /></button>
                     <button onClick={() => handleDeleteStep(step.id)} className="p-2 text-rose-500 bg-rose-50 dark:bg-rose-900/20 rounded-xl"><Trash2 size={16} /></button>
                  </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    );
  };

  const groupedPending = submissions.filter(s => s.status === TaskStatus.PENDING).reduce((groups, sub) => {
    const dateKey = sub.timestamp.split('T')[0];
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(sub);
    return groups;
  }, {} as Record<string, Submission[]>);

  const groupedReceived = submissions.filter(s => s.status === TaskStatus.RECEIVED).reduce((groups, sub) => {
    const dateKey = sub.timestamp.split('T')[0];
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(sub);
    return groups;
  }, {} as Record<string, Submission[]>);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen p-4 transition-colors duration-300">
      {viewingScreenshot && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300" onClick={() => setViewingScreenshot(null)}>
          <button className="absolute top-6 right-6 text-white p-2 hover:bg-white/10 rounded-full transition-colors"><X size={32} /></button>
          <img src={viewingScreenshot} alt="Full Proof" className="max-w-full max-h-[85vh] object-contain rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300" />
        </div>
      )}

      <div className="flex items-center gap-3 mb-6 px-1">
        <button onClick={onBack} className="p-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-slate-100 shadow-sm active:scale-90 transition-all">
          <ArrowLeft size={22} />
        </button>
        <div className="flex items-center gap-3 flex-1 overflow-hidden">
          <div className="bg-slate-900 dark:bg-emerald-600 p-2.5 rounded-2xl text-white shadow-xl shadow-emerald-500/10 shrink-0"><ShieldAlert size={20} /></div>
          <div className="flex flex-col">
            <h2 className="text-[17px] font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none uppercase">Admin Core</h2>
            <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[3px] mt-1.5 leading-none">System Management</p>
          </div>
        </div>
      </div>

      <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-[26px] mb-8 overflow-x-auto no-scrollbar gap-1.5 shadow-inner">
        {(['OVERVIEW', 'LEADS', 'RECEIVED', 'WITHDRAWALS', 'TASKS', 'TUTORIAL_MANAGE', 'FINANCE', 'SECURITY'] as const).map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 min-w-[85px] py-3.5 rounded-[22px] font-black text-[8px] uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-400 dark:text-slate-600'}`}
          >
            {tab.split('_')[0]}
          </button>
        ))}
      </div>

      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900 dark:bg-slate-900 p-6 rounded-[40px] text-white relative overflow-hidden shadow-2xl border border-transparent dark:border-slate-800">
               <h3 className="text-4xl font-black tracking-tighter leading-none mb-1">{analytics.totalSignups}</h3>
               <p className="text-[9px] font-black uppercase tracking-[3px] opacity-40">Registered</p>
               <Users className="absolute -bottom-6 -right-6 text-white/5 rotate-12" size={120} />
            </div>
            <div className="bg-emerald-600 dark:bg-emerald-600 p-6 rounded-[40px] text-white relative overflow-hidden shadow-2xl border border-transparent dark:border-slate-800">
               <h3 className="text-4xl font-black tracking-tighter leading-none mb-1">{analytics.currentlyOnline}</h3>
               <p className="text-[9px] font-black uppercase tracking-[3px] opacity-40">Live Feed</p>
               <Zap className="absolute -bottom-6 -right-6 text-white/5 rotate-12" size={120} />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'TASKS' && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
           <div className="flex justify-between items-center px-2">
             <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[4px]">Inventory Hub</h3>
             <button onClick={() => { resetForm(); setShowTaskForm(true); }} className="bg-emerald-600 text-white p-3 rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest active:scale-90 transition-all shadow-lg shadow-emerald-500/10">
               <Plus size={16} /> New Entry
             </button>
           </div>

           {showTaskForm && (
             <div ref={formRef} className="bg-white dark:bg-slate-900 p-7 rounded-[40px] shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-300">
               <div className="flex justify-between items-center mb-8">
                 <h4 className="font-black text-slate-900 dark:text-slate-100 uppercase tracking-[4px] text-[11px]">{editingTask ? 'Modify Instance' : 'System Registry'}</h4>
                 <button onClick={resetForm} className="bg-slate-50 dark:bg-slate-800 p-2 rounded-full text-slate-400 hover:text-rose-500 transition-all"><X size={20} /></button>
               </div>
               
               <form onSubmit={handleSaveTask} className="space-y-5">
                 <div className="flex gap-5 items-center">
                    <div onClick={() => taskLogoInputRef.current?.click()} className="w-24 h-24 rounded-[32px] bg-slate-50 dark:bg-slate-950 border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all group relative">
                       {formTask.icon ? renderIcon(formTask.icon) : <div className="text-slate-300 group-hover:text-emerald-500"><ImageIcon size={32}/></div>}
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Upload size={20} className="text-white" />
                       </div>
                    </div>
                    <input type="file" ref={taskLogoInputRef} className="hidden" onChange={handleLogoUpload} accept="image/*" />
                    <div className="flex-1 space-y-3">
                       <input type="text" placeholder="Task Name" value={formTask.title} onChange={e => setFormTask({...formTask, title: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl text-[12px] font-black dark:text-white border-none focus:ring-2 focus:ring-emerald-500 transition-all" required />
                       <input type="text" placeholder="Unit (e.g. Per ID)" value={formTask.rateType} onChange={e => setFormTask({...formTask, rateType: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl text-[12px] font-black dark:text-white border-none focus:ring-2 focus:ring-emerald-500 transition-all" required />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Reward (৳)</label>
                       <input type="number" step="0.1" value={formTask.rate} onChange={e => setFormTask({...formTask, rate: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl text-[12px] font-black dark:text-white border-none focus:ring-2 focus:ring-emerald-500 transition-all" required />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Cap Limit</label>
                       <input type="number" value={formTask.limit} onChange={e => setFormTask({...formTask, limit: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl text-[12px] font-black dark:text-white border-none focus:ring-2 focus:ring-emerald-500 transition-all" required />
                    </div>
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Instruction Set</label>
                    <textarea rows={3} value={formTask.description} onChange={e => setFormTask({...formTask, description: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl text-[11px] font-medium dark:text-white border-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none h-24" placeholder="Clear, concise steps..."></textarea>
                 </div>

                 <button type="submit" className="w-full bg-slate-900 dark:bg-emerald-600 text-white py-6 rounded-3xl font-black text-[12px] uppercase tracking-[4px] shadow-2xl active:scale-[0.98] transition-all mt-4">Deploy Configuration</button>
               </form>
             </div>
           )}

           <div className="grid grid-cols-1 gap-4">
             {tasks.map(task => (
               <div key={task.id} className="bg-white dark:bg-slate-900 p-5 rounded-[40px] border border-slate-100 dark:border-slate-800 flex items-center gap-5 group shadow-sm">
                 <div className={`${task.color} w-16 h-16 rounded-[28px] flex items-center justify-center shrink-0 shadow-inner relative overflow-hidden text-3xl`}>
                    <div className="absolute inset-0 bg-white/10"></div>
                    {renderIcon(task.icon)}
                 </div>
                 <div className="flex-1 min-w-0">
                   <h5 className="text-[14px] font-black text-slate-900 dark:text-slate-100 truncate tracking-tight">{task.title}</h5>
                   <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[2px] mt-1">৳{task.rate} • {task.rateType} • Cap {task.limit}</p>
                 </div>
                 <div className="flex gap-2.5">
                   <button onClick={() => handleEditTask(task)} className="p-3.5 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-emerald-500 transition-all rounded-2xl active:scale-90"><Edit3 size={18} /></button>
                   <button onClick={() => onDeleteTask(task.id)} className="p-3.5 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-500 transition-all rounded-2xl active:scale-90"><Trash2 size={18} /></button>
                 </div>
               </div>
             ))}
           </div>
        </div>
      )}

      {activeTab === 'LEADS' && (
        submissions.filter(s => s.status === TaskStatus.PENDING).length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[50px] border-2 border-dashed border-slate-100 dark:border-slate-800 animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="text-slate-200 dark:text-slate-700" size={48} />
            </div>
            <p className="text-slate-400 dark:text-slate-500 font-black uppercase tracking-[5px] text-[10px]">Zero Pending Leads</p>
          </div>
        ) : (
          <SubmissionList groupedItems={groupedPending} tabType="LEADS" />
        )
      )}

      {activeTab === 'RECEIVED' && (
        <SubmissionList groupedItems={groupedReceived} tabType="RECEIVED" />
      )}

      {activeTab === 'FINANCE' && (
        <FinanceManagement />
      )}

      {activeTab === 'TUTORIAL_MANAGE' && (
        <RoadmapManagement />
      )}

      {activeTab === 'SECURITY' && (
        <div className="bg-slate-950 dark:bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden transition-all duration-500 animate-in slide-in-from-bottom-4">
          <div className="absolute top-0 right-0 p-8 opacity-5"><Lock size={120} /></div>
          <h3 className="text-xl font-black tracking-tight mb-10 flex items-center gap-4">
             <div className="p-3 bg-emerald-600 rounded-2xl shadow-xl shadow-emerald-500/20"><Lock size={24}/></div>
             Admin Access Control
          </h3>
          <form onSubmit={handleUpdateSecurity} className="space-y-6">
            <div className="space-y-2">
               <label className="text-[9px] font-black text-white/40 uppercase tracking-[4px] ml-1">Identity Username</label>
               <input 
                 type="text" 
                 value={secUsername}
                 onChange={e => setSecUsername(e.target.value)}
                 className="w-full bg-white/5 border border-white/10 p-5 rounded-3xl text-sm font-bold focus:outline-none focus:border-emerald-500 transition-all text-white" 
                 placeholder="Enter new username" 
               />
            </div>
            <div className="space-y-2">
               <label className="text-[9px] font-black text-white/40 uppercase tracking-[4px] ml-1">Secret Access Key</label>
               <input 
                 type="password"  
                 value={secPassword}
                 onChange={e => setSecPassword(e.target.value)}
                 className="w-full bg-white/5 border border-white/10 p-5 rounded-3xl text-sm font-bold focus:outline-none focus:border-emerald-500 transition-all text-white" 
                 placeholder="Enter new password" 
               />
            </div>
            <button type="submit" className="w-full bg-white text-slate-900 py-6 rounded-3xl text-[12px] font-black uppercase tracking-[5px] shadow-2xl active:scale-95 transition-all mt-4">Commit Security Updates</button>
          </form>
        </div>
      )}

      <div className="h-32"></div>
    </div>
  );
};

export default AdminScreen;