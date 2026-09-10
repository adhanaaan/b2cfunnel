"use client";

import { useState } from "react";
import { COPY } from "@/config/copy";
import {
  MAMBACARES_CAMPAIGN,
  MAMBACARES_DONATION_URL,
  campaignAmount,
} from "@/config/mambacares";
import { track } from "@/lib/analytics";
import { useVariant } from "@/components/VariantContext";

/**
 * "Share donation" - the campaign link, passed on.
 *
 * Deliberately not the report's other share: that one hands over a picture of
 * the player's own time (useShareCard), while this one is only ever the
 * fundraiser's link, so a friend who taps it lands on the donation page rather
 * than on the game. Falls back to the clipboard where the browser has no share
 * sheet, and says which of the two happened.
 */
export function useShareDonation() {
  const variant = useVariant();
  const [sharing, setSharing] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const share = async () => {
    if (sharing) return;
    setSharing(true);
    const c = COPY.screens.mambacares.report.cta;
    const text = c.shareText.replace(
      "{goal}",
      campaignAmount(MAMBACARES_CAMPAIGN.goal),
    );
    try {
      track("donation_share", { variant });
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: c.shareTitle,
          text,
          url: MAMBACARES_DONATION_URL,
        });
        setNote(null);
        return;
      }
      await navigator.clipboard.writeText(`${text}\n${MAMBACARES_DONATION_URL}`);
      setNote(c.shareCopied);
    } catch (error) {
      // A dismissed share sheet is a cancellation, not a failure - saying
      // "couldn't share" to someone who just tapped Cancel is noise.
      const cancelled =
        error instanceof DOMException && error.name === "AbortError";
      setNote(cancelled ? null : c.shareFailed);
    } finally {
      setSharing(false);
    }
  };

  return { share, sharing, note };
}
