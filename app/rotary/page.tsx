import type { Metadata } from "next";
import { Funnel } from "@/components/Funnel";
import { EventEnded } from "@/components/screens/EventEnded";
import { ROTARY_CLUB_PAUSED } from "@/config/event";

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
 * /rotary - the Reaction Time Challenge for a Rotary club other than KL-WAM.
 *
 * KL-WAM's arc, shared rather than rebuilt (see ROTARY_CLUB_FLOW): the same
 * Daylight Ember arc /event-v3 ships, with no partner in it - no consent page
 * between the landing and the instructions. The wording is KL-WAM's too, word
 * for word: this event wanted no club name on the screens.
 *
 * What is its own is the bucket. Rows are tagged ROTARY_CLUB_SOURCE, so this
 * board ranks only the room in front of it and KL-WAM's standings stay on
 * KL-WAM's board.
 *
 * Meant to be reused by the next club as well: change ROTARY_CLUB_SOURCE (and
 * redeploy) and the board opens empty for them, with every earlier club's
 * scores kept under the tag they were written with.
 *
 * ROTARY_CLUB_PAUSED is its own switch.
 */
export default function RotaryClubPage() {
  if (ROTARY_CLUB_PAUSED) return <EventEnded />;
  return <Funnel variant="rotaryclub" />;
}
