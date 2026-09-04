import { NextResponse } from "next/server";
import {
  getServerSupabase,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import type { LeadPayload, LeadRow } from "@/lib/supabase/types";
import { insertWithOptionalColumns } from "@/lib/supabase/optionalColumn";

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

  const row: LeadRow = {
    email,
    name: typeof payload.name === "string" ? payload.name.trim() : null,
    persona: payload.persona ?? null,
    risk_score: payload.riskScore ?? null,
    symptom_score: payload.symptomScore ?? null,
    total_score: payload.totalScore ?? null,
    band: payload.band ?? null,
    // The answers as given, so a lead can be read back against the score it
    // produced. Written as null rather than {} when the funnel never asked a
    // question (the game-only event flows), so an empty cell means "no quiz",
    // not "quiz with nothing in it".
    answers:
      payload.answers && Object.keys(payload.answers).length > 0
        ? payload.answers
        : null,
    game_time_ms: payload.gameTimeMs ?? null,
    // Three-state on purpose: true, false, or null when we never asked.
    tips_consent:
      typeof payload.tipsConsent === "boolean" ? payload.tipsConsent : null,
    partner_consent:
      typeof payload.partnerConsent === "boolean"
        ? payload.partnerConsent
        : null,
    source: typeof payload.source === "string" ? payload.source : null,
    user_agent: req.headers.get("user-agent"),
  };

  try {
    const supabase = getServerSupabase();
    // tips_consent, partner_consent, source and answers are optional in the
    // database, so a database that predates any of them must never cost us the
    // lead.
    const {
      tips_consent: tipsConsent,
      partner_consent: partnerConsent,
      source,
      answers,
      ...rest
    } = row;
    const { error } = await insertWithOptionalColumns(
      {
        tips_consent: tipsConsent ?? null,
        partner_consent: partnerConsent ?? null,
        source: source ?? null,
        answers: answers ?? null,
      },
      rest,
      (values) => supabase.from("leads").insert(values),
    );
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
