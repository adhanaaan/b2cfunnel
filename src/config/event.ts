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
 * Leaderboard bucket for the v3 funnel. Every /event-v3 score is tagged with
 * this string, and the v3 board only shows rows that match it - which is what
 * keeps v3's standings clear of v1/v2 history.
 *
 * To start a fresh board at the next v3 event, change this string. Previous
 * scores keep their old tag and stay in the table; they just stop appearing.
 * Nothing is ever deleted.
 */
export const EVENT3_SOURCE = "event3";
