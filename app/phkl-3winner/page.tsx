import type { Metadata } from "next";
import { Phkl3Winners } from "@/components/screens/phkl3/Phkl3Winners";

export const metadata: Metadata = {
  title: "Winners - Pantai Hospital KL Reaction Time Challenge",
  // The prize-giving screen, not a way in: keep it out of search results so a
  // player cannot land on the result instead of the game.
  robots: { index: false, follow: false },
};

/**
 * /phkl-3winner - the prize-giving screen for the third Pantai Hospital KL
 * activation.
 *
 * Three screens for three people: third, then second, then first, advanced by
 * hand as each is announced. Separate from /phkl-3/leaderboard on purpose -
 * the board is the thing that keeps moving all day, and this is the thing that
 * must not move at the moment it matters.
 *
 * The standings are read ONCE, when the page opens, and then held, so a player
 * finishing mid-ceremony cannot change the name on the screen behind the
 * person announcing it. The prizes are read from the board's own ladder, so
 * the two cannot promise different amounts.
 */
export default function Phkl3WinnerPage() {
  return <Phkl3Winners />;
}
