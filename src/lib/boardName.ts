/**
 * The name a score is stored and displayed under.
 *
 * On the routes that play in teams (/onetrickpony) the team is folded into the
 * name - "Adnan · The Quizzengers" - so that it survives a database with no
 * `team` column, which `insertWithOptionalColumns` would otherwise drop in
 * silence. See `submitScore`.
 *
 * It lives here, on its own, because two places need the same answer and must
 * not drift: the server composes it when it writes the row, and the client
 * composes it again to ask the leaderboard where that row ranks. If the two
 * ever disagreed, a player on a team would simply never be told their standing.
 */
export function boardNameFor(
  name: string | undefined,
  team?: string | null,
): string {
  const cleanName = name?.trim() ?? "";
  const cleanTeam = team?.trim();
  return cleanTeam ? `${cleanName} · ${cleanTeam}` : cleanName;
}

/** The longest team we store, so an entered name cannot overflow the column. */
export const TEAM_MAX_LENGTH = 60;
