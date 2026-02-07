import Link from "next/link";

const KPI = [
  { label: "ARR", value: "104,000 PLN", trend: "+23% QoQ" },
  { label: "MRR", value: "8,667 PLN", trend: "+18% MoM" },
  { label: "DAU", value: "342", trend: "+12% WoW" },
  { label: "Churn Rate", value: "2.1%", trend: "-0.3pp" },
  { label: "LTV/CAC", value: "4.2x" },
  { label: "Conversion", value: "12.8%" },
  { label: "Runway", value: "18 months" },
  { label: "NRR", value: "108%" },
] as const;

const MRR_TREND = [
  { month: "Sep", value: 4200 },
  { month: "Oct", value: 5100 },
  { month: "Nov", value: 6300 },
  { month: "Dec", value: 7100 },
  { month: "Jan", value: 8200 },
  { month: "Feb", value: 8667 },
] as const;

const REVENUE_PROJECTION = [
  { month: "Month 3", mrr: "12,000 PLN", users: 180, arr: "144k PLN" },
  { month: "Month 6", mrr: "25,000 PLN", users: 350, arr: "300k PLN" },
  { month: "Month 12", mrr: "65,000 PLN", users: 800, arr: "780k PLN" },
  { month: "Month 18", mrr: "120,000 PLN", users: 1500, arr: "1.44M PLN" },
] as const;

const PIPELINE = [
  { metric: "ARR", current: "104k PLN", target: "150k PLN", pct: 69 },
  { metric: "Paying Users", current: "89", target: "150", pct: 59 },
  { metric: "Free Users", current: "608", target: "1,000", pct: 61 },
  { metric: "Churn", current: "2.1%", target: "<3%", pct: 100 },
  { metric: "LTV/CAC", current: "4.2x", target: ">3x", pct: 100 },
  { metric: "B2B Clients", current: "2", target: "5", pct: 40 },
] as const;

const COMPETITIVE = [
  { name: "SILENCE.OBJECTS", category: "Framework", approach: "Modular, composable, dual-lens", model: "Open Core", moat: "Pattern + Archetype + Prediction" },
  { name: "Woebot", category: "Chatbot", approach: "CBT scripted conversations", model: "B2B only", moat: "FDA classification" },
  { name: "Wysa", category: "Chatbot", approach: "AI-guided self-help", model: "Freemium", moat: "Scale + partnerships" },
  { name: "Replika", category: "Companion", approach: "Open-ended AI chat", model: "Subscription", moat: "Social attachment" },
] as const;

export default function InvestorDashboard() {
  const mrrMax = Math.max(...MRR_TREND.map((m) => m.value));

  return (
    <main className="min-h-screen bg-zinc-950 p-4 md:p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <Link href="/" className="text-zinc-500 text-sm hover:text-zinc-300 mb-2 inline-block">&larr; Back to Portal</Link>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-zinc-100">Investor Dashboard</h1>
          <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono">LIVE</span>
        </div>
        <p className="text-zinc-500 text-sm">SILENCE.OBJECTS — Structural Behavioral Pattern Analysis Framework</p>
      </header>

      {/* KPI Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {KPI.map((k) => (
          <div key={k.label} className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4 md:p-5">
            <p className="text-xs text-zinc-500 uppercase tracking-wide">{k.label}</p>
            <p className="text-lg md:text-2xl font-bold text-zinc-100 mt-1">{k.value}</p>
            {"trend" in k && k.trend && <p className="text-xs text-emerald-400 mt-1">{k.trend}</p>}
          </div>
        ))}
      </section>

      {/* MRR Chart */}
      <section className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5 mb-8">
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide mb-6">MRR Trend (6M)</h2>
        <div className="flex items-end gap-3 md:gap-6 h-48">
          {MRR_TREND.map((m) => {
            const pct = (m.value / mrrMax) * 100;
            return (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-zinc-400 font-mono">{(m.value / 1000).toFixed(1)}k</span>
                <div className="w-full rounded-t transition-all bg-emerald-500/80" style={{ height: pct + "%" }} />
                <span className="text-xs text-zinc-500">{m.month}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Revenue Projection */}
      <section className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5 mb-8">
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide mb-4">Revenue Projection</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left text-xs text-zinc-500 uppercase py-3 px-4">Timeline</th>
                <th className="text-left text-xs text-zinc-500 uppercase py-3 px-4">MRR</th>
                <th className="text-left text-xs text-zinc-500 uppercase py-3 px-4">Paying Users</th>
                <th className="text-left text-xs text-zinc-500 uppercase py-3 px-4">ARR</th>
              </tr>
            </thead>
            <tbody>
              {REVENUE_PROJECTION.map((row) => (
                <tr key={row.month} className="border-b border-zinc-800/30">
                  <td className="py-3 px-4 text-zinc-300 font-medium">{row.month}</td>
                  <td className="py-3 px-4 text-zinc-100 font-mono">{row.mrr}</td>
                  <td className="py-3 px-4 text-zinc-100 font-mono">{row.users}</td>
                  <td className="py-3 px-4 text-emerald-400 font-mono font-semibold">{row.arr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Q2 Targets with Progress */}
      <section className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5 mb-8">
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide mb-4">Q2 2026 Targets</h2>
        <div className="space-y-4">
          {PIPELINE.map((row) => (
            <div key={row.metric}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-zinc-300">{row.metric}</span>
                <span className="text-xs text-zinc-500 font-mono">{row.current} / {row.target}</span>
              </div>
              <div className="h-2 rounded-full bg-zinc-800/60 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    row.pct >= 100 ? 'bg-emerald-500' : row.pct >= 50 ? 'bg-blue-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.min(row.pct, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Competitive Landscape */}
      <section className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5 mb-8">
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide mb-4">Competitive Landscape</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left text-xs text-zinc-500 uppercase py-3 px-4">Company</th>
                <th className="text-left text-xs text-zinc-500 uppercase py-3 px-4">Category</th>
                <th className="text-left text-xs text-zinc-500 uppercase py-3 px-4">Approach</th>
                <th className="text-left text-xs text-zinc-500 uppercase py-3 px-4">Model</th>
                <th className="text-left text-xs text-zinc-500 uppercase py-3 px-4">Moat</th>
              </tr>
            </thead>
            <tbody>
              {COMPETITIVE.map((c) => (
                <tr key={c.name} className={`border-b border-zinc-800/30 ${c.name === 'SILENCE.OBJECTS' ? 'bg-blue-500/5' : ''}`}>
                  <td className={`py-3 px-4 font-medium ${c.name === 'SILENCE.OBJECTS' ? 'text-blue-400' : 'text-zinc-300'}`}>{c.name}</td>
                  <td className="py-3 px-4 text-zinc-400">{c.category}</td>
                  <td className="py-3 px-4 text-zinc-400">{c.approach}</td>
                  <td className="py-3 px-4 text-zinc-400 font-mono">{c.model}</td>
                  <td className="py-3 px-4 text-zinc-500">{c.moat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Team / Founder */}
      <section className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5 mb-8">
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide mb-4">Team</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-zinc-100 font-semibold mb-1">Founder & Technical Lead</p>
            <p className="text-sm text-zinc-400 mb-3">Full-stack architect with deep expertise in behavioral pattern analysis, AI integration, and scalable SaaS platforms.</p>
            <div className="flex flex-wrap gap-2">
              {["Next.js", "TypeScript", "Claude AI", "Supabase", "Stripe", "React Native"].map(t => (
                <span key={t} className="text-xs px-2 py-1 rounded bg-zinc-800/60 text-zinc-400">{t}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-zinc-500 text-xs uppercase mb-2">Key Achievements</p>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>273 production deployments on PatternLens</li>
              <li>15-module monorepo architecture (Open Core)</li>
              <li>Passive safety system — zero false blocks</li>
              <li>Dual B2C + B2B revenue model operational</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Market */}
      <section className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5 mb-8">
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide mb-4">Market Position</h2>
        <div className="grid md:grid-cols-2 gap-6 text-sm text-zinc-400">
          <div>
            <p className="text-zinc-500 text-xs uppercase mb-2">TAM</p>
            <p className="text-zinc-100 text-lg font-bold">$7.83B by 2030</p>
            <p className="mt-1">AI behavioral analysis market, CAGR 33.86%</p>
          </div>
          <div>
            <p className="text-zinc-500 text-xs uppercase mb-2">Unfair Advantage</p>
            <ul className="space-y-1 text-zinc-400">
              <li>Framework (not chatbot) — modular, composable</li>
              <li>Open Core model — community + enterprise</li>
              <li>Archetype + Pattern + Prediction combo</li>
              <li>Dual B2C + B2B revenue streams</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Book a Demo CTA */}
      <section className="rounded-xl border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6 mb-8 text-center">
        <h2 className="text-xl font-bold text-zinc-100 mb-2">Interested in SILENCE.OBJECTS?</h2>
        <p className="text-sm text-zinc-400 mb-4">See PatternLens in action and explore partnership opportunities.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href="https://silence-patternlens.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors"
          >
            Try PatternLens Live
          </a>
          <a
            href="mailto:globalnetworkstudio@gmail.com?subject=SILENCE.OBJECTS%20Demo%20Request"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-zinc-700 hover:border-zinc-500 text-zinc-300 font-medium text-sm transition-colors"
          >
            Book a Demo
          </a>
        </div>
      </section>

      <footer className="mt-12 pt-6 border-t border-zinc-800/40 text-center">
        <p className="text-xs text-zinc-600">SILENCE.OBJECTS v5.0 — Confidential Investor Materials</p>
      </footer>
    </main>
  );
}
