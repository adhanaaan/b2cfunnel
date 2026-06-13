import { NextResponse } from "next/server";
import {
  submitPartyScore,
  getPartyAttempts,
  clearPartyScores,
} from "@/lib/supabase/party";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET: all attempts (fastest first), aggregated client-side. */
export async function GET() {
  const attempts = await getPartyAttempts();
  return NextResponse.json({ attempts });
}

/** POST: record one attempt { name, drinks, timeMs }. */
export async function POST(req: Request) {
  let body: { name?: unknown; drinks?: unknown; timeMs?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim().slice(0, 40) : "";
  const drinks = Number(body.drinks);
  const timeMs = Number(body.timeMs);
  if (!name || !Number.isFinite(timeMs) || timeMs <= 0) {
    return NextResponse.json({ error: "Invalid attempt." }, { status: 400 });
  }

  try {
    await submitPartyScore(name, Number.isFinite(drinks) ? drinks : 0, timeMs);
  } catch {
    return NextResponse.json({ error: "Could not save." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

/** DELETE: reset the whole leaderboard (host action at a private party). */
export async function DELETE() {
  try {
    await clearPartyScores();
  } catch {
    return NextResponse.json({ error: "Could not reset." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
