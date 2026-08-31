/**
 * The "N% folks got their brain health report" stat on the event board.
 *
 * Players and reports are both counted as unique people (by email), scoped to
 * one event bucket, so a player who retries the game three times counts once.
 */

export interface ReportRate {
  /** Unique people who played at this event. */
  players: number;
  /** Unique people who went on to finish the quiz and get a report. */
  reports: number;
  /** reports / players, 0-1. Zero when nobody has played yet. */
  rate: number;
  /** False until enough people have played for a percentage to mean anything. */
  meaningful: boolean;
}

/**
 * How many players it takes before the percentage is shown. One is enough: the
 * tile appears as soon as somebody has played, so the board is never silently
 * missing a panel at an event. Only the genuinely empty case (nobody has played
 * this event yet, so there is no true percentage to print) hides it.
 */
export const MIN_PLAYERS_FOR_RATE = 1;

/** Case-insensitive unique count, since emails are typed by hand at a booth. */
function uniqueEmails(emails: readonly string[]): Set<string> {
  return new Set(
    emails
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e.length > 0),
  );
}

/**
 * Report rate for one event: unique report-getters over unique players.
 *
 * Only people who actually played count in the denominator, and only their
 * reports count in the numerator - a lead with no score at this event (someone
 * who opened the quiz link directly) is ignored rather than pushing the rate
 * above 100%.
 */
export function computeReportRate(
  playerEmails: readonly string[],
  reportEmails: readonly string[],
): ReportRate {
  const players = uniqueEmails(playerEmails);
  const reports = uniqueEmails(reportEmails);

  let finished = 0;
  for (const email of reports) if (players.has(email)) finished += 1;

  return {
    players: players.size,
    reports: finished,
    rate: players.size === 0 ? 0 : finished / players.size,
    meaningful: players.size >= MIN_PLAYERS_FOR_RATE,
  };
}
