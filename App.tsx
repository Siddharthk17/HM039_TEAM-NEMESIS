import React, { useState, useEffect, useRef } from 'react';
import { StorageService } from './services/storageService';
import { UserProfile, WindowState, WorkspaceType, WidgetType } from './types';
import { Sidebar } from './components/Sidebar';
import { Button, Input } from './components/UIComponents';
import { WindowFrame } from './components/WindowFrame';
import { Terminal, Grid, Lock, Unlock } from 'lucide-react';
import * as ReactGridLayout from 'react-grid-layout';
import { auth } from './services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

// Import Widgets
import * as Widgets from './components/WidgetRegistry';

// Workaround for: Module '"react-grid-layout"' has no exported member 'WidthProvider'.
const { Responsive, WidthProvider } = ReactGridLayout as any;
const ResponsiveGridLayout = WidthProvider(Responsive);

// --- DEFAULT LAYOUT CONFIGURATION ---
const DEFAULT_WINDOWS: WindowState[] = [
  // --- DASHBOARD WORKSPACE ---
  { 
    id: 'win-wallet', title: 'WALLET', componentType: 'wallet', workspace: 'dashboard', 
    isOpen: true, isMinimized: false, isMaximized: false, 
    layout: { i: 'win-wallet', x: 0, y: 0, w: 3, h: 4, minW: 2, minH: 3 }
  },
  { 
    id: 'win-habits-stat', title: 'HABIT_STATS', componentType: 'habit-stats', workspace: 'dashboard', 
    isOpen: true, isMinimized: false, isMaximized: false, 
    layout: { i: 'win-habits-stat', x: 3, y: 0, w: 3, h: 4, minW: 2, minH: 3 }
  },
  { 
    id: 'win-mood-stat', title: 'MOOD_LOG', componentType: 'mood-stats', workspace: 'dashboard', 
    isOpen: true, isMinimized: false, isMaximized: false, 
    layout: { i: 'win-mood-stat', x: 6, y: 0, w: 3, h: 4, minW: 2, minH: 3 }
  },
  { 
    id: 'win-wellness', title: 'WELLNESS_CHECK', componentType: 'wellness-checklist', workspace: 'dashboard', 
    isOpen: true, isMinimized: false, isMaximized: false, 
    layout: { i: 'win-wellness', x: 9, y: 0, w: 3, h: 6, minW: 2, minH: 4 }
  },
  { 
    id: 'win-chart', title: 'CASHFLOW_ANALYSIS', componentType: 'chart', workspace: 'dashboard', 
    isOpen: true, isMinimized: false, isMaximized: false, 
    layout: { i: 'win-chart', x: 0, y: 4, w: 6, h: 6, minW: 4, minH: 5 }
  },
  { 
    id: 'win-recent-tx', title: 'RECENT_TX', componentType: 'recent-transactions', workspace: 'dashboard', 
    isOpen: true, isMinimized: false, isMaximized: false, 
    layout: { i: 'win-recent-tx', x: 6, y: 4, w: 3, h: 6, minW: 2, minH: 4 }
  },
  { 
    id: 'win-quote', title: 'DAILY_STOIC', componentType: 'quote', workspace: 'dashboard', 
    isOpen: true, isMinimized: false, isMaximized: false, 
    layout: { i: 'win-quote', x: 0, y: 10, w: 3, h: 3, minW: 2, minH: 2 }
  },
  { 
    id: 'win-breathing', title: 'RESONANCE_BREATH', componentType: 'breathing', workspace: 'dashboard', 
    isOpen: true, isMinimized: false, isMaximized: false, 
    layout: { i: 'win-breathing', x: 0, y: 13, w: 3, h: 3, minW: 2, minH: 2 }
  },
  { 
    id: 'win-hydration', title: 'HYDRATION_LEVEL', componentType: 'hydration', workspace: 'dashboard', 
    isOpen: true, isMinimized: false, isMaximized: false, 
    layout: { i: 'win-hydration', x: 3, y: 14, w: 3, h: 3, minW: 2, minH: 2 }
  },
  { 
    id: 'win-tasks', title: 'ACTIVE_TASKS', componentType: 'tasks', workspace: 'dashboard', 
    isOpen: true, isMinimized: false, isMaximized: false, 
    layout: { i: 'win-tasks', x: 9, y: 6, w: 3, h: 8, minW: 2, minH: 5 }
  },
  { 
    id: 'win-timer', title: 'FOCUS_TIMER', componentType: 'timer', workspace: 'dashboard', 
    isOpen: true, isMinimized: false, isMaximized: false, 
    layout: { i: 'win-timer', x: 3, y: 10, w: 6, h: 4, minW: 2, minH: 3 }
  },
  
  // --- FINANCE WORKSPACE ---
  { 
    id: 'win-fin-form', title: 'ADD_ENTRY', componentType: 'finance-form', workspace: 'finance', 
    isOpen: true, isMinimized: false, isMaximized: false, 
    layout: { i: 'win-fin-form', x: 0, y: 0, w: 4, h: 8, minW: 3, minH: 6 }
  },
  { 
    id: 'win-expense-breakdown', title: 'EXPENSE_MATRIX', componentType: 'expense-breakdown', workspace: 'finance', 
    isOpen: true, isMinimized: false, isMaximized: false, 
    layout: { i: 'win-expense-breakdown', x: 0, y: 8, w: 4, h: 6, minW: 3, minH: 4 }
  },
  { 
    id: 'win-fin-table', title: 'LEDGER.CSV', componentType: 'finance-table', workspace: 'finance', 
    isOpen: true, isMinimized: false, isMaximized: false, 
    layout: { i: 'win-fin-table', x: 4, y: 0, w: 8, h: 10, minW: 4, minH: 6 }
  },
  { 
    id: 'win-savings', title: 'SAVINGS_TARGET', componentType: 'savings-goal', workspace: 'finance', 
    isOpen: true, isMinimized: false, isMaximized: false, 
    layout: { i: 'win-savings', x: 4, y: 10, w: 4, h: 4, minW: 3, minH: 3 }
  },
  { 
    id: 'win-subs', title: 'RECURRING_SUBS', componentType: 'subscriptions', workspace: 'finance', 
    isOpen: true, isMinimized: false, isMaximized: false, 
    layout: { i: 'win-subs', x: 8, y: 10, w: 4, h: 4, minW: 4, minH: 3 }
  },
  { 
  id: 'win-overall-matrix', 
  title: 'FINANCE_OVERVIEW', 
  componentType: 'overall-finance-matrix', 
  workspace: 'finance', 
  isOpen: true, 
  isMinimized: false, 
  isMaximized: false, 
  layout: { i: 'win-overall-matrix', x: 0, y: 14, w: 12, h: 6, minW: 6, minH: 4 }
  },

  // --- JOURNAL WORKSPACE ---
  { 
    id: 'win-jou-editor', title: 'VIM_BUFFER', componentType: 'journal-editor', workspace: 'journal', 
    isOpen: true, isMinimized: false, isMaximized: false, 
    layout: { i: 'win-jou-editor', x: 0, y: 0, w: 7, h: 12, minW: 4, minH: 8 }
  },
  { 
    id: 'win-jou-hist', title: 'HISTORY', componentType: 'journal-history', workspace: 'journal', 
    isOpen: true, isMinimized: false, isMaximized: false, 
    layout: { i: 'win-jou-hist', x: 7, y: 0, w: 5, h: 8, minW: 3, minH: 4 }
  },
  { 
    id: 'win-mood-trend', title: 'MOOD_TREND', componentType: 'mood-trend', workspace: 'journal', 
    isOpen: true, isMinimized: false, isMaximized: false, 
    layout: { i: 'win-mood-trend', x: 7, y: 8, w: 5, h: 4, minW: 3, minH: 3 }
  },
  { 
    id: 'win-gratitude', title: 'GRATITUDE_LOG', componentType: 'gratitude-log', workspace: 'journal', 
    isOpen: true, isMinimized: false, isMaximized: false, 
    layout: { i: 'win-gratitude', x: 0, y: 12, w: 12, h: 4, minW: 3, minH: 3 }
  },

  // --- HABITS WORKSPACE ---
  { 
    id: 'win-hab-form', title: 'PROCESS_MANAGER', componentType: 'habit-form', workspace: 'habits', 
    isOpen: true, isMinimized: false, isMaximized: false, 
    layout: { i: 'win-hab-form', x: 0, y: 0, w: 12, h: 4, minW: 6, minH: 3 }
  },
  { 
    id: 'win-hab-heatmap', title: 'CONSISTENCY_GRID', componentType: 'habit-heatmap', workspace: 'habits', 
    isOpen: true, isMinimized: false, isMaximized: false, 
    layout: { i: 'win-hab-heatmap', x: 0, y: 4, w: 12, h: 3, minW: 6, minH: 3 }
  },
  { 
    id: 'win-hab-list', title: 'ACTIVE_PROTOCOLS', componentType: 'habit-list', workspace: 'habits', 
    isOpen: true, isMinimized: false, isMaximized: false, 
    layout: { i: 'win-hab-list', x: 0, y: 7, w: 12, h: 7, minW: 6, minH: 5 }
  },

  // --- INSIGHTS WORKSPACE ---
  { 
    id: 'win-insights', title: 'AI_CORE.PY', componentType: 'ai-insights', workspace: 'insights', 
    isOpen: true, isMinimized: false, isMaximized: false, 
    layout: { i: 'win-insights', x: 0, y: 0, w: 12, h: 12, minW: 6, minH: 8 }
  },

  // --- SETTINGS WORKSPACE ---
  { 
    id: 'win-settings', title: 'SYSTEM_CONFIG', componentType: 'settings', workspace: 'settings', 
    isOpen: true, isMinimized: false, isMaximized: false, 
    layout: { i: 'win-settings', x: 0, y: 0, w: 12, h: 14, minW: 6, minH: 8 }
  },
];

const App: React.FC = () => {
  const [user, setUser] = useState<any | null>(null);
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceType>('dashboard');
  const [windows, setWindows] = useState<WindowState[]>(DEFAULT_WINDOWS);
  const [isEditing, setIsEditing] = useState(false); 
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
  
  // Ref for workspace container to calculate precise width
  const workspaceRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1200);

  // Auth State
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [authError, setAuthError] = useState('');

  const applyTheme = (theme: string) => {
    document.body.classList.remove('theme-aura', 'theme-memento', 'theme-tokyo');
    if (theme === 'aura') document.body.classList.add('theme-aura');
    if (theme === 'memento') document.body.classList.add('theme-memento');
    if (theme === 'tokyo') document.body.classList.add('theme-tokyo');
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
    }, 10000); // Update every 10 seconds
    
    return () => clearInterval(timer);
  }, []);

useEffect(() => {
  let unsubscribeLayout: (() => void) | null = null;
  let unsubscribeSettings: (() => void) | null = null;

  const unsubscribeAuth = auth.onAuthStateChanged((firebaseUser) => {
    if (firebaseUser) {
      setUser(firebaseUser);

      // Check & reset streaks
      StorageService.checkAndResetStreaks(firebaseUser.uid);

      // Sync Layout
      unsubscribeLayout = StorageService.subscribeToLayout(
        firebaseUser.uid,
        (layout) => {
          if (layout) setWindows(layout);
        }
      );

      // Sync Theme
      unsubscribeSettings = StorageService.subscribeToSettings(
        firebaseUser.uid,
        (data) => {
          applyTheme(data.theme);
        }
      );
    } else {
      setUser(null);
      setWindows(DEFAULT_WINDOWS);

      // Cleanup when logged out
      unsubscribeLayout?.();
      unsubscribeSettings?.();
      unsubscribeLayout = null;
      unsubscribeSettings = null;
    }
  });

  return () => {
    // Cleanup on component unmount
    unsubscribeAuth();
    unsubscribeLayout?.();
    unsubscribeSettings?.();
  };
}, []);

  // Update Grid Width on Resize
  useEffect(() => {
    if (!workspaceRef.current) return;
    const observer = new ResizeObserver((entries) => {
       for (let entry of entries) {
         setContainerWidth(entry.contentRect.width);
       }
    });
    observer.observe(workspaceRef.current);
    return () => observer.disconnect();
  }, [mobileMenuOpen]); // Re-measure if menu toggles

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
       if (authMode === 'login') {
          await signInWithEmailAndPassword(auth, authEmail, authPass);
       } else {
          await createUserWithEmailAndPassword(auth, authEmail, authPass);
       }
    } catch (err: any) {
       setAuthError(err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setActiveWorkspace('dashboard');
  };

  const handleThemeChange = (newTheme: string) => {
    // This is now handled via StorageService.saveTheme inside SettingsWidget
    // which triggers the snapshot listener above.
  };

  const handleSwitchWorkspace = (workspace: WorkspaceType) => {
    setActiveWorkspace(workspace);
  };

  const toggleWidget = (type: WidgetType) => {
    setWindows(prev => {
      const existing = prev.find(w => w.componentType === type);
      if (existing) {
        return prev.map(w => w.componentType === type ? { ...w, isOpen: !w.isOpen, isMinimized: false } : w);
      }
      return prev;
    });
  };

  // Bulk Actions for Sidebar
  const handleShowAll = () => {
    setWindows(prev => prev.map(w => w.workspace === activeWorkspace ? { ...w, isOpen: true, isMinimized: false } : w));
  };

  const handleHideAll = () => {
    setWindows(prev => prev.map(w => w.workspace === activeWorkspace ? { ...w, isOpen: false } : w));
  };

  const onLayoutChange = (currentLayout: any[]) => {
    if (!isEditing) return; 
    const newWindows = windows.map(win => {
      if (win.workspace !== activeWorkspace) return win;
      const layoutItem = currentLayout.find(l => l.i === win.id);
      if (layoutItem) {
        return {
          ...win,
          layout: { ...win.layout, ...layoutItem } 
        };
      }
      return win;
    });
    setWindows(newWindows);
    // Debounce save to firebase would be ideal, but direct save for now
    if (user) {
       StorageService.saveLayout(user.uid, newWindows);
    }
  };

  const closeWindow = (id: string) => {
     setWindows(prev => prev.map(w => w.id === id ? { ...w, isOpen: false } : w));
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isOpen: false } : w));
  };

  const maximizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
  };

  const renderComponent = (type: WidgetType) => {
    switch (type) {
      // Dashboard
      case 'wallet': return <Widgets.WalletWidget />;
      case 'habit-stats': return <Widgets.HabitStatsWidget />;
      case 'mood-stats': return <Widgets.MoodStatsWidget />;
      case 'hydration': return <Widgets.HydrationWidget />;
      case 'sleep': return <Widgets.SleepWidget />;
      case 'timer': return <Widgets.TimerWidget />;
      case 'chart': return <Widgets.ChartWidget />;
      case 'quote': return <Widgets.QuoteWidget />;
      case 'breathing': return <Widgets.BreathingWidget />;
      case 'tasks': return <Widgets.TasksWidget />;
      case 'wellness-checklist': return <Widgets.WellnessChecklistWidget />;
      case 'recent-transactions': return <Widgets.RecentTransactionsWidget />;
      
      // Finance
      case 'finance-form': return <Widgets.FinanceFormWidget />;
      case 'finance-table': return <Widgets.FinanceTableWidget />;
      case 'expense-breakdown': return <Widgets.ExpenseBreakdownWidget />;
      case 'savings-goal': return <Widgets.SavingsGoalWidget />;
      case 'subscriptions': return <Widgets.SubscriptionWidget />;
      case 'overall-finance-matrix': return <Widgets.OverallFinanceMatrixWidget />;

      // Journal
      case 'journal-editor': return <Widgets.JournalEditorWidget />;
      case 'journal-history': return <Widgets.JournalHistoryWidget />;
      case 'mood-trend': return <Widgets.MoodTrendWidget />;
      case 'gratitude-log': return <Widgets.GratitudeWidget />;

      // Habits
      case 'habit-form': return <Widgets.HabitFormWidget />;
      case 'habit-list': return <Widgets.HabitListWidget />;
      case 'habit-heatmap': return <Widgets.HeatmapWidget />;

      // Other
      case 'ai-insights': return <Widgets.AiInsightsWidget />;
      case 'settings': return <Widgets.SettingsWidget user={user} onThemeChange={handleThemeChange} />;
      default: return null;
    }
  };

  // Date Formatter
  const getFormattedDate = () => {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (!user) {
    return (
      <div className="h-screen w-full bg-tui-base flex items-center justify-center p-4 transition-colors duration-300">
        <div className="w-full max-w-md bg-tui-base border-2 border-tui-mauve shadow-[8px_8px_0px_0px_#cba6f733]">
            <div className="bg-tui-mauve p-2 text-tui-base font-bold text-center border-b-2 border-tui-mauve">
               NEMESIS_AUTH_MANAGER
            </div>
            <div className="p-8 space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-tui-surface border-2 border-tui-blue rounded-full mx-auto flex items-center justify-center mb-4">
                   <Terminal size={32} className="text-tui-blue" />
                </div>
                <h2 className="text-xl font-bold text-tui-text">WELCOME BACK</h2>
                <p className="text-tui-subtext text-xs mt-1">Please authenticate to start session</p>
              </div>
              <form onSubmit={handleAuth} className="space-y-4">
                 <Input type="email" placeholder="user@nemesis.local" label="Email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required />
                 <Input type="password" placeholder="••••••••" label="Pass" value={authPass} onChange={(e) => setAuthPass(e.target.value)} required />
                 
                 {authError && <div className="text-xs text-tui-red font-bold text-center">{authError}</div>}
                 
                 <Button type="submit" className="w-full mt-4" variant="primary">
                   {authMode === 'login' ? 'Start Session' : 'Create User'}
                 </Button>
              </form>
              <div className="text-center pt-4 border-t-2 border-tui-surface">
                <button onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthError(''); }} className="text-xs text-tui-blue hover:text-tui-mauve font-bold uppercase">
                  {authMode === 'login' ? "New User? Register" : "Has Account? Login"}
                </button>
              </div>
            </div>
        </div>
      </div>
    );
  }

  const allWorkspaces: WorkspaceType[] = ['dashboard', 'finance', 'journal', 'habits', 'insights', 'settings'];

  return (
    <div className="flex h-screen bg-tui-base text-tui-text font-mono overflow-hidden transition-colors duration-300 relative">
      <Sidebar 
        activeWorkspace={activeWorkspace}
        windows={windows}
        onSwitchWorkspace={handleSwitchWorkspace}
        onToggleWidget={toggleWidget}
        onShowAll={handleShowAll}
        onHideAll={handleHideAll}
        onLogout={handleLogout}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      
      {/* Desktop Area */}
      <div className="flex-1 relative bg-[radial-gradient(var(--color-overlay)_1px,transparent_1px)] [background-size:20px_20px] flex flex-col min-w-0">
         
         {/* Top Status Bar */}
{/* Top Status Bar */}
         <div className="h-8 bg-tui-surface/80 backdrop-blur-sm border-b-2 border-tui-overlay flex items-center justify-between px-4 text-xs select-none shrink-0 z-[100]">
            <div className="flex gap-4 items-center">
               <span className="text-tui-blue font-bold">NEMESIS</span>
               <span className="text-tui-subtext">|</span>
               <span className="text-tui-mauve uppercase font-bold">{activeWorkspace}</span>
            </div>
            <div className="flex gap-4 items-center">
               <div className="flex items-center gap-2 border-r pr-4 border-tui-overlay mr-2">
                  <span className="text-tui-subtext hidden sm:inline">MODE:</span>
                  <button 
                     onClick={() => setIsEditing(!isEditing)} 
                     className={`
                        flex items-center gap-1.5 px-2 py-0.5 rounded transition-all font-bold uppercase
                        ${isEditing 
                          ? 'bg-tui-red text-tui-base animate-pulse' 
                          : 'bg-tui-overlay text-tui-subtext hover:text-tui-text'}
                     `}
                  >
                     {isEditing ? <Unlock size={12} /> : <Lock size={12} />}
                     {isEditing ? 'EDITING' : 'LOCKED'}
                  </button>
               </div>
                <span className="text-tui-yellow hidden sm:inline">{getFormattedDate()}</span>
                <span className="text-tui-mauve font-bold">{currentTime}</span>            </div>
         </div>

         {/* Workspaces Container */}
         <div ref={workspaceRef} className="flex-1 relative overflow-hidden">
            {allWorkspaces.map(ws => {
               const isActive = ws === activeWorkspace;
               const wsWindows = windows.filter(w => w.workspace === ws && w.isOpen && !w.isMinimized);
               const layouts = wsWindows.map(w => w.layout);

               return (
                  <div 
                     key={ws}
                     className={`absolute inset-0 overflow-hidden transition-opacity duration-200 ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
                     style={{ display: isActive ? 'block' : 'none' }}
                  >
                     <div className="w-full h-full p-4 overflow-y-auto custom-scrollbar relative">
                        <ResponsiveGridLayout
                           className="layout"
                           layouts={{ lg: layouts }}
                           breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                           cols={{ lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 }}
                           rowHeight={30}
                           width={containerWidth - 32} // -32 for padding
                           isDraggable={isEditing}  
                           isResizable={isEditing}  
                           draggableHandle=".drag-handle"
                           onLayoutChange={onLayoutChange}
                           margin={[16, 16]}
                           containerPadding={[0, 0]}
                           useCSSTransforms={true}
                           compactType="vertical"
                        >
                           {/* IMPORTANT: WindowFrame is DIRECT CHILD of ResponsiveGridLayout to receive style/className/onMouseDown */}
                           {wsWindows.filter(w => !w.isMaximized).map((win) => (
                              <WindowFrame
                                 key={win.id}
                                 data-grid={win.layout}
                                 window={win}
                                 onClose={() => closeWindow(win.id)}
                                 onMinimize={() => minimizeWindow(win.id)}
                                 onMaximize={() => maximizeWindow(win.id)}
                                 isEditing={isEditing}
                              >
                                 {renderComponent(win.componentType)}
                              </WindowFrame>
                           ))}
                        </ResponsiveGridLayout>

                        {/* Maximized Windows Overlay */}
                        {wsWindows.filter(w => w.isMaximized).map((win) => (
                           <WindowFrame
                              key={win.id}
                              window={win}
                              onClose={() => closeWindow(win.id)}
                              onMinimize={() => minimizeWindow(win.id)}
                              onMaximize={() => maximizeWindow(win.id)}
                              isEditing={false}
                           >
                              {renderComponent(win.componentType)}
                           </WindowFrame>
                        ))}
                     </div>
                  </div>
               );
            })}
         </div>
      </div>
    </div>
  );
};

export default App;