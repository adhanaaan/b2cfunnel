import type { Metadata } from "next";
import { Funnel } from "@/components/Funnel";
import { EventEnded } from "@/components/screens/EventEnded";
import { IHHSEA_PAUSED } from "@/config/event";

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
 * /ihhsearegatta - the IHH SEA Regatta Reaction Time Challenge.
 *
 * The Daylight Ember arc /event-v3 ships, with the partner consent page it
 * carries, and three differences:
 *
 * - Open. There is no "That's a wrap!" screen: EVENT3_CHALLENGE_CLOSED closes
 *   the DBS challenge only, and is applied per variant in resolveFlow.
 * - The post-game bridge card leads with the player's wish and ends on "Tell
 *   me more" instead of "Continue to report".
 * - "Tell me more" opens the questionnaire invite, where the quiz is accepted
 *   or declined, before the first question.
 *
 * Its scores and reports are tagged `ihhsearegatta`, so its board ranks only
 * this event.
 */
export default function IhhSeaRegattaPage() {
  if (IHHSEA_PAUSED) return <EventEnded />;
  return <Funnel variant="ihhsearegatta" />;
}
