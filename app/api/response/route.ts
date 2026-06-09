import { NextResponse } from "next/server";
import {
  getServerSupabase,
  isSupabaseConfigured,
} from "@/lib/supabase/server";

// Service key must run on the Node runtime, not edge.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const str = (v: unknown, max: number): string | null =>
  typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null;
const num = (v: unknown): number | null =>
  typeof v === "number" && Number.isFinite(v) ? Math.round(v) : null;

/**
 * Anonymous audience profile sink. Records a participant's demographics,
 * brain-health profile and risk-factor answers WITHOUT name or email (keyed to
 * the random session id only). Aggregate-only — for understanding who showed up.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const sessionId = str(body.sessionId, 64);
  if (!sessionId) return NextResponse.json({ ok: false }, { status: 400 });

  // No-op gracefully when Supabase isn't configured.
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, stored: false });
  }

  const answers =
    body.answers && typeof body.answers === "object" && !Array.isArray(body.answers)
      ? (body.answers as Record<string, unknown>)
      : null;

  try {
    const supabase = getServerSupabase();
    await supabase.from("quiz_responses").insert({
      session_id: sessionId,
      variant: str(body.variant, 16),
      age: str(body.age, 32),
      sex: str(body.sex, 32),
      band: str(body.band, 16),
      persona: str(body.persona, 32),
      risk_score: num(body.riskScore),
      symptom_score: num(body.symptomScore),
      total_score: num(body.totalScore),
      game_time_ms: num(body.gameTimeMs),
      answers,
    });
  } catch {
    /* never surface analytics failures */
  }

  return NextResponse.json({ ok: true });
}
