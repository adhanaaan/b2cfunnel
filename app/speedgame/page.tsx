import type { Metadata } from "next";
import { Funnel } from "@/components/Funnel";
import { EventEnded } from "@/components/screens/EventEnded";
import { SPEEDGAME_PAUSED } from "@/config/event";

export const metadata: Metadata = {
  title: "Speed Game - Brain Health Check",
  description:
    "How fast does your brain process? Take a quick symbol-matching test to find out your brain processing speed, then explore your full brain health profile.",
  openGraph: {
    title: "Speed Game",
    description:
      "How fast does your brain process? A 60-second symbol-matching test.",
    images: ["/og-event-v3.png"],
  },
};

export default function SpeedgamePage() {
  if (SPEEDGAME_PAUSED) return <EventEnded />;
  return <Funnel variant="speedgame" />;
}
