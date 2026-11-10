import React, { useState, useEffect } from 'react';
import { BrowserChrome } from '../components/BrowserChrome';
import { WorkspaceDetails, Role } from '../types';
import { api, fallbackWorkspace } from '../services/api';

export const WorkspaceRolesPage: React.FC = () => {
  const [workspace, setWorkspace] = useState<WorkspaceDetails>(fallbackWorkspace);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [inviteModal, setInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<Role>('DEVELOPER');

  useEffect(() => {
    const load = async () => {
      const data = await api.getWorkspace();
      setWorkspace(data);
    };
    load();
  }, []);

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRotateKey = (appId: string) => {
    const prefix = 'aph_live_';
    const newRaw = prefix + Math.random().toString(36).substring(2, 12) + '...' + Math.random().toString(36).substring(2, 5);
    setWorkspace((prev) => ({
      ...prev,
      applications: prev.applications.map((app) =>
        app.id === appId ? { ...app, maskedApiKey: newRaw, apiKey: newRaw } : app
      )
    }));
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) return;
    setWorkspace((prev) => ({
      ...prev,
      teamMembers: [
        ...prev.teamMembers,
        { id: `u-${Date.now()}`, name: inviteName, email: inviteEmail, role: inviteRole }
      ]
    }));
    setInviteModal(false);
    setInviteName('');
    setInviteEmail('');
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <BrowserChrome url="ai-prompt-hub.app">
        <div className="bg-white min-h-[580px] p-6 sm:p-8 flex flex-col">
          {/* Subheader Title matching Screenshot Fig 9.5 */}
          <div className="mb-6 pb-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Workspace: <span className="font-mono text-cyan-800">{workspace.workspaceSlug}</span> &middot; Applications, API keys and roles
            </h2>
            <button
              onClick={() => setInviteModal(true)}
              className="bg-[#164e63] hover:bg-[#0f3d47] text-white px-3 py-1.5 rounded text-xs font-medium shadow-sm transition"
            >
              + Invite Member
            </button>
          </div>

          {/* 2-Column Grid matching Screenshot Fig 9.5 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
            {/* Left Card: Applications and API keys */}
            <div className="bg-[#f8fafc] p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
              <h3 className="font-bold text-slate-800 text-sm mb-6">
                Applications and API keys
              </h3>

              <div className="space-y-4 flex-1">
                {workspace.applications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-semibold text-xs sm:text-sm text-slate-900 mb-1">
                        {app.name}
                      </h4>
                      <div className="font-mono text-[11px] text-slate-500 flex items-center space-x-2">
                        <span>{app.maskedApiKey}</span>
                        <button
                          onClick={() => handleCopy(app.apiKey)}
                          className="text-cyan-800 hover:text-cyan-900 transition text-[10px]"
                        >
                          {copiedKey === app.apiKey ? '✓ Copied' : '📋 Copy'}
                        </button>
                        <button
                          onClick={() => handleRotateKey(app.id)}
                          className="text-slate-400 hover:text-slate-600 transition text-[10px]"
                        >
                          ↻ Rotate
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="bg-[#164e63] text-white text-xs px-5 py-1.5 rounded-full font-medium shadow-sm">
                        {app.environment}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Card: Team roles (RBAC) */}
            <div className="bg-[#f8fafc] p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
              <h3 className="font-bold text-slate-800 text-sm mb-6">
                Team roles (RBAC)
              </h3>

              <div className="space-y-4 flex-1">
                {workspace.teamMembers.map((member) => {
                  let pillBg = 'bg-[#64748b]';
                  if (member.role === 'ADMIN') pillBg = 'bg-[#ef4444]';
                  else if (member.role === 'DEVELOPER') pillBg = 'bg-[#3b82f6]';

                  return (
                    <div
                      key={member.id}
                      className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-semibold text-xs sm:text-sm text-slate-900 mb-0.5">
                          {member.name}
                        </h4>
                        <span className="text-[11px] text-slate-400">
                          {member.email}
                        </span>
                      </div>

                      <div>
                        <span
                          className={`${pillBg} text-white text-xs px-6 py-1.5 rounded-full font-medium shadow-sm min-w-[90px] inline-block text-center`}
                        >
                          {member.role === 'ADMIN' ? 'Admin' : member.role === 'DEVELOPER' ? 'Developer' : 'Viewer'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </BrowserChrome>

      {/* Invite Member Modal */}
      {inviteModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-1">Invite Workspace Member</h3>
            <p className="text-xs text-slate-500 mb-4">
              Add a user with scoped tenant access to projects, prompts, and evaluation runs.
            </p>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Patel"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded outline-none focus:ring-1 focus:ring-cyan-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="maya@acme-corp.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded outline-none focus:ring-1 focus:ring-cyan-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Role (RBAC)</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as Role)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded outline-none focus:ring-1 focus:ring-cyan-700 bg-white"
                >
                  <option value="ADMIN">Admin - Full access to users, settings, and keys</option>
                  <option value="DEVELOPER">Developer - Create, test, and gate prompts</option>
                  <option value="VIEWER">Viewer - Read-only dashboard & analytics</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setInviteModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-medium bg-[#164e63] text-white rounded hover:bg-[#0f3d47] transition shadow"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
