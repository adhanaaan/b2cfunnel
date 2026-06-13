import { getServerSupabase, isSupabaseConfigured } from "./server";

export interface PartyAttempt {
  name: string;
  drinks: number;
  timeMs: number;
}

/** Record a party attempt. No-ops gracefully if Supabase isn't configured. */
export async function submitPartyScore(
  name: string,
  drinks: number,
  timeMs: number,
): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const sb = getServerSupabase();
  await sb.from("party_scores").insert({
    name,
    drinks: Math.max(0, Math.round(drinks)),
    time_ms: Math.round(timeMs),
  });
}

/** All party attempts, fastest first. Returns [] when Supabase isn't configured. */
export async function getPartyAttempts(): Promise<PartyAttempt[]> {
  if (!isSupabaseConfigured()) return [];
  const sb = getServerSupabase();
  const { data, error } = await sb
    .from("party_scores")
    .select("name, drinks, time_ms")
    .order("time_ms", { ascending: true });

  if (error || !data) return [];
  return (data as { name: string; drinks: number; time_ms: number }[]).map(
    (r) => ({ name: r.name, drinks: r.drinks, timeMs: r.time_ms }),
  );
}

/** Wipe the party leaderboard. */
export async function clearPartyScores(): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const sb = getServerSupabase();
  // delete all rows
  await sb.from("party_scores").delete().gte("time_ms", 0);
}
