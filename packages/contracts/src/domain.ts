// ===========================================
// @silence/contracts — Domain & Claude Types
// ===========================================
// Core domain models, Claude API types, and
// application-level interfaces. Single Source
// of Truth -- no external imports.

// ============================================
// INLINED CONSTANTS (from app constants)
// ============================================

/** User subscription tier */
export type Tier = "FREE" | "PRO";

/** Report generation phases */
export type ReportPhase = "context" | "tension" | "meaning" | "function";

/** Risk level for crisis detection (domain-level) */
export type RiskLevel = "HIGH" | "MEDIUM" | "LOW" | "NONE";

// ============================================
// USER TYPES
// ============================================

/** User profile from Supabase */
export interface UserProfile {
  id: string;
  email: string;
  tier: Tier;
  object_count: number;
  locale: string;
  onboarding_completed: boolean;
  onboarding_completed_at?: string;
  stripe_customer_id?: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// VOICE DUMP
// ============================================

/** Voice dump / text input */
export interface VoiceDump {
  id: string;
  user_id: string;
  transcription: string;
  audio_url?: string;
  duration_seconds?: number;
  created_at: string;
}

// ============================================
// INTERPRETATION TYPES
// ============================================

/** Phase content (JSONB in database) */
export interface PhaseContent {
  summary: string;
  details?: string;
  keywords?: string[];
}

/** Single interpretation (one lens) */
export interface Interpretation {
  id: string;
  object_id: string;
  lens: "A" | "B";
  phase_1_context: PhaseContent;
  phase_2_tension: PhaseContent;
  phase_3_meaning: PhaseContent;
  phase_4_function: PhaseContent;
  confidence_score: number | null;
  risk_level: string;
  created_at: string;
}

/** Legacy interpretation format (for backward compatibility) */
export interface LegacyInterpretation {
  id: string;
  object_id: string;
  lens: "A" | "B";
  context: string;
  tension: string;
  meaning: string;
  function: string;
  confidence_score: number;
  created_at: string;
}

// ============================================
// PATTERNLENS OBJECT TYPES
// ============================================

/** PatternLens Object (primary content unit) */
export interface PatternLensObject {
  id: string;
  user_id: string;
  input_text: string;
  input_method: "text" | "voice";
  selected_lens?: "A" | "B" | null;
  detected_theme?: string | null;
  created_at: string;
  deleted_at?: string | null;
}

/** Object with interpretations (joined query result) */
export interface ObjectWithInterpretations extends PatternLensObject {
  interpretations: Interpretation[];
}

/** Archive item (list view) */
export interface ArchiveItem {
  id: string;
  input_preview: string;
  input_method: "text" | "voice";
  selected_lens?: "A" | "B" | null;
  detected_theme?: string | null;
  created_at: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

/** Generic API response wrapper */
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: "success" | "error";
}

// ============================================
// RECORDING & GENERATION STATE
// ============================================

/** Recording state */
export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioBlob?: Blob;
}

/** Object generation state */
export interface GenerationState {
  phase: ReportPhase | "idle" | "complete" | "error";
  progress: number;
  error?: string;
}

// ============================================
// PAYWALL & MODAL TYPES
// ============================================

/** Paywall trigger reasons */
export type PaywallTrigger =
  | "object_limit_reached"
  | "feature_locked"
  | "export_requested";

/** Modal types */
export type ModalType =
  | "crisis"
  | "paywall"
  | "delete_confirm"
  | "export"
  | null;

// ============================================
// CONSENT TYPES (GDPR)
// ============================================

export type ConsentType = "structural" | "safety" | "data" | "age";

export interface ConsentRecord {
  consent_type: ConsentType;
  consent_version: string;
  granted: boolean;
  granted_at: string;
}

// ============================================
// PATTERN TYPES
// ============================================

/** Pattern (detected recurring structure) */
export interface Pattern {
  id: string;
  user_id: string;
  pattern_name: string;
  pattern_theme?: string | null;
  object_count: number;
  first_detected: string;
  last_updated: string;
}

// ============================================
// CLAUDE API TYPES
// ============================================

export interface LensInterpretation {
  context: string;
  tension: string;
  meaning: string;
  function: string;
  confidence: number;
}

export interface DualLensResponse {
  lensA: LensInterpretation;
  lensB: LensInterpretation;
  riskLevel: RiskLevel;
  isEmergency: boolean;
}

export interface ClaudeMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ClaudeRequest {
  model: string;
  max_tokens: number;
  messages: ClaudeMessage[];
  system?: string;
}

export interface ClaudeResponse {
  id: string;
  content: Array<{ type: "text"; text: string }>;
  model: string;
  stop_reason: string;
  usage: { input_tokens: number; output_tokens: number };
}

// ============================================
// INTERPRET API RESPONSE TYPES
// ============================================

export interface InterpretSuccessResponse {
  lensA: LensInterpretation;
  lensB: LensInterpretation;
  riskLevel: RiskLevel;
  isEmergency: boolean;
  showBanner?: boolean;
}

export interface InterpretCrisisResponse {
  crisis: true;
  riskLevel: "HIGH";
  detectedKeywords: string[];
}

export interface InterpretErrorResponse {
  error: string;
  code?: string;
}

export type InterpretResponse =
  | InterpretSuccessResponse
  | InterpretCrisisResponse
  | InterpretErrorResponse;

// ============================================
// BACKWARD COMPATIBILITY ALIASES
// ============================================

export type Report = PatternLensObject;
export type ReportWithInterpretations = ObjectWithInterpretations;
