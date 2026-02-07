import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "active",
    org_id: "82569452",
    posts_this_week: 3,
    impressions: 12400,
    engagement_rate: 4.2,
    followers: 892,
    updated_at: new Date().toISOString(),
  });
}
