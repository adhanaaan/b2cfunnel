import type { Metadata } from "next";
import { Funnel } from "@/components/Funnel";
import { PreviewBadge } from "@/components/ui/PreviewBadge";

export const metadata: Metadata = {
  title: "Reaction Time Challenge (preview) - Brain Health Check",
  description:
    "Preview of the Reaction Time Challenge with the partner consent page. Nothing played here is recorded.",
  // A walkthrough, not a live entry point: keep it out of search results.
  robots: { index: false, follow: false },
};

/**
 * /event-v6 - the v3 experience with the partner consent page after the
 * landing (Figma "Option 2").
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
