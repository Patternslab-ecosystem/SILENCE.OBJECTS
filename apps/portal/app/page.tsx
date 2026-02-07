import Link from "next/link";

const TABS = [
  { id: "overview", label: "Overview", href: "/", active: true },
  { id: "investor", label: "Investor", href: "/investor/dashboard" },
  { id: "patternlens", label: "PatternLens", href: "https://silence-patternlens.vercel.app" },
  { id: "modules", label: "Modules", href: "#modules" },
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
  { name: "@silence/contracts", status: "ready", type: "open", desc: "TypeScript types — single source of truth" },
  { name: "@silence/events", status: "ready", type: "open", desc: "Typed event bus" },
  { name: "@silence/core", status: "ready", type: "open", desc: "Pattern detection engine (4-phase protocol)" },
  { name: "@silence/archetypes", status: "ready", type: "open", desc: "12 Jungian behavioral pattern classification" },
  { name: "@silence/ui", status: "ready", type: "open", desc: "Design system — Tailwind 4 + dark mode" },
  { name: "@silence/language", status: "ready", type: "open", desc: "Forbidden vocabulary guardrails" },
  { name: "@silence/validator", status: "ready", type: "open", desc: "Contract & language audit" },
  { name: "@silence/symbolic", status: "planned", type: "open", desc: "Symbolic pattern analysis" },
  { name: "@silence/voice", status: "ready", type: "closed", desc: "Voice input — Whisper, media recorder, offline queue" },
  { name: "@silence/ai", status: "planned", type: "closed", desc: "Claude integration — dual-lens interpretation" },
  { name: "@silence/predictive", status: "planned", type: "closed", desc: "Predictive pattern modeling" },
  { name: "@silence/safety", status: "ready", type: "closed", desc: "3-layer crisis detection with resource mapping" },
  { name: "@silence/medical", status: "planned", type: "closed", desc: "Medical-grade pattern compliance" },
  { name: "@silence/legal", status: "planned", type: "closed", desc: "Legal compliance & data sovereignty" },
  { name: "@silence/linkedin-agent", status: "planned", type: "closed", desc: "LinkedIn growth automation" },
] as const;

const ARCHETYPES = [
  { name: "Creator", icon: "C", color: "bg-blue-500/20 text-blue-400", desc: "Expresses through making, building, and artistic transformation" },
  { name: "Ruler", icon: "R", color: "bg-amber-500/20 text-amber-400", desc: "Seeks control, structure, and systemic organization" },
  { name: "Caregiver", icon: "G", color: "bg-emerald-500/20 text-emerald-400", desc: "Moves through nurturing, protection, and sacrifice" },
  { name: "Explorer", icon: "E", color: "bg-cyan-500/20 text-cyan-400", desc: "Driven by freedom, discovery, and boundary-pushing" },
  { name: "Sage", icon: "S", color: "bg-violet-500/20 text-violet-400", desc: "Pursues understanding, analysis, and pattern recognition" },
  { name: "Hero", icon: "H", color: "bg-red-500/20 text-red-400", desc: "Confronts challenges through courage and mastery" },
  { name: "Rebel", icon: "B", color: "bg-orange-500/20 text-orange-400", desc: "Disrupts, transforms, and challenges the status quo" },
  { name: "Magician", icon: "M", color: "bg-purple-500/20 text-purple-400", desc: "Transforms reality through vision and catalytic action" },
  { name: "Lover", icon: "L", color: "bg-pink-500/20 text-pink-400", desc: "Seeks connection, beauty, and passionate engagement" },
  { name: "Jester", icon: "J", color: "bg-yellow-500/20 text-yellow-400", desc: "Uses humor, play, and reframing to navigate tension" },
  { name: "Innocent", icon: "I", color: "bg-sky-500/20 text-sky-400", desc: "Moves through trust, optimism, and simplicity-seeking" },
  { name: "Orphan", icon: "O", color: "bg-zinc-500/20 text-zinc-400", desc: "Navigates through resilience, belonging, and solidarity" },
] as const;

const APPS = [
  { name: "PatternLens", url: "silence-patternlens.vercel.app", status: "live", desc: "Consumer PWA — structural pattern analysis with dual-lens interpretation" },
  { name: "PatternsLab", url: "patternslab.app", status: "planned", desc: "B2B institutional — multi-tenant SaaS for organizations" },
  { name: "Portal", url: "silence-portal.vercel.app", status: "live", desc: "Dashboard — KPI, investor view, module control" },
] as const;

const GROWTH = [
  { label: "Users (Free)", values: [120, 245, 420, 608], months: ["Nov", "Dec", "Jan", "Feb"] },
  { label: "Users (Pro)", values: [22, 41, 67, 89], months: ["Nov", "Dec", "Jan", "Feb"] },
  { label: "Retention (30d)", values: [68, 72, 78, 82], months: ["Nov", "Dec", "Jan", "Feb"], suffix: "%" },
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
        {TABS.map((tab) => {
          const isExternal = tab.href.startsWith("http");
          return (
            <Link
              key={tab.id}
              href={tab.href}
              {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className={'active' in tab && tab.active
                ? "px-4 py-2 rounded-lg bg-zinc-100 text-zinc-950 font-medium text-sm"
                : "px-4 py-2 rounded-lg bg-zinc-800/50 text-zinc-400 text-sm hover:bg-zinc-800 transition-colors"
              }
            >
              {tab.label}{isExternal ? " \u2197" : ""}
            </Link>
          );
        })}
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

      {/* Applications with LIVE links */}
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
              <p className="text-sm text-zinc-500 mb-3">{app.desc}</p>
              {app.status === 'live' ? (
                <a
                  href={`https://${app.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-mono transition-colors"
                >
                  {app.url} <span className="text-[10px]">\u2197</span>
                </a>
              ) : (
                <p className="text-xs text-zinc-600 font-mono">{app.url}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Growth Charts */}
      <section className="mb-8">
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
                          className="w-full rounded-t bg-blue-500/60 transition-all"
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
      </section>

      {/* Archetype Explorer */}
      <section className="mb-8">
        <h2 className="text-xs text-zinc-500 uppercase tracking-widest mb-4">12 Archetypes</h2>
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
      </section>

      {/* Modules */}
      <section id="modules" className="mb-8">
        <h2 className="text-xs text-zinc-500 uppercase tracking-widest mb-4">
          Framework Modules ({MODULES.length}) &mdash; {MODULES.filter(m => m.status === 'ready').length} ready, {MODULES.filter(m => m.status === 'planned').length} planned
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {MODULES.map((mod) => (
            <div key={mod.name} className="rounded-lg border border-zinc-800/40 bg-zinc-900/30 px-4 py-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    mod.status === 'ready' ? 'bg-emerald-500' : 'bg-zinc-600'
                  }`} />
                  <span className="text-sm text-zinc-300 font-mono">{mod.name}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  mod.type === 'open'
                    ? 'bg-blue-500/10 text-blue-400'
                    : 'bg-amber-500/10 text-amber-400'
                }`}>
                  {mod.type}
                </span>
              </div>
              <p className="text-xs text-zinc-600 ml-4">{mod.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture */}
      <section className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5">
        <h2 className="text-xs text-zinc-500 uppercase tracking-widest mb-4">Architecture</h2>
        <pre className="text-xs text-zinc-400 font-mono overflow-x-auto">{`SILENCE.OBJECTS/
\u251C\u2500\u2500 apps/
\u2502   \u251C\u2500\u2500 portal/          \u2192 Dashboard + Investor     [LIVE]
\u2502   \u251C\u2500\u2500 patternlens/     \u2192 Consumer PWA             [LIVE]
\u2502   \u2514\u2500\u2500 patternslab/     \u2192 B2B Institutional        [PLANNED]
\u251C\u2500\u2500 packages/
\u2502   \u251C\u2500\u2500 contracts/       \u2192 TypeScript types          [OPEN]
\u2502   \u251C\u2500\u2500 events/          \u2192 Event bus                 [OPEN]
\u2502   \u251C\u2500\u2500 core/            \u2192 Pattern detection         [OPEN]
\u2502   \u251C\u2500\u2500 archetypes/      \u2192 12 Jungian archetypes    [OPEN]
\u2502   \u251C\u2500\u2500 voice/           \u2192 Voice input (Whisper)     [CLOSED]
\u2502   \u251C\u2500\u2500 safety/          \u2192 Crisis detection          [CLOSED]
\u2502   \u2514\u2500\u2500 ...15 total modules
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
