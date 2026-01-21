import React, { forwardRef } from 'react';
import { Minus, Square, X, Maximize2, Minimize2, Move } from 'lucide-react';
import { WindowState } from '../types';

interface WindowFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  window: WindowState;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  isEditing: boolean;
  children: React.ReactNode;
}

export const WindowFrame = forwardRef<HTMLDivElement, WindowFrameProps>(({
  window,
  onClose,
  onMinimize,
  onMaximize,
  isEditing,
  children,
  style,
  className,
  onMouseDown,
  onMouseUp,
  onTouchEnd,
  ...props
}, ref) => {
  
  const Header = () => (
    <div 
      className={`
        h-8 bg-tui-surface border-b-2 border-tui-overlay flex items-center justify-between px-3 select-none shrink-0 transition-colors
        ${isEditing && !window.isMaximized ? 'cursor-move drag-handle bg-tui-overlay/20 border-tui-subtext/50' : ''}
      `}
    >
      <div className="flex items-center gap-2">
        {/* RED: Close */}
        <button 
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="w-3 h-3 rounded-full bg-tui-red hover:bg-red-600 flex items-center justify-center group z-50 cursor-pointer"
          title="Close"
        >
           <X size={8} className="text-black opacity-0 group-hover:opacity-100" />
        </button>
        
        {/* YELLOW: Minimize OR Restore if Maximized */}
        <button 
           onMouseDown={(e) => e.stopPropagation()}
           onClick={(e) => { 
             e.stopPropagation(); 
             if (window.isMaximized) {
               // If full screen, Yellow button RESTORES to previous size/position (same as toggling max off)
               onMaximize(); 
             } else {
               // If normal, Yellow button MINIMIZES (hides)
               onMinimize();
             }
           }}
           className="w-3 h-3 rounded-full bg-tui-yellow hover:bg-yellow-500 flex items-center justify-center group z-50 cursor-pointer"
           title={window.isMaximized ? "Restore Down" : "Minimize"}
        >
           <Minus size={8} className="text-black opacity-0 group-hover:opacity-100" />
        </button>
        
        {/* GREEN: Maximize / Restore */}
        <button 
           onMouseDown={(e) => e.stopPropagation()}
           onClick={(e) => { e.stopPropagation(); onMaximize(); }}
           className="w-3 h-3 rounded-full bg-tui-green hover:bg-green-500 flex items-center justify-center group z-50 cursor-pointer"
           title={window.isMaximized ? "Restore Down" : "Maximize"}
        >
           {window.isMaximized ? 
             <Minimize2 size={8} className="text-black opacity-0 group-hover:opacity-100" /> : 
             <Maximize2 size={8} className="text-black opacity-0 group-hover:opacity-100" />
           }
        </button>
      </div>
      
      <div className="flex items-center gap-2">
         {isEditing && !window.isMaximized && <Move size={10} className="text-tui-subtext animate-pulse" />}
         <span className="text-xs font-bold text-tui-subtext uppercase tracking-wider font-mono truncate pointer-events-none">{window.title}</span>
      </div>
      
      <div className="w-10 flex justify-end">
        {isEditing && !window.isMaximized && (
          <div className="flex gap-0.5">
             <div className="w-0.5 h-3 bg-tui-subtext/50"></div>
             <div className="w-0.5 h-3 bg-tui-subtext/50"></div>
          </div>
        )}
      </div>
    </div>
  );

  // Maximized Mode (Absolute Overlay)
  if (window.isMaximized) {
    return (
      <div 
        className="absolute inset-0 z-[100] bg-tui-base border-2 border-tui-mauve flex flex-col animate-in fade-in zoom-in duration-200"
        style={{ margin: 0 }} 
      >
        <Header />
        <div className="flex-1 overflow-auto bg-tui-base relative custom-scrollbar p-2 flex flex-col">
          {children}
        </div>
      </div>
    );
  }

  // Grid Item Mode
  return (
    <div 
      ref={ref}
      style={style}
      className={`
        flex flex-col bg-tui-base border-2 shadow-tui transition-all duration-200
        ${className || ''} 
        ${isEditing 
           ? 'border-tui-subtext shadow-[0_0_15px_rgba(0,0,0,0.3)] z-50' 
           : 'border-tui-overlay hover:border-tui-overlay'
        }
      `}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchEnd={onTouchEnd}
      {...props}
    >
      <Header />
      <div className="flex-1 overflow-hidden bg-tui-base relative p-2 flex flex-col">
        {children}
      </div>
      
      {/* Visual Resize Handle (Bottom Right) */}
      {isEditing && (
        <div className="absolute bottom-0 right-0 w-4 h-4 z-[101] pointer-events-none">
          <svg viewBox="0 0 10 10" className="w-full h-full text-tui-mauve fill-current opacity-80">
            <path d="M10 10 L10 2 L2 10 Z" />
          </svg>
        </div>
      )}
    </div>
  );
});

WindowFrame.displayName = 'WindowFrame';