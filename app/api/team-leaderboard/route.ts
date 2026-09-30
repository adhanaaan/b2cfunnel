import { NextResponse } from "next/server";
import { getTeamLeaderboard } from "@/lib/supabase/game";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Team standings for one event, for the quiz-night team board.
 *
 * Its own route rather than a flag on /api/leaderboard: that route answers
 * every individual board in the app and the result screens' "where do I rank",
 * and a shape that changes under a query parameter is the kind of thing that
 * breaks a screen nobody was looking at.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const source = url.searchParams.get("source")?.trim() || null;
  const limit = Math.min(Number(url.searchParams.get("limit")) || 12, 50);

  const teams = await getTeamLeaderboard(source);

  return NextResponse.json({
    teams: teams.slice(0, limit),
    totalTeams: teams.length,
    totalPlayers: teams.reduce((n, t) => n + t.players, 0),
  });
}
