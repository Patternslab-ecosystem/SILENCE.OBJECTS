// ============================================
// @silence/safety — PASSIVE Safety Module
// ============================================
// Profile: INFORMED_ADULT_TOOL
// Never blocks, shows resources when relevant.
// ============================================

// === TYPES ===
export type {
  RiskLevel,
  CrisisLevel,
  DetectionLayer,
  CrisisAction,
  CrisisRegion,
  CrisisCategory,
  LanguageMode,
  Helpline,
  CrisisResource,
  RegionHelpline,
  RegionHelplines,
  RegionalCrisisResources,
  HardKeywordResult,
  SoftKeywordResult,
  CrisisDetectionResult,
  CrisisCheckResult,
  EmergencyResponse,
  CrisisDetectionConfig,
  CrisisIncident,
  CrisisCheckRequest,
  CrisisCheckResponse,
} from './types';

// === FROM KEYWORDS.TS ===
export {
  HARD_CRISIS_KEYWORDS,
  SOFT_CRISIS_KEYWORDS,
  CRISIS_KEYWORDS,
  HELPLINES,
  detectCrisisKeywords,
} from './keywords';

// === FROM DETECTOR.TS (PASSIVE) ===
export {
  SafetyDetector,
  safetyDetector,
  containsCrisisContent,
  shouldBlockSubmission,
} from './detector';

// === FROM CRISIS-DETECTION.TS (PASSIVE) ===
export {
  CrisisDetectionSystem,
  crisisDetection,
  getCrisisResourcesByLocale,
  CRISIS_RESOURCES,
} from './crisis-detection';

// === FROM EMERGENCY.TS (PASSIVE) ===
export {
  detectCrisis,
  getEmergencyResources,
  createEmergencyResponse,
} from './emergency';

// === FROM HELPLINES.TS ===
export {
  getRegionalHelplines,
  getPrimaryHelpline,
  detectRegion,
  IASP_LINK,
  HELPLINES_DB,
} from './helplines';

// === FROM SENTINEL-MIDDLEWARE.TS ===
export type { SentinelResult, SentinelAction } from './sentinel-middleware';
export {
  sentinel,
  withSentinel,
  CRISIS_KEYWORDS_PL,
  CRISIS_KEYWORDS_EN,
} from './sentinel-middleware';
