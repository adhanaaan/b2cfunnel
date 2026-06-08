import { getServerSupabase, isSupabaseConfigured } from "./server";

export interface LeaderboardEntry {
  name: string;
  email: string;
  timeMs: number;
}

/** ISO timestamp for the start of "today" in Singapore time (UTC+8, no DST). */
export function todayStartIso(): string {
  const SGT_OFFSET = 8 * 60 * 60 * 1000;
  const sgt = new Date(Date.now() + SGT_OFFSET);
  const sgtMidnightAsUtc = Date.UTC(
    sgt.getUTCFullYear(),
    sgt.getUTCMonth(),
    sgt.getUTCDate(),
  );
  return new Date(sgtMidnightAsUtc - SGT_OFFSET).toISOString();
}

/** Record a game result. No-ops gracefully if Supabase isn't configured. */
export async function submitScore(
  name: string,
  email: string,
  timeMs: number,
): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const sb = getServerSupabase();
  await sb
    .from("game_scores")
    .insert({ name, email, time_ms: Math.round(timeMs) });
}

/**
 * Today's leaderboard (Singapore time): best time per email, fastest first.
 * Returns [] when Supabase isn't configured.
 */
export async function getTodayLeaderboard(
  limit = 50,
): Promise<LeaderboardEntry[]> {
  if (!isSupabaseConfigured()) return [];
  const sb = getServerSupabase();
  const { data, error } = await sb
    .from("game_scores")
    .select("name, email, time_ms")
    .gte("created_at", todayStartIso())
    .order("time_ms", { ascending: true });

  if (error || !data) return [];

  // data is sorted ascending, so the first row per email is that player's best.
  const best = new Map<string, LeaderboardEntry>();
  for (const r of data as { name: string; email: string; time_ms: number }[]) {
    if (!best.has(r.email)) {
      best.set(r.email, { name: r.name, email: r.email, timeMs: r.time_ms });
    }
  }
  return [...best.values()]
    .sort((a, b) => a.timeMs - b.timeMs)
    .slice(0, limit);
}
