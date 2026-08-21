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
