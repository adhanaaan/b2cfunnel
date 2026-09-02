/**
 * Marks a route as a walkthrough. Small and out of the way, but present on
 * every screen, so nobody mistakes a preview for the live booth experience or
 * expects their score to appear on a leaderboard.
 */
export function PreviewBadge() {
  return (
    <p
      className="pointer-events-none fixed right-2 top-[max(0.35rem,env(safe-area-inset-top))] z-[60] whitespace-nowrap rounded-full bg-charcoal/65 px-2 py-[3px] text-[9px] font-bold uppercase tracking-[0.14em] text-white/90 backdrop-blur-sm"
      role="status"
    >
      Preview · not saved
    </p>
  );
}
