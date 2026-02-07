import React, { useState, useEffect } from 'react';
import { Screen, Task, TaskStatus, Transaction, Submission, TutorialConfig, UserProfile, AppAnalytics, AdminCredentials, UserAccount, UserBalance, AppConfig } from './types';
import { MOCK_TASKS } from './constants';
import HomeScreen from './components/HomeScreen';
import WalletScreen from './components/WalletScreen';
import SubmitTaskScreen from './components/SubmitTaskScreen';
import WithdrawScreen from './components/WithdrawScreen';
import AdminScreen from './components/AdminScreen';
import AdminLoginScreen from './components/AdminLoginScreen';
import ProfileScreen from './components/ProfileScreen';
import LoginScreen from './components/LoginScreen';
import TutorialScreen from './components/TutorialScreen';
import AccountSettingsScreen from './components/AccountSettingsScreen';
import { Home, Wallet, User, Bell, PlayCircle } from 'lucide-react';

const App: React.FC = () => {
  // STORAGE KEYS
  const STORAGE_KEY_USERS = 'akibpay_users';
  const STORAGE_KEY_TASKS = 'akibpay_tasks';
  const STORAGE_KEY_BALANCES = 'akibpay_user_balances';
  const STORAGE_KEY_SUBMISSIONS = 'akibpay_submissions';
  const STORAGE_KEY_TRANSACTIONS = 'akibpay_transactions';
  const STORAGE_KEY_TUTORIAL = 'akibpay_tutorial_config';
  const STORAGE_KEY_CONFIG = 'akibpay_app_config';
  const STORAGE_KEY_CURRENT_USER = 'akibpay_current_session';
  const STORAGE_KEY_THEME = 'akibpay_theme';

  const COOLDOWN_HOURS = 12;
  const COOLDOWN_MS = COOLDOWN_HOURS * 60 * 60 * 1000;

  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    return (saved as 'light' | 'dark') || 'light';
  });

  // Sync theme with document element for global Tailwind support
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Initialize state from local storage or defaults
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_CURRENT_USER) !== null;
  });
  
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<Screen>('HOME');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [registeredUsers, setRegisteredUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USERS);
    return saved ? JSON.parse(saved) : [{ name: 'Rahat Islam', email: 'rahat@test.com', password: 'password123', failedAttempts: 0 }];
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TASKS);
    return saved ? JSON.parse(saved) : MOCK_TASKS;
  });

  const [userBalances, setUserBalances] = useState<Record<string, UserBalance>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_BALANCES);
    return saved ? JSON.parse(saved) : {};
  });

  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SUBMISSIONS);
    return saved ? JSON.parse(saved) : [];
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
    return saved ? JSON.parse(saved) : [];
  });

  const [appConfig, setAppConfig] = useState<AppConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
    const defaultConfig: AppConfig = {
      minWithdrawal: 20,
      withdrawalMethods: [
        { id: 'bKash', name: 'bKash', icon: 'https://freelogopng.com/images/all_img/1656234745bkash-app-logo.png', color: 'border-[#D12053]', activeBg: 'bg-[#D12053]/5' },
        { id: 'Nagad', name: 'Nagad', icon: 'https://freelogopng.com/images/all_img/1656234832nagad-logo-png.png', color: 'border-[#F7941D]', activeBg: 'bg-[#F7941D]/5' },
        { id: 'Rocket', name: 'Rocket', icon: 'https://freelogopng.com/images/all_img/1656234907rocket-logo-png.png', color: 'border-[#8C3494]', activeBg: 'bg-[#8C3494]/5' },
        { id: 'Binance', name: 'Binance', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Binance_logo.svg/1024px-Binance_logo.svg.png', color: 'border-[#F3BA2F]', activeBg: 'bg-[#F3BA2F]/5' },
      ]
    };
    return saved ? JSON.parse(saved) : defaultConfig;
  });

  const [tutorialConfig, setTutorialConfig] = useState<TutorialConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TUTORIAL);
    const defaultTutorial = {
      heroVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      supportTelegram: 'AkibPaySupport',
      telegramChannel: 'AkibPayOfficial',
      steps: [
        { id: '1', title: 'Complete Profile', desc: 'Ensure your account is verified for higher payouts.', icon: '👤' },
        { id: '2', title: 'Select a Task', desc: 'Browse daily inventory and choose tasks you like.', icon: '📋' },
        { id: '3', title: 'Submit Evidence', desc: 'Take screenshots as proof of your work completion.', icon: '🖼️' },
        { id: '4', title: 'Request Payout', desc: 'Withdraw your earnings instantly to bKash or Nagad.', icon: '💸' },
      ]
    };
    return saved ? JSON.parse(saved) : defaultTutorial;
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const savedSession = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
    if (savedSession) {
      const user = JSON.parse(savedSession);
      return {
        name: user.name,
        email: user.email,
        phone: '',
        joinDate: 'Oct 2023'
      };
    }
    return {
      name: 'Guest User',
      email: '',
      phone: '',
      joinDate: 'Oct 2023'
    };
  });

  const activeBalance = userBalances[userProfile.email] || { total: 0, available: 0, pending: 0 };

  useEffect(() => localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(registeredUsers)), [registeredUsers]);
  useEffect(() => localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks)), [tasks]);
  useEffect(() => localStorage.setItem(STORAGE_KEY_BALANCES, JSON.stringify(userBalances)), [userBalances]);
  useEffect(() => localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(submissions)), [submissions]);
  useEffect(() => localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions)), [transactions]);
  useEffect(() => localStorage.setItem(STORAGE_KEY_TUTORIAL, JSON.stringify(tutorialConfig)), [tutorialConfig]);
  useEffect(() => localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(appConfig)), [appConfig]);

  const [adminCreds, setAdminCreds] = useState<AdminCredentials>({
    username: 'akibneel',
    password: 'Akib@100'
  });

  const [analytics, setAnalytics] = useState<AppAnalytics>({
    totalSignups: registeredUsers.length,
    activeLast72h: 0,
    currentlyOnline: 0,
    tutorialViewsLast72h: 0,
    uninstalls: 0
  });

  // Calculate real analytics based on actual app state
  useEffect(() => {
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - (72 * 60 * 60 * 1000));
    
    // Count unique emails that have made a submission in the last 72 hours
    const activeUserEmails = new Set(
      submissions
        .filter(s => new Date(s.timestamp) > threeDaysAgo)
        .map(s => s.userEmail)
    );

    setAnalytics(prev => ({
      ...prev,
      totalSignups: registeredUsers.length,
      activeLast72h: activeUserEmails.size,
      currentlyOnline: isLoggedIn ? 1 : 0 // Simplified: only the current user is tracked as online locally
    }));
  }, [registeredUsers, submissions, isLoggedIn]);

  const [notification, setNotification] = useState<{show: boolean, title: string, body: string} | null>(null);

  const showSmsNotification = (title: string, body: string) => {
    setNotification({ show: true, title, body });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleNotificationIconClick = () => {
    showSmsNotification("Notifications", "You have no new notifications at this time.");
  };

  const getTaskCooldown = (taskId: string) => {
    const userSubmissions = submissions.filter(s => s.userEmail === userProfile.email && s.taskId === taskId);
    if (userSubmissions.length === 0) return null;

    const lastSub = userSubmissions.reduce((latest, current) => {
      return new Date(current.timestamp).getTime() > new Date(latest.timestamp).getTime() ? current : latest;
    });

    const lastTime = new Date(lastSub.timestamp).getTime();
    const currentTime = Date.now();
    const diff = currentTime - lastTime;

    if (diff < COOLDOWN_MS) {
      return COOLDOWN_MS - diff; // Remaining time in MS
    }
    return null;
  };

  const handleAuthAttempt = (email: string, password?: string): { success: boolean, error?: string, user?: UserAccount } => {
    const emailLower = email.toLowerCase().trim();
    const user = registeredUsers.find(u => u.email.toLowerCase().trim() === emailLower);

    if (!user) {
      return { success: false, error: 'Account not found.' };
    }

    // Check Lockout
    if (user.lockoutUntil) {
      const lockoutTime = new Date(user.lockoutUntil).getTime();
      const now = Date.now();
      if (now < lockoutTime) {
        const remainingMinutes = Math.ceil((lockoutTime - now) / 60000);
        return { success: false, error: `Access restricted. Try again after ${remainingMinutes} minutes.` };
      }
    }

    // If password not provided, we just checked existence/lockout
    if (password === undefined) return { success: true, user };

    // Check Password
    if (user.password === password) {
      // Success: Reset failures
      const updatedUsers = registeredUsers.map(u => 
        u.email === user.email ? { ...u, failedAttempts: 0, lockoutUntil: undefined } : u
      );
      setRegisteredUsers(updatedUsers);
      return { success: true, user };
    } else {
      // Failure: Increment and check lockout
      const newFailCount = (user.failedAttempts || 0) + 1;
      let lockoutUntil: string | undefined = undefined;
      let error = 'Invalid password.';

      if (newFailCount >= 3) {
        lockoutUntil = new Date(Date.now() + 3600000).toISOString(); // 1 hour
        error = 'Too many failed attempts. Access restricted for 1 hour.';
      }

      const updatedUsers = registeredUsers.map(u => 
        u.email === user.email ? { ...u, failedAttempts: newFailCount, lockoutUntil } : u
      );
      setRegisteredUsers(updatedUsers);
      return { success: false, error };
    }
  };

  const handleTaskClick = (task: Task) => {
    const cooldownRemaining = getTaskCooldown(task.id);
    if (cooldownRemaining !== null) {
      const remainingMinutes = Math.ceil(cooldownRemaining / 60000);
      const hours = Math.floor(remainingMinutes / 60);
      const mins = remainingMinutes % 60;
      showSmsNotification("Task Restricted", `You can submit this task again in ${hours}h ${mins}m.`);
      return;
    }
    setSelectedTask(task);
    setCurrentScreen('SUBMIT_TASK');
  };

  const handleAddTask = (newTask: Task) => {
    setTasks(prev => [...prev, newTask]);
    showSmsNotification("Task Created", `Successfully added "${newTask.title}".`);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    showSmsNotification("Task Updated", `Changes to "${updatedTask.title}" saved.`);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
    showSmsNotification("Task Removed", "Task deleted from inventory.");
  };

  const handleSubmitTask = (taskId: string, details: string, amount: number, screenshot?: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const submissionId = `sub-${Date.now()}`;
    const userQuantity = Math.round(amount / task.rate);

    const newSubmission: Submission = {
      id: submissionId,
      userId: 'currentUser',
      userEmail: userProfile.email,
      userName: userProfile.name,
      taskId: task.id,
      taskTitle: task.title,
      rate: task.rate,
      rateType: task.rateType,
      userQuantity: userQuantity,
      amount: amount,
      details,
      screenshot,
      status: TaskStatus.PENDING,
      timestamp: new Date().toISOString()
    };

    const newTransaction: Transaction = {
      id: `tr-${Date.now()}`,
      userEmail: userProfile.email,
      taskName: task.title,
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      status: TaskStatus.PENDING,
      details: details,
      type: 'EARNING'
    };

    setSubmissions(prev => [newSubmission, ...prev]);
    setTransactions(prev => [newTransaction, ...prev]);
    
    setUserBalances(prev => {
      const current = prev[userProfile.email] || { total: 0, available: 0, pending: 0 };
      return { ...prev, [userProfile.email]: { ...current, pending: current.pending + amount } };
    });

    showSmsNotification("Submission Received", "Your task is under review.");
    setCurrentScreen('HOME');
  };

  const handleLogin = (user: UserAccount) => {
    const sessionUser = { name: user.name, email: user.email };
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(sessionUser));
    setUserProfile({ name: user.name, email: user.email, phone: '', joinDate: 'Oct 2023' });
    setIsLoggedIn(true);
    setCurrentScreen('HOME');
  };

  const handleSignup = (user: UserAccount) => {
    setRegisteredUsers(prev => [...prev, { ...user, failedAttempts: 0 }]);
    showSmsNotification("Welcome!", "Account created successfully.");
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
    setIsLoggedIn(false);
    setIsAdminAuthenticated(false);
    setCurrentScreen('HOME');
    setUserProfile({ name: 'Guest User', email: '', phone: '', joinDate: 'Oct 2023' });
  };

  const handleAdminAction = (id: string, status: TaskStatus, approvedQuantity?: number) => {
    const sub = submissions.find(s => s.id === id);
    if (!sub) return;

    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status, userQuantity: approvedQuantity ?? s.userQuantity } : s));
    setTransactions(prev => prev.map(tx => (tx.userEmail === sub.userEmail && tx.taskName === sub.taskTitle && tx.status === TaskStatus.PENDING) ? { ...tx, status, amount: approvedQuantity ? approvedQuantity * sub.rate : tx.amount } : tx));

    if (status === TaskStatus.APPROVED) {
        const finalAmount = approvedQuantity ? approvedQuantity * sub.rate : sub.amount;
        setUserBalances(prev => {
            const current = prev[sub.userEmail] || { total: 0, available: 0, pending: 0 };
            return {
                ...prev,
                [sub.userEmail]: {
                    total: current.total + finalAmount,
                    available: current.available + finalAmount,
                    pending: Math.max(0, current.pending - sub.amount)
                }
            };
        });
    } else if (status === TaskStatus.REJECTED) {
        setUserBalances(prev => {
            const current = prev[sub.userEmail] || { total: 0, available: 0, pending: 0 };
            return { ...prev, [sub.userEmail]: { ...current, pending: Math.max(0, current.pending - sub.amount) } };
        });
    }
  };

  const handleWithdrawAction = (id: string, status: TaskStatus) => {
    setTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, status } : tx));
  };

  const handleWithdrawSubmit = (method: string, account: string, amount: number) => {
    const newTx: Transaction = {
      id: `wd-${Date.now()}`,
      userEmail: userProfile.email,
      taskName: 'Withdrawal Request',
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      status: TaskStatus.PENDING,
      details: `Account: ${account}`,
      type: 'WITHDRAWAL',
      method: method
    };

    setTransactions(prev => [newTx, ...prev]);
    setUserBalances(prev => {
      const current = prev[userProfile.email];
      return { ...prev, [userProfile.email]: { ...current, available: current.available - amount } };
    });

    showSmsNotification("Withdrawal Requested", `Payout of ৳${amount} processing.`);
    setCurrentScreen('HOME');
  };

  const handleSaveProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    // Sync to session storage too if needed
    const savedSession = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
    if (savedSession) {
      const session = JSON.parse(savedSession);
      localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify({ ...session, name: profile.name }));
    }
    showSmsNotification("Profile Updated", "Changes saved.");
    setCurrentScreen('PROFILE');
  };

  const renderScreen = () => {
    if (!isLoggedIn) return <LoginScreen onLogin={handleLogin} onSignup={handleSignup} onAuthAttempt={handleAuthAttempt} />;
    
    // Updated Logic: Use explicitly currentScreen to prevent fall-through during state transitions
    if (currentScreen === 'ADMIN_LOGIN' && !isAdminAuthenticated) {
      return <AdminLoginScreen 
        credentials={adminCreds} 
        onLoginSuccess={() => {
          setIsAdminAuthenticated(true);
          setCurrentScreen('ADMIN'); // CRITICAL: Transition to ADMIN screen upon success
        }} 
        onBack={() => setCurrentScreen('PROFILE')} 
      />;
    }
    
    if (isAdminAuthenticated && currentScreen === 'ADMIN') {
      return (
        <AdminScreen 
          analytics={analytics} submissions={submissions} withdrawals={transactions.filter(t => t.type === 'WITHDRAWAL')} tasks={tasks}
          tutorialConfig={tutorialConfig} appConfig={appConfig} adminCredentials={adminCreds} onUpdateAdminCredentials={setAdminCreds}
          onAction={handleAdminAction} onWithdrawAction={handleWithdrawAction} onAddTask={handleAddTask} onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask} onUpdateTutorialConfig={setTutorialConfig} onUpdateAppConfig={setAppConfig}
          onBack={() => setCurrentScreen('PROFILE')}
        />
      );
    }

    switch (currentScreen) {
      case 'HOME': return <HomeScreen balance={activeBalance} tasks={tasks} onTaskClick={handleTaskClick} onNotificationClick={handleNotificationIconClick} userName={userProfile.name} getTaskCooldown={getTaskCooldown} isAdminAuthenticated={isAdminAuthenticated} onUpdateTask={handleUpdateTask} />;
      case 'WALLET': return <WalletScreen balance={activeBalance} appConfig={appConfig} transactions={transactions.filter(t => t.userEmail === userProfile.email)} onWithdrawClick={() => setCurrentScreen('WITHDRAW')} />;
      case 'SUBMIT_TASK': return selectedTask ? <SubmitTaskScreen task={selectedTask} onSubmit={handleSubmitTask} onBack={() => setCurrentScreen('HOME')} /> : <HomeScreen balance={activeBalance} tasks={tasks} onTaskClick={handleTaskClick} onNotificationClick={handleNotificationIconClick} userName={userProfile.name} getTaskCooldown={getTaskCooldown} isAdminAuthenticated={isAdminAuthenticated} onUpdateTask={handleUpdateTask} />;
      case 'WITHDRAW': return <WithdrawScreen availableBalance={activeBalance.available} appConfig={appConfig} onSubmit={handleWithdrawSubmit} onBack={() => setCurrentScreen('WALLET')} />;
      case 'PROFILE': return <ProfileScreen userProfile={userProfile} theme={theme} onToggleTheme={toggleTheme} supportTelegram={tutorialConfig.supportTelegram} telegramChannel={tutorialConfig.telegramChannel} onAdminClick={() => isAdminAuthenticated ? setCurrentScreen('ADMIN') : setCurrentScreen('ADMIN_LOGIN')} onSettingsClick={() => setCurrentScreen('ACCOUNT_SETTINGS')} onLogout={handleLogout} />;
      case 'TUTORIAL': return <TutorialScreen config={tutorialConfig} />;
      case 'ACCOUNT_SETTINGS': return <AccountSettingsScreen profile={userProfile} onSave={handleSaveProfile} onBack={() => setCurrentScreen('PROFILE')} />;
      default: return <HomeScreen balance={activeBalance} tasks={tasks} onTaskClick={handleTaskClick} onNotificationClick={handleNotificationIconClick} userName={userProfile.name} getTaskCooldown={getTaskCooldown} isAdminAuthenticated={isAdminAuthenticated} onUpdateTask={handleUpdateTask} />;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-slate-50 dark:bg-slate-950 min-h-screen shadow-2xl relative flex flex-col font-sans transition-colors duration-300">
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-[200] animate-in slide-in-from-top-4 duration-500">
          <div className="bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl flex gap-4 items-start transition-colors">
            <div className="bg-emerald-50 dark:bg-emerald-900/30 p-2 rounded-xl text-white shadow-lg shadow-emerald-500/20 transition-colors"><Bell size={18} /></div>
            <div>
                <h4 className="text-[11px] font-semibold text-white uppercase tracking-widest">{notification.title}</h4>
                <p className="text-[10px] text-white/60 dark:text-white/80 font-medium leading-tight mt-1 transition-colors">{notification.body}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto no-scrollbar">{renderScreen()}</div>

      {isLoggedIn && currentScreen !== 'SUBMIT_TASK' && currentScreen !== 'WITHDRAW' && currentScreen !== 'ADMIN' && currentScreen !== 'ADMIN_LOGIN' && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 px-6 py-4 flex justify-between items-center z-50 transition-colors">
          <button onClick={() => setCurrentScreen('HOME')} className={`flex flex-col items-center gap-1 transition-all ${currentScreen === 'HOME' ? 'text-emerald-600 scale-110' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}>
            <Home size={22} /><span className="text-[8px] font-semibold uppercase tracking-tighter">Tasks</span>
          </button>
          <button onClick={() => setCurrentScreen('WALLET')} className={`flex flex-col items-center gap-1 transition-all ${currentScreen === 'WALLET' ? 'text-emerald-600 scale-110' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}>
            <Wallet size={22} /><span className="text-[8px] font-semibold uppercase tracking-tighter">Wallet</span>
          </button>
          <button onClick={() => setCurrentScreen('TUTORIAL')} className={`flex flex-col items-center gap-1 transition-all ${currentScreen === 'TUTORIAL' ? 'text-emerald-600 scale-110' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}>
            <PlayCircle size={22} /><span className="text-[8px] font-semibold uppercase tracking-tighter">Learn</span>
          </button>
          <button onClick={() => setCurrentScreen('PROFILE')} className={`flex flex-col items-center gap-1 transition-all ${currentScreen === 'PROFILE' ? 'text-emerald-600 scale-110' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}>
            <User size={22} /><span className="text-[8px] font-semibold uppercase tracking-tighter">Profile</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default App;