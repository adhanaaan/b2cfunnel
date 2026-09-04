import type { Metadata } from "next";
import { Funnel } from "@/components/Funnel";
import { EventEnded } from "@/components/screens/EventEnded";
import { NTU_HOMECOMING_PAUSED } from "@/config/event";

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
 * /ntuhomecoming - the NTU Homecoming Reaction Time Challenge.
 *
 * The same Daylight Ember arc /rotaryklwam ships, with no partner in this
 * event: no consent page between the landing and the instructions, and no
 * "That's a wrap!" screen (closing the DBS challenge must not reach across to
 * this one). Its scores and reports are tagged `ntuhomecoming`, so its board
 * ranks only this event.
 */
export default function NtuHomecomingPage() {
  if (NTU_HOMECOMING_PAUSED) return <EventEnded />;
  return <Funnel variant="ntuhomecoming" />;
}
