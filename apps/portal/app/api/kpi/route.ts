import { NextResponse } from "next/server";

const KPI_DATA = {
  arr: 104000,
  mrr: 8667,
  dau: 342,
  mau: 2840,
  churn: 2.1,
  ltv_cac: 4.2,
  conversion: 12.8,
  runway_months: 18,
  nrr: 108,
  paying_users: 89,
  free_users: 608,
  b2b_clients: 2,
  currency: "PLN",
  updated_at: new Date().toISOString(),
};

export async function GET() {
  return NextResponse.json(KPI_DATA);
}
