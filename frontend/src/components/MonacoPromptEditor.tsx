import React, { useState } from 'react';
import { PromptAnalysis, PromptOptimization } from '../types';
import { api } from '../services/api';

interface MonacoPromptEditorProps {
  versionNo: number;
  compareWithVersionNo?: number;
  content: string;
  baselineContent?: string;
  onContentChange?: (val: string) => void;
  onRunChecks?: () => void;
  onRollback?: () => void;
}

export const MonacoPromptEditor: React.FC<MonacoPromptEditorProps> = ({
  versionNo,
  compareWithVersionNo = 3,
  content,
  baselineContent,
  onContentChange,
  onRunChecks,
  onRollback
}) => {
  const [editorText, setEditorText] = useState(content);
  const [isDiffMode, setIsDiffMode] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<PromptAnalysis | null>(null);
  const [optimizing, setOptimizing] = useState(false);
  const [optimization, setOptimization] = useState<PromptOptimization | null>(null);

  const lines = editorText.split('\n');
  const baselineLines = (baselineContent || '').split('\n');

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditorText(e.target.value);
    if (onContentChange) onContentChange(e.target.value);
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    const res = await api.analyzePrompt(editorText);
    setAnalysis(res);
    setAnalyzing(false);
  };

  const handleOptimize = async () => {
    setOptimizing(true);
    const res = await api.optimizePrompt(editorText);
    setOptimization(res);
    setOptimizing(false);
  };

  const acceptOptimization = () => {
    if (optimization) {
      setEditorText(optimization.optimizedContent);
      if (onContentChange) onContentChange(optimization.optimizedContent);
      setOptimization(null);
    }
  };

  return (
    <div className="bg-[#1e293b] text-slate-100 rounded-xl overflow-hidden shadow-xl border border-slate-700 flex flex-col h-full">
      {/* Editor Title Bar */}
      <div className="bg-[#0f172a] px-4 py-2.5 border-b border-slate-700 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 font-mono">Monaco editor - v{versionNo}</span>
          {compareWithVersionNo && (
            <span className="text-slate-500 font-mono">(compare with v{compareWithVersionNo})</span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsDiffMode(!isDiffMode)}
            className={`px-2.5 py-1 rounded text-xs transition ${
              isDiffMode ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isDiffMode ? 'Unified Editor' : 'Side-by-Side Diff'}
          </button>
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="px-2.5 py-1 rounded bg-slate-800 text-cyan-300 hover:bg-slate-700 text-xs transition"
          >
            {analyzing ? 'Analyzing...' : 'AI Analyzer'}
          </button>
          <button
            onClick={handleOptimize}
            disabled={optimizing}
            className="px-2.5 py-1 rounded bg-amber-600 text-white hover:bg-amber-500 text-xs transition"
          >
            {optimizing ? 'Optimizing...' : 'AI Optimizer'}
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 p-4 font-mono text-sm leading-relaxed overflow-y-auto min-h-[280px]">
        {!isDiffMode ? (
          <div className="flex h-full">
            {/* Line Numbers */}
            <div className="select-none text-slate-500 pr-4 text-right border-r border-slate-700">
              {lines.map((_, i) => (
                <div key={i} className="text-xs leading-6">{i + 1}</div>
              ))}
            </div>

            {/* Editable Content */}
            <div className="flex-1 pl-4">
              <textarea
                value={editorText}
                onChange={handleTextChange}
                className="w-full h-full bg-transparent text-slate-100 resize-none outline-none font-mono text-sm leading-6"
                rows={Math.max(lines.length + 2, 10)}
                spellCheck={false}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 h-full">
            {/* Left: Baseline Version */}
            <div className="bg-[#0f172a]/70 p-3 rounded border border-slate-700/80">
              <div className="text-xs text-slate-400 font-semibold mb-2 border-b border-slate-700 pb-1">
                v{compareWithVersionNo} (Baseline)
              </div>
              <div className="text-xs space-y-1">
                {baselineLines.map((line, i) => (
                  <div key={i} className="text-slate-300 whitespace-pre-wrap">{line || '\u00A0'}</div>
                ))}
              </div>
            </div>

            {/* Right: Current Version with highlighted diff */}
            <div className="bg-[#0f172a]/70 p-3 rounded border border-emerald-900/60">
              <div className="text-xs text-emerald-400 font-semibold mb-2 border-b border-slate-700 pb-1 flex justify-between">
                <span>v{versionNo} (Current)</span>
                <span className="text-emerald-300">+1 token-entry guardrail</span>
              </div>
              <div className="text-xs space-y-1">
                {lines.map((line, i) => {
                  const isNew = i === lines.length - 1 || line.includes('{answer, confidence}');
                  return (
                    <div
                      key={i}
                      className={`whitespace-pre-wrap ${isNew ? 'bg-emerald-950/80 text-emerald-200 border-l-2 border-emerald-500 pl-1' : 'text-slate-300'}`}
                    >
                      {line || '\u00A0'}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Analysis Warning Banner */}
      {analysis && (
        <div className="bg-slate-900/90 border-t border-slate-700 p-3 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-cyan-300">Prompt Analyzer Findings:</span>
            <button onClick={() => setAnalysis(null)} className="text-slate-400 hover:text-white">✕</button>
          </div>
          <div className="space-y-1 text-slate-300">
            {analysis.securityRisks.map((risk, i) => (
              <div key={i} className="text-rose-400">⚠️ Risk: {risk}</div>
            ))}
            {analysis.missingInstructionFlags.map((flag, i) => (
              <div key={i} className="text-amber-400">💡 Missing: {flag}</div>
            ))}
            {analysis.improvementSuggestions.slice(0, 2).map((sug, i) => (
              <div key={i} className="text-emerald-300">✓ Suggestion: {sug}</div>
            ))}
          </div>
        </div>
      )}

      {/* Optimizer Result Modal/Drawer */}
      {optimization && (
        <div className="bg-slate-950 border-t border-amber-600/80 p-4 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-amber-400 text-sm">
              AI Optimizer Proposal ({optimization.estimatedTokenSavingsPercent}% Est. Token Savings)
            </span>
            <div className="space-x-2">
              <button
                onClick={acceptOptimization}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded font-semibold transition"
              >
                Accept Version
              </button>
              <button
                onClick={() => setOptimization(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded transition"
              >
                Reject
              </button>
            </div>
          </div>
          <div className="bg-[#0f172a] p-3 rounded text-slate-200 font-mono whitespace-pre-wrap border border-slate-700 mb-2">
            {optimization.optimizedContent}
          </div>
          <div className="flex flex-wrap gap-2 text-slate-400">
            {optimization.improvementsApplied.map((imp, idx) => (
              <span key={idx} className="bg-slate-800 px-2 py-0.5 rounded text-[11px] text-cyan-300 border border-slate-700">
                + {imp}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Editor Action Buttons (Matching Screenshot Fig 9.3) */}
      <div className="bg-[#0f172a] px-6 py-3 border-t border-slate-700 flex items-center justify-end space-x-4">
        <button
          onClick={onRunChecks}
          className="bg-[#2563eb] hover:bg-blue-600 text-white font-medium px-5 py-2 rounded-lg text-sm shadow transition"
        >
          Run Checks
        </button>
        <button
          onClick={onRollback}
          className="bg-[#ef4444] hover:bg-red-600 text-white font-medium px-5 py-2 rounded-lg text-sm shadow transition"
        >
          Rollback
        </button>
      </div>
    </div>
  );
};
