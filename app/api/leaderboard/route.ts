import { NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/supabase/game";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = url.searchParams.get("email")?.trim().toLowerCase() ?? null;
  const limit = Math.min(Number(url.searchParams.get("limit")) || 10, 100);

  const all = await getLeaderboard(200);

  const rankIndex = email
    ? all.findIndex((e) => e.email.toLowerCase() === email)
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
