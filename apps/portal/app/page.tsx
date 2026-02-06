import Link from "next/link";
import { Card } from "@silence/ui";
import { PORTAL_TABS, DASHBOARD_CARDS } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-zinc-950 p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100">PatternLabs Portal</h1>
        <p className="text-zinc-400 mt-1">SILENCE.OBJECTS — Management Dashboard</p>
      </header>
      <nav className="flex flex-wrap gap-2 mb-8">
        {PORTAL_TABS.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className={tab.active
              ? "px-4 py-2 rounded-lg bg-zinc-100 text-zinc-950 font-medium text-sm"
              : "px-4 py-2 rounded-lg bg-zinc-800 text-zinc-400 text-sm hover:bg-zinc-700"
            }
          >
            {tab.label}
          </Link>
        ))}
      </nav>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {DASHBOARD_CARDS.map((card) => (
          <Card key={card.label}>
            <p className="text-xs text-zinc-500 uppercase tracking-wide">{card.label}</p>
            <p className={`text-2xl font-bold mt-1 ${card.label === "Churn" ? "text-emerald-400" : "text-zinc-100"}`}>
              {card.value}
            </p>
          </Card>
        ))}
      </div>
    </main>
  );
}
