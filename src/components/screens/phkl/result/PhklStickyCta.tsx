"use client";

import { motion, useReducedMotion } from "framer-motion";
import { COPY } from "@/config/copy";
import { ease } from "@/lib/motion";
import { BookingLink } from "../ui";

/**
 * The one call to action on the report, pinned to the bottom of the screen
 * for the whole scroll (Figma 697:25742 pins it; here it docks at the bottom,
 * in reach of a thumb and clear of the section headings). Retry lives in the
 * header's top corner, so this bar is only ever about booking. It slides up
 * once the header has landed and then stays.
 */
export function PhklStickyCta() {
  const c = COPY.screens.phkl.report.sticky;
  const reduced = useReducedMotion();

  return (
    <motion.div
      className="fixed inset-x-0 bottom-0 z-40"
      initial={reduced ? false : { y: 96, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: ease.out, delay: reduced ? 0 : 0.7 }}
    >
      <div className="border-t border-[#f2ddce]/80 bg-[#fff7f2]/92 shadow-[0_-14px_36px_-24px_rgba(90,40,10,0.45)] backdrop-blur-md">
        <div className="mx-auto w-full max-w-lg px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
          <BookingLink
            placement="sticky"
            className="flex h-[52px] w-full items-center justify-center whitespace-nowrap rounded-2xl bg-gradient-to-r from-ember-core to-ember-bright px-6 text-[15px] font-extrabold text-[#fafafa] shadow-[0_12px_36px_-14px_rgba(247,117,40,0.55)] transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-core"
          >
            {c.book}
          </BookingLink>
        </div>
      </div>
    </motion.div>
  );
}
