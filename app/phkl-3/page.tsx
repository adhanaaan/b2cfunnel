import type { Metadata } from "next";
import { Funnel } from "@/components/Funnel";
import { EventEnded } from "@/components/screens/EventEnded";
import { LanguageProvider } from "@/components/LanguageContext";
import { PHKL3_PAUSED } from "@/config/event";

export const metadata: Metadata = {
  title: "Reaction Time Challenge - Brain Health Check",
  description:
    "How fast does your brain process? Take a quick symbol-matching test to find out your brain processing speed, then explore your full brain health profile. Available in English, 中文 and Bahasa Melayu.",
  openGraph: {
    title: "Reaction Time Challenge",
    description:
      "How fast does your brain process? A 60-second symbol-matching test.",
    images: ["/og-event-v3.png"],
  },
};

/**
 * /phkl-3 - the Pantai Hospital Kuala Lumpur Reaction Time Challenge, run a
 * third time, with IHH Healthcare Malaysia as the partner.
 *
 * /phkl-2 again, screen for screen: /phkl's arc (see PHKL3_FLOW), the partner
 * block and consent on the landing, the English / 中文 / Bahasa Melayu choice
 * between the intro line and the name field, and the long report that ends on
 * the Memory Screening Package.
 *
 * What is its own:
 *
 * - **Its bucket.** Rows are tagged PHKL3_SOURCE, so this board opens empty
 *   and ranks only this activation.
 * - **Its board.** /phkl-3/leaderboard is built to Figma 892:7134: the prize
 *   panel names what 1ST, 2ND and 3RD each win (config/phkl3.ts) rather than
 *   one headline figure.
 * - **Its privacy-policy link.** The same policy, the same partner wording,
 *   served at /phkl-3/privacy-policy so a reader never leaves this route in
 *   the middle of consenting.
 *
 * PHKL3_PAUSED is its own switch.
 */
export default function Phkl3Page() {
  if (PHKL3_PAUSED) return <EventEnded />;
  return (
    <LanguageProvider>
      <Funnel variant="phkl3" />
    </LanguageProvider>
  );
}
