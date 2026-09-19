"use client";

import { motion, useReducedMotion } from "framer-motion";
import { springs, stagger } from "@/lib/motion";
import { Event3Shell } from "@/components/screens/event3/Event3Shell";
import { StrongWords, ctaPrimaryClass } from "@/components/screens/event3/ui";
import { useCopy } from "@/components/LanguageContext";

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: springs.enter },
};

/**
 * The Siloam summit after its prize-giving: the standings have been recapped
 * and the winners announced, so the results are settled.
 *
 * Sits between the landing and the processing-speed primer while
 * SILOAM_SCORES_FINAL is on (see resolveFlow), and it is deliberately NOT the
 * "That's a wrap!" screen: nothing is closed behind it. The whole arc - the
 * game, the questionnaire, the report - is still there, so this page says
 * where things stand and then hands the player straight on. That is why it
 * ends on a CTA rather than on a link out, and why the CTA is worded as an
 * invitation ("Play anyway") rather than as an acknowledgement.
 *
 * The padlock is one of the game's own symbols (see the symbol-match set), so
 * the page is drawn in the vocabulary the player is about to play in - and it
 * pictures the one word the copy leans on, "locked", rather than a stop sign.
 *
 * Read in whichever language the landing was answered in, like every other
 * screen on this arc.
 */
export function SiloamScoresFinal({ onContinue }: { onContinue: () => void }) {
  const c = useCopy().screens.siloam.scoresFinal;
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
              src="/images/task-2/lock.png"
              alt=""
              draggable={false}
              className="h-[clamp(112px,20dvh,160px)] w-auto select-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.22)]"
            />
          </motion.div>

          <motion.p
            variants={item}
            className="max-w-[320px] text-balance text-[clamp(1.0625rem,2.4dvh,1.1875rem)] leading-[1.35] text-[#171717]"
          >
            <StrongWords text={c.body} />
          </motion.p>

          <motion.p
            variants={item}
            className="mt-[2.2dvh] max-w-[320px] text-balance text-[clamp(0.9375rem,2.1dvh,1.0625rem)] leading-[1.4] text-secondary"
          >
            <StrongWords text={c.note} />
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
