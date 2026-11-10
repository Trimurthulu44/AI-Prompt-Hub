export type Role = 'ADMIN' | 'DEVELOPER' | 'VIEWER';

export type VersionStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_TEST'
  | 'APPROVED'
  | 'DEPLOYED'
  | 'FAILED'
  | 'ROLLED_BACK';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  organizationId: string;
  organizationName: string;
  workspaceSlug: string;
}

export interface PromptItem {
  id: string;
  name: string;
  description: string;
  projectId: string;
  projectName: string;
  applicationId: string;
  applicationName: string;
  environment: string;
  latestVersionNo: number;
  latestStatus: VersionStatus;
  createdAt: string;
}

export interface PromptVersion {
  id: string;
  promptId: string;
  versionNo: number;
  content: string;
  changeInstruction: string;
  createdBy: string;
  createdAt: string;
  status: VersionStatus;
}

export interface EvaluationSummary {
  qualityScore: number;
  correctness: number;
  relevance: number;
  instructionFollowing: number;
  formatScore: number;
  testedCases: number;
}

export interface SecuritySummary {
  passed: boolean;
  failedProbeRatio: number;
  failedProbesCount: number;
  totalProbesCount: number;
  failedProbeName?: string;
  reason?: string;
  recommendation?: string;
  promptInjectionPassed: boolean;
  systemLeakagePassed: boolean;
  piiExposurePassed: boolean;
  roleOverridePassed: boolean;
  unsafeContentPassed: boolean;
}

export interface GateDecision {
  passed: boolean;
  delta: number;
  reasons: string[];
  recommendation: string;
  status: string;
}

export interface SemanticSearchResult {
  promptId: string;
  promptName: string;
  versionNo: number;
  similarity: number;
  matchLevel: string;
  actionPillColor: string;
}

export interface ApplicationItem {
  id: string;
  name: string;
  environment: string;
  apiKey: string;
  maskedApiKey: string;
}

export interface TeamMemberItem {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface WorkspaceDetails {
  organizationId: string;
  organizationName: string;
  workspaceSlug: string;
  applications: ApplicationItem[];
  teamMembers: TeamMemberItem[];
}

export interface AnalyticsPoint {
  date: string;
  qualityScore: number;
  avgTokens: number;
  costPer1kRs: number;
  latencyMs: number;
}

export interface AnalyticsSummary {
  currentQualityScore: number;
  currentAvgTokens: number;
  currentCostPer1kRs: number;
  currentLatencyMs: number;
  history30Days: AnalyticsPoint[];
}

export interface AuditLogItem {
  id: string;
  developer: string;
  action: string;
  details: string;
  createdAt: string;
}

export interface PromptAnalysis {
  hasAmbiguity: boolean;
  ambiguityFlags: string[];
  hasMissingInstructions: boolean;
  missingInstructionFlags: string[];
  hasFormatIssues: boolean;
  formatIssueFlags: string[];
  hasSecurityRisks: boolean;
  securityRisks: string[];
  improvementSuggestions: string[];
}

export interface PromptOptimization {
  originalContent: string;
  optimizedContent: string;
  improvementsApplied: string[];
  estimatedTokenSavingsPercent: number;
}
