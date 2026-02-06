import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    connected: false,
    message: "LinkedIn integration stub — connect via OAuth to activate",
  });
}
