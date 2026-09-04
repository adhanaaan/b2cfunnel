"use client";

import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { COPY } from "@/config/copy";
import { bandForTotal } from "@/engine/bands";
import { BigScore } from "@/components/result/BigScore";
import { Gauge } from "@/components/result/Gauge";
import { ScoreHeader } from "@/components/result/ScoreHeader";
import { springs, stagger } from "@/lib/motion";
import { Event3Shell } from "./Event3Shell";
import { BrainHero } from "./BrainHero";
import { ctaPrimaryClass, emberLabelGradient } from "./ui";

interface Event3QuizInviteProps {
  /** Walk on into the questionnaire. */
  onAccept: () => void;
  /** Leave it: the session ends on the closing screen. */
  onDecline: () => void;
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: springs.enter },
};

/**
 * The sample score on the report card. Its band - and so the gauge needle and
 * the band label - is derived from it by the real engine, so the sample can
 * never contradict the report it is a picture of.
 */
const SAMPLE_SCORE = 52;

/**
 * The card stage, in Figma's own coordinates: the two report cards overlap and
 * tilt against each other on a 358x287 board. The board is drawn at that fixed
 * size and scaled to whatever width it is given (container-query units), so the
 * overlap and the tilts hold at every screen width instead of reflowing.
 */
const STAGE_W = 358;
const STAGE_H = 287;

/**
 * Cards are authored at 2.5x their placed size and scaled back down, which is
 * what lets the sample report reuse the real report's components (ScoreHeader,
 * BigScore, Gauge) at their own type sizes rather than a second, tiny set.
 *
 * 0.4 is the design's own factor, not a guess: at it, ScoreHeader lands on the
 * Figma strap to the pixel (14px type -> 5.6, 36px icon -> 14.4) and BigScore
 * on its score (72px -> 28.8). Every authored size below is therefore the
 * Figma size divided by this.
 */
const CARD_SCALE = 0.4;

/** Placed size, position and tilt of each card on the stage (Figma). */
const DOMAIN_CARD = { left: 24.8, top: 8.2, width: 149.13, height: 228.52, tilt: -7 };
const REPORT_CARD = { left: 182.2, top: 39.6, width: 143.98, height: 240.47, tilt: 6 };

/** The peach glow behind the domain card (Figma "Gradient Warm Radial"). */
const WARM_RADIAL =
  "radial-gradient(circle at 25% 25%, rgba(245,158,10,0.25) 0%, rgba(255,235,87,0.06) 100%)";

/** One placed card: tilted at its Figma size, drawn oversized and scaled in. */
function PlacedCard({
  placement,
  children,
}: {
  placement: typeof DOMAIN_CARD;
  children: React.ReactNode;
}) {
  return (
    <div
      className="absolute"
      style={{
        left: placement.left,
        top: placement.top,
        width: placement.width,
        height: placement.height,
        transform: `rotate(${placement.tilt}deg)`,
      }}
    >
      <div
        className="origin-top-left"
        style={{
          width: placement.width / CARD_SCALE,
          height: placement.height / CARD_SCALE,
          transform: `scale(${CARD_SCALE})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** Left card: the Processing Speed domain page from the report. */
function DomainCard() {
  const c = COPY.screens.ihhsearegatta.quizInvite.domainCard;
  return (
    <div
      className="flex h-full w-full flex-col gap-[23px] overflow-hidden rounded-[19px] bg-[#fdfaf7] px-[19px] pb-[96px] pt-[61px] shadow-float"
      style={{ backgroundImage: WARM_RADIAL }}
    >
      {/* The exported brain carries its own "Frontal Lobe" label and sparkle. */}
      <BrainHero className="h-[191px] w-full" />

      <p className="font-serif text-[34px] leading-[1.2] text-[#171717]">
        {c.title}
      </p>

      <p className="text-[15px] leading-[23px] text-[#262626]">{c.body}</p>

      <div className="flex flex-col gap-[11px] rounded-[15px] bg-[#fffbeb] p-[15px] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <p className="text-[10.5px] font-semibold uppercase tracking-[1px] text-[#f59e0b]">
          {c.whyLabel}
        </p>
        <p className="text-[16px] font-bold text-[#171717]">{c.whyHeading}</p>
        {c.whyPoints.map((point) => (
          <div key={point} className="flex gap-[10px] text-[13px]">
            <span className="font-medium text-[#f59e0b]" aria-hidden>
              •
            </span>
            <p className="flex-1 leading-[19px] text-[#737373]">{point}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-[11px]">
        <p className="text-[10.5px] font-semibold uppercase tracking-[1px] text-[#a3a3a3]">
          {c.scienceLabel}
        </p>
        {c.science.map((para) => (
          <p key={para} className="text-[15px] leading-[23px] text-[#262626]">
            {para}
          </p>
        ))}
      </div>
    </div>
  );
}

/** Right card: the score card the questionnaire produces. */
function SampleReportCard() {
  const base = COPY.screens.resultBase;
  const c = COPY.screens.ihhsearegatta.quizInvite.reportCard;
  const band = bandForTotal(SAMPLE_SCORE);
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-[24px] border border-black/5 bg-gradient-to-b from-white to-[#fff6f0] px-[24px] pt-[24px] shadow-float">
      <ScoreHeader />

      <p className="mt-[24px] text-center text-[14px] font-bold uppercase tracking-[1.4px] text-primary">
        {base.eyebrow}
      </p>

      <div className="mt-[8px]">
        <BigScore score={SAMPLE_SCORE} />
      </div>

      <p className="mt-[16px] text-center text-[16px] leading-[26px] text-secondary">
        {c.blurb}
      </p>

      <div className="mt-[28px]">
        <Gauge
          score={SAMPLE_SCORE}
          max={100}
          band={band}
          bandLabel={COPY.bandLabels[band]}
          lowLabel={base.gaugeLowLabel}
          highLabel={base.gaugeHighLabel}
          caption={base.gaugeBandCaption}
        />
      </div>

      <div className="mt-[32px] border-t border-outline-variant" />
    </div>
  );
}

/**
 * The questionnaire invite (/ihhsearegatta only, Figma node 610:21002): the
 * page behind "Tell me more" on the post-game result. It puts the offer -
 * two free minutes for a personalised report - over a sample of that report,
 * and asks for the answer here rather than on the result card: "Sure!" walks
 * into the questionnaire, "Not now" ends the session on the closing screen.
 */
export function Event3QuizInvite({
  onAccept,
  onDecline,
}: Event3QuizInviteProps) {
  const c = COPY.screens.ihhsearegatta.quizInvite;
  const reduced = useReducedMotion();

  return (
    <Event3Shell pills sparkles>
      <motion.div
        className="flex h-full min-h-0 flex-col"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: reduced ? 0 : stagger.items } },
        }}
        initial={reduced ? "show" : "hidden"}
        animate="show"
      >
        <motion.h1
          variants={item}
          className="mx-auto mt-6 max-w-[330px] text-balance text-center text-[22px] font-bold leading-[1.35] text-[#171717]"
        >
          {c.heading}
        </motion.h1>

        {/* The sample report, tilted card over card. Decorative: the copy on
            it is a picture of the report, not a result of the player's. */}
        <motion.div
          variants={item}
          aria-hidden
          className="flex min-h-0 flex-1 items-center justify-center"
        >
          <div
            className="relative w-full max-w-[min(358px,56dvh)] overflow-hidden"
            style={
              {
                aspectRatio: `${STAGE_W} / ${STAGE_H}`,
                containerType: "inline-size",
              } as CSSProperties
            }
          >
            <div
              className="absolute left-0 top-0 origin-top-left"
              style={{
                width: STAGE_W,
                height: STAGE_H,
                transform: `scale(calc(100cqw / ${STAGE_W}))`,
              }}
            >
              <PlacedCard placement={DOMAIN_CARD}>
                <DomainCard />
              </PlacedCard>
              <PlacedCard placement={REPORT_CARD}>
                <SampleReportCard />
              </PlacedCard>
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="mt-4 shrink-0">
          <motion.button
            type="button"
            onClick={onAccept}
            whileTap={reduced ? undefined : { scale: 0.97 }}
            transition={springs.pop}
            className={ctaPrimaryClass}
          >
            {c.cta}
          </motion.button>
          <button
            type="button"
            onClick={onDecline}
            className="mt-2 flex h-12 w-full items-center justify-center rounded-xl px-6 text-[15px] font-bold transition hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-core"
          >
            <span className={emberLabelGradient}>{c.decline}</span>
          </button>
        </motion.div>
      </motion.div>
    </Event3Shell>
  );
}
