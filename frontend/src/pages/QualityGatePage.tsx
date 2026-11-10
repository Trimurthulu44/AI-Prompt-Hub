import React, { useState, useEffect } from 'react';
import { BrowserChrome } from '../components/BrowserChrome';
import { GateDecision } from '../types';
import { api, fallbackGateDecision } from '../services/api';

export const QualityGatePage: React.FC = () => {
  const [decision, setDecision] = useState<GateDecision>(fallbackGateDecision);

  useEffect(() => {
    const load = async () => {
      const d = await api.getGateDecision('v4');
      setDecision(d);
    };
    load();
  }, []);

  const checks = [
    {
      condition: 'Quality score S(v) ≥ 0.85',
      measured: '0.89',
      passed: true
    },
    {
      condition: 'Regression delta Δ ≥ -0.02',
      measured: '+0.03',
      passed: true
    },
    {
      condition: 'Security probes failed ≤ 5% and no critical',
      measured: '1 of 20 (role override)',
      passed: false
    },
    {
      condition: 'Average tokens per reply ≤ 500',
      measured: '412',
      passed: true
    }
  ];

  const recentRuns = [
    { version: 'v4', pillText: 'Blocked – security', pillBg: 'bg-[#ef4444]', desc: 'Failed role override probe' },
    { version: 'v3', pillText: 'Passed – deployed', pillBg: 'bg-[#10b981]', desc: 'Approved for production traffic' },
    { version: 'v2', pillText: 'Blocked – quality', pillBg: 'bg-[#ef4444]', desc: 'Quality score 0.82 below 0.85' }
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <BrowserChrome url="ai-prompt-hub.app">
        <div className="bg-[#f8fafc] min-h-[620px] p-6 sm:p-8 flex flex-col">
          {/* Subheader matching Screenshot Fig 9.7 */}
          <div className="mb-6 pb-3 border-b border-slate-200">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Quality Gate Decision &middot; <span className="font-mono text-cyan-800">customer-support-system v4</span> &middot; Production
            </h2>
          </div>

          {/* Top 2 Cards matching Screenshot Fig 9.7 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            {/* Top Left Card: DEPLOYMENT BLOCKED */}
            <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-red-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-[#ef4444] tracking-tight mb-4">
                  DEPLOYMENT BLOCKED
                </h3>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="text-slate-800 font-medium">
                    <span className="text-slate-500 font-normal">Reason: </span>
                    Security probes failed (role override)
                  </div>

                  <div className="text-cyan-900 font-medium bg-cyan-50/80 p-3 rounded-lg border border-cyan-100">
                    <span className="text-cyan-700 font-semibold">Action: </span>
                    Add explicit role boundary instruction in prompt v5
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                Decision evaluated via CI/CD webhook &middot; Build exit code 1
              </div>
            </div>

            {/* Top Right Card: Threshold checks */}
            <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 text-sm mb-4 pb-2 border-b border-slate-100">
                Threshold checks
              </h3>

              <div className="space-y-3.5">
                {checks.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs p-2 rounded hover:bg-slate-50 transition"
                  >
                    <span className="text-slate-700 font-mono text-[11px] sm:text-xs">
                      {c.condition}
                    </span>

                    <div className="flex items-center space-x-2">
                      <span className={`font-mono font-semibold ${c.passed ? 'text-slate-900' : 'text-red-600'}`}>
                        {c.measured}
                      </span>
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${c.passed ? 'bg-[#10b981]' : 'bg-[#ef4444]'}`}>
                        {c.passed ? '✓' : '✕'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Card: Recent gate runs matching Screenshot Fig 9.7 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex-1">
            <h3 className="font-bold text-slate-800 text-sm mb-4 pb-2 border-b border-slate-100">
              Recent gate runs
            </h3>

            <div className="space-y-3">
              {recentRuns.map((run) => (
                <div
                  key={run.version}
                  className="flex items-center justify-between p-3.5 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50/50"
                >
                  <div className="flex items-center space-x-4">
                    <span className="font-mono font-bold text-sm text-slate-900 w-8">
                      {run.version}
                    </span>
                    <span className="text-xs text-slate-500 hidden sm:inline">
                      {run.desc}
                    </span>
                  </div>

                  <div>
                    <span
                      className={`${run.pillBg} text-white text-xs px-6 py-1.5 rounded-full font-medium shadow-sm min-w-[150px] inline-block text-center`}
                    >
                      {run.pillText}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </BrowserChrome>
    </div>
  );
};
