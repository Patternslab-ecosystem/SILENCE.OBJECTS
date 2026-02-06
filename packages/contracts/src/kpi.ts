/** Currency codes used across PatternLabs */
export type Currency = "PLN" | "EUR" | "USD";

/** Raw KPI metrics from the data layer */
export interface KpiMetrics {
  arr: number;
  mrr: number;
  dau: number;
  churn: number;
  ltv_cac: number;
  conversion: number;
  runway_months: number;
  nrr: number;
  currency: Currency;
}

/** Display-ready KPI card */
export interface KpiCard {
  label: string;
  value: string;
  trend?: string;
  target?: string;
}

/** MRR trend data point */
export interface MrrTrendPoint {
  month: string;
  value: number;
}

/** Metrics table row for investor dashboard */
export interface MetricsTableRow {
  [key: string]: string;
  metric: string;
  current: string;
  target: string;
}
