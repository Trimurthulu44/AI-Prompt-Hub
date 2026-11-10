import React, { useState } from 'react';
import { BrowserChrome } from '../components/BrowserChrome';

export const CicdSdkPage: React.FC = () => {
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  const runSimulation = () => {
    setTesting(true);
    setTestOutput('Running python ci_gate.py customer-support-system prompts/support.txt...\nSubmitting prompt version to http://localhost:8080/api/prompts/customer-support-system/versions...\nVersion v4 created. Evaluating Quality Gate...\nChecking S(v) >= 0.85 -> 0.89 [PASS]\nChecking Delta >= -0.02 -> +0.03 [PASS]\nChecking Security Probes (20 cases) -> FAILED (role override: 1 of 20 failed)\nChecking Avg Tokens <= 500 -> 412 [PASS]\nQuality gate FAILED: Security probes failed (role override)\nRecommendation: Action: Add explicit role boundary instruction in prompt v5\nBuild failed with exit code 1 (Deployment blocked)');
    setTimeout(() => {
      setTesting(false);
    }, 1200);
  };

  const ciGatePythonCode = `import os, sys, time, requests

BASE = os.environ.get("PROMPT_HUB_URL", "http://localhost:8080")
HEAD = {"Authorization": "Bearer " + os.environ["PROMPT_HUB_API_KEY"]}

def main(prompt_id, path):
    content = open(path, encoding="utf-8").read()
    r = requests.post(f"{BASE}/api/prompts/{prompt_id}/versions", headers=HEAD,
                      json={"content": content, "changeInstruction": "CI submission"})
    r.raise_for_status()
    version_id = r.json()["id"]

    while True: # wait for the gate decision
        g = requests.get(f"{BASE}/api/versions/{version_id}/gate", headers=HEAD).json()
        if g["status"] != "RUNNING":
            break
        time.sleep(5)

    if g["passed"]:
        print("Quality gate passed - deployment may proceed")
        sys.exit(0)
    else:
        print("Quality gate FAILED:", "; ".join(g["reasons"]))
        sys.exit(1)

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])`;

  const pythonSdkCode = `from aiprompthub import AIPromptHubClient

client = AIPromptHubClient(api_key="aph_live_d71k9a82c41c21")

# List prompts
prompts = client.list_prompts()

# Submit new version
version = client.submit_version(
    prompt_id="customer-support-system",
    content="You are a support bot...",
    change_instruction="Add token guardrail"
)

# Check quality gate
decision = client.get_gate_decision(version["id"])
print("Gate Passed:", decision["passed"])`;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <BrowserChrome url="ai-prompt-hub.app/cicd-sdk">
        <div className="bg-[#f8fafc] min-h-[600px] p-6 sm:p-8 flex flex-col space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                CI/CD Pipeline & SDK Integration
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Trigger quality gate checks directly from GitHub Actions, GitLab CI, Jenkins or Docker containers before prompts are deployed to production.
              </p>
            </div>

            <button
              onClick={runSimulation}
              disabled={testing}
              className="bg-[#164e63] hover:bg-[#0f3d47] text-white px-5 py-2 rounded-lg text-xs font-semibold shadow-sm transition"
            >
              {testing ? 'Simulating Pipeline...' : '▶ Simulate CI Gate Run'}
            </button>
          </div>

          {/* Simulator Output Terminal */}
          {testOutput && (
            <div className="bg-[#0f172a] text-slate-200 p-4 rounded-xl border border-slate-700 font-mono text-xs shadow-inner">
              <div className="flex items-center justify-between text-slate-400 text-[11px] mb-2 border-b border-slate-800 pb-1">
                <span>CI Pipeline Runner Terminal Output (exit code 1)</span>
                <button onClick={() => setTestOutput(null)} className="hover:text-white">✕</button>
              </div>
              <pre className="whitespace-pre-wrap leading-relaxed text-amber-300">
                {testOutput}
              </pre>
            </div>
          )}

          {/* 2-Column Code Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CI Gate Step (Appendix 1 [6]) */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <h3 className="font-bold text-xs text-slate-800">
                  CI/CD Quality Gate Step — ci_gate.py (Appendix 1 [6])
                </h3>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                  Python 3.10+
                </span>
              </div>
              <div className="bg-[#1e293b] p-3 rounded-lg overflow-x-auto text-[11px] font-mono text-slate-200 flex-1">
                <pre>{ciGatePythonCode}</pre>
              </div>
            </div>

            {/* Python SDK */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <h3 className="font-bold text-xs text-slate-800">
                  Python SDK Client — aiprompthub.py (Chapter 5.2.9)
                </h3>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                  pip install aiprompthub
                </span>
              </div>
              <div className="bg-[#1e293b] p-3 rounded-lg overflow-x-auto text-[11px] font-mono text-slate-200 flex-1">
                <pre>{pythonSdkCode}</pre>
              </div>
            </div>
          </div>
        </div>
      </BrowserChrome>
    </div>
  );
};
