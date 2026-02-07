export function MetricCard({ label, value, trend, className = '' }: {
  label: string;
  value: string;
  trend?: string;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-zinc-800 bg-zinc-900 p-5 ${className}`}>
      <p className="text-xs text-zinc-500 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-zinc-100 mt-1">{value}</p>
      {trend && <p className="text-xs text-emerald-400 mt-1">{trend}</p>}
    </div>
  );
}
