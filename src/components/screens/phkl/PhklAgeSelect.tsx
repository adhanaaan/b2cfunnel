"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AGE_SELECT_QUESTION_ID } from "@/config/funnelFlow";
import { QUESTIONS_BY_ID } from "@/config/questions";
import { springs, stagger } from "@/lib/motion";
import { Event3Shell } from "@/components/screens/event3/Event3Shell";
import { arcCopyFor } from "@/config/copy";
import { useVariant } from "@/components/VariantContext";

interface PhklAgeSelectProps {
  /** The band already chosen, when the player comes back to this screen. */
  value?: string;
  onAnswer: (optionId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: springs.enter },
};

const option = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: springs.enter },
};

/** How long the chosen tile shows before the flow moves on (QuestionScreen's beat). */
const ADVANCE_MS = 220;

/**
 * PHKL "Select your age" (Figma "03 Select age"): the quiz's own `age`
 * question, asked before the game on the daylight backdrop so the report can
 * speak to the player's age band. One tap answers and advances; a second tap
 * before the advance is ignored, so a double tap cannot skip the instructions.
 */
export function PhklAgeSelect({
  value,
  onAnswer,
  onNext,
  onBack,
}: PhklAgeSelectProps) {
  const c = arcCopyFor(useVariant()).ageSelect;
  const question = QUESTIONS_BY_ID[AGE_SELECT_QUESTION_ID];
  const reduced = useReducedMotion();
  const [picked, setPicked] = useState<string | undefined>(value);
  const lockedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const choose = (id: string) => {
    if (lockedRef.current) return;
    lockedRef.current = true;
    setPicked(id);
    onAnswer(id);
    timerRef.current = setTimeout(onNext, ADVANCE_MS);
  };

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
        <motion.div variants={item} className="flex items-center pt-1">
          <button
            type="button"
            onClick={onBack}
            className="-ml-2 rounded-lg px-2 py-1.5 text-[13px] font-semibold text-secondary transition hover:bg-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-core"
          >
            ← Back
          </button>
        </motion.div>

        <div className="flex flex-1 flex-col justify-center">
          <motion.h1
            variants={item}
            className="text-center text-[clamp(1.9rem,4.6dvh,2.15rem)] font-bold leading-[1.07] text-[#171717]"
          >
            {c.heading}
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-3 text-center text-[clamp(0.9375rem,2.2dvh,1.0625rem)] leading-[1.45] text-[#171717]"
          >
            {c.body}
          </motion.p>

          <motion.div
            role="radiogroup"
            aria-label={question.prompt}
            className="mt-[3.5dvh] space-y-3"
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: reduced ? 0 : stagger.options },
              },
            }}
          >
            {question.options?.map((opt) => {
              const selected = picked === opt.id;
              return (
                <motion.button
                  key={opt.id}
                  variants={option}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => choose(opt.id)}
                  whileTap={reduced ? undefined : { scale: 0.985 }}
                  transition={springs.pop}
                  className={[
                    "flex min-h-[58px] w-full items-center gap-3 rounded-lg border-2 px-5 py-4 text-left text-[15px] font-medium shadow-card transition",
                    selected
                      ? "border-primary bg-primary-container text-primary-onContainer"
                      : "border-outline-variant bg-white text-charcoal hover:border-primary",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-core",
                  ].join(" ")}
                >
                  <span
                    aria-hidden
                    className={[
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition",
                      selected ? "border-primary bg-primary" : "border-outline",
                    ].join(" ")}
                  >
                    {selected && (
                      <svg viewBox="0 0 12 12" className="h-3 w-3 text-primary-on">
                        <path
                          d="M2 6l3 3 5-6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <span>{opt.label}</span>
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        <div aria-hidden className="h-[6dvh] shrink" />
      </motion.div>
    </Event3Shell>
  );
}
