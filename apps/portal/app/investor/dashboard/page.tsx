import { Card, MetricCard, KpiGrid, Section, DataTable } from "@silence/ui";
import { INVESTOR_CARDS, MRR_TREND, METRICS_TABLE } from "@/lib/mock-data";

export default function InvestorDashboard() {
  const max = Math.max(...MRR_TREND.map((m) => m.value));

  return (
    <main className="min-h-screen bg-zinc-950 p-4 md:p-8">
      <header className="mb-8">
        <a href="/" className="text-zinc-500 text-sm hover:text-zinc-300 mb-2 inline-block">&larr; Back to Portal</a>
        <h1 className="text-2xl font-bold text-zinc-100">Investor Dashboard</h1>
        <p className="text-zinc-400 mt-1">PatternLabs — SILENCE.OBJECTS B2B SaaS</p>
      </header>

      <Section>
        <KpiGrid>
          {INVESTOR_CARDS.map((k) => (
            <MetricCard key={k.label} label={k.label} value={k.value} trend={k.trend} />
          ))}
        </KpiGrid>
      </Section>

      <Section title="MRR Trend (6M)">
        <Card>
          <div className="flex items-end gap-2 md:gap-4 h-48">
            {MRR_TREND.map((m) => {
              const pct = (m.value / max) * 100;
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs text-zinc-400">{(m.value / 1000).toFixed(1)}k</span>
                  <div className="w-full bg-emerald-500 rounded-t-md transition-all" style={{ height: `${pct}%` }} />
                  <span className="text-xs text-zinc-500">{m.month}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </Section>

      <Section title="Key Metrics">
        <Card>
          <DataTable
            columns={[
              { key: "metric", label: "Metric" },
              { key: "current", label: "Current" },
              { key: "target", label: "Target Q2" },
            ]}
            rows={METRICS_TABLE}
          />
        </Card>
      </Section>
    </main>
  );
}
