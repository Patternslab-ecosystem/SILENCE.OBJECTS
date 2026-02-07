// ===========================================
// SILENCE.OBJECTS - Interpret API (v5.0 PASSIVE)
// ===========================================
// POST /api/interpret - Generate dual-lens structural interpretation
// This is the PREVIEW endpoint (doesn't save to database)
// Use POST /api/objects for full Object creation
//
// Safety profile: PASSIVE (INFORMED_ADULT_TOOL)
// - Hard keyword match only (no Claude risk assessment)
// - Never blocks input
// - Shows resources banner when keywords detected

import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest, canCreateObject, checkRateLimit } from "@/lib/auth/session";
import { validateObjectInput } from "@/lib/validation/object-validation";
import { detectCrisis } from "@/lib/safety";
import { claudeService } from "@/lib/ai/claude-integration";
import type { InterpretErrorResponse } from "@/types/domain";

// ===========================================
// RATE LIMIT CONFIG
// ===========================================

const RATE_LIMIT = {
  FREE: { requests: 10, windowMs: 60000 }, // 10 req/min
  PRO: { requests: 30, windowMs: 60000 }, // 30 req/min
};

// ===========================================
// POST /api/interpret
// ===========================================

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // ===========================================
    // STAGE 1: Authentication
    // ===========================================

    const authResult = await authenticateRequest();
    if (!authResult.authenticated) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          code: authResult.code,
        } as InterpretErrorResponse,
        { status: 401 }
      );
    }

    const { user } = authResult;

    // ===========================================
    // STAGE 2: Rate limiting
    // ===========================================

    const rateConfig = RATE_LIMIT[user.tier];
    const rateCheck = checkRateLimit(user.id, rateConfig.requests, rateConfig.windowMs);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          code: "RATE_LIMITED",
          retryAfter: Math.ceil((rateCheck.resetAt - Date.now()) / 1000),
        } as InterpretErrorResponse,
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((rateCheck.resetAt - Date.now()) / 1000)),
            "X-RateLimit-Remaining": String(rateCheck.remaining),
            "X-RateLimit-Reset": String(rateCheck.resetAt),
          },
        }
      );
    }

    // ===========================================
    // STAGE 3: Parse and validate input
    // ===========================================

    let body: { text: string; locale?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          error: "Invalid request body",
          code: "INVALID_JSON",
        } as InterpretErrorResponse,
        { status: 400 }
      );
    }

    const { text } = body;

    const validation = validateObjectInput(text);
    if (!validation.valid) {
      return NextResponse.json(
        {
          error: validation.errors[0]?.message || "Validation failed",
          code: validation.errors[0]?.code || "VALIDATION_ERROR",
          details: validation.errors,
        } as InterpretErrorResponse,
        { status: 400 }
      );
    }

    const sanitizedText = validation.sanitizedText!;

    // ===========================================
    // STAGE 4: Check tier limits (preview only)
    // ===========================================

    const limitCheck = await canCreateObject(user.id, user.tier);
    // For interpret (preview), we allow even if at limit
    // Just warn the user they can't save
    const canSave = limitCheck.allowed;

    // ===========================================
    // STAGE 5: PASSIVE crisis detection (hard keywords only)
    // Never blocks. Shows resources banner when matched.
    // ===========================================

    const crisisResult = detectCrisis(sanitizedText);
    const showBanner = crisisResult.showResources;

    // ===========================================
    // STAGE 6: Generate dual-lens interpretation
    // ===========================================

    const interpretation = await claudeService.generateDualLensInterpretation(sanitizedText);

    const totalTime = Date.now() - startTime;

    // ===========================================
    // STAGE 7: Return response
    // ===========================================

    return NextResponse.json(
      {
        lensA: interpretation.lensA,
        lensB: interpretation.lensB,
        showBanner,
        showResources: crisisResult.showResources,
        detectedKeywords: crisisResult.detectedKeywords,
        canSave,
        remaining: user.tier === "FREE" ? limitCheck.remaining : null,
        generatedAt: interpretation.generatedAt,
        metrics: {
          totalMs: totalTime,
        },
      },
      {
        headers: {
          "X-RateLimit-Remaining": String(rateCheck.remaining),
          "X-Processing-Time": String(totalTime),
        },
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[Interpret] Unexpected error:", errorMessage);

    return NextResponse.json(
      {
        error: "Internal server error",
        code: "INTERNAL_ERROR",
      } as InterpretErrorResponse,
      { status: 500 }
    );
  }
}

// ===========================================
// OPTIONS - CORS preflight
// ===========================================

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
