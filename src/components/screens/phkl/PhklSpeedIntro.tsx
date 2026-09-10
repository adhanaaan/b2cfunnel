"use client";

import { motion, useReducedMotion } from "framer-motion";
import { springs, stagger } from "@/lib/motion";
import { Event3Shell } from "@/components/screens/event3/Event3Shell";
import { StrongWords, ctaPrimaryClass } from "@/components/screens/event3/ui";
import { PhklProgressRail } from "./PhklProgressRail";
import { arcCopyFor } from "@/config/copy";
import { useVariant } from "@/components/VariantContext";

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: springs.enter },
};

/**
 * PHKL primer (Figma "02 Intro"): what the player is about to measure, under
 * the GAME / QUIZ / RESULTS rail. The design leaves the screen without a
 * button; one is added so the step is never a dead end and can be worked from
 * a keyboard.
 */
export function PhklSpeedIntro({ onContinue }: { onContinue: () => void }) {
  const c = arcCopyFor(useVariant()).speedIntro;
  const reduced = useReducedMotion();

  return (
    <Event3Shell pills>
      <motion.div
        className="flex h-full min-h-0 flex-col"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: reduced ? 0 : stagger.items } },
        }}
        initial={reduced ? "show" : "hidden"}
        animate="show"
      >
        <motion.div variants={item} className="pt-1">
          <PhklProgressRail stage="game" />
        </motion.div>

        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <motion.p
            variants={item}
            className="text-xs font-bold uppercase tracking-[0.22em] text-ember-core"
          >
            {c.eyebrow}
          </motion.p>
          <motion.h1
            variants={item}
            className="mt-3 text-[clamp(1.9rem,4.6dvh,2.15rem)] font-bold leading-[1.07] text-[#171717]"
          >
            {c.heading}
          </motion.h1>

          <motion.div
            variants={item}
            className="my-[4.5dvh] flex items-center justify-center"
            aria-hidden
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/task-2/flash.png"
              alt=""
              draggable={false}
              className="animate-symbol-hover h-[clamp(120px,22dvh,176px)] w-auto select-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.25)]"
            />
          </motion.div>

          <motion.p
            variants={item}
            className="max-w-[320px] text-balance text-[clamp(1.0625rem,2.4dvh,1.1875rem)] leading-[1.35] text-[#171717]"
          >
            <StrongWords text={c.body} />
          </motion.p>
        </div>

        <motion.div variants={item} className="mt-auto pt-6">
          <motion.button
            type="button"
            onClick={onContinue}
            whileTap={reduced ? undefined : { scale: 0.97 }}
            transition={springs.pop}
            className={ctaPrimaryClass}
          >
            {c.cta} →
          </motion.button>
        </motion.div>
      </motion.div>
    </Event3Shell>
  );
}
