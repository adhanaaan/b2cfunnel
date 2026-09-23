import type { Metadata } from "next";
import { Funnel } from "@/components/Funnel";
import { EventEnded } from "@/components/screens/EventEnded";
import { PHKL2_PAUSED } from "@/config/event";

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
 * /phkl-2 - the Pantai Hospital Kuala Lumpur Reaction Time Challenge, run
 * again for a second activation, with IHH Healthcare Malaysia as the partner.
 *
 * /phkl's arc, shared rather than rebuilt (see PHKL2_FLOW): the regatta arc
 * with every consent on the landing and no consent page, a processing-speed
 * primer and the age question before the game under a GAME / QUIZ / RESULTS
 * rail, a "great job" beat into the quiz primer, and the long report that ends
 * on the Memory Screening Package.
 *
 * Two things only are its own:
 *
 * - **Its bucket.** Rows are tagged PHKL2_SOURCE, so this board opens empty
 *   and ranks only this activation. /phkl's standings stay on /phkl's board.
 * - **Its privacy-policy link.** The same policy, the same partner wording,
 *   served at /phkl-2/privacy-policy so a reader never leaves this route in
 *   the middle of consenting.
 *
 * Everything else - the partner block, the partner consent, the report and the
 * prize board - is /phkl's, so the two activations cannot drift apart.
 *
 * PHKL2_PAUSED is its own switch.
 */
export default function Phkl2Page() {
  if (PHKL2_PAUSED) return <EventEnded />;
  return <Funnel variant="phkl2" />;
}
