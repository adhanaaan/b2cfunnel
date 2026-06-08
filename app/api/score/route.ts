import { NextResponse } from "next/server";
import { submitScore } from "@/lib/supabase/game";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ScorePayload {
  name?: string;
  email?: string;
  timeMs?: number;
}

export async function POST(req: Request) {
  let payload: ScorePayload;
  try {
    payload = (await req.json()) as ScorePayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const timeMs = Number(payload.timeMs);

  if (!name || !EMAIL_RE.test(email) || !Number.isFinite(timeMs) || timeMs <= 0) {
    return NextResponse.json({ error: "Invalid score payload." }, { status: 400 });
  }

  try {
    await submitScore(name, email, timeMs);
  } catch (err) {
    console.error("[score] insert failed:", err);
    return NextResponse.json({ error: "Could not save your score." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
