import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserChrome } from '../components/BrowserChrome';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('dev@acme-corp.com');
  const [password, setPassword] = useState('password123');
  const [workspace, setWorkspace] = useState('acme-corp');
  const [orgName, setOrgName] = useState('Acme Corp');
  const [adminName, setAdminName] = useState('Priya S.');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password, workspace);
      navigate('/dashboard');
    } catch {
      setError('Invalid login credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-4xl">
        <BrowserChrome url="ai-prompt-hub.app">
          {/* Split Screen matching Fig 9.2 exactly */}
          <div className="grid grid-cols-1 md:grid-cols-2 min-h-[520px]">
            {/* Left Panel: Deep Teal with { } circle badge */}
            <div className="bg-[#164e63] text-white p-10 flex flex-col items-center justify-center text-center relative">
              <div className="w-20 h-20 rounded-full border-2 border-cyan-400/50 flex items-center justify-center mb-6 bg-cyan-900/40 shadow-inner">
                <span className="text-3xl font-mono text-cyan-300 font-bold tracking-wider">{`{ }`}</span>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
                AI Prompt Hub
              </h2>

              <p className="text-xs text-cyan-200/90 font-light max-w-xs">
                Govern, test and gate prompt changes
              </p>

              {/* Demo quick credential helper */}
              <div className="mt-8 pt-6 border-t border-cyan-800/80 text-[11px] text-cyan-200/80 text-left w-full max-w-xs space-y-1">
                <div className="font-semibold text-white mb-1">Demo Preconfigured Users:</div>
                <div>• Admin: <span className="font-mono text-cyan-100">priya@acme-corp.com</span></div>
                <div>• Dev: <span className="font-mono text-cyan-100">arun@acme-corp.com</span></div>
                <div>• Viewer: <span className="font-mono text-cyan-100">ravi@acme-corp.com</span></div>
                <div className="text-slate-300 mt-1">Password: <span className="font-mono">password123</span></div>
              </div>
            </div>

            {/* Right Panel: White Card Sign In / Register Form */}
            <div className="bg-white p-8 sm:p-12 flex flex-col justify-center">
              <div className="max-w-sm w-full mx-auto">
                <h3 className="text-2xl font-bold text-slate-900 mb-1">
                  {isRegister ? 'Register workspace' : 'Welcome back'}
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  {isRegister ? 'Create an isolated company environment' : 'Sign in to your company workspace'}
                </p>

                {error && (
                  <div className="bg-red-50 text-red-600 text-xs p-2.5 rounded mb-4 border border-red-200">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {isRegister && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Organization Name</label>
                        <input
                          type="text"
                          required
                          value={orgName}
                          onChange={(e) => setOrgName(e.target.value)}
                          placeholder="e.g. Acme Corp"
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-cyan-700 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Admin Full Name</label>
                        <input
                          type="text"
                          required
                          value={adminName}
                          onChange={(e) => setAdminName(e.target.value)}
                          placeholder="e.g. Priya Sharma"
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-cyan-700 outline-none"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Work email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="dev@acme-corp.com"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-cyan-700 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-cyan-700 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Workspace</label>
                    <input
                      type="text"
                      required
                      value={workspace}
                      onChange={(e) => setWorkspace(e.target.value)}
                      placeholder="acme-corp"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-cyan-700 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#164e63] hover:bg-[#0e3b4b] text-white font-medium py-2.5 rounded text-xs transition duration-150 shadow mt-2"
                  >
                    {loading ? 'Signing in...' : isRegister ? 'Register Organization' : 'Sign In'}
                  </button>
                </form>

                <div className="mt-6 text-center text-xs text-slate-500">
                  <button
                    type="button"
                    onClick={() => setIsRegister(!isRegister)}
                    className="text-cyan-800 hover:underline font-medium"
                  >
                    {isRegister ? 'Already have an account? Sign In' : 'New organization? Register workspace'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </BrowserChrome>
      </div>
    </div>
  );
};
