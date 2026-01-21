import React, { useEffect, useState } from 'react';
import { StorageService } from '../services/storageService';
import { FinanceData, Habit, JournalEntry } from '../types';
import { Card, Badge } from '../components/UIComponents';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Wallet, CheckSquare, Smile } from 'lucide-react';
import { auth } from '../services/firebase';

const Dashboard: React.FC = () => {
  const [finances, setFinances] = useState<FinanceData[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserId(user ? user.uid : null);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!userId) return;

    const unsubFinances = StorageService.subscribeToFinances(userId, setFinances);
    const unsubHabits = StorageService.subscribeToHabits(userId, setHabits);
    const unsubJournal = StorageService.subscribeToJournal(userId, setJournal);

    return () => {
      unsubFinances();
      unsubHabits();
      unsubJournal();
    };
  }, [userId]);

  const income = finances.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const expense = finances.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = income - expense;

  const activeHabits = habits.length;
  const completedToday = habits.filter(h => {
    if (!h.lastCompletedDate) return false;
    return new Date(h.lastCompletedDate).toDateString() === new Date().toDateString();
  }).length;
  const focusScore = activeHabits > 0 ? Math.round((completedToday / activeHabits) * 100) : 0;

  const chartData = [
    { name: 'Mon', value: 3400 },
    { name: 'Tue', value: 2800 },
    { name: 'Wed', value: 4500 },
    { name: 'Thu', value: 3908 },
    { name: 'Fri', value: 4800 },
    { name: 'Sat', value: 3800 },
    { name: 'Sun', value: 4300 },
  ];

  return (
    <div className="h-full flex flex-col gap-4">
      
      {/* Top Row Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
         <Card className="h-32" title="WALLET">
            <div className="flex items-center justify-between h-full pb-2">
               <div>
                  <div className="text-3xl font-bold text-tui-green mb-1">${balance.toLocaleString()}</div>
                  <div className="text-xs text-tui-subtext">Net Available</div>
               </div>
               <div className="p-3 bg-tui-surface border-2 border-tui-green rounded-full">
                  <Wallet className="text-tui-green" />
               </div>
            </div>
         </Card>

         <Card className="h-32" title="HABITS">
             <div className="flex items-center justify-between h-full pb-2">
               <div>
                  <div className="text-3xl font-bold text-tui-blue mb-1">{focusScore}%</div>
                  <div className="text-xs text-tui-subtext">Daily Completion</div>
               </div>
               <div className="p-3 bg-tui-surface border-2 border-tui-blue rounded-full">
                  <CheckSquare className="text-tui-blue" />
               </div>
            </div>
         </Card>

         <Card className="h-32" title="MOOD">
             <div className="flex items-center justify-between h-full pb-2">
               <div>
                  <div className="text-3xl font-bold text-tui-mauve mb-1">{journal.length > 0 ? journal[0].mood : '-'} <span className="text-base text-tui-subtext">/ 5</span></div>
                  <div className="text-xs text-tui-subtext">Latest Entry Logged</div>
               </div>
               <div className="p-3 bg-tui-surface border-2 border-tui-mauve rounded-full">
                  <Smile className="text-tui-mauve" />
               </div>
            </div>
         </Card>
      </div>

      {/* Bottom Grid */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-4">
         
         {/* Chart Section */}
         <Card title="CASHFLOW_ANALYSIS" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                     <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#cba6f7" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#cba6f7" stopOpacity={0}/>
                     </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#a6adc8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#a6adc8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                     contentStyle={{ backgroundColor: '#1e1e2e', border: '2px solid #313244', borderRadius: '0px' }}
                     itemStyle={{ color: '#cba6f7' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#cba6f7" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
               </AreaChart>
            </ResponsiveContainer>
         </Card>

         {/* List Section */}
         <Card title="ACTIVE_TASKS" className="lg:col-span-1">
            <div className="space-y-2">
               {habits.map(h => (
                  <div key={h.id} className="flex items-center justify-between p-2 bg-tui-surface border border-tui-overlay hover:border-tui-blue transition-colors cursor-pointer">
                     <span className="text-sm font-bold text-tui-text">{h.name}</span>
                     <Badge variant={h.streak > 3 ? 'success' : 'neutral'}>{h.streak}d streak</Badge>
                  </div>
               ))}
               {habits.length === 0 && <div className="text-center text-tui-subtext py-4">No active tasks found.</div>}
            </div>
            
            <div className="mt-4 pt-4 border-t-2 border-tui-overlay">
               <div className="text-xs font-bold text-tui-blue mb-2">SYSTEM NOTIFICATIONS</div>
               <div className="text-xs text-tui-subtext bg-tui-surface p-2 border border-tui-overlay">
                  {"> Backup completed successfully."}<br />
                  {"> CPU usage nominal."}<br />
                  {"> 2 new journal entries pending sync."}
               </div>
            </div>
         </Card>
      </div>
    </div>
  );
};

export default Dashboard;