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

const PIPELINE = [
  { metric: "ARR", current: "104k PLN", target: "150k PLN" },
  { metric: "Paying Users", current: "89", target: "150" },
  { metric: "Free Users", current: "608", target: "1,000" },
  { metric: "Churn", current: "2.1%", target: "<3%" },
  { metric: "LTV/CAC", current: "4.2x", target: ">3x" },
  { metric: "B2B Clients", current: "2", target: "5" },
] as const;

export default function InvestorDashboard() {
  const max = Math.max(...MRR_TREND.map((m) => m.value));

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
            const pct = (m.value / max) * 100;
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

      {/* Targets Table */}
      <section className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5 mb-8">
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide mb-4">Q2 2026 Targets</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left text-xs text-zinc-500 uppercase py-3 px-4">Metric</th>
                <th className="text-left text-xs text-zinc-500 uppercase py-3 px-4">Current</th>
                <th className="text-left text-xs text-zinc-500 uppercase py-3 px-4">Target</th>
              </tr>
            </thead>
            <tbody>
              {PIPELINE.map((row) => (
                <tr key={row.metric} className="border-b border-zinc-800/30">
                  <td className="py-3 px-4 text-zinc-300">{row.metric}</td>
                  <td className="py-3 px-4 text-zinc-100 font-mono">{row.current}</td>
                  <td className="py-3 px-4 text-zinc-500 font-mono">{row.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Market */}
      <section className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5">
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide mb-4">Market Position</h2>
        <div className="grid md:grid-cols-2 gap-6 text-sm text-zinc-400">
          <div>
            <p className="text-zinc-500 text-xs uppercase mb-2">TAM</p>
            <p className="text-zinc-100 text-lg font-bold">$7.83B by 2030</p>
            <p className="mt-1">AI mental health market, CAGR 33.86%</p>
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

      <footer className="mt-12 pt-6 border-t border-zinc-800/40 text-center">
        <p className="text-xs text-zinc-600">SILENCE.OBJECTS v5.0 — Confidential Investor Materials</p>
      </footer>
    </main>
  );
}
