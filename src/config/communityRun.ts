import type { QuizVariant } from "@/types/funnel";
import { MAMBACARES_RUN } from "@/config/mambacares";
import { URBANMILERS_RUN } from "@/config/urbanmilers";

/**
 * A community run that ends its report on a fundraiser rather than on a
 * screening offer - #MambaCares (/mambacares) and Urban Milers (/urbanmilers).
 *
 * The two events share every screen of the arc, so the screens read the
 * running event's campaign through `communityRunFor` rather than one event's
 * constants by name. That is the same rule `arcCopyFor` applies to the words:
 * a figure or a link changed for one run must never quietly change the other's,
 * because both are printed next to a QR code and read off a phone at a finish
 * line.
 *
 * Each run's own values live in its config file (config/mambacares.ts,
 * config/urbanmilers.ts) - editing that one file and redeploying is the whole
 * update, as it was before this indirection existed.
 */

/** A logo in one of the two rows at the foot of a run's report. */
export interface RunLogo {
  /**
   * A file under public/images/ that may not have been uploaded yet: while it
   * is missing the slot draws `name` instead of a broken image.
   */
  src: string;
  /** Both the alt text and that stand-in. */
  name: string;
}

/** The thermometer's figures. A snapshot, not a live total - see below. */
export interface RunCampaign {
  /** Currency symbol, prefixed to both figures. */
  currency: string;
  raised: number;
  goal: number;
  /** As printed: "Last updated: {lastUpdated}". */
  lastUpdated: string;
  /** As printed in the closing section: "Help us hit $5,000 by {deadline}." */
  deadline: string;
}

/** The campaign photographs on a run's report. */
export interface RunPhotos {
  /** The pair beside the campaign thermometer. */
  campaignPair: readonly string[];
  /** The wide one above the closing call to action. */
  closing: string;
}

/**
 * Everything the fundraising report says about a run's campaign that is a
 * number, a link or a file rather than a sentence. The sentences around them
 * are in config/copy.ts, under this event's own screen block.
 */
export interface CommunityRun {
  /**
   * Where every "Donate" button goes - the campaign's short link, which is also
   * what is printed on the run's posters and what its board's QR encodes.
   */
  donationUrl: string;
  /**
   * The same link as the report prints it, under the buttons. Kept in step with
   * `donationUrl` on purpose: this line is there to be read off a phone and
   * typed in, so it has to be the address that actually opens.
   */
  donationLabel: string;
  campaign: RunCampaign;
  runningPartners: readonly RunLogo[];
  giveawaySponsors: readonly RunLogo[];
  photos: RunPhotos;
  /** Alt text for the photographs - one description covers all of them. */
  photoAlt: string;
}

/**
 * The campaign for whichever run is being walked.
 *
 * Defaults to #MambaCares, which is also what the /event-v7 preview walks: it
 * is that run's arc with the share moment moved, so a card sent from the
 * walkthrough has to carry the run's real campaign.
 */
export function communityRunFor(variant: QuizVariant): CommunityRun {
  return variant === "urbanmilers" ? URBANMILERS_RUN : MAMBACARES_RUN;
}

/** A campaign figure, formatted the way the report prints it ("$1,120"). */
export function campaignAmount(run: CommunityRun, value: number): string {
  return `${run.campaign.currency}${value.toLocaleString("en-SG")}`;
}

/** How far along the thermometer is, clamped to 0-1. */
export function campaignProgress(run: CommunityRun): number {
  const { raised, goal } = run.campaign;
  if (goal <= 0) return 0;
  return Math.min(1, Math.max(0, raised / goal));
}
