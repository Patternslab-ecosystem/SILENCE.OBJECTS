/** Configuration for a managed agent */
export interface AgentConfig {
  id: string;
  name: string;
  enabled: boolean;
  schedule?: string;
  maxConcurrency?: number;
}

/** Runtime status of an agent */
export interface AgentStatus {
  id: string;
  name: string;
  state: "idle" | "running" | "error" | "stopped";
  lastRun?: number;
  errorCount: number;
}
