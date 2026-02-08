import Link from "next/link";
import {
  HERO_KPI, SYSTEM_STATUS, SAFETY_COMPLIANCE,
  MODULE_STATUS, AGENT_LAYERS, EVENTS_RATE, RECENT_EVENTS,
  SAFETY_LAYERS, CRISIS_DATA,
  REVENUE_PROJECTION, PAYWALL_FUNNEL,
  PHASE_PROGRESS, CI_CD_STATUS,
} from "./data/mock";

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return String(n);
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-lg p-4 md:p-5 transition-all duration-300 hover:shadow-lg ${className}`}
      style={{
        background: "#111113",
        border: "1px solid #222228",
      }}
    >
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] uppercase tracking-[0.15em] mb-3"
      style={{ color: "#21808d", fontFamily: "'JetBrains Mono', monospace" }}>
      {children}
    </p>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-sm font-semibold uppercase tracking-wide mb-4"
      style={{ color: "#888893", borderLeft: "2px solid #21808d", paddingLeft: 12, fontFamily: "'JetBrains Mono', monospace" }}
    >
      {children}
    </h2>
  );
}

function Placeholder({ name, question, source }: { name: string; question: string; source: string }) {
  return (
    <Card>
      <Label>{name}</Label>
      <p className="text-xs mb-3" style={{ color: "#888893", fontFamily: "'Outfit', sans-serif" }}>{question}</p>
      <span className="text-[10px] px-2 py-1 rounded" style={{ background: "rgba(212,168,67,0.1)", color: "#d4a843", border: "1px solid rgba(212,168,67,0.2)" }}>
        Coming soon
      </span>
      <p className="text-[10px] mt-2" style={{ color: "#55555e" }}>Source: {source}</p>
    </Card>
  );
}

function StatusDot({ color }: { color: string }) {
  return <span className="w-2 h-2 rounded-full inline-block flex-shrink-0" style={{ background: color }} />;
}

function PriorityBadge({ level, label }: { level: "P0" | "P1" | "P2"; label: string }) {
  const colors = { P0: "#cc4444", P1: "#d4a843", P2: "#d4a843" };
  const bg = { P0: "rgba(204,68,68,0.1)", P1: "rgba(212,168,67,0.1)", P2: "rgba(212,168,67,0.08)" };
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: bg[level], border: `1px solid ${colors[level]}33` }}>
      <StatusDot color={colors[level]} />
      <span className="text-xs font-mono" style={{ color: "#e8e8ec" }}>{level}</span>
      <span className="text-xs" style={{ color: "#888893" }}>{label}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const revMax = Math.max(...REVENUE_PROJECTION.map((r) => r.arr));

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto" style={{ background: "#08080a", color: "#e8e8ec" }}>
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
          <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "'JetBrains Mono', monospace" }}>SILENCE.OBJECTS</h1>
          <span className="text-xs px-2 py-0.5 rounded font-mono" style={{ background: "rgba(33,128,141,0.15)", color: "#21808d" }}>v5.0</span>
        </div>
        <p className="text-sm" style={{ color: "#888893", fontFamily: "'Outfit', sans-serif" }}>Command Center — 24 Widget Dashboard</p>
      </header>

      {/* ══════════ GLOBAL FILTERS ══════════ */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="flex gap-1 rounded-lg p-1" style={{ background: "#111113", border: "1px solid #222228" }}>
          {["24h", "7d", "30d", "All"].map((t, i) => (
            <button key={t} className="px-3 py-1 rounded text-xs font-mono" style={i === 1 ? { background: "#21808d", color: "#08080a" } : { color: "#888893" }}>{t}</button>
          ))}
        </div>
        <div className="flex gap-1 rounded-lg p-1" style={{ background: "#111113", border: "1px solid #222228" }}>
          {["prod", "stage", "local"].map((e, i) => (
            <button key={e} className="px-3 py-1 rounded text-xs font-mono" style={i === 0 ? { background: "#21808d", color: "#08080a" } : { color: "#888893" }}>{e}</button>
          ))}
        </div>
        <Link href="/investor/dashboard" className="px-4 py-1.5 rounded-lg text-xs font-mono" style={{ background: "#111113", border: "1px solid #222228", color: "#888893" }}>
          Investor View
        </Link>
      </div>

      {/* ══════════ PRE-LAUNCH BANNER ══════════ */}
      <div className="mb-6 px-4 py-2 rounded-lg text-center" style={{ background: "rgba(212,168,67,0.08)", border: "1px solid rgba(212,168,67,0.25)", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#d4a843" }}>
        Pre-launch command center &middot; All metrics = mock targets &middot; Replace with Supabase queries
      </div>

      {/* ═══════════════════════════════════════════════════════
           BAND A: HERO KPIs (W1 + W2 + W3)
         ═══════════════════════════════════════════════════════ */}
      <section className="mb-8">
        <SectionHeader>Hero KPIs</SectionHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* W1: hero_kpi_overview */}
          <Card>
            <Label>W1 &middot; KPI Overview</Label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "ARR", value: `${fmt(HERO_KPI.arr)} PLN`, color: "#21808d" },
                { label: "MRR", value: `${fmt(HERO_KPI.mrr)}`, color: "#e8e8ec" },
                { label: "DAU", value: String(HERO_KPI.dau), color: "#e8e8ec" },
                { label: "Churn", value: `${HERO_KPI.churn}%`, color: HERO_KPI.churn < 5 ? "#3d9970" : "#cc4444" },
                { label: "LTV/CAC", value: `${HERO_KPI.ltv_cac}x`, color: "#3d9970" },
                { label: "Runway", value: `${HERO_KPI.runway_months}mo`, color: "#e8e8ec" },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <p className="text-[10px] uppercase tracking-widest" style={{ color: "#55555e" }}>{label}</p>
                  <p className="font-mono text-lg font-bold" style={{ color }}>{value}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* W2: hero_system_status */}
          <Card>
            <Label>W2 &middot; System Status</Label>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: "#3d9970" }} />
              <span className="text-xs font-mono font-bold" style={{ color: "#3d9970" }}>{SYSTEM_STATUS.api_status}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-[10px] uppercase" style={{ color: "#55555e" }}>Response</p>
                <p className="font-mono text-lg font-bold" style={{ color: "#e8e8ec" }}>{SYSTEM_STATUS.avg_response_ms}<span className="text-[10px] font-normal">ms</span></p>
              </div>
              <div>
                <p className="text-[10px] uppercase" style={{ color: "#55555e" }}>Success</p>
                <p className="font-mono text-lg font-bold" style={{ color: "#e8e8ec" }}>{SYSTEM_STATUS.success_rate}%</p>
              </div>
              <div>
                <p className="text-[10px] uppercase" style={{ color: "#55555e" }}>Modules</p>
                <p className="font-mono text-lg font-bold" style={{ color: "#21808d" }}>{SYSTEM_STATUS.active_modules}/{SYSTEM_STATUS.total_modules}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase" style={{ color: "#55555e" }}>CI</p>
                <span className="text-xs px-2 py-0.5 rounded font-mono" style={{ background: "rgba(61,153,112,0.15)", color: "#3d9970" }}>{SYSTEM_STATUS.ci_status}</span>
              </div>
            </div>
          </Card>

          {/* W3: hero_safety_compliance */}
          <Card>
            <Label>W3 &middot; Safety Compliance</Label>
            <div className="space-y-2 mb-3">
              <PriorityBadge level="P0" label={SAFETY_COMPLIANCE.p0_crisis.label} />
              <PriorityBadge level="P1" label={SAFETY_COMPLIANCE.p1_vocabulary.label} />
              <PriorityBadge level="P2" label={SAFETY_COMPLIANCE.p2_framing.label} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px]" style={{ color: "#55555e" }}>Score</span>
              <span className="font-mono text-xl font-bold" style={{ color: "#3d9970" }}>{SAFETY_COMPLIANCE.compliance_score}%</span>
            </div>
          </Card>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
           BAND B: PRODUCT | AGENTS | EVENTS (W4-W12)
         ═══════════════════════════════════════════════════════ */}
      <section className="mb-8">
        <SectionHeader>Product &middot; Agents &middot; Events</SectionHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Column 1: Product */}
          <div className="space-y-4">
            <Placeholder name="W4 · Analysis Volume" question="How many analyses per day? Growth trend?" source="Supabase objects table" />

            {/* W5: product_module_activation (REAL) */}
            <Card>
              <Label>W5 &middot; Module Activation</Label>
              <div className="space-y-1.5">
                {MODULE_STATUS.map((mod) => (
                  <div key={mod.name} className="flex items-center gap-2 px-2 py-1 rounded" style={{ background: "rgba(119,124,124,0.06)" }}>
                    <StatusDot color={mod.status === "ready" ? "#3d9970" : "rgba(119,124,124,0.4)"} />
                    <span className="text-[11px] font-mono flex-1 truncate" style={{ color: "#e8e8ec" }}>{mod.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold"
                      style={{
                        color: mod.type === "open" ? "#3d9970" : "#d4a843",
                        background: mod.type === "open" ? "rgba(61,153,112,0.1)" : "rgba(212,168,67,0.1)",
                      }}>
                      {mod.type === "open" ? "O" : "C"}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] mt-2" style={{ color: "#55555e" }}>15 modules: 8 open + 7 closed</p>
            </Card>

            <Placeholder name="W6 · Archetype Distribution" question="Which archetypes are most common?" source="Supabase patterns table" />
          </div>

          {/* Column 2: Agents */}
          <div className="space-y-4">
            {/* W7: agents_layer_status (REAL) */}
            <Card>
              <Label>W7 &middot; Agent Layers</Label>
              <div className="space-y-3">
                {AGENT_LAYERS.map((layer) => (
                  <div key={layer.layer} className="p-3 rounded-lg" style={{ background: "rgba(119,124,124,0.06)" }}>
                    <div className="flex items-center gap-2 mb-2">
                      {layer.status === "active" ? (
                        <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#3d9970" }} />
                      ) : (
                        <StatusDot color="rgba(119,124,124,0.4)" />
                      )}
                      <span className="text-xs font-mono font-bold" style={{ color: "#e8e8ec" }}>L{layer.layer}: {layer.name}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-1">
                      {layer.agents.map((a) => (
                        <span key={a} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "rgba(33,128,141,0.1)", color: "#21808d" }}>{a}</span>
                      ))}
                    </div>
                    <p className="text-[10px]" style={{ color: "#55555e" }}>{layer.cost}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Placeholder name="W8 · Agent Task Queue" question="How many tasks pending/running/completed?" source="Supabase agent_logs" />
            <Placeholder name="W9 · Cost Efficiency" question="Agent cost vs human equivalent?" source="AGENTS.md cost model" />
          </div>

          {/* Column 3: Events */}
          <div className="space-y-4">
            {/* W10: events_rate_overview (REAL) */}
            <Card>
              <Label>W10 &middot; Events Rate</Label>
              <div className="mb-3">
                <p className="font-mono text-2xl font-bold" style={{ color: "#21808d" }}>{EVENTS_RATE.events_per_min}<span className="text-[10px] font-normal" style={{ color: "#55555e" }}> evt/min</span></p>
                <p className="text-[10px]" style={{ color: "#55555e" }}>{fmt(EVENTS_RATE.total_24h)} events in 24h</p>
              </div>
              <div className="space-y-1.5">
                {Object.entries(EVENTS_RATE.domain).map(([event, count]) => (
                  <div key={event} className="flex items-center gap-2">
                    <span className="text-[10px] font-mono flex-1 truncate" style={{ color: "#888893" }}>{event}</span>
                    <span className="text-[10px] font-mono font-bold" style={{ color: "#e8e8ec" }}>{count}%</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* W11: events_recent_feed */}
            <Card>
              <Label>W11 &middot; Recent Events</Label>
              <div className="space-y-2.5">
                {RECENT_EVENTS.map((evt, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <StatusDot color={evt.type === "success" ? "#3d9970" : evt.type === "warn" ? "#d4a843" : "#21808d"} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono" style={{ color: "#e8e8ec" }}>{evt.event}</span>
                        <span className="text-[10px]" style={{ color: "#55555e" }}>{evt.time}</span>
                      </div>
                      <p className="text-[10px] truncate" style={{ color: "#888893" }}>{evt.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Placeholder name="W12 · Schema Health" question="Are event schemas valid across all modules?" source="@silence/events validator" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
           BAND C: COMPLIANCE & SAFETY (W13-W15)
         ═══════════════════════════════════════════════════════ */}
      <section className="mb-8">
        <SectionHeader>Compliance &amp; Safety</SectionHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Placeholder name="W13 · Forbidden Vocab Scan" question="Any vocabulary violations detected?" source="@silence/language scan" />

          {/* W14: compliance_p0_p1_p2_matrix */}
          <Card>
            <Label>W14 &middot; Priority Matrix</Label>
            <div className="space-y-2">
              {SAFETY_LAYERS.map((layer) => (
                <div key={layer.name} className="flex items-center gap-2">
                  <StatusDot color={layer.status === "ok" ? "#3d9970" : "#cc4444"} />
                  <span className="text-[11px] font-mono flex-1" style={{ color: "#e8e8ec" }}>{layer.name}</span>
                  <span className="text-[10px]" style={{ color: "#55555e" }}>{layer.last_test}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* W15: safety_crisis_incidents */}
          <Card>
            <Label>W15 &middot; Crisis Incidents</Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] uppercase" style={{ color: "#55555e" }}>24h</p>
                <p className="font-mono text-2xl font-bold" style={{ color: CRISIS_DATA.incidents_24h === 0 ? "#3d9970" : "#cc4444" }}>{CRISIS_DATA.incidents_24h}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase" style={{ color: "#55555e" }}>7d</p>
                <p className="font-mono text-2xl font-bold" style={{ color: CRISIS_DATA.incidents_7d === 0 ? "#3d9970" : "#d4a843" }}>{CRISIS_DATA.incidents_7d}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase" style={{ color: "#55555e" }}>Violations</p>
                <p className="font-mono text-2xl font-bold" style={{ color: "#3d9970" }}>{CRISIS_DATA.forbidden_violations_24h}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase" style={{ color: "#55555e" }}>Compliance</p>
                <p className="font-mono text-2xl font-bold" style={{ color: "#3d9970" }}>{CRISIS_DATA.copy_compliance_score}%</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
           BAND D: ARCHITECTURE & MODULES (W16-W18)
         ═══════════════════════════════════════════════════════ */}
      <section className="mb-8">
        <SectionHeader>Architecture &amp; Modules</SectionHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Placeholder name="W16 · Module Dependency Graph" question="How do modules depend on each other?" source="packages/*/package.json" />
          <Placeholder name="W17 · Request Flow Pipeline" question="What is the runtime request path?" source="ARCHITECTURE.md" />
          <Placeholder name="W18 · Data Layer Overview" question="Which Supabase tables are active?" source="Supabase schema" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
           BAND E: INVESTOR & BUSINESS (W19-W21)
         ═══════════════════════════════════════════════════════ */}
      <section className="mb-8">
        <SectionHeader>Investor &amp; Business</SectionHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* W19: investor_revenue_projection */}
          <Card>
            <Label>W19 &middot; Revenue Projection (ARR)</Label>
            <div className="flex items-end gap-3 h-32">
              {REVENUE_PROJECTION.map((proj) => {
                const pct = (proj.arr / revMax) * 100;
                return (
                  <div key={proj.period} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <span className="text-[10px] font-mono font-bold" style={{ color: "#21808d" }}>{fmt(proj.arr)}</span>
                    <div className="w-full rounded-t" style={{ height: `${pct}%`, background: "rgba(33,128,141,0.5)", minHeight: "4px" }} />
                    <span className="text-[10px]" style={{ color: "#55555e" }}>{proj.period}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* W20: investor_paywall_funnel */}
          <Card>
            <Label>W20 &middot; Paywall Funnel</Label>
            <div className="space-y-2">
              {PAYWALL_FUNNEL.map((step) => (
                <div key={step.step} className="flex items-center gap-2">
                  <span className="text-[10px] w-28 truncate flex-shrink-0" style={{ color: "#888893" }}>{step.step}</span>
                  <div className="flex-1 h-4 rounded overflow-hidden" style={{ background: "rgba(119,124,124,0.1)" }}>
                    <div className="h-full rounded" style={{ width: `${step.pct}%`, background: "rgba(33,128,141,0.5)", minWidth: step.pct > 0 ? "1rem" : "0" }} />
                  </div>
                  <span className="text-[10px] font-mono w-10 text-right" style={{ color: "#55555e" }}>{step.pct}%</span>
                </div>
              ))}
            </div>
          </Card>

          <Placeholder name="W21 · Market Positioning" question="TAM/SAM/SOM breakdown?" source="INVESTOR.md" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
           BAND F: OPS & DEPLOYMENT (W22-W24)
         ═══════════════════════════════════════════════════════ */}
      <section className="mb-8">
        <SectionHeader>Ops &amp; Deployment</SectionHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* W22: ops_phase_progress */}
          <Card>
            <Label>W22 &middot; Phase Progress</Label>
            <div className="space-y-3">
              {PHASE_PROGRESS.map((phase) => (
                <div key={phase.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-mono" style={{ color: "#e8e8ec" }}>{phase.name}</span>
                    <span className="text-[10px] font-mono font-bold" style={{ color: "#e8e8ec" }}>{phase.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full" style={{ background: "#1a1a1e" }}>
                    <div className="h-1.5 rounded-full" style={{ width: `${phase.progress}%`, background: phase.status === "active" ? "#21808d" : "rgba(119,124,124,0.4)", minWidth: phase.progress > 0 ? "4px" : "0" }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* W23: ops_cicd_status */}
          <Card>
            <Label>W23 &middot; CI/CD Status</Label>
            <div className="space-y-2 mb-3">
              {([
                ["Sentinel Vocabulary", CI_CD_STATUS.sentinel_vocabulary],
                ["Sentinel Build", CI_CD_STATUS.sentinel_build],
                ["Sentinel Contracts", CI_CD_STATUS.sentinel_contracts],
              ] as const).map(([label, check]) => (
                <div key={label} className="flex items-center gap-2">
                  <StatusDot color={check.status === "pass" ? "#3d9970" : "#cc4444"} />
                  <span className="text-[11px] font-mono flex-1" style={{ color: "#e8e8ec" }}>{label}</span>
                  <span className="text-[10px]" style={{ color: "#55555e" }}>{check.last_run}</span>
                </div>
              ))}
            </div>
            <div className="rounded-lg p-2" style={{ background: "rgba(61,153,112,0.08)", border: "1px solid rgba(61,153,112,0.2)" }}>
              <div className="flex items-center gap-2">
                <StatusDot color={CI_CD_STATUS.last_deploy.status === "success" ? "#3d9970" : "#cc4444"} />
                <span className="text-[10px] font-mono" style={{ color: "#e8e8ec" }}>{CI_CD_STATUS.last_deploy.env}</span>
                <span className="text-[10px]" style={{ color: "#55555e" }}>{CI_CD_STATUS.last_deploy.at}</span>
              </div>
            </div>
          </Card>

          <Placeholder name="W24 · Deployment History" question="Recent deploys timeline and rollback options?" source="Vercel API" />
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="mt-12 pt-6 text-center" style={{ borderTop: "1px solid #222228" }}>
        <p className="text-[10px] font-mono" style={{ color: "#55555e" }}>
          SILENCE.OBJECTS v5.0 &middot; 24 Widgets &middot; 15 Modules &middot; Agent Army v3.0 &middot; Open Core Framework
        </p>
      </footer>
    </main>
  );
}
