# NEMESIS | Cognitive Life OS

```ascii
███╗   ██╗███████╗███╗   ███╗███████╗███████╗██╗███████╗
████╗  ██║██╔════╝████╗ ████║██╔════╝██╔════╝██║██╔════╝
██╔██╗ ██║█████╗  ██╔████╔██║█████╗  ███████╗██║███████╗
██║╚██╗██║██╔══╝  ██║╚██╔╝██║██╔══╝  ╚════██║██║╚════██║
██║ ╚████║███████╗██║ ╚═╝ ██║███████╗███████║██║███████║
╚═╝  ╚═══╝╚══════╝╚═╝     ╚═╝╚══════╝╚══════╝╚═╝╚══════╝
                                                          
         [ NEURAL EXECUTIVE MANAGEMENT & INTEGRATED SYSTEM ]
```

> **A High-Performance Cognitive Operating System For The Terminal-Obsessed Individual Who Treats Life Like A Codebase.**

[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## 🎯 MISSION STATEMENT

NEMESIS isn't another productivity app—it's a **radical reimagining of personal infrastructure**. Built for developers, stoics, and cognitive athletes who believe that **discipline scales with systems**, not motivation.

This is your life, compiled. Your habits, transactions, and mental states rendered as data structures. Your daily existence, version-controlled.

---

## ⚡ CORE ARCHITECTURE

### **Tech Stack**
```yaml
Frontend:
  Framework: React 18.3.1 + TypeScript
  Layout: React Grid Layout (Draggable/Resizable Windows)
  Styling: TailwindCSS (JetBrains Mono)
  Charts: Recharts 2.12.7
  Icons: Lucide React

Backend:
  Database: Firebase Firestore (Real-time NoSQL)
  Auth: Firebase Authentication
  Hosting: Firebase Hosting
  
State Management:
  Architecture: Real-time Firestore Subscriptions
  Storage: Cloud-synced across devices
  
Build System:
  Bundler: Vite 6.2.0
  TypeScript: 5.8.2
```

### **System Design Philosophy**
- **Zero localStorage Dependencies**: Pure cloud-native architecture
- **Real-time Synchronization**: Firestore snapshots for instant updates
- **Modular Widget System**: Plug-and-play components across workspaces
- **Streak Protection**: Automatic midnight streak validation
- **Multi-theme Support**: Dracula, Aura, Tokyo Night, Memento Mori

---

## 🚀 FEATURES BREAKDOWN

### **1. DASHBOARD** — System Overview
Your command center. Real-time aggregation of all subsystems:
- **Wallet Widget**: Net balance tracker (Income - Expenses)
- **Habit Stats**: Daily completion percentage
- **Mood Analytics**: Latest journal mood score
- **Hydration Monitor**: Daily water intake (8-cup goal)
- **Focus Timer**: Pomodoro-style concentration sessions
- **Breathing Exercise**: 4-4-4 resonance breathing interface
- **Quote Engine**: Randomized stoic wisdom
- **Wellness Checklist**: Customizable daily protocols
- **Recent Transactions**: Last 5 financial movements
- **Cashflow Chart**: 7-day balance trend visualization
- **Active Tasks**: Habit tracker summary

### **2. FINANCE** — Capital Flow Management
Track every rupee with forensic precision:
- **Transaction Ledger**: Complete audit trail with notes
- **Expense Breakdown**: Category-based pie chart analysis
- **Savings Goal Tracker**: Visual progress bar with target setting
- **Recurring Subscriptions**: Monthly burn rate calculator
- **Overall Finance Matrix**: Multi-view analytics (All/Income/Expense/Subscription/Savings)
- **Smart Categorization**: Automatic savings account crediting
- **Date-stamped Entries**: Historical transaction timeline

### **3. JOURNAL** — Cognitive State Logging
Vim-inspired journaling system:
- **VIM Buffer Editor**: Distraction-free writing interface
- **Mood Scaling**: 1-5 numerical tracking per entry
- **History Archive**: Chronological entry browser with delete capability
- **Mood Trend Chart**: 7-day emotional trajectory visualization
- **Gratitude Log**: Separate gratitude practice tracker

### **4. HABITS** — Protocol Execution
Gamified consistency engine:
- **Streak System**: Current vs. longest streak tracking
- **Process Manager**: Add/delete habit protocols
- **Consistency Grid**: GitHub-style 70-day heatmap
- **Cooldown Protection**: 5-second anti-spam on completion
- **Automatic Streak Reset**: Midnight validation (if not completed yesterday or today)
- **Execution History**: Complete timestamped log per habit

### **5. INSIGHTS** — Neural Network (AI Integration Ready)
AI-powered life analysis module:
- **Data Aggregation**: Pulls finances, journal, habits
- **Gemini API Integration**: Natural language insight generation
- **Weekly Summary**: Automated performance reports
- **Actionable Recommendations**: 3-point improvement suggestions

### **6. SETTINGS** — System Configuration
User profile and security management:
- **Theme Selector**: 4 dark mode variants (Dracula/Aura/Tokyo/Memento)
- **User Info Display**: UID, username, email
- **Password Management**: Secure credential updates with re-authentication
- **Data Purge**: Nuclear option for complete account reset

---

## 🎨 UI/UX DESIGN PRINCIPLES

### **Visual Language**
```
┌─────────────────────────────────────────────────┐
│ NEMESIS_AUTH_MANAGER                            │
├─────────────────────────────────────────────────┤
│                                                 │
│   ● Monospaced Typography (JetBrains Mono)      │
│   ● Terminal-Inspired Aesthetics                │
│   ● macOS-Style Window Controls (●●●)           │
│   ● Brutalist Grid Layouts                      │
│   ● Categorical Color Coding:                   │
│     - Green: Income/Success                     │
│     - Red: Expenses/Danger                      │
│     - Blue: Information/Tasks                   │
│     - Mauve: Accent/Active States               │
│     - Yellow: Warnings/Time                     │
│                                                 │
└─────────────────────────────────────────────────┘
```

### **Interaction Model**
- **Edit Mode Toggle**: Lock/unlock grid for repositioning
- **Draggable Windows**: Customizable workspace layouts
- **Resizable Panels**: Adaptive widget sizing
- **Maximize/Minimize**: Full-screen and taskbar dock
- **Keyboard-First**: Form submissions via Enter key
- **Real-time Updates**: No manual refresh needed

---

## 📦 INSTALLATION

### **Prerequisites**
```bash
node >= 18.0.0
npm >= 8.0.0
```

### **1. Clone Repository**
```bash
git clone https://github.com/yourusername/nemesis-os.git
cd nemesis-os
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Firebase Configuration**
Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com/)

**Enable Services:**
- Authentication (Email/Password)
- Firestore Database
- Hosting

**Update `services/firebase.ts`:**
```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

### **4. Firestore Security Rules**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### **5. Run Development Server**
```bash
npm run dev
```
Access at `http://localhost:3000`

### **6. Build for Production**
```bash
npm run build
firebase deploy
```

---

## 🗂️ PROJECT STRUCTURE

```
nemesis-os/
├── components/
│   ├── Sidebar.tsx              # Navigation dock
│   ├── UIComponents.tsx         # Reusable primitives (Button, Input, Card, Badge)
│   ├── WindowFrame.tsx          # Draggable window wrapper
│   └── WidgetRegistry.tsx       # All 30+ widget components
├── pages/
│   ├── Dashboard.tsx            # (Legacy - now widget-based)
│   ├── Finance.tsx              # (Legacy)
│   ├── Journal.tsx              # (Legacy)
│   ├── Habits.tsx               # (Legacy)
│   ├── Insights.tsx             # (Legacy)
│   └── Settings.tsx             # (Legacy)
├── services/
│   ├── firebase.ts              # Firebase initialization
│   ├── storageService.ts        # Firestore CRUD operations
│   └── geminiService.ts         # AI integration (stub)
├── types.ts                     # TypeScript interfaces
├── App.tsx                      # Main window manager
├── index.tsx                    # React DOM entry
├── index.html                   # HTML shell
└── vite.config.ts               # Build configuration
```

---

## 🔐 SECURITY FEATURES

- **Firebase Authentication**: Industry-standard OAuth 2.0
- **Scoped Firestore Rules**: Users can only access their own data
- **Password Re-authentication**: Required for sensitive operations
- **No Client-side Secrets**: Environment variables excluded from build
- **HTTPS Enforcement**: Firebase Hosting default

---

## 🎯 ROADMAP

### **Q1 2026**
- [ ] Google Calendar Integration
- [ ] Telegram Bot Notifications
- [ ] Voice Memo Journaling
- [ ] Dark Mode Auto-switching (based on time)

### **Q2 2026**
- [ ] Mobile App (React Native)
- [ ] Obsidian Sync Plugin
- [ ] Export to CSV/JSON
- [ ] API Webhooks for IFTTT

### **Q3 2026**
- [ ] Multi-user Family Accounts
- [ ] Shared Habit Challenges
- [ ] AI-Generated Weekly Reports (Gemini)
- [ ] Biometric Integration (Apple Health/Google Fit)

---

## 🤝 CONTRIBUTING

This is a personal cognitive system, but pull requests are welcome for:
- **Bug Fixes**: Firestore sync issues, UI glitches
- **New Widgets**: Additional dashboard components
- **Theme Contributions**: New color schemes
- **Performance Optimizations**: Firestore query improvements

### **Development Guidelines**
1. Follow existing naming conventions (`PascalCase` for components, `camelCase` for functions)
2. Use TypeScript strictly (no `any` types)
3. Test Firestore operations in isolation
4. Maintain widget modularity (no cross-widget dependencies)

---

## 📜 LICENSE

MIT License - See `LICENSE` file for details

---

## 🙏 ACKNOWLEDGMENTS

**Built with:**
- [Firebase](https://firebase.google.com/) — Backbone infrastructure
- [React Grid Layout](https://github.com/react-grid-layout/react-grid-layout) — Window management
- [Recharts](https://recharts.org/) — Data visualization
- [Lucide Icons](https://lucide.dev/) — Iconography
- [Catppuccin](https://github.com/catppuccin/catppuccin) — Color palette inspiration

**Philosophical Influences:**
- Stoicism (Marcus Aurelius, Epictetus)
- GTD (David Allen)
- Atomic Habits (James Clear)
- Deep Work (Cal Newport)

---

## 💬 SUPPORT

**Issues:** [GitHub Issues](https://github.com/Siddharthk17/nemesis-os/issues)  
**Discussions:** [GitHub Discussions](https://github.com/Siddharthk17/nemesis-os/discussions)  
**Email:** siddharthkakade7777@gmail.com

---

```
┌────────────────────────────────────────────────────┐
│                                                    │
│  "The only way to do great work is to love         │
│   what you do... and to log every single           │
│   transaction in a beautifully themed,             │
│   cloud-synced, terminal-inspired dashboard."      │
│                                                    │
│                         — Steve Jobs (probably)    │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Built by humans. Powered by discipline. Designed for those who treat life as a pull request.**

---

**Status:** `[ PRODUCTION READY ]` | **Version:** `v1.0.0` | **Last Updated:** January 2026
