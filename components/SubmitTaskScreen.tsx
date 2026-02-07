
import React, { useState, useRef } from 'react';
import { Task } from '../types';
import { ArrowLeft, Camera, Send, Info, X, Image as ImageIcon, PlayCircle } from 'lucide-react';

interface SubmitTaskScreenProps {
  task: Task;
  onSubmit: (taskId: string, details: string, amount: number, screenshot?: string) => void;
  onBack: () => void;
}

const SubmitTaskScreen: React.FC<SubmitTaskScreenProps> = ({ task, onSubmit, onBack }) => {
  const [details, setDetails] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [screenshot, setScreenshot] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const numQuantity = Math.max(1, parseInt(quantity) || 0);
  const totalAmount = task.rate * numQuantity;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeScreenshot = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScreenshot(undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;
    
    setIsSubmitting(true);
    // Simulate API delay
    setTimeout(() => {
      onSubmit(task.id, details, totalAmount, screenshot);
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

  return (
    <div className="min-h-full bg-slate-50 animate-in slide-in-from-bottom-10 duration-500">
      {/* Top Header */}
      <div className="bg-white p-6 flex items-center gap-4 sticky top-0 z-10 border-b border-slate-100">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-slate-800" />
        </button>
        <h2 className="text-xl font-bold text-slate-800">Submit Task</h2>
      </div>

      <div className="p-6">
        {/* Task Info Summary */}
        <div className="bg-white p-6 rounded-3xl custom-shadow mb-8 border border-slate-50">
          <div className="flex items-center gap-4 mb-4">
            <div className={`${task.color} w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-black/5 overflow-hidden`}>
              {renderIcon(task.icon)}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-800">{task.title}</h3>
              <p className="text-green-600 font-bold">Rate: ৳{task.rate} / {getUnitLabel(task.rateType)}</p>
            </div>
          </div>
          
          {task.tutorialUrl && (
            <button 
              onClick={() => window.open(task.tutorialUrl, '_blank')}
              className="w-full mb-4 bg-blue-600 text-white p-4 rounded-2xl font-black text-[11px] uppercase tracking-[2px] flex items-center justify-center gap-3 shadow-xl shadow-blue-100 active:scale-95 transition-all"
            >
              <PlayCircle size={20} /> How to complete this task?
            </button>
          )}

          <div className="bg-slate-50 p-4 rounded-2xl">
            <p className="text-slate-600 text-sm leading-relaxed">
              {task.description || "Earn rewards by completing this daily task. Follow instructions carefully to avoid rejection."}
            </p>
          </div>
        </div>

        {/* Submission Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-slate-800 font-bold mb-2 text-sm ml-1">Submit Your Details</label>
            <textarea 
              placeholder="Enter ID / Username / Link here (Separate multiple with commas)..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
              className="w-full bg-white p-4 rounded-2xl border-2 border-slate-100 focus:border-green-500 focus:outline-none transition-all custom-shadow resize-none text-black font-medium"
              required
            />
            <p className="text-slate-400 text-[10px] mt-2 ml-1 flex items-center gap-1">
              <Info size={12} /> Double check your submission before hitting the button.
            </p>
          </div>

          <div>
            <label className="block text-slate-800 font-bold mb-2 text-sm ml-1">
              Quantity ({getUnitLabel(task.rateType)})
            </label>
            <input 
              type="number" 
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              max={task.limit - task.completed}
              className="w-full bg-white p-4 rounded-2xl border-2 border-slate-100 focus:border-green-500 focus:outline-none transition-all custom-shadow text-black font-bold"
            />
          </div>

          <div>
            <label className="block text-slate-800 font-bold mb-2 text-sm ml-1">Upload Screenshot (Optional)</label>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full min-h-[128px] bg-white rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-2 cursor-pointer hover:border-green-300 hover:text-green-500 transition-all custom-shadow overflow-hidden relative"
            >
              {screenshot ? (
                <div className="w-full h-full relative group p-2">
                  <img src={screenshot} alt="Preview" className="w-full h-32 object-cover rounded-2xl" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                    <span className="text-white text-xs font-black uppercase">Change Image</span>
                  </div>
                  <button 
                    onClick={removeScreenshot}
                    className="absolute top-4 right-4 bg-red-500 text-white p-1 rounded-full shadow-lg"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <Camera size={32} />
                  <span className="text-xs font-bold uppercase tracking-widest">Click to upload image</span>
                </>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div className="flex justify-between items-center px-1">
              <span className="text-slate-500 font-medium">Estimated Reward</span>
              <span className="text-2xl font-black text-slate-800">৳{totalAmount.toLocaleString()}</span>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting || !details.trim()}
              className="w-full bg-green-600 py-5 rounded-2xl text-white font-bold text-lg shadow-xl shadow-green-100 active:scale-[0.98] disabled:bg-slate-300 disabled:shadow-none transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span className="animate-pulse font-black uppercase tracking-widest text-sm">Processing...</span>
              ) : (
                <>
                  <span className="font-black uppercase tracking-widest text-sm">{task.buttonText || 'Submit for Approval'}</span>
                  <Send size={20} />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3">
          <Info className="text-blue-500 shrink-0" size={20} />
          <div>
            <p className="text-blue-900 font-bold text-xs uppercase mb-1">Important Notice</p>
            <p className="text-blue-800/80 text-[10px] leading-tight font-medium">
              Tasks are typically reviewed within 24 hours. False submissions will lead to permanent account suspension without refund.
            </p>
          </div>
        </div>
      </div>
      
      <div className="h-24"></div>
    </div>
  );
};

export default SubmitTaskScreen;
