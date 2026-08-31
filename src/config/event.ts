import type { QuizVariant } from "@/types/funnel";

/**
 * Event pause switch. Flip to `false` (and redeploy) to reopen the event:
 * /event and the TV board show an "ended" state and new game scores are
 * rejected while this is `true`. Only affects the /event experience - the main
 * quiz at / is unaffected.
 */
export const EVENT_PAUSED = false;

/**
 * Independent pause switch for the v2 event (/event-v2 and its TV board).
 * Kept separate from EVENT_PAUSED so either event can be opened or closed
 * without touching the other.
 */
export const EVENT2_PAUSED = false;

/**
 * Independent pause switch for the v3 event (/event-v3). Same contract as
 * EVENT2_PAUSED: the page shows an "ended" state and new game scores from the
 * v3 funnel are rejected while this is `true`.
 */
export const EVENT3_PAUSED = false;

/**
 * Leaderboard buckets for the v3 funnel, one per event day. Every /event-v3
 * score is tagged with the active bucket, and the v3 board only shows rows
 * that match it - which is what keeps each day's standings clear of every
 * other event's history.
 *
 * Nothing is ever deleted: rows keep the tag they were written with, so
 * switching buckets clears the board without touching the database.
 */
export const DBS_DAY1_SOURCE = "dbs-day1";
export const DBS_DAY2_SOURCE = "dbs-day2";

/**
 * The bucket currently in play. This is the only line to change between
 * events:
 *
 *   - DBS day 1 (1 Sep): DBS_DAY1_SOURCE  <- active
 *   - DBS day 2 (2 Sep): DBS_DAY2_SOURCE
 *
 * Flip it to DBS_DAY2_SOURCE (and redeploy) at the end of day 1 to start day 2
 * on an empty board. Day 1's rows stay in the table under "dbs-day1", and the
 * older "event3" rows stay under theirs.
 */
export const EVENT3_SOURCE: string = DBS_DAY1_SOURCE;

/**
 * The bucket a variant's rows are tagged with, for both `game_scores.source`
 * and `leads.source`. Shared so a score and the report that follows it always
 * carry the same tag - the report rate on the board divides one by the other,
 * and a mismatch would quietly read as nobody finishing.
 *
 * Returns null for the non-event funnels (`/`, `/woman`), whose rows are not
 * part of any event's standings or completion rate.
 */
export function eventSource(variant: QuizVariant): string | null {
  switch (variant) {
    case "event3":
      return EVENT3_SOURCE;
    case "event2":
      return "event2";
    case "event":
      return "event";
    default:
      return null;
  }
}
