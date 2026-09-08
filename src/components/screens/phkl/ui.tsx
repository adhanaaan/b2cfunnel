"use client";

import type { MouseEvent, ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PHKL_BOOKING_URL, PHKL_PACKAGE_SECTION_ID } from "@/config/eventLinks";
import { track } from "@/lib/analytics";
import { ease } from "@/lib/motion";
import { useVariant } from "@/components/VariantContext";

/**
 * Shared vocabulary for the PHKL report (Figma "10. Result (PHKL Customized)"):
 * the report's own ink, eyebrow, card and CTA, and the two things every
 * section does - reveal on scroll and alternate plain/serif fragments.
 */

/** The report's small rust eyebrow. */
export const reportEyebrow =
  "text-[10.5px] font-extrabold uppercase tracking-[0.24em] text-[#b4653c]";

/** The report's overline inside a card or step. */
export const reportOverline =
  "text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#b4653c]";

/** The report's section heading, in the report's ink. */
export const reportHeading =
  "text-[clamp(1.9rem,8.6vw,2.25rem)] font-extrabold leading-[1.12] tracking-[-0.025em] text-[#1c110a]";

/** The report's white card. */
export const reportCard =
  "rounded-[26px] border border-[#f2ddce] bg-white shadow-[0_18px_46px_-28px_rgba(90,40,10,0.28)]";

/** The rank gradient (Figma "Gradient/Rank"), as a text fill. */
export const rankGradientText =
  "bg-gradient-to-r from-[#ff8a1f] via-[#f9550f] to-[#d62f16] bg-clip-text text-transparent";

/** The report's pill CTA, filled with the rank gradient. */
export const rankPillCta =
  "flex h-[54px] w-full items-center justify-center rounded-full bg-gradient-to-r from-[#ff8a1f] via-[#f9550f] to-[#d62f16] px-8 text-base font-bold tracking-[0.025em] text-white shadow-[0_14px_34px_-14px_rgba(214,47,22,0.6)] transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d62f16]";

/**
 * A block that rises into place the first time it scrolls into view. Small
 * blocks, not whole sections, so nothing on a tall section stays hidden
 * until the reader is deep into it. Reduced motion renders in place.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.4, ease: ease.out, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Copy fragments that alternate plain and serif-italic, starting plain - the
 * report's "Processing speed is *how fast* your brain *takes in*..." device.
 * The serif is the codebase's own (Cormorant), as on the speed popup.
 */
export function SerifParts({ parts }: { parts: string[] }) {
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <em key={i} className="font-serif text-[1.12em] font-medium italic">
            {part}
          </em>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

/**
 * Every "book" button on the report, in two kinds. The button under the
 * poster is the booking itself and opens the form (PHKL_BOOKING_URL); the
 * sticky button and the one above the clinician's quote come earlier than the
 * package does, so they walk the reader down to the Memory Screening Package
 * section instead. Both are real anchors rather than buttons, so they work
 * without JavaScript and read as links to assistive tech.
 */
export function BookingLink({
  placement,
  className,
  children,
}: {
  placement: "sticky" | "offer" | "poster";
  className: string;
  children: ReactNode;
}) {
  const variant = useVariant();
  const reduced = useReducedMotion();
  const toForm = placement === "poster";

  const scrollToPackage = (event: MouseEvent<HTMLAnchorElement>) => {
    const section = document.getElementById(PHKL_PACKAGE_SECTION_ID);
    if (!section) return; // Let the plain #hash jump handle it.
    event.preventDefault();
    section.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <a
      href={toForm ? PHKL_BOOKING_URL : `#${PHKL_PACKAGE_SECTION_ID}`}
      target={toForm ? "_blank" : undefined}
      rel={toForm ? "noopener noreferrer" : undefined}
      onClick={(event) => {
        track("booking_click", { variant, placement });
        if (!toForm) scrollToPackage(event);
      }}
      className={className}
    >
      {children}
    </a>
  );
}
