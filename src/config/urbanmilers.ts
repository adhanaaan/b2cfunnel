/**
 * GMS x Urban Milers - the community run at /urbanmilers.
 *
 * The #MambaCares arc run for Urban Milers, on a leaderboard of its own. Same
 * rule as that file: everything the fundraising report says about the campaign
 * that is a number, a link or a file is here rather than in a component, so
 * editing this one file and redeploying is the whole update.
 *
 * WHAT IS STILL #MAMBACARES', DELIBERATELY. This run raises for the same
 * Dementia Singapore campaign, so the donation link, the thermometer's figures
 * and the crew and sponsor logos start as that campaign's - which is what makes
 * the report and the board read correctly on the day the route goes up, rather
 * than showing an empty fundraiser. Each is an independent value: point any of
 * them somewhere else here and only /urbanmilers moves.
 *
 * WHAT IS NOT SHARED, and must never be: the leaderboard bucket
 * (URBANMILERS_SOURCE), the pause switch, the route, the board and this event's
 * words (COPY.screens.urbanmilers). Those are what make it its own event.
 */

import type { CommunityRun } from "@/config/communityRun";
import {
  MAMBACARES_CAMPAIGN,
  MAMBACARES_DONATION_LABEL,
  MAMBACARES_DONATION_URL,
  MAMBACARES_GIVEAWAY_SPONSORS,
  MAMBACARES_PHOTOS,
  MAMBACARES_PHOTO_ALT,
  MAMBACARES_RUNNING_PARTNERS,
} from "@/config/mambacares";

/**
 * Where every "Donate" button on the /urbanmilers report goes, and what its
 * board's QR encodes.
 *
 * The #MambaCares short link, because it is the same campaign. Give this run
 * its own tracked link by replacing the value here - the report's printed line
 * (URBANMILERS_DONATION_LABEL) has to be changed with it, since that line is
 * there to be typed in and must be the address that actually opens.
 */
export const URBANMILERS_DONATION_URL = MAMBACARES_DONATION_URL;

/** The same link as the report prints it under the buttons. */
export const URBANMILERS_DONATION_LABEL = MAMBACARES_DONATION_LABEL;

/**
 * The campaign thermometer on the report.
 *
 * The #MambaCares snapshot: one campaign, one total, so the two reports cannot
 * show a donor two different numbers for the same fundraiser. Replace this with
 * an object of this run's own (`raised`, `goal`, `lastUpdated`, `deadline`) the
 * moment it is raising against a separate target.
 */
export const URBANMILERS_CAMPAIGN = MAMBACARES_CAMPAIGN;

/**
 * The running crews at the foot of the report.
 *
 * The crews behind the campaign, as /mambacares lists them. The campaign
 * paragraph states the count in words and urbanmilersFlow.test.ts holds the two
 * to each other, so adding a crew here means editing that sentence in
 * config/copy.ts as well.
 */
export const URBANMILERS_RUNNING_PARTNERS = MAMBACARES_RUNNING_PARTNERS;

/** The giveaway sponsors, on the same terms as the crews above. */
export const URBANMILERS_GIVEAWAY_SPONSORS = MAMBACARES_GIVEAWAY_SPONSORS;

/**
 * The Dementia Singapore photographs on the report. Optional like every image
 * in this arc: each falls back to a warm tile until its file lands, so pointing
 * these at /images/urbanmilers/ before the exports arrive costs the report its
 * pictures and nothing else.
 */
export const URBANMILERS_PHOTOS = MAMBACARES_PHOTOS;

/** Alt text for the photographs - one description covers all of them. */
export const URBANMILERS_PHOTO_ALT = MAMBACARES_PHOTO_ALT;

/** The campaign as the shared report screens read it (see CommunityRun). */
export const URBANMILERS_RUN: CommunityRun = {
  donationUrl: URBANMILERS_DONATION_URL,
  donationLabel: URBANMILERS_DONATION_LABEL,
  campaign: URBANMILERS_CAMPAIGN,
  runningPartners: URBANMILERS_RUNNING_PARTNERS,
  giveawaySponsors: URBANMILERS_GIVEAWAY_SPONSORS,
  photos: URBANMILERS_PHOTOS,
  photoAlt: URBANMILERS_PHOTO_ALT,
};
