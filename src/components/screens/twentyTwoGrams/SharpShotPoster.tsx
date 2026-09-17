"use client";

import { useEffect, useMemo } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SHARP_SHOT_POSTER } from "@/config/twentyTwoGrams";
import { formatSeconds, formatStamp } from "@/lib/format";
import { springs } from "@/lib/motion";
import { OptionalImage } from "@/components/screens/phkl/OptionalImage";

/**
 * Sharp Shot Week's reward poster (/22grams): the takeover a player gets for
 * beating the clock, built to be SCREENSHOTTED - which is what the offer asks
 * of them, and what decides almost every choice here.
 *
 * Because the screenshot IS the voucher:
 *
 * - It is full-bleed, so a phone screenshot is the poster edge to edge rather
 *   than a card floating on whatever was behind it.
 * - The three details a barista checks - who, how fast, when - are on it, and
 *   the "when" is the moment the run ended (`finishedAt`), passed in from the
 *   funnel's state rather than read off the clock here, so reopening the
 *   poster cannot restamp it.
 * - Nothing but the dismissal is interactive, and that sits under the
 *   artwork's last line where it cannot land on top of anything that has to
 *   be read.
 *
 * It is NOT a pixel port of the print artwork. That poster is A-series
 * portrait, and scaling its type down by width puts the score block at about
 * 9px on a phone - unreadable, which for the one line staff have to check is
 * the whole poster failing. So the composition is the artwork's (the lockup,
 * the caps headline, the orange offer, the drink, the score block bottom
 * right, the two closing lines) at sizes chosen to read on a phone first and
 * to grow with the screen from there.
 *
 * The two images are optional, as everywhere else in this build: the wordmark
 * falls back to type and the drink to a drawn cup, so the poster is correct
 * and redeemable before either file lands.
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

/** The poster's own palette - it is its own canvas, in none of the app's. */
const NAVY = "#172340";
/**
 * The offer's orange. A step down from the brand `#f77528`, which vibrates
 * against this navy at the size the offer is set; this holds.
 */
const ORANGE = "#e2611d";

/** Artwork, both optional - see public/images/22grams/README.md. */
const WORDMARK = "/images/22grams/logo-22g.png";
const DRINK = "/images/22grams/sharp-shot-drink.png";

/**
 * The drink, while the photograph has not landed: a cup in the poster's own
 * colours. A hole where the hero image goes would read as a broken poster,
 * and this one is still screenshot-worthy.
 */
function CupFallback() {
  return (
    <svg
      viewBox="0 0 120 170"
      aria-hidden
      className="max-h-[32dvh] w-auto max-w-full"
      role="presentation"
    >
      {/* Lid - the clear dome the artwork shows, so it reads as a takeaway
          cup rather than a grey slab. */}
      <path d="M18 27h84l-6 11H24z" fill="rgba(255,255,255,0.14)" />
      <rect x="12" y="19" width="96" height="9" rx="4.5" fill="rgba(255,255,255,0.22)" />
      {/* Cup, tapering like a takeaway tumbler */}
      <path d="M20 40h80l-10 118a8 8 0 0 1-8 7H38a8 8 0 0 1-8-7z" fill="#2a1408" />
      {/* Coffee, with the milk cap the artwork shows */}
      <path d="M22 50h76l-2 22H24z" fill="rgba(255,214,170,0.75)" />
      <path d="M24 72h72l-8 84a6 6 0 0 1-6 5H38a6 6 0 0 1-6-5z" fill="#4a1c07" />
      {/* The mark on the cup */}
      <text
        x="60"
        y="118"
        textAnchor="middle"
        fill="rgba(255,255,255,0.5)"
        fontSize="17"
        fontWeight="700"
        letterSpacing="1"
      >
        22g
      </text>
    </svg>
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
          role="dialog"
          aria-modal="true"
          aria-labelledby="sharp-shot-heading"
          className="fixed inset-0 z-[80] overflow-y-auto"
          style={{ background: NAVY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.25 }}
        >
          <motion.div
            className="mx-auto flex min-h-[100dvh] w-full max-w-[520px] flex-col px-6 pb-6 pt-7 text-white sm:px-8"
            initial={reduced ? false : { scale: 0.98, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            transition={springs.enter}
          >
            {/* Lockup row: the campaign, and the mark. */}
            <div className="flex shrink-0 items-start justify-between">
              <p className="text-[clamp(10px,2.8vw,13px)] font-medium uppercase leading-[1.9] tracking-[0.34em]">
                {c.week.map((word) => (
                  <span key={word} className="block">
                    {word}
                  </span>
                ))}
              </p>
              <OptionalImage
                src={WORDMARK}
                alt="22g"
                className="h-[clamp(26px,7.5vw,40px)] w-auto shrink-0 object-contain"
                fallback={
                  <span className="shrink-0 text-[clamp(26px,7.5vw,40px)] font-extrabold leading-none tracking-[-0.02em]">
                    22g
                  </span>
                }
              />
            </div>

            {/* Headline, in the artwork's three lines. */}
            <h2
              id="sharp-shot-heading"
              className="mt-[clamp(18px,5vw,30px)] shrink-0 text-center text-[clamp(21px,6.6vw,34px)] font-normal uppercase leading-[1.22] tracking-[0.035em]"
            >
              {c.heading.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>

            {/* The offer. */}
            <p
              className="mt-[clamp(14px,4vw,24px)] shrink-0 text-center text-[clamp(15px,4.4vw,23px)] font-medium leading-[1.4]"
              style={{ color: ORANGE }}
            >
              {c.reward.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>

            <p className="mt-[clamp(12px,3.6vw,20px)] shrink-0 text-center text-[clamp(11px,3.2vw,16px)] font-medium">
              {c.fineprint}
            </p>

            {/* The drink. It takes the height that is left, which makes it
                the hero of a tall screen, but it is capped in dvh and allowed
                to shrink (basis-0, min-h) so that on a short one it gives way
                rather than pushing the score block off the screenshot - and
                the score block is the part staff actually read. */}
            <div className="flex min-h-[90px] flex-1 basis-0 items-center justify-center py-[clamp(8px,2.5vw,18px)]">
              <OptionalImage
                src={DRINK}
                alt=""
                className="max-h-[32dvh] w-auto max-w-full object-contain"
                fallback={<CupFallback />}
              />
            </div>

            {/* Who, how fast, when - the three things staff read. Bottom
                right, as the artwork places them. */}
            <dl className="flex shrink-0 flex-col items-end gap-[2px] text-right text-[clamp(12px,3.6vw,18px)] font-medium leading-[1.55]">
              <div className="contents">
                <dt className="sr-only">Name</dt>
                <dd className="max-w-full truncate">{name ?? "—"}</dd>
              </div>
              <div className="contents">
                <dt className="sr-only">Time</dt>
                <dd className="tabular-nums">
                  {timeMs != null
                    ? `${formatSeconds(timeMs)} ${c.secondsSuffix}`
                    : "—"}
                </dd>
              </div>
              <div className="contents">
                <dt className="sr-only">Recorded at</dt>
                <dd className="tabular-nums">{stamp}</dd>
              </div>
            </dl>

            {/* The close: the Lancet figure, then the occasion. */}
            <div className="mt-[clamp(16px,4.5vw,26px)] shrink-0 text-center">
              <p className="text-[clamp(12px,3.7vw,18px)] font-medium italic leading-[1.4] text-white/90">
                {c.footnote}
              </p>
              <p className="mt-1 text-[clamp(12px,3.7vw,18px)] font-normal leading-[1.4] text-white/90">
                {c.occasion}
              </p>
            </div>

            {/* Not part of the artwork: the way out. Held to a quiet weight so
                it never competes with the offer in a screenshot. */}
            <button
              type="button"
              onClick={onClose}
              aria-label={c.closeLabel}
              className="mx-auto mt-[clamp(14px,4vw,22px)] shrink-0 rounded-full px-5 py-2 text-[13px] font-bold uppercase tracking-[0.22em] text-white/55 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
            >
              {c.dismiss}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
