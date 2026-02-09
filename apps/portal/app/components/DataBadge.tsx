"use client";

export type DataSource = "live" | "projections" | "coming-soon";

const styles: Record<DataSource, string> = {
  live: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  projections: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "coming-soon": "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

const labels: Record<DataSource, string> = {
  live: "\u25CF LIVE",
  projections: "\u25C9 PROJECTIONS",
  "coming-soon": "\u25CB COMING SOON",
};

export function DataBadge({ type }: { type: DataSource }) {
  return (
    <span
      className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${styles[type]}`}
    >
      {labels[type]}
    </span>
  );
}
