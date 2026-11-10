import React, { useState, useEffect } from 'react';
import { BrowserChrome } from '../components/BrowserChrome';
import { AnalyticsSummary } from '../types';
import { api, fallbackAnalytics } from '../services/api';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsSummary>(fallbackAnalytics);

  useEffect(() => {
    const load = async () => {
      const res = await api.getAnalytics();
      setData(res);
    };
    load();
  }, []);

  // Helper to render responsive clean SVG line chart matching screenshot curves
  const renderLineChart = (
    points: number[],
    color: string,
    strokeColor: string,
    dotColor: string
  ) => {
    const min = Math.min(...points) * 0.95;
    const max = Math.max(...points) * 1.05;
    const range = max - min || 1;
    const width = 450;
    const height = 140;
    const padding = 20;

    const coords = points.map((val, idx) => {
      const x = padding + (idx / (points.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((val - min) / range) * (height - 2 * padding);
      return { x, y, val };
    });

    const pathData = coords.reduce((acc, curr, idx) => {
      return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
    }, '');

    return (
      <div className="w-full h-44 flex items-center justify-center">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          {/* Subtle grid line */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#f1f5f9" strokeWidth="1" />
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#f1f5f9" strokeWidth="1" />

          {/* Sparkline curve */}
          <path
            d={pathData}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Dots on line points */}
          {coords.map((c, i) => (
            <circle
              key={i}
              cx={c.x}
              cy={c.y}
              r="3.5"
              fill={dotColor}
              stroke="#ffffff"
              strokeWidth="1.5"
            />
          ))}
        </svg>
      </div>
    );
  };

  const history = data.history30Days;
  const qualityPoints = history.map((h) => h.qualityScore);
  const tokenPoints = history.map((h) => h.avgTokens);
  const costPoints = history.map((h) => h.costPer1kRs);
  const latencyPoints = history.map((h) => h.latencyMs);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <BrowserChrome url="ai-prompt-hub.app">
        <div className="bg-[#f8fafc] min-h-[620px] p-6 sm:p-8 flex flex-col">
          {/* Subheader matching Screenshot Fig 9.8 */}
          <div className="mb-6 pb-3 border-b border-slate-200">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Analytics &middot; token usage, cost, latency and quality (last 30 days)
            </h2>
          </div>

          {/* 4 Charts 2x2 Grid matching Screenshot Fig 9.8 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
            {/* Chart 1: Quality score (upward trending green/teal) */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-xs sm:text-sm text-slate-800">Quality score</span>
                <span className="font-mono text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-100">
                  {data.currentQualityScore}
                </span>
              </div>
              {renderLineChart(qualityPoints, '#10b981', '#059669', '#047857')}
              <div className="text-[11px] text-slate-400 flex justify-between mt-2 pt-2 border-t border-slate-50">
                <span>Day 1: 0.78</span>
                <span className="text-emerald-600 font-medium">+14.1% Quality Gain</span>
                <span>Day 30: 0.89</span>
              </div>
            </div>

            {/* Chart 2: Avg tokens per reply (downward trending blue) */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-xs sm:text-sm text-slate-800">Avg tokens per reply</span>
                <span className="font-mono text-sm font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100">
                  {data.currentAvgTokens}
                </span>
              </div>
              {renderLineChart(tokenPoints, '#3b82f6', '#2563eb', '#1d4ed8')}
              <div className="text-[11px] text-slate-400 flex justify-between mt-2 pt-2 border-t border-slate-50">
                <span>Day 1: 520</span>
                <span className="text-blue-600 font-medium">-20.8% Token Reduction</span>
                <span>Day 30: 412</span>
              </div>
            </div>

            {/* Chart 3: Cost per 1K calls (Rs) (downward trending amber/orange) */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-xs sm:text-sm text-slate-800">Cost per 1K calls (Rs)</span>
                <span className="font-mono text-sm font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-100">
                  {data.currentCostPer1kRs}
                </span>
              </div>
              {renderLineChart(costPoints, '#ea580c', '#d97706', '#b45309')}
              <div className="text-[11px] text-slate-400 flex justify-between mt-2 pt-2 border-t border-slate-50">
                <span>Day 1: ₹34</span>
                <span className="text-amber-600 font-medium">-23.5% Cost Savings</span>
                <span>Day 30: ₹26</span>
              </div>
            </div>

            {/* Chart 4: Latency (ms) (downward trending purple/teal) */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-xs sm:text-sm text-slate-800">Latency (ms)</span>
                <span className="font-mono text-sm font-bold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-100">
                  {data.currentLatencyMs}
                </span>
              </div>
              {renderLineChart(latencyPoints, '#8b5cf6', '#7c3aed', '#6d28d9')}
              <div className="text-[11px] text-slate-400 flex justify-between mt-2 pt-2 border-t border-slate-50">
                <span>Day 1: 1050ms</span>
                <span className="text-purple-600 font-medium">-24.8% Latency Drop</span>
                <span>Day 30: 790ms</span>
              </div>
            </div>
          </div>
        </div>
      </BrowserChrome>
    </div>
  );
};
