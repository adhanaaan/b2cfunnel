"use client";

import type { ReactNode } from "react";
import { COPY } from "@/config/copy";
import {
  MAMBACARES_DONATION_LABEL,
  MAMBACARES_DONATION_URL,
  MAMBACARES_PHOTO_ALT,
} from "@/config/mambacares";
import { track } from "@/lib/analytics";
import { useVariant } from "@/components/VariantContext";
import { ShareIcon } from "@/components/screens/event3/icons";
import { OptionalImage } from "@/components/screens/phkl/OptionalImage";

/**
 * Shared vocabulary for the #MambaCares report (Figma 775:17580, "Full Speed +
 * Donation"): the two buttons, the printed link under them, and the campaign
 * photographs.
 */

/** The filled donate button, in the report's rank gradient (Gradient/Rank). */
export const donateButtonClass =
  "flex h-[50px] w-full items-center justify-center rounded-full bg-gradient-to-r from-[#ff8a1f] via-[#f9550f] to-[#d62f16] px-8 text-base font-bold tracking-[0.025em] text-white shadow-[0_14px_34px_-14px_rgba(214,47,22,0.6)] transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d62f16]";

/** The outlined share button that sits under it. */
export const shareButtonClass =
  "flex h-[50px] w-full items-center justify-center gap-2 rounded-full border border-outline-variant bg-white px-8 text-[15px] font-bold text-secondary transition hover:bg-[#fffaf7] disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d62f16]";

/**
 * The donate link itself. A real anchor rather than a button, so it works
 * without JavaScript, opens in a new tab (the report is long and a donor
 * should come back to it), and reads as a link to assistive tech. `placement`
 * only tags the analytics event - all three go to the same campaign page.
 */
export function DonateLink({
  placement,
  className,
  children,
}: {
  placement: "donate-section" | "closing" | "sticky";
  className: string;
  children: ReactNode;
}) {
  const variant = useVariant();
  return (
    <a
      href={MAMBACARES_DONATION_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("donate_click", { variant, placement })}
      className={className}
    >
      {children}
    </a>
  );
}

/**
 * The pair of buttons and the printed link, under both the campaign section
 * and the closing ask. The link is printed as well as linked on purpose: it is
 * what someone reads off a phone held up at the finish line, and what they can
 * type in later.
 */
export function DonateActions({
  placement,
  share,
}: {
  placement: "donate-section" | "closing";
  share: { share: () => void; sharing: boolean; note: string | null };
}) {
  const c = COPY.screens.mambacares.report.cta;
  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex flex-col gap-3">
        <DonateLink placement={placement} className={donateButtonClass}>
          {c.donate}
        </DonateLink>
        <button
          type="button"
          onClick={share.share}
          disabled={share.sharing}
          className={shareButtonClass}
        >
          <ShareIcon className="h-[22px] w-[22px]" />
          {c.share}
        </button>
      </div>
      {share.note && (
        <p role="status" className="text-center text-[12px] text-[#8a6a58]">
          {share.note}
        </p>
      )}
      <p className="text-center text-[13.5px] leading-normal text-[#6b5245]">
        {c.directLead}{" "}
        <a
          href={MAMBACARES_DONATION_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("donate_click", { placement: `${placement}-link` })}
          className="font-bold text-[#c2410c] underline underline-offset-2"
        >
          {MAMBACARES_DONATION_LABEL}
        </a>
      </p>
    </div>
  );
}

/**
 * A campaign photograph that may not have been uploaded yet. While the file is
 * missing the frame holds its shape as a warm tile, so the section's rhythm is
 * the designed one either way and it is obvious a picture belongs there.
 */
export function CampaignPhoto({
  src,
  className = "",
}: {
  src: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[18px] bg-gradient-to-br from-[#fbe3d2] to-[#f6cdb4] ${className}`}
    >
      <OptionalImage
        src={src}
        alt={MAMBACARES_PHOTO_ALT}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
