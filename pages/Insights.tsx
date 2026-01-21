import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';
import { GeminiService } from '../services/geminiService';
import { Card, Button } from '../components/UIComponents';
import { Brain, Sparkles } from 'lucide-react';
import { auth } from '../services/firebase';
import { FinanceData, Habit, JournalEntry } from '../types';

const Insights: React.FC = () => {
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [finances, setFinances] = useState<FinanceData[]>([]);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserId(user ? user.uid : null);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!userId) return;

    const unsubFinances = StorageService.subscribeToFinances(userId, setFinances);
    const unsubJournal = StorageService.subscribeToJournal(userId, setJournal);
    const unsubHabits = StorageService.subscribeToHabits(userId, setHabits);

    return () => {
      unsubFinances();
      unsubJournal();
      unsubHabits();
    };
  }, [userId]);

  const generateReport = async () => {
    if (!userId) return;
    setLoading(true);
    const result = await GeminiService.generateLifeInsights(finances, journal, habits);
    setReport(result);
    setLoading(false);
  };

  return (
    <Card title="AI_CORE.PY" className="h-full">
      <div className="flex flex-col h-full">
         <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-tui-overlay">
            <div className="flex items-center gap-3">
               <div className="bg-tui-mauve p-2 text-tui-base">
                  <Brain size={24} />
               </div>
               <div>
                  <h2 className="font-bold text-tui-text">NEMESIS NEURAL NETWORK</h2>
                  <p className="text-xs text-tui-subtext">v1.7.3-stable</p>
               </div>
            </div>
            
            <Button onClick={generateReport} disabled={loading} variant="primary">
               {loading ? 'COMPILING...' : 'RUN SCRIPT'} <Sparkles size={16} />
            </Button>
         </div>

         <div className="flex-1 bg-tui-surface border-2 border-tui-overlay p-4 font-mono text-sm overflow-auto custom-scrollbar">
            {!report && !loading && (
               <div className="h-full flex items-center justify-center text-tui-subtext opacity-50">
                  // Awaiting execution command...
               </div>
            )}

            {loading && (
               <div className="space-y-2 text-tui-blue">
                  <div><span className="text-tui-mauve">import</span> user_data</div>
                  <div><span className="text-tui-mauve">import</span> gemini_api</div>
                  <div className="text-tui-subtext"># fetching memory blocks...</div>
                  <div className="text-tui-subtext"># analyzing patterns...</div>
                  <div className="animate-pulse text-tui-yellow">{"> generating_insight_vector..."}</div>
               </div>
            )}

            {report && (
               <div className="space-y-4">
                  <div className="text-tui-subtext border-b border-tui-overlay pb-2">
                     <span className="text-tui-green">✔</span> Execution successful (0.42s)
                  </div>
                  <div className="whitespace-pre-wrap leading-relaxed text-tui-text">
                     <span className="text-tui-mauve">Output:</span>
                     <br/><br/>
                     {report}
                  </div>
                  <div className="text-tui-subtext pt-4">
                     <span className="text-tui-blue">Process finished with exit code 0</span>
                  </div>
               </div>
            )}
         </div>
      </div>
    </Card>
  );
};

export default Insights;