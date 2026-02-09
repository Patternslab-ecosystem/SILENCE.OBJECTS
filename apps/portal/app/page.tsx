"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DataBadge, type DataSource } from "./components/DataBadge";
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
// Types
// ─────────────────────────────────────────────────────────────

interface LiveData {
  totalUsers: number;
  totalObjects: number;
  totalPatterns: number;
  voiceObjects: number;
  voiceDumps: number;
  crisisEvents: number;
  avgConfidence: number;
  completedRate: number;
  freeUsers: number;
  proUsers: number;
  enterpriseUsers: number;
  riskDistribution: Record<string, number>;
  inputSourceSplit: Record<string, number>;
  objectsByDay: { day: string; count: number }[];
  patternsByDay: { day: string; count: number }[];
  archetypeDistribution: { name: string; count: number }[];
  recentObjects: { id: string; input_text: string; input_source: string; risk_level: string; processing_status: string; created_at: string }[];
}

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
// Widget Card
// ─────────────────────────────────────────────────────────────

function Widget({ title, question, badge, children, footer, compact, muted }: {
  title: string; question: string; badge?: DataSource; children: React.ReactNode;
  footer?: React.ReactNode; compact?: boolean; muted?: boolean;
}) {
  return (
    <div className={`${muted ? "bg-[#0c0c0e]" : "bg-[#111113]"} border border-[#222228] rounded-xl ${compact ? "p-3" : "p-5"} hover:shadow-lg hover:shadow-[#21808d]/5 transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <h3 className={`font-medium text-[#e8e8ec] font-['Outfit',sans-serif] ${compact ? "text-sm" : "text-base"}`}>{title}</h3>
        {badge && <DataBadge type={badge} />}
      </div>
      <p className="font-mono text-[10px] text-[#888893] mt-0.5">{question}</p>
      <div className={compact ? "mt-3" : "mt-4"}>{children}</div>
      {footer && <div className="mt-3 pt-3 border-t border-[#222228] flex gap-2 flex-wrap">{footer}</div>}
    </div>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-medium uppercase tracking-[0.15em] mb-4 text-[#888893] border-l-2 border-[#21808d] pl-3 font-mono">
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
    PASS: { bg: "rgba(61,153,112,0.1)", text: "#3d9970" },
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
  if (status === "done") return <span className="text-[10px] text-[#3d9970]">&#x2713;</span>;
  if (status === "wip") return <span className="text-[10px] text-[#d4a843]">&#x25CF;</span>;
  return <span className="text-[10px] text-[#55555e]">&#x25CB;</span>;
}

function DrillLink({ children, target }: { children: React.ReactNode; target: string }) {
  return (
    <button className="text-[10px] font-mono text-[#21808d] hover:text-[#e8e8ec] transition-colors"
      onClick={() => document.getElementById(target)?.scrollIntoView({ behavior: "smooth" })}>
      {children} &rarr;
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const revMax = Math.max(...REVENUE_PROJECTION.map((r) => r.arr));
  const archMax = Math.max(...ARCHETYPE_DISTRIBUTION.map((a) => a.pct));
  const [showSecondaryKpi, setShowSecondaryKpi] = useState(false);
  const [live, setLive] = useState<LiveData | null>(null);
  const [dataSource, setDataSource] = useState<"mock" | "live" | "error">("mock");

  useEffect(() => {
    fetch("/api/kpi")
      .then((r) => r.json())
      .then((d) => {
        if (d.live) setLive(d.live);
        setDataSource(d.source ?? "mock");
      })
      .catch(() => setDataSource("error"));
  }, []);

  const isLive = dataSource === "live" && live !== null;

  return (
    <main className="min-h-screen p-4 md:p-6 max-w-[1440px] mx-auto bg-[#08080a] text-[#e8e8ec]">
      {/* ══════════ GLOBAL NAV ══════════ */}
      <nav className="mb-6 pb-3 border-b border-[#222228]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[#21808d] text-lg">&#9673;</span>
            <h1 className="text-base font-semibold tracking-tight font-mono">SILENCE.OBJECTS</h1>
            <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-[#21808d]/15 text-[#21808d]">v5.1</span>
            {isLive && <DataBadge type="live" />}
          </div>
          <div className="flex items-center gap-4">
            <a href="https://patternlens.app" className="text-[12px] font-mono text-[#888893] hover:text-[#e8e8ec] transition-colors">PatternLens</a>
            <span className="text-[12px] font-mono text-[#21808d] border-b-2 border-[#21808d] pb-0.5">Portal</span>
            <a href="https://silence-patternslab.vercel.app" className="text-[12px] font-mono text-[#888893] hover:text-[#e8e8ec] transition-colors">PatternsLab</a>
            <Link href="/investor/dashboard" className="text-[12px] font-mono text-[#888893] hover:text-[#e8e8ec] transition-colors">Investor</Link>
            <a href="https://patternlens.app/login" className="text-[11px] font-mono px-3 py-1 rounded-lg border border-[#222228] text-[#888893] hover:border-[#333340] hover:text-[#e8e8ec] transition-colors">Log in</a>
          </div>
        </div>
        <p className="text-[11px] mt-1 text-[#55555e] font-['Outfit',sans-serif]">Control Tower &mdash; 24-Widget Command Center</p>
      </nav>

      {/* ══════════ GLOBAL FILTERS ══════════ */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="flex gap-1 rounded-lg p-1 bg-[#111113] border border-[#222228]">
          {["24h", "7d", "30d", "All"].map((t, i) => (
            <button key={t} className={`px-3 py-1 rounded text-xs font-mono ${i === 1 ? "bg-[#21808d] text-[#08080a]" : "text-[#888893]"}`}>{t}</button>
          ))}
        </div>
        <div className="flex gap-1 rounded-lg p-1 bg-[#111113] border border-[#222228]">
          {["prod", "stage", "local"].map((e, i) => (
            <button key={e} className={`px-3 py-1 rounded text-xs font-mono ${i === 0 ? "bg-[#21808d] text-[#08080a]" : "text-[#888893]"}`}>{e}</button>
          ))}
        </div>
        <Link href="/investor/dashboard" className="px-4 py-1.5 rounded-lg text-xs font-mono bg-[#111113] border border-[#222228] text-[#888893]">
          Investor View
        </Link>
      </div>

      {/* ══════════ DATA SOURCE BANNER ══════════ */}
      {!isLive && (
        <div className="mb-8 px-4 py-2 rounded-lg text-center font-mono text-[12px] bg-amber-500/[0.08] border border-amber-500/25 text-[#d4a843]">
          Pre-launch command center &middot; All metrics = mock targets &middot; Supabase not connected
        </div>
      )}
      {isLive && (
        <div className="mb-8 px-4 py-2 rounded-lg text-center font-mono text-[12px] bg-emerald-500/[0.08] border border-emerald-500/25 text-emerald-400">
          Connected to Supabase &middot; {live.totalUsers} users &middot; {live.totalObjects} objects &middot; {live.totalPatterns} patterns
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
           BAND A: HERO KPIs — Golden Ratio 1.618fr 0.618fr 0.382fr
         ═══════════════════════════════════════════════════════ */}
      <section className="mb-12">
        <SectionHeader>Hero KPIs</SectionHeader>
        <div className="grid grid-cols-1 lg:grid-cols-[1.618fr_0.618fr_0.382fr] gap-6">

          <Widget title="KPI Overview" question="Jaki jest aktualny stan biznesu?" badge={isLive ? "live" : "projections"}
            footer={<button onClick={() => setShowSecondaryKpi(!showSecondaryKpi)} className="text-[10px] font-mono text-[#21808d]">{showSecondaryKpi ? "Hide details" : "Show more"}</button>}>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Users", value: isLive ? fmt(live.totalUsers) : fmt(HERO_KPI.dau), color: "#21808d" },
                { label: "Objects", value: isLive ? fmt(live.totalObjects) : `${fmt(HERO_KPI.mrr)} PLN`, color: "#e8e8ec" },
                { label: "Patterns", value: isLive ? fmt(live.totalPatterns) : `${HERO_KPI.runway_months}mo`, color: "#e8e8ec" },
                { label: isLive ? "Completed" : "NRR", value: isLive ? `${live.completedRate}%` : `${HERO_KPI.nrr}%`, color: "#3d9970" },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#888893]">{label}</p>
                  <p className="font-mono text-2xl font-bold tabular-nums" style={{ color }}>{value}</p>
                </div>
              ))}
            </div>
            {showSecondaryKpi && (
              <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-[#222228]">
                {(isLive ? [
                  { label: "Voice", value: String(live.voiceObjects), color: "#888893" },
                  { label: "Crisis", value: String(live.crisisEvents), color: live.crisisEvents === 0 ? "#3d9970" : "#cc4444" },
                  { label: "Conf.", value: `${live.avgConfidence}`, color: "#888893" },
                  { label: "PRO", value: String(live.proUsers), color: "#21808d" },
                ] : [
                  { label: "DAU", value: String(HERO_KPI.dau), color: "#888893" },
                  { label: "Churn", value: `${HERO_KPI.churn}%`, color: HERO_KPI.churn < 5 ? "#3d9970" : "#cc4444" },
                  { label: "LTV/CAC", value: `${HERO_KPI.ltv_cac}x`, color: "#888893" },
                  { label: "Conv.", value: `${HERO_KPI.conversion}%`, color: "#888893" },
                ]).map(({ label, value, color }) => (
                  <div key={label}>
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#55555e]">{label}</p>
                    <p className="font-mono text-sm tabular-nums" style={{ color }}>{value}</p>
                  </div>
                ))}
              </div>
            )}
          </Widget>

          <Widget title="System Status" question="Czy framework dziala?" badge="live">
            <div className="space-y-2">
              {[
                { label: "Edge", status: SYSTEM_STATUS.edge_status },
                { label: "Serverless", status: SYSTEM_STATUS.serverless_status },
                { label: "Database", status: SYSTEM_STATUS.supabase_status },
              ].map(({ label, status }) => (
                <div key={label} className="flex items-center gap-2">
                  <StatusDot color={status === "operational" ? "#3d9970" : status === "degraded" ? "#d4a843" : "#cc4444"} pulse={status === "operational"} />
                  <span className="text-[11px] font-mono text-[#e8e8ec]">{label}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-[#55555e] mt-2">{SYSTEM_STATUS.last_commit} &middot; CI: <StatusBadge status={SYSTEM_STATUS.ci_status} /></p>
            <DrillLink target="band-f">View infra details</DrillLink>
          </Widget>

          <Widget title="Safety" question="Czy P0/P1/P2 sa spelnione?" badge={isLive ? "live" : "projections"}>
            <div className="space-y-1.5">
              {[
                { level: "P0" as const, label: "Safety", pass: true },
                { level: "P1" as const, label: "Language", pass: true },
                { level: "P2" as const, label: "Framing", pass: true },
              ].map(({ level, label, pass }) => (
                <div key={level} className="flex items-center gap-2">
                  <StatusDot color={pass ? "#3d9970" : "#cc4444"} />
                  <PBadge level={level} />
                  <span className="text-[10px] text-[#888893]">{label}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-[#55555e] mt-2">
              Nuclear 24h: {isLive ? live.crisisEvents : SAFETY_COMPLIANCE.nuclear_events_24h} &middot;
              Violations: {SAFETY_COMPLIANCE.language_violations_24h}
            </p>
            <DrillLink target="band-c">View compliance details</DrillLink>
          </Widget>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
           BAND B: PRODUCT | AGENTS | EVENTS
         ═══════════════════════════════════════════════════════ */}
      <section className="mb-12">
        <SectionHeader>Product &middot; Agents &middot; Events</SectionHeader>
        <div className="grid grid-cols-1 lg:grid-cols-[1.0fr_0.8fr_0.6fr] gap-6">

          {/* Column 1: Product */}
          <div className="space-y-6">
            <Widget title="App Status" question="Czy kluczowe aplikacje sa dostepne?" badge="live">
              <div className="space-y-2">
                {APP_STATUS.map((app) => {
                  const liveUrl = app.name === "PatternLens" ? "https://patternlens.app" : app.name === "Portal" ? "https://patternslab.app" : null;
                  return (
                    <div key={app.name} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03]">
                      <StatusDot color={app.status === "operational" ? "#3d9970" : app.status === "degraded" ? "#d4a843" : "#cc4444"} pulse={app.status === "operational"} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-mono font-bold text-[#e8e8ec] truncate">{app.name}</p>
                        <p className="text-[10px] text-[#55555e]">{app.domain}</p>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <p className="font-mono text-xs font-bold text-[#e8e8ec]">{app.dau} <span className="text-[#55555e] font-normal">DAU</span></p>
                        {liveUrl ? (
                          <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="text-[9px] font-mono text-[#21808d] hover:text-[#e8e8ec] transition-colors">&rarr;</a>
                        ) : (
                          <span className="text-[9px] text-[#55555e]">Q2</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Widget>

            <Widget title="Module Activation" question="Ktore moduly frameworka sa aktywne?" badge="live"
              footer={<DrillLink target="band-d">View module details</DrillLink>}>
              <div className="space-y-1">
                {MODULE_STATUS.map((mod) => (
                  <div key={mod.name} className="flex items-center gap-2 px-2 py-1 rounded bg-white/[0.03]">
                    <StatusDot color={mod.status === "ready" ? "#3d9970" : mod.status === "planned" ? "#55555e" : "#d4a843"} />
                    <span className="text-[11px] font-mono flex-1 truncate text-[#e8e8ec]">{mod.name}</span>
                    {mod.edge && <span className="text-[9px] px-1 py-0.5 rounded bg-[#21808d]/10 text-[#21808d]">edge</span>}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold ${mod.type === "open" ? "text-[#3d9970] bg-[#3d9970]/10" : "text-[#d4a843] bg-[#d4a843]/10"}`}>
                      {mod.type === "open" ? "O" : "C"}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] mt-2 text-[#55555e]">15 modules: 8 open + 7 closed</p>
            </Widget>

            <Widget title="Archetype Distribution" question="Jak rozkladaja sie archetypy w populacji?" badge={isLive ? "live" : "projections"}>
              <div className="space-y-1.5">
                {(isLive && live.archetypeDistribution.length > 0
                  ? live.archetypeDistribution.map((a) => {
                      const total = live.archetypeDistribution.reduce((s, x) => s + x.count, 0);
                      return { name: a.name, pct: total > 0 ? Math.round((a.count / total) * 1000) / 10 : 0 };
                    })
                  : ARCHETYPE_DISTRIBUTION
                ).map((arch) => (
                  <div key={arch.name} className="flex items-center gap-2">
                    <span className="text-[10px] w-16 truncate text-[#888893]">{arch.name}</span>
                    <div className="flex-1 h-3 rounded-full overflow-hidden bg-[#1a1a1e]">
                      <div className="h-full rounded-full bg-[#21808d]/50" style={{ width: `${(arch.pct / (isLive ? 100 : archMax)) * 100}%`, minWidth: "4px" }} />
                    </div>
                    <span className="text-[10px] font-mono w-10 text-right text-[#e8e8ec]">{arch.pct}%</span>
                  </div>
                ))}
              </div>
            </Widget>
          </div>

          {/* Column 2: Agents */}
          <div className="space-y-6">
            <Widget title="Agent Layers" question="Ktore warstwy agentow sa aktywne?" badge="coming-soon">
              <div className="space-y-3">
                {AGENT_LAYERS.map((layer) => (
                  <div key={layer.layer} className="p-3 rounded-lg bg-white/[0.03]">
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

            <Widget title="Agent Performance" question="Czy agenci sa rentowni i dostarczaja ROI?" badge="coming-soon">
              <div className="space-y-1.5">
                {AGENT_PERFORMANCE.map((a) => (
                  <div key={a.agent} className="flex items-center gap-2 px-2 py-1.5 rounded bg-white/[0.03]">
                    <span className="text-[10px] font-mono w-3 text-[#55555e]">L{a.layer}</span>
                    <span className="text-[11px] font-mono flex-1 truncate text-[#e8e8ec]">{a.agent}</span>
                    <span className="text-[10px] text-[#888893]">{a.tasks}</span>
                    <span className="text-[10px] font-mono text-[#21808d]">{a.cost}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 px-2 py-1.5 rounded text-[10px] font-mono bg-[#21808d]/[0.08] text-[#21808d]">
                Total $198-338/mo vs $22-34K human = 65-100x ROI
              </div>
            </Widget>

            <Widget title="Policy Alerts" question="Czy ktory agent lamie polityki?" badge="coming-soon">
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
                          <span className="text-[10px] text-[#55555e]">L{alert.layer} &middot; {alert.time}</span>
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
            <Widget title="Events Rate" question="Jak intensywnie system generuje eventy?" badge="projections">
              <div className="mb-3">
                <p className="font-mono text-2xl font-bold tabular-nums text-[#21808d]">{EVENTS_RATE.events_per_min}<span className="text-[10px] font-normal text-[#55555e]"> evt/min</span></p>
                <div className="flex items-center gap-3 text-[10px] text-[#55555e]">
                  <span>{fmt(EVENTS_RATE.total_24h)} 24h</span>
                  <span>{EVENTS_RATE.error_pct}% err</span>
                </div>
              </div>
              <div className="space-y-1">
                {Object.entries(EVENTS_RATE.domain).slice(0, 8).map(([event, count]) => (
                  <div key={event} className="flex items-center gap-2">
                    <span className="text-[9px] font-mono flex-1 truncate text-[#888893]">{event}</span>
                    <span className="text-[10px] font-mono font-bold text-[#e8e8ec]">{count}%</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-[#55555e] mt-1">14 event types total</p>
            </Widget>

            <Widget title="Events Timeline" question="Jakie kluczowe eventy zachodzizy w czasie?" badge="projections">
              <div className="space-y-2">
                {RECENT_EVENTS.slice(0, 6).map((evt, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <StatusDot color={evt.type === "success" ? "#3d9970" : evt.type === "warn" ? "#d4a843" : "#21808d"} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-mono text-[#e8e8ec]">{evt.event}</span>
                        <span className="text-[9px] text-[#55555e]">{evt.time}</span>
                      </div>
                      <p className="text-[9px] truncate text-[#888893]">{evt.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Widget>

            <Widget title="Crisis Events" question="Czy ostatnio wystapily zdarzenia kryzysowe?" badge={isLive ? "live" : "projections"}>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#888893]">24h</p>
                  <p className={`font-mono text-xl font-bold tabular-nums ${(isLive ? live.crisisEvents : EVENTS_CRISIS.crisis_24h) === 0 ? "text-[#3d9970]" : "text-[#cc4444]"}`}>
                    {isLive ? live.crisisEvents : EVENTS_CRISIS.crisis_24h}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#888893]">7d</p>
                  <p className={`font-mono text-xl font-bold tabular-nums ${EVENTS_CRISIS.crisis_7d === 0 ? "text-[#3d9970]" : "text-[#d4a843]"}`}>
                    {EVENTS_CRISIS.crisis_7d}
                  </p>
                </div>
              </div>
              <div className="flex gap-1.5">
                {[
                  { label: "Hi", count: EVENTS_CRISIS.risk_high, color: "#cc4444" },
                  { label: "Med", count: EVENTS_CRISIS.risk_medium, color: "#d4a843" },
                  { label: "Lo", count: EVENTS_CRISIS.risk_low, color: "#3d9970" },
                ].map(({ label, count, color }) => (
                  <div key={label} className={`flex-1 text-center px-1 py-1 rounded`} style={{ background: `${color}10` }}>
                    <p className="text-[9px] text-[#888893]">{label}</p>
                    <p className="font-mono text-xs font-bold" style={{ color }}>{count}</p>
                  </div>
                ))}
              </div>
            </Widget>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
           BAND C: COMPLIANCE & SAFETY
         ═══════════════════════════════════════════════════════ */}
      <section id="band-c" className="mb-12">
        <SectionHeader>Compliance &amp; Safety</SectionHeader>
        <div className="grid grid-cols-1 lg:grid-cols-[1.618fr_0.618fr_0.382fr] gap-6">

          <Widget title="Compliance Matrix" question="Czy P0/P1/P2 sa zgodne w runtime?" badge="projections">
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

          <Widget title="Crisis Feed" question="Jakie przypadki safety obsluzyl system?" badge={isLive ? "live" : "projections"}>
            <div className="space-y-2">
              {SAFETY_CRISIS_FEED.map((item, i) => (
                <div key={i} className="px-2 py-2 rounded-lg bg-white/[0.03]">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-[10px] font-mono text-[#d4a843]">L{item.layer}</span>
                    <span className={`text-[9px] px-1 py-0.5 rounded font-mono ${item.action === "block" ? "bg-[#cc4444]/10 text-[#cc4444]" : "bg-[#d4a843]/10 text-[#d4a843]"}`}>{item.action}</span>
                    <span className="text-[9px] text-[#55555e] ml-auto">{item.time}</span>
                  </div>
                  <p className="text-[9px] text-[#888893]">{item.detail}</p>
                </div>
              ))}
            </div>
          </Widget>

          <Widget title="Language Guard" question="Czy @silence/language blokuje forbidden vocabulary?" badge="projections">
            <div className="space-y-2">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#888893]">Blocked/1k</p>
                <p className="font-mono text-xl font-bold tabular-nums text-[#e8e8ec]">{LANGUAGE_GUARD.blocked_per_1k}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#888893]">False pos.</p>
                <p className="font-mono text-xl font-bold tabular-nums text-[#3d9970]">{LANGUAGE_GUARD.false_positives}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#888893]">Edge</p>
                <StatusBadge status={LANGUAGE_GUARD.edge_runtime} />
              </div>
            </div>
          </Widget>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
           BAND D: ARCHITECTURE & MODULES
         ═══════════════════════════════════════════════════════ */}
      <section id="band-d" className="mb-12">
        <SectionHeader>Architecture &amp; Modules</SectionHeader>
        <div className="grid grid-cols-1 lg:grid-cols-[1.618fr_1fr] gap-6">

          <Widget title="Architecture Layers" question="Czy kluczowe warstwy architektury sa zdrowe?" muted badge="live">
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
            <div className="mt-3 px-2 py-1.5 rounded text-[10px] font-mono text-[#55555e] bg-white/[0.02]">
              Edge &rarr; Thin Handler &rarr; Domain Module &rarr; Event Bus &rarr; Supabase
            </div>
          </Widget>

          <div className="space-y-6">
            <Widget title="Module Detail" question="Jakie sa szczegoly modulow?" muted badge="live">
              <div className="overflow-x-auto">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="text-[#55555e]">
                      <th className="text-left font-mono py-1">Module</th>
                      <th className="text-left font-mono py-1">Level</th>
                      <th className="text-left font-mono py-1">Events</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MODULE_DETAIL.map((mod) => (
                      <tr key={mod.name} className="border-t border-[#222228]/50">
                        <td className="py-1 font-mono text-[#e8e8ec]">{mod.name}</td>
                        <td className="py-1 text-[#888893]">{mod.level}</td>
                        <td className="py-1 text-[#888893]">{mod.events.length > 0 ? mod.events.join(", ") : "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Widget>

            <Widget title="Data Layer" question="Czy warstwa danych dziala poprawnie?" muted badge={isLive ? "live" : "projections"}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#888893]">Tenants</p>
                  <p className="font-mono text-xl font-bold tabular-nums text-[#e8e8ec]">{DATA_LAYER.tenant_count}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#888893]">Events/day</p>
                  <p className="font-mono text-xl font-bold tabular-nums text-[#21808d]">{fmt(DATA_LAYER.events_per_day)}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#888893]">RLS violations</p>
                  <p className="font-mono text-xl font-bold tabular-nums text-[#3d9970]">{DATA_LAYER.rls_violations}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#888893]">KPI lag</p>
                  <p className="font-mono text-sm font-bold text-[#3d9970]">{DATA_LAYER.kpi_freshness_lag}</p>
                </div>
              </div>
            </Widget>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
           BAND E: INVESTOR & BUSINESS
         ═══════════════════════════════════════════════════════ */}
      <section className="mb-12">
        <SectionHeader>Investor &amp; Business</SectionHeader>
        <div className="grid grid-cols-1 lg:grid-cols-[1.618fr_0.618fr_0.382fr] gap-6">

          <Widget title="Revenue Projection" question="Jak rosna KPI w czasie vs targety?" badge="projections">
            <div className="flex items-end gap-3 h-32">
              {REVENUE_PROJECTION.map((proj) => {
                const pct = (proj.arr / revMax) * 100;
                return (
                  <div key={proj.period} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <span className="text-[10px] font-mono font-bold text-[#21808d]">{fmtPLN(proj.arr)}</span>
                    <div className="w-full rounded-t bg-[#21808d]/50" style={{ height: `${pct}%`, minHeight: "4px" }} />
                    <span className="text-[10px] text-[#55555e]">{proj.period}</span>
                    <span className="text-[9px] text-[#55555e]">{fmt(proj.users_paid)} paid</span>
                  </div>
                );
              })}
            </div>
          </Widget>

          <Widget title="Unit Economics" question="Czy unit economics sie spinaja?" badge="projections">
            <div className="space-y-2">
              {UNIT_ECONOMICS.map((tier) => (
                <div key={tier.tier} className="px-2 py-1.5 rounded bg-white/[0.03]">
                  <p className="font-mono text-[11px] font-bold text-[#e8e8ec]">{tier.tier}</p>
                  <div className="flex gap-2 text-[10px] mt-1">
                    <span className="text-[#888893]">${tier.price}</span>
                    <span className={tier.margin_pct > 50 ? "text-[#3d9970]" : "text-[#55555e]"}>{tier.margin_pct}%</span>
                    <span className="text-[#21808d]">LTV ${tier.ltv}</span>
                  </div>
                </div>
              ))}
            </div>
          </Widget>

          <Widget title="Targets" question="Czy jestesmy na sciezce do targetow?" badge="projections">
            <div className="space-y-2">
              {REVENUE_TARGETS.map((t) => (
                <div key={t.period} className="px-2 py-1.5 rounded bg-white/[0.03]">
                  <p className="font-mono text-[11px] font-bold text-[#e8e8ec]">{t.period}</p>
                  <div className="flex gap-2 text-[9px] mt-0.5">
                    <span className="text-[#888893]">{fmt(t.target_free)} free</span>
                    <span className="text-[#888893]">{fmt(t.target_paid)} paid</span>
                    <span className="text-[#888893]">{fmtPLN(t.target_arr)}</span>
                  </div>
                  {t.actual_free !== null && (
                    <div className="flex gap-2 text-[9px] text-[#21808d]">
                      <span>({fmt(t.actual_free)})</span>
                      <span>({t.actual_paid})</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Widget>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
           BAND F: OPS & DEPLOYMENT
         ═══════════════════════════════════════════════════════ */}
      <section id="band-f" className="mb-8">
        <SectionHeader>Ops &amp; Deployment</SectionHeader>
        <div className="grid grid-cols-1 lg:grid-cols-[1.618fr_1fr] gap-6">

          <Widget title="Deployment Status" question="Czy Vercel, Supabase, n8n, Stripe i GitHub Actions sa OK?" compact badge="live">
            <div className="space-y-1">
              {OPS_SERVICES.map((svc) => (
                <div key={svc.name} className="flex items-center gap-2 px-2 py-1 rounded bg-white/[0.02]">
                  <StatusDot color={svc.status === "operational" ? "#3d9970" : svc.status === "degraded" ? "#d4a843" : "#cc4444"} pulse={svc.status === "operational"} />
                  <span className="text-[10px] font-mono flex-1 truncate text-[#888893]">{svc.name}</span>
                  <span className="text-[9px] text-[#55555e]">{svc.last_deploy}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 rounded-lg p-2 bg-[#3d9970]/[0.06] border border-[#3d9970]/15">
              <div className="flex items-center gap-2">
                <StatusDot color="#3d9970" />
                <span className="text-[10px] font-mono text-[#888893]">{CI_CD_STATUS.last_deploy.env} &middot; {CI_CD_STATUS.last_deploy.at}</span>
              </div>
            </div>
          </Widget>

          <div className="space-y-6">
            <Widget title="Orchestrator Rules" question="Ktore reguly Orchestratora sa aktywne?" compact badge="coming-soon">
              <div className="space-y-1.5">
                {ORCHESTRATOR_RULES.map((rule, i) => (
                  <div key={i} className="px-2 py-1.5 rounded bg-white/[0.02]">
                    <p className="text-[9px] font-mono text-[#888893]">{rule.rule}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[9px] px-1 py-0.5 rounded font-mono ${
                        rule.type === "safety" ? "bg-[#cc4444]/10 text-[#cc4444]" :
                        rule.type === "revenue" ? "bg-[#d4a843]/10 text-[#d4a843]" :
                        "bg-[#3d9970]/10 text-[#3d9970]"
                      }`}>{rule.type}</span>
                      <span className="text-[9px] text-[#55555e]">{rule.triggers_7d}x / 7d</span>
                    </div>
                  </div>
                ))}
              </div>
            </Widget>

            <Widget title="Build Order" question="Na jakim etapie build-order jestesmy (Phase 0-3)?" compact badge="live">
              <div className="space-y-3">
                {BUILD_ORDER.map((phase) => (
                  <div key={phase.phase}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-[#888893]">{phase.phase}</span>
                      <span className="text-[10px] font-mono font-bold text-[#888893]">{phase.progress}%</span>
                    </div>
                    <div className="w-full h-1 rounded-full bg-[#1a1a1e]">
                      <div className="h-1 rounded-full" style={{ width: `${phase.progress}%`, background: phase.progress > 50 ? "#21808d" : phase.progress > 0 ? "#d4a843" : "rgba(119,124,124,0.4)", minWidth: phase.progress > 0 ? "4px" : "0" }} />
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {phase.items.map((item) => (
                        <span key={item.name} className="text-[8px] px-1 py-0.5 rounded inline-flex items-center gap-0.5 bg-white/[0.02]">
                          <BuildIcon status={item.status} />
                          <span className="text-[#55555e]">{item.name}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Widget>
          </div>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="mt-12 pt-6 pb-20 text-center border-t border-[#222228]">
        <p className="text-[10px] font-mono text-[#55555e]">
          SILENCE.OBJECTS v5.1 &middot; 24 Widgets &middot; 15 Modules &middot; Agent Army v3.0 &middot; Open Core Framework
        </p>
      </footer>

      {/* ══════════ STICKY CTA BAR ══════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-6 py-3 flex items-center justify-between bg-[#111113] border-t border-[#222228]">
        <span className="text-[12px] text-[#888893] font-mono hidden md:inline">
          SILENCE.OBJECTS Framework v5.1 &middot; Open Core &middot; 15 modules
        </span>
        <div className="flex gap-3 ml-auto">
          <a href="https://patternlens.app"
            className="px-4 py-2 rounded-lg text-sm font-mono font-semibold transition-all bg-[#21808d] text-white">
            Try Pattern Analysis &rarr;
          </a>
          <a href="https://github.com/Patternslab-ecosystem/SILENCE.OBJECTS"
            target="_blank" rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg text-sm font-mono border border-[#222228] text-[#888893] hover:border-[#333340] hover:text-[#e8e8ec] transition-all">
            GitHub
          </a>
        </div>
      </div>
    </main>
  );
}
