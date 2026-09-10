import type { Metadata } from "next";
import { Funnel } from "@/components/Funnel";
import { EventEnded } from "@/components/screens/EventEnded";
import { MAMBACARES_PAUSED } from "@/config/event";

export const metadata: Metadata = {
  title: "Reaction Time Challenge - GMS x #MambaCares",
  description:
    "How fast does your brain process? Take a quick symbol-matching test at the World Alzheimer's Month community run, then help us raise $5,000 for Dementia Singapore.",
  openGraph: {
    title: "Reaction Time Challenge - GMS x #MambaCares",
    description:
      "How fast does your brain process? A 60-second symbol-matching test, in aid of Dementia Singapore.",
    images: ["/og-event-v3.png"],
  },
};

/**
 * /mambacares - the GMS x #MambaCares World Alzheimer's Month community run,
 * raising for Dementia Singapore with six running crews.
 *
 * The /phkl arc, shared rather than rebuilt (see MAMBACARES_FLOW): a
 * processing-speed primer and the age question before the game, a "great job"
 * beat that walks itself into the quiz primer, the questionnaire, and the
 * report. Two screens differ, both rebuilt from Figma:
 *
 * - The landing (756:14394) has no partner on it - no logo above the eyebrow
 *   and no third consent row - so it is the plain daylight landing, at the
 *   roomier consent size.
 * - The report (775:17580) ends on the fundraiser instead of a screening
 *   offer: what dementia does to the speed they just measured, the Dementia
 *   Singapore campaign and its progress, the risk report the quiz earned, a
 *   closing ask, and the crews and sponsors behind the run - with "Donate now"
 *   pinned to the screen throughout.
 *
 * Its scores and reports are tagged `mambacares`, so its standings rank only
 * this event. MAMBACARES_PAUSED is its own switch.
 */
export default function MambacaresPage() {
  if (MAMBACARES_PAUSED) return <EventEnded />;
  return <Funnel variant="mambacares" />;
}
