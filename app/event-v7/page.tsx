import type { Metadata } from "next";
import { Funnel } from "@/components/Funnel";
import { PreviewBadge } from "@/components/ui/PreviewBadge";

export const metadata: Metadata = {
  title: "Share moment (preview) - GMS x #MambaCares",
  description:
    "Preview of the #MambaCares report with the share moment at the reveal. Nothing played here is recorded.",
  // A walkthrough, not a live entry point: keep it out of search results.
  robots: { index: false, follow: false },
};

/**
 * /event-v7 - the #MambaCares arc with one change: the report opens on a share
 * moment instead of waiting for someone to find the share button.
 *
 * Everything else is /mambacares exactly, sharing its flow array, so the two
 * can be walked side by side and only the moment differs.
 *
 * PREVIEW ONLY. The variant is in PREVIEW_VARIANTS, so no lead, score,
 * newsletter opt-in or analytics event is written from this route - which is
 * what makes it safe to walk while the run is live.
 */
export default function EventV7Page() {
  return (
    <>
      <PreviewBadge />
      <Funnel variant="event7" />
    </>
  );
}
