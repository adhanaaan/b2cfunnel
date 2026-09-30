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

/** The separator `boardNameFor` joins with, kept in one place for the split. */
const SEPARATOR = " · ";

/**
 * Pull the team back out of a stored name.
 *
 * Reading the name rather than the `team` column is deliberate: the column is
 * optional and a database without the migration drops it SILENTLY, so on the
 * night it may hold nothing at all. The name always has the team in it, because
 * that is the copy `submitScore` writes precisely so it cannot be lost.
 *
 * Splits on the LAST separator, so a player whose own name contains one keeps
 * it: "Jean · Luc · Team Picard" is Jean · Luc, of Team Picard.
 */
export function splitBoardName(stored: string): {
  player: string;
  team: string | null;
} {
  const at = stored.lastIndexOf(SEPARATOR);
  if (at < 0) return { player: stored.trim(), team: null };
  const player = stored.slice(0, at).trim();
  const team = stored.slice(at + SEPARATOR.length).trim();
  // A trailing separator with nothing after it is a name, not a team.
  if (!team) return { player: stored.trim(), team: null };
  return { player, team };
}

/**
 * Teams are matched case- and space-insensitively, so "the quizzengers" and
 * "The  Quizzengers" are one team on the board. Typed by hand on a phone, in a
 * bar, by several people who have been drinking - they will not agree on caps.
 */
export function teamKey(team: string): string {
  return team.trim().toLowerCase().replace(/\s+/g, " ");
}
