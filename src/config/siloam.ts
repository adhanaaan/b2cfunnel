/**
 * The Siloam Neuroscience Summit's own numbers: what the board offers, and how
 * that offer is worded.
 *
 * Kept here rather than inside the board so the prizes can be changed without
 * touching a component, the way every other event's campaign figures live in a
 * config of their own.
 */

/**
 * How a rupiah amount is written on the board: "IDR 300k".
 *
 * One formatter rather than a string per prize, so every amount on the panel is
 * spelled the same way and a new tier cannot arrive in a different format.
 */
const idr = (thousands: number) => `IDR ${thousands}k`;

/**
 * The prize ladder, top to bottom, from Figma 892:7134.
 *
 * Amounts are NUMBERS (thousands of rupiah), not strings, so the headline
 * total below can be summed from them rather than typed out beside them. That
 * is the whole point: the panel prints "Win a total of X" directly above the
 * rows that add up to X, and the two must not be able to disagree on a screen
 * nobody is going to re-read at an event.
 *
 * The length is also the depth of the prize: the board reads it as its
 * PODIUM_N, so the number of gradient rows in the standings, the "Top 3" in
 * the eyebrow and the rows of this ladder are one number in one place.
 */
const LADDER = [
  { rank: "1ST", thousands: 300 },
  { rank: "2ND", thousands: 200 },
  { rank: "3RD", thousands: 100 },
] as const;

export const SILOAM_PRIZE = {
  /** One row per prize: the rank chip, and the amount beside it. */
  ladder: LADDER.map((tier) => ({
    rank: tier.rank,
    thousands: tier.thousands,
    /** "IDR 300k voucher" - what the row prints. */
    label: `${idr(tier.thousands)} voucher`,
  })),

  /** "IDR 600k" - the sum of the ladder, never typed out beside it. */
  total: idr(LADDER.reduce((sum, tier) => sum + tier.thousands, 0)),
} as const;

/**
 * The two lines of the panel's headline, as the design breaks them
 * (892:7171): "Win a total of" over the amount. Written from the ladder's own
 * total, so it cannot promise a pot the rows below it do not add up to.
 */
export const SILOAM_PRIZE_HEADLINE = [
  "Win a total of",
  `${SILOAM_PRIZE.total} Grab Vouchers`,
] as const;

/**
 * How deep the prize goes, and with it how many rows of the standings ride the
 * prize gradient. Read from the ladder rather than written beside it, so the
 * board cannot show a podium the prize does not reach or vice versa.
 */
export const SILOAM_PODIUM_N = SILOAM_PRIZE.ladder.length;
