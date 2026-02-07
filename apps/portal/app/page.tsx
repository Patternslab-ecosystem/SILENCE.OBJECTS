import Link from "next/link";

const TABS = [
  { id: "overview", label: "Overview", href: "/", active: true },
  { id: "investor", label: "Investor", href: "/investor/dashboard" },
  { id: "patternlens", label: "PatternLens", href: "#" },
  { id: "patternslab", label: "PatternsLab", href: "#" },
  { id: "modules", label: "Modules", href: "#" },
  { id: "opensource", label: "Open Source", href: "#" },
] as const;

const METRICS = [
  { label: "ARR", value: "104,000 PLN", trend: "+23% QoQ", color: "text-zinc-100" },
  { label: "MRR", value: "8,667 PLN", trend: "+18% MoM", color: "text-zinc-100" },
  { label: "DAU", value: "342", trend: "+12% WoW", color: "text-zinc-100" },
  { label: "Churn", value: "2.1%", trend: "-0.3pp", color: "text-emerald-400" },
  { label: "LTV/CAC", value: "4.2x", color: "text-zinc-100" },
  { label: "Conversion", value: "12.8%", color: "text-zinc-100" },
  { label: "Runway", value: "18 months", color: "text-zinc-100" },
  { label: "NRR", value: "108%", color: "text-emerald-400" },
] as const;

const MODULES = [
  { name: "@silence/contracts", status: "ready", type: "open" },
  { name: "@silence/events", status: "ready", type: "open" },
  { name: "@silence/core", status: "ready", type: "open" },
  { name: "@silence/archetypes", status: "ready", type: "open" },
  { name: "@silence/ui", status: "ready", type: "open" },
  { name: "@silence/language", status: "ready", type: "open" },
  { name: "@silence/validator", status: "ready", type: "open" },
  { name: "@silence/symbolic", status: "planned", type: "open" },
  { name: "@silence/voice", status: "ready", type: "closed" },
  { name: "@silence/ai", status: "planned", type: "closed" },
  { name: "@silence/predictive", status: "planned", type: "closed" },
  { name: "@silence/safety", status: "ready", type: "closed" },
  { name: "@silence/medical", status: "planned", type: "closed" },
  { name: "@silence/legal", status: "planned", type: "closed" },
  { name: "@silence/linkedin-agent", status: "planned", type: "closed" },
] as const;

const APPS = [
  { name: "PatternLens", url: "patternlens.app", status: "live", desc: "Consumer PWA — structural pattern analysis" },
  { name: "PatternsLab", url: "patternslab.app", status: "planned", desc: "B2B institutional — multi-tenant SaaS" },
  { name: "Portal", url: "—", status: "live", desc: "Dashboard — KPI, investor view, module control" },
] as const;

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
      <nav className="flex flex-wrap gap-2 mb-8">
        {TABS.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className={'active' in tab && tab.active
              ? "px-4 py-2 rounded-lg bg-zinc-100 text-zinc-950 font-medium text-sm"
              : "px-4 py-2 rounded-lg bg-zinc-800/50 text-zinc-400 text-sm hover:bg-zinc-800 transition-colors"
            }
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      {/* KPI Grid */}
      <section className="mb-8">
        <h2 className="text-xs text-zinc-500 uppercase tracking-widest mb-4">Key Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {METRICS.map((m) => (
            <div key={m.label} className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4 md:p-5">
              <p className="text-xs text-zinc-500 uppercase tracking-wide">{m.label}</p>
              <p className={`text-xl md:text-2xl font-bold mt-1 ${m.color}`}>{m.value}</p>
              {'trend' in m && m.trend && (
                <p className="text-xs text-emerald-400 mt-1">{m.trend}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Apps */}
      <section className="mb-8">
        <h2 className="text-xs text-zinc-500 uppercase tracking-widest mb-4">Applications</h2>
        <div className="grid md:grid-cols-3 gap-3">
          {APPS.map((app) => (
            <div key={app.name} className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-zinc-100">{app.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  app.status === 'live'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-zinc-700/50 text-zinc-500'
                }`}>
                  {app.status}
                </span>
              </div>
              <p className="text-sm text-zinc-500 mb-2">{app.desc}</p>
              <p className="text-xs text-zinc-600 font-mono">{app.url}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Modules */}
      <section className="mb-8">
        <h2 className="text-xs text-zinc-500 uppercase tracking-widest mb-4">Framework Modules ({MODULES.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {MODULES.map((mod) => (
            <div key={mod.name} className="flex items-center justify-between rounded-lg border border-zinc-800/40 bg-zinc-900/30 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  mod.status === 'ready' ? 'bg-emerald-500' : 'bg-zinc-600'
                }`} />
                <span className="text-sm text-zinc-300 font-mono">{mod.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded ${
                  mod.type === 'open'
                    ? 'bg-blue-500/10 text-blue-400'
                    : 'bg-amber-500/10 text-amber-400'
                }`}>
                  {mod.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture */}
      <section className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5">
        <h2 className="text-xs text-zinc-500 uppercase tracking-widest mb-4">Architecture</h2>
        <pre className="text-xs text-zinc-400 font-mono overflow-x-auto">{`SILENCE.OBJECTS/
├── apps/
│   ├── portal/          → Dashboard + Investor     [LIVE]
│   ├── patternlens/     → Consumer PWA             [LIVE]
│   └── patternslab/     → B2B Institutional        [PLANNED]
├── packages/
│   ├── contracts/       → TypeScript types          [OPEN]
│   ├── events/          → Event bus                 [OPEN]
│   ├── core/            → Pattern detection         [OPEN]
│   ├── archetypes/      → 12 Jungian archetypes    [OPEN]
│   ├── voice/           → Voice input (Whisper)     [CLOSED]
│   ├── ai/              → Claude integration        [CLOSED]
│   ├── safety/          → Crisis detection          [CLOSED]
│   └── ...14 more modules
├── agents/              → Agent Army v2.0
├── docs/                → 17 framework docs
└── supabase/            → Migrations + schema`}</pre>
      </section>

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-zinc-800/40 text-center">
        <p className="text-xs text-zinc-600">SILENCE.OBJECTS v5.0 — Open Core Framework</p>
        <p className="text-xs text-zinc-700 mt-1">github.com/Patternslab-ecosystem/SILENCE.OBJECTS</p>
      </footer>
    </main>
  );
}
