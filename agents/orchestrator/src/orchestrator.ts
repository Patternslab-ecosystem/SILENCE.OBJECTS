import { EventBus } from "@silence/events";
import type { AgentConfig, AgentStatus } from "./types";

/**
 * Meta-agent: manages lifecycle of all other agents.
 * Handles registration, scheduling, health checks, and shutdown.
 */
export class Orchestrator {
  private agents = new Map<string, AgentStatus>();
  private bus: EventBus;

  constructor(bus?: EventBus) {
    this.bus = bus ?? new EventBus();
  }

  register(config: AgentConfig): void {
    this.agents.set(config.id, {
      id: config.id,
      name: config.name,
      state: config.enabled ? "idle" : "stopped",
      errorCount: 0,
    });
    this.bus.emit("agent.started", { agentId: config.id, name: config.name }, "orchestrator");
  }

  getStatus(agentId: string): AgentStatus | undefined {
    return this.agents.get(agentId);
  }

  listAgents(): AgentStatus[] {
    return Array.from(this.agents.values());
  }

  async stop(agentId: string, reason: string): Promise<void> {
    const agent = this.agents.get(agentId);
    if (!agent) return;
    agent.state = "stopped";
    await this.bus.emit("agent.stopped", { agentId, reason }, "orchestrator");
  }

  async stopAll(reason: string): Promise<void> {
    for (const agent of this.agents.values()) {
      if (agent.state !== "stopped") {
        await this.stop(agent.id, reason);
      }
    }
  }
}
