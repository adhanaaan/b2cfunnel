import type { Metadata } from "next";
import { Funnel } from "@/components/Funnel";
import { EventEnded } from "@/components/screens/EventEnded";
import { IHH_PAUSED } from "@/config/event";

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
 * /ihh - the IHH Reaction Time Challenge.
 *
 * The /ihhsearegatta arc, step for step: every consent on the landing (no
 * consent page), the redesigned bridge card after the game, the questionnaire
 * invite before the first question, and the report at the end. The flow, the
 * copy and the question set are shared rather than copied, so a change to the
 * regatta reaches this route too.
 *
 * What is its own: the bucket. Scores and reports here are tagged `ihh`
 * (IHH_SOURCE), so this run's standings and completion rate sit in their own
 * column instead of mixing into the regatta's history - and the board at
 * /ihh/leaderboard ranks only these rows. IHH_PAUSED and IHH_CHALLENGE_CLOSED
 * are its own switches for the same reason.
 */
export default function IhhPage() {
  if (IHH_PAUSED) return <EventEnded />;
  return <Funnel variant="ihh" />;
}
