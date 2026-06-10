/**
 * Event pause switch. Flip to `false` (and redeploy) to reopen the event:
 * /event and the TV board show an "ended" state and new game scores are
 * rejected while this is `true`. Only affects the /event experience — the main
 * quiz at / is unaffected.
 */
export const EVENT_PAUSED = true;
