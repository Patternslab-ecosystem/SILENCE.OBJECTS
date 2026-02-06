import type { KpiMetrics } from "@silence/contracts";

/** Base event shape */
export interface SilenceEvent<T = unknown> {
  type: string;
  payload: T;
  timestamp: number;
  source: string;
}

/** Event handler function */
export type EventHandler<T = unknown> = (event: SilenceEvent<T>) => void | Promise<void>;

/** Registry of all typed events in the system */
export interface EventMap {
  "kpi.updated": KpiMetrics;
  "kpi.threshold.breached": { metric: string; value: number; threshold: number };
  "agent.started": { agentId: string; name: string };
  "agent.stopped": { agentId: string; reason: string };
  "agent.error": { agentId: string; error: string };
  "portal.navigation": { from: string; to: string; role: string };
}
