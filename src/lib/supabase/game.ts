import { getServerSupabase, isSupabaseConfigured } from "./server";
import { insertWithOptionalColumns } from "./optionalColumn";
import {
  TEAM_MAX_LENGTH,
  boardNameFor,
  splitBoardName,
  teamKey,
} from "@/lib/boardName";

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

/** One team's standing, built from its players' best runs. */
export interface TeamStanding {
  /** The team as the first player to name it typed it. */
  team: string;
  /** The team's fastest run - what it is ranked on by default. */
  bestMs: number;
  /** Who set it. */
  bestPlayer: string;
  /** The mean of its players' best runs. */
  averageMs: number;
  /** How many DIFFERENT players have played for it. */
  players: number;
}

/**
 * How teams are ranked against each other.
 *
 * "best" - the team's fastest player. The default, and the one that suits an
 * event: every extra person a team gets to scan is another chance at a quicker
 * time, so it rewards pulling the whole table in. Ranking on the average does
 * the opposite - one slow teammate drags a team down, which quietly tells the
 * slower half of the room not to play.
 *
 * "average" - the mean of the team's players' best runs. Flip this constant to
 * switch; the board prints both figures either way, so only the ordering and
 * the labelled column change.
 */
export type TeamMetric = "best" | "average";
export const TEAM_METRIC: TeamMetric = "best";

/**
 * Team standings for one event.
 *
 * Built on top of `getLeaderboard`, so a player counts once at their best run
 * here exactly as they do on the individual board - a team cannot climb by
 * having one member play twenty times.
 *
 * The team is read out of the stored NAME rather than the `team` column: the
 * column is optional and a database that has not had the migration run drops it
 * silently, so it may be empty on the night. The name always carries the team.
 */
export async function getTeamLeaderboard(
  source?: string | null,
  metric: TeamMetric = TEAM_METRIC,
): Promise<TeamStanding[]> {
  // 200 is what getLeaderboard reads anyway; every player of the night is far
  // inside that for a room of eight teams.
  const players = await getLeaderboard(200, source);

  const byTeam = new Map<
    string,
    { team: string; times: number[]; bestPlayer: string }
  >();

  for (const p of players) {
    const { player, team } = splitBoardName(p.name);
    // A score with no team belongs to no team, and is left to the individual
    // board rather than being filed under a made-up one.
    if (!team) continue;
    const key = teamKey(team);
    const found = byTeam.get(key);
    if (found) {
      found.times.push(p.timeMs);
    } else {
      // `players` is already fastest-first, so the first row for a team is its
      // best run and the spelling that lands on the board is the one whoever
      // set it typed.
      byTeam.set(key, { team, times: [p.timeMs], bestPlayer: player });
    }
  }

  const standings: TeamStanding[] = [...byTeam.values()].map((t) => ({
    team: t.team,
    bestMs: Math.min(...t.times),
    bestPlayer: t.bestPlayer,
    averageMs: t.times.reduce((a, b) => a + b, 0) / t.times.length,
    players: t.times.length,
  }));

  return standings.sort((a, b) =>
    metric === "average"
      ? a.averageMs - b.averageMs
      : a.bestMs - b.bestMs,
  );
}
