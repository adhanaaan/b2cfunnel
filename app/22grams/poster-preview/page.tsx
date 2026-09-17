import type { Metadata } from "next";
import { SharpShotPosterPreview } from "./SharpShotPosterPreview";

export const metadata: Metadata = {
  title: "Sharp Shot poster preview - 22 Grams",
  description:
    "Preview the /22grams Sharp Shot poster without playing a qualifying run.",
  // A working page, not a public one: keep it out of search results and out of
  // any link preview it might be pasted into.
  robots: { index: false, follow: false },
};

/**
 * /22grams/poster-preview - the Sharp Shot poster, on demand.
 *
 * The poster only appears after a run under 30 seconds, which makes it
 * awkward to check: someone reviewing the wording, the artwork or the way it
 * sits on a particular phone would have to beat the clock first, every time.
 * This page opens the same component with whatever name, time and moment are
 * typed into it.
 *
 * It is the REAL component, not a copy of it - so what is reviewed here is
 * what players get, and there is no second version to keep in step.
 *
 * It writes nothing: no score, no lead, no analytics. There is no funnel
 * behind it at all, so nothing here can reach the leaderboard or this event's
 * bucket.
 */
export default function SharpShotPosterPreviewPage() {
  return <SharpShotPosterPreview />;
}
