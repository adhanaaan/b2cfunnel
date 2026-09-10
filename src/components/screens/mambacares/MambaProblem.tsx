"use client";

import { motion, useReducedMotion } from "framer-motion";
import { COPY } from "@/config/copy";
import { formatTime } from "@/lib/format";
import { ease } from "@/lib/motion";
import { Reveal } from "@/components/screens/phkl/ui";

/**
 * "You were fast. Alzheimer's takes that speed away." (Figma 775:17624).
 *
 * The one dark section in the report, and the turn in it: the player's own
 * round is put next to how long the same response takes with dementia, and the
 * ask that follows is about the people on the slower track. The ink is the
 * arena's own night palette, so the turn reads as a change of register rather
 * than as a different product.
 *
 * The comparison is illustrative and says so under the bars - it is a picture
 * of a published effect, not this player's own second reading, and must never
 * be dressed up as one.
 */
export function MambaProblem({ timeMs }: { timeMs?: number }) {
  const c = COPY.screens.mambacares.report.problem;
  const reduced = useReducedMotion();

  // The player's bar is drawn at a fixed share of the track and the dementia
  // bar at `dementiaFactor` times that, so the two always read in proportion
  // to each other whatever the time was - the track is not a time axis.
  const yourWidth = 22;
  const dementiaWidth = Math.min(96, yourWidth * c.dementiaFactor);

  const bar = (width: number, className: string) => (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
      <motion.div
        className={`h-full rounded-full ${className}`}
        initial={reduced ? false : { width: 0 }}
        whileInView={{ width: `${width}%` }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7, ease: ease.out }}
        style={reduced ? { width: `${width}%` } : undefined}
      />
    </div>
  );

  return (
    <section className="bg-night-ink px-6 pb-14 pt-14 text-cream">
      <Reveal>
        <h2 className="text-balance text-[clamp(1.9rem,8.6vw,2.25rem)] font-extrabold leading-[1.14] tracking-[-0.025em] text-white">
          {c.heading}
        </h2>
      </Reveal>

      <Reveal className="mt-8">
        <figure className="rounded-[22px] border border-night-stroke bg-night-raised/70 px-5 py-5">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-ember-hot">
              {c.yourRoundLabel}
            </span>
            <span className="text-[15px] font-extrabold tabular-nums text-white">
              {timeMs != null ? formatTime(timeMs) : "-"}
            </span>
          </div>
          <div className="mt-2">{bar(yourWidth, "bg-ember-core")}</div>

          <div className="mt-6 flex items-baseline justify-between gap-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-cream-dim">
              {c.dementiaLabel}
            </span>
            <span className="text-[15px] font-extrabold text-white">
              {c.dementiaValue}
            </span>
          </div>
          <div className="mt-2">{bar(dementiaWidth, "bg-cream-dim")}</div>

          <figcaption className="mt-5 text-[11.5px] leading-[1.5] text-cream-faint">
            {c.note}
          </figcaption>
        </figure>
      </Reveal>

      {c.paragraphs.map((para, i) => (
        <Reveal key={para} className={i === 0 ? "mt-8" : "mt-5"}>
          <p className="text-[15.5px] leading-[1.62] text-cream/90">{para}</p>
        </Reveal>
      ))}
    </section>
  );
}
