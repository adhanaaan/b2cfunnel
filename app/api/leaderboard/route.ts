import { NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/supabase/game";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = url.searchParams.get("email")?.trim().toLowerCase() ?? null;
  // Who to rank when there is no address to rank by. The quiz-night landing
  // collects a name and a team and no email, and the name it stores already
  // carries the team ("Adnan · The Quizzengers"), so it is specific enough to
  // find a player by. Only consulted when `email` is absent, so no existing
  // caller's ranking changes. Two players who enter the same name on the same
  // team both match the faster of the two - the cost of having no identifier,
  // and cheaper than showing nobody their standing.
  const name = url.searchParams.get("name")?.trim().toLowerCase() || null;
  const limit = Math.min(Number(url.searchParams.get("limit")) || 10, 100);
  // Scope the board to one event when asked; no param = every score, as before.
  const source = url.searchParams.get("source")?.trim() || null;

  const all = await getLeaderboard(200, source);

  const rankIndex = email
    ? all.findIndex((e) => e.email.toLowerCase() === email)
    : name
      ? all.findIndex((e) => e.name.trim().toLowerCase() === name)
      : -1;

  return NextResponse.json({
    entries: all.slice(0, limit),
    total: all.length,
    you:
      rankIndex >= 0
        ? { rank: rankIndex + 1, timeMs: all[rankIndex].timeMs }
        : null,
  });
}
