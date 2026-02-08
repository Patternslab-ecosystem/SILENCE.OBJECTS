import Link from "next/link";
import {
  HERO_KPI, SYSTEM_STATUS, SAFETY_COMPLIANCE,
  APP_STATUS, MODULE_STATUS, ARCHETYPE_DISTRIBUTION,
  AGENT_LAYERS, AGENT_PERFORMANCE, AGENT_POLICY_ALERTS,
  EVENTS_RATE, RECENT_EVENTS, EVENTS_CRISIS,
  COMPLIANCE_MATRIX, SAFETY_CRISIS_FEED, LANGUAGE_GUARD,
  ARCHITECTURE_LAYERS, MODULE_DETAIL, DATA_LAYER,
  REVENUE_PROJECTION, UNIT_ECONOMICS, REVENUE_TARGETS,
  OPS_SERVICES, ORCHESTRATOR_RULES, BUILD_ORDER, CI_CD_STATUS,
} from "./data/mock";

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return String(n);
}

function fmtPLN(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M PLN`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k PLN`;
  return `${n} PLN`;
}

// ─────────────────────────────────────────────────────────────
// Widget Card (per PORTAL_DASHBOARD_SPEC.md template)
// ─────────────────────────────────────────────────────────────

function Widget({ title, question, children, footer }: {
  title: string; question: string; children: React.ReactNode; footer?: React.ReactNode;
}) {
  return (
    <div className="bg-[#111113] border border-[#222228] rounded-xl p-5 hover:shadow-lg hover:shadow-[#21808d]/5 transition-all duration-300">
      <h3 className="text-base font-medium text-[#e8e8ec]" style={{ fontFamily: "'Outfit', sans-serif" }}>{title}</h3>
      <p className="font-mono text-[10px] text-[#888893] mt-0.5">{question}</p>
      <div className="mt-4">{children}</div>
      {footer && <div className="mt-3 pt-3 border-t border-[#222228] flex gap-2">{footer}</div>}
    </div>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-sm font-medium uppercase tracking-[0.15em] mb-4"
      style={{ color: "#888893", borderLeft: "2px solid #21808d", paddingLeft: 12, fontFamily: "'JetBrains Mono', monospace" }}
    >
      {children}
    </h2>
  );
}

function StatusDot({ color, pulse }: { color: string; pulse?: boolean }) {
  return <span className={`w-2 h-2 rounded-full inline-block flex-shrink-0 ${pulse ? "animate-pulse" : ""}`} style={{ background: color }} />;
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    operational: { bg: "rgba(61,153,112,0.1)", text: "#3d9970" },
    degraded: { bg: "rgba(212,168,67,0.1)", text: "#d4a843" },
    down: { bg: "rgba(204,68,68,0.1)", text: "#cc4444" },
    green: { bg: "rgba(61,153,112,0.1)", text: "#3d9970" },
    pass: { bg: "rgba(61,153,112,0.1)", text: "#3d9970" },
    active: { bg: "rgba(33,128,141,0.1)", text: "#21808d" },
  };
  const c = colors[status] ?? { bg: "rgba(85,85,94,0.1)", text: "#55555e" };
  return <span className="text-[10px] px-2 py-0.5 rounded font-mono" style={{ background: c.bg, color: c.text }}>{status}</span>;
}

function PBadge({ level }: { level: "P0" | "P1" | "P2" }) {
  const m: Record<string, { bg: string; text: string; border: string }> = {
    P0: { bg: "rgba(204,68,68,0.1)", text: "#cc4444", border: "rgba(204,68,68,0.3)" },
    P1: { bg: "rgba(212,168,67,0.1)", text: "#d4a843", border: "rgba(212,168,67,0.3)" },
    P2: { bg: "rgba(234,179,8,0.1)", text: "#facc15", border: "rgba(234,179,8,0.3)" },
  };
  const c = m[level];
  return <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold" style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>{level}</span>;
}

function ComplianceDot({ status }: { status: string }) {
  if (status === "ok") return <StatusDot color="#3d9970" />;
  if (status === "warn") return <StatusDot color="#d4a843" />;
  if (status === "fail") return <StatusDot color="#cc4444" />;
  return <span className="text-[10px] text-[#55555e]">-</span>;
}

function BuildIcon({ status }: { status: string }) {
  if (status === "done") return <span className="text-[10px]" style={{ color: "#3d9970" }}>&#x2713;</span>;
  if (status === "wip") return <span className="text-[10px]" style={{ color: "#d4a843" }}>&#x25CF;</span>;
  return <span className="text-[10px]" style={{ color: "#55555e" }}>&#x25CB;</span>;
}

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const revMax = Math.max(...REVENUE_PROJECTION.map((r) => r.arr));
  const archMax = Math.max(...ARCHETYPE_DISTRIBUTION.map((a) => a.pct));

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-[1400px] mx-auto" style={{ background: "#08080a", color: "#e8e8ec" }}>
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
          <h1 className="text-xl font-semibold tracking-tight" style={{ fontFamily: "'JetBrains Mono', monospace" }}>SILENCE.OBJECTS</h1>
          <span className="text-[10px] px-2 py-0.5 rounded font-mono" style={{ background: "rgba(33,128,141,0.15)", color: "#21808d" }}>v5.1</span>
        </div>
        <p className="text-sm" style={{ color: "#888893", fontFamily: "'Outfit', sans-serif" }}>Control Tower &mdash; 24-Widget Command Center</p>
      </header>

      {/* ══════════ GLOBAL FILTERS ══════════ */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="flex gap-1 rounded-lg p-1 bg-[#111113] border border-[#222228]">
          {["24h", "7d", "30d", "All"].map((t, i) => (
            <button key={t} className="px-3 py-1 rounded text-xs font-mono" style={i === 1 ? { background: "#21808d", color: "#08080a" } : { color: "#888893" }}>{t}</button>
          ))}
        </div>
        <div className="flex gap-1 rounded-lg p-1 bg-[#111113] border border-[#222228]">
          {["prod", "stage", "local"].map((e, i) => (
            <button key={e} className="px-3 py-1 rounded text-xs font-mono" style={i === 0 ? { background: "#21808d", color: "#08080a" } : { color: "#888893" }}>{e}</button>
          ))}
        </div>
        <Link href="/investor/dashboard" className="px-4 py-1.5 rounded-lg text-xs font-mono bg-[#111113] border border-[#222228] text-[#888893]">
          Investor View
        </Link>
      </div>

      {/* ══════════ PRE-LAUNCH BANNER ══════════ */}
      <div className="mb-6 px-4 py-2 rounded-lg text-center font-mono text-[12px]" style={{ background: "rgba(212,168,67,0.08)", border: "1px solid rgba(212,168,67,0.25)", color: "#d4a843" }}>
        Pre-launch command center &middot; All metrics = mock targets &middot; Replace with Supabase queries
      </div>

      {/* ═══════════════════════════════════════════════════════
           BAND A: HERO KPIs — 5fr / 4fr / 3fr (W1 + W2 + W3)
         ═══════════════════════════════════════════════════════ */}
      <section className="mb-8">
        <SectionHeader>Hero KPIs</SectionHeader>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* W1: hero_kpi_overview (5 cols) */}
          <div className="md:col-span-5">
            <Widget title="KPI Overview" question="Jaki jest aktualny stan biznesu?">
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "ARR", value: fmtPLN(HERO_KPI.arr), color: "#21808d" },
                  { label: "MRR", value: fmt(HERO_KPI.mrr), color: "#e8e8ec" },
                  { label: "DAU", value: String(HERO_KPI.dau), color: "#e8e8ec" },
                  { label: "Churn", value: `${HERO_KPI.churn}%`, color: HERO_KPI.churn < 5 ? "#3d9970" : "#cc4444" },
                  { label: "LTV/CAC", value: `${HERO_KPI.ltv_cac}x`, color: "#3d9970" },
                  { label: "Conv.", value: `${HERO_KPI.conversion}%`, color: "#21808d" },
                  { label: "Runway", value: `${HERO_KPI.runway_months}mo`, color: "#e8e8ec" },
                  { label: "NRR", value: `${HERO_KPI.nrr}%`, color: "#3d9970" },
                ].map(({ label, value, color }) => (
                  <div key={label}>
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#888893]">{label}</p>
                    <p className="font-mono text-2xl font-bold tabular-nums" style={{ color }}>{value}</p>
                  </div>
                ))}
              </div>
            </Widget>
          </div>

          {/* W2: hero_system_status (4 cols) */}
          <div className="md:col-span-4">
            <Widget title="System Status" question="Czy framework i kluczowe systemy dzialaja?">
              <div className="space-y-2">
                {[
                  { label: "Edge", status: SYSTEM_STATUS.edge_status },
                  { label: "Serverless", status: SYSTEM_STATUS.serverless_status },
                  { label: "Supabase", status: SYSTEM_STATUS.supabase_status },
                  { label: "n8n", status: SYSTEM_STATUS.n8n_status },
                ].map(({ label, status }) => (
                  <div key={label} className="flex items-center gap-2">
                    <StatusDot color={status === "operational" ? "#3d9970" : status === "degraded" ? "#d4a843" : "#cc4444"} pulse={status === "operational"} />
                    <span className="text-[11px] font-mono flex-1 text-[#e8e8ec]">{label}</span>
                    <StatusBadge status={status} />
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-3 text-[10px] text-[#55555e]">
                <span>Commit: <span className="font-mono text-[#888893]">{SYSTEM_STATUS.last_commit}</span></span>
                <span>CI: <StatusBadge status={SYSTEM_STATUS.ci_status} /></span>
              </div>
            </Widget>
          </div>

          {/* W3: hero_safety_compliance (3 cols) */}
          <div className="md:col-span-3">
            <Widget title="Safety Compliance" question="Czy P0/P1/P2 sa spelnione?">
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(204,68,68,0.1)", border: "1px solid rgba(204,68,68,0.3)" }}>
                  <PBadge level="P0" />
                  <span className="text-[10px] flex-1 text-[#888893]">{SAFETY_COMPLIANCE.p0_crisis.label}</span>
                  <span className="font-mono text-xs font-bold text-[#3d9970]">{SAFETY_COMPLIANCE.p0_crisis.pass_rate}%</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(212,168,67,0.1)" }}>
                  <PBadge level="P1" />
                  <span className="text-[10px] flex-1 text-[#888893]">{SAFETY_COMPLIANCE.p1_vocabulary.label}</span>
                  <span className="font-mono text-xs font-bold text-[#3d9970]">{SAFETY_COMPLIANCE.p1_vocabulary.violations_24h}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(234,179,8,0.1)" }}>
                  <PBadge level="P2" />
                  <span className="text-[10px] flex-1 text-[#888893]">{SAFETY_COMPLIANCE.p2_framing.label}</span>
                  <span className="font-mono text-xs font-bold text-[#3d9970]">{SAFETY_COMPLIANCE.p2_framing.warnings_24h}</span>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-[10px]">
                <span className="text-[#55555e]">Nuclear events 24h</span>
                <span className="font-mono font-bold text-[#3d9970]">{SAFETY_COMPLIANCE.nuclear_events_24h}</span>
              </div>
            </Widget>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
           BAND B: PRODUCT | AGENTS | EVENTS (W4-W12)
         ═══════════════════════════════════════════════════════ */}
      <section className="mb-8">
        <SectionHeader>Product &middot; Agents &middot; Events</SectionHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1: Product */}
          <div className="space-y-6">
            {/* W4: product_app_status */}
            <Widget title="App Status" question="Czy kluczowe aplikacje sa dostepne?">
              <div className="space-y-2">
                {APP_STATUS.map((app) => (
                  <div key={app.name} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(119,124,124,0.06)" }}>
                    <StatusDot color={app.status === "operational" ? "#3d9970" : app.status === "degraded" ? "#d4a843" : "#cc4444"} pulse={app.status === "operational"} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-mono font-bold text-[#e8e8ec] truncate">{app.name}</p>
                      <p className="text-[10px] text-[#55555e]">{app.domain}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-xs font-bold text-[#e8e8ec]">{app.dau} <span className="text-[#55555e] font-normal">DAU</span></p>
                      <p className="text-[10px] text-[#55555e]">{app.sessions} sessions</p>
                    </div>
                  </div>
                ))}
              </div>
            </Widget>

            {/* W5: product_module_activation */}
            <Widget title="Module Activation" question="Ktore moduly frameworka sa aktywne?">
              <div className="space-y-1">
                {MODULE_STATUS.map((mod) => (
                  <div key={mod.name} className="flex items-center gap-2 px-2 py-1 rounded" style={{ background: "rgba(119,124,124,0.06)" }}>
                    <StatusDot color={mod.status === "ready" ? "#3d9970" : mod.status === "planned" ? "#55555e" : "#d4a843"} />
                    <span className="text-[11px] font-mono flex-1 truncate text-[#e8e8ec]">{mod.name}</span>
                    {mod.edge && <span className="text-[9px] px-1 py-0.5 rounded bg-[#21808d]/10 text-[#21808d]">edge</span>}
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold"
                      style={{
                        color: mod.type === "open" ? "#3d9970" : "#d4a843",
                        background: mod.type === "open" ? "rgba(61,153,112,0.1)" : "rgba(212,168,67,0.1)",
                      }}>
                      {mod.type === "open" ? "O" : "C"}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] mt-2 text-[#55555e]">15 modules: 8 open + 7 closed</p>
            </Widget>

            {/* W6: product_archetype_overview */}
            <Widget title="Archetype Distribution" question="Jak rozkladaja sie archetypy w populacji?">
              <div className="space-y-1.5">
                {ARCHETYPE_DISTRIBUTION.map((arch) => (
                  <div key={arch.name} className="flex items-center gap-2">
                    <span className="text-[10px] w-16 truncate text-[#888893]">{arch.name}</span>
                    <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: "#1a1a1e" }}>
                      <div className="h-full rounded-full" style={{ width: `${(arch.pct / archMax) * 100}%`, background: "rgba(33,128,141,0.5)", minWidth: "4px" }} />
                    </div>
                    <span className="text-[10px] font-mono w-10 text-right text-[#e8e8ec]">{arch.pct}%</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] mt-2 text-[#55555e]">12 archetypes &middot; {ARCHETYPE_DISTRIBUTION.reduce((s, a) => s + a.count, 0)} total objects</p>
            </Widget>
          </div>

          {/* Column 2: Agents */}
          <div className="space-y-6">
            {/* W7: agents_layer_status */}
            <Widget title="Agent Layers" question="Ktore warstwy agentow sa aktywne?">
              <div className="space-y-3">
                {AGENT_LAYERS.map((layer) => (
                  <div key={layer.layer} className="p-3 rounded-lg" style={{ background: "rgba(119,124,124,0.06)" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <StatusDot
                        color={layer.status === "active" ? "#3d9970" : layer.status === "planned" ? "#55555e" : "#d4a843"}
                        pulse={layer.status === "active"}
                      />
                      <span className="text-xs font-mono font-bold text-[#e8e8ec]">L{layer.layer}: {layer.name}</span>
                      <span className="ml-auto text-[10px] text-[#55555e]">{layer.tasks_day} tasks/d</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-1">
                      {layer.agents.map((a) => (
                        <span key={a} className="text-[10px] px-1.5 py-0.5 rounded bg-[#21808d]/10 text-[#21808d]">{a}</span>
                      ))}
                    </div>
                    <p className="text-[10px] text-[#55555e]">{layer.cost}</p>
                  </div>
                ))}
              </div>
            </Widget>

            {/* W8: agents_performance */}
            <Widget title="Agent Performance" question="Czy agenci sa rentowni i dostarczaja ROI?">
              <div className="space-y-1.5">
                {AGENT_PERFORMANCE.map((a) => (
                  <div key={a.agent} className="flex items-center gap-2 px-2 py-1.5 rounded" style={{ background: "rgba(119,124,124,0.06)" }}>
                    <span className="text-[10px] font-mono w-3 text-[#55555e]">L{a.layer}</span>
                    <span className="text-[11px] font-mono flex-1 truncate text-[#e8e8ec]">{a.agent}</span>
                    <span className="text-[10px] text-[#888893]">{a.tasks}</span>
                    <span className="text-[10px] font-mono text-[#21808d]">{a.cost}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 px-2 py-1.5 rounded text-[10px] font-mono" style={{ background: "rgba(33,128,141,0.08)", color: "#21808d" }}>
                Total $198-338/mo vs $22-34K human = 65-100x ROI
              </div>
            </Widget>

            {/* W9: agents_policy_alerts */}
            <Widget title="Policy Alerts" question="Czy ktory agent lamie polityki?">
              {AGENT_POLICY_ALERTS.length === 0 ? (
                <p className="text-[10px] text-[#3d9970]">No policy violations</p>
              ) : (
                <div className="space-y-2">
                  {AGENT_POLICY_ALERTS.map((alert, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <StatusDot color={alert.severity === "high" ? "#cc4444" : alert.severity === "medium" ? "#d4a843" : "#3d9970"} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-[#e8e8ec]">{alert.agent}</span>
                          <span className="text-[10px] text-[#55555e]">L{alert.layer}</span>
                          <span className="text-[10px] text-[#55555e]">{alert.time}</span>
                        </div>
                        <p className="text-[10px] text-[#888893] truncate">{alert.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Widget>
          </div>

          {/* Column 3: Events */}
          <div className="space-y-6">
            {/* W10: events_rate_overview */}
            <Widget title="Events Rate" question="Jak intensywnie system generuje eventy?">
              <div className="mb-3">
                <p className="font-mono text-2xl font-bold tabular-nums text-[#21808d]">{EVENTS_RATE.events_per_min}<span className="text-[10px] font-normal text-[#55555e]"> evt/min</span></p>
                <div className="flex items-center gap-3 text-[10px] text-[#55555e]">
                  <span>{fmt(EVENTS_RATE.total_24h)} events 24h</span>
                  <span>{EVENTS_RATE.error_pct}% errors</span>
                </div>
              </div>
              <div className="space-y-1">
                {Object.entries(EVENTS_RATE.domain).map(([event, count]) => (
                  <div key={event} className="flex items-center gap-2">
                    <span className="text-[10px] font-mono flex-1 truncate text-[#888893]">{event}</span>
                    <span className="text-[10px] font-mono font-bold text-[#e8e8ec]">{count}%</span>
                  </div>
                ))}
              </div>
            </Widget>

            {/* W11: events_timeline */}
            <Widget title="Events Timeline" question="Jakie kluczowe eventy zachodzizy w czasie?">
              <div className="space-y-2">
                {RECENT_EVENTS.map((evt, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <StatusDot color={evt.type === "success" ? "#3d9970" : evt.type === "warn" ? "#d4a843" : "#21808d"} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-[#e8e8ec]">{evt.event}</span>
                        <span className="text-[10px] text-[#55555e]">{evt.time}</span>
                      </div>
                      <p className="text-[10px] truncate text-[#888893]">{evt.detail}</p>
                      <p className="text-[9px] text-[#55555e]">{evt.module} &middot; {evt.correlationId}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Widget>

            {/* W12: events_crisis_detected */}
            <Widget title="Crisis Events" question="Czy ostatnio wystapily zdarzenia kryzysowe?">
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#888893]">24h</p>
                  <p className="font-mono text-2xl font-bold tabular-nums" style={{ color: EVENTS_CRISIS.crisis_24h === 0 ? "#3d9970" : "#cc4444" }}>{EVENTS_CRISIS.crisis_24h}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#888893]">7d</p>
                  <p className="font-mono text-2xl font-bold tabular-nums" style={{ color: EVENTS_CRISIS.crisis_7d === 0 ? "#3d9970" : "#d4a843" }}>{EVENTS_CRISIS.crisis_7d}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#888893]">Avg resp</p>
                  <p className="font-mono text-2xl font-bold tabular-nums text-[#e8e8ec]">{EVENTS_CRISIS.avg_response_ms}<span className="text-[10px] font-normal">ms</span></p>
                </div>
              </div>
              <div className="flex gap-2">
                {[
                  { label: "High", count: EVENTS_CRISIS.risk_high, color: "#cc4444" },
                  { label: "Medium", count: EVENTS_CRISIS.risk_medium, color: "#d4a843" },
                  { label: "Low", count: EVENTS_CRISIS.risk_low, color: "#3d9970" },
                ].map(({ label, count, color }) => (
                  <div key={label} className="flex-1 text-center px-2 py-1.5 rounded" style={{ background: `${color}10` }}>
                    <p className="text-[10px] text-[#888893]">{label}</p>
                    <p className="font-mono text-sm font-bold" style={{ color }}>{count}</p>
                  </div>
                ))}
              </div>
            </Widget>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
           BAND C: COMPLIANCE & SAFETY (W13-W15)
         ═══════════════════════════════════════════════════════ */}
      <section className="mb-8">
        <SectionHeader>Compliance &amp; Safety</SectionHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* W13: compliance_matrix_status */}
          <Widget title="Compliance Matrix" question="Czy P0/P1/P2 sa zgodne w runtime?">
            <div className="overflow-x-auto">
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="text-[#55555e]">
                    <th className="text-left font-mono py-1">Module</th>
                    <th className="text-center font-mono py-1"><PBadge level="P0" /></th>
                    <th className="text-center font-mono py-1"><PBadge level="P1" /></th>
                    <th className="text-center font-mono py-1"><PBadge level="P2" /></th>
                  </tr>
                </thead>
                <tbody>
                  {COMPLIANCE_MATRIX.map((row) => (
                    <tr key={row.module} className="border-t border-[#222228]/50">
                      <td className="py-1 font-mono text-[#888893]">{row.module}</td>
                      <td className="py-1 text-center"><ComplianceDot status={row.p0} /></td>
                      <td className="py-1 text-center"><ComplianceDot status={row.p1} /></td>
                      <td className="py-1 text-center"><ComplianceDot status={row.p2} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Widget>

          {/* W14: safety_crisis_feed */}
          <Widget title="Safety Crisis Feed" question="Jakie przypadki safety obsluzyl system?">
            {SAFETY_CRISIS_FEED.length === 0 ? (
              <p className="text-[10px] text-[#3d9970]">No recent incidents</p>
            ) : (
              <div className="space-y-2">
                {SAFETY_CRISIS_FEED.map((item, i) => (
                  <div key={i} className="px-3 py-2 rounded-lg" style={{ background: "rgba(119,124,124,0.06)" }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono text-[#d4a843]">Layer {item.layer}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-mono"
                        style={{
                          background: item.action === "block" ? "rgba(204,68,68,0.1)" : "rgba(212,168,67,0.1)",
                          color: item.action === "block" ? "#cc4444" : "#d4a843",
                        }}>
                        {item.action}
                      </span>
                      <span className="text-[10px] text-[#55555e]">{item.locale}</span>
                      <span className="text-[10px] text-[#55555e] ml-auto">{item.time}</span>
                    </div>
                    <p className="text-[10px] text-[#888893]">{item.detail}</p>
                  </div>
                ))}
              </div>
            )}
          </Widget>

          {/* W15: language_guard_status */}
          <Widget title="Language Guard" question="Czy @silence/language blokuje forbidden vocabulary?">
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#888893]">Blocked/1k</p>
                <p className="font-mono text-2xl font-bold tabular-nums text-[#e8e8ec]">{LANGUAGE_GUARD.blocked_per_1k}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#888893]">False pos.</p>
                <p className="font-mono text-2xl font-bold tabular-nums text-[#3d9970]">{LANGUAGE_GUARD.false_positives}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#888893]">Edge</p>
                <StatusBadge status={LANGUAGE_GUARD.edge_runtime} />
              </div>
            </div>
            <p className="text-[10px] text-[#55555e]">Scanning: {LANGUAGE_GUARD.modules_scanned.join(", ")}</p>
          </Widget>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
           BAND D: ARCHITECTURE & MODULES (W16-W18)
         ═══════════════════════════════════════════════════════ */}
      <section className="mb-8">
        <SectionHeader>Architecture &amp; Modules</SectionHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* W16: architecture_layer_overview */}
          <Widget title="Architecture Layers" question="Czy kluczowe warstwy architektury sa zdrowe?">
            <div className="space-y-2">
              {ARCHITECTURE_LAYERS.map((layer, i) => (
                <div key={layer.name} className="flex items-center gap-2">
                  <span className="text-[10px] font-mono w-4 text-[#55555e]">{i + 1}</span>
                  <StatusDot color={layer.status === "operational" ? "#3d9970" : "#cc4444"} />
                  <span className="text-[11px] font-mono flex-1 text-[#e8e8ec]">{layer.name}</span>
                  <span className="text-[10px] font-mono text-[#888893]">{layer.latency_ms}ms</span>
                </div>
              ))}
            </div>
            <div className="mt-3 px-2 py-1.5 rounded text-[10px] font-mono text-[#55555e]" style={{ background: "rgba(119,124,124,0.06)" }}>
              Edge → Thin Handler → Domain Module → Event Bus → Supabase
            </div>
          </Widget>

          {/* W17: architecture_module_detail */}
          <Widget title="Module Detail" question="Jakie sa szczegoly modulow?">
            <div className="overflow-x-auto">
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="text-[#55555e]">
                    <th className="text-left font-mono py-1">Module</th>
                    <th className="text-left font-mono py-1">Level</th>
                    <th className="text-left font-mono py-1">Ver</th>
                    <th className="text-left font-mono py-1">Events</th>
                  </tr>
                </thead>
                <tbody>
                  {MODULE_DETAIL.map((mod) => (
                    <tr key={mod.name} className="border-t border-[#222228]/50">
                      <td className="py-1 font-mono text-[#e8e8ec]">{mod.name}</td>
                      <td className="py-1 text-[#888893]">{mod.level}</td>
                      <td className="py-1 font-mono text-[#55555e]">{mod.version}</td>
                      <td className="py-1 text-[#888893]">{mod.events.length > 0 ? mod.events.join(", ") : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Widget>

          {/* W18: data_layer_kpi */}
          <Widget title="Data Layer" question="Czy warstwa danych dziala poprawnie?">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#888893]">Tenants</p>
                <p className="font-mono text-2xl font-bold tabular-nums text-[#e8e8ec]">{DATA_LAYER.tenant_count}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#888893]">Events/day</p>
                <p className="font-mono text-2xl font-bold tabular-nums text-[#21808d]">{fmt(DATA_LAYER.events_per_day)}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#888893]">KPI lag</p>
                <p className="font-mono text-sm font-bold text-[#3d9970]">{DATA_LAYER.kpi_freshness_lag}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#888893]">RLS violations</p>
                <p className="font-mono text-2xl font-bold tabular-nums text-[#3d9970]">{DATA_LAYER.rls_violations}</p>
              </div>
            </div>
            <p className="text-[10px] text-[#55555e]">{DATA_LAYER.tables.length} tables: {DATA_LAYER.tables.slice(0, 5).join(", ")}...</p>
          </Widget>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
           BAND E: INVESTOR & BUSINESS (W19-W21)
         ═══════════════════════════════════════════════════════ */}
      <section className="mb-8">
        <SectionHeader>Investor &amp; Business</SectionHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* W19: business_kpi_timeline */}
          <Widget title="Revenue Projection" question="Jak rosna KPI w czasie vs targety?">
            <div className="flex items-end gap-3 h-32">
              {REVENUE_PROJECTION.map((proj) => {
                const pct = (proj.arr / revMax) * 100;
                return (
                  <div key={proj.period} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <span className="text-[10px] font-mono font-bold text-[#21808d]">{fmtPLN(proj.arr)}</span>
                    <div className="w-full rounded-t" style={{ height: `${pct}%`, background: "rgba(33,128,141,0.5)", minHeight: "4px" }} />
                    <span className="text-[10px] text-[#55555e]">{proj.period}</span>
                    <span className="text-[9px] text-[#55555e]">{fmt(proj.users_paid)} paid</span>
                  </div>
                );
              })}
            </div>
          </Widget>

          {/* W20: business_unit_economics */}
          <Widget title="Unit Economics" question="Czy unit economics sie spinaja?">
            <div className="overflow-x-auto">
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="text-[#55555e]">
                    <th className="text-left font-mono py-1">Tier</th>
                    <th className="text-right font-mono py-1">Price</th>
                    <th className="text-right font-mono py-1">Cost</th>
                    <th className="text-right font-mono py-1">Margin</th>
                    <th className="text-right font-mono py-1">LTV</th>
                  </tr>
                </thead>
                <tbody>
                  {UNIT_ECONOMICS.map((tier) => (
                    <tr key={tier.tier} className="border-t border-[#222228]/50">
                      <td className="py-1.5 font-mono font-bold text-[#e8e8ec]">{tier.tier}</td>
                      <td className="py-1.5 font-mono text-right text-[#888893]">${tier.price}</td>
                      <td className="py-1.5 font-mono text-right text-[#888893]">${(tier.hosting + tier.ai_compute + tier.storage).toFixed(2)}</td>
                      <td className="py-1.5 font-mono text-right" style={{ color: tier.margin_pct > 50 ? "#3d9970" : "#55555e" }}>{tier.margin_pct}%</td>
                      <td className="py-1.5 font-mono text-right text-[#21808d]">${tier.ltv}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Widget>

          {/* W21: business_revenue_targets */}
          <Widget title="Revenue Targets" question="Czy jestesmy na sciezce do targetow?">
            <div className="overflow-x-auto">
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="text-[#55555e]">
                    <th className="text-left font-mono py-1"></th>
                    <th className="text-right font-mono py-1">Free</th>
                    <th className="text-right font-mono py-1">Paid</th>
                    <th className="text-right font-mono py-1">B2B</th>
                    <th className="text-right font-mono py-1">ARR</th>
                  </tr>
                </thead>
                <tbody>
                  {REVENUE_TARGETS.map((t) => (
                    <tr key={t.period} className="border-t border-[#222228]/50">
                      <td className="py-1.5 font-mono font-bold text-[#e8e8ec]">{t.period}</td>
                      <td className="py-1.5 font-mono text-right">
                        <span className="text-[#888893]">{fmt(t.target_free)}</span>
                        {t.actual_free !== null && <span className="text-[#21808d] ml-1">({fmt(t.actual_free)})</span>}
                      </td>
                      <td className="py-1.5 font-mono text-right">
                        <span className="text-[#888893]">{fmt(t.target_paid)}</span>
                        {t.actual_paid !== null && <span className="text-[#21808d] ml-1">({t.actual_paid})</span>}
                      </td>
                      <td className="py-1.5 font-mono text-right">
                        <span className="text-[#888893]">{t.target_b2b}</span>
                        {t.actual_b2b !== null && <span className="text-[#21808d] ml-1">({t.actual_b2b})</span>}
                      </td>
                      <td className="py-1.5 font-mono text-right">
                        <span className="text-[#888893]">{fmtPLN(t.target_arr)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[10px] mt-2 text-[#55555e]">Target vs (actual) &middot; null = future period</p>
          </Widget>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
           BAND F: OPS & DEPLOYMENT (W22-W24)
         ═══════════════════════════════════════════════════════ */}
      <section className="mb-8">
        <SectionHeader>Ops &amp; Deployment</SectionHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* W22: ops_deployment_status */}
          <Widget title="Deployment Status" question="Czy Vercel, Supabase, n8n, Stripe i GitHub Actions sa OK?">
            <div className="space-y-1.5">
              {OPS_SERVICES.map((svc) => (
                <div key={svc.name} className="flex items-center gap-2 px-2 py-1 rounded" style={{ background: "rgba(119,124,124,0.06)" }}>
                  <StatusDot color={svc.status === "operational" ? "#3d9970" : svc.status === "degraded" ? "#d4a843" : "#cc4444"} pulse={svc.status === "operational"} />
                  <span className="text-[11px] font-mono flex-1 truncate text-[#e8e8ec]">{svc.name}</span>
                  <span className="text-[10px] text-[#55555e]">{svc.last_deploy}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 rounded-lg p-2" style={{ background: "rgba(61,153,112,0.08)", border: "1px solid rgba(61,153,112,0.2)" }}>
              <div className="flex items-center gap-2">
                <StatusDot color="#3d9970" />
                <span className="text-[10px] font-mono text-[#e8e8ec]">{CI_CD_STATUS.last_deploy.env}</span>
                <span className="text-[10px] text-[#55555e]">{CI_CD_STATUS.last_deploy.at}</span>
              </div>
            </div>
          </Widget>

          {/* W23: ops_agent_orchestrator_rules */}
          <Widget title="Orchestrator Rules" question="Ktore reguly Orchestratora sa aktywne?">
            <div className="space-y-2">
              {ORCHESTRATOR_RULES.map((rule, i) => (
                <div key={i} className="px-3 py-2 rounded-lg" style={{ background: "rgba(119,124,124,0.06)" }}>
                  <p className="text-[10px] font-mono text-[#e8e8ec] mb-1">{rule.rule}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-mono"
                      style={{
                        background: rule.type === "safety" ? "rgba(204,68,68,0.1)" : rule.type === "revenue" ? "rgba(212,168,67,0.1)" : "rgba(61,153,112,0.1)",
                        color: rule.type === "safety" ? "#cc4444" : rule.type === "revenue" ? "#d4a843" : "#3d9970",
                      }}>
                      {rule.type}
                    </span>
                    <span className="text-[10px] text-[#55555e]">Last: {rule.last_triggered}</span>
                    <span className="text-[10px] text-[#55555e] ml-auto">{rule.triggers_7d}x / 7d</span>
                  </div>
                </div>
              ))}
            </div>
          </Widget>

          {/* W24: ops_build_order_progress */}
          <Widget title="Build Order Progress" question="Na jakim etapie build-order jestesmy?">
            <div className="space-y-4">
              {BUILD_ORDER.map((phase) => (
                <div key={phase.phase}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-mono text-[#e8e8ec]">{phase.phase}</span>
                    <span className="text-[10px] font-mono font-bold text-[#e8e8ec]">{phase.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full mb-2" style={{ background: "#1a1a1e" }}>
                    <div className="h-1.5 rounded-full" style={{ width: `${phase.progress}%`, background: phase.progress > 50 ? "#21808d" : phase.progress > 0 ? "#d4a843" : "rgba(119,124,124,0.4)", minWidth: phase.progress > 0 ? "4px" : "0" }} />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {phase.items.map((item) => (
                      <span key={item.name} className="text-[9px] px-1.5 py-0.5 rounded inline-flex items-center gap-1" style={{ background: "rgba(119,124,124,0.06)" }}>
                        <BuildIcon status={item.status} />
                        <span className="text-[#888893]">{item.name}</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Widget>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="mt-12 pt-6 text-center" style={{ borderTop: "1px solid #222228" }}>
        <p className="text-[10px] font-mono text-[#55555e]">
          SILENCE.OBJECTS v5.1 &middot; 24 Widgets &middot; 15 Modules &middot; Agent Army v3.0 &middot; Open Core Framework
        </p>
      </footer>
    </main>
  );
}
