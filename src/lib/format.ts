import type { Language } from "@/config/language";

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

/**
 * The same count, in a given language.
 *
 * English suffixes the number ("2nd record"); Bahasa Indonesia prefixes it
 * ("Rekor ke-2"), which no amount of suffixing gets to. The heading is one
 * string with a {ordinal} placeholder in both, so this is the only place the
 * two shapes have to be told apart.
 */
export function ordinalFor(n: number, language: Language): string {
  const whole = Math.max(1, Math.round(n));
  return language === "id" ? `ke-${whole}` : ordinal(whole);
}

/** The first word of a name, for a heading that speaks to the player. */
export function firstName(name?: string): string | undefined {
  const first = name?.trim().split(/\s+/)[0];
  return first ? first : undefined;
}

/**
 * A time in plain seconds to one decimal - "28.5" - for the line that names
 * its own unit ("28.5 seconds" on the Sharp Shot poster).
 *
 * `formatTime` is the leaderboard clock (m:ss.s) and stays that: a poster
 * handed to a barista reads "28.5 seconds", not "0:28.5".
 */
export function formatSeconds(ms: number): string {
  return (Math.max(0, ms) / 1000).toFixed(1);
}

/**
 * A moment as "2026-09-21 12:35:00", in the reader's own timezone.
 *
 * Built from the local date parts rather than through `toLocaleString`, whose
 * output moves with the device's locale - a redemption stamp that reads
 * "21/09/2026" on one phone and "9/21/2026" on the next is a stamp staff
 * cannot check at a glance. Local time rather than UTC on purpose: it is read
 * against the clock on the wall.
 */
export function formatStamp(at: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const date = `${at.getFullYear()}-${pad(at.getMonth() + 1)}-${pad(at.getDate())}`;
  const time = `${pad(at.getHours())}:${pad(at.getMinutes())}:${pad(at.getSeconds())}`;
  return `${date} ${time}`;
}
