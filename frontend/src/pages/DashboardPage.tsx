import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BrowserChrome } from '../components/BrowserChrome';
import { StatusPill } from '../components/StatusPill';
import { useAuth } from '../context/AuthContext';
import { PromptItem, AuditLogItem } from '../types';
import { api, fallbackPrompt, fallbackAuditLogs } from '../services/api';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [prompts, setPrompts] = useState<PromptItem[]>([fallbackPrompt]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(fallbackAuditLogs);

  useEffect(() => {
    const load = async () => {
      const p = await api.getPrompts();
      const a = await api.getAuditLogs();
      setPrompts(p);
      setAuditLogs(a);
    };
    load();
  }, []);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <BrowserChrome url="ai-prompt-hub.app/dashboard">
        <div className="bg-[#f8fafc] min-h-[600px] p-6 sm:p-8 space-y-6">
          {/* Welcome & Organization Overview Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
            <div>
              <span className="text-[11px] font-bold text-cyan-800 uppercase tracking-wider bg-cyan-50 border border-cyan-200 px-2.5 py-0.5 rounded-full">
                Workspace: {user?.workspaceSlug || 'acme-corp'}
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                Enterprise Prompt Governance Overview
              </h2>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <Link
                to="/prompts"
                className="bg-[#164e63] hover:bg-[#0e3b4b] text-white px-4 py-2 rounded-lg font-medium shadow-sm transition"
              >
                Manage Prompts & Lineage
              </Link>
              <Link
                to="/gate"
                className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-4 py-2 rounded-lg font-semibold shadow-sm transition"
              >
                CI/CD Quality Gate
              </Link>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500">Active Applications</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">3</div>
              <span className="text-[11px] text-cyan-800 font-medium">Production &bull; Staging &bull; Dev</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500">Governed Prompts</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">5</div>
              <span className="text-[11px] text-emerald-600 font-medium">100% Versioned Lineage</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500">Quality Score S(v)</span>
              <div className="text-2xl font-bold text-emerald-600 font-mono mt-1">0.89</div>
              <span className="text-[11px] text-slate-400">Target &ge; 0.85 (Passing)</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500">Active Quality Gate</span>
              <div className="text-2xl font-bold text-red-600 font-mono mt-1">BLOCKED</div>
              <span className="text-[11px] text-red-500 font-medium">1 probe failure (role override)</span>
            </div>
          </div>

          {/* 2-Column Section: Managed Prompts & Recent Audit Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Managed Prompts */}
            <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-sm">Enterprise Prompt Assets</h3>
                <Link to="/prompts" className="text-xs text-cyan-800 hover:underline">
                  View full editor &rarr;
                </Link>
              </div>

              <div className="space-y-3 flex-1">
                {prompts.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-lg border border-slate-150 hover:border-slate-300 transition flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-xs text-slate-900 font-mono">{p.name}</span>
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-mono">
                          v{p.latestVersionNo}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{p.description}</p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <StatusPill status={p.latestStatus} size="sm" />
                      <Link
                        to="/prompts"
                        className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded transition"
                      >
                        Inspect
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit Logs Trail */}
            <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-sm">Governance Audit Trail</h3>
                <Link to="/audit" className="text-xs text-cyan-800 hover:underline">
                  All events &rarr;
                </Link>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px]">
                {auditLogs.map((log) => (
                  <div key={log.id} className="text-xs p-2.5 rounded bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between font-medium text-slate-800 mb-1">
                      <span className="font-mono text-cyan-800">{log.action}</span>
                      <span className="text-[10px] text-slate-400">{log.developer}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 truncate">{log.details}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </BrowserChrome>
    </div>
  );
};
