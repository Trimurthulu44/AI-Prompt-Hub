import React, { useState, useEffect } from 'react';
import { BrowserChrome } from '../components/BrowserChrome';
import { EvaluationSummary, SecuritySummary } from '../types';
import { api, fallbackEvaluation, fallbackSecurity } from '../services/api';

export const EvaluationSecurityPage: React.FC = () => {
  const [evalData, setEvalData] = useState<EvaluationSummary>(fallbackEvaluation);
  const [securityData, setSecurityData] = useState<SecuritySummary>(fallbackSecurity);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const load = async () => {
      const e = await api.getEvaluation('v4');
      const s = await api.getSecurity('v4');
      setEvalData(e);
      setSecurityData(s);
    };
    load();
  }, []);

  const handleRunEvaluation = async () => {
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
    }, 1000);
  };

  const criteria = [
    { name: 'Correctness', weight: '0.40', score: evalData.correctness },
    { name: 'Relevance', weight: '0.20', score: evalData.relevance },
    { name: 'Instruction following', weight: '0.25', score: evalData.instructionFollowing },
    { name: 'Format', weight: '0.15', score: evalData.formatScore },
  ];

  const probes = [
    { name: 'Prompt injection', passed: securityData.promptInjectionPassed },
    { name: 'System-prompt leakage', passed: securityData.systemLeakagePassed },
    { name: 'PII exposure', passed: securityData.piiExposurePassed },
    { name: 'Role override', passed: securityData.roleOverridePassed },
    { name: 'Unsafe content', passed: securityData.unsafeContentPassed },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <BrowserChrome url="ai-prompt-hub.app">
        <div className="bg-[#f8fafc] min-h-[600px] p-6 sm:p-8 flex flex-col">
          {/* Subheader matching Screenshot Fig 9.6 */}
          <div className="mb-6 flex flex-wrap items-center justify-between pb-3 border-b border-slate-200">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Evaluation, Security and Regression &middot; <span className="font-mono text-cyan-800">customer-support-system v4</span>
            </h2>
            <button
              onClick={handleRunEvaluation}
              disabled={running}
              className="bg-[#164e63] hover:bg-[#0f3d47] text-white px-4 py-1.5 rounded text-xs font-medium shadow-sm transition"
            >
              {running ? 'Evaluating (50 cases)...' : 'Re-run Evaluation Suite'}
            </button>
          </div>

          {/* Top 4 KPI Metric Cards matching Screenshot Fig 9.6 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm text-center">
              <span className="text-xs text-slate-500 font-medium block mb-2">Quality score</span>
              <span className="text-3xl font-extrabold text-[#10b981] font-mono tracking-tight">
                {evalData.qualityScore}
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm text-center">
              <span className="text-xs text-slate-500 font-medium block mb-2">Regression delta</span>
              <span className="text-3xl font-extrabold text-[#10b981] font-mono tracking-tight">
                +0.03
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm text-center">
              <span className="text-xs text-slate-500 font-medium block mb-2">Security probes failed</span>
              <span className="text-3xl font-extrabold text-[#ea580c] font-mono tracking-tight">
                {securityData.failedProbesCount} / {securityData.totalProbesCount}
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm text-center">
              <span className="text-xs text-slate-500 font-medium block mb-2">Avg tokens / reply</span>
              <span className="text-3xl font-extrabold text-slate-800 font-mono tracking-tight">
                412
              </span>
            </div>
          </div>

          {/* Lower 2-Column Section matching Screenshot Fig 9.6 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
            {/* Left Card: Judge scores per criterion (golden dataset, 50 cases) */}
            <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
                  <h3 className="font-bold text-slate-800 text-sm">
                    Judge scores per criterion (golden dataset, 50 cases)
                  </h3>
                  <span className="text-[11px] font-mono text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-100">
                    S(v) = 0.89
                  </span>
                </div>

                <div className="space-y-6">
                  {criteria.map((c) => (
                    <div key={c.name}>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-medium text-slate-700">
                          {c.name} <span className="text-slate-400 font-normal">({c.weight})</span>
                        </span>
                        <span className="font-mono font-semibold text-slate-900">{c.score}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden">
                        <div
                          className="bg-[#164e63] h-full rounded-full transition-all duration-500"
                          style={{ width: `${c.score * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 text-[11px] text-slate-500">
                Formula: <span className="font-mono text-slate-700">0.40(Corr) + 0.20(Rel) + 0.25(Instr) + 0.15(Fmt)</span>
              </div>
            </div>

            {/* Right Card: Security probes */}
            <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
                  <h3 className="font-bold text-slate-800 text-sm">
                    Security probes
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">20 Automated Probes</span>
                </div>

                <div className="space-y-4">
                  {probes.map((probe) => (
                    <div
                      key={probe.name}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-150"
                    >
                      <span className="text-xs font-medium text-slate-800">
                        {probe.name}
                      </span>
                      <span
                        className={`text-xs px-5 py-1 rounded-full font-medium shadow-sm min-w-[70px] text-center ${
                          probe.passed
                            ? 'bg-[#10b981] text-white'
                            : 'bg-[#ef4444] text-white'
                        }`}
                      >
                        {probe.passed ? 'Pass' : 'Fail'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alert box for failed probe */}
              {!securityData.roleOverridePassed && (
                <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                  <div className="font-semibold mb-0.5">Role override probe triggered:</div>
                  <div className="text-[11px] text-red-600">Model broke role boundaries when prompted with malicious framing.</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </BrowserChrome>
    </div>
  );
};
