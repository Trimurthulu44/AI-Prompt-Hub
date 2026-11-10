import React, { useState, useEffect } from 'react';
import { BrowserChrome } from '../components/BrowserChrome';
import { AuditLogItem } from '../types';
import { api, fallbackAuditLogs } from '../services/api';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>(fallbackAuditLogs);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const load = async () => {
      const data = await api.getAuditLogs();
      setLogs(data);
    };
    load();
  }, []);

  const filtered = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(filter.toLowerCase()) ||
      l.developer.toLowerCase().includes(filter.toLowerCase()) ||
      l.details.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <BrowserChrome url="ai-prompt-hub.app/audit">
        <div className="bg-white min-h-[600px] p-6 sm:p-8 flex flex-col">
          <div className="mb-6 pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Enterprise Audit Logs & Governance
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Immutable trace of every version creation, rollback, quality gate evaluation, API key rotation, and user action.
              </p>
            </div>

            <div className="w-full sm:w-64">
              <input
                type="text"
                placeholder="Filter audit events..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded outline-none focus:ring-1 focus:ring-cyan-700 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Table matching Enterprise SaaS design */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{log.createdAt}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{log.developer}</td>
                    <td className="py-3 px-4">
                      <span className="bg-cyan-50 text-cyan-800 border border-cyan-200 px-2 py-0.5 rounded font-bold">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-sans text-xs">{log.details}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-emerald-600 font-bold font-sans text-xs">Logged</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </BrowserChrome>
    </div>
  );
};
