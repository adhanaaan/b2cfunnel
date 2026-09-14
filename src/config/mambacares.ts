/**
 * GMS x #MambaCares - the World Alzheimer's Month community run (/mambacares).
 *
 * Everything the fundraising report says about the campaign lives here rather
 * than in the components, because all of it moves during the campaign: the
 * total climbs, the deadline passes, crews and sponsors join. Editing this one
 * file and redeploying is the whole update - no component has a number in it.
 *
 * The screens reach these values through `communityRunFor` (config/
 * communityRun.ts) rather than by importing them directly, because the same
 * arc also serves Urban Milers (/urbanmilers): MAMBACARES_RUN at the foot of
 * this file is that handover, and is what a screen actually reads.
 */

import type { CommunityRun, RunLogo } from "@/config/communityRun";

/**
 * Where every "Donate" button goes - the campaign's short link, which is also
 * what is printed on the run's posters and shared in the crews' chats.
 *
 * A redirect rather than the giving.sg page itself, so where it points can be
 * changed on the day without a deploy. It is the destination the share sheet
 * hands over too.
 */
export const MAMBACARES_DONATION_URL = "https://bit.ly/gms-mambacares";

/**
 * The same link as the report prints it, under the buttons. Kept in step with
 * MAMBACARES_DONATION_URL on purpose: this line is there to be read off a
 * phone and typed in, so it has to be the address that actually opens.
 */
export const MAMBACARES_DONATION_LABEL = "bit.ly/gms-mambacares";

/**
 * The campaign thermometer on the report.
 *
 * `raised` and `lastUpdated` are a snapshot, not a live figure - the page has
 * nothing to read a total from - so the report shows the date the number was
 * taken alongside it rather than implying it is current. Update both together.
 */
export const MAMBACARES_CAMPAIGN = {
  /** Currency symbol, prefixed to both figures. */
  currency: "$",
  raised: 1120,
  goal: 5000,
  /** As printed: "Last updated: {lastUpdated}". */
  lastUpdated: "10 September",
  /** As printed in the closing section: "Help us hit $5,000 by {deadline}." */
  deadline: "30 September",
} as const;

/**
 * The six running crews, in the order the files were uploaded.
 *
 * The names that are filled in are the ones readable on the artwork; the rest
 * are honest placeholders. Correcting one here corrects its alt text - which
 * is the only place a name is read once every file has landed.
 *
 * The count is load-bearing: the campaign copy says "six running crews", and
 * mambacaresFlow.test.ts holds the two to each other, so a seventh crew means
 * editing that sentence in config/copy.ts as well.
 */
export const MAMBACARES_RUNNING_PARTNERS: RunLogo[] = [
  { src: "/images/mambacares/running-partner-1.png", name: "Black Mamba" },
  { src: "/images/mambacares/running-partner-2.png", name: "Running partner 2" },
  { src: "/images/mambacares/running-partner-3.png", name: "2050 Coffee" },
  { src: "/images/mambacares/running-partner-4.png", name: "SGFR" },
  { src: "/images/mambacares/running-partner-5.png", name: "okay. and running" },
  { src: "/images/mambacares/running-partner-6.png", name: "Running partner 6" },
];

/** The five giveaway sponsors, left to right. Same rules as the crews above. */
export const MAMBACARES_GIVEAWAY_SPONSORS: RunLogo[] = [
  { src: "/images/mambacares/sponsor-1.png", name: "Sponsor 1" },
  { src: "/images/mambacares/sponsor-2.png", name: "PRFM" },
  { src: "/images/mambacares/sponsor-3.png", name: "Sponsor 3" },
  { src: "/images/mambacares/sponsor-4.png", name: "Sponsor 4" },
  { src: "/images/mambacares/sponsor-5.png", name: "Sunday Shades" },
];

/**
 * The Dementia Singapore photographs on the report. Optional like every other
 * file here: each falls back to a warm tile until it lands.
 */
export const MAMBACARES_PHOTOS = {
  /** The pair beside the campaign thermometer. */
  campaignPair: [
    "/images/mambacares/campaign-1.png",
    "/images/mambacares/campaign-2.png",
  ],
  /** The wide one above the closing call to action. */
  closing: "/images/mambacares/campaign-wide.png",
} as const;

/** Alt text for the photographs - one description covers all three. */
export const MAMBACARES_PHOTO_ALT =
  "People living with dementia taking part in a Dementia Singapore activity";

/**
 * The campaign as a screen reads it.
 *
 * The constants above stay exported by name - they are what an editor opens
 * this file to change, and what the tests hold to - and this is the one shape
 * the shared report screens consume, so #MambaCares and Urban Milers can run
 * the same components without either one's figures reaching the other's page.
 */
export const MAMBACARES_RUN: CommunityRun = {
  donationUrl: MAMBACARES_DONATION_URL,
  donationLabel: MAMBACARES_DONATION_LABEL,
  campaign: MAMBACARES_CAMPAIGN,
  runningPartners: MAMBACARES_RUNNING_PARTNERS,
  giveawaySponsors: MAMBACARES_GIVEAWAY_SPONSORS,
  photos: MAMBACARES_PHOTOS,
  photoAlt: MAMBACARES_PHOTO_ALT,
};
