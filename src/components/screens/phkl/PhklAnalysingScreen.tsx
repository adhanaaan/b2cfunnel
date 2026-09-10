"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { dur, ease, springs } from "@/lib/motion";
import { Event3Shell } from "@/components/screens/event3/Event3Shell";
import { arcCopyFor } from "@/config/copy";
import { useVariant } from "@/components/VariantContext";

/**
 * The PHKL loading beat (Figma "Preparing your report"): a thick ember ring
 * that counts to 100% while every part of the workup ticks off, one after
 * another, instead of the shared arc's spinner + single cycling crumb.
 *
 * One clock drives both, so the number and the ticks can never disagree: the
 * ring is the elapsed fraction of the whole run, and step i is done once that
 * fraction passes (i + 1) / steps.length. Under reduced motion the run is
 * shorter and nothing animates - the ticks simply appear.
 */

/** How long each part of the workup holds before it ticks off. */
const STEP_MS = 1150;
const STEP_REDUCED_MS = 550;
/** The beat at 100% before the report opens. */
const HOLD_MS = 700;
/** Ring geometry (viewBox units). */
const R = 84;
const STROKE = 26;
const CIRCUMFERENCE = 2 * Math.PI * R;

export function PhklAnalysingScreen({
  name,
  onDone,
}: {
  name?: string;
  onDone: () => void;
}) {
  const c = arcCopyFor(useVariant()).analysing;
  const reduced = useReducedMotion();
  const steps = c.steps;

  // Elapsed fraction of the whole run, 0 -> 1.
  const [progress, setProgress] = useState(0);
  const doneRef = useRef(false);

  const heading = name
    ? c.heading.replace("{name}", name)
    : c.headingAnonymous;

  useEffect(() => {
    const total = steps.length * (reduced ? STEP_REDUCED_MS : STEP_MS);
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const fraction = Math.min(1, (now - start) / total);
      setProgress(fraction);
      if (fraction < 1) {
        frame = requestAnimationFrame(tick);
        return;
      }
      // Hold on a full ring, then hand over. Guarded so a late frame after
      // unmount (or a second pass) can never advance the flow twice.
      setTimeout(() => {
        if (doneRef.current) return;
        doneRef.current = true;
        onDone();
      }, HOLD_MS);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [steps.length, reduced, onDone]);

  const percent = Math.round(progress * 100);
  const doneCount = Math.floor(progress * steps.length + 1e-9);

  return (
    <Event3Shell pills={false} blobs>
      <div className="flex h-full min-h-0 w-full flex-1 flex-col items-center justify-center py-6 text-center">
        {/* The ring, with the percentage in its eye. */}
        <div
          className="relative h-[clamp(150px,42vw,196px)] w-[clamp(150px,42vw,196px)] shrink-0"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          aria-label={heading}
        >
          <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
            <circle
              cx="100"
              cy="100"
              r={R}
              fill="none"
              stroke="#f9ddcf"
              strokeWidth={STROKE}
            />
            <circle
              cx="100"
              cy="100"
              r={R}
              fill="none"
              stroke="#e2753f"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
            />
          </svg>
          <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-center text-[clamp(1.7rem,7.5vw,2.15rem)] font-bold tabular-nums tracking-[-0.03em] text-charcoal"
          >
            {percent}%
          </span>
        </div>

        <h1 className="mt-8 max-w-[320px] text-balance font-serif text-[clamp(1.75rem,7.4vw,2.1rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-[#1c110a]">
          {heading}
        </h1>

        {/* Every part of the workup, listed up front and ticked as it lands.
            One polite live region for the lot, so a screen reader hears each
            line as it completes rather than the whole list on every frame. */}
        <ul
          aria-live="polite"
          className="mt-9 flex w-full max-w-[330px] flex-col gap-4 px-2 text-left"
        >
          {steps.map((step, i) => {
            const complete = i < doneCount;
            const active = i === doneCount;
            return (
              <li key={step} className="flex items-start gap-3">
                <span
                  aria-hidden
                  className={[
                    "mt-[1px] flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300",
                    complete
                      ? "border-[#e2753f] bg-[#e2753f] text-white"
                      : active
                        ? "border-[#e2753f] bg-transparent text-transparent"
                        : "border-[#eccdb9] bg-transparent text-transparent",
                    active && !reduced ? "animate-step-pulse" : "",
                  ].join(" ")}
                >
                  <motion.svg
                    viewBox="0 0 24 24"
                    className="h-[15px] w-[15px]"
                    initial={false}
                    animate={
                      complete
                        ? { scale: 1, opacity: 1 }
                        : { scale: 0.4, opacity: 0 }
                    }
                    transition={reduced ? { duration: 0 } : springs.pop}
                  >
                    <path
                      d="M5 12.5l4.5 4.5L19 7.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                </span>
                <motion.span
                  className={[
                    "text-[15px] font-bold leading-[1.35]",
                    complete || active ? "text-[#1c110a]" : "text-[#a8877a]",
                  ].join(" ")}
                  initial={false}
                  animate={{ opacity: complete || active ? 1 : 0.75 }}
                  transition={
                    reduced ? { duration: 0 } : { duration: dur.base, ease: ease.out }
                  }
                >
                  {step}
                </motion.span>
              </li>
            );
          })}
        </ul>
      </div>
    </Event3Shell>
  );
}
