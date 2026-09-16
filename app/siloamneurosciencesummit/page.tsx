import type { Metadata } from "next";
import { Funnel } from "@/components/Funnel";
import { EventEnded } from "@/components/screens/EventEnded";
import { LanguageProvider } from "@/components/LanguageContext";
import { SILOAM_PAUSED } from "@/config/event";

export const metadata: Metadata = {
  title: "Reaction Time Challenge - Siloam Neuroscience Summit",
  description:
    "How fast does your brain process? Take a quick symbol-matching test to find out your brain processing speed, then explore your full brain health profile. Available in English and Bahasa Indonesia.",
  openGraph: {
    title: "Reaction Time Challenge - Siloam Neuroscience Summit",
    description:
      "How fast does your brain process? A 60-second symbol-matching test.",
    images: ["/og-event-v3.png"],
  },
};

/**
 * /siloamneurosciencesummit - the Siloam Neuroscience Summit Reaction Time
 * Challenge, and the first Indonesian event on this funnel.
 *
 * The /phkl arc, shared rather than rebuilt (see SILOAM_FLOW): a
 * processing-speed primer and the age question before the game, a "great job"
 * beat that walks itself into the quiz primer, the questionnaire, and the
 * report. Four things are this event's own:
 *
 * - **A language.** The landing opens on a two-option picker, English or
 *   Bahasa Indonesia, and the choice carries through every screen behind it -
 *   the primers, the game and its guided tour, all fourteen questions, the
 *   analysing beat and the whole report. `LanguageProvider` wraps the funnel
 *   here rather than inside it, so the choice survives a step change and a
 *   reload; nothing else in the app mounts it, which is what keeps every other
 *   event reading the English config itself.
 * - **The landing is #MambaCares'**: the plain two-row consent at the roomier
 *   size, with no partner block, linking a policy written for this route.
 * - **The report closes on NTU Homecoming's call to action** - the ReCOGnAIze
 *   assessment and the team at the booth - rather than on /phkl's bookable
 *   screening package.
 * - **Its own bucket**, `siloam`, so its standings open empty and rank only
 *   this event. Its board is at /siloamneurosciencesummit/leaderboard.
 *
 * SILOAM_PAUSED is its own switch. There is no challenge-closed switch: the
 * arc is open for as long as the route is up.
 */
export default function SiloamNeuroscienceSummitPage() {
  if (SILOAM_PAUSED) return <EventEnded />;
  return (
    <LanguageProvider>
      <Funnel variant="siloam" />
    </LanguageProvider>
  );
}
