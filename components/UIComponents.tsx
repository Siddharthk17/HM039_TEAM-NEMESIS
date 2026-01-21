import React from 'react';
import { Terminal, Minus, Square, X } from 'lucide-react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' }> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyles = "relative px-4 py-1.5 font-bold text-sm transition-transform active:translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    // Solid colored block, black text
    primary: "bg-tui-mauve text-tui-base hover:bg-tui-pink shadow-[2px_2px_0px_0px_rgba(0,0,0,0.4)]",
    // Bordered, colored text
    secondary: "bg-tui-surface border-2 border-tui-blue text-tui-blue hover:bg-tui-blue hover:text-tui-base",
    // Subtle
    ghost: "text-tui-subtext hover:text-tui-text hover:bg-tui-overlay",
    // Error
    danger: "bg-tui-red text-tui-base hover:bg-tui-maroon shadow-[2px_2px_0px_0px_rgba(0,0,0,0.4)]"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string; action?: React.ReactNode; }> = ({ 
  children, 
  className = '', 
  title, 
  action
}) => {
  return (
    <div className={`bg-tui-base border-2 border-tui-overlay flex flex-col overflow-hidden ${className}`}>
      {title && (
        <div className="bg-tui-overlay px-3 py-1 flex items-center justify-between shrink-0 select-none">
          <h3 className="text-xs font-bold uppercase text-tui-text tracking-wider flex items-center gap-2">
            <div className="flex gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-tui-red"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-tui-yellow"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-tui-green"></div>
            </div>
            <span className="ml-2 text-tui-blue">{title}</span>
          </h3>
          {action}
        </div>
      )}
      <div className="p-4 flex-1 overflow-auto custom-scrollbar relative">
        {children}
      </div>
    </div>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({ label, className = '', ...props }) => (
  <div className="w-full space-y-1">
    {label && <label className="block text-xs font-bold text-tui-blue uppercase tracking-wider">{label}</label>}
    <div className="relative group flex items-center">
      <input 
        className={`w-full bg-tui-surface border-2 border-tui-overlay p-2 text-tui-text focus:outline-none focus:border-tui-mauve transition-colors font-mono text-sm placeholder:text-tui-overlay ${className}`}
        {...props}
      />
    </div>
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; variant?: 'primary' | 'success' | 'warning' | 'neutral' }> = ({ children, variant = 'neutral' }) => {
   const styles = {
     primary: "bg-tui-mauve text-tui-base",
     success: "bg-tui-green text-tui-base",
     warning: "bg-tui-yellow text-tui-base",
     neutral: "bg-tui-overlay text-tui-subtext"
   }
   return (
    <span className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold uppercase ${styles[variant]}`}>
      {children}
    </span>
   );
};
