import type { Metadata } from "next";
import { Funnel } from "@/components/Funnel";
import { EventEnded } from "@/components/screens/EventEnded";
import { PHKL_PAUSED } from "@/config/event";

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
 * /phkl - the Pantai Hospital Kuala Lumpur Reaction Time Challenge, with IHH
 * Healthcare Malaysia as the partner.
 *
 * The regatta arc (every consent on the landing, no consent page) rebuilt from
 * Figma "New Flow" so the quiz is no longer optional:
 *
 * - A processing-speed primer and the quiz's age question BEFORE the game,
 *   under a GAME / QUIZ / RESULTS rail.
 * - No post-game card and no invite: a "great job" beat walks itself into a
 *   quiz primer, and the first question follows.
 * - A long report: time and rank, what processing speed is, what else was
 *   measured, how much of the brain is still uncovered, and the Memory
 *   Screening Package at Pantai Hospital KL, with "Book memory screening"
 *   pinned to the screen throughout and share / retry in the top corners.
 *
 * Its scores and reports are tagged `phkl`, so its board ranks only this
 * event. PHKL_PAUSED is its own switch.
 */
export default function PhklPage() {
  if (PHKL_PAUSED) return <EventEnded />;
  return <Funnel variant="phkl" />;
}
