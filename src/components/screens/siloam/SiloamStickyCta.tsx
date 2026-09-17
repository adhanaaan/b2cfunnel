"use client";

import type { MouseEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SILOAM_OFFER_SECTION_ID } from "@/config/eventLinks";
import { boothReportFor } from "@/config/copy";
import { track } from "@/lib/analytics";
import { ease } from "@/lib/motion";
import { useCopy } from "@/components/LanguageContext";
import { useVariant } from "@/components/VariantContext";

/**
 * The one call to action on the booth report, pinned to the bottom of the
 * screen for the whole scroll - the same bar /phkl ships, pointed at the
 * close. Serves both events on that report (the summit and /22grams), so its
 * words come through `boothReportFor` rather than from a block by name.
 *
 * /phkl's sticky button walks the reader down to the Memory Screening Package
 * rather than opening the booking form, so that nobody books before seeing
 * what the package is. This one does only that walk: there is nothing to book,
 * so the bar's whole job is to get a reader who has scrolled two screens of
 * report back to what they can actually do next.
 *
 * A real anchor rather than a button, so it works without JavaScript and reads
 * as a link to assistive tech.
 */
export function SiloamStickyCta() {
  const variant = useVariant();
  const c = boothReportFor(variant, useCopy()).sticky;
  const reduced = useReducedMotion();

  const scrollToOffer = (event: MouseEvent<HTMLAnchorElement>) => {
    const section = document.getElementById(SILOAM_OFFER_SECTION_ID);
    if (!section) return; // Let the plain #hash jump handle it.
    event.preventDefault();
    section.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <motion.div
      className="fixed inset-x-0 bottom-0 z-40"
      initial={reduced ? false : { y: 96, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: ease.out, delay: reduced ? 0 : 0.7 }}
    >
      <div className="border-t border-[#f2ddce]/80 bg-[#fff7f2]/92 shadow-[0_-14px_36px_-24px_rgba(90,40,10,0.45)] backdrop-blur-md">
        <div className="mx-auto w-full max-w-lg px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
          <a
            href={`#${SILOAM_OFFER_SECTION_ID}`}
            onClick={(event) => {
              track("booking_click", { variant, placement: "sticky" });
              scrollToOffer(event);
            }}
            className="flex h-[52px] w-full items-center justify-center whitespace-nowrap rounded-2xl bg-gradient-to-r from-ember-core to-ember-bright px-6 text-[15px] font-extrabold text-[#fafafa] shadow-[0_12px_36px_-14px_rgba(247,117,40,0.55)] transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-core"
          >
            {c.talk}
          </a>
        </div>
      </div>
    </motion.div>
  );
}
