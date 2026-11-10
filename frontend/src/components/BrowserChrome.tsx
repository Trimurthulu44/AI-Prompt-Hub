import React from 'react';

interface BrowserChromeProps {
  url?: string;
  children: React.ReactNode;
  className?: string;
}

export const BrowserChrome: React.FC<BrowserChromeProps> = ({
  url = 'ai-prompt-hub.app',
  children,
  className = ''
}) => {
  return (
    <div className={`rounded-xl overflow-hidden border border-slate-200/80 shadow-2xl bg-white ${className}`}>
      {/* Top browser bar */}
      <div className="bg-[#f1f5f9] px-4 py-2.5 border-b border-slate-200 flex items-center justify-between select-none">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
          <div className="w-3 h-3 rounded-full bg-[#eab308]" />
          <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
        </div>

        <div className="bg-white px-6 py-1 rounded-full text-xs font-mono text-slate-500 border border-slate-200 shadow-sm flex items-center space-x-1">
          <span className="text-slate-400">🔒</span>
          <span>{url}</span>
        </div>

        <div className="w-12"></div>
      </div>

      {/* Viewport content */}
      <div>{children}</div>
    </div>
  );
};
