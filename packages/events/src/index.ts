// @silence/events — Typed Event Bus
export type EventType =
  | 'PatternCreated'
  | 'ArchetypeUpdated'
  | 'ObjectAnalyzed'
  | 'AgentRunCompleted'
  | 'RiskFlagRaised'
  | 'PredictionGenerated'
  | 'CrisisDetected'
  | 'TenantProvisioned'
  | 'SubscriptionChanged';

export interface SilenceEvent<T = unknown> {
  type: EventType;
  payload: T;
  timestamp: string;
  source: string;
}

type Handler<T = unknown> = (event: SilenceEvent<T>) => void;
const handlers = new Map<EventType, Set<Handler>>();

export function emit<T>(type: EventType, payload: T, source: string): void {
  const event: SilenceEvent<T> = { type, payload, timestamp: new Date().toISOString(), source };
  handlers.get(type)?.forEach((h) => h(event as SilenceEvent));
}

export function on<T>(type: EventType, handler: Handler<T>): () => void {
  if (!handlers.has(type)) handlers.set(type, new Set());
  handlers.get(type)!.add(handler as Handler);
  return () => { handlers.get(type)?.delete(handler as Handler); };
}
