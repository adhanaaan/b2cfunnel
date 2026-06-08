import { NextResponse } from "next/server";
import {
  getServerSupabase,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import type { LeadPayload, LeadRow } from "@/lib/supabase/types";

// Service key must run on the Node runtime, not edge.
export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let payload: LeadPayload;
  try {
    payload = (await req.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  // Gracefully no-op in local dev when Supabase isn't configured, so the funnel
  // is fully walkable without credentials.
  if (!isSupabaseConfigured()) {
    console.warn("[lead] Supabase not configured, skipping insert.", { email });
    return NextResponse.json({ ok: true, stored: false });
  }

  // PDPA-safe default: only persist raw (sensitive) answers when explicitly
  // enabled via the STORE_ANSWERS flag (see .env.example).
  const storeAnswers = process.env.STORE_ANSWERS === "true";

  const row: LeadRow = {
    email,
    name: typeof payload.name === "string" ? payload.name.trim() : null,
    persona: payload.persona ?? null,
    risk_score: payload.riskScore ?? null,
    symptom_score: payload.symptomScore ?? null,
    total_score: payload.totalScore ?? null,
    band: payload.band ?? null,
    answers: storeAnswers ? (payload.answers ?? null) : null,
    game_time_ms: payload.gameTimeMs ?? null,
    user_agent: req.headers.get("user-agent"),
  };

  try {
    const supabase = getServerSupabase();
    const { error } = await supabase.from("leads").insert(row);
    if (error) {
      // Don't leak raw DB errors to the client.
      console.error("[lead] insert failed:", error.message);
      return NextResponse.json(
        { error: "Could not save your details. Please try again." },
        { status: 500 },
      );
    }
  } catch (err) {
    console.error("[lead] unexpected error:", err);
    return NextResponse.json(
      { error: "Could not save your details. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, stored: true });
}
