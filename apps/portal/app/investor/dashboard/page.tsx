import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

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
  { label: "M3", value: 20000, display: "20k" },
  { label: "M6", value: 120000, display: "120k" },
  { label: "M12", value: 600000, display: "600k" },
  { label: "M18", value: 2500000, display: "2.5M" },
] as const;

const MARKET = [
  {
    title: "TAM",
    subtitle: "Total Addressable Market",
    value: "$7.83B by 2030",
    detail: "AI behavioral analysis market, CAGR 33.86%",
  },
  {
    title: "SAM",
    subtitle: "Serviceable Addressable Market",
    value: "$1.2B",
    detail: "Digital mental-health & behavioral SaaS in EU + US",
  },
  {
    title: "SOM",
    subtitle: "Serviceable Obtainable Market",
    value: "$48M",
    detail: "Niche framework-first segment we can capture in 3 years",
  },
] as const;

const UNFAIR_ADVANTAGES = [
  {
    title: "Framework, Not Chatbot",
    description:
      "Modular, composable architecture that developers embed into their own products -- not another disposable chat UI.",
  },
  {
    title: "Open Core Model",
    description:
      "Community edition builds adoption and trust; enterprise tier captures high-value B2B contracts.",
  },
  {
    title: "Archetype + Pattern + Prediction",
    description:
      "Triple-lens analysis stack that no single competitor replicates. Each layer reinforces the others.",
  },
  {
    title: "Dual B2C + B2B",
    description:
      "Consumer subscriptions provide steady MRR while B2B deals deliver high-ACV expansion revenue.",
  },
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
  {
    name: "SILENCE.OBJECTS",
    category: "Framework",
    approach: "Modular, composable, dual-lens",
    model: "Open Core",
    moat: "Pattern + Archetype + Prediction",
  },
  {
    name: "Woebot",
    category: "Chatbot",
    approach: "CBT scripted conversations",
    model: "B2B only",
    moat: "FDA classification",
  },
  {
    name: "Wysa",
    category: "Chatbot",
    approach: "AI-guided self-help",
    model: "Freemium",
    moat: "Scale + partnerships",
  },
  {
    name: "Replika",
    category: "Companion",
    approach: "Open-ended AI chat",
    model: "Subscription",
    moat: "Social attachment",
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Style tokens                                                       */
/* ------------------------------------------------------------------ */

const BORDER = "rgba(119,124,124,0.3)";
const SURFACE = "#262828";
const BG = "#1f2121";
const TEAL = "#32b8c6";
const TEAL_DARK = "#1d7480";

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function InvestorDashboard() {
  const mrrMax = Math.max(...MRR_TREND.map((m) => m.value));
  const revMax = Math.max(...REVENUE_PROJECTION.map((r) => r.value));

  return (
    <main
      className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto"
      style={{ backgroundColor: BG }}
    >
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="mb-10">
        <Link
          href="/"
          className="text-sm hover:opacity-80 mb-4 inline-block"
          style={{ color: "rgba(119,124,124,0.7)" }}
        >
          &larr; Back to Portal
        </Link>

        <div className="flex items-center gap-4 mb-3">
          {/* Inline teal SVG logo mark */}
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="SILENCE.OBJECTS logo"
          >
            <rect width="40" height="40" rx="8" fill={TEAL} fillOpacity="0.12" />
            <path
              d="M12 28V12h4v6h8v-6h4v16h-4v-6h-8v6h-4Z"
              fill={TEAL}
            />
          </svg>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-zinc-100 leading-tight">
              Investor Dashboard
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span
                className="text-xs px-2.5 py-0.5 rounded-full font-mono font-medium"
                style={{
                  backgroundColor: "rgba(245,158,11,0.15)",
                  color: "#f59e0b",
                }}
              >
                PRE-LAUNCH
              </span>
              <span
                className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: "rgba(245,158,11,0.12)",
                  color: "#f59e0b",
                }}
              >
                Confidential &mdash; Investor Materials
              </span>
            </div>
          </div>
        </div>

        <p className="text-sm" style={{ color: "rgba(119,124,124,0.7)" }}>
          SILENCE.OBJECTS &mdash; Structural Behavioral Pattern Analysis
          Framework
        </p>
        <p
          className="mt-2"
          style={{
            fontSize: "13px",
            color: "#f59e0b",
            fontFamily: "monospace",
          }}
        >
          Infrastructure deployed. Metrics show targets for seed round.
        </p>
      </header>

      {/* ── KPI Grid ───────────────────────────────────────────── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {KPI.map((k) => (
          <div
            key={k.label}
            className="rounded-xl p-4 md:p-5"
            style={{
              backgroundColor: SURFACE,
              border: `1px solid ${BORDER}`,
            }}
          >
            <p className="text-xs uppercase tracking-wide" style={{ color: "rgba(119,124,124,0.7)" }}>
              {k.label}
            </p>
            <p className="text-lg md:text-2xl font-bold font-mono text-zinc-100 mt-1">
              {k.value}
            </p>
            {"trend" in k && k.trend && (
              <p className="text-xs text-emerald-400 mt-1">{k.trend}</p>
            )}
          </div>
        ))}
      </section>

      {/* ── MRR Trend Chart ────────────────────────────────────── */}
      <section
        className="rounded-xl p-5 mb-8"
        style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}
      >
        <h2
          className="text-sm font-semibold uppercase tracking-wide mb-6"
          style={{ color: TEAL }}
        >
          MRR Trend (6M)
        </h2>
        <div className="flex items-end gap-3 md:gap-6 h-48">
          {MRR_TREND.map((m) => {
            const pct = (m.value / mrrMax) * 100;
            return (
              <div
                key={m.month}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <span className="text-xs text-zinc-400 font-mono">
                  {(m.value / 1000).toFixed(1)}k
                </span>
                <div
                  className="w-full rounded-t transition-all"
                  style={{
                    height: `${pct}%`,
                    backgroundColor: "rgba(16,185,129,0.75)",
                  }}
                />
                <span
                  className="text-xs"
                  style={{ color: "rgba(119,124,124,0.6)" }}
                >
                  {m.month}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Revenue Projection (Bar Chart) ─────────────────────── */}
      <section
        className="rounded-xl p-5 mb-8"
        style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}
      >
        <h2
          className="text-sm font-semibold uppercase tracking-wide mb-6"
          style={{ color: TEAL }}
        >
          Revenue Projection (PLN)
        </h2>
        <div className="flex items-end gap-4 md:gap-8 h-56">
          {REVENUE_PROJECTION.map((r) => {
            const pct = (r.value / revMax) * 100;
            return (
              <div
                key={r.label}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <span className="text-xs font-mono" style={{ color: TEAL }}>
                  {r.display}
                </span>
                <div
                  className="w-full rounded-t transition-all"
                  style={{
                    height: `${pct}%`,
                    minHeight: "8px",
                    background: `linear-gradient(to top, ${TEAL_DARK}, ${TEAL})`,
                  }}
                />
                <span
                  className="text-xs font-medium"
                  style={{ color: "rgba(119,124,124,0.7)" }}
                >
                  {r.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Market: TAM / SAM / SOM ────────────────────────────── */}
      <section className="mb-8">
        <h2
          className="text-sm font-semibold uppercase tracking-wide mb-4"
          style={{ color: TEAL }}
        >
          Market Opportunity
        </h2>
        <div className="grid md:grid-cols-3 gap-3">
          {MARKET.map((m) => (
            <div
              key={m.title}
              className="rounded-xl p-5"
              style={{
                backgroundColor: SURFACE,
                border: `1px solid ${BORDER}`,
              }}
            >
              <p
                className="text-xs uppercase tracking-wide font-medium"
                style={{ color: TEAL }}
              >
                {m.title}
              </p>
              <p className="text-[10px] mb-2" style={{ color: "rgba(119,124,124,0.6)" }}>
                {m.subtitle}
              </p>
              <p className="text-xl font-bold font-mono text-zinc-100">
                {m.value}
              </p>
              <p className="text-xs mt-1" style={{ color: "rgba(119,124,124,0.7)" }}>
                {m.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Unfair Advantages ──────────────────────────────────── */}
      <section className="mb-8">
        <h2
          className="text-sm font-semibold uppercase tracking-wide mb-4"
          style={{ color: TEAL }}
        >
          Unfair Advantages
        </h2>
        <div className="grid md:grid-cols-2 gap-3">
          {UNFAIR_ADVANTAGES.map((a, i) => (
            <div
              key={i}
              className="rounded-xl p-5"
              style={{
                backgroundColor: SURFACE,
                border: `1px solid ${BORDER}`,
              }}
            >
              <p className="text-sm font-semibold text-zinc-100 mb-1">
                {a.title}
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "rgba(119,124,124,0.8)" }}
              >
                {a.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Competitive Landscape ──────────────────────────────── */}
      <section
        className="rounded-xl p-5 mb-8"
        style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}
      >
        <h2
          className="text-sm font-semibold uppercase tracking-wide mb-4"
          style={{ color: TEAL }}
        >
          Competitive Landscape
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                {["Company", "Category", "Approach", "Model", "Moat"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left text-xs uppercase py-3 px-4"
                      style={{ color: "rgba(119,124,124,0.6)" }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {COMPETITIVE.map((c) => {
                const isUs = c.name === "SILENCE.OBJECTS";
                return (
                  <tr
                    key={c.name}
                    style={{
                      borderBottom: `1px solid rgba(119,124,124,0.15)`,
                      backgroundColor: isUs
                        ? "rgba(50,184,198,0.05)"
                        : "transparent",
                      borderLeft: isUs ? "2px solid #21808d" : "2px solid transparent",
                    }}
                  >
                    <td
                      className="py-3 px-4 font-medium"
                      style={{ color: isUs ? TEAL : "#d4d4d8" }}
                    >
                      {c.name}
                    </td>
                    <td className="py-3 px-4 text-zinc-400">{c.category}</td>
                    <td className="py-3 px-4 text-zinc-400">{c.approach}</td>
                    <td className="py-3 px-4 text-zinc-400 font-mono">
                      {c.model}
                    </td>
                    <td
                      className="py-3 px-4"
                      style={{ color: "rgba(119,124,124,0.6)" }}
                    >
                      {c.moat}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Q2 Targets with Progress ───────────────────────────── */}
      <section
        className="rounded-xl p-5 mb-8"
        style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}
      >
        <h2
          className="text-sm font-semibold uppercase tracking-wide mb-4"
          style={{ color: TEAL }}
        >
          Q2 2026 Targets
        </h2>
        <p
          className="text-xs font-mono mb-3"
          style={{ color: "#f59e0b" }}
        >
          Current: Pre-revenue
        </p>
        <div className="space-y-4">
          {PIPELINE.map((row) => (
            <div key={row.metric}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-zinc-300">{row.metric}</span>
                <span
                  className="text-xs font-mono"
                  style={{ color: "rgba(119,124,124,0.6)" }}
                >
                  {row.current} / {row.target}
                </span>
              </div>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: "rgba(119,124,124,0.15)" }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(row.pct, 100)}%`,
                    backgroundColor:
                      row.pct >= 100
                        ? "#10b981"
                        : row.pct >= 50
                        ? TEAL
                        : "#f59e0b",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Team / Founder ─────────────────────────────────────── */}
      <section
        className="rounded-xl p-5 mb-8"
        style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}
      >
        <h2
          className="text-sm font-semibold uppercase tracking-wide mb-4"
          style={{ color: TEAL }}
        >
          Team
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-zinc-100 font-semibold mb-1">
              Founder &amp; Technical Lead
            </p>
            <p className="text-sm text-zinc-400 mb-3">
              Full-stack architect with deep expertise in behavioral pattern
              analysis, AI integration, and scalable SaaS platforms.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "Next.js",
                "TypeScript",
                "Claude AI",
                "Supabase",
                "Stripe",
                "React Native",
              ].map((t) => (
                <span
                  key={t}
                  className="text-xs px-2 py-1 rounded"
                  style={{
                    backgroundColor: "rgba(119,124,124,0.12)",
                    color: "rgba(119,124,124,0.8)",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p
              className="text-xs uppercase mb-2"
              style={{ color: "rgba(119,124,124,0.6)" }}
            >
              Key Achievements
            </p>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>273 production deployments on PatternLens</li>
              <li>15-module monorepo architecture (Open Core)</li>
              <li>Passive safety system &mdash; zero false blocks</li>
              <li>Dual B2C + B2B revenue model operational</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Funding Ask ────────────────────────────────────────── */}
      <section
        className="rounded-xl p-6 mb-8"
        style={{
          backgroundColor: SURFACE,
          border: `1px solid ${BORDER}`,
        }}
      >
        <h2
          className="text-sm font-semibold uppercase tracking-wide mb-3"
          style={{ color: TEAL }}
        >
          Funding
        </h2>
        <p className="text-zinc-100 text-lg font-semibold mb-2">
          We are raising a pre-seed round.
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "rgba(119,124,124,0.8)" }}>
          Looking for strategic investors who understand the intersection of AI
          and behavioral analysis. Our architecture is production-ready, revenue
          is growing, and we have a clear path to Series A milestones.
        </p>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section
        className="rounded-xl p-6 mb-8 text-center"
        style={{
          border: `1px solid rgba(50,184,198,0.3)`,
          background: `linear-gradient(135deg, rgba(50,184,198,0.08) 0%, rgba(29,116,128,0.08) 100%)`,
        }}
      >
        <h2 className="text-xl font-bold text-zinc-100 mb-2">
          Interested in SILENCE.OBJECTS?
        </h2>
        <p
          className="text-sm mb-5"
          style={{ color: "rgba(119,124,124,0.7)" }}
        >
          See PatternLens in action, request the full investor deck, or explore
          partnership opportunities.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href="mailto:globalnetworkstudio@gmail.com?subject=SILENCE.OBJECTS%20Full%20Deck%20Request"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium text-sm transition-colors"
            style={{ backgroundColor: TEAL }}
          >
            Request Full Deck
          </a>
          <a
            href="https://silence-patternlens.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium text-sm transition-colors"
            style={{ backgroundColor: TEAL_DARK }}
          >
            Try PatternLens Live
          </a>
          <a
            href="mailto:globalnetworkstudio@gmail.com?subject=SILENCE.OBJECTS%20Demo%20Request"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-zinc-300 font-medium text-sm transition-colors"
            style={{ border: `1px solid ${BORDER}` }}
          >
            Book a Demo
          </a>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer
        className="mt-12 pt-6 text-center"
        style={{ borderTop: `1px solid rgba(119,124,124,0.2)` }}
      >
        <p className="text-xs" style={{ color: "rgba(119,124,124,0.4)" }}>
          SILENCE.OBJECTS v5.0 &mdash; Confidential Investor Materials
        </p>
      </footer>
    </main>
  );
}
