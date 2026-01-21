import React, { useState, useEffect } from 'react';
import { LogOut, Menu, X, Terminal, Wallet, BookOpen, CheckSquare, Brain, Settings, Layout, Plus, Eye, EyeOff } from 'lucide-react';
import { WindowState, WorkspaceType, WidgetType } from '../types';

interface SidebarProps {
  activeWorkspace: WorkspaceType;
  windows: WindowState[];
  onSwitchWorkspace: (ws: WorkspaceType) => void;
  onToggleWidget: (type: WidgetType) => void;
  onShowAll: () => void;
  onHideAll: () => void;
  onLogout: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeWorkspace, 
  windows, 
  onSwitchWorkspace, 
  onToggleWidget,
  onShowAll,
  onHideAll,
  onLogout, 
  mobileMenuOpen, 
  setMobileMenuOpen 
}) => {

  const workspaces: { id: WorkspaceType; label: string; icon: any }[] = [
    { id: 'dashboard', label: '~/dashboard', icon: Terminal },
    { id: 'finance', label: '~/finance', icon: Wallet },
    { id: 'journal', label: '~/journal', icon: BookOpen },
    { id: 'habits', label: '~/habits', icon: CheckSquare },
    { id: 'insights', label: '~/insights', icon: Brain },
    { id: 'settings', label: '~/config', icon: Settings },
  ];

  // Get widgets available in the current workspace
  const currentWidgets = windows.filter(w => w.workspace === activeWorkspace);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 w-full h-12 bg-tui-base border-b-2 border-tui-overlay z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
           <span className="text-tui-mauve font-bold">NEMESIS</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-tui-text">
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Desktop Sidebar (Dock) */}
      <div className={`
        fixed inset-y-0 left-0 z-[9999] w-64 bg-tui-base border-r-2 border-tui-overlay transform transition-transform duration-0 flex flex-col shadow-[4px_0px_10px_0px_rgba(0,0,0,0.2)]
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:h-screen
      `}>
        {/* Header */}
        <div className="h-14 flex items-center px-4 border-b-2 border-tui-overlay bg-tui-surface shrink-0">
          <div className="w-3 h-3 bg-tui-mauve mr-3 rounded-sm"></div>
          <h1 className="text-lg font-bold text-tui-text tracking-wide">NEME<span className="text-tui-mauve">SIS</span></h1>
        </div>

        {/* Workspaces */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <nav className="py-4 px-2 space-y-1 font-mono text-sm">
            <div className="px-3 pb-2 text-xs text-tui-subtext uppercase tracking-wider font-bold">Workspaces</div>
            
            {workspaces.map((item) => {
              const Icon = item.icon;
              const isActive = activeWorkspace === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSwitchWorkspace(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`
                    w-full text-left px-3 py-2 flex items-center gap-3 transition-all rounded-sm group
                    ${isActive
                      ? 'bg-tui-overlay/50 text-tui-mauve border-l-4 border-tui-mauve' 
                      : 'text-tui-subtext hover:text-tui-text hover:bg-tui-surface border-l-4 border-transparent'}
                  `}
                >
                  <Icon size={16} />
                  <span className="font-bold">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Active Workspace Widgets (Task Manager) */}
          <div className="mt-4 pt-4 border-t-2 border-tui-overlay px-2">
             <div className="px-3 pb-2 text-xs text-tui-subtext uppercase tracking-wider font-bold flex items-center justify-between group">
                <div className="flex items-center gap-2">
                   <Layout size={12} />
                   Running Tasks
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={onShowAll} title="Show All" className="hover:text-tui-mauve"><Eye size={12}/></button>
                   <button onClick={onHideAll} title="Hide All" className="hover:text-tui-mauve"><EyeOff size={12}/></button>
                </div>
             </div>
             <div className="space-y-1">
                {currentWidgets.map(w => (
                   <button
                      key={w.id}
                      onClick={() => onToggleWidget(w.componentType)}
                      className={`
                         w-full text-left px-3 py-1.5 text-xs font-mono flex items-center justify-between group hover:bg-tui-surface
                         ${w.isOpen && !w.isMinimized ? 'text-tui-green' : 'text-tui-subtext decoration-line-through opacity-70'}
                      `}
                   >
                      <span>{w.title}</span>
                      <div className={`w-1.5 h-1.5 rounded-full ${w.isOpen && !w.isMinimized ? 'bg-tui-green' : 'bg-tui-overlay'}`}></div>
                   </button>
                ))}
             </div>
          </div>
        </div>

        {/* System Status / Footer */}
        <div className="p-4 border-t-2 border-tui-overlay bg-tui-surface shrink-0">
          <div className="mb-4 text-xs font-mono text-tui-subtext grid grid-cols-2 gap-2">
             <div className="bg-tui-base p-1 text-center border border-tui-overlay">CPU: 12%</div>
             <div className="bg-tui-base p-1 text-center border border-tui-overlay">MEM: 4.2G</div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-2 py-2 bg-tui-red text-tui-base font-bold text-xs uppercase hover:bg-tui-maroon shadow-[2px_2px_0px_0px_rgba(0,0,0,0.4)] active:translate-y-0.5 active:shadow-none transition-all"
          >
            <LogOut size={14} />
            SHUTDOWN
          </button>
        </div>
      </div>
    </>
  );
};