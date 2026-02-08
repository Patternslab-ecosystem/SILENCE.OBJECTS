// types/portal.ts — Portal dashboard data contracts
// Source: PORTAL_DASHBOARD_SPEC.md §4

// W1: Hero KPIs
export interface PortalKpi {
  arr: number;          // PLN, from kpi_daily
  mrr: number;          // PLN
  runway: number;       // months
  nrr: number;          // %, net revenue retention
  dau: number;          // daily active users
  churn: number;        // %, monthly
  ltvCac: number;       // ratio
  conversion: number;   // %, free→paid
  updatedAt: string;    // ISO 8601
}

// W2: System Status
export interface PortalSystemStatus {
  edge: 'operational' | 'degraded' | 'down';
  serverless: 'operational' | 'degraded' | 'down';
  database: 'operational' | 'degraded' | 'down';
  latestCommit: string;
  ciStatus: 'green' | 'red' | 'pending';
  appVersion: string;
  safetyCoreVersion: string;
  portalContractVersion: string;
}

// W3: Safety/Compliance Summary
export interface PortalSafetySummary {
  p0Status: 'PASS' | 'FAIL';
  p1Status: 'PASS' | 'WARN' | 'FAIL';
  p2Status: 'PASS' | 'WARN' | 'FAIL';
  nuclearEvents24h: number;
  languageViolations24h: number;
}

// W4: App Status
export interface PortalAppStatus {
  name: string;
  domain: string;
  status: 'operational' | 'degraded' | 'down';
  dau: number;
  mau: number;
  sessions: number;
  version: string;
  successRate: number;
}

// W5: Module Activation
export interface PortalModule {
  name: string;
  type: 'open' | 'closed';
  edgeSafe: boolean;
  status: 'ready' | 'building' | 'planned';
  events: string[];
  pricing: string;
}

// W7: Agent Layer
export interface PortalAgentLayer {
  layer: 0 | 1 | 2;
  name: 'Guardian' | 'Revenue' | 'Growth';
  status: 'ACTIVE' | 'PAUSED' | 'LOCKED';
  agents: { id: string; name: string; enabled: boolean; tasksToday: number }[];
  unlockCondition?: string;
  unlockMet: boolean;
}

// W8: Agent Performance
export interface PortalAgentPerformance {
  agentId: string;
  layer: 0 | 1 | 2;
  tasksTotal: number;
  successRate: number;
  costMonth: number;
  estimatedRoi: number;
}

// W10: Event Rate
export interface PortalEventRate {
  eventsPerMin: number;
  byDomain: Record<'pattern' | 'archetype' | 'safety' | 'agent' | 'platform', number>;
  errorPercent: number;
}

// W13: Compliance Matrix Row
export interface PortalComplianceRow {
  module: string;
  p0Safety: 'Required' | 'Core' | 'N/A' | 'Optional' | 'Enforcer';
  p1Language: 'Required' | 'Core' | 'N/A' | 'Supports';
  p2Framing: 'Required' | 'N/A' | 'Supports';
  currentStatus: 'PASS' | 'WARN' | 'FAIL';
}

// W22: Ops Status
export interface PortalOpsService {
  name: string;
  status: 'operational' | 'degraded' | 'down';
  lastDeploy?: string;
  url?: string;
}

// W24: Build Order Phase
export interface PortalBuildPhase {
  phase: 0 | 1 | 2 | 3;
  name: string;
  tasks: { name: string; status: 'done' | 'building' | 'planned' }[];
  completionPercent: number;
}
