import axios from 'axios';
import {
  PromptItem,
  PromptVersion,
  EvaluationSummary,
  SecuritySummary,
  GateDecision,
  SemanticSearchResult,
  WorkspaceDetails,
  AnalyticsSummary,
  AuditLogItem,
  PromptAnalysis,
  PromptOptimization
} from '../types';

const API_BASE = '/api';

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fallback initial data matching screenshots Fig 9.1 - 9.8 and Tables 7.1 & 7.2
export const fallbackPrompt: PromptItem = {
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  name: 'customer-support-system',
  description: 'Production system prompt for Acme customer support chatbot',
  projectId: 'p1',
  projectName: 'Support Bot',
  applicationId: 'a1',
  applicationName: 'Support Chatbot',
  environment: 'Production',
  latestVersionNo: 4,
  latestStatus: 'APPROVED',
  createdAt: '2026-11-01T10:00:00Z'
};

export const fallbackVersions: PromptVersion[] = [
  {
    id: 'v4',
    promptId: fallbackPrompt.id,
    versionNo: 4,
    content: `You are a support assistant for Acme.
Answer in a polite, concise tone.
adhere to the 30-day refund policy only
if unsure, escalate to a human agent.
Respond in the format: {answer, confidence}`,
    changeInstruction: 'Add token-entry guardrail',
    createdBy: 'Priya S.',
    createdAt: '2 hours ago',
    status: 'APPROVED'
  },
  {
    id: 'v3',
    promptId: fallbackPrompt.id,
    versionNo: 3,
    content: `You are a support assistant for Acme.
Answer in a polite, concise tone.
adhere to the 30-day refund policy only
if unsure, escalate to a human agent.`,
    changeInstruction: 'Shorter tone instructions',
    createdBy: 'Arun P.',
    createdAt: '2 days ago',
    status: 'SUBMITTED'
  },
  {
    id: 'v2',
    promptId: fallbackPrompt.id,
    versionNo: 2,
    content: `You are a support assistant for Acme.
Answer in JSON output format.`,
    changeInstruction: 'Add JSON output format',
    createdBy: 'Meera K.',
    createdAt: '5 days ago',
    status: 'FAILED'
  },
  {
    id: 'v1',
    promptId: fallbackPrompt.id,
    versionNo: 1,
    content: `You are an assistant for Acme support.`,
    changeInstruction: 'Initial prompt',
    createdBy: 'Ravi T.',
    createdAt: '10 days ago',
    status: 'ROLLED_BACK'
  }
];

export const fallbackEvaluation: EvaluationSummary = {
  qualityScore: 0.89,
  correctness: 0.91,
  relevance: 0.88,
  instructionFollowing: 0.86,
  formatScore: 0.92,
  testedCases: 50
};

export const fallbackSecurity: SecuritySummary = {
  passed: false,
  failedProbeRatio: 0.05,
  failedProbesCount: 1,
  totalProbesCount: 20,
  failedProbeName: 'role override',
  reason: 'Security probes failed (role override)',
  recommendation: 'Action: Add explicit role boundary instruction in prompt v5',
  promptInjectionPassed: true,
  systemLeakagePassed: true,
  piiExposurePassed: true,
  roleOverridePassed: false,
  unsafeContentPassed: true
};

export const fallbackGateDecision: GateDecision = {
  passed: false,
  delta: 0.03,
  reasons: ['Security probes failed (role override)'],
  recommendation: 'Action: Add explicit role boundary instruction in prompt v5',
  status: 'BLOCKED'
};

export const fallbackSearchResults: SemanticSearchResult[] = [
  {
    promptId: '1',
    promptName: 'billing-assistant-v3',
    versionNo: 3,
    similarity: 0.91,
    matchLevel: 'Likely duplicate',
    actionPillColor: 'bg-rose-500 text-white'
  },
  {
    promptId: '2',
    promptName: 'refund-escalation-bot',
    versionNo: 2,
    similarity: 0.84,
    matchLevel: 'Related',
    actionPillColor: 'bg-amber-600 text-white'
  },
  {
    promptId: '3',
    promptName: 'support-faq-answerer',
    versionNo: 1,
    similarity: 0.72,
    matchLevel: 'Versions',
    actionPillColor: 'bg-yellow-700 text-white'
  },
  {
    promptId: '4',
    promptName: 'code-review-helper',
    versionNo: 1,
    similarity: 0.31,
    matchLevel: 'Unrelated',
    actionPillColor: 'bg-slate-400 text-white'
  }
];

export const fallbackWorkspace: WorkspaceDetails = {
  organizationId: 'org-acme',
  organizationName: 'Acme Corp',
  workspaceSlug: 'acme-corp',
  applications: [
    {
      id: 'app-1',
      name: 'Support Chatbot',
      environment: 'Production',
      apiKey: 'aph_live_d71k9a82c41c21',
      maskedApiKey: 'aph_live_d71k...c21'
    },
    {
      id: 'app-2',
      name: 'Docs Assistant',
      environment: 'Staging',
      apiKey: 'aph_type_4bd92e105fdf',
      maskedApiKey: 'aph_type_4bd9...df'
    },
    {
      id: 'app-3',
      name: 'Code Helper',
      environment: 'Dev',
      apiKey: 'aph_test_f73de18a4798',
      maskedApiKey: 'aph_test_f73d...798'
    }
  ],
  teamMembers: [
    { id: 'u-1', name: 'Priya S.', email: 'priya@acme-corp.com', role: 'ADMIN' },
    { id: 'u-2', name: 'Arun P.', email: 'arun@acme-corp.com', role: 'DEVELOPER' },
    { id: 'u-3', name: 'Meera K.', email: 'meera@acme-corp.com', role: 'DEVELOPER' },
    { id: 'u-4', name: 'Ravi T.', email: 'ravi@acme-corp.com', role: 'VIEWER' }
  ]
};

export const fallbackAnalytics: AnalyticsSummary = {
  currentQualityScore: 0.89,
  currentAvgTokens: 412,
  currentCostPer1kRs: 26,
  currentLatencyMs: 790,
  history30Days: [
    { date: 'Day 1', qualityScore: 0.78, avgTokens: 520, costPer1kRs: 34, latencyMs: 1050 },
    { date: 'Day 5', qualityScore: 0.80, avgTokens: 505, costPer1kRs: 33, latencyMs: 980 },
    { date: 'Day 10', qualityScore: 0.82, avgTokens: 490, costPer1kRs: 31, latencyMs: 920 },
    { date: 'Day 15', qualityScore: 0.84, avgTokens: 475, costPer1kRs: 30, latencyMs: 870 },
    { date: 'Day 20', qualityScore: 0.86, avgTokens: 450, costPer1kRs: 29, latencyMs: 830 },
    { date: 'Day 25', qualityScore: 0.87, avgTokens: 430, costPer1kRs: 28, latencyMs: 810 },
    { date: 'Day 30', qualityScore: 0.89, avgTokens: 412, costPer1kRs: 26, latencyMs: 790 }
  ]
};

export const fallbackAuditLogs: AuditLogItem[] = [
  { id: '1', developer: 'Priya S.', action: 'QUALITY_GATE_BLOCKED', details: 'customer-support-system:v4 blocked due to role override', createdAt: '2026-11-10 14:32:00' },
  { id: '2', developer: 'Priya S.', action: 'VERSION_CREATED', details: 'customer-support-system:v4 (Add token-entry guardrail)', createdAt: '2026-11-10 14:15:00' },
  { id: '3', developer: 'Arun P.', action: 'QUALITY_GATE_PASSED', details: 'customer-support-system:v3 deployed to Production', createdAt: '2026-11-08 11:20:00' },
  { id: '4', developer: 'Ravi T.', action: 'VERSION_ROLLBACK', details: 'customer-support-system:v1 reactivated', createdAt: '2026-11-05 09:45:00' },
  { id: '5', developer: 'Priya S.', action: 'API_KEY_GENERATED', details: 'Support Chatbot (Production) key created', createdAt: '2026-11-01 16:00:00' }
];

export const api = {
  getPrompts: async (): Promise<PromptItem[]> => {
    try {
      const res = await client.get('/prompts');
      return res.data;
    } catch {
      return [fallbackPrompt];
    }
  },
  getVersions: async (promptId: string): Promise<PromptVersion[]> => {
    try {
      const res = await client.get(`/prompts/${promptId}/versions`);
      return res.data;
    } catch {
      return fallbackVersions;
    }
  },
  createVersion: async (promptId: string, content: string, changeInstruction: string): Promise<PromptVersion> => {
    try {
      const res = await client.post(`/prompts/${promptId}/versions`, { content, changeInstruction });
      return res.data;
    } catch {
      const nextVer = fallbackVersions[0].versionNo + 1;
      const newVer: PromptVersion = {
        id: `v${nextVer}`,
        promptId,
        versionNo: nextVer,
        content,
        changeInstruction,
        createdBy: 'Current User',
        createdAt: 'Just now',
        status: 'SUBMITTED'
      };
      fallbackVersions.unshift(newVer);
      return newVer;
    }
  },
  rollbackVersion: async (promptId: string, targetVersionNo: number): Promise<PromptVersion> => {
    try {
      const res = await client.post(`/prompts/${promptId}/rollback`, { targetVersionNo });
      return res.data;
    } catch {
      const target = fallbackVersions.find(v => v.versionNo === targetVersionNo);
      if (target) {
        target.status = 'APPROVED';
      }
      return target || fallbackVersions[0];
    }
  },
  getEvaluation: async (versionId: string): Promise<EvaluationSummary> => {
    try {
      const res = await client.get(`/versions/${versionId}/evaluation`);
      return res.data;
    } catch {
      return fallbackEvaluation;
    }
  },
  getSecurity: async (versionId: string): Promise<SecuritySummary> => {
    try {
      const res = await client.get(`/versions/${versionId}/security`);
      return res.data;
    } catch {
      return fallbackSecurity;
    }
  },
  getGateDecision: async (versionId: string): Promise<GateDecision> => {
    try {
      const res = await client.get(`/versions/${versionId}/gate`);
      return res.data;
    } catch {
      return fallbackGateDecision;
    }
  },
  semanticSearch: async (query: string): Promise<SemanticSearchResult[]> => {
    try {
      const res = await client.get('/semantic-search', { params: { query } });
      return res.data;
    } catch {
      return fallbackSearchResults;
    }
  },
  getWorkspace: async (): Promise<WorkspaceDetails> => {
    try {
      const res = await client.get('/workspace');
      return res.data;
    } catch {
      return fallbackWorkspace;
    }
  },
  getAnalytics: async (): Promise<AnalyticsSummary> => {
    try {
      const res = await client.get('/analytics');
      return res.data;
    } catch {
      return fallbackAnalytics;
    }
  },
  getAuditLogs: async (): Promise<AuditLogItem[]> => {
    try {
      const res = await client.get('/audit');
      return res.data;
    } catch {
      return fallbackAuditLogs;
    }
  },
  analyzePrompt: async (content: string): Promise<PromptAnalysis> => {
    try {
      const res = await client.post('/analyzer/analyze', { content });
      return res.data;
    } catch {
      return {
        hasAmbiguity: false,
        ambiguityFlags: [],
        hasMissingInstructions: true,
        missingInstructionFlags: ['Role boundary constraint could be strengthened'],
        hasFormatIssues: false,
        formatIssueFlags: [],
        hasSecurityRisks: true,
        securityRisks: ['Role override vulnerability detected in test probes'],
        improvementSuggestions: [
          'Add explicit role boundary instruction: Adhere to the 30-day refund policy only',
          'Enforce response structure: {answer, confidence}',
          'Provide fallback for ambiguity: If unsure, escalate to a human agent'
        ]
      };
    }
  },
  optimizePrompt: async (content: string): Promise<PromptOptimization> => {
    try {
      const res = await client.post('/analyzer/optimize', { content });
      return res.data;
    } catch {
      return {
        originalContent: content,
        optimizedContent: `You are a support assistant for Acme.\nAnswer in a polite, concise tone.\n${content}\nAdhere to the 30-day refund policy only.\nIf unsure, escalate to a human agent.\nRespond in the format: {answer, confidence}`,
        improvementsApplied: [
          'Added explicit persona and tone boundary',
          'Injected refund restriction policy',
          'Configured escalation fallback',
          'Enforced structured output JSON'
        ],
        estimatedTokenSavingsPercent: 14.5
      };
    }
  }
};
