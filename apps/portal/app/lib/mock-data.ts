import type { KpiMetrics, KpiCard, MrrTrendPoint, MetricsTableRow, PortalTab } from "@silence/contracts";

/** Raw KPI metrics — single source of truth for all mock data */
export const MOCK_KPI: KpiMetrics = {
  arr: 104000,
  mrr: 8667,
  dau: 342,
  churn: 2.1,
  ltv_cac: 4.2,
  conversion: 12.8,
  runway_months: 18,
  nrr: 108,
  currency: "PLN",
};

/** Portal navigation tabs */
export const PORTAL_TABS: PortalTab[] = [
  { id: "investor", label: "Investor", href: "/investor/dashboard", active: true },
  { id: "patternlens", label: "PatternLens", href: "#", active: false },
  { id: "patternslab", label: "PatternsLab", href: "#", active: false },
  { id: "opensource", label: "Open Source", href: "#", active: false },
  { id: "admin", label: "Admin", href: "#", active: false },
];

/** Dashboard KPI summary cards */
export const DASHBOARD_CARDS: KpiCard[] = [
  { label: "ARR", value: `${MOCK_KPI.arr.toLocaleString("pl-PL")} ${MOCK_KPI.currency}` },
  { label: "MRR", value: `${MOCK_KPI.mrr.toLocaleString("pl-PL")} ${MOCK_KPI.currency}` },
  { label: "Churn", value: `${MOCK_KPI.churn}%` },
  { label: "Runway", value: `${MOCK_KPI.runway_months} months` },
];

/** Investor dashboard KPI cards with trends */
export const INVESTOR_CARDS: KpiCard[] = [
  { label: "ARR", value: `${MOCK_KPI.arr.toLocaleString("pl-PL")} ${MOCK_KPI.currency}`, trend: "+23% QoQ" },
  { label: "MRR", value: `${MOCK_KPI.mrr.toLocaleString("pl-PL")} ${MOCK_KPI.currency}`, trend: "+18% MoM" },
  { label: "DAU", value: `${MOCK_KPI.dau}`, trend: "+12% WoW" },
  { label: "Churn Rate", value: `${MOCK_KPI.churn}%`, trend: "-0.3pp" },
  { label: "LTV/CAC", value: `${MOCK_KPI.ltv_cac}x` },
  { label: "Conversion", value: `${MOCK_KPI.conversion}%` },
  { label: "Runway", value: `${MOCK_KPI.runway_months} months` },
  { label: "NRR", value: `${MOCK_KPI.nrr}%` },
];

/** MRR trend for the bar chart */
export const MRR_TREND: MrrTrendPoint[] = [
  { month: "Sep", value: 4200 },
  { month: "Oct", value: 5100 },
  { month: "Nov", value: 6300 },
  { month: "Dec", value: 7100 },
  { month: "Jan", value: 8200 },
  { month: "Feb", value: 8667 },
];

/** Key metrics table rows */
export const METRICS_TABLE: MetricsTableRow[] = [
  { metric: "ARR", current: "104k PLN", target: "150k PLN" },
  { metric: "Paying Users", current: "89", target: "150" },
  { metric: "Free Users", current: "608", target: "1,000" },
  { metric: "Churn", current: "2.1%", target: "<3%" },
  { metric: "LTV/CAC", current: "4.2x", target: ">3x" },
];
