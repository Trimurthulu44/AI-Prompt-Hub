import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isPublicLanding = location.pathname === '/' || location.pathname === '/home';
  const isLoginPage = location.pathname === '/login';

  const appNavLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Prompts', path: '/prompts' },
    { name: 'Evaluations', path: '/evaluations' },
    { name: 'Gate', path: '/gate' },
    { name: 'Analytics', path: '/analytics' },
  ];

  const publicNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/#features' },
    { name: 'Docs', path: '/#docs' },
    { name: 'About', path: '/#about' },
  ];

  return (
    <header className="bg-[#164e63] text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-2 text-white font-semibold text-lg hover:text-cyan-200 transition">
          <span className="font-bold tracking-tight">AI Prompt Hub</span>
        </Link>

        {/* Center Navigation Links (Matching Screenshot Tabs) */}
        <nav className="flex items-center space-x-8 text-sm font-medium">
          {isPublicLanding ? (
            publicNavLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                className="text-slate-200 hover:text-white transition"
              >
                {link.name}
              </a>
            ))
          ) : isLoginPage ? (
            <Link to="/" className="text-slate-200 hover:text-white transition">
              ← Back to Overview
            </Link>
          ) : (
            appNavLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`transition py-1 border-b-2 ${
                    isActive
                      ? 'border-white text-white font-semibold'
                      : 'border-transparent text-slate-200 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })
          )}
        </nav>

        {/* Right side controls */}
        <div className="flex items-center space-x-4 text-xs">
          {user ? (
            <div className="flex items-center space-x-3">
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded bg-cyan-950/60 text-cyan-200 border border-cyan-800 font-mono">
                {user.workspaceSlug}
              </span>
              <span className="font-medium text-slate-200">
                {user.name} ({user.role})
              </span>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="bg-cyan-900 hover:bg-cyan-800 text-white px-2.5 py-1 rounded transition"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold px-4 py-1.5 rounded-full shadow-sm transition"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
