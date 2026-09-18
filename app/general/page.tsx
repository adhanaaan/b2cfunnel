import type { Metadata } from "next";
import { Funnel } from "@/components/Funnel";
import { EventEnded } from "@/components/screens/EventEnded";
import { GENERAL_PAUSED } from "@/config/event";

export const metadata: Metadata = {
  title: "Reaction Time Challenge - Brain Health Check",
  description:
    "How fast does your brain process? Take a quick symbol-matching test to find out your brain processing speed, then explore your full brain health profile.",
  openGraph: {
    title: "Reaction Time Challenge",
    description:
      "How fast does your brain process? A 60-second symbol-matching test.",
    images: ["/og-event-v3.png"],
  },
};

/**
 * /general - the Reaction Time Challenge with no event's name on it.
 *
 * The /siloamneurosciencesummit arc, shared rather than rebuilt (see
 * GENERAL_FLOW, which is that event's, which is /phkl's): a processing-speed
 * primer and the age question before the game, a "great job" beat that walks
 * itself into the quiz primer, the questionnaire, and the booth report. Sharing
 * the flow array is what keeps this route's question set - and therefore every
 * score it records - comparable with the summit's, /phkl's and event2's.
 *
 * Three things are deliberately not the summit's:
 *
 * - **No language choice.** The summit is the only multilingual event on this
 *   funnel (see `offersLanguageChoice`); this route is English-only, like every
 *   other one, so nothing mounts a `LanguageProvider` here and `useCopy()`
 *   hands every screen the English config itself.
 * - **The landing is /22grams'**: the plain two-row landing at the roomier
 *   size with no partner block, the one-tick consent, and the SHARED privacy
 *   policy rather than the summit's Indonesian one - there is no country-
 *   specific notice to link from a route with no country in its name.
 * - **The board is /ntuhomecoming's** - the scan rail beside the live
 *   standings, no prize panel - rather than the summit's prize board, because
 *   this route promises no vouchers. It is at /general/leaderboard.
 *
 * What it keeps of the summit is the report: the ReCOGnAIze assessment and a
 * conversation with the team, drawn by the same `SiloamOffer` and
 * `SiloamStickyCta` from this route's own copy block.
 *
 * Its own bucket, `general`, so its standings open empty and rank only what is
 * played here. GENERAL_PAUSED is its own switch. There is no challenge-closed
 * switch: the arc is open for as long as the route is up.
 */
export default function GeneralPage() {
  if (GENERAL_PAUSED) return <EventEnded />;
  return <Funnel variant="general" />;
}
