import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';
import { FinanceData } from '../types';
import { Card, Button, Input, Badge } from '../components/UIComponents';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { auth } from '../services/firebase';

const Finance: React.FC = () => {
  const [transactions, setTransactions] = useState<FinanceData[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    type: 'expense',
    notes: ''
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserId(user ? user.uid : null);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!userId) return;
    const unsubscribe = StorageService.subscribeToFinances(userId, setTransactions);
    return unsubscribe;
  }, [userId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.category || !userId) return;

    const newTx: Omit<FinanceData, 'id'> = {
      userId: userId,
      type: formData.type as 'income' | 'expense',
      amount: parseFloat(formData.amount),
      category: formData.category,
      notes: formData.notes,
      date: new Date().toISOString()
    };

    StorageService.addFinance(userId, newTx);
    setFormData({ amount: '', category: '', type: 'expense', notes: '' });
  };

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-4">
      
      {/* Form */}
      <Card title="ADD_ENTRY" className="lg:col-span-1">
         <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
               <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'expense'})}
                  className={`py-2 text-sm font-bold border-2 ${formData.type === 'expense' ? 'bg-tui-red border-tui-red text-tui-base' : 'border-tui-overlay text-tui-subtext'}`}
               >
                  EXPENSE
               </button>
               <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'income'})}
                  className={`py-2 text-sm font-bold border-2 ${formData.type === 'income' ? 'bg-tui-green border-tui-green text-tui-base' : 'border-tui-overlay text-tui-subtext'}`}
               >
                  INCOME
               </button>
            </div>

            <Input 
               type="number" 
               label="Amount"
               value={formData.amount}
               onChange={(e) => setFormData({...formData, amount: e.target.value})}
               placeholder="0.00"
               required
            />
            <Input 
               type="text" 
               label="Category"
               value={formData.category}
               onChange={(e) => setFormData({...formData, category: e.target.value})}
               placeholder="Food, Rent, etc."
               required
            />
            <Input 
               type="text" 
               label="Note"
               value={formData.notes}
               onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />

            <Button type="submit" variant="primary" className="w-full mt-2">
               COMMIT RECORD
            </Button>
         </form>
      </Card>

      {/* Table */}
      <Card title="LEDGER.CSV" className="lg:col-span-2">
         <div className="w-full">
            <table className="w-full text-left border-collapse">
               <thead className="text-xs text-tui-subtext bg-tui-surface sticky top-0">
                  <tr>
                     <th className="p-2 border-b-2 border-tui-overlay">TYPE</th>
                     <th className="p-2 border-b-2 border-tui-overlay">CATEGORY</th>
                     <th className="p-2 border-b-2 border-tui-overlay">DATE</th>
                     <th className="p-2 border-b-2 border-tui-overlay text-right">AMOUNT</th>
                  </tr>
               </thead>
               <tbody className="text-sm font-mono">
                  {transactions.map((tx) => (
                     <tr key={tx.id} className="hover:bg-tui-surface group border-b border-tui-overlay/50">
                        <td className="p-2">
                           {tx.type === 'income' ? (
                              <span className="text-tui-green flex items-center gap-1"><ArrowUpRight size={14}/> IN</span>
                           ) : (
                              <span className="text-tui-red flex items-center gap-1"><ArrowDownLeft size={14}/> OUT</span>
                           )}
                        </td>
                        <td className="p-2 text-tui-text font-bold">{tx.category}</td>
                        <td className="p-2 text-tui-subtext">{new Date(tx.date).toLocaleDateString()}</td>
                        <td className={`p-2 text-right font-bold ${tx.type === 'income' ? 'text-tui-green' : 'text-tui-text'}`}>
                           {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </Card>
    </div>
  );
};

export default Finance;