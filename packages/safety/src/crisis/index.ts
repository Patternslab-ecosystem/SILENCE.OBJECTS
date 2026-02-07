// @silence/safety/crisis — re-export from main module
export {
  CrisisDetectionSystem,
  crisisDetection,
  getCrisisResourcesByLocale,
  CRISIS_RESOURCES,
} from '../crisis-detection';

export {
  detectCrisis,
  getEmergencyResources,
  createEmergencyResponse,
} from '../emergency';

export type {
  CrisisCheckResult,
  CrisisResource,
  EmergencyResponse,
  CrisisLevel,
  CrisisAction,
} from '../types';
