# Event Catalog

Typed events flowing through the @silence/events bus.

| Event | Payload | Source |
|---|---|---|
| kpi.updated | KpiMetrics | analytics-reporter |
| kpi.threshold.breached | { metric, value, threshold } | anomaly-detector |
| agent.started | { agentId, name } | orchestrator |
| agent.stopped | { agentId, reason } | orchestrator |
| agent.error | { agentId, error } | any agent |
| portal.navigation | { from, to, role } | portal app |
