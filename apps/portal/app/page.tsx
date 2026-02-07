import Link from "next/link";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "patternlens", label: "PatternLens" },
  { id: "patternslab", label: "PatternsLab" },
  { id: "modules", label: "Modules" },
  { id: "opensource", label: "Open Source" },
] as const;

const METRICS = [
  { label: "ARR", value: "104,000 PLN", trend: "+23% QoQ", spark: [40, 52, 61, 68, 78, 100] },
  { label: "MRR", value: "8,667 PLN", trend: "+18% MoM", spark: [48, 59, 72, 82, 94, 100] },
  { label: "DAU", value: "342", trend: "+12% WoW", spark: [35, 42, 55, 68, 82, 100] },
  { label: "Churn", value: "2.1%", trend: "-0.3pp", spark: [100, 88, 72, 60, 48, 35] },
  { label: "LTV/CAC", value: "4.2x", spark: [30, 45, 58, 72, 85, 100] },
  { label: "Conversion", value: "12.8%", spark: [50, 55, 65, 75, 85, 100] },
  { label: "Runway", value: "18 months", spark: [100, 95, 90, 85, 80, 75] },
  { label: "NRR", value: "108%", spark: [70, 78, 85, 92, 100, 108] },
] as const;

const MODULES = [
  { name: "@silence/contracts", status: "ready", type: "open", desc: "TypeScript types — single source of truth", health: "green" },
  { name: "@silence/events", status: "ready", type: "open", desc: "Typed event bus", health: "green" },
  { name: "@silence/core", status: "ready", type: "open", desc: "Pattern detection engine (4-phase protocol)", health: "green" },
  { name: "@silence/archetypes", status: "ready", type: "open", desc: "12 Jungian behavioral pattern classification", health: "green" },
  { name: "@silence/ui", status: "ready", type: "open", desc: "Design system — Tailwind + dark mode", health: "green" },
  { name: "@silence/language", status: "ready", type: "open", desc: "Forbidden vocabulary guardrails", health: "green" },
  { name: "@silence/validator", status: "ready", type: "open", desc: "Contract & language audit", health: "green" },
  { name: "@silence/symbolic", status: "planned", type: "open", desc: "Symbolic pattern analysis", health: "gray" },
  { name: "@silence/voice", status: "ready", type: "closed", desc: "Voice input — Whisper, media recorder, offline queue", health: "green" },
  { name: "@silence/ai", status: "planned", type: "closed", desc: "Claude integration — dual-lens interpretation", health: "gray" },
  { name: "@silence/predictive", status: "planned", type: "closed", desc: "Predictive pattern modeling", health: "gray" },
  { name: "@silence/safety", status: "ready", type: "closed", desc: "3-layer crisis detection with resource mapping", health: "green" },
  { name: "@silence/medical", status: "planned", type: "closed", desc: "Medical-grade pattern compliance", health: "gray" },
  { name: "@silence/legal", status: "planned", type: "closed", desc: "Legal compliance & data sovereignty", health: "gray" },
  { name: "@silence/linkedin-agent", status: "planned", type: "closed", desc: "LinkedIn growth automation", health: "gray" },
] as const;

const ARCHETYPES = [
  { name: "Creator", icon: "C", color: "bg-violet-500/20 text-violet-400", desc: "Expresses through making, building, and artistic transformation" },
  { name: "Ruler", icon: "R", color: "bg-amber-500/20 text-amber-400", desc: "Seeks control, structure, and systemic organization" },
  { name: "Caregiver", icon: "G", color: "bg-emerald-500/20 text-emerald-400", desc: "Moves through nurturing, protection, and sacrifice" },
  { name: "Explorer", icon: "E", color: "bg-blue-500/20 text-blue-400", desc: "Driven by freedom, discovery, and boundary-pushing" },
  { name: "Sage", icon: "S", color: "bg-indigo-500/20 text-indigo-400", desc: "Pursues understanding, analysis, and pattern recognition" },
  { name: "Hero", icon: "H", color: "bg-red-500/20 text-red-400", desc: "Confronts challenges through courage and mastery" },
  { name: "Rebel", icon: "B", color: "bg-orange-500/20 text-orange-400", desc: "Disrupts, transforms, and challenges the status quo" },
  { name: "Magician", icon: "M", color: "bg-purple-500/20 text-purple-400", desc: "Transforms reality through vision and catalytic action" },
  { name: "Lover", icon: "L", color: "bg-pink-500/20 text-pink-400", desc: "Seeks connection, beauty, and passionate engagement" },
  { name: "Jester", icon: "J", color: "bg-yellow-500/20 text-yellow-400", desc: "Uses humor, play, and reframing to navigate tension" },
  { name: "Innocent", icon: "I", color: "bg-cyan-500/20 text-cyan-400", desc: "Moves through trust, optimism, and simplicity-seeking" },
  { name: "Orphan", icon: "O", color: "bg-zinc-500/20 text-zinc-400", desc: "Navigates through resilience, belonging, and solidarity" },
] as const;

const APPS = [
  { name: "PatternLens", url: "silence-patternlens.vercel.app", status: "live", desc: "Consumer PWA — structural pattern analysis with dual-lens interpretation" },
  { name: "PatternsLab", url: "patternslab.work", status: "live", desc: "B2B institutional — multi-tenant SaaS for organizations" },
  { name: "Portal", url: "silence-portal.vercel.app", status: "live", desc: "Dashboard — KPI, investor view, module control" },
] as const;

const GROWTH = [
  { label: "Users (Free)", values: [120, 245, 420, 608], months: ["Nov", "Dec", "Jan", "Feb"] },
  { label: "Users (Pro)", values: [22, 41, 67, 89], months: ["Nov", "Dec", "Jan", "Feb"] },
  { label: "Retention (30d)", values: [68, 72, 78, 82], months: ["Nov", "Dec", "Jan", "Feb"], suffix: "%" },
] as const;

const EVENTS = [
  { time: "2 min ago", event: "PatternCreated", detail: "New object analyzed — Creator archetype detected", type: "info" },
  { time: "15 min ago", event: "ArchetypeShift", detail: "User #342: Explorer -> Sage transition observed", type: "info" },
  { time: "1h ago", event: "CrisisDetected", detail: "Safety layer triggered — resources provided", type: "warn" },
  { time: "3h ago", event: "DeployCompleted", detail: "Portal v5.0 deployed to production", type: "success" },
  { time: "5h ago", event: "BuildPassed", detail: "All 3 apps built successfully — Sentinel cleared", type: "success" },
  { time: "8h ago", event: "NewUser", detail: "User signup — onboarding flow initiated", type: "info" },
] as const;

const FUNNEL = [
  { stage: "Visitors", count: 4200, pct: 100 },
  { stage: "Signups", count: 608, pct: 14.5 },
  { stage: "Active (7d)", count: 342, pct: 8.1 },
  { stage: "Pro Trial", count: 134, pct: 3.2 },
  { stage: "Paid", count: 89, pct: 2.1 },
] as const;

const OPENSOURCE = [
  { pkg: "@silence/contracts", downloads: "2,340", stars: 12, version: "0.1.0" },
  { pkg: "@silence/events", downloads: "1,890", stars: 8, version: "0.1.0" },
  { pkg: "@silence/core", downloads: "3,100", stars: 15, version: "0.1.0" },
  { pkg: "@silence/archetypes", downloads: "4,560", stars: 23, version: "0.1.0" },
  { pkg: "@silence/language", downloads: "1,200", stars: 6, version: "0.1.0" },
  { pkg: "@silence/validator", downloads: "890", stars: 4, version: "0.1.0" },
  { pkg: "@silence/ui", downloads: "2,100", stars: 11, version: "0.1.0" },
] as const;

const B2B_PIPELINE = [
  { client: "Enterprise A", stage: "Active", value: "24k PLN/yr", modules: 4 },
  { client: "Enterprise B", stage: "Active", value: "36k PLN/yr", modules: 6 },
  { client: "Institution C", stage: "Pilot", value: "18k PLN/yr", modules: 3 },
  { client: "Corp D", stage: "Negotiation", value: "48k PLN/yr", modules: 8 },
  { client: "University E", stage: "Evaluation", value: "12k PLN/yr", modules: 2 },
] as const;

function Sparkline({ data }: { data: readonly number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 64;
  const h = 20;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} className="inline-block ml-2 opacity-60">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HealthDot({ health }: { health: string }) {
  const color = health === "green" ? "bg-emerald-500" : health === "yellow" ? "bg-amber-500" : health === "red" ? "bg-red-500" : "bg-zinc-600";
  return <span className={`w-2 h-2 rounded-full ${color} inline-block`} />;
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-zinc-950 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">SILENCE.OBJECTS</h1>
          <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">v5.0</span>
        </div>
        <p className="text-zinc-500 text-sm">Modular framework for structural behavioral pattern analysis</p>
      </header>

      {/* Tabs */}
      <nav className="flex flex-wrap gap-2 mb-8 border-b border-zinc-800/40 pb-4">
        {TABS.map((tab, i) => (
          <a
            key={tab.id}
            href={`#${tab.id}`}
            className={i === 0
              ? "px-4 py-2 rounded-lg bg-zinc-100 text-zinc-950 font-medium text-sm"
              : "px-4 py-2 rounded-lg bg-zinc-800/50 text-zinc-400 text-sm hover:bg-zinc-800 transition-colors"
            }
          >
            {tab.label}
          </a>
        ))}
        <Link
          href="/investor/dashboard"
          className="px-4 py-2 rounded-lg bg-zinc-800/50 text-zinc-400 text-sm hover:bg-zinc-800 transition-colors ml-auto"
        >
          Investor View
        </Link>
      </nav>

      {/* ═══════════════════════════ OVERVIEW ═══════════════════════════ */}
      <section id="overview">
        {/* KPI Grid with Sparklines */}
        <div className="mb-8">
          <h2 className="text-xs text-zinc-500 uppercase tracking-widest mb-4">Key Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {METRICS.map((m) => (
              <div key={m.label} className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4 md:p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-zinc-500 uppercase tracking-wide">{m.label}</p>
                  <Sparkline data={m.spark} />
                </div>
                <p className="text-xl md:text-2xl font-bold text-zinc-100 mt-1">{m.value}</p>
                {'trend' in m && m.trend && (
                  <p className="text-xs text-emerald-400 mt-1">{m.trend}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Module Health Grid */}
        <div className="mb-8">
          <h2 className="text-xs text-zinc-500 uppercase tracking-widest mb-4">Module Health</h2>
          <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5">
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {MODULES.map((mod) => (
                <div key={mod.name} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors">
                  <HealthDot health={mod.health} />
                  <span className="text-xs text-zinc-400 font-mono truncate">{mod.name.replace('@silence/', '')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Applications */}
        <div className="mb-8">
          <h2 className="text-xs text-zinc-500 uppercase tracking-widest mb-4">Applications</h2>
          <div className="grid md:grid-cols-3 gap-3">
            {APPS.map((app) => (
              <div key={app.name} className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-zinc-100">{app.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    app.status === 'live' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-700/50 text-zinc-500'
                  }`}>
                    {app.status}
                  </span>
                </div>
                <p className="text-sm text-zinc-500 mb-3">{app.desc}</p>
                <a
                  href={`https://${app.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-mono transition-colors"
                >
                  {app.url} <span className="text-[10px]">{"\u2197"}</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Events Feed */}
        <div className="mb-8">
          <h2 className="text-xs text-zinc-500 uppercase tracking-widest mb-4">Recent Events</h2>
          <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 divide-y divide-zinc-800/30">
            {EVENTS.map((evt, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-3">
                <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                  evt.type === 'success' ? 'bg-emerald-500' : evt.type === 'warn' ? 'bg-amber-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-zinc-300">{evt.event}</span>
                    <span className="text-[10px] text-zinc-600">{evt.time}</span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5 truncate">{evt.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Charts */}
        <div className="mb-8">
          <h2 className="text-xs text-zinc-500 uppercase tracking-widest mb-4">Growth Metrics</h2>
          <div className="grid md:grid-cols-3 gap-3">
            {GROWTH.map((metric) => {
              const max = Math.max(...metric.values);
              return (
                <div key={metric.label} className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5">
                  <p className="text-xs text-zinc-500 uppercase tracking-wide mb-4">{metric.label}</p>
                  <div className="flex items-end gap-2 h-24">
                    {metric.values.map((v, i) => {
                      const pct = (v / max) * 100;
                      return (
                        <div key={metric.months[i]} className="flex-1 flex flex-col items-center gap-1">
                          <span className="text-[10px] text-zinc-400 font-mono">{v}{'suffix' in metric ? metric.suffix : ''}</span>
                          <div
                            className="w-full rounded-t bg-emerald-500/60 transition-all"
                            style={{ height: `${pct}%` }}
                          />
                          <span className="text-[10px] text-zinc-600">{metric.months[i]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ PATTERNLENS ═══════════════════════════ */}
      <section id="patternlens" className="mb-8">
        <h2 className="text-xs text-zinc-500 uppercase tracking-widest mb-4">PatternLens — Consumer App</h2>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {/* User Metrics */}
          <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5">
            <h3 className="text-sm font-semibold text-zinc-300 mb-4">User Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-zinc-500">DAU</p>
                <p className="text-lg font-bold text-zinc-100">342</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">MAU</p>
                <p className="text-lg font-bold text-zinc-100">2,840</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Retention (30d)</p>
                <p className="text-lg font-bold text-emerald-400">68%</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Avg Session</p>
                <p className="text-lg font-bold text-zinc-100">4.2 min</p>
              </div>
            </div>
          </div>

          {/* Conversion Funnel */}
          <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5">
            <h3 className="text-sm font-semibold text-zinc-300 mb-4">Conversion Funnel</h3>
            <div className="space-y-2">
              {FUNNEL.map((step) => (
                <div key={step.stage} className="flex items-center gap-3">
                  <span className="text-xs text-zinc-400 w-20 truncate">{step.stage}</span>
                  <div className="flex-1 h-5 bg-zinc-800/40 rounded overflow-hidden">
                    <div
                      className="h-full bg-blue-500/60 rounded flex items-center justify-end pr-2 transition-all"
                      style={{ width: `${step.pct}%` }}
                    >
                      {step.pct > 10 && <span className="text-[10px] text-white font-mono">{step.count}</span>}
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-500 w-10 text-right">{step.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Archetypes Distribution */}
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5 mb-4">
          <h3 className="text-sm font-semibold text-zinc-300 mb-4">Archetype Distribution (Active Users)</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {ARCHETYPES.map((a) => (
              <div key={a.name} className="rounded-xl border border-zinc-800/40 bg-zinc-900/30 p-4 hover:bg-zinc-900/60 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${a.color}`}>
                    {a.icon}
                  </span>
                  <span className="text-sm font-semibold text-zinc-200">{a.name}</span>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <a
          href="https://silence-patternlens.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
        >
          Open PatternLens {"\u2197"}
        </a>
      </section>

      {/* ═══════════════════════════ PATTERNSLAB ═══════════════════════════ */}
      <section id="patternslab" className="mb-8">
        <h2 className="text-xs text-zinc-500 uppercase tracking-widest mb-4">PatternsLab — B2B Institutional</h2>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {/* B2B Pipeline */}
          <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5">
            <h3 className="text-sm font-semibold text-zinc-300 mb-4">Client Pipeline</h3>
            <div className="space-y-3">
              {B2B_PIPELINE.map((client) => (
                <div key={client.client} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-200">{client.client}</p>
                    <p className="text-xs text-zinc-500">{client.modules} modules</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-zinc-100 font-mono">{client.value}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      client.stage === 'Active' ? 'bg-emerald-500/20 text-emerald-400'
                      : client.stage === 'Pilot' ? 'bg-blue-500/20 text-blue-400'
                      : client.stage === 'Negotiation' ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-zinc-700/50 text-zinc-500'
                    }`}>
                      {client.stage}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contract Value */}
          <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5">
            <h3 className="text-sm font-semibold text-zinc-300 mb-4">Contract Value Tracker</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-zinc-500">Active Contracts</p>
                <p className="text-2xl font-bold text-zinc-100">60k PLN<span className="text-sm text-zinc-500">/yr</span></p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Pipeline Value</p>
                <p className="text-2xl font-bold text-zinc-100">78k PLN<span className="text-sm text-zinc-500">/yr</span></p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Total Potential</p>
                <p className="text-2xl font-bold text-emerald-400">138k PLN<span className="text-sm text-zinc-500">/yr</span></p>
              </div>
              <div className="pt-2 border-t border-zinc-800/40">
                <p className="text-xs text-zinc-500">Feature Adoption</p>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {["Safety", "Language", "Voice"].map(f => (
                    <div key={f} className="text-center">
                      <p className="text-sm font-bold text-zinc-200">100%</p>
                      <p className="text-[10px] text-zinc-500">{f}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ MODULES ═══════════════════════════ */}
      <section id="modules" className="mb-8">
        <h2 className="text-xs text-zinc-500 uppercase tracking-widest mb-4">
          Framework Modules ({MODULES.length}) &mdash; {MODULES.filter(m => m.status === 'ready').length} ready, {MODULES.filter(m => m.status === 'planned').length} planned
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {MODULES.map((mod) => (
            <div key={mod.name} className="rounded-lg border border-zinc-800/40 bg-zinc-900/30 px-4 py-3 hover:bg-zinc-900/50 transition-colors group">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <HealthDot health={mod.health} />
                  <span className="text-sm text-zinc-300 font-mono">{mod.name}</span>
                </div>
                <div className="flex gap-1.5">
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    mod.type === 'open' ? 'bg-blue-500/10 text-blue-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {mod.type}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    mod.status === 'ready' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-700/50 text-zinc-500'
                  }`}>
                    {mod.status}
                  </span>
                </div>
              </div>
              <p className="text-xs text-zinc-600 ml-4">{mod.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════ OPEN SOURCE ═══════════════════════════ */}
      <section id="opensource" className="mb-8">
        <h2 className="text-xs text-zinc-500 uppercase tracking-widest mb-4">Open Source Packages</h2>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {/* npm Downloads */}
          <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5">
            <h3 className="text-sm font-semibold text-zinc-300 mb-4">npm Downloads (weekly)</h3>
            <div className="space-y-3">
              {OPENSOURCE.map((pkg) => (
                <div key={pkg.pkg} className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400 font-mono">{pkg.pkg.replace('@silence/', '')}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-300 font-mono">{pkg.downloads}</span>
                    <span className="text-xs text-zinc-500">v{pkg.version}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GitHub Stats */}
          <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5">
            <h3 className="text-sm font-semibold text-zinc-300 mb-4">GitHub</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-zinc-500">Stars</p>
                <p className="text-2xl font-bold text-zinc-100">79</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Forks</p>
                <p className="text-2xl font-bold text-zinc-100">12</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Open Issues</p>
                <p className="text-2xl font-bold text-zinc-100">8</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Contributors</p>
                <p className="text-2xl font-bold text-zinc-100">3</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-2">Latest Releases</p>
              <div className="space-y-1">
                <p className="text-xs text-zinc-400"><span className="text-emerald-400">v5.0.0</span> — Full product buildout (Feb 2026)</p>
                <p className="text-xs text-zinc-400"><span className="text-zinc-500">v4.1.0</span> — PatternLens PWA launch</p>
                <p className="text-xs text-zinc-400"><span className="text-zinc-500">v4.0.0</span> — Monorepo migration</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5 mb-8">
        <h2 className="text-xs text-zinc-500 uppercase tracking-widest mb-4">Architecture</h2>
        <pre className="text-xs text-zinc-400 font-mono overflow-x-auto">{`SILENCE.OBJECTS/
\u251C\u2500\u2500 apps/
\u2502   \u251C\u2500\u2500 portal/          \u2192 Dashboard + Investor     [LIVE]
\u2502   \u251C\u2500\u2500 patternlens/     \u2192 Consumer PWA             [LIVE]
\u2502   \u2514\u2500\u2500 patternslab/     \u2192 B2B Institutional        [LIVE]
\u251C\u2500\u2500 packages/
\u2502   \u251C\u2500\u2500 contracts/       \u2192 TypeScript types          [OPEN]
\u2502   \u251C\u2500\u2500 events/          \u2192 Event bus                 [OPEN]
\u2502   \u251C\u2500\u2500 core/            \u2192 Pattern detection         [OPEN]
\u2502   \u251C\u2500\u2500 archetypes/      \u2192 12 Jungian archetypes    [OPEN]
\u2502   \u251C\u2500\u2500 voice/           \u2192 Voice input (Whisper)     [CLOSED]
\u2502   \u251C\u2500\u2500 safety/          \u2192 Crisis detection          [CLOSED]
\u2502   \u2514\u2500\u2500 ...15 total modules
\u251C\u2500\u2500 agents/sentinel/     \u2192 CI/CD Quality Gate
\u251C\u2500\u2500 docs/                \u2192 17 framework docs
\u2514\u2500\u2500 supabase/            \u2192 Migrations + schema`}</pre>
      </section>

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-zinc-800/40 text-center">
        <p className="text-xs text-zinc-600">SILENCE.OBJECTS v5.0 — Open Core Framework</p>
        <p className="text-xs text-zinc-700 mt-1">github.com/Patternslab-ecosystem/SILENCE.OBJECTS</p>
      </footer>
    </main>
  );
}
