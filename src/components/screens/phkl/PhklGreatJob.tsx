"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { COPY } from "@/config/copy";
import { dur, ease, springs, stagger } from "@/lib/motion";
import { Event3Shell } from "@/components/screens/event3/Event3Shell";

/** The five symbols that take a bow (Figma "07 Great job"), in the design's order. */
const SYMBOLS = ["star", "sun", "moon", "flash", "setting"] as const;

/** How long the beat holds before it walks on; shorter when nothing moves. */
const HOLD_MS = 2400;
const HOLD_REDUCED_MS = 1600;

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: springs.enter },
};

const symbol = {
  hidden: { opacity: 0, y: 18, scale: 0.85 },
  show: { opacity: 1, y: 0, scale: 1, transition: springs.enter },
};

/**
 * The beat after the 20th match: "Great job in measuring your speed!" over
 * the game's symbols, which settle in one after another and then rock in a
 * slow wave. After HOLD_MS the whole thing lifts away and the flow moves on
 * by itself; a tap anywhere does the same at once, and the two can never
 * fire NEXT twice. Under reduced motion nothing loops and the hold is shorter.
 */
export function PhklGreatJob({ onDone }: { onDone: () => void }) {
  const c = COPY.screens.phkl.greatJob;
  const reduced = useReducedMotion();
  const [leaving, setLeaving] = useState(false);
  const leavingRef = useRef(false);
  const doneRef = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone();
  }, [onDone]);

  const startLeaving = useCallback(() => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    if (reduced) {
      finish();
      return;
    }
    setLeaving(true);
  }, [reduced, finish]);

  useEffect(() => {
    const t = setTimeout(startLeaving, reduced ? HOLD_REDUCED_MS : HOLD_MS);
    return () => clearTimeout(t);
  }, [startLeaving, reduced]);

  return (
    <Event3Shell pills={false}>
      <button
        type="button"
        onClick={startLeaving}
        aria-label={`${c.heading} ${c.skipHint}`}
        className="flex h-full min-h-0 w-full flex-1 cursor-pointer flex-col items-center justify-center text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember-core"
      >
        <motion.div
          className="flex w-full flex-col items-center"
          animate={leaving ? { opacity: 0, y: -28 } : { opacity: 1, y: 0 }}
          transition={{ duration: dur.page, ease: ease.in }}
          onAnimationComplete={() => {
            if (leaving) finish();
          }}
        >
          <motion.div
            className="flex w-full flex-col items-center"
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: reduced ? 0 : stagger.items },
              },
            }}
            initial={reduced ? "show" : "hidden"}
            animate="show"
          >
            <motion.h1
              variants={item}
              aria-live="polite"
              className="max-w-[300px] text-balance text-[clamp(1.9rem,4.6dvh,2.15rem)] font-bold leading-[1.07] text-secondary"
            >
              {c.heading}
            </motion.h1>

            <motion.div
              className="mt-7 flex w-full items-center justify-center gap-[clamp(14px,5.5vw,26px)] px-2"
              variants={{
                hidden: {},
                show: {
                  transition: { staggerChildren: reduced ? 0 : stagger.items },
                },
              }}
              aria-hidden
            >
              {SYMBOLS.map((name, i) => (
                <motion.div key={name} variants={symbol}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/images/task-2/${name}.png`}
                    alt=""
                    draggable={false}
                    className={[
                      "h-[clamp(40px,11.5vw,56px)] w-auto select-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]",
                      reduced ? "" : "animate-symbol-wave",
                    ].join(" ")}
                    style={{ ["--wave-delay" as string]: `${i * 0.18}s` }}
                  />
                </motion.div>
              ))}
            </motion.div>

            <motion.p
              variants={item}
              className="mt-10 text-[11px] font-semibold uppercase tracking-[0.18em] text-outline"
            >
              {c.skipHint}
            </motion.p>
          </motion.div>
        </motion.div>
      </button>
    </Event3Shell>
  );
}
