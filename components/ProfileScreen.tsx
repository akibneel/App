import React from 'react';
import { User, Settings, Shield, LogOut, ChevronRight, Send, Megaphone, Moon, Sun } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileScreenProps {
  userProfile: UserProfile;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  supportTelegram?: string;
  telegramChannel?: string;
  onAdminClick: () => void;
  onSettingsClick: () => void;
  onLogout: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ 
  userProfile, 
  theme,
  onToggleTheme,
  supportTelegram,
  telegramChannel,
  onAdminClick, 
  onSettingsClick, 
  onLogout 
}) => {
  const handleTelegramSupport = () => {
    if (supportTelegram) {
      window.open(`https://t.me/${supportTelegram}`, '_blank');
    }
  };

  const handleTelegramChannel = () => {
    if (telegramChannel) {
      window.open(`https://t.me/${telegramChannel}`, '_blank');
    }
  };

  const isDark = theme === 'dark';

  const menuItems = [
    { icon: <Shield size={18} className="text-blue-500" />, label: 'Admin Dashboard', action: onAdminClick, show: true },
    { icon: <Settings size={18} className="text-slate-500 dark:text-slate-400" />, label: 'Account Settings', action: onSettingsClick, show: true },
    { 
      icon: isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-500" />, 
      label: 'Dark Mode', 
      action: onToggleTheme, 
      show: true,
      isToggle: true
    },
    { 
      icon: <Send size={18} className="text-emerald-500" />, 
      label: 'Telegram Support', 
      action: handleTelegramSupport, 
      show: !!supportTelegram 
    },
    { 
      icon: <Megaphone size={18} className="text-amber-500" />, 
      label: 'Telegram Channel', 
      action: handleTelegramChannel, 
      show: !!telegramChannel 
    },
    { icon: <LogOut size={18} className="text-red-500" />, label: 'Log Out', action: onLogout, show: true, isLast: true },
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="p-6 animate-in slide-in-from-left-10 duration-500">
      <div className="flex flex-col items-center mb-10 mt-8">
        <div className="w-28 h-28 bg-gradient-to-tr from-green-500 to-emerald-400 rounded-[35px] flex items-center justify-center text-white text-4xl font-semibold shadow-xl shadow-green-100 dark:shadow-none mb-4 border-4 border-white dark:border-slate-800">
          {getInitials(userProfile.name)}
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{userProfile.name}</h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: #AP-{userProfile.email.split('@')[0].toUpperCase()}</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl custom-shadow dark:shadow-none overflow-hidden border border-transparent dark:border-slate-800">
        {menuItems.filter(i => i.show).map((item, idx, filteredArr) => (
          <button 
            key={idx}
            onClick={item.action}
            className={`w-full flex items-center gap-4 p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 active:bg-slate-100 dark:active:bg-slate-800 transition-colors text-left ${idx !== filteredArr.length - 1 ? 'border-b border-slate-50 dark:border-slate-800' : ''}`}
          >
            <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-xl">
              {item.icon}
            </div>
            <span className={`flex-1 font-semibold text-sm ${item.isLast ? 'text-red-500' : 'text-slate-700 dark:text-slate-200'}`}>
              {item.label}
            </span>
            {item.isToggle ? (
              <div className={`w-10 h-6 rounded-full relative transition-colors duration-300 ${isDark ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${isDark ? 'translate-x-5' : 'translate-x-1'}`} />
              </div>
            ) : (
              !item.isLast && <ChevronRight size={18} className="text-slate-300 dark:text-slate-600" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-slate-300 dark:text-slate-700 text-[10px] font-medium uppercase tracking-[4px]">Akib Pay v3.1.2</p>
      </div>
      
      <div className="h-24"></div>
    </div>
  );
};

export default ProfileScreen;