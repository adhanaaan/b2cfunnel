"use client";

import { motion, useReducedMotion } from "framer-motion";
import { COPY } from "@/config/copy";
import { springs, stagger } from "@/lib/motion";
import { Event3Shell } from "./Event3Shell";

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: springs.enter },
};

/**
 * The end of the road while the challenge is closed (Figma "That's a wrap!"):
 * the last step of the v3 flow when EVENT3_CHALLENGE_CLOSED is on, reached
 * straight after the partner consent page.
 *
 * Deliberately terminal - no CTA back into the funnel, because there is
 * nothing behind it to play. The only way onward is out to the GMS site.
 */
export function Event3Wrap() {
  const c = COPY.screens.event3.wrap;
  const reduced = useReducedMotion();

  return (
    <Event3Shell pills>
      <motion.div
        className="flex h-full min-h-0 flex-col items-center justify-center text-center"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: reduced ? 0 : stagger.items } },
        }}
        initial={reduced ? "show" : "hidden"}
        animate="show"
      >
        {/* The game's own lightning symbol, at the 120px the design uses. */}
        <motion.div variants={item}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/task-2/flash.png"
            alt=""
            aria-hidden
            className="h-[clamp(88px,14dvh,120px)] w-[clamp(88px,14dvh,120px)] object-contain"
          />
        </motion.div>

        <motion.h1
          variants={item}
          className="mt-[3dvh] text-[clamp(26px,4.3dvh,34.4px)] font-bold leading-[1.07] text-[#171717]"
        >
          {c.heading}
        </motion.h1>

        <motion.p
          variants={item}
          className="mx-auto mt-[2.4dvh] max-w-[22rem] text-[clamp(15px,2.2dvh,17px)] leading-[1.45] text-[#171717]"
        >
          {c.body}
        </motion.p>

        <motion.a
          variants={item}
          href={c.linkHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-[7.7dvh] flex h-[74px] w-[295px] max-w-full items-center justify-center gap-3 rounded-[20px] bg-gradient-to-r from-[#e8782e] via-[#f09452] to-[#f5b880] px-4 text-left text-[13.5px] font-bold leading-[1.625] text-[#fafafa] shadow-[0_12px_40px_-12px_rgba(247,117,40,0.45)] transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-core"
        >
          {/* The GMS brain mark, drawn white over the ember card as designed -
              the filter recolours the one flat-orange logo we ship rather than
              carrying a second copy of it. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/gms-logo.png"
            alt=""
            aria-hidden
            className="h-[44px] w-[47px] shrink-0 object-contain [filter:brightness(0)_invert(1)]"
          />
          <span>
            {c.linkIntro}
            <br />
            <span className="underline decoration-from-font underline-offset-2">
              {c.linkLabel} →
            </span>
          </span>
        </motion.a>
      </motion.div>
    </Event3Shell>
  );
}
