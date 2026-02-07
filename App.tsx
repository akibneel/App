
import React, { useState, useEffect } from 'react';
import { Screen, Task, TaskStatus, Transaction, Submission, TutorialConfig, UserProfile, AppAnalytics, AdminCredentials, UserAccount } from './types';
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<Screen>('HOME');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  
  // State for registered users
  const [registeredUsers, setRegisteredUsers] = useState<UserAccount[]>([
    { name: 'Rahat Islam', email: 'rahat@test.com', password: 'password123' }
  ]);

  const [adminCreds, setAdminCreds] = useState<AdminCredentials>({
    username: 'akibneel',
    password: 'Akib@100'
  });

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Guest User',
    email: '',
    phone: '',
    joinDate: 'Oct 2023'
  });

  const [analytics, setAnalytics] = useState<AppAnalytics>({
    totalSignups: 1,
    activeLast72h: 0,
    currentlyOnline: 0,
    tutorialViewsLast72h: 0,
    uninstalls: 0
  });

  const [tutorialConfig, setTutorialConfig] = useState<TutorialConfig>({
    heroVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    supportTelegram: 'TakaEarnSupport',
    telegramChannel: 'TakaEarnOfficial',
    steps: [
      { id: '1', title: 'Complete Profile', desc: 'Ensure your account is verified for higher payouts.', iconType: 'check' },
      { id: '2', title: 'Select a Task', desc: 'Browse daily inventory and choose tasks you like.', iconType: 'book' },
      { id: '3', title: 'Submit Evidence', desc: 'Take screenshots as proof of your work completion.', iconType: 'info' },
      { id: '4', title: 'Request Payout', desc: 'Withdraw your earnings instantly to bKash or Nagad.', iconType: 'star' },
    ]
  });

  const [balance, setBalance] = useState({
    total: 0,
    available: 0, 
    pending: 0
  });
  
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  const [notification, setNotification] = useState<{show: boolean, title: string, body: string} | null>(null);

  const showSmsNotification = (title: string, body: string) => {
    setNotification({ show: true, title, body });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setCurrentScreen('SUBMIT_TASK');
  };

  const handleAddTask = (newTask: Task) => {
    setTasks(prev => [...prev, newTask]);
    showSmsNotification("Task Created", `Successfully added "${newTask.title}" to the dashboard.`);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    showSmsNotification("Task Updated", `Changes to "${updatedTask.title}" have been saved.`);
  };

  const handleDeleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    setTasks(tasks.filter(t => t.id !== taskId));
    showSmsNotification("Task Deleted", `"${task?.title}" has been removed.`);
  };

  const handleSubmitTask = (taskId: string, details: string, amount: number, screenshot?: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const submissionId = `sub-${Date.now()}`;
    const userQuantity = Math.round(amount / task.rate);

    const newSubmission: Submission = {
      id: submissionId,
      userId: 'currentUser',
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
      taskName: task.title,
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      status: TaskStatus.PENDING,
      details: details,
      submissionId: submissionId,
      type: 'EARNING'
    };

    setSubmissions([newSubmission, ...submissions]);
    setTransactions([newTransaction, ...transactions]);
    
    setBalance(prev => {
      const newPending = prev.pending + amount;
      return {
        ...prev,
        pending: newPending,
        total: prev.available + newPending
      };
    });
    
    setCurrentScreen('HOME');
    setSelectedTask(null);

    showSmsNotification(
      "Submission Received",
      `Your submission for "${task.title}" (৳${amount}) has been received. Review will be completed within 24 hours.`
    );
  };

  const handleWithdrawSubmit = (method: string, account: string, amount: number) => {
    const newTransaction: Transaction = {
      id: `wd-${Date.now()}`,
      taskName: `Withdrawal (${method})`,
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      status: TaskStatus.PENDING,
      details: `Account: ${account}`,
      type: 'WITHDRAWAL',
      method
    };

    setTransactions([newTransaction, ...transactions]);
    
    setBalance(prev => {
      const newAvailable = prev.available - amount;
      return {
        ...prev,
        available: newAvailable,
        total: newAvailable + prev.pending
      };
    });
    
    setCurrentScreen('WALLET');
    showSmsNotification("Withdrawal Pending", `৳${amount} withdrawal via ${method} requested. Expected processing time: 1-3 business days.`);
  };

  const handleAdminAction = (submissionId: string, status: TaskStatus, approvedQuantity?: number) => {
    const sub = submissions.find(s => s.id === submissionId);
    if (!sub) return;

    const originalPendingAmount = sub.amount;

    // UPDATE the submission status
    setSubmissions(prev => prev.map(s => {
      if (s.id === submissionId) {
        const finalQuantity = approvedQuantity !== undefined ? approvedQuantity : s.userQuantity;
        return { 
          ...s, 
          status: status, 
          userQuantity: finalQuantity, 
          amount: s.rate * finalQuantity 
        };
      }
      return s;
    }));
    
    setTransactions(prev => prev.map(tx => {
      if (tx.submissionId === submissionId) {
        const finalQuantity = approvedQuantity !== undefined ? approvedQuantity : sub.userQuantity;
        const finalApprovedAmount = sub.rate * finalQuantity;
        return {
          ...tx,
          status: status,
          amount: (status === TaskStatus.APPROVED || status === TaskStatus.RECEIVED) ? finalApprovedAmount : originalPendingAmount
        };
      }
      return tx;
    }));

    // BALANCE LOGIC
    if (status === TaskStatus.RECEIVED) {
      if (approvedQuantity !== undefined) {
        const newAmount = sub.rate * approvedQuantity;
        setBalance(prev => {
          const newPending = prev.pending - originalPendingAmount + newAmount;
          return {
            ...prev,
            pending: newPending,
            total: prev.available + newPending
          };
        });
      }
    } else if (status === TaskStatus.APPROVED) {
      const finalQuantity = approvedQuantity !== undefined ? approvedQuantity : sub.userQuantity;
      const finalApprovedAmount = sub.rate * finalQuantity;

      setBalance(prev => {
        const newPending = prev.pending - originalPendingAmount;
        const newAvailable = prev.available + finalApprovedAmount;
        return {
          available: newAvailable,
          pending: newPending,
          total: newAvailable + newPending
        };
      });
      showSmsNotification("Payout Successful", `Payout of ৳${finalApprovedAmount} for "${sub.taskTitle}" confirmed.`);
    } else if (status === TaskStatus.REJECTED) {
      setBalance(prev => {
        const newPending = prev.pending - originalPendingAmount;
        return {
          ...prev,
          pending: newPending,
          total: prev.available + newPending
        };
      });
    }
  };

  const handleAdminWithdrawAction = (transactionId: string, status: TaskStatus) => {
    const tx = transactions.find(t => t.id === transactionId);
    if (!tx || tx.type !== 'WITHDRAWAL') return;

    setTransactions(prev => prev.map(t => 
      t.id === transactionId ? { ...t, status: status } : t
    ));

    if (status === TaskStatus.REJECTED) {
      setBalance(prev => {
        const newAvailable = prev.available + tx.amount;
        return {
          ...prev,
          available: newAvailable,
          total: newAvailable + prev.pending
        };
      });
    }
  };

  const handleSignup = (userData: UserAccount) => {
    setRegisteredUsers(prev => [...prev, userData]);
    setAnalytics(prev => ({ ...prev, totalSignups: prev.totalSignups + 1 }));
    showSmsNotification("Account Created", "You can now log in with your credentials.");
  };

  const handleLogin = (user: UserAccount) => {
    setUserProfile({
      name: user.name,
      email: user.email,
      phone: '',
      joinDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    });
    setIsLoggedIn(true);
    setCurrentScreen('HOME');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdminAuthenticated(false);
    setCurrentScreen('HOME');
  };

  const handleSaveProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    setCurrentScreen('PROFILE');
    showSmsNotification("Profile Updated", "Your account settings have been saved successfully.");
  };

  const renderScreen = () => {
    if (!isLoggedIn) {
      return (
        <LoginScreen 
          onLogin={handleLogin} 
          onSignup={handleSignup} 
          users={registeredUsers} 
        />
      );
    }

    switch (currentScreen) {
      case 'HOME':
        return <HomeScreen balance={balance} tasks={tasks} onTaskClick={handleTaskClick} userName={userProfile.name} />;
      case 'TUTORIAL':
        return <TutorialScreen config={tutorialConfig} />;
      case 'WALLET':
        return (
          <WalletScreen 
            balance={balance} 
            transactions={transactions} 
            onWithdrawClick={() => setCurrentScreen('WITHDRAW')} 
          />
        );
      case 'WITHDRAW':
        return <WithdrawScreen availableBalance={balance.available} onSubmit={handleWithdrawSubmit} onBack={() => setCurrentScreen('WALLET')} />;
      case 'SUBMIT_TASK':
        return selectedTask ? (
          <SubmitTaskScreen 
            task={selectedTask} 
            onSubmit={handleSubmitTask} 
            onBack={() => setCurrentScreen('HOME')} 
          />
        ) : <HomeScreen balance={balance} tasks={tasks} onTaskClick={handleTaskClick} userName={userProfile.name} />;
      case 'ADMIN':
        if (!isAdminAuthenticated) {
          return (
            <AdminLoginScreen 
              credentials={adminCreds}
              onLoginSuccess={() => setIsAdminAuthenticated(true)} 
              onBack={() => setCurrentScreen('PROFILE')} 
            />
          );
        }
        return (
          <AdminScreen 
            analytics={analytics}
            submissions={submissions} 
            withdrawals={transactions.filter(tx => tx.type === 'WITHDRAWAL' && tx.status === TaskStatus.PENDING)}
            tasks={tasks}
            tutorialConfig={tutorialConfig}
            adminCredentials={adminCreds}
            onUpdateAdminCredentials={setAdminCreds}
            onAction={handleAdminAction} 
            onWithdrawAction={handleAdminWithdrawAction}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onUpdateTutorialConfig={setTutorialConfig}
          />
        );
      case 'PROFILE':
        return (
          <ProfileScreen 
            userProfile={userProfile} 
            supportTelegram={tutorialConfig.supportTelegram} 
            telegramChannel={tutorialConfig.telegramChannel}
            onAdminClick={() => setCurrentScreen('ADMIN')} 
            onSettingsClick={() => setCurrentScreen('ACCOUNT_SETTINGS')} 
            onLogout={handleLogout} 
          />
        );
      case 'ACCOUNT_SETTINGS':
        return <AccountSettingsScreen profile={userProfile} onSave={handleSaveProfile} onBack={() => setCurrentScreen('PROFILE')} />;
      default:
        return <HomeScreen balance={balance} tasks={tasks} onTaskClick={handleTaskClick} userName={userProfile.name} />;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-slate-50 relative overflow-x-hidden shadow-2xl">
      {notification && (
        <div className="fixed top-4 left-4 right-4 z-[100] animate-in slide-in-from-top-10 duration-500">
          <div className="bg-slate-900 rounded-3xl p-4 shadow-2xl border border-white/10 flex items-start gap-4 backdrop-blur-md">
            <div className="bg-emerald-600 p-2 rounded-2xl shrink-0">
              <Bell size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-white font-black text-xs uppercase tracking-widest leading-none">TakaEarn System</h4>
                <span className="text-white/40 text-[9px] font-bold uppercase tracking-tighter">Just Now</span>
              </div>
              <p className="text-white/90 text-[11px] font-bold leading-relaxed pr-2">
                <span className="text-emerald-500 font-black">[{notification.title}]</span> {notification.body}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 pb-24">
        {renderScreen()}
      </div>

      {isLoggedIn && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-200 px-4 py-3 flex justify-between items-center z-50 safe-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <button 
            onClick={() => setCurrentScreen('HOME')}
            className={`flex-1 flex flex-col items-center gap-1 transition-all ${currentScreen === 'HOME' ? 'text-emerald-600 scale-110' : 'text-slate-400'}`}
          >
            <Home size={22} />
            <span className="text-[10px] font-black uppercase tracking-tighter">Home</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('TUTORIAL')}
            className={`flex-1 flex flex-col items-center gap-1 transition-all ${currentScreen === 'TUTORIAL' ? 'text-emerald-600 scale-110' : 'text-slate-400'}`}
          >
            <PlayCircle size={22} />
            <span className="text-[10px] font-black uppercase tracking-tighter">Tutorial</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('WALLET')}
            className={`flex-1 flex flex-col items-center gap-1 transition-all ${currentScreen === 'WALLET' || currentScreen === 'WITHDRAW' ? 'text-emerald-600 scale-110' : 'text-slate-400'}`}
          >
            <Wallet size={22} />
            <span className="text-[10px] font-black uppercase tracking-tighter">Wallet</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('PROFILE')}
            className={`flex-1 flex flex-col items-center gap-1 transition-all ${currentScreen === 'PROFILE' || currentScreen === 'ADMIN' || currentScreen === 'ACCOUNT_SETTINGS' ? 'text-emerald-600 scale-110' : 'text-slate-400'}`}
          >
            <User size={22} />
            <span className="text-[10px] font-black uppercase tracking-tighter">Profile</span>
          </button>
        </nav>
      )}
    </div>
  );
};

export default App;
