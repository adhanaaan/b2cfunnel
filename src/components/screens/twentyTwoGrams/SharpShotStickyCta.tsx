"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SHARP_SHOT_BANNER } from "@/config/twentyTwoGrams";
import { track } from "@/lib/analytics";
import { springs } from "@/lib/motion";
import { useVariant } from "@/components/VariantContext";
import { emberLabelGradient } from "@/components/screens/event3/ui";
import { OptionalImage } from "@/components/screens/phkl/OptionalImage";
import { SharpShotCup } from "./SharpShotCup";

/**
 * The one call to action on the /22grams report, pinned to the bottom of the
 * screen for the whole scroll - built to Figma 925:9246.
 *
 * Every other event on this report walks the reader DOWN to its close. This
 * one sends them back to the game, and that is the point rather than an
 * oversight: the thing still on offer at Sharp Shot Week is a free drink for
 * a run under the threshold, so for a reader two screens into a report the
 * useful button is another go - whether they missed it or could beat it
 * again. The close is still there to scroll to, and answers a tap of its own.
 *
 * The design is a 346x121 card with the drink breaking out over its top-left
 * corner, so it floats above the bottom edge rather than sitting flush to it,
 * and draws in the design's own pixels: `--b` is one design pixel, the card
 * scaled to fill the width inside a 22px gutter and capped at 1.2x. Its enter
 * is a pop rather than a slide, so it arrives as a thing that appeared rather
 * than a bar that was always going to.
 */

/** `n` design pixels, in the banner's unit (a LENGTH - see the poster). */
const b = (n: number) => `calc(var(--b) * ${n})`;

/** The same cut-out the poster uses; optional, like every image here. */
const DRINK = "/images/22grams/sharp-shot-drink.png";

export function SharpShotStickyCta({ onRetry }: { onRetry: () => void }) {
  const variant = useVariant();
  const reduced = useReducedMotion();
  const c = SHARP_SHOT_BANNER;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-[22px] pb-[max(14px,env(safe-area-inset-bottom))]"
      style={{
        // One design pixel: fill the width inside the gutter, never past 1.2x.
        ["--b" as string]: "min(1.2px, (100vw - 44px) / 346)",
      }}
    >
      <motion.div
        className="pointer-events-auto relative"
        style={{ width: b(346), height: b(121) }}
        initial={reduced ? false : { opacity: 0, scale: 0.9, y: 28 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ ...springs.pop, delay: reduced ? 0 : 0.5 }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#f77528] to-[#ff9a4d] shadow-[0_18px_44px_-16px_rgba(122,46,12,0.55)]"
          style={{ borderRadius: b(20) }}
        />

        <p
          className="absolute font-extrabold text-cream"
          style={{
            left: b(103),
            top: b(12),
            width: b(250),
            fontSize: b(20.768),
            lineHeight: 1.04,
            letterSpacing: b(-0.3115),
          }}
        >
          {c.heading.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>

        {/* The cut-out breaks out over the panel's top edge (925:9244), which
            is why it is not clipped by the panel above.

            The design layers this OVER the fineprint, leaving only the part of
            that line clear of the cup showing. Here it goes under, so the
            condition on the offer is readable in full - it is the one line on
            this card that qualifies what is being promised, and a promise
            half-hidden behind a coffee cup is worse than one that breaks the
            layer order. */}
        <OptionalImage
          src={DRINK}
          alt=""
          className="pointer-events-none absolute object-cover"
          style={{
            left: 0,
            top: b(-64),
            width: b(103),
            height: b(185),
            borderBottomLeftRadius: b(20),
          }}
          // The layout leaves this corner to the cut-out, so the drawn cup
          // stands in rather than nothing: an empty 103px gutter beside the
          // headline reads as a mistake, and this card is on every reader's
          // screen for the whole report.
          fallback={
            <SharpShotCup
              className="pointer-events-none absolute"
              style={{ left: 0, top: b(-64), width: b(103), height: b(185) }}
            />
          }
        />

        <p
          className="absolute font-bold italic leading-[1.1] text-cream"
          style={{ left: b(29), top: b(73), width: b(61), fontSize: b(9.09) }}
        >
          {c.fineprint}
        </p>

        {/* Button/Ember CTA, inverse: white fill, gradient label, 97% pressed
            - the vocabulary the daylight screens already use. */}
        <motion.button
          type="button"
          onClick={() => {
            track("game_retake", { variant, step: "sticky" });
            onRetry();
          }}
          whileTap={reduced ? undefined : { scale: 0.97 }}
          transition={springs.pop}
          className="absolute flex items-center justify-center bg-white shadow-[0_7px_24px_0_rgba(247,117,40,0.35)] transition hover:brightness-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          style={{
            left: b(101),
            top: b(69),
            width: b(221),
            height: b(35),
            borderRadius: b(16),
          }}
        >
          <span
            className={`font-extrabold ${emberLabelGradient}`}
            style={{ fontSize: b(15.5) }}
          >
            {c.cta}
          </span>
        </motion.button>
      </motion.div>
    </div>
  );
}
