// ===========================================
// SILENCE.OBJECTS - Crisis Detection Types
// ===========================================
// 3-Layer Safety Architecture TypeScript Interfaces

/**
 * Risk levels for crisis detection
 * - none: No crisis indicators detected
 * - low: Soft keywords detected, proceed with banner
 * - medium: Soft keywords with elevated Claude assessment (0.5-0.7)
 * - high: Hard keywords OR Claude assessment ≥0.7
 */
export type CrisisRiskLevel = "none" | "low" | "medium" | "high";

/**
 * Detection layer that triggered the result
 */
export type DetectionLayer = "hard_keyword" | "soft_keyword" | "claude_assessment" | "none";

/**
 * Actions the system should take based on detection
 */
export type CrisisAction = "PROCEED" | "SHOW_BANNER" | "BLOCK_MODAL";

/**
 * Supported regions for crisis resources
 */
export type CrisisRegion = "PL" | "UK" | "US" | "EU";

/**
 * Crisis resource contact information
 */
export interface CrisisResource {
  name: string;
  number: string;
  description: string;
  type: "phone" | "text" | "chat";
  available: string; // e.g., "24/7" or "9:00-21:00"
}

/**
 * Regional crisis resources
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
  language: "en" | "pl" | "mixed";
}

/**
 * Result from Layer 2: Soft Keyword Detection
 */
export interface SoftKeywordResult {
  detected: boolean;
  keywords: string[];
  count: number;
  language: "en" | "pl" | "mixed";
}

/**
 * Result from Layer 3: Claude Risk Assessment
 */
export interface ClaudeAssessmentResult {
  riskScore: number; // 0.0 - 1.0
  reasoning: string;
  recommendedAction: CrisisAction;
  confidenceLevel: "low" | "medium" | "high";
}

/**
 * Complete crisis detection result
 */
export interface CrisisCheckResult {
  // Core result
  blocked: boolean;
  riskLevel: CrisisRiskLevel;
  action: CrisisAction;

  // Layer results
  layer: DetectionLayer;
  hardKeywordResult: HardKeywordResult;
  softKeywordResult: SoftKeywordResult;
  claudeAssessment?: ClaudeAssessmentResult;

  // Metadata
  timestamp: string;
  processingTimeMs: number;

  // User-facing message
  message: string;

  // Resources (if crisis detected)
  resources?: RegionalCrisisResources;
}

/**
 * API request for crisis check
 */
export interface CrisisCheckRequest {
  text: string;
  userId?: string;
  locale?: CrisisRegion;
  skipClaudeAssessment?: boolean; // For testing/performance
}

/**
 * API response for crisis check
 */
export interface CrisisCheckResponse {
  success: boolean;
  result: CrisisCheckResult;
  error?: string;
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
  keywordsMatched: string[]; // Categories only, no PII
  region: CrisisRegion;
  timestamp: string;
}

/**
 * Crisis detection configuration
 */
export interface CrisisDetectionConfig {
  // Thresholds
  claudeHighRiskThreshold: number; // Default: 0.7
  claudeMediumRiskThreshold: number; // Default: 0.5

  // Timeouts
  claudeTimeoutMs: number; // Default: 5000
  maxProcessingTimeMs: number; // Default: 500

  // Behavior
  enableClaudeAssessment: boolean;
  logIncidents: boolean;
  defaultRegion: CrisisRegion;
}

/**
 * Crisis modal display data
 */
export interface CrisisModalData {
  title: string;
  message: string;
  resources: RegionalCrisisResources;
  showResources: boolean;
  onClose: () => void;
  onShowResources: () => void;
}

/**
 * Safety banner display data
 */
export interface SafetyBannerData {
  message: string;
  resources: RegionalCrisisResources;
  dismissible: boolean;
  onDismiss?: () => void;
  onShowResources: () => void;
}
