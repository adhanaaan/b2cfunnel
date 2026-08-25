"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { springs } from "@/lib/motion";
import { MoonSymbol, StarSymbol, SunSymbol, TappingHand } from "./DemoSymbols";

/**
 * The self-playing demo on the event3 instructions screen: an endless
 * GIF-like loop showing a real round in real time. A symbol appears, its
 * legend slot lights up, the hand slides to the matching key and taps it -
 * then the next round. The scripted answers are 0, 2, 1.
 */

const LEGEND = [
  { digit: 0, Symbol: SunSymbol },
  { digit: 1, Symbol: MoonSymbol },
  { digit: 2, Symbol: StarSymbol },
] as const;

/** Scripted correct answers, one per round, looping. */
const ROUNDS = [0, 2, 1] as const;

type Phase = "prompt" | "highlight" | "press";

const PHASE_MS: Record<Phase, number> = {
  prompt: 700, // symbol appears, player "reads" it
  highlight: 700, // its slot in the key lights up
  press: 1000, // hand slides over and taps the number
};

const NEXT_PHASE: Record<Phase, Phase | null> = {
  prompt: "highlight",
  highlight: "press",
  press: null, // advances the round
};

/** Horizontal centre offset of key i in the keypad row (52px keys, 16px gap). */
const keyOffset = (i: number) => (i - 1) * 68;

export function AutoPlayDemo({ badge }: { badge: string }) {
  const reduced = useReducedMotion();
  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState<Phase>("prompt");

  useEffect(() => {
    if (reduced) return;
    const next = NEXT_PHASE[phase];
    const t = setTimeout(() => {
      if (next) {
        setPhase(next);
      } else {
        setRound((r) => (r + 1) % ROUNDS.length);
        setPhase("prompt");
      }
    }, PHASE_MS[phase]);
    return () => clearTimeout(t);
  }, [phase, round, reduced]);

  // Reduced motion: hold the Figma mock's frame (sun prompt, key 0 pressed).
  const answer = reduced ? 0 : ROUNDS[round];
  const highlighted = reduced || phase !== "prompt";
  const pressed = reduced || phase === "press";
  const Prompt = LEGEND[answer].Symbol;

  return (
    <div className="w-full max-w-[320px]">
      {/* Badge */}
      <div className="flex justify-center">
        <span className="rounded-full border border-[#e7d7c9] bg-white/80 px-3.5 py-1 text-[10px] font-bold tracking-[0.08em] text-outline">
          {badge}
        </span>
      </div>

      {/* Prompt symbol */}
      <div className="mt-3.5 flex h-[96px] items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`prompt-${round}`}
            initial={reduced ? false : { scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={reduced ? undefined : { scale: 0.7, opacity: 0 }}
            transition={springs.pop}
            className="h-[96px] w-[96px]"
          >
            <Prompt className="h-full w-full" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Legend card: digit above symbol, answer slot highlighted */}
      <div className="mt-3 flex h-[86px] items-center justify-between rounded-2xl border border-[#f1e2d5] bg-white px-2.5 shadow-[0_2px_12px_-6px_rgba(51,18,0,0.1)]">
        {LEGEND.map(({ digit, Symbol }) => {
          const active = highlighted && digit === answer;
          return (
            <div
              key={digit}
              className={[
                "flex h-[66px] w-[94px] flex-col items-center justify-center gap-0.5 rounded-xl border-2 transition-colors duration-300",
                active
                  ? "border-ember-core bg-[#fdeee2]"
                  : "border-transparent",
              ].join(" ")}
            >
              <span className="text-[13px] font-bold leading-4 text-charcoal">
                {digit}
              </span>
              <Symbol className="h-[30px] w-[30px]" />
            </div>
          );
        })}
      </div>

      {/* Keypad card with the tapping hand */}
      <div className="relative mt-3">
        <div className="flex h-[76px] items-center justify-center gap-4 rounded-2xl border border-[#f1e2d5] bg-white shadow-[0_2px_12px_-6px_rgba(51,18,0,0.1)]">
          {LEGEND.map(({ digit }) => {
            const isPressed = pressed && digit === answer;
            return (
              <span
                key={digit}
                className={[
                  "flex h-[52px] w-[52px] items-center justify-center rounded-full bg-gradient-to-b from-ember-bright to-ember-core text-[22px] font-bold text-white transition-all duration-200",
                  isPressed
                    ? "scale-90 ring-2 ring-night-stroke ring-offset-2 ring-offset-white"
                    : "",
                ].join(" ")}
              >
                {digit}
              </span>
            );
          })}
        </div>
        {/* The hand slides to the answer key and dips on the tap. */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[46px] -ml-[6px]"
          animate={
            reduced
              ? { x: keyOffset(0) }
              : { x: keyOffset(answer), y: pressed ? -6 : 4 }
          }
          transition={springs.enter}
        >
          <TappingHand className="h-[38px] w-[34px] drop-shadow-[0_4px_6px_rgba(51,18,0,0.25)]" />
        </motion.div>
      </div>
    </div>
  );
}
