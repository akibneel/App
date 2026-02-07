import React, { useState, useRef } from 'react';
import { Task } from '../types';
import { ArrowLeft, Camera, Send, Info, X, Image as ImageIcon, PlayCircle, FileSpreadsheet, File } from 'lucide-react';

interface SubmitTaskScreenProps {
  task: Task;
  onSubmit: (taskId: string, details: string, amount: number, screenshot?: string) => void;
  onBack: () => void;
}

const SubmitTaskScreen: React.FC<SubmitTaskScreenProps> = ({ task, onSubmit, onBack }) => {
  const [quantity, setQuantity] = useState('1');
  const [proofFile, setProofFile] = useState<{ data: string; name: string; type: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const numQuantity = Math.max(1, parseInt(quantity) || 0);
  const totalAmount = task.rate * numQuantity;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofFile({
          data: reader.result as string,
          name: file.name,
          type: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setProofFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofFile) return;
    
    setIsSubmitting(true);
    // Simulate API delay
    setTimeout(() => {
      // Pass an empty string for details as it is removed from UI but required by interface
      onSubmit(task.id, '', totalAmount, proofFile.data);
      setIsSubmitting(false);
    }, 1500);
  };

  const renderIcon = (icon: string) => {
    if (icon.startsWith('data:image') || icon.startsWith('http')) {
      return <img src={icon} alt="Icon" className="w-full h-full object-cover rounded-2xl" />;
    }
    return icon;
  };

  const getUnitLabel = (type: string) => {
    return `1 ${type}`;
  };

  const isImage = proofFile?.type.startsWith('image/');
  const isXlsx = proofFile?.name.toLowerCase().endsWith('.xlsx') || proofFile?.type.includes('spreadsheetml');

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 animate-in slide-in-from-bottom-10 duration-500 transition-colors">
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 p-6 flex items-center gap-4 sticky top-0 z-10 border-b border-slate-100 dark:border-slate-800 transition-colors">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-slate-800 dark:text-slate-100" />
        </button>
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Submit Task</h2>
      </div>

      <div className="p-6">
        {/* Task Info Summary */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl custom-shadow dark:shadow-none mb-8 border border-slate-50 dark:border-slate-800 transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className={`${task.color} w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-black/5 overflow-hidden`}>
              {renderIcon(task.icon)}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight leading-tight">{task.title}</h3>
              <p className="text-green-600 dark:text-emerald-400 font-semibold text-sm">Rate: ৳{task.rate} / {getUnitLabel(task.rateType)}</p>
            </div>
          </div>
          
          {task.tutorialUrl && (
            <button 
              onClick={() => window.open(task.tutorialUrl, '_blank')}
              className="w-full mb-4 bg-blue-600 dark:bg-blue-700 text-white p-4 rounded-2xl font-semibold text-[11px] uppercase tracking-[2px] flex items-center justify-center gap-3 shadow-xl shadow-blue-100 dark:shadow-none active:scale-95 transition-all"
            >
              <PlayCircle size={20} /> How to complete this?
            </button>
          )}

          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl transition-colors">
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-normal">
              {task.description || "Earn rewards by completing this daily task. Follow instructions carefully to avoid rejection."}
            </p>
          </div>
        </div>

        {/* Submission Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-slate-800 dark:text-slate-200 font-semibold mb-2 text-sm ml-1">
              Quantity ({getUnitLabel(task.rateType)})
            </label>
            <input 
              type="number" 
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              max={task.limit - task.completed}
              className="w-full bg-white dark:bg-slate-900 p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 focus:border-green-500 focus:outline-none transition-all custom-shadow dark:shadow-none text-black dark:text-white font-bold"
            />
          </div>

          <div>
            <label className="block text-slate-800 dark:text-slate-200 font-semibold mb-2 text-sm ml-1 flex justify-between items-center">
              <span>Upload Proof (Image or XLSX)</span>
              <span className="text-[10px] text-rose-500 font-bold uppercase tracking-widest bg-rose-50 dark:bg-rose-900/20 px-2 py-0.5 rounded-full">Required</span>
            </label>
            <input 
              type="file" 
              accept="image/*,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`w-full min-h-[128px] bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-2 cursor-pointer transition-all custom-shadow dark:shadow-none overflow-hidden relative ${!proofFile ? 'border-rose-200 dark:border-rose-900/50 hover:border-rose-400' : 'border-emerald-200 dark:border-emerald-900/50 hover:border-emerald-400'}`}
            >
              {proofFile ? (
                <div className="w-full h-full relative group p-4 flex flex-col items-center justify-center">
                  {isImage ? (
                    <img src={proofFile.data} alt="Preview" className="w-full h-32 object-cover rounded-2xl" />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                       {isXlsx ? <FileSpreadsheet size={48} className="text-emerald-600 dark:text-emerald-400" /> : <File size={48} className="text-slate-400" />}
                       <span className="text-[10px] font-bold text-slate-900 dark:text-slate-100 truncate max-w-[200px]">{proofFile.name}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                    <span className="text-white text-xs font-semibold uppercase">Change File</span>
                  </div>
                  <button 
                    onClick={removeFile}
                    className="absolute top-4 right-4 bg-red-500 text-white p-1 rounded-full shadow-lg z-20"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex gap-4">
                    <Camera size={32} />
                    <FileSpreadsheet size={32} />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-center px-4">Click to upload Image or Excel</span>
                  <p className="text-[9px] text-slate-400 dark:text-slate-600 font-medium">Please upload valid proof</p>
                </>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-center px-1">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Estimated Reward</span>
              <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">৳{totalAmount.toLocaleString()}</span>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting || !proofFile}
              className="w-full bg-emerald-600 dark:bg-emerald-700 py-5 rounded-2xl text-white font-semibold text-lg shadow-xl shadow-emerald-100 dark:shadow-none active:scale-[0.98] disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:shadow-none transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span className="animate-pulse font-semibold uppercase tracking-widest text-sm">Processing...</span>
              ) : (
                <>
                  <span className="font-semibold uppercase tracking-widest text-sm">{task.buttonText || 'Submit for Approval'}</span>
                  <Send size={20} />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl flex gap-3 transition-colors">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl shrink-0 h-fit">
            <Info className="text-blue-500 dark:text-blue-400" size={18} />
          </div>
          <div>
            <p className="text-blue-900 dark:text-blue-100 font-bold text-[10px] uppercase mb-1 tracking-widest">Important Notice</p>
            <p className="text-blue-800/80 dark:text-blue-300/80 text-[10px] leading-tight font-medium">
              Tasks are typically reviewed within 24 hours. False submissions will lead to permanent account suspension without refund. Supports JPG, PNG, and XLSX files.
            </p>
          </div>
        </div>
      </div>
      
      <div className="h-24"></div>
    </div>
  );
};

export default SubmitTaskScreen;