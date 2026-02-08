import Link from "next/link";
import {
  SAFETY_STATUS,
  SYSTEM_FLOW,
  MONETIZATION,
  SAFETY_LAYERS,
  CRISIS_DATA,
  AGENT_CHAIN,
  REPORTS_CONFIDENCE,
  MODULE_STATUS,
  PAYWALL_FUNNEL,
  REVENUE_PROJECTION,
  PHASE_PROGRESS,
  CI_CD_STATUS,
  RECENT_EVENTS,
} from "./data/mock";

// ─────────────────────────────────────────────────────────────
// Tabs
// ─────────────────────────────────────────────────────────────
const TABS = [
  { id: "command-center", label: "Command Center", active: true },
  { id: "investor", label: "Investor", href: "/investor/dashboard" },
  { id: "patternlens", label: "PatternLens" },
  { id: "patternslab", label: "PatternsLab" },
  { id: "modules", label: "Modules" },
  { id: "agents", label: "Agents", href: "#agents" },
  { id: "opensource", label: "Open Source" },
] as const;

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function StatusDot({ ok }: { ok: boolean }) {
  return (
    <span
      className="w-2 h-2 rounded-full inline-block flex-shrink-0"
      style={{ background: ok ? "var(--color-success)" : "var(--color-error)" }}
    />
  );
}

function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return String(n);
}

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const revMax = Math.max(...REVENUE_PROJECTION.map((r) => r.arr));

  return (
    <main
      className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto"
      style={{ background: "var(--color-background)", color: "var(--color-text)" }}
    >
      {/* ══════════ HEADER ══════════ */}
      <header className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
            <circle cx="35" cy="40" r="8" fill="none" stroke="#21808d" strokeWidth="2" opacity="0.6" />
            <circle cx="85" cy="40" r="8" fill="none" stroke="#21808d" strokeWidth="2" opacity="0.6" />
            <circle cx="60" cy="70" r="8" fill="none" stroke="#21808d" strokeWidth="2" opacity="0.6" />
            <line x1="35" y1="40" x2="60" y2="70" stroke="#21808d" strokeWidth="1.5" opacity="0.4" strokeDasharray="4 2" />
            <line x1="85" y1="40" x2="60" y2="70" stroke="#21808d" strokeWidth="1.5" opacity="0.4" strokeDasharray="4 2" />
            <line x1="35" y1="40" x2="85" y2="40" stroke="#21808d" strokeWidth="1.5" opacity="0.4" strokeDasharray="4 2" />
            <rect x="55" y="65" width="10" height="10" fill="#21808d" opacity="0.8" />
          </svg>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--color-text)" }}>
            SILENCE.OBJECTS
          </h1>
          <span
            className="text-xs px-2 py-0.5 rounded font-mono"
            style={{ background: "rgba(50,184,198,0.15)", color: "var(--color-primary)" }}
          >
            v5.0
          </span>
        </div>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Command Center
        </p>
      </header>

      {/* ══════════ PRE-LAUNCH BANNER ══════════ */}
      <div
        className="mb-4 px-4 py-2 rounded-lg text-center"
        style={{
          background: "rgba(245,158,11,0.08)",
          border: "1px solid rgba(245,158,11,0.25)",
          fontFamily: "monospace",
          fontSize: "13px",
          color: "#f59e0b",
        }}
      >
        Pre-launch command center &middot; Metrics = targets &middot; Live data: Phase 1
      </div>

      {/* ══════════ TABS ══════════ */}
      <nav className="flex flex-wrap gap-2 mb-8 pb-4" style={{ borderBottom: "1px solid var(--color-border)" }}>
        {TABS.map((tab) => {
          const isActive = "active" in tab && tab.active;
          const baseClass = "px-4 py-2 rounded-lg text-sm transition-colors";
          const cls = isActive
            ? `${baseClass} font-medium`
            : `${baseClass} hover:opacity-80`;
          const style = isActive
            ? { background: "var(--color-primary)", color: "#0f1010" }
            : { background: "var(--color-surface)", color: "var(--color-text-secondary)" };

          if ("href" in tab && tab.href) {
            return (
              <Link key={tab.id} href={tab.href} className={cls} style={style}>
                {tab.label}
              </Link>
            );
          }
          return (
            <a key={tab.id} href={`#${tab.id}`} className={cls} style={style}>
              {tab.label}
            </a>
          );
        })}
      </nav>

      {/* ══════════════════════════════════════════════════════════════
           BAND 1: HERO KPIs
         ══════════════════════════════════════════════════════════════ */}
      <section className="mb-6">
        <h2
          className="text-sm font-semibold uppercase tracking-wide mb-4"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Hero KPIs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-[40%_35%_25%] gap-4">
          {/* Card 1: Safety Status */}
          <div
            className="rounded-lg p-4 md:p-5"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            <p
              className="text-xs uppercase tracking-widest mb-3"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Safety Status
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <StatusDot ok={SAFETY_STATUS.tier1_safety} />
                <span className="text-xs" style={{ color: "var(--color-text)" }}>
                  Tier-1 Safety
                </span>
              </div>
              <div className="flex items-center gap-2">
                <StatusDot ok={SAFETY_STATUS.crisis_detection} />
                <span className="text-xs" style={{ color: "var(--color-text)" }}>
                  Crisis Detection
                </span>
              </div>
              <div className="flex items-center gap-2">
                <StatusDot ok={SAFETY_STATUS.forbidden_vocab_clean} />
                <span className="text-xs" style={{ color: "var(--color-text)" }}>
                  Forbidden Vocab Clean
                </span>
              </div>
            </div>

            {/* Compliance score bar */}
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                  Compliance
                </span>
                <span className="font-mono text-2xl font-bold" style={{ color: "var(--color-text)" }}>
                  {SAFETY_STATUS.compliance_score}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full" style={{ background: "rgba(119,124,124,0.2)" }}>
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${SAFETY_STATUS.compliance_score}%`,
                    background: "var(--color-success)",
                  }}
                />
              </div>
            </div>

            <p className="text-xs mt-2" style={{ color: "var(--color-text-secondary)" }}>
              Last scan: {SAFETY_STATUS.last_scan}
            </p>
          </div>

          {/* Card 2: System Flow */}
          <div
            className="rounded-lg p-4 md:p-5"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            <p
              className="text-xs uppercase tracking-widest mb-3"
              style={{ color: "var(--color-text-secondary)" }}
            >
              System Flow
            </p>

            <div className="flex items-center gap-2 mb-4">
              <span
                className="text-xs px-2 py-0.5 rounded-full font-mono"
                style={{
                  background:
                    SYSTEM_FLOW.api_status === "healthy"
                      ? "rgba(16,185,129,0.15)"
                      : SYSTEM_FLOW.api_status === "degraded"
                        ? "rgba(245,158,11,0.15)"
                        : "rgba(255,84,89,0.15)",
                  color:
                    SYSTEM_FLOW.api_status === "healthy"
                      ? "var(--color-success)"
                      : SYSTEM_FLOW.api_status === "degraded"
                        ? "var(--color-warning)"
                        : "var(--color-error)",
                }}
              >
                {SYSTEM_FLOW.api_status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs uppercase tracking-widest" style={{ color: "var(--color-text-secondary)" }}>
                  Avg Response
                </p>
                <p className="font-mono text-2xl font-bold" style={{ color: "var(--color-text)" }}>
                  {SYSTEM_FLOW.avg_response_ms}<span className="text-xs font-normal">ms</span>
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest" style={{ color: "var(--color-text-secondary)" }}>
                  Success Rate
                </p>
                <p className="font-mono text-2xl font-bold" style={{ color: "var(--color-text)" }}>
                  {SYSTEM_FLOW.successful_flows_pct}%
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest" style={{ color: "var(--color-text-secondary)" }}>
                  Active Modules
                </p>
                <p className="font-mono text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
                  {SYSTEM_FLOW.active_modules}
                  <span className="text-xs font-normal" style={{ color: "var(--color-text-secondary)" }}>
                    /{SYSTEM_FLOW.total_modules}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest" style={{ color: "var(--color-text-secondary)" }}>
                  Last Deploy
                </p>
                <p className="text-xs font-mono mt-1" style={{ color: "var(--color-text)" }}>
                  {SYSTEM_FLOW.last_deploy}
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Monetization */}
          <div
            className="rounded-lg p-4 md:p-5"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            <p
              className="text-xs uppercase tracking-widest mb-3"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Monetization
            </p>

            <div className="mb-3">
              <p className="text-xs uppercase tracking-widest" style={{ color: "var(--color-text-secondary)" }}>
                ARR
              </p>
              <p className="font-mono text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
                {formatCurrency(MONETIZATION.arr)} PLN
              </p>
            </div>

            <div className="mb-3">
              <p className="text-xs uppercase tracking-widest" style={{ color: "var(--color-text-secondary)" }}>
                MRR
              </p>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-2xl font-bold" style={{ color: "var(--color-text)" }}>
                  {formatCurrency(MONETIZATION.mrr)}
                </span>
                <span className="text-xs font-mono" style={{ color: "var(--color-success)" }}>
                  {MONETIZATION.mrr_trend}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs uppercase tracking-widest" style={{ color: "var(--color-text-secondary)" }}>
                  Paying
                </p>
                <p className="font-mono text-lg font-bold" style={{ color: "var(--color-text)" }}>
                  {MONETIZATION.paying_users}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest" style={{ color: "var(--color-text-secondary)" }}>
                  Conversion
                </p>
                <p className="font-mono text-lg font-bold" style={{ color: "var(--color-text)" }}>
                  {MONETIZATION.conversion_rate}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
           BAND 2: HEALTH & RISK
         ══════════════════════════════════════════════════════════════ */}
      <section className="mb-6">
        <h2
          className="text-sm font-semibold uppercase tracking-wide mb-4"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Health &amp; Risk
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Safety Layers */}
          <div
            className="rounded-lg p-4 md:p-5"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            <p
              className="text-xs uppercase tracking-widest mb-4"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Safety Layers
            </p>

            <div className="flex flex-col gap-3">
              {SAFETY_LAYERS.map((layer, i) => (
                <div key={layer.name}>
                  <div className="flex items-center gap-3">
                    {/* Status dot */}
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        background:
                          layer.status === "ok"
                            ? "var(--color-success)"
                            : layer.status === "warn"
                              ? "var(--color-warning)"
                              : "var(--color-error)",
                      }}
                    />
                    {/* Layer info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono truncate" style={{ color: "var(--color-text)" }}>
                        {layer.name}
                      </p>
                      <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                        {layer.last_test}
                      </p>
                    </div>
                  </div>
                  {/* Arrow between layers */}
                  {i < SAFETY_LAYERS.length - 1 && (
                    <div className="flex justify-center my-1">
                      <svg width="12" height="16" viewBox="0 0 12 16" style={{ color: "var(--color-primary)" }}>
                        <path d="M6 0 L6 12 M2 8 L6 12 L10 8" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Crisis & Compliance */}
          <div
            className="rounded-lg p-4 md:p-5"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            <p
              className="text-xs uppercase tracking-widest mb-4"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Crisis &amp; Compliance
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest" style={{ color: "var(--color-text-secondary)" }}>
                  Incidents (24h)
                </p>
                <p
                  className="font-mono text-2xl font-bold"
                  style={{ color: CRISIS_DATA.incidents_24h === 0 ? "var(--color-success)" : "var(--color-error)" }}
                >
                  {CRISIS_DATA.incidents_24h}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest" style={{ color: "var(--color-text-secondary)" }}>
                  Incidents (7d)
                </p>
                <p
                  className="font-mono text-2xl font-bold"
                  style={{ color: CRISIS_DATA.incidents_7d === 0 ? "var(--color-success)" : "var(--color-warning)" }}
                >
                  {CRISIS_DATA.incidents_7d}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest" style={{ color: "var(--color-text-secondary)" }}>
                  Forbidden Violations (24h)
                </p>
                <p
                  className="font-mono text-2xl font-bold"
                  style={{
                    color: CRISIS_DATA.forbidden_violations_24h === 0 ? "var(--color-success)" : "var(--color-error)",
                  }}
                >
                  {CRISIS_DATA.forbidden_violations_24h}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest" style={{ color: "var(--color-text-secondary)" }}>
                  Compliance Score
                </p>
                <p className="font-mono text-2xl font-bold" style={{ color: "var(--color-success)" }}>
                  {CRISIS_DATA.copy_compliance_score}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
           BAND 3: AGENTS & STRUCTURES
         ══════════════════════════════════════════════════════════════ */}
      <section className="mb-6">
        <h2
          className="text-sm font-semibold uppercase tracking-wide mb-4"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Agents &amp; Structures
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-[35%_35%_30%] gap-4">
          {/* Card 1: Agent Chain */}
          <div
            className="rounded-lg p-4 md:p-5"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            <p
              className="text-xs uppercase tracking-widest mb-4"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Agent Chain
            </p>

            <div className="space-y-2">
              {AGENT_CHAIN.map((agent, i) => (
                <div key={agent.step}>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        background:
                          agent.status === "ok"
                            ? "var(--color-success)"
                            : agent.status === "warn"
                              ? "var(--color-warning)"
                              : "var(--color-error)",
                      }}
                    />
                    <span className="text-xs font-mono flex-1 truncate" style={{ color: "var(--color-text)" }}>
                      {agent.step}
                    </span>
                    <span className="text-xs font-mono" style={{ color: "var(--color-text-secondary)" }}>
                      {agent.latency_ms}ms
                    </span>
                  </div>
                  {i < AGENT_CHAIN.length - 1 && (
                    <div className="flex justify-center my-0.5">
                      <span className="text-xs" style={{ color: "var(--color-primary)", opacity: 0.5 }}>
                        |
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Reports Confidence */}
          <div
            className="rounded-lg p-4 md:p-5"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            <p
              className="text-xs uppercase tracking-widest mb-4"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Reports Confidence
            </p>

            <div className="space-y-3">
              {REPORTS_CONFIDENCE.map((phase) => {
                const barColor =
                  phase.avg_confidence >= 0.85
                    ? "#10b981"
                    : phase.avg_confidence >= 0.7
                      ? "#32b8c6"
                      : "#f59e0b";
                return (
                  <div key={phase.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono" style={{ color: "var(--color-text)" }}>
                        {phase.name}
                      </span>
                      <span className="text-xs font-mono font-bold" style={{ color: barColor }}>
                        {(phase.avg_confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ background: "rgba(119,124,124,0.2)" }}>
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${phase.avg_confidence * 100}%`,
                          background: barColor,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 3: Recent Events */}
          <div
            className="rounded-lg p-4 md:p-5 overflow-hidden"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            <p
              className="text-xs uppercase tracking-widest mb-4"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Event Schema Preview
            </p>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {RECENT_EVENTS.map((evt, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                    style={{
                      background:
                        evt.type === "success"
                          ? "var(--color-success)"
                          : evt.type === "warn"
                            ? "var(--color-warning)"
                            : "var(--color-primary)",
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono" style={{ color: "var(--color-text)" }}>
                        {evt.event}
                      </span>
                      <span className="text-xs" style={{ color: "var(--color-text-secondary)", opacity: 0.6 }}>
                        {evt.time}
                      </span>
                    </div>
                    <p className="text-xs truncate" style={{ color: "var(--color-text-secondary)" }}>
                      {evt.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
           BAND 4: BUSINESS
         ══════════════════════════════════════════════════════════════ */}
      <section className="mb-6">
        <h2
          className="text-sm font-semibold uppercase tracking-wide mb-4"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Business
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-4">
          {/* Card 1: Paywall Funnel */}
          <div
            className="rounded-lg p-4 md:p-5"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            <p
              className="text-xs uppercase tracking-widest mb-4"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Paywall Funnel
            </p>

            <div className="space-y-2">
              {PAYWALL_FUNNEL.map((step) => (
                <div key={step.step} className="flex items-center gap-3">
                  <span
                    className="text-xs w-36 truncate flex-shrink-0"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {step.step}
                  </span>
                  <div className="flex-1 h-5 rounded overflow-hidden" style={{ background: "rgba(119,124,124,0.15)" }}>
                    <div
                      className="h-full rounded flex items-center justify-end pr-2"
                      style={{
                        width: `${step.pct}%`,
                        background: "rgba(50,184,198,0.5)",
                        minWidth: step.pct > 0 ? "2rem" : "0",
                      }}
                    >
                      <span className="text-xs font-mono" style={{ color: "var(--color-text)" }}>
                        {step.count}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono w-12 text-right" style={{ color: "var(--color-text-secondary)" }}>
                    {step.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Revenue Projection */}
          <div
            className="rounded-lg p-4 md:p-5"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            <p
              className="text-xs uppercase tracking-widest mb-4"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Revenue Projection (ARR)
            </p>

            <div className="flex items-end gap-3 h-40">
              {REVENUE_PROJECTION.map((proj) => {
                const pct = (proj.arr / revMax) * 100;
                return (
                  <div key={proj.period} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <span className="text-xs font-mono font-bold" style={{ color: "var(--color-primary)" }}>
                      {formatCurrency(proj.arr)}
                    </span>
                    <div
                      className="w-full rounded-t"
                      style={{
                        height: `${pct}%`,
                        background: "rgba(50,184,198,0.5)",
                        minHeight: "4px",
                      }}
                    />
                    <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                      {proj.period}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
           BAND 5: OPS
         ══════════════════════════════════════════════════════════════ */}
      <section className="mb-6">
        <h2
          className="text-sm font-semibold uppercase tracking-wide mb-4"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Ops
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Phase Progress */}
          <div
            className="rounded-lg p-4 md:p-5"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            <p
              className="text-xs uppercase tracking-widest mb-4"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Phase Progress
            </p>

            <div className="space-y-3">
              {PHASE_PROGRESS.map((phase) => (
                <div key={phase.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono" style={{ color: "var(--color-text)" }}>
                      {phase.name}
                    </span>
                    <span className="text-xs font-mono font-bold" style={{ color: "var(--color-text)" }}>
                      {phase.progress}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ background: "rgba(119,124,124,0.2)" }}>
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${phase.progress}%`,
                        background:
                          phase.status === "active"
                            ? "var(--color-primary)"
                            : "rgba(119,124,124,0.4)",
                        minWidth: phase.progress > 0 ? "4px" : "0",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: CI/CD Status */}
          <div
            className="rounded-lg p-4 md:p-5"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            <p
              className="text-xs uppercase tracking-widest mb-4"
              style={{ color: "var(--color-text-secondary)" }}
            >
              CI/CD Status
            </p>

            <div className="space-y-2 mb-4">
              {(
                [
                  ["Sentinel Vocabulary", CI_CD_STATUS.sentinel_vocabulary],
                  ["Sentinel Build", CI_CD_STATUS.sentinel_build],
                  ["Sentinel Contracts", CI_CD_STATUS.sentinel_contracts],
                ] as const
              ).map(([label, check]) => (
                <div key={label} className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{
                      background: check.status === "pass" ? "var(--color-success)" : "var(--color-error)",
                    }}
                  />
                  <span className="text-xs font-mono flex-1" style={{ color: "var(--color-text)" }}>
                    {label}
                  </span>
                  <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                    {check.last_run}
                  </span>
                </div>
              ))}
            </div>

            <div
              className="rounded-lg p-3 mt-3"
              style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}
            >
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--color-text-secondary)" }}>
                Last Deploy
              </p>
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    background:
                      CI_CD_STATUS.last_deploy.status === "success"
                        ? "var(--color-success)"
                        : "var(--color-error)",
                  }}
                />
                <span className="text-xs font-mono" style={{ color: "var(--color-text)" }}>
                  {CI_CD_STATUS.last_deploy.env}
                </span>
                <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                  {CI_CD_STATUS.last_deploy.at}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ MODULE GRID ══════════ */}
      <section className="mb-6">
        <h2
          className="text-sm font-semibold uppercase tracking-wide mb-4"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Modules ({MODULE_STATUS.length})
        </h2>
        <div
          className="rounded-lg p-4 md:p-5"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
            {MODULE_STATUS.map((mod) => (
              <div
                key={mod.name}
                className="flex items-center gap-2 px-3 py-2 rounded-lg"
                style={{ background: "rgba(119,124,124,0.08)" }}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{
                    background: mod.status === "ready" ? "var(--color-success)" : "rgba(119,124,124,0.4)",
                  }}
                />
                <span className="text-xs font-mono truncate" style={{ color: "var(--color-text)" }}>
                  {mod.name}
                </span>
                <span
                  className="text-xs ml-auto flex-shrink-0"
                  style={{
                    color: mod.type === "open" ? "var(--color-primary)" : "var(--color-warning)",
                    opacity: 0.7,
                  }}
                >
                  {mod.type === "open" ? "O" : "C"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
           AGENTS
         ══════════════════════════════════════════════════════════════ */}
      <section id="agents" className="mb-6">
        <h2
          className="text-sm font-semibold uppercase tracking-wide mb-4"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Agents
        </h2>

        {/* Layer 0 — Guardian (Sentinel) */}
        <div className="mb-6">
          <h3
            className="text-xs font-semibold uppercase tracking-wide mb-3"
            style={{ color: "var(--color-primary)" }}
          >
            Layer 0 — Guardian (Sentinel)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { name: "Terminology Guard", status: "active" as const },
              { name: "Contracts Guard", status: "active" as const },
              { name: "Dependency Guard", status: "active" as const },
              { name: "Closed Module Guard", status: "active" as const },
              { name: "Type Safety Guard", status: "planned" as const },
              { name: "Security Guard", status: "planned" as const },
              { name: "Build Guard", status: "active" as const, label: "via GitHub Actions" },
            ].map((guard) => (
              <div
                key={guard.name}
                className="rounded-lg p-4"
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{
                      background:
                        guard.status === "active"
                          ? "var(--color-success)"
                          : "rgba(119,124,124,0.4)",
                    }}
                  />
                  <span className="text-xs font-mono" style={{ color: "var(--color-text)" }}>
                    {guard.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs"
                    style={{
                      color:
                        guard.status === "active"
                          ? "var(--color-success)"
                          : "var(--color-text-secondary)",
                    }}
                  >
                    {guard.status === "active" ? "Active" : "Planned"}
                  </span>
                  {"label" in guard && guard.label && (
                    <span
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{
                        background: "rgba(50,184,198,0.15)",
                        color: "var(--color-primary)",
                        fontSize: "10px",
                      }}
                    >
                      {guard.label}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Layer 1 — Revenue Engine (Planned) */}
        <div className="mb-6">
          <h3
            className="text-xs font-semibold uppercase tracking-wide mb-3"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Layer 1 — Revenue Engine (Planned)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {["Analytics Reporter", "Sales Autopilot", "Customer Success"].map((name) => (
              <div
                key={name}
                className="rounded-lg p-4"
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  opacity: 0.6,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: "rgba(119,124,124,0.4)" }}
                  />
                  <span className="text-xs font-mono" style={{ color: "var(--color-text)" }}>
                    {name}
                  </span>
                </div>
                <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                  Planned
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Layer 2 — Growth Army (Planned) */}
        <div className="mb-6">
          <h3
            className="text-xs font-semibold uppercase tracking-wide mb-3"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Layer 2 — Growth Army (Planned)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {["LinkedIn Dominator", "Content Machine", "Social Swarm"].map((name) => (
              <div
                key={name}
                className="rounded-lg p-4"
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  opacity: 0.6,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: "rgba(119,124,124,0.4)" }}
                  />
                  <span className="text-xs font-mono" style={{ color: "var(--color-text)" }}>
                    {name}
                  </span>
                </div>
                <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                  Planned
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Operational cost */}
        <div
          className="rounded-lg p-3 text-center"
          style={{
            background: "rgba(50,184,198,0.08)",
            border: "1px solid rgba(50,184,198,0.2)",
          }}
        >
          <span className="text-xs font-mono" style={{ color: "var(--color-text-secondary)" }}>
            Operational cost: ~&#8364;5.80/mo (Sentinel) + $0 (GitHub Actions free tier)
          </span>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer
        className="mt-12 pt-6 text-center"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        <p className="text-xs" style={{ color: "var(--color-text-secondary)", opacity: 0.6 }}>
          SILENCE.OBJECTS v5.0 — Open Core Framework
        </p>
      </footer>
    </main>
  );
}
