/**
 * The third Pantai Hospital KL activation's own numbers: what the /phkl-3
 * board offers, and how that offer is worded.
 *
 * Kept here rather than inside the board so the prizes can be changed without
 * touching a component, the way config/siloam.ts holds the summit's.
 */

/**
 * How a ringgit amount is written on the board: "RM 150".
 *
 * One formatter rather than a string per prize, so every amount on the panel is
 * spelled the same way and a new tier cannot arrive in a different format.
 */
const rm = (ringgit: number) => `RM ${ringgit}`;

/**
 * The prize ladder, top to bottom, from Figma 892:7134.
 *
 * Amounts are NUMBERS (ringgit), not strings, so the headline total below is
 * summed from them rather than typed out beside them: the panel prints "Win a
 * total of X" directly above the rows that add up to X, and the two must not
 * be able to disagree on a screen nobody is going to re-read at an event.
 *
 * The length is also the depth of the prize: the board reads it as its
 * PODIUM_N, so the number of gradient rows in the standings, the "Top 3" in
 * the eyebrow and the rows of this ladder are one number in one place.
 */
const LADDER = [
  { rank: "1ST", ringgit: 150 },
  { rank: "2ND", ringgit: 100 },
  { rank: "3RD", ringgit: 50 },
] as const;

export const PHKL3_PRIZE = {
  /** One row per prize: the rank chip, and the amount beside it. */
  ladder: LADDER.map((tier) => ({
    rank: tier.rank,
    ringgit: tier.ringgit,
    /** "RM 150 voucher" - what the row prints. */
    label: `${rm(tier.ringgit)} voucher`,
  })),

  /** "RM 300" - the sum of the ladder, never typed out beside it. */
  total: rm(LADDER.reduce((sum, tier) => sum + tier.ringgit, 0)),
} as const;

/**
 * The two lines of the panel's headline, as the design breaks them
 * (892:7171): "Win a total of" over the amount. Written from the ladder's own
 * total, so it cannot promise a pot the rows below it do not add up to.
 */
export const PHKL3_PRIZE_HEADLINE = [
  "Win a total of",
  `${PHKL3_PRIZE.total} Grab Vouchers`,
] as const;

/**
 * How deep the prize goes, and with it how many rows of the standings ride the
 * prize gradient. Read from the ladder rather than written beside it, so the
 * board cannot show a podium the prize does not reach or vice versa.
 */
export const PHKL3_PODIUM_N = PHKL3_PRIZE.ladder.length;
