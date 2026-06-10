import { getServerSupabase, isSupabaseConfigured } from "./server";

export interface LeaderboardEntry {
  name: string;
  email: string;
  timeMs: number;
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
 * Event leaderboard: best time per email, fastest first, across the whole
 * event (no daily reset). Returns [] when Supabase isn't configured.
 */
export async function getLeaderboard(
  limit = 50,
): Promise<LeaderboardEntry[]> {
  if (!isSupabaseConfigured()) return [];
  const sb = getServerSupabase();
  const { data, error } = await sb
    .from("game_scores")
    .select("name, email, time_ms")
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
