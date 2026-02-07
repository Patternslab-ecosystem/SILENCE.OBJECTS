// ===========================================
// @silence/safety — Crisis Detection Types
// ===========================================
// 3-Layer Safety Architecture TypeScript Interfaces

/**
 * Risk levels for crisis detection
 * - none: No crisis indicators detected
 * - low: Soft keywords detected, proceed with banner
 * - medium: Soft keywords with elevated assessment (0.5-0.7)
 * - high: Hard keywords OR assessment >= 0.7
 * - critical: Hard keywords matched — show resources immediately
 */
export type RiskLevel = 'none' | 'low' | 'medium' | 'high' | 'critical';

/**
 * Crisis levels (binary for PASSIVE mode)
 */
export type CrisisLevel = 'none' | 'critical';

/**
 * Detection layer that triggered the result
 */
export type DetectionLayer = 'hard_keyword' | 'soft_keyword' | 'claude_assessment' | 'none';

/**
 * Actions the system should take based on detection
 */
export type CrisisAction = 'PROCEED' | 'SHOW_BANNER' | 'SHOW_RESOURCES' | 'BLOCK_MODAL';

/**
 * Supported regions for crisis resources
 */
export type CrisisRegion = 'PL' | 'UK' | 'US' | 'EU';

/**
 * Crisis categories
 */
export type CrisisCategory =
  | 'SELF_HARM'
  | 'SUICIDE'
  | 'VIOLENCE'
  | 'ABUSE'
  | 'SUBSTANCE'
  | 'EATING_DISORDER'
  | 'PANIC'
  | 'OTHER';

/**
 * Language detection mode
 */
export type LanguageMode = 'PL' | 'EN' | 'AUTO';

/**
 * Helpline contact (used in keywords.ts)
 */
export interface Helpline {
  id: string;
  name: string;
  phone: string;
  description: string;
  available?: string;
}

/**
 * Crisis resource contact information
 */
export interface CrisisResource {
  id: string;
  name: string;
  phone: string;
  description: string;
  website?: string;
  region: 'PL' | 'UK' | 'US' | 'EU';
}

/**
 * Regional helplines (used in helplines.ts)
 */
export interface RegionHelpline {
  number: string;
  name: string;
  available: string;
  isPrimary?: boolean;
  textLine?: string;
}

/**
 * Regional helplines collection
 */
export interface RegionHelplines {
  region: string;
  regionCode: string;
  emergencyNumber: string;
  helplines: RegionHelpline[];
}

/**
 * Regional crisis resources (structured)
 */
export interface RegionalCrisisResources {
  region: CrisisRegion;
  primary: CrisisResource;
  secondary: CrisisResource;
  additional?: CrisisResource[];
}

/**
 * Result from Layer 1: Hard Keyword Detection
 */
export interface HardKeywordResult {
  detected: boolean;
  keywords: string[];
  language: 'en' | 'pl' | 'mixed';
}

/**
 * Result from Layer 2: Soft Keyword Detection
 */
export interface SoftKeywordResult {
  detected: boolean;
  keywords: string[];
  count: number;
  language: 'en' | 'pl' | 'mixed';
}

/**
 * Result from SafetyDetector.detect()
 */
export interface CrisisDetectionResult {
  /** PASSIVE mode: never true. Resources shown inline, input never blocked. */
  shouldBlock: false;
  riskLevel: RiskLevel;
  detectedKeywords: string[];
  helplines: Helpline[];
  showResources: boolean;
  message?: string;
}

/**
 * Result from CrisisDetectionSystem.checkContent()
 */
export interface CrisisCheckResult {
  /** PASSIVE mode: always false -- input is never blocked */
  blocked: false;
  level: CrisisLevel;
  action: CrisisAction;
  matchedKeywords?: string[];
  timestamp: string;
}

/**
 * Emergency response from detectCrisis()
 */
export interface EmergencyResponse {
  isEmergency: boolean;
  /** PASSIVE mode: always false */
  shouldBlock: false;
  riskLevel: RiskLevel;
  detectedKeywords: string[];
  resources: Helpline[];
  showResources: boolean;
  message: string;
}

/**
 * Crisis detection configuration
 */
export interface CrisisDetectionConfig {
  claudeHighRiskThreshold: number;
  claudeMediumRiskThreshold: number;
  claudeTimeoutMs: number;
  maxProcessingTimeMs: number;
  enableClaudeAssessment: boolean;
  logIncidents: boolean;
  defaultRegion: CrisisRegion;
}

/**
 * Crisis incident log (for anonymous analytics)
 */
export interface CrisisIncident {
  id: string;
  userId?: string;
  incidentType: DetectionLayer;
  riskScore?: number;
  actionTaken: CrisisAction;
  keywordsMatched: string[];
  region: CrisisRegion;
  timestamp: string;
}

/**
 * API request for crisis check
 */
export interface CrisisCheckRequest {
  text: string;
  userId?: string;
  locale?: CrisisRegion;
  skipClaudeAssessment?: boolean;
}

/**
 * API response for crisis check
 */
export interface CrisisCheckResponse {
  success: boolean;
  result: CrisisCheckResult;
  error?: string;
}
