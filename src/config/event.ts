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
 * /event-v6 consent preview, /rotaryklwam and /ntuhomecoming ignore it and keep
 * walking their whole flow, because the close is applied per variant in
 * resolveFlow.
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
 * Independent pause switch for NTU Homecoming (/ntuhomecoming and its TV
 * board). Its own switch, like every other event's: closing one must never
 * take another down with it.
 */
export const NTU_HOMECOMING_PAUSED = false;

/**
 * Leaderboard bucket for the NTU Homecoming funnel. Every /ntuhomecoming score
 * and report is tagged with it, and the NTU board filters to it - which is what
 * keeps its standings clear of every other event's history.
 *
 * This is the value written to the `source` column for this event.
 */
export const NTU_HOMECOMING_SOURCE = "ntuhomecoming";

/**
 * Independent pause switch for the IHH SEA Regatta event (/ihhsearegatta and
 * its TV board). Its own switch, like every other event's: closing one must
 * never take another down with it.
 */
export const IHHSEA_PAUSED = false;

/**
 * Leaderboard bucket for the IHH SEA Regatta funnel. Every /ihhsearegatta
 * score and report is tagged with it, and the regatta board filters to it -
 * which is what keeps its standings clear of every other event's history.
 *
 * This is the value written to the `source` column for this event.
 */
export const IHHSEA_SOURCE = "ihhsearegatta";

/**
 * Temporarily closes the IHH SEA Regatta Reaction Time Challenge, and with it
 * the leaderboard it feeds.
 *
 * The regatta sibling of EVENT3_CHALLENGE_CLOSED, and deliberately its own
 * switch: closing one event's challenge must never close another's. Different
 * from IHHSEA_PAUSED, which takes the whole route down: this keeps
 * /ihhsearegatta walkable as far as the landing and then ends the session on
 * the "That's a wrap!" screen, so a poster or a QR code already in the wild
 * lands somewhere deliberate instead of on a game nobody is ranking. The
 * regatta takes its partner consent on the landing rather than on a page of
 * its own, so the landing is the last step before the wrap.
 *
 * The instructions, game, questionnaire and report are simply unreachable
 * while it is on, so no new score can be posted and the board's standings stop
 * moving.
 *
 * Flip to `false` (and redeploy) to reopen: the full arc comes straight back -
 * the question set, the scoring maxima and every score already on the board are
 * untouched by this switch, because the close is applied when the flow is
 * resolved, per variant, in resolveFlow.
 */
export const IHHSEA_CHALLENGE_CLOSED = false;

/**
 * Independent pause switch for the /ihh event. Its own switch, like every
 * other event's: closing one must never take another down with it - in
 * particular, /ihh and /ihhsearegatta run the same arc but are paused
 * separately.
 */
export const IHH_PAUSED = false;

/**
 * Leaderboard bucket for the /ihh funnel. Every /ihh score and report is
 * tagged with it, and the /ihh board filters to it - which is what keeps its
 * standings clear of every other event's history, the regatta's included.
 *
 * This is the value written to the `source` column for this event, and the
 * whole reason /ihh exists alongside /ihhsearegatta: the same flow, collected
 * into a column of its own.
 */
export const IHH_SOURCE = "ihh";

/**
 * Temporarily closes the /ihh Reaction Time Challenge, and with it the
 * leaderboard it feeds. The /ihh sibling of IHHSEA_CHALLENGE_CLOSED, and
 * deliberately its own switch: /ihh opens with the arc walkable end to end
 * while the regatta's own challenge stays closed. Applied per variant in
 * resolveFlow; flip to `true` (and redeploy) to end the session on the
 * "That's a wrap!" screen straight after the landing.
 */
export const IHH_CHALLENGE_CLOSED = false;

/**
 * Independent pause switch for the Pantai Hospital KL event (/phkl and its TV
 * board). Its own switch, like every other event's: closing one must never
 * take another down with it. There is no challenge-closed switch for this
 * event; the arc is open for as long as the route is up.
 */
export const PHKL_PAUSED = false;

/**
 * Leaderboard bucket for the Pantai Hospital KL funnel. Every /phkl score and
 * report is tagged with it, and the PHKL board filters to it - which is what
 * keeps its standings clear of every other event's history.
 *
 * This is the value written to the `source` column for this event.
 */
export const PHKL_SOURCE = "phkl";

/**
 * Independent pause switch for the GMS x #MambaCares community run
 * (/mambacares). Its own switch, like every other event's: closing one must
 * never take another down with it. There is no challenge-closed switch for
 * this event; the arc is open for as long as the route is up.
 */
export const MAMBACARES_PAUSED = false;

/**
 * Leaderboard bucket for the #MambaCares run funnel. Every /mambacares score
 * and report is tagged with it, and the rank on its report is read back from
 * it - which is what keeps its standings clear of every other event's history.
 *
 * This is the value written to the `source` column for this event.
 */
export const MAMBACARES_SOURCE = "mambacares";

/**
 * Independent pause switch for the GMS x Urban Milers run (/urbanmilers and
 * its TV board). Its own switch, like every other event's: /urbanmilers and
 * /mambacares run the same arc and must never be closed together by accident.
 */
export const URBANMILERS_PAUSED = false;

/**
 * Leaderboard bucket for the Urban Milers run funnel. Every /urbanmilers score
 * and report is tagged with it, its board filters to it and the rank on its
 * report is read back from it.
 *
 * A bucket of its own is the whole reason this route exists alongside
 * /mambacares, and it is what starts the board empty: standings are filtered by
 * this tag, so /urbanmilers opens on a clean board with no #MambaCares row on
 * it, and no row already recorded is touched or moved to get there. Nothing is
 * ever deleted - rows keep the tag they were written with.
 *
 * To clear this board later (a second run day that should not open on the
 * first's standings), give this a new value - "urbanmilers-day2" - and
 * redeploy: the earlier rows keep their tag and simply stop appearing.
 */
export const URBANMILERS_SOURCE: string = "urbanmilers";

/**
 * Independent pause switch for the Siloam Neuroscience Summit
 * (/siloamneurosciencesummit and its TV board). Its own switch, like every
 * other event's: closing one must never take another down with it. There is no
 * challenge-closed switch for this event; the arc is open for as long as the
 * route is up.
 */
export const SILOAM_PAUSED = false;

/**
 * The summit's standings have been recapped and the winners announced.
 *
 * Not a pause and not a challenge-closed switch: the whole arc stays walkable.
 * It puts ONE page between the landing and the game - the notice that the
 * results are final - so anyone who scans the code after the prize-giving is
 * told where things stand before they play, and can still play if they want
 * to. Nothing behind it changes: the game still records, the questionnaire and
 * the report are untouched.
 *
 * Flip to `false` (and redeploy) to take the notice back out; the landing then
 * leads straight into the processing-speed primer again, exactly as /phkl's
 * does. It reaches the summit and nothing else - the notice is inserted per
 * variant in resolveFlow, so /general and every event sharing that arc walk
 * their own flow untouched.
 */
export const SILOAM_SCORES_FINAL = true;

/**
 * Leaderboard bucket for the Siloam Neuroscience Summit funnel. Every
 * /siloamneurosciencesummit score and report is tagged with it, its board
 * filters to it and the rank on its report is read back from it - which is what
 * keeps its standings clear of every other event's history.
 *
 * This is the value written to the `source` column for this event, and it is
 * what starts this board empty: the arc is /phkl's, so nothing but this tag
 * keeps the Kuala Lumpur standings off a screen in Jakarta. Nothing is ever
 * deleted to get there - rows keep the tag they were written with.
 *
 * To clear this board later (a second summit day that should not open on the
 * first's standings), give this a new value - "siloam-day2" - and redeploy: the
 * earlier rows keep their tag and simply stop appearing.
 */
export const SILOAM_SOURCE: string = "siloam";

/**
 * Independent pause switch for /general (and its TV board). Its own switch,
 * like every other event's: /general runs the summit's arc and must never be
 * closed by a change made to another event.
 */
export const GENERAL_PAUSED = false;

/**
 * Leaderboard bucket for the /general funnel. Every /general score and report
 * is tagged with it, its board filters to it and the rank on its report is read
 * back from it.
 *
 * A bucket of its own is the whole reason this route exists alongside the
 * summit, and it is what starts the board empty: standings are filtered by this
 * tag, so /general opens clean with no Jakarta row on it, and no row already
 * recorded is touched or moved to get there. Nothing is ever deleted - rows
 * keep the tag they were written with.
 *
 * This is the value written to the `source` column for this event. Changing the
 * literal strands every row already written under it, which is exactly how a
 * second event day gets a fresh board: give this a new value - "general-day2" -
 * and redeploy, and the earlier rows keep their tag and simply stop appearing.
 */
export const GENERAL_SOURCE: string = "general";

/**
 * Independent pause switch for 22 Grams (/22grams and its TV board). Its own
 * switch, like every other event's: /22grams and /ntuhomecoming run the same
 * arc and must never be closed together by accident.
 */
export const TWENTY_TWO_GRAMS_PAUSED = false;

/**
 * Leaderboard bucket for the 22 Grams funnel. Every /22grams score and report
 * is tagged with it, its board filters to it and the rank on its post-game
 * card is read back from it.
 *
 * A bucket of its own is the whole reason this route exists alongside
 * /ntuhomecoming, and it is what starts the board empty: standings are filtered
 * by this tag, so /22grams opens on a clean board with no NTU Homecoming row on
 * it, and no row already recorded is touched or moved to get there. Nothing is
 * ever deleted - rows keep the tag they were written with.
 *
 * This is the value written to the `source` column for this event. Changing the
 * literal strands every row already written under it, which is exactly how a
 * second event day gets a fresh board: give this a new value - "22grams-day2" -
 * and redeploy, and the earlier rows keep their tag and simply stop appearing.
 */
export const TWENTY_TWO_GRAMS_SOURCE: string = "22grams";

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
    case "ntuhomecoming":
      return NTU_HOMECOMING_SOURCE;
    case "ihhsearegatta":
      return IHHSEA_SOURCE;
    case "ihh":
      return IHH_SOURCE;
    case "phkl":
      return PHKL_SOURCE;
    case "mambacares":
      return MAMBACARES_SOURCE;
    case "urbanmilers":
      return URBANMILERS_SOURCE;
    case "siloam":
      return SILOAM_SOURCE;
    case "general":
      return GENERAL_SOURCE;
    case "22grams":
      return TWENTY_TWO_GRAMS_SOURCE;
    case "event2":
      return "event2";
    case "event":
      return "event";
    default:
      return null;
  }
}
