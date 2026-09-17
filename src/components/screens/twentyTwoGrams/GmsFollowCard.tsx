"use client";

import { QRCodeSVG } from "qrcode.react";
import {
  GMS_INSTAGRAM_URL,
  GMS_SITE_LABEL,
  GMS_SITE_URL,
} from "@/config/eventLinks";
import { GMS_FOLLOW_CARD } from "@/config/twentyTwoGrams";
import { track } from "@/lib/analytics";
import { useVariant } from "@/components/VariantContext";
import { OptionalImage } from "@/components/screens/phkl/OptionalImage";

/**
 * The "follow us" card, built to Figma 942:11389.
 *
 * Two places show it, which is why it is a component rather than markup in
 * either: the dark band under the offer on the Sharp Shot poster, and every
 * other five seconds on the report's pinned banner. Both hand it a box; it
 * fills whatever it is given and centres its own contents, so the two cannot
 * drift into different cards.
 *
 * It is the one thing on either surface that asks for anything beyond the
 * drink - so it names the month, the reason to follow, and the address, and
 * nothing else.
 *
 * Both of its links stop the click there. On the poster this card sits inside
 * a takeover that closes on a tap ANYWHERE, and that takeover is the voucher:
 * opening Instagram must not also throw away the thing they came to redeem.
 */

/**
 * The code, as the design has it: a styled Instagram code with the handle set
 * under it. Optional, like every image in this build - until it lands the card
 * draws a plain code for the same profile, so it is scannable from the day it
 * ships rather than the day someone remembers to export the artwork.
 */
const INSTAGRAM_CODE = "/gms-instagram-qr.png";

export function GmsFollowCard({
  /** `n` design pixels, in the surrounding card's unit. */
  u,
}: {
  u: (n: number) => string;
}) {
  const variant = useVariant();

  /**
   * Follow the link and nothing else: no dismissing the poster underneath,
   * and a note that someone went, so "did anyone find us" has an answer.
   */
  const open =
    (placement: "instagram" | "site") =>
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      track("follow_click", { variant, placement });
    };

  return (
    <div
      className="flex size-full items-center justify-center bg-[#152039]"
      style={{ gap: u(10), borderRadius: u(20) }}
    >
      {/* The code is also a tap target: it is the fastest route for whoever is
          holding the phone the card is on, who cannot scan their own screen.
          `aria-label` sits on the link rather than the image, because the
          fallback below is a drawn code with no alt text of its own. */}
      <a
        href={GMS_INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Gray Matter Solutions on Instagram"
        onClick={open("instagram")}
        className="shrink-0 rounded-[inherit] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
      >
      <OptionalImage
        src={INSTAGRAM_CODE}
        alt=""
        className="block shrink-0 object-cover"
        style={{
          width: u(83.886),
          height: u(85),
          borderRadius: u(3.712),
        }}
        fallback={
          <span
            className="flex shrink-0 items-center justify-center bg-white"
            style={{
              width: u(83.886),
              height: u(85),
              borderRadius: u(3.712),
              padding: u(4),
            }}
          >
            <QRCodeSVG
              value={GMS_INSTAGRAM_URL}
              style={{ width: u(76), height: u(76) }}
              level="L"
              marginSize={2}
              fgColor="#000000"
              bgColor="#ffffff"
            />
          </span>
        }
      />
      </a>

      <div
        className="flex shrink-0 flex-col font-bold text-cream"
        style={{ width: u(211), gap: u(9) }}
      >
        <div className="flex flex-col" style={{ gap: u(2) }}>
          <p
            className="uppercase"
            style={{
              fontSize: u(8),
              lineHeight: u(16),
              letterSpacing: u(1.76),
            }}
          >
            {GMS_FOLLOW_CARD.eyebrow}
          </p>
          <p className="leading-[1.1]" style={{ fontSize: u(20.09) }}>
            {GMS_FOLLOW_CARD.heading}
          </p>
        </div>
        {/* The address is the label, derived from the URL the code opens. */}
        <a
          href={GMS_SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={open("site")}
          className="underline decoration-solid underline-offset-2 leading-[1.1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
          style={{ fontSize: u(10.09) }}
        >
          {GMS_SITE_LABEL}
        </a>
      </div>
    </div>
  );
}
