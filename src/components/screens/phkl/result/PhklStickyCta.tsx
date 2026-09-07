"use client";

import { motion, useReducedMotion } from "framer-motion";
import { COPY } from "@/config/copy";
import { ease, springs } from "@/lib/motion";
import { RetryIcon } from "@/components/screens/event3/icons";
import { emberLabelGradient } from "@/components/screens/event3/ui";
import { BookingLink } from "../ui";

/**
 * The two things a player can do from the report, pinned to the bottom of the
 * screen for the whole scroll (Figma 697:25742 pins them; here they dock at
 * the bottom, in reach of a thumb and clear of the section headings). It
 * slides up once the header has landed and then stays.
 */
export function PhklStickyCta({ onRetry }: { onRetry: () => void }) {
  const c = COPY.screens.phkl.report.sticky;
  const reduced = useReducedMotion();
  const button =
    "flex h-[52px] items-center justify-center gap-1.5 whitespace-nowrap rounded-2xl text-[14.5px] font-extrabold shadow-[0_12px_36px_-14px_rgba(247,117,40,0.55)] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-core";

  return (
    <motion.div
      className="fixed inset-x-0 bottom-0 z-40"
      initial={reduced ? false : { y: 96, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: ease.out, delay: reduced ? 0 : 0.7 }}
    >
      <div className="border-t border-[#f2ddce]/80 bg-[#fff7f2]/92 shadow-[0_-14px_36px_-24px_rgba(90,40,10,0.45)] backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-lg gap-2 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
          <motion.button
            type="button"
            onClick={onRetry}
            whileTap={reduced ? undefined : { scale: 0.97 }}
            transition={springs.pop}
            className={`${button} shrink-0 bg-white px-3.5 text-[#ee743f] hover:brightness-[0.98]`}
          >
            <RetryIcon className="h-4 w-4" />
            <span className={emberLabelGradient}>{c.retry}</span>
          </motion.button>
          <BookingLink
            placement="sticky"
            className={`${button} min-w-0 flex-1 bg-gradient-to-r from-ember-core to-ember-bright px-3 text-[#fafafa] hover:brightness-105`}
          >
            {c.book}
          </BookingLink>
        </div>
      </div>
    </motion.div>
  );
}
