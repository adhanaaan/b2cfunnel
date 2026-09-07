"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ScoreResult } from "@/types/engine";
import { COPY } from "@/config/copy";
import { ease } from "@/lib/motion";
import type { Standing } from "@/components/screens/event3/useStanding";
import { Reveal, rankGradientText, reportCard, reportEyebrow, reportHeading } from "../ui";

// Radar geometry, in the figure's own coordinates. Five axes clockwise from
// the top: speed, memory, attention, executive, risk (Figma 697:25101).
const W = 440;
const H = 326;
const CX = 220;
const CY = 168;
const R = 118;
const RINGS = [1 / 3, 2 / 3, 1];
const AXES = 5;
/** Which axes the game and the quiz have filled in. */
const MEASURED = new Set([0, 4]);

const angleAt = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / AXES;
const pointAt = (i: number, v: number): [number, number] => [
  CX + R * v * Math.cos(angleAt(i)),
  CY + R * v * Math.sin(angleAt(i)),
];
const ring = (v: number) =>
  Array.from({ length: AXES }, (_, i) => pointAt(i, v).join(",")).join(" ");
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * R4 (Figma 697:25091): "you've only covered 2 out of 5". A five-axis radar
 * with only speed and risk filled in - the two the game and the quiz measured,
 * drawn from the player's actual standing and score - and the three the full
 * test would add left hollow at the rim. Illustrative of coverage, not a
 * clinical chart, and the figure says so in words for assistive tech.
 */
export function PhklBaselineCard({
  result,
  standing,
}: {
  result: ScoreResult;
  standing: Standing;
}) {
  const c = COPY.screens.phkl.report.baseline;
  const reduced = useReducedMotion();

  // Speed: where the player sits on today's board, top = fastest. Risk: the
  // Brain Health Score itself (high = healthy). Both kept off the centre so
  // the shape always reads.
  const speed =
    standing.rank && standing.total && standing.total > 1
      ? clamp(1 - (standing.rank - 1) / (standing.total - 1), 0.3, 1)
      : 0.7;
  const risk = clamp(result.total / result.maxTotal, 0.3, 1);
  const filled: [number, number][] = [[CX, CY], pointAt(0, speed), pointAt(4, risk)];

  return (
    <section className="bg-[#fff8f3] px-6 pb-12 pt-4">
      <Reveal>
        <p className={reportEyebrow}>{c.eyebrow}</p>
        <h2 className={`mt-6 ${reportHeading}`}>
          <span className="block">{c.heading}</span>
          <span className={`block ${rankGradientText}`}>{c.headingHighlight}</span>
        </h2>
      </Reveal>

      <Reveal className="mt-6">
        <div className={`${reportCard} px-6 pb-4 pt-6`}>
          <div className="flex items-baseline justify-between text-[11px] font-extrabold uppercase leading-[1.3]">
            <span className="tracking-[0.18em] text-[#b4653c]">{c.cardLabel}</span>
            <span className="font-bold tracking-[0.14em] text-[#b79c8e]">{c.cardProgress}</span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#f6e4d8]">
            <motion.div
              className="h-full origin-left rounded-full bg-gradient-to-r from-[#ff8a1f] via-[#f9550f] to-[#d62f16]"
              style={{ width: "40%" }}
              initial={reduced ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, ease: ease.out, delay: 0.2 }}
            />
          </div>

          <figure className="mt-2">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full"
              role="img"
              aria-label={`Two of five brain domains measured so far: ${c.axes[0].toLowerCase()} and ${c.axes[4].toLowerCase()}. ${c.axes[1]}, ${c.axes[2].toLowerCase()} and ${c.axes[3].toLowerCase()} are not yet measured.`}
            >
              {RINGS.map((v) => (
                <polygon key={v} points={ring(v)} fill="none" stroke="#eadbd1" strokeWidth="1.2" />
              ))}
              {Array.from({ length: AXES }, (_, i) => {
                const [x, y] = pointAt(i, 1);
                return (
                  <line key={i} x1={CX} y1={CY} x2={x} y2={y} stroke="#eadbd1" strokeWidth="1.2" />
                );
              })}

              <defs>
                <linearGradient id="phkl-radar-fill" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#ff8a1f" />
                  <stop offset="1" stopColor="#d62f16" />
                </linearGradient>
              </defs>

              <motion.g
                style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
                initial={reduced ? false : { scale: 0.55, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, ease: ease.out, delay: 0.25 }}
              >
                <polygon
                  points={filled.map((p) => p.join(",")).join(" ")}
                  fill="url(#phkl-radar-fill)"
                  fillOpacity="0.55"
                  stroke="#d62f16"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </motion.g>

              {Array.from({ length: AXES }, (_, i) => {
                const measured = MEASURED.has(i);
                const [x, y] = measured
                  ? pointAt(i, i === 0 ? speed : risk)
                  : pointAt(i, 1);
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="6"
                    fill={measured ? "#d62f16" : "#ffffff"}
                    stroke={measured ? "#ffffff" : "#c9b4a6"}
                    strokeWidth={measured ? 2 : 1.5}
                  />
                );
              })}

              {c.axes.map((label, i) => {
                const [x, y] = pointAt(i, 1.24);
                const anchor = i === 0 ? "middle" : i === 1 || i === 2 ? "start" : "end";
                return (
                  <text
                    key={label}
                    x={x}
                    y={y + 4}
                    textAnchor={i === 2 || i === 3 ? "middle" : anchor}
                    fontSize="11"
                    fontWeight="800"
                    letterSpacing="1.1"
                    fill={MEASURED.has(i) ? "#5f4638" : "#c9b4a6"}
                  >
                    {label.toUpperCase()}
                  </text>
                );
              })}
            </svg>
          </figure>
        </div>
      </Reveal>

      <Reveal className="mt-6 space-y-3">
        {c.paragraphs.map((para) => (
          <p key={para} className="text-[15px] leading-[1.55] text-[#6b5245]">
            {para}
          </p>
        ))}
      </Reveal>
    </section>
  );
}
