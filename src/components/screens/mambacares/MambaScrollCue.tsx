"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * The chevron under the standing chips (Figma 775:17618). This report opens on
 * the player's time and everything that matters is below it, so the first
 * screen has to say "there is more" - the /phkl report used its explainer for
 * that, and this one has nothing between the chips and the fold.
 *
 * Decoration only: it is not a control (the page scrolls), so it is hidden
 * from assistive tech rather than announced as one.
 */
export function MambaScrollCue() {
  const reduced = useReducedMotion();

  return (
    <div aria-hidden className="mt-5 flex justify-center pb-1">
      <motion.svg
        viewBox="0 0 24 24"
        className="h-6 w-6 text-[#ee743f]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={reduced ? undefined : { y: [0, 5, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M5 8.5 12 15l7-6.5" />
      </motion.svg>
    </div>
  );
}
