import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';
import { Habit } from '../types';
import { Card, Button, Input, Badge } from '../components/UIComponents';
import { Plus, Trash, Zap } from 'lucide-react';
import { auth } from '../services/firebase';

const Habits: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserId(user ? user.uid : null);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!userId) return;
    const unsubscribe = StorageService.subscribeToHabits(userId, setHabits);
    return unsubscribe;
  }, [userId]);

  const addHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName || !userId) return;
    const habit: Omit<Habit, 'id'> = {
      userId: userId,
      name: newHabitName,
      frequency: 'daily',
      streak: 0,
      longestStreak: 0,
      lastCompletedDate: null,
      history: []
    };
    StorageService.addHabit(userId, habit);
    setNewHabitName('');
  };

  const toggleHabit = (id: string) => {
    if (!userId) return;
    const habit = habits.find(h => h.id === id);
    if (!habit) return;
      
    const today = new Date().toDateString();
    const lastCompleted = habit.lastCompletedDate ? new Date(habit.lastCompletedDate).toDateString() : null;
      
    if (lastCompleted === today) { return; }

    const isConsecutive = lastCompleted === new Date(Date.now() - 86400000).toDateString();
    const newStreak = isConsecutive ? habit.streak + 1 : 1;
    
    StorageService.updateHabit(userId, id, {
        streak: newStreak,
        longestStreak: Math.max(habit.longestStreak, newStreak),
        lastCompletedDate: new Date().toISOString(),
        history: [...habit.history, new Date().toISOString()]
    });
  };

  const deleteHabit = (id: string) => {
    if (!userId) return;
    StorageService.deleteHabit(userId, id);
  };

  return (
    <div className="h-full flex flex-col gap-4">
       <Card title="PROCESS_MANAGER">
          <form onSubmit={addHabit} className="flex gap-2 items-end">
             <div className="flex-1">
               <Input 
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="Enter new protocol name..."
                  label="NEW PROCESS"
               />
             </div>
             <Button type="submit" variant="secondary" className="h-[38px]">
                <Plus size={16} /> SPAWN
             </Button>
          </form>
       </Card>

       <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pb-4">
          {habits.map((habit) => {
             const isDoneToday = habit.lastCompletedDate && new Date(habit.lastCompletedDate).toDateString() === new Date().toDateString();
             
             return (
               <div key={habit.id} className="bg-tui-base border-2 border-tui-overlay p-4 flex flex-col justify-between hover:border-tui-mauve transition-colors">
                  <div className="flex justify-between items-start mb-4">
                     <h3 className="font-bold text-lg text-tui-text truncate">{habit.name}</h3>
                     <button onClick={() => deleteHabit(habit.id)} className="text-tui-subtext hover:text-tui-red">
                        <Trash size={16} />
                     </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                     <div className="bg-tui-surface p-2 text-center border border-tui-overlay">
                        <div className="text-[10px] text-tui-subtext uppercase">Current</div>
                        <div className="text-xl font-bold text-tui-blue">{habit.streak}</div>
                     </div>
                     <div className="bg-tui-surface p-2 text-center border border-tui-overlay">
                        <div className="text-[10px] text-tui-subtext uppercase">Max</div>
                        <div className="text-xl font-bold text-tui-mauve">{habit.longestStreak}</div>
                     </div>
                  </div>

                  <Button 
                     onClick={() => toggleHabit(habit.id)}
                     disabled={!!isDoneToday}
                     variant={isDoneToday ? 'secondary' : 'primary'}
                     className="w-full"
                  >
                     {isDoneToday ? 'COMPLETED' : 'EXECUTE'}
                  </Button>
               </div>
             );
          })}
       </div>
    </div>
  );
};

export default Habits;