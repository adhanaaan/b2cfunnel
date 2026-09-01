"use client";

import { motion, useReducedMotion } from "framer-motion";
import { COPY } from "@/config/copy";
import { springs, stagger } from "@/lib/motion";
import { unlockAudio } from "@/lib/gameAudio";
import { SpeedgameShell } from "./SpeedgameShell";
import { AutoPlayDemo } from "./AutoPlayDemo";
import { ctaInverseClass, ctaPrimaryClass, emberLabelGradient } from "./ui";

interface SpeedgameInstructionsProps {
  /** Continue into the guided demo round. */
  onDemo: () => void;
  /** Straight to the countdown, skipping the tour. */
  onSkip: () => void;
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: springs.enter },
};

/**
 * Speed Game instructions (independent duplicate of Event3Instructions,
 * Figma "02 challenge 1"): instead of written rules, a self-playing demo loop
 * shows a real round in real time. The player can then run the guided demo
 * round or jump straight in.
 */
export function SpeedgameInstructions({ onDemo, onSkip }: SpeedgameInstructionsProps) {
  const c = COPY.screens.speedgame.instructions;
  const reduced = useReducedMotion();

  // iOS only opens an audio context inside a real tap, and this screen holds
  // the last one before the game starts.
  const start = (go: () => void) => () => {
    unlockAudio();
    go();
  };

  // "Match {count} symbols to its number as fast as you can." with the count
  // bolded, as designed.
  const [subBefore, subAfter] = c.subheading.split("{count}");

  return (
    <SpeedgameShell pills={false} blobs>
      <motion.div
        className="flex h-full min-h-0 flex-col items-center text-center"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: reduced ? 0 : stagger.items } },
        }}
        initial={reduced ? "show" : "hidden"}
        animate="show"
      >
        <div className="flex flex-1 flex-col items-center justify-center">
        <motion.h1
          variants={item}
          className="max-w-sm text-[2rem] font-bold leading-[1.06] text-[#171717] tall:text-[2.3rem]"
        >
          {c.heading}
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-3 text-[14.5px] leading-normal text-secondary tall:mt-4"
        >
          {subBefore}
          <strong className="font-bold">20</strong>
          {subAfter}
        </motion.p>

        <motion.div variants={item} className="mt-4 flex w-full justify-center tall:mt-6">
          <AutoPlayDemo badge={c.demoBadge} />
        </motion.div>

        <motion.p
          variants={item}
          className="mx-auto mt-3 max-w-[300px] text-[12.5px] leading-normal text-outline tall:mt-4"
        >
          {c.helper}
        </motion.p>
        </div>

        <motion.div
          variants={item}
          className="mt-auto flex w-full gap-3 pt-6"
        >
          <motion.button
            type="button"
            onClick={start(onDemo)}
            whileTap={reduced ? undefined : { scale: 0.97 }}
            transition={springs.pop}
            className={`${ctaInverseClass} flex-[0.85]`}
          >
            <span className={emberLabelGradient}>{c.demoCta}</span>
          </motion.button>
          <motion.button
            type="button"
            onClick={start(onSkip)}
            whileTap={reduced ? undefined : { scale: 0.97 }}
            transition={springs.pop}
            className={`${ctaPrimaryClass} flex-1`}
          >
            {c.playCta}
          </motion.button>
        </motion.div>
      </motion.div>
    </SpeedgameShell>
  );
}
