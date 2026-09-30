import { getServerSupabase, isSupabaseConfigured } from "./server";
import { insertWithOptionalColumns } from "./optionalColumn";
import { TEAM_MAX_LENGTH, boardNameFor } from "@/lib/boardName";

export interface LeaderboardEntry {
  name: string;
  email: string;
  timeMs: number;
}

/**
 * Record a game result. No-ops gracefully if Supabase isn't configured.
 *
 * `source` tags the row with the event it was played at (see EVENT3_SOURCE in
 * config/event.ts) so each board can show only its own standings. Rows written
 * before the column existed carry null and simply never match a filter.
 *
 * `tipsConsent` is whether the player ticked the brain-health-tips box on the
 * landing page, and `partnerConsent` whether they ticked the partner's consent
 * on the consent page - `null` for either when we never asked (older events) or
 * the column is not in the database yet, so both are always three-state values:
 * true, false, or unknown.
 *
 * `ageBand` is the age option the player chose before the game (/phkl asks it
 * there), null where the funnel never asked. Optional column like the two
 * consents: a database without it still records the score.
 */
export async function submitScore(
  name: string,
  email: string,
  timeMs: number,
  source?: string | null,
  tipsConsent?: boolean | null,
  partnerConsent?: boolean | null,
  ageBand?: string | null,
  team?: string | null,
): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const sb = getServerSupabase();
  const cleanTeam = team?.trim()
    ? team.trim().slice(0, TEAM_MAX_LENGTH)
    : null;
  const row = {
    // The team is written twice on purpose, and this is the copy that cannot
    // be lost: `team` below is an optional column, and an optional column on a
    // database that has not had the migration run is dropped SILENTLY. On a
    // night where the team is the whole point of the scoring, folding it into
    // the name means a missed migration costs formatting, not data - and it is
    // what the board prints anyway, so the room can see who played for whom.
    name: boardNameFor(name, cleanTeam),
    email,
    time_ms: Math.round(timeMs),
    source: source ?? null,
  };
  await insertWithOptionalColumns(
    {
      tips_consent: tipsConsent ?? null,
      partner_consent: partnerConsent ?? null,
      age_band: ageBand ?? null,
      team: cleanTeam,
    },
    row,
    (values) => sb.from("game_scores").insert(values),
  );
}

/**
 * Event leaderboard: best time per email, fastest first, across the whole
 * event (no daily reset). Returns [] when Supabase isn't configured.
 *
 * Pass `source` to scope the board to one event's scores; omit it to keep the
 * historical behaviour of ranking every row in the table.
 */
export async function getLeaderboard(
  limit = 50,
  source?: string | null,
): Promise<LeaderboardEntry[]> {
  if (!isSupabaseConfigured()) return [];
  const sb = getServerSupabase();
  let query = sb
    .from("game_scores")
    .select("name, email, time_ms")
    .order("time_ms", { ascending: true });

  if (source) query = query.eq("source", source);

  const { data, error } = await query;

  if (error || !data) return [];

  // data is sorted ascending, so the first row per player is that player's best.
  //
  // Keyed on the email where there is one. Where there is not - the quiz-night
  // landing takes a name and a team and no address - it keys on the stored name
  // instead, which on those routes carries the team ("Adnan · The Quizzengers").
  // Keying every address-less row on "" would collapse a whole room into a
  // single entry and leave one name on the board all night.
  const best = new Map<string, LeaderboardEntry>();
  for (const r of data as { name: string; email: string; time_ms: number }[]) {
    const key = r.email?.trim()
      ? `email:${r.email.trim().toLowerCase()}`
      : `name:${r.name.trim().toLowerCase()}`;
    if (!best.has(key)) {
      best.set(key, { name: r.name, email: r.email, timeMs: r.time_ms });
    }
  }
  return [...best.values()]
    .sort((a, b) => a.timeMs - b.timeMs)
    .slice(0, limit);
}
