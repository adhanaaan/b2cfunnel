"use client";

import { useEffect, useState } from "react";
import { animate, motion, useReducedMotion } from "framer-motion";
import { firstName, formatTime, ordinal } from "@/lib/format";
import { springs, stagger } from "@/lib/motion";
import { RetryIcon, ShareIcon } from "@/components/screens/event3/icons";
import {
  emberLabelGradient,
  emberTextGradient,
} from "@/components/screens/event3/ui";
import type { Standing } from "@/components/screens/event3/useStanding";
import { arcCopyFor } from "@/config/copy";
import { useVariant } from "@/components/VariantContext";

interface PhklResultHeaderProps {
  name?: string;
  timeMs?: number;
  /** How many times the game has been finished; drives "2nd record". */
  attempts?: number;
  standing: Standing;
  share: { share: () => void; sharing: boolean; shareNote: string | null };
  /** Play the reaction game again; the flow brings them straight back here. */
  onRetry: () => void;
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: springs.enter },
};

const cornerButton =
  "flex items-center gap-1.5 rounded-lg px-1 py-1 text-[12px] font-bold uppercase tracking-[0.22em] text-[#ee743f] transition hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-core";

/**
 * The top of the PHKL report (Figma "05 Result page"): share and retry in the
 * top corners, as on the post-game card, then the player's time, counted up,
 * under "{name}'s 1st record in processing speed", with their rank and the
 * fastest so far beneath. Kept tight, so the brain and the start of
 * "Processing speed" below it land above the fold.
 */
export function PhklResultHeader({
  name,
  timeMs,
  attempts,
  standing,
  share,
  onRetry,
}: PhklResultHeaderProps) {
  const c = arcCopyFor(useVariant()).report.header;
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced ? (timeMs ?? 0) : 0);
  const [countDone, setCountDone] = useState(!!reduced);

  // The hero count-up: 0 -> the real time over 900ms, tap-skippable. Re-runs
  // when a replay brings a new time.
  useEffect(() => {
    if (timeMs == null || reduced) {
      setDisplay(timeMs ?? 0);
      setCountDone(true);
      return;
    }
    setCountDone(false);
    const controls = animate(0, timeMs, {
      duration: 0.9,
      ease: "easeOut",
      onUpdate: setDisplay,
      onComplete: () => setCountDone(true),
    });
    return () => controls.stop();
  }, [timeMs, reduced]);

  const skipCountUp = () => {
    if (!countDone && timeMs != null) {
      setDisplay(timeMs);
      setCountDone(true);
    }
  };

  const first = firstName(name);
  const heading = (first
    ? c.heading.replace("{name}", first)
    : c.headingAnonymous
  ).replace("{ordinal}", ordinal(attempts ?? 1));

  return (
    <motion.section
      className="flex flex-col"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: reduced ? 0 : stagger.items } },
      }}
      initial={reduced ? "show" : "hidden"}
      animate="show"
    >
      {/* Top corners: share / retry */}
      <motion.div variants={item} className="relative flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={share.share}
          disabled={share.sharing || timeMs == null}
          className={`${cornerButton} -ml-1 disabled:opacity-50`}
        >
          <ShareIcon className="h-[22px] w-[22px]" />
          <span className={emberLabelGradient}>
            {share.sharing ? "…" : c.shareLabel}
          </span>
        </button>
        <button
          type="button"
          onClick={onRetry}
          className={`${cornerButton} -mr-1`}
        >
          <RetryIcon className="h-[20px] w-[20px]" />
          <span className={emberLabelGradient}>{c.retryLabel}</span>
        </button>
        {share.shareNote && (
          <p
            role="status"
            className="absolute left-0 right-0 top-full mt-1 text-center text-[11px] text-outline"
          >
            {share.shareNote}
          </p>
        )}
      </motion.div>

      <motion.p
        variants={item}
        className="mt-7 text-center text-xs font-bold uppercase tracking-[0.22em] text-ember-core"
      >
        {c.eyebrow}
      </motion.p>

      <motion.h1
        variants={item}
        className="mx-auto mt-2 max-w-[330px] text-balance text-center font-bold leading-[1.15] text-[#171717]"
      >
        <span className="block text-[clamp(22px,6.2vw,25px)]">{heading}</span>
        {/* The gradient fill is clipped to the line's box, and at this leading
            the descenders of "processing speed" reach below it. Give the box
            room underneath and take the same room back from the margin, so
            the letters paint whole and nothing else moves. */}
        <span
          className={`-mb-[0.2em] block pb-[0.2em] text-[clamp(29px,8.4vw,33px)] ${emberTextGradient}`}
        >
          {c.headingHighlight}
        </span>
      </motion.h1>

      {/* Hero time. Tap skips the count-up. */}
      <motion.button
        variants={item}
        type="button"
        onClick={skipCountUp}
        className="mx-auto mt-6 cursor-default text-center"
        aria-label={`${c.timeLabel}: ${timeMs != null ? formatTime(timeMs) : "unavailable"}`}
      >
        <span className="block text-xs font-bold uppercase tracking-[0.22em] text-ember-core">
          {c.timeLabel}
        </span>
        <span className="mt-1 block text-[clamp(56px,17vw,72px)] font-extrabold leading-none tabular-nums tracking-[-0.02em] text-[#171717] [text-shadow:0_0_50px_rgba(247,117,40,0.35)]">
          {timeMs != null ? formatTime(display) : "-"}
        </span>
        <span
          className={[
            "mx-auto mt-2 block h-1 rounded-full bg-gradient-to-r from-ember-core to-ember-hot transition-all duration-500",
            countDone ? "w-24 opacity-100" : "w-4 opacity-0",
          ].join(" ")}
        />
      </motion.button>

      {/* Standing chips: your rank / fastest so far */}
      <motion.div variants={item} className="mt-6 flex justify-between gap-3">
        <div className="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl bg-white/45 px-2 py-3 text-center backdrop-blur-[2px]">
          <p className={`w-full text-[10px] font-bold uppercase tracking-[0.1em] ${emberLabelGradient}`}>
            {c.rankLabel}
          </p>
          <p className="w-full text-2xl font-extrabold leading-8 tabular-nums tracking-[-0.24px] text-[#171717]">
            {standing.rank ? `#${standing.rank}` : "-"}
          </p>
          <p className="w-full truncate text-[11px] font-semibold leading-[14px] text-[#171717]">
            {name ?? " "}
          </p>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl bg-white/45 px-2 py-3 text-center backdrop-blur-[2px]">
          <p className={`w-full text-[10px] font-bold uppercase tracking-[0.1em] ${emberLabelGradient}`}>
            {c.fastestLabel}
          </p>
          <p className="w-full text-2xl font-extrabold leading-8 tabular-nums tracking-[-0.24px] text-[#171717]">
            {standing.top ? formatTime(standing.top.timeMs) : "-"}
          </p>
          <p className="w-full truncate text-[11px] font-semibold leading-[14px] text-[#171717]">
            {standing.top ? standing.top.name : c.fastestEmpty}
          </p>
        </div>
      </motion.div>
    </motion.section>
  );
}
