/**
 * 22 Grams (/22grams) - Sharp Shot Week's own numbers and words.
 *
 * Kept here rather than inside the poster component so the threshold, the
 * venue and the offer can be changed without touching a screen, the way every
 * other event's campaign figures live in a config of their own
 * (config/siloam.ts, config/urbanmilers.ts).
 *
 * The threshold is the reason this file exists. It decides who is handed a
 * free drink AND it is printed on the poster, so it is ONE number here and
 * every label below is written from it. Typing "< 30s" beside a 30000 would
 * let the two drift, and the way that fails is a barista holding a poster that
 * promises something the funnel did not actually award.
 */

/**
 * Beat this and the poster appears. Strictly less than, so a run of exactly
 * 30.0s does not qualify - the poster says "beating the clock", and matching
 * it is not beating it.
 */
export const SHARP_SHOT_THRESHOLD_MS = 30_000;

/** "30" - the threshold in whole seconds, for the labels below. */
const THRESHOLD_SECONDS = SHARP_SHOT_THRESHOLD_MS / 1000;

/** "< 30s", as the poster prints it (uppercased by CSS, not here). */
export const SHARP_SHOT_THRESHOLD_LABEL = `< ${THRESHOLD_SECONDS}s`;

/**
 * Where the drink is redeemed. One value, named on the poster - repoint it and
 * only this event moves.
 */
export const SHARP_SHOT_VENUE = "22g Frasers Tower";

/**
 * Did this run earn the drink?
 *
 * The one predicate for the offer. A screen asking "was it under 30 seconds?"
 * for itself is how a rounding rule or a missing time ends up answered
 * differently in two places.
 *
 * A missing time is not a win: the game has not been finished. A zero or
 * negative time is not one either - that is a broken reading, not a fast run.
 */
export function isSharpShot(timeMs?: number): boolean {
  return (
    typeof timeMs === "number" &&
    Number.isFinite(timeMs) &&
    timeMs > 0 &&
    timeMs < SHARP_SHOT_THRESHOLD_MS
  );
}

/**
 * The poster's words, in the lines the artwork breaks them into - so no font
 * metric can move a break that the design set deliberately.
 *
 * Every line naming the threshold or the venue is written from the constants
 * above rather than typed out beside them.
 */
export const SHARP_SHOT_POSTER = {
  /** The campaign lockup, top left, one word per line. */
  week: ["Sharp", "Shot", "Week"],

  /** The headline, three lines, set in caps by CSS. */
  heading: [
    "Congratulations",
    "on beating",
    `the clock ${SHARP_SHOT_THRESHOLD_LABEL}`,
  ],

  /** The offer, in the orange, two lines. */
  reward: [
    "Screenshot this poster and",
    `Get your free drink @${SHARP_SHOT_VENUE}`,
  ],

  /** The one condition on the offer. */
  fineprint: "*while redemptions last",

  /** The unit the score is printed in: "28.5 seconds". */
  secondsSuffix: "seconds",

  /** The close: the Lancet figure, then the occasion. */
  footnote: "Up to 45% of dementia risk could be prevented",
  occasion: "World Alzheimer's Month",

  /** The dismissal, under the poster - not part of the artwork. */
  dismiss: "Continue",
  closeLabel: "Close",
} as const;
