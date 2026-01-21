import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  getDoc,
  getDocs  
} from 'firebase/firestore';
import { db } from './firebase';
import { FinanceData, JournalEntry, Habit, Subscription, WindowState } from '../types';

// Helper to get user doc ref
const getUserRef = (userId: string) => doc(db, 'users', userId);

export const StorageService = {
  // --- THEME & SETTINGS ---
  subscribeToSettings: (userId: string, callback: (settings: any) => void) => {
    return onSnapshot(doc(db, 'users', userId), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        // Return combined profile/settings data
        callback({
           theme: data.theme || 'dracula',
           settings: data.settings || { notifications: true, sound: false }
        });
      } else {
        callback({ theme: 'dracula', settings: { notifications: true, sound: false } });
      }
    });
  },

  saveTheme: async (userId: string, theme: string) => {
    await setDoc(getUserRef(userId), { theme }, { merge: true });
  },

  saveSettings: async (userId: string, settings: any) => {
    await setDoc(getUserRef(userId), { settings }, { merge: true });
  },

  // --- LAYOUT ---
  subscribeToLayout: (userId: string, callback: (layout: WindowState[] | null) => void) => {
    return onSnapshot(doc(db, 'users', userId, 'userData', 'layout'), (doc) => {
      if (doc.exists()) {
        callback(doc.data().windows as WindowState[]);
      } else {
        callback(null);
      }
    });
  },

  saveLayout: async (userId: string, windows: WindowState[]) => {
    await setDoc(doc(db, 'users', userId, 'userData', 'layout'), { windows }, { merge: true });
  },

  // --- FINANCE ---
  subscribeToFinances: (userId: string, callback: (data: FinanceData[]) => void) => {
    const q = query(collection(db, 'users', userId, 'finances'), orderBy('date', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FinanceData));
      callback(data);
    });
  },

  addFinance: async (userId: string, item: Omit<FinanceData, 'id'>) => {
    await addDoc(collection(db, 'users', userId, 'finances'), item);
  },
  
  deleteFinance: async (userId: string, financeId: string) => {
    const financeRef = doc(db, 'users', userId, 'finances', financeId);

    try {
      // 1. GET the document first (before deleting)
      const financeSnap = await getDoc(financeRef);

      if (financeSnap.exists()) {
        const data = financeSnap.data();
        
        // 2. Check if category is 'Savings' (case-insensitive)
        const category = String(data.category || '').trim().toLowerCase();

        if (category === 'savings') {
          const savingsRef = doc(db, 'users', userId, 'userData', 'savings');
          const savingsSnap = await getDoc(savingsRef);

          if (savingsSnap.exists()) {
            const currentSavings = Number(savingsSnap.data().current) || 0;
            const amountToDeduct = Number(data.amount) || 0;

            // 3. Update the savings balance
            await updateDoc(savingsRef, {
              current: Math.max(0, currentSavings - amountToDeduct)
            });
          }
        }
      }

      // 4. DELETE the ledger entry
      await deleteDoc(financeRef);
      
    } catch (error) {
      console.error("Error deleting finance entry:", error);
    }
  },
  // --- JOURNAL ---
  subscribeToJournal: (userId: string, callback: (data: JournalEntry[]) => void) => {
    const q = query(collection(db, 'users', userId, 'journal'), orderBy('date', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JournalEntry));
      callback(data);
    });
  },

  addJournal: async (userId: string, item: Omit<JournalEntry, 'id'>) => {
    await addDoc(collection(db, 'users', userId, 'journal'), item);
  },
  deleteJournal: async (userId: string, journalId: string) => {
    await deleteDoc(doc(db, 'users', userId, 'journal', journalId));
  },
  // --- HABITS ---
  subscribeToHabits: (userId: string, callback: (data: Habit[]) => void) => {
    return onSnapshot(collection(db, 'users', userId, 'habits'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Habit));
      callback(data);
    });
  },

  addHabit: async (userId: string, item: Omit<Habit, 'id'>) => {
    await addDoc(collection(db, 'users', userId, 'habits'), item);
  },

  updateHabit: async (userId: string, habitId: string, updates: Partial<Habit>) => {
    await updateDoc(doc(db, 'users', userId, 'habits', habitId), updates);
  },

  deleteHabit: async (userId: string, habitId: string) => {
    await deleteDoc(doc(db, 'users', userId, 'habits', habitId));
  },

  // --- SUBSCRIPTIONS ---
  subscribeToSubscriptions: (userId: string, callback: (data: Subscription[]) => void) => {
    return onSnapshot(collection(db, 'users', userId, 'subscriptions'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Subscription));
      callback(data);
    });
  },

  addSubscription: async (userId: string, item: Omit<Subscription, 'id'>) => {
    await addDoc(collection(db, 'users', userId, 'subscriptions'), item);
  },

  deleteSubscription: async (userId: string, subId: string) => {
    await deleteDoc(doc(db, 'users', userId, 'subscriptions', subId));
  },

  // --- GRATITUDE (Single Doc List) ---
  subscribeToGratitude: (userId: string, callback: (items: string[]) => void) => {
    return onSnapshot(doc(db, 'users', userId, 'userData', 'gratitude'), (doc) => {
      if (doc.exists()) {
        callback(doc.data().items || []);
      } else {
        callback([]);
      }
    });
  },

  saveGratitude: async (userId: string, items: string[]) => {
    await setDoc(doc(db, 'users', userId, 'userData', 'gratitude'), { items }, { merge: true });
  },

  // --- WELLNESS CONFIG (Single Doc List) ---
  subscribeToWellnessConfig: (userId: string, callback: (items: string[]) => void) => {
    return onSnapshot(doc(db, 'users', userId, 'userData', 'wellnessConfig'), (doc) => {
      if (doc.exists()) {
        callback(doc.data().items || ["Take Vitamins", "10m Stretch", "Sun Exposure", "No Sugar", "Read 10 pages"]);
      } else {
        callback(["Take Vitamins", "10m Stretch", "Sun Exposure", "No Sugar", "Read 10 pages"]);
      }
    });
  },

  saveWellnessConfig: async (userId: string, items: string[]) => {
    await setDoc(doc(db, 'users', userId, 'userData', 'wellnessConfig'), { items }, { merge: true });
  },

  // --- WELLNESS STATE (Daily) ---
  subscribeToWellnessState: (userId: string, dateKey: string, callback: (state: Record<string, boolean>) => void) => {
    return onSnapshot(doc(db, 'users', userId, 'wellnessLog', dateKey), (doc) => {
      if (doc.exists()) {
        callback(doc.data().state || {});
      } else {
        callback({});
      }
    });
  },

  saveWellnessState: async (userId: string, dateKey: string, state: Record<string, boolean>) => {
    await setDoc(doc(db, 'users', userId, 'wellnessLog', dateKey), { state }, { merge: true });
  },

  // --- HYDRATION (Daily) ---
  subscribeToHydration: (userId: string, dateKey: string, callback: (count: number) => void) => {
    return onSnapshot(doc(db, 'users', userId, 'hydrationLog', dateKey), (doc) => {
      if (doc.exists()) {
        callback(doc.data().count || 0);
      } else {
        callback(0);
      }
    });
  },

  saveHydration: async (userId: string, dateKey: string, count: number) => {
    await setDoc(doc(db, 'users', userId, 'hydrationLog', dateKey), { count }, { merge: true });
  },

  // --- SLEEP (Daily) ---
  subscribeToSleep: (userId: string, callback: (hours: string | null) => void) => {
     // Store "last logged" in the user profile or a separate singleton
     return onSnapshot(doc(db, 'users', userId, 'userData', 'sleep'), (doc) => {
        if(doc.exists()) callback(doc.data().lastHours);
        else callback(null);
     });
  },

  saveSleep: async (userId: string, hours: string | null) => {
     await setDoc(doc(db, 'users', userId, 'userData', 'sleep'), { lastHours: hours }, { merge: true });
  },

  addToSavings: async (userId: string, amount: number) => {
    const docRef = doc(db, 'users', userId, 'userData', 'savings');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const current = docSnap.data().current || 0;
      await updateDoc(docRef, { current: current + amount });
    } else {
      await setDoc(docRef, { current: amount, goal: 5000 });
    }
  },

  removeFromSavings: async (userId: string, amount: number) => {
    const docRef = doc(db, 'users', userId, 'userData', 'savings');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const current = docSnap.data().current || 0;
      await updateDoc(docRef, { current: Math.max(0, current - amount) });
    }
  },

subscribeToSavingsGoal: (userId: string, callback: (data: {goal: number, current: number}) => void) => {
  return onSnapshot(doc(db, 'users', userId, 'userData', 'savings'), (doc) => {
    if (doc.exists()) {
      callback({ goal: doc.data().goal || 5000, current: doc.data().current || 0 });
    } else {
      callback({ goal: 5000, current: 0 });
    }
  });
},

saveSavingsGoal: async (userId: string, goal: number, current: number) => {
  await setDoc(doc(db, 'users', userId, 'userData', 'savings'), { goal, current }, { merge: true });
},

checkAndResetStreaks: async (userId: string) => {
  const habitsRef = collection(db, 'users', userId, 'habits');
  const snapshot = await getDocs(habitsRef);
  
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  
  snapshot.docs.forEach(async (docSnapshot) => {
    const habit = { id: docSnapshot.id, ...docSnapshot.data() } as Habit;
    
    if (habit.lastCompletedDate) {
      const lastCompleted = new Date(habit.lastCompletedDate).toDateString();
      
      // If last completed was before yesterday, reset streak
      if (lastCompleted !== today && lastCompleted !== yesterday) {
        await updateDoc(doc(db, 'users', userId, 'habits', habit.id), {
          streak: 0
        });
      }
    }
  });
},

};