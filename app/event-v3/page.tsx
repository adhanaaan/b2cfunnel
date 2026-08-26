import type { Metadata } from "next";
import { Funnel } from "@/components/Funnel";
import { EventEnded } from "@/components/screens/EventEnded";
import { EVENT3_PAUSED } from "@/config/event";

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

export default function EventV3Page() {
  if (EVENT3_PAUSED) return <EventEnded />;
  return <Funnel variant="event3" />;
}
