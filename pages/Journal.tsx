import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';
import { JournalEntry } from '../types';
import { Card, Button } from '../components/UIComponents';
import { Save } from 'lucide-react';
import { auth } from '../services/firebase';

const Journal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [mood, setMood] = useState(3);
  const [text, setText] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserId(user ? user.uid : null);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!userId) return;
    const unsubscribe = StorageService.subscribeToJournal(userId, setEntries);
    return unsubscribe;
  }, [userId]);

  const handleSave = () => {
    if (!text || !userId) return;
    const newEntry: Omit<JournalEntry, 'id'> = {
      userId: userId,
      mood,
      text,
      date: new Date().toISOString()
    };
    StorageService.addJournal(userId, newEntry);
    setText('');
    setMood(3);
  };

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-4">
      
      {/* Editor */}
      <Card title="VIM_BUFFER" className="lg:col-span-7 h-full">
         <div className="h-full flex flex-col gap-4">
            <div>
               <label className="block text-xs font-bold text-tui-blue uppercase tracking-wider mb-2">MOOD (1-5)</label>
               <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                     <button
                        key={val}
                        onClick={() => setMood(val)}
                        className={`flex-1 py-2 font-bold border-2 transition-transform active:scale-95
                           ${mood === val 
                              ? 'bg-tui-yellow text-tui-base border-tui-yellow' 
                              : 'bg-tui-surface text-tui-subtext border-tui-overlay hover:border-tui-yellow'}
                        `}
                     >
                        {val}
                     </button>
                  ))}
               </div>
            </div>

            <div className="flex-1 bg-tui-surface border-2 border-tui-overlay p-4 relative">
               <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full h-full bg-transparent text-tui-text focus:outline-none resize-none font-mono text-sm leading-relaxed"
                  placeholder="INSERT MODE"
                  spellCheck={false}
               />
            </div>

            <Button onClick={handleSave} variant="primary" className="w-full">
               <Save size={16} /> WRITE AND QUIT
            </Button>
         </div>
      </Card>

      {/* Archive */}
      <Card title="HISTORY" className="lg:col-span-5 h-full bg-tui-surface">
         <div className="space-y-4">
            {entries.map((entry) => (
               <div key={entry.id} className="bg-tui-base border border-tui-overlay p-3 hover:border-tui-mauve transition-colors">
                  <div className="flex justify-between items-center mb-2">
                     <span className="text-xs font-bold text-tui-mauve">{new Date(entry.date).toLocaleDateString()}</span>
                     <span className="text-xs bg-tui-overlay px-2 py-0.5 rounded text-tui-text">MOOD: {entry.mood}</span>
                  </div>
                  <p className="text-sm text-tui-subtext line-clamp-4">
                     {entry.text}
                  </p>
               </div>
            ))}
            {entries.length === 0 && <div className="text-tui-subtext text-center italic mt-10">Empty buffer</div>}
         </div>
      </Card>

    </div>
  );
};

export default Journal;