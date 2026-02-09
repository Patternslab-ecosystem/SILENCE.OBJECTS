import { NextResponse } from "next/server";
import { createAdminClient } from "../../../lib/supabase-server";

// Fallback mock for when Supabase is not configured
const MOCK_KPI = {
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
};

export async function GET() {
  const supabase = createAdminClient();

  // If Supabase not configured → return mock with source markers
  if (!supabase) {
    return NextResponse.json({
      live: null,
      mock: MOCK_KPI,
      source: "mock",
      updated_at: new Date().toISOString(),
    });
  }

  try {
    // Run all queries in parallel
    const [
      profilesCount,
      objectsCount,
      patternsCount,
      voiceDumps,
      crisisEvents,
      avgConfidence,
      voiceObjects,
      completedObjects,
      totalObjectsForRate,
      tierDistribution,
      riskDistribution,
      inputSourceSplit,
      objectsByDay,
      patternsByDay,
      archetypeDistribution,
      recentObjects,
    ] = await Promise.all([
      // Total users
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      // Total objects
      supabase.from("objects").select("*", { count: "exact", head: true }),
      // Total patterns
      supabase.from("patterns").select("*", { count: "exact", head: true }),
      // Voice dumps count
      supabase.from("voice_dumps").select("*", { count: "exact", head: true }),
      // Crisis events count
      supabase
        .from("nuclear_events")
        .select("*", { count: "exact", head: true }),
      // Avg confidence
      supabase.from("interpretations").select("confidence"),
      // Voice objects
      supabase
        .from("objects")
        .select("*", { count: "exact", head: true })
        .eq("input_source", "voice"),
      // Completed objects
      supabase
        .from("objects")
        .select("*", { count: "exact", head: true })
        .eq("processing_status", "completed"),
      // Total objects for rate
      supabase.from("objects").select("*", { count: "exact", head: true }),
      // Tier distribution (PRO vs FREE)
      supabase.from("profiles").select("tier"),
      // Risk level distribution
      supabase.from("objects").select("risk_level"),
      // Input source split
      supabase.from("objects").select("input_source"),
      // Objects by day (last 30 days)
      supabase
        .from("objects")
        .select("created_at")
        .gte(
          "created_at",
          new Date(Date.now() - 30 * 86400000).toISOString()
        )
        .order("created_at", { ascending: true }),
      // Patterns by day (last 30 days)
      supabase
        .from("patterns")
        .select("created_at")
        .gte(
          "created_at",
          new Date(Date.now() - 30 * 86400000).toISOString()
        )
        .order("created_at", { ascending: true }),
      // Archetype distribution
      supabase.from("patterns").select("pattern_name"),
      // Recent objects
      supabase
        .from("objects")
        .select("id, input_text, input_source, risk_level, processing_status, created_at")
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    // Compute avg confidence
    const confidences = avgConfidence.data ?? [];
    const avgConf =
      confidences.length > 0
        ? confidences.reduce(
            (sum: number, r: { confidence: number }) =>
              sum + (r.confidence ?? 0),
            0
          ) / confidences.length
        : 0;

    // Compute completed rate
    const totalObj = totalObjectsForRate.count ?? 0;
    const completedCount = completedObjects.count ?? 0;
    const completedRate =
      totalObj > 0 ? (completedCount / totalObj) * 100 : 0;

    // Aggregate tier distribution
    const tiers = (tierDistribution.data ?? []).reduce(
      (acc: Record<string, number>, r: { tier: string }) => {
        acc[r.tier] = (acc[r.tier] ?? 0) + 1;
        return acc;
      },
      {}
    );

    // Aggregate risk levels
    const risks = (riskDistribution.data ?? []).reduce(
      (acc: Record<string, number>, r: { risk_level: string }) => {
        acc[r.risk_level] = (acc[r.risk_level] ?? 0) + 1;
        return acc;
      },
      {}
    );

    // Aggregate input sources
    const sources = (inputSourceSplit.data ?? []).reduce(
      (acc: Record<string, number>, r: { input_source: string }) => {
        acc[r.input_source] = (acc[r.input_source] ?? 0) + 1;
        return acc;
      },
      {}
    );

    // Aggregate objects by day
    const objByDay = aggregateByDay(objectsByDay.data ?? []);

    // Aggregate patterns by day
    const patByDay = aggregateByDay(patternsByDay.data ?? []);

    // Aggregate archetype distribution
    const archetypes = (archetypeDistribution.data ?? []).reduce(
      (acc: Record<string, number>, r: { pattern_name: string }) => {
        acc[r.pattern_name] = (acc[r.pattern_name] ?? 0) + 1;
        return acc;
      },
      {}
    );
    const archetypeList = Object.entries(archetypes)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);

    return NextResponse.json({
      live: {
        totalUsers: profilesCount.count ?? 0,
        totalObjects: objectsCount.count ?? 0,
        totalPatterns: patternsCount.count ?? 0,
        voiceObjects: voiceObjects.count ?? 0,
        voiceDumps: voiceDumps.count ?? 0,
        crisisEvents: crisisEvents.count ?? 0,
        avgConfidence: Math.round(avgConf * 100) / 100,
        completedRate: Math.round(completedRate * 10) / 10,
        freeUsers: tiers["FREE"] ?? 0,
        proUsers: tiers["PRO"] ?? 0,
        enterpriseUsers: tiers["ENTERPRISE"] ?? 0,
        riskDistribution: risks,
        inputSourceSplit: sources,
        objectsByDay: objByDay,
        patternsByDay: patByDay,
        archetypeDistribution: archetypeList,
        recentObjects: recentObjects.data ?? [],
      },
      mock: MOCK_KPI,
      source: "live",
      updated_at: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      {
        live: null,
        mock: MOCK_KPI,
        source: "error",
        updated_at: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

function aggregateByDay(
  rows: { created_at: string }[]
): { day: string; count: number }[] {
  const map: Record<string, number> = {};
  for (const r of rows) {
    const day = r.created_at?.slice(0, 10);
    if (day) map[day] = (map[day] ?? 0) + 1;
  }
  return Object.entries(map)
    .map(([day, count]) => ({ day, count }))
    .sort((a, b) => a.day.localeCompare(b.day));
}
