/** Format milliseconds as m:ss.s (e.g. 18400 -> "0:18.4", 65200 -> "1:05.2"). */
export function formatTime(ms: number): string {
  const totalSec = Math.max(0, ms) / 1000;
  const m = Math.floor(totalSec / 60);
  const s = totalSec - m * 60;
  return `${m}:${s.toFixed(1).padStart(4, "0")}`;
}

/**
 * How a player's name is shown on a leaderboard row.
 *
 * A name runs in full while it fits the row. A longer one keeps its first name
 * and comes down to the initial of the last - "Adnan Azam Mohammed" reads as
 * "Adnan M." - which a player still recognises as theirs from across the room,
 * where a name cut mid-word by an ellipsis does not. The result is short
 * whatever goes in, so one very long name can no longer set a row's width.
 *
 * A single word has nothing to abbreviate, so the row's own truncation still
 * backs this up.
 */
const NAME_MAX = 18;

export function displayName(name: string): string {
  const clean = name.trim().replace(/\s+/g, " ");
  if (clean.length <= NAME_MAX) return clean;
  const parts = clean.split(" ");
  if (parts.length === 1) return clean;
  const short = `${parts[0]} ${parts[parts.length - 1][0].toUpperCase()}.`;
  return short.length < clean.length ? short : clean;
}

/** An ordinal for a count: 1 -> "1st", 2 -> "2nd", 3 -> "3rd", 11 -> "11th", 22 -> "22nd". */
export function ordinal(n: number): string {
  const whole = Math.max(1, Math.round(n));
  const mod100 = whole % 100;
  const suffix =
    mod100 >= 11 && mod100 <= 13
      ? "th"
      : (["th", "st", "nd", "rd"][whole % 10] ?? "th");
  return `${whole}${suffix}`;
}

/** The first word of a name, for a heading that speaks to the player. */
export function firstName(name?: string): string | undefined {
  const first = name?.trim().split(/\s+/)[0];
  return first ? first : undefined;
}
