"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ease, springs } from "@/lib/motion";
import { arcCopyFor } from "@/config/copy";
import { useVariant } from "@/components/VariantContext";

/** Which leg of the journey the rail is standing on. */
export type RailStage = "game" | "quiz";

/**
 * The three stops, as fractions of the rail (Figma 697:25685-25692: the game
 * stop a fifth of the way in, the quiz stop three quarters, results at the
 * end). The fill runs from where the previous stage left it to the current
 * stop, so the bar visibly advances when the player arrives.
 */
const STOPS = [
  { key: "game", at: 0.2 },
  { key: "quiz", at: 0.73 },
  { key: "results", at: 1 },
] as const;

const FILL: Record<RailStage, { from: number; to: number }> = {
  game: { from: 0.05, to: 0.2 },
  quiz: { from: 0.2, to: 0.73 },
};

const STOP_PX = 36;

/**
 * The GAME / BRAIN HEALTH QUIZ / RESULTS rail on the two primers, so the
 * player always knows how much is left: three stops on an amber track, the
 * fill drawn up to the stop they are on.
 */
export function PhklProgressRail({ stage }: { stage: RailStage }) {
  const c = arcCopyFor(useVariant()).rail;
  const reduced = useReducedMotion();
  const fill = FILL[stage];
  const stepIndex = stage === "game" ? 1 : 2;
  const labels: Record<(typeof STOPS)[number]["key"], string> = {
    game: c.gameLabel,
    quiz: c.quizLabel,
    results: c.resultsLabel,
  };

  // Stop centres are mapped into [half a stop, width - half a stop] so the
  // last stop sits flush with the rail's end instead of overhanging it.
  const centre = (at: number) =>
    `calc(${at} * (100% - ${STOP_PX}px) + ${STOP_PX / 2}px)`;

  return (
    <div
      className="w-full"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={3}
      aria-valuenow={stepIndex}
      aria-valuetext={`Step ${stepIndex} of 3: ${labels[stage]}`}
    >
      <div className="relative h-3 w-full">
        <div className="absolute inset-0 rounded-full bg-[#e8dcd3]" />
        <motion.div
          className="absolute inset-y-0 left-0 origin-left rounded-full bg-gradient-to-r from-[#f59e0a] via-[#f6a823]/90 to-[#f8bb54]/70"
          style={{ width: `${fill.to * 100}%` }}
          initial={reduced ? false : { scaleX: fill.from / fill.to }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, ease: ease.out, delay: 0.15 }}
        />
        {STOPS.map((stop) => {
          const active = stop.key === stage;
          const passed = stop.at < fill.to;
          return (
            <div
              key={stop.key}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ left: centre(stop.at) }}
            >
              <motion.div
                className={[
                  "flex items-center justify-center rounded-full bg-white shadow-[0_4px_12px_-4px_rgba(51,18,0,0.3)]",
                  active ? "ring-2 ring-ember-core" : "",
                  !active && !passed ? "opacity-70" : "",
                ].join(" ")}
                style={{ width: STOP_PX, height: STOP_PX }}
                initial={reduced || !active ? false : { scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ ...springs.enter, delay: 0.45 }}
              >
                {stop.key === "game" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src="/images/task-2/flash.png"
                    alt=""
                    className="h-6 w-6 object-contain"
                    draggable={false}
                  />
                ) : (
                  <span className="text-[19px] leading-none" aria-hidden>
                    {stop.key === "quiz" ? "\u{1F9E0}" : "\u{1F3C6}"}
                  </span>
                )}
              </motion.div>
            </div>
          );
        })}
      </div>

      <div className="relative mt-2 h-8">
        {STOPS.map((stop) => {
          const last = stop.key === "results";
          return (
            <span
              key={stop.key}
              className={[
                "absolute w-[92px] text-[10.5px] font-semibold uppercase leading-[1.3] tracking-[0.06em] text-secondary",
                last ? "right-0 text-right" : "-translate-x-1/2 text-center",
              ].join(" ")}
              style={last ? undefined : { left: centre(stop.at) }}
            >
              {labels[stop.key]}
            </span>
          );
        })}
      </div>
    </div>
  );
}
