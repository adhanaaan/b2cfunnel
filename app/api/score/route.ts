import { NextResponse } from "next/server";
import { submitScore } from "@/lib/supabase/game";
import {
  EVENT_PAUSED,
  EVENT2_PAUSED,
  EVENT3_PAUSED,
  EVENT3_SOURCE,
} from "@/config/event";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ScorePayload {
  name?: string;
  email?: string;
  timeMs?: number;
  /**
   * Which event the score was played at - "event", "event2", or EVENT3_SOURCE.
   * Selects the pause switch, and is stored so each board can filter to its
   * own standings.
   */
  source?: string;
  /**
   * Whether the player ticked the brain-health-tips box on the landing page.
   * Optional: omitted by variants that never asked, and stored as null there.
   */
  tipsConsent?: boolean;
  /**
   * Whether the player ticked the partner consent on the consent page. Same
   * contract as tipsConsent: omitted by variants without that page.
   */
  partnerConsent?: boolean;
}

export async function POST(req: Request) {
  let payload: ScorePayload;
  try {
    payload = (await req.json()) as ScorePayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  // Per-source pause: accept the request but don't record new scores, so
  // pausing one event never silently drops the other's results.
  const paused =
    payload.source === EVENT3_SOURCE
      ? EVENT3_PAUSED
      : payload.source === "event2"
        ? EVENT2_PAUSED
        : EVENT_PAUSED;
  if (paused) {
    return NextResponse.json({ ok: true, stored: false });
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const timeMs = Number(payload.timeMs);

  if (!name || !EMAIL_RE.test(email) || !Number.isFinite(timeMs) || timeMs <= 0) {
    return NextResponse.json({ error: "Invalid score payload." }, { status: 400 });
  }

  try {
    await submitScore(
      name,
      email,
      timeMs,
      payload.source ?? null,
      typeof payload.tipsConsent === "boolean" ? payload.tipsConsent : null,
      typeof payload.partnerConsent === "boolean"
        ? payload.partnerConsent
        : null,
    );
  } catch (err) {
    console.error("[score] insert failed:", err);
    return NextResponse.json({ error: "Could not save your score." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
