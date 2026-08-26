/**
 * Organisation details and dates used by the privacy policy page.
 *
 * Kept here so the legal contact points are a single edit. NOTE FOR REVIEW:
 * the DPO address and the retention periods below should be confirmed by
 * whoever owns data protection before this goes live - they are the two
 * things a PDPA access request will be measured against.
 */
export const PRIVACY = {
  /** Entity that decides how this data is used (the PDPA "organisation"). */
  organisation: "Gray Matter Solutions Pte Ltd",
  organisationNote: "a spin-off from Nanyang Technological University, Singapore",
  /** Data Protection Officer contact, as required by PDPA s.11(3). */
  dpoEmail: "tech@graymattercognition.com",
  /** Same number already used for the assessment enquiries. */
  whatsappNumber: "6596747608",
  /** Shown at the top of the policy; update whenever the text changes. */
  lastUpdated: "26 August 2026",
  /** How long each kind of record is kept (PDPA Retention Limitation). */
  retention: {
    leaderboard: "the run of the event and up to 6 months afterwards",
    contact: "24 months from your last interaction with us, unless you withdraw consent sooner",
    aggregates: "indefinitely, once they can no longer identify you",
  },
} as const;
