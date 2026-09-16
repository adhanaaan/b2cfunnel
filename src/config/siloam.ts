/**
 * The Siloam Neuroscience Summit's own numbers: what the board offers, and how
 * that offer is worded.
 *
 * Kept here rather than inside the board so the prize can be changed without
 * touching a component, the way every other event's campaign figures live in a
 * config of their own.
 */

/**
 * The prize on the TV board.
 *
 * PLACEHOLDER AMOUNT, TO CONFIRM. /phkl offers RM 170 of Grab vouchers across
 * its top three; this is the same offer converted into rupiah and rounded to
 * something that prints cleanly on a poster. It is a number to sign off, not a
 * number to trust: change `total` here and the board, its aria-label and the
 * README all follow, because nothing else states it.
 *
 * Written in the Indonesian convention - a full stop as the thousands
 * separator - because it is read off a screen in Jakarta. Split across two
 * lines because that is how the frame sets it (see the board's prize panel).
 */
export const SILOAM_PRIZE = {
  /** The whole pot, across the top three. */
  total: "Rp 600.000",
  /** The two lines the panel sets the offer in, under "Win a total of". */
  lines: ["Rp 600.000 Grab", "Vouchers"] as const,
} as const;

// How deep the prize goes is NOT here on purpose: the board writes "Top 3"
// from its own PODIUM_N, so the panel cannot promise a prize the rows beneath
// it do not show.
