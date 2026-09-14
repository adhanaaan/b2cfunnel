import type { Metadata } from "next";
import { Funnel } from "@/components/Funnel";
import { EventEnded } from "@/components/screens/EventEnded";
import { URBANMILERS_PAUSED } from "@/config/event";

export const metadata: Metadata = {
  title: "Reaction Time Challenge - GMS x Urban Milers",
  description:
    "How fast does your brain process? Take a quick symbol-matching test at the Urban Milers community run, then help us raise $5,000 for Dementia Singapore.",
  openGraph: {
    title: "Reaction Time Challenge - GMS x Urban Milers",
    description:
      "How fast does your brain process? A 60-second symbol-matching test, in aid of Dementia Singapore.",
    images: ["/og-event-v3.png"],
  },
};

/**
 * /urbanmilers - the GMS x Urban Milers community run.
 *
 * The /mambacares arc, shared rather than rebuilt (see URBANMILERS_FLOW): the
 * plain daylight landing with no partner on it, the processing-speed primer and
 * the age question before the game, the "great job" beat, the questionnaire,
 * and the report that ends on the Dementia Singapore fundraiser. Every screen
 * is that event's, and every one of them reads which run it is drawing from the
 * variant - its words through `runCopyFor`, its campaign through
 * `communityRunFor` - so neither run can print the other's link or figures.
 *
 * What this route holds of its own is what must not be shared: its scores and
 * reports are tagged `urbanmilers` (URBANMILERS_SOURCE), so its standings rank
 * only this run and its board opens clear of every #MambaCares row; its board
 * is at /urbanmilers/leaderboard; its words are COPY.screens.urbanmilers; and
 * URBANMILERS_PAUSED is its own switch, so closing one run never closes the
 * other.
 */
export default function UrbanMilersPage() {
  if (URBANMILERS_PAUSED) return <EventEnded />;
  return <Funnel variant="urbanmilers" />;
}
