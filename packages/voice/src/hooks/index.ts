// Audio Recording Hooks - PatternLens
// =====================================

export { useMediaRecorder } from './useMediaRecorder';
export type { UseMediaRecorderReturn } from './useMediaRecorder';

export { useTranscription } from './useTranscription';
export type { UseTranscriptionReturn } from './useTranscription';

export { useAnalysis, EmergencyError } from './useAnalysis';
export type {
  AnalysisState,
  AnalysisStatus,
  AnalysisResult,
  DualLensAnalysis,
} from './useAnalysis';

export { useOfflineQueue } from './useOfflineQueue';
export type { PendingObject } from './useOfflineQueue';
