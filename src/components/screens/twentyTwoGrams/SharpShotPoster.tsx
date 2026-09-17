"use client";

import { useEffect, useMemo } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Lexend_Zetta } from "next/font/google";
import { SHARP_SHOT_POSTER } from "@/config/twentyTwoGrams";
import { formatSeconds, formatStamp } from "@/lib/format";
import { springs } from "@/lib/motion";
import { OptionalImage } from "@/components/screens/phkl/OptionalImage";
import { SharpShotCup } from "./SharpShotCup";

/**
 * Sharp Shot Week's reward poster (/22grams), built to Figma 925:9236.
 *
 * The takeover a player gets for beating the clock, and the thing they
 * screenshot to redeem the drink - which is what the offer asks of them, and
 * what decides almost every choice here.
 *
 * Because the screenshot IS the voucher:
 *
 * - The three details a barista checks - who, how fast, when - are on it, and
 *   the "when" is the moment the run ended (`finishedAt`), passed in from the
 *   funnel's state rather than read off the clock here, so reopening the
 *   poster cannot restamp it.
 * - Nothing is interactive except closing it, and the design makes the WHOLE
 *   poster the target ("tap anywhere to close") - so there is no button to
 *   land on top of anything that has to be read.
 *
 * The design is a 340x536 card rather than a full-bleed screen, so it draws in
 * its own pixels: one unit, `--p`, is the card scaled to the viewport, and
 * every size below is the design's px times it, via `p()`. The scale fills the
 * width inside a 20px gutter, is capped so the card does not balloon on a
 * desktop, and gives way to the height on a short screen - so the composition
 * is the Figma frame at any size rather than a re-flow of it.
 *
 * Its two images are optional, as everywhere else in this build: the wordmark
 * falls back to type and the drink to a drawn cup, so the poster is correct
 * and redeemable before either file lands (public/images/22grams/README.md).
 */

interface SharpShotPosterProps {
  open: boolean;
  /** The player's name, as they typed it on the landing. */
  name?: string;
  /** The winning run. */
  timeMs?: number;
  /** When that run ended, epoch ms (FunnelState.gameFinishedAt). */
  finishedAt?: number;
  onClose: () => void;
}

/**
 * The lockup's face (Figma 925:8801). Imported here rather than in the root
 * layout so only this screen pays for it: it sets three words at 9.22px and
 * nothing else in the build uses it.
 */
const lexendZetta = Lexend_Zetta({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-lexend-zetta",
  display: "swap",
});

/**
 * `n` design pixels, in the card's unit.
 *
 * `--p` is a LENGTH (one design pixel), not a unitless scale - the same idiom
 * the TV boards use for `--u`. CSS cannot divide a length by a length to get a
 * ratio, so the scale has to be carried as "how long is one design pixel" and
 * multiplied by a plain number here.
 */
const p = (n: number) => `calc(var(--p) * ${n})`;

/**
 * The Processing Speed domain's light tone - the yellow of the two dashes and
 * of the sparkles' warm end. Already this build's `#fde68a`.
 */
const SPEED_LIGHT = "#fde68a";

/** Artwork, both optional - see public/images/22grams/README.md. */
const WORDMARK = "/images/22grams/logo-22g.png";
const DRINK = "/images/22grams/sharp-shot-drink.png";

/**
 * A sparkle (925:8793 / 925:9232): the glyph the daylight screens already use,
 * filled with the design's near-transparent warm gradient.
 *
 * `alpha` scales that gradient. The frame stacks two copies of the right-hand
 * sparkle, which composites to roughly twice the opacity of the single one at
 * the top left; one element carrying the composite reads the same and leaves
 * nothing for a reader to wonder about.
 */
function Sparkle({
  left,
  top,
  alpha,
}: {
  left: number;
  top: number;
  alpha: number;
}) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute select-none bg-clip-text font-bold leading-none text-transparent"
      style={{
        left: p(left),
        top: p(top),
        width: p(57),
        fontSize: p(65.671),
        backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 112, ${0.3 * alpha}), rgba(245, 158, 10, ${0.12 * alpha}))`,
      }}
    >
      ✦
    </span>
  );
}

/**
 * One of the two yellow dashes over the cup (925:9230, 925:9233). The design
 * positions a box and centres a rotated, y-flipped rectangle in it; the flip
 * is kept because the rounded ends are not symmetric about the long axis.
 */
function Dash({
  left,
  top,
  boxW,
  boxH,
  w,
  h,
  radius,
  rotate,
  opacity,
}: {
  left: number;
  top: number;
  boxW: number;
  boxH: number;
  w: number;
  h: number;
  radius: number;
  rotate: number;
  opacity: number;
}) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute flex items-center justify-center"
      style={{ left: p(left), top: p(top), width: p(boxW), height: p(boxH) }}
    >
      <span
        className="block"
        style={{
          width: p(w),
          height: p(h),
          borderRadius: p(radius),
          background: SPEED_LIGHT,
          opacity,
          transform: `rotate(${rotate}deg) scaleY(-1)`,
        }}
      />
    </span>
  );
}

export function SharpShotPoster({
  open,
  name,
  timeMs,
  finishedAt,
  onClose,
}: SharpShotPosterProps) {
  const reduced = useReducedMotion();
  const c = SHARP_SHOT_POSTER;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // The stamp. `finishedAt` is the run's own moment; falling back to "now"
  // only covers the case where it never reached this screen, and is pinned to
  // the first render rather than recomputed - a stamp that ticks while the
  // poster is open is a stamp that disagrees with the screenshot beside it.
  const stamp = useMemo(
    () => formatStamp(new Date(finishedAt ?? Date.now())),
    [finishedAt],
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.25 }}
          // The design makes the whole poster the close target, so the tap
          // handler sits on the overlay rather than on a control inside it.
          // The button below is what carries that to a keyboard and a screen
          // reader; this is the pointer path, and it covers the card too.
          onClick={onClose}
          style={{
            // One design pixel: fill the width inside a 20px gutter, never
            // past 1.25x (a 340px card has nothing to gain from a desktop's
            // width), and give way to the height on a short screen.
            ["--p" as string]:
              "min(1.25px, (100vw - 40px) / 340, (100dvh - 40px) / 536)",
          }}
        >
          {/* Backdrop. A real button so the close is reachable without a
              pointer and announced to assistive tech; the overlay's own
              handler is what makes the poster itself tappable. */}
          <button
            type="button"
            aria-label={c.closeLabel}
            onClick={onClose}
            className="absolute inset-0 bg-night-ink/45 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="sharp-shot-heading"
            className={`${lexendZetta.variable} relative z-10 overflow-hidden bg-gradient-to-b from-[#e8782e] via-[#f09452] to-[#ffbb88] font-sans text-cream shadow-[0_24px_80px_-16px_rgba(122,46,12,0.55)]`}
            style={{
              width: p(340),
              height: p(536),
              borderRadius: p(20),
            }}
            initial={reduced ? false : { opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: 16, scale: 0.97 }}
            transition={springs.enter}
          >
            <Sparkle left={283} top={136.11} alpha={2} />
            <Sparkle left={6} top={29} alpha={1} />

            {/* Top row (925:8802): the campaign lockup and the mark. */}
            <div
              className="absolute flex items-center justify-between"
              style={{
                left: p(18),
                top: p(12.86),
                width: p(304),
                height: p(32.152),
              }}
            >
              <p
                className="shrink-0 text-center font-bold uppercase leading-[1.1]"
                style={{
                  fontFamily: "var(--font-lexend-zetta), var(--font-jakarta)",
                  fontSize: p(9.22),
                }}
              >
                {c.week.map((word) => (
                  <span key={word} className="block">
                    {word}
                  </span>
                ))}
              </p>
              <OptionalImage
                src={WORDMARK}
                alt="22g"
                className="shrink-0 object-contain"
                style={{ width: p(55), height: p(23.913) }}
                fallback={
                  <span
                    className="shrink-0 font-extrabold leading-none tracking-[-0.02em]"
                    style={{ fontSize: p(23.913) }}
                  >
                    22g
                  </span>
                }
              />
            </div>

            {/* Headline (923:8785): the sentence, then the time it is about,
                a size up on its own line. */}
            <h2
              id="sharp-shot-heading"
              className="absolute font-extrabold"
              style={{
                left: p(27),
                top: p(77.16),
                width: p(299),
                letterSpacing: p(-0.4465),
              }}
            >
              <span
                className="block leading-[1.04]"
                style={{ fontSize: p(29.768) }}
              >
                {c.headingLead}
              </span>
              <span
                className="block leading-[1.04]"
                style={{ fontSize: p(35.768) }}
              >
                {c.headingThreshold}
              </span>
            </h2>

            {/* The drink (923:8791), flush into the bottom-left corner. */}
            <div
              className="absolute overflow-hidden"
              style={{
                left: 0,
                top: p(204),
                width: p(184),
                height: p(332),
                borderBottomLeftRadius: p(20),
              }}
            >
              <OptionalImage
                src={DRINK}
                alt=""
                className="h-full w-full object-cover"
                fallback={<SharpShotCup className="h-full w-full" />}
              />
            </div>

            <Dash
              left={154.93}
              top={215.17}
              boxW={23.322}
              boxH={32.168}
              w={31.756}
              h={9.063}
              radius={20.768}
              rotate={-61}
              // The frame stacks three copies of this one; that composites to
              // ~0.97, which is what the render shows.
              opacity={0.97}
            />
            <Dash
              left={165.64}
              top={227.29}
              boxW={18.684}
              boxH={16.287}
              w={16.717}
              h={8.563}
              radius={17.622}
              rotate={-33}
              opacity={0.7}
            />

            {/* The offer (923:8788), beside the cup. */}
            <div
              className="absolute flex flex-col font-bold"
              style={{
                left: p(177),
                top: p(237),
                width: p(163),
                gap: p(8.474),
                fontSize: p(16.09),
              }}
            >
              <p className="leading-[1.1]">
                {c.reward.screenshot.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
              {/* Wraps inside the design's 159px box (925:8795). */}
              <p className="leading-[1.1]" style={{ width: p(159) }}>
                {c.reward.drink}
              </p>
            </div>

            {/* The one condition on the offer (925:9240), under it. */}
            <p
              className="absolute font-bold italic leading-[1.1]"
              style={{
                left: p(177),
                top: p(345),
                width: p(101),
                fontSize: p(9.09),
              }}
            >
              {c.fineprint}
            </p>

            {/* Who, how fast, when - the three things staff read (923:8792). */}
            <dl
              className="absolute text-right font-bold leading-[1.1] opacity-80"
              style={{
                left: p(170),
                top: p(393),
                width: p(151),
                fontSize: p(13.09),
              }}
            >
              <dt className="sr-only">Name</dt>
              <dd className="truncate">{name ?? "—"}</dd>
              <dt className="sr-only">Time</dt>
              <dd className="tabular-nums">
                {timeMs != null
                  ? `${formatSeconds(timeMs)} ${c.secondsSuffix}`
                  : "—"}
              </dd>
              <dt className="sr-only">Recorded at</dt>
              <dd className="tabular-nums">{stamp}</dd>
            </dl>

            {/* The claim the campaign is built on (925:8803). */}
            <p
              className="absolute text-center font-bold italic leading-[1.1]"
              style={{
                left: p(27),
                top: p(460),
                width: p(285),
                fontSize: p(13.09),
              }}
            >
              {c.footnote}
            </p>

            {/* How to get rid of it (925:9225). */}
            <p
              className="absolute text-center font-bold uppercase leading-[1.1] opacity-50"
              style={{
                left: p(56),
                top: p(507),
                width: p(227),
                fontSize: p(10.09),
                letterSpacing: p(0.9081),
              }}
            >
              {c.dismiss}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
