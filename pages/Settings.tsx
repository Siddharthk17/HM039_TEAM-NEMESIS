import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { Card, Button } from '../components/UIComponents';
import { StorageService } from '../services/storageService';
import { Palette, Bell, Trash2, Monitor } from 'lucide-react';
import { auth } from '../services/firebase';

interface SettingsProps {
  user: UserProfile | null;
  onThemeChange?: (theme: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onThemeChange }) => {
  // State for immediate UI feedback
  const [currentTheme, setCurrentTheme] = useState('dracula');
  const [settings, setSettings] = useState<any>({ notifications: true, sound: false });

  // Use prop user id or auth current user
  const userId = user?.id || auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) return;
    const unsubscribe = StorageService.subscribeToSettings(userId, (data) => {
      setCurrentTheme(data.theme);
      setSettings(data.settings);
      if (onThemeChange) onThemeChange(data.theme);
    });
    return unsubscribe;
  }, [userId, onThemeChange]);

  // Themes Configuration
  const themes = [
    { id: 'dracula', name: 'Dracula', bg: '#1e1e2e', accent: '#cba6f7' },
    { id: 'aura', name: 'Aura', bg: '#15141b', accent: '#a277ff' },
    { id: 'gruvbox', name: 'Gruvbox', bg: '#1d2021', accent: '#fabd2f' },
    { id: 'tokyo', name: 'Tokyo', bg: '#24283b', accent: '#7aa2f7' },
  ];

  const handleThemeSelect = (themeId: string) => {
    setCurrentTheme(themeId);
    if (onThemeChange) onThemeChange(themeId);
    if (userId) StorageService.saveTheme(userId, themeId);
  };

  const toggleNotifications = () => {
    const newSettings = { ...settings, notifications: !settings.notifications };
    setSettings(newSettings);
    if (userId) StorageService.saveSettings(userId, newSettings);
  };

  const handleClearData = () => {
    if (confirm('WARNING: This will obliterate all locally stored data. Are you absolutely sure?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      
      {/* User Info */}
      <Card title="USER_CONFIG">
         <div className="space-y-4 font-mono text-sm">
            <div className="grid grid-cols-3 gap-4 border-b border-tui-overlay pb-2 opacity-50">
               <span className="text-tui-subtext">PARAMETER</span>
               <span className="col-span-2 text-tui-mauve font-bold">VALUE</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 items-center">
               <span className="text-tui-text">UID</span>
               <span className="col-span-2 text-tui-blue bg-tui-surface p-1 border border-tui-overlay">{userId}</span>
            </div>
            <div className="grid grid-cols-3 gap-4 items-center">
               <span className="text-tui-text">USER</span>
               <span className="col-span-2 text-tui-green bg-tui-surface p-1 border border-tui-overlay">"{user?.name || auth.currentUser?.displayName}"</span>
            </div>
            <div className="grid grid-cols-3 gap-4 items-center">
               <span className="text-tui-text">MAIL</span>
               <span className="col-span-2 text-tui-yellow bg-tui-surface p-1 border border-tui-overlay">"{user?.email || auth.currentUser?.email}"</span>
            </div>
         </div>
      </Card>

      {/* Theme Selector */}
      <Card title="VISUAL_MATRIX">
         <div className="space-y-4">
            <div className="flex items-center gap-2 text-tui-subtext mb-2">
               <Palette size={16} />
               <span className="text-xs font-bold uppercase tracking-wider">Interface Theme</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               {themes.map((theme) => (
                  <button 
                     key={theme.id}
                     onClick={() => handleThemeSelect(theme.id)}
                     className={`
                        relative p-4 border-2 flex flex-col items-center justify-center gap-3 transition-all
                        ${currentTheme === theme.id 
                           ? 'border-tui-mauve bg-tui-surface shadow-[4px_4px_0px_0px_rgba(var(--color-mauve),0.3)]' 
                           : 'border-tui-overlay hover:border-tui-subtext hover:bg-tui-surface'}
                     `}
                  >
                     {/* Color Swatch Preview */}
                     <div className="flex gap-2 p-2 rounded bg-black/20" style={{ backgroundColor: theme.bg }}>
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.bg, border: '1px solid rgba(255,255,255,0.2)' }}></div>
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.accent }}></div>
                     </div>
                     <span className={`font-bold text-sm ${currentTheme === theme.id ? 'text-tui-mauve' : 'text-tui-text'}`}>
                        {theme.name.toUpperCase()}
                     </span>
                     {currentTheme === theme.id && (
                        <div className="absolute top-2 right-2 text-tui-green text-[10px] font-bold">ACTIVE</div>
                     )}
                  </button>
               ))}
            </div>
         </div>
      </Card>

      {/* System Settings */}
      <Card title="SYSTEM_PREFS">
         <div className="space-y-2 font-mono text-sm">
            <div 
               onClick={toggleNotifications}
               className="flex justify-between items-center p-3 bg-tui-surface border-2 border-transparent hover:border-tui-overlay cursor-pointer select-none"
            >
               <div className="flex items-center gap-3">
                  <Bell size={16} className={settings.notifications ? "text-tui-yellow" : "text-tui-subtext"} />
                  <span className="text-tui-text font-bold">PUSH_NOTIFICATIONS</span>
               </div>
               <div className={`
                  w-10 h-5 rounded-full relative transition-colors
                  ${settings.notifications ? 'bg-tui-green' : 'bg-tui-overlay'}
               `}>
                  <div className={`
                     absolute top-1 w-3 h-3 rounded-full bg-tui-base transition-all
                     ${settings.notifications ? 'left-6' : 'left-1'}
                  `}></div>
               </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-tui-surface border-2 border-transparent hover:border-tui-overlay cursor-pointer opacity-50">
               <div className="flex items-center gap-3">
                  <Monitor size={16} className="text-tui-subtext" />
                  <span className="text-tui-text font-bold">HARDWARE_ACCEL</span>
               </div>
               <span className="text-xs text-tui-subtext">AUTO_DETECTED</span>
            </div>
         </div>
      </Card>

      {/* Danger Zone */}
      <div className="border-2 border-tui-red p-6 bg-tui-base relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Trash2 size={100} className="text-tui-red" />
         </div>
         <h3 className="text-tui-red font-bold mb-2 uppercase flex items-center gap-2">
            <Trash2 size={20} /> Danger Zone
         </h3>
         <p className="text-xs text-tui-subtext mb-6 max-w-lg">
            Initiating the database purge sequence will irreversibly delete all journals, habits, and financial records. This action bypasses the recycle bin.
         </p>
         <Button 
            onClick={handleClearData}
            variant="danger"
            className="w-full sm:w-auto"
         >
            INITIATE PURGE SEQUENCE
         </Button>
      </div>
    </div>
  );
};

export default Settings;