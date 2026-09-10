/**
 * GMS x #MambaCares - the World Alzheimer's Month community run (/mambacares).
 *
 * Everything the fundraising report says about the campaign lives here rather
 * than in the components, because all of it moves during the campaign: the
 * total climbs, the deadline passes, crews and sponsors join. Editing this one
 * file and redeploying is the whole update - no component has a number in it.
 */

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

/** A campaign figure, formatted the way the report prints it ("$1,120"). */
export function campaignAmount(value: number): string {
  return `${MAMBACARES_CAMPAIGN.currency}${value.toLocaleString("en-SG")}`;
}

/** How far along the thermometer is, clamped to 0-1. */
export function campaignProgress(): number {
  const { raised, goal } = MAMBACARES_CAMPAIGN;
  if (goal <= 0) return 0;
  return Math.min(1, Math.max(0, raised / goal));
}

/**
 * A logo in one of the two rows at the foot of the report.
 *
 * `src` is a file under public/images/mambacares/ that may not have been
 * uploaded yet: while it is missing the slot draws the name instead of a
 * broken image (see MambaPartners), so the rows keep their shape and it is
 * obvious which one is still outstanding. `name` is both the alt text and that
 * stand-in, so correcting a crew's name here corrects it in both places.
 *
 * Order is left to right, as in Figma (794:17895).
 */
export interface MambaLogo {
  src: string;
  name: string;
}

/**
 * The running crews, as read off the Figma. Names are a best reading of the
 * artwork - correct any that are wrong here and the alt text follows.
 */
export const MAMBACARES_RUNNING_PARTNERS: MambaLogo[] = [
  { src: "/images/mambacares/running-partner-1.png", name: "Black Mamba" },
  { src: "/images/mambacares/running-partner-2.png", name: "Running partner 2" },
  { src: "/images/mambacares/running-partner-3.png", name: "okay. and running" },
  { src: "/images/mambacares/running-partner-4.png", name: "SGFR" },
  { src: "/images/mambacares/running-partner-5.png", name: "Running partner 5" },
];

/** The giveaway sponsors, left to right. Same rules as the crews above. */
export const MAMBACARES_GIVEAWAY_SPONSORS: MambaLogo[] = [
  { src: "/images/mambacares/sponsor-1.png", name: "2050 Coffee" },
  { src: "/images/mambacares/sponsor-2.png", name: "Sponsor 2" },
  { src: "/images/mambacares/sponsor-3.png", name: "Sponsor 3" },
  { src: "/images/mambacares/sponsor-4.png", name: "PRFM" },
  { src: "/images/mambacares/sponsor-5.png", name: "Sponsor 5" },
  { src: "/images/mambacares/sponsor-6.png", name: "Sponsor 6" },
  { src: "/images/mambacares/sponsor-7.png", name: "Sunday Shades" },
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
