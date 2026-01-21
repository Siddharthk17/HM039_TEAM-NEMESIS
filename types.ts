export interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface FinanceData {
  id: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;
  notes?: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  mood: number; // 1-5
  text: string;
  date: string; // ISO String
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  frequency: 'daily' | 'weekly';
  streak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  history: string[]; // Array of ISO dates
}

export interface Subscription {
  id: string;
  name: string;
  cost: number;
}

export interface AppState {
  user: UserProfile | null;
  finances: FinanceData[];
  journal: JournalEntry[];
  habits: Habit[];
  isAuthenticated: boolean;
}

export enum AnalyticsPeriod {
  WEEK = 'WEEK',
  MONTH = 'MONTH'
}

export type WidgetType = 
  // Dashboard
  | 'wallet' | 'habit-stats' | 'mood-stats' | 'hydration' | 'sleep' | 'timer' | 'chart' | 'tasks' | 'breathing' | 'quote'
  | 'wellness-checklist' | 'recent-transactions'
  // Finance
  | 'finance-form' | 'finance-table' | 'savings-goal' | 'subscriptions' | 'expense-breakdown'
  | 'overall-finance-matrix' // ADD THIS
  // Journal
  | 'journal-editor' | 'journal-history' | 'gratitude-log' | 'mood-trend'
  // Habits
  | 'habit-form' | 'habit-list' | 'habit-heatmap'
  // Other
  | 'ai-insights' | 'settings';

export type WorkspaceType = 'dashboard' | 'finance' | 'journal' | 'habits' | 'insights' | 'settings';

// Window Manager Types
export interface LayoutConfig {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
}

export interface WindowState {
  id: string;
  title: string;
  componentType: WidgetType;
  workspace: WorkspaceType;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  
  // React Grid Layout Configuration
  layout: LayoutConfig;
}