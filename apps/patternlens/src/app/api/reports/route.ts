import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { inputText, lensA, lensB, selectedLens, riskLevel } = body;

  
    // Columns match 001_patternlens.sql (no risk_level on objects table)
    const { data: report, error: reportError } = await supabase
      .from("objects")
      .insert({
        user_id: user.id,
        input_text: inputText,
        selected_lens: selectedLens,
      })
      .select()
      .single();

    if (reportError) {
      console.error("Report insert error:", reportError);
      return NextResponse.json({ error: "Failed to save report" }, { status: 500 });
    }

    // Insert interpretations with JSONB phase fields
    const interpretations = [
      {
        object_id: report.id,
        lens: "A",
        phase_1_context: { summary: lensA.context },
        phase_2_tension: { summary: lensA.tension },
        phase_3_meaning: { summary: lensA.meaning },
        phase_4_function: { summary: lensA.function },
        confidence_score: lensA.confidence
      },
      {
        object_id: report.id,
        lens: "B",
        phase_1_context: { summary: lensB.context },
        phase_2_tension: { summary: lensB.tension },
        phase_3_meaning: { summary: lensB.meaning },
        phase_4_function: { summary: lensB.function },
        confidence_score: lensB.confidence
      },
    ];

    const { error: interpError } = await supabase
      .from("interpretations")
      .insert(interpretations);

    if (interpError) {
      console.error("Interpretations insert error:", interpError);
    }

    // Increment object count
    await supabase.rpc("increment_object_count", { p_user_id: user.id });

    return NextResponse.json({ success: true, reportId: report.id });

  } catch (error) {
    console.error("Reports API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Columns match 001_patternlens.sql (no risk_level on objects table)
    const { data: reports, error } = await supabase
      .from("objects")
      .select("id, input_text, selected_lens, detected_theme, created_at")
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
    }

    return NextResponse.json(reports);

  } catch (error) {
    console.error("Reports GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
