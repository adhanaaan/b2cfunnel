import type { Metadata } from "next";
import { Funnel } from "@/components/Funnel";
import { EventEnded } from "@/components/screens/EventEnded";
import { EISAI_PAUSED } from "@/config/event";

export const metadata: Metadata = {
  title: "Brain Speed Challenge - Eisai x GMS",
  description:
    "Who's the fastest brain at Eisai? Take a quick symbol-matching test to find out your brain processing speed, then see your result and the live leaderboard.",
  openGraph: {
    title: "Who's the fastest brain at Eisai?",
    description:
      "A 60-second symbol-matching test for World Alzheimer's Day, from Gray Matter Solutions.",
    images: ["/og-event-v3.png"],
  },
};

/**
 * /eisai - Eisai's World Alzheimer's Day brain speed challenge.
 *
 * The /general arc, shared rather than rebuilt (see EISAI_FLOW, which is
 * /general's, which is the summit's, which is /phkl's): a processing-speed
 * primer and the age question before the game, a "great job" beat into the
 * quiz primer, the questionnaire, and the booth report. Sharing the flow array
 * is what keeps this route's question set - and therefore every score it
 * records - comparable with /general's and with every event before it.
 *
 * Two things only are its own:
 *
 * - **The hero names the host** ("Who's the fastest brain at Eisai?"), as the
 *   poster beside the QR does. Everything else on the landing is /general's,
 *   including the one-tick consent and the shared privacy policy.
 * - **Its own bucket**, `eisai`, so the day's standings open empty and rank
 *   only what is played here.
 *
 * An internal staff event: GMS keeps the data and Eisai receives none of it,
 * so there is no partner block and no partner consent clause. If that ever
 * changes, this route needs both before it runs again.
 *
 * EISAI_PAUSED is its own switch. There is no challenge-closed switch; the arc
 * is open for as long as the route is up.
 */
export default function EisaiPage() {
  if (EISAI_PAUSED) return <EventEnded />;
  return <Funnel variant="eisai" />;
}
