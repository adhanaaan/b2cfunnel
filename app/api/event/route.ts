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

/**
 * Anonymous funnel event sink. Records step views / milestones for drop-off
 * analysis. No PII — just a random session id, the event/step and the variant.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const sessionId = str(body.sessionId, 64);
  const event = str(body.event, 64);
  if (!sessionId || !event) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // No-op gracefully when Supabase isn't configured, so the funnel still works.
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, stored: false });
  }

  try {
    const supabase = getServerSupabase();
    await supabase.from("funnel_events").insert({
      session_id: sessionId,
      event,
      step: str(body.step, 64),
      variant: str(body.variant, 16),
    });
  } catch {
    /* never surface analytics failures */
  }

  return NextResponse.json({ ok: true });
}
