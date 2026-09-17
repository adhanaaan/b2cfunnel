import type { Metadata } from "next";
import { Funnel } from "@/components/Funnel";
import { EventEnded } from "@/components/screens/EventEnded";
import { TWENTY_TWO_GRAMS_PAUSED } from "@/config/event";

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
 * /22grams - the 22 Grams Reaction Time Challenge.
 *
 * The /ntuhomecoming arc, shared rather than rebuilt (see
 * TWENTY_TWO_GRAMS_FLOW): the Daylight Ember landing with no partner on it, no
 * consent page between the landing and the instructions, and no "That's a
 * wrap!" screen. Sharing the flow array is what keeps this event's question
 * set - and therefore every score it records - comparable with /ntuhomecoming,
 * /rotaryklwam and event2.
 *
 * What this route holds of its own is what must not be shared: its scores and
 * reports are tagged `22grams` (TWENTY_TWO_GRAMS_SOURCE), so its standings rank
 * only this event and its board opens clear of every NTU Homecoming row; its
 * board is at /22grams/leaderboard, and is the /phkl frame - the two-column
 * horizontal layout - rather than the NTU one; its words are
 * COPY.screens["22grams"]; and TWENTY_TWO_GRAMS_PAUSED is its own switch, so
 * closing one event never closes the other.
 */
export default function TwentyTwoGramsPage() {
  if (TWENTY_TWO_GRAMS_PAUSED) return <EventEnded />;
  return <Funnel variant="22grams" />;
}
