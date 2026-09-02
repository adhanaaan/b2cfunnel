import type { Metadata } from "next";
import { Funnel } from "@/components/Funnel";
import { PreviewBadge } from "@/components/ui/PreviewBadge";

export const metadata: Metadata = {
  title: "Reaction Time Challenge (preview) - Brain Health Check",
  description:
    "Preview of the Reaction Time Challenge with the partner consents split into one tickbox per clause. Nothing played here is recorded.",
  // A walkthrough, not a live entry point: keep it out of search results.
  robots: { index: false, follow: false },
};

/**
 * /event-v6 - the same flow v3 ships, with the partner consents split into one
 * tickbox per clause instead of the single tick on the live consent page. Kept
 * so the two treatments can be walked side by side.
 *
 * PREVIEW ONLY. The variant is in PREVIEW_VARIANTS, so no lead, score,
 * newsletter opt-in or analytics event is written from this route.
 */
export default function EventV6Page() {
  return (
    <>
      <PreviewBadge />
      <Funnel variant="event6" />
    </>
  );
}
