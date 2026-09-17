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

/** "< 30 s", as the poster sets it (Figma 925:9236, uppercased by CSS). */
export const SHARP_SHOT_THRESHOLD_LABEL = `< ${THRESHOLD_SECONDS} s`;

/**
 * Where the drink is redeemed, named on the poster. One value - repoint it and
 * only this event moves.
 */
export const SHARP_SHOT_VENUE = "22 Grams Coffee Frasers Tower";

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
 * The poster's words, to Figma 925:9236.
 *
 * Every line naming the threshold or the venue is written from the constants
 * above rather than typed out beside them.
 */
export const SHARP_SHOT_POSTER = {
  /** The campaign lockup, top left, one word per line. */
  week: ["Sharp", "Shot", "Week"],

  /**
   * The headline, in the design's two type sizes: the sentence, then the time
   * it is about, set larger on its own line.
   */
  headingLead: "Congratulations on beating the clock",
  headingThreshold: SHARP_SHOT_THRESHOLD_LABEL,

  /**
   * The offer, in the two paragraphs the design sets beside the drink.
   *
   * The first keeps the design's own line break, because its words are fixed
   * and the break was authored. The second is one string and wraps inside its
   * box, because it carries the venue: hard-coding those lines would put the
   * layout at the mercy of a name nobody would think to re-break after
   * changing it.
   */
  reward: {
    screenshot: ["Screenshot this", "pop up and"],
    drink: `Get your free drink @${SHARP_SHOT_VENUE}`,
  },

  /** The one condition on the offer, under it (925:9240). */
  fineprint: "*while redemption last",

  /** The unit the score is printed in: "28.5 seconds". */
  secondsSuffix: "seconds",

  /**
   * Who measured the thing the player is about to screenshot.
   *
   * It sits over the score rather than at the foot on purpose: the score is
   * the one part of this card a player re-reads and shows people, and until
   * now nothing on it said where the number came from.
   */
  measuredBy: ["Processing speed, measured by", "Gray Matter Solutions"],

  /** Under the close: why that measurement is worth anything. */
  provenance: "Built with NTU's Dementia Research Centre",

  /**
   * Under the code. Held to one line at the width the code leaves it - a
   * longer label wraps onto two and the second runs off the card.
   */
  scanLabel: "Find out more",

  /** The close: the claim this campaign is actually built on. */
  footnote:
    "Unsweetened caffeinated coffee is linked to lower dementia risk (UK Biobank)",

  /** How to get rid of it. The whole poster is the target. */
  dismiss: "Tap anywhere to close",
  closeLabel: "Close",
} as const;

/**
 * The banner pinned to the /22grams report (Figma 925:9246): what is still on
 * offer, and the way back to the game.
 *
 * It is the report's one sticky call to action, so it says the offer rather
 * than repeating the poster: a reader this far down either has not beaten the
 * clock or could beat it again, and either way the useful thing is another go.
 */
export const SHARP_SHOT_BANNER = {
  /** Two lines, as the design breaks them (923:8780). */
  heading: [`Beat the clock ${SHARP_SHOT_THRESHOLD_LABEL},`, "Get a free drink!"],
  fineprint: "*while redemption last",
  cta: "Retry Game",
} as const;
