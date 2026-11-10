import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-semibold text-white">AI Prompt Hub</span> &copy; 2026. Enterprise Full-Stack Prompt Governance Platform.
        </div>
        <div className="flex items-center space-x-6 text-slate-400">
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#workflow" className="hover:text-white transition">Workflow</a>
          <a href="#docs" className="hover:text-white transition">API Docs</a>
          <a href="#about" className="hover:text-white transition">System Architecture</a>
        </div>
      </div>
    </footer>
  );
};
