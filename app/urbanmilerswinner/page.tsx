import type { Metadata } from "next";
import { UrbanMilersWinners } from "@/components/screens/urbanmilers/UrbanMilersWinners";

export const metadata: Metadata = {
  title: "Winners - Urban Milers Reaction Time Challenge",
  // The prize-giving screen, not a way in: keep it out of search results so a
  // runner cannot land on the result instead of the game.
  robots: { index: false, follow: false },
};

/**
 * /urbanmilerswinner - the prize-giving screen for the Urban Milers run.
 *
 * Three screens for three people: third, then second, then first, advanced by
 * hand as each is announced. Separate from /urbanmilers/leaderboard on purpose
 * - the board is the thing that keeps moving all day, and this is the thing
 * that must not move at the moment it matters.
 *
 * The standings are read ONCE, when the page opens, and then held. A runner
 * finishing mid-ceremony cannot change the name on the screen behind the
 * person announcing it. "Take again" re-reads them when that is what is
 * wanted, and the page prints when the reading was taken so nobody has to
 * guess whether it is current.
 */
export default function UrbanMilersWinnerPage() {
  return <UrbanMilersWinners />;
}
