import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserChrome } from '../components/BrowserChrome';
import { MonacoPromptEditor } from '../components/MonacoPromptEditor';
import { StatusPill } from '../components/StatusPill';
import { PromptItem, PromptVersion } from '../types';
import { api, fallbackPrompt, fallbackVersions } from '../services/api';

export const PromptVersionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState<PromptItem>(fallbackPrompt);
  const [versions, setVersions] = useState<PromptVersion[]>(fallbackVersions);
  const [selectedVersionNo, setSelectedVersionNo] = useState<number>(4);
  const [newVersionModal, setNewVersionModal] = useState<boolean>(false);
  const [newContent, setNewContent] = useState<string>('');
  const [newInstruction, setNewInstruction] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      const prompts = await api.getPrompts();
      if (prompts.length > 0) {
        setPrompt(prompts[0]);
        const vers = await api.getVersions(prompts[0].id);
        setVersions(vers);
      }
    };
    load();
  }, []);

  const currentVersion = versions.find((v) => v.versionNo === selectedVersionNo) || versions[0];
  const baselineVersion = versions.find((v) => v.versionNo === 3) || versions[1] || versions[0];

  const handleRunChecks = () => {
    navigate('/gate');
  };

  const handleRollback = async () => {
    if (window.confirm(`Are you sure you want to rollback to v1?`)) {
      const res = await api.rollbackVersion(prompt.id, 1);
      const updated = await api.getVersions(prompt.id);
      setVersions(updated);
      setSelectedVersionNo(1);
    }
  };

  const handleCreateNewVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    const created = await api.createVersion(prompt.id, newContent, newInstruction || 'Update prompt');
    const updated = await api.getVersions(prompt.id);
    setVersions(updated);
    setSelectedVersionNo(created.versionNo);
    setNewVersionModal(false);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <BrowserChrome url="ai-prompt-hub.app">
        <div className="bg-white min-h-[620px] flex flex-col">
          {/* Subheader bar matching Screenshot Fig 9.3 */}
          <div className="bg-[#f8fafc] px-6 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-700">
            <div className="font-medium space-x-1">
              <span>Prompt: <strong className="text-slate-900 font-semibold">{prompt.name}</strong></span>
              <span className="text-slate-400">|</span>
              <span>Project: <strong className="text-slate-900 font-semibold">{prompt.projectName}</strong></span>
              <span className="text-slate-400">|</span>
              <span>Env: <strong className="text-slate-900 font-semibold">{prompt.environment}</strong></span>
            </div>

            <div className="flex items-center space-x-3 mt-2 sm:mt-0">
              <button
                onClick={() => {
                  setNewContent(currentVersion.content);
                  setNewVersionModal(true);
                }}
                className="bg-[#164e63] hover:bg-[#0e3a49] text-white px-3 py-1.5 rounded text-xs font-medium shadow-sm transition"
              >
                + Create Version
              </button>
            </div>
          </div>

          {/* Main 2-column layout matching Screenshot Fig 9.3 */}
          <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 bg-[#f8fafc]">
            {/* Left Column: Version history (matching Fig 9.3) */}
            <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                <h3 className="font-semibold text-slate-800 text-sm">Version history</h3>
                <span className="text-[11px] text-slate-400 font-mono">{versions.length} total versions</span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto">
                {versions.map((ver) => {
                  const isSelected = ver.versionNo === selectedVersionNo;
                  return (
                    <div
                      key={ver.id || ver.versionNo}
                      onClick={() => setSelectedVersionNo(ver.versionNo)}
                      className={`p-3.5 rounded-lg border cursor-pointer transition flex items-center justify-between ${
                        isSelected
                          ? 'border-cyan-700 bg-cyan-50/40 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="font-bold text-slate-900 text-sm font-mono mt-0.5">
                          v{ver.versionNo}
                        </span>
                        <div>
                          <p className="text-xs font-medium text-slate-800 leading-snug">
                            {ver.changeInstruction || 'Prompt modification'}
                          </p>
                          <span className="text-[11px] text-slate-400">
                            {ver.createdBy} &bull; {ver.createdAt}
                          </span>
                        </div>
                      </div>

                      <div className="pl-2 flex-shrink-0">
                        <StatusPill status={ver.status} size="sm" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Monaco editor (matching Fig 9.3) */}
            <div className="lg:col-span-7 flex flex-col">
              <MonacoPromptEditor
                versionNo={currentVersion.versionNo}
                compareWithVersionNo={currentVersion.versionNo > 1 ? currentVersion.versionNo - 1 : undefined}
                content={currentVersion.content}
                baselineContent={baselineVersion.content}
                onRunChecks={handleRunChecks}
                onRollback={handleRollback}
              />
            </div>
          </div>
        </div>
      </BrowserChrome>

      {/* New Version Modal */}
      {newVersionModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-lg mb-1">Create Prompt Version</h3>
            <p className="text-xs text-slate-500 mb-4">
              Submitting creates an immutable version (v{versions.length + 1}) with git-like lineage and author attribution.
            </p>

            <form onSubmit={handleCreateNewVersion} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Change Instruction</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Add role override defense and JSON formatting"
                  value={newInstruction}
                  onChange={(e) => setNewInstruction(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded outline-none focus:ring-1 focus:ring-cyan-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Prompt Content</label>
                <textarea
                  rows={6}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full text-xs font-mono p-3 border border-slate-300 rounded outline-none focus:ring-1 focus:ring-cyan-700 leading-relaxed"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setNewVersionModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-medium bg-[#164e63] text-white rounded hover:bg-[#0f3d47] transition shadow"
                >
                  Submit Version
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
