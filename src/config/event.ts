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
 * Temporarily closes the v3 Reaction Time Challenge, and with it the
 * leaderboard it feeds.
 *
 * Different from EVENT3_PAUSED, which takes the whole route down: this keeps
 * /event-v3 walkable as far as the partner consent page and then ends the
 * session on the "That's a wrap!" screen, so a poster or a QR code already in
 * the wild lands somewhere deliberate instead of on a game nobody is ranking.
 * The game, the questionnaire and the report are simply unreachable while it is
 * on, so no new score can be posted and the board's standings stop moving.
 *
 * Flip to `false` (and redeploy) to reopen: the full arc comes straight back -
 * the question set, the scoring maxima and every score already on the board are
 * untouched by this switch. It closes the DBS challenge and nothing else: the
 * /event-v6 consent preview and /rotaryklwam ignore it and keep walking their
 * whole flow, because the close is applied per variant in resolveFlow.
 */
export const EVENT3_CHALLENGE_CLOSED = true;

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
 * The bucket currently in play.
 *
 * DBS (1-2 Sep) runs BOTH DAYS on DBS_DAY1_SOURCE, by decision: one
 * leaderboard carries across the two days, so day 2 opens on day 1's
 * standings rather than an empty board. Do not flip this to DBS_DAY2_SOURCE
 * overnight - that would clear the board mid-event.
 *
 * DBS_DAY2_SOURCE is kept for the next event that does want a fresh board:
 * point this at it (and redeploy) to start one. Whatever this is set to, older
 * rows keep the tag they were written with and simply stop appearing.
 */
export const EVENT3_SOURCE: string = DBS_DAY1_SOURCE;

/**
 * Independent pause switch for the Rotary KL-WAM event (/rotaryklwam and its
 * TV board). Same contract as EVENT3_PAUSED, and deliberately its own switch
 * so closing one event never takes another down with it.
 */
export const ROTARY_PAUSED = false;

/**
 * Leaderboard bucket for the Rotary KL-WAM funnel. Every /rotaryklwam score
 * and report is tagged with it, and the Rotary board filters to it - which is
 * what keeps its standings clear of every other event's history.
 */
export const ROTARY_SOURCE = "rotaryklwam";

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
    case "rotary":
      return ROTARY_SOURCE;
    case "event2":
      return "event2";
    case "event":
      return "event";
    default:
      return null;
  }
}
