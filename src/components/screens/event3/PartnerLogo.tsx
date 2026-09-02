"use client";

import { useState } from "react";

/**
 * The event partner's logo, beside the GMS lockup on the consent page.
 *
 * The artwork is not in the repo yet: drop it at `public/ihh-logo.png` (the
 * design uses roughly 60x40) and it appears. Until then this renders nothing
 * rather than a broken-image icon, so the preview stays presentable.
 */
export function PartnerLogo() {
  const [missing, setMissing] = useState(false);
  if (missing) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/ihh-logo.png"
      alt="IHH Healthcare Singapore"
      className="h-[clamp(30px,4.7dvh,40px)] w-auto"
      onError={() => setMissing(true)}
    />
  );
}
