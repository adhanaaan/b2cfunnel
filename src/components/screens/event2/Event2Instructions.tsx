"use client";

import { motion, useReducedMotion } from "framer-motion";
import { COPY } from "@/config/copy";
import { ArenaShell } from "@/components/ui/ArenaShell";
import { springs, stagger } from "@/lib/motion";

interface Event2InstructionsProps {
  /** Continue into the guided demo round. */
  onDemo: () => void;
  /** Straight to the countdown, skipping the tour. */
  onSkip: () => void;
}

const row = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: springs.enter },
};

/**
 * Full-page how-to-play (FigJam v2: "make instructions obvious, increase text
 * size, make it full page"). Three oversized rules, then the player chooses a
 * demo round or goes straight in.
 */
export function Event2Instructions({ onDemo, onSkip }: Event2InstructionsProps) {
  const c = COPY.screens.event2.instructions;
  const reduced = useReducedMotion();

  return (
    <ArenaShell>
      <motion.div
        className="flex min-h-[85dvh] flex-col justify-center"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: reduced ? 0 : stagger.items } },
        }}
        initial={reduced ? "show" : "hidden"}
        animate="show"
      >
        <motion.p
          variants={row}
          className="text-center text-xs font-bold uppercase tracking-[0.22em] text-ember-core"
        >
          {c.eyebrow}
        </motion.p>
        <motion.h1
          variants={row}
          className="mt-3 text-center font-serif text-4xl font-semibold leading-tight text-cream"
        >
          {c.heading}
        </motion.h1>

        <div className="mt-10 space-y-5">
          {c.steps.map((step, i) => (
            <motion.div
              key={i}
              variants={row}
              className="flex min-h-[4.5rem] items-center gap-4 rounded-2xl border border-night-stroke bg-night-raised/80 px-5 py-4"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ember-core text-lg font-extrabold text-[#2a1006]">
                {i + 1}
              </span>
              <p className="text-lg font-semibold leading-snug text-cream">
                {step}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p variants={row} className="mt-6 text-center text-sm text-cream-dim">
          {c.durationNote}
        </motion.p>

        <motion.div variants={row} className="mt-6 space-y-3">
          <motion.button
            type="button"
            onClick={onDemo}
            whileTap={reduced ? undefined : { scale: 0.97 }}
            transition={springs.pop}
            className="w-full rounded-xl bg-gradient-to-r from-ember-core to-ember-bright px-6 py-4 text-lg font-extrabold text-[#2a1006] shadow-[0_12px_40px_-8px_rgba(247,117,40,0.55)] transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-hot"
          >
            {c.demoCta} →
          </motion.button>
          <button
            type="button"
            onClick={onSkip}
            className="w-full rounded-xl px-6 py-3 text-base font-semibold text-cream-dim underline-offset-4 transition hover:text-cream hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-hot"
          >
            {c.skipCta}
          </button>
        </motion.div>
      </motion.div>
    </ArenaShell>
  );
}
