"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import type { ScoreResult } from "@/types/engine";
import { pickActions } from "@/config/actions";
import { STAT_CARDS_BY_ID } from "@/config/statCards";
import { firstName } from "@/lib/format";
import { TrajectoryChart } from "@/components/result/TrajectoryChart";
import { ActionablesCard } from "@/components/result/ActionablesCard";
import { RiskMeter } from "./RiskMeter";
import { Reveal, rankGradientText, reportEyebrow, reportHeading } from "../ui";
import { arcCopyFor } from "@/config/copy";
import { useVariant } from "@/components/VariantContext";

/**
 * "About 45%", with the number counting up the first time it scrolls into
 * view and the figure itself in the rank gradient. Anything that is not the
 * number ("About ", "%") is drawn as written.
 */
function CountUpStat({ stat }: { stat: string }) {
  const match = stat.match(/^(.*?)(\d+)(%?)(.*)$/);
  const target = match ? Number(match[2]) : NaN;
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [value, setValue] = useState(reduced ? target : 0);

  useEffect(() => {
    if (!inView || reduced || !Number.isFinite(target)) return;
    const controls = animate(0, target, {
      duration: 0.9,
      ease: "easeOut",
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduced, target]);

  if (!match) return <span ref={ref}>{stat}</span>;
  return (
    <span ref={ref}>
      {match[1]}
      <span className={`${rankGradientText} tabular-nums`}>
        {Number.isFinite(target) ? value : match[2]}
        {match[3]}
      </span>
      {match[4]}
    </span>
  );
}

/**
 * R3 (Figma 697:25045): speed was not the only thing measured. The risk story
 * from the quiz - the trend chart, the player's band on the meter, the factors
 * behind it, the Lancet 45% and the three actions - each part reusing the
 * report component the other events already ship where one exists.
 */
export function PhklRiskSection({
  result,
  name,
  gameTimeMs,
}: {
  result: ScoreResult;
  name?: string;
  gameTimeMs?: number;
}) {
  const c = arcCopyFor(useVariant()).report.risk;
  const card = STAT_CARDS_BY_ID.lancet2024;
  const first = firstName(name);
  const actions = pickActions({
    drivingFactors: result.drivingFactors,
    band: result.band,
    gameTimeMs,
  });

  return (
    <section className="bg-[#fff8f3] px-6 pb-12 pt-11">
      <Reveal>
        <p className={reportEyebrow}>{c.eyebrow}</p>
        <h2 className={`mt-6 text-balance ${reportHeading}`}>{c.heading}</h2>
        <p className="mt-6 text-base leading-[1.6] text-[#41586b]">{c.body}</p>
      </Reveal>

      <Reveal className="mt-6">
        <TrajectoryChart />
      </Reveal>

      <Reveal className="mt-6">
        <RiskMeter band={result.band} />
      </Reveal>

      <Reveal className="mt-7">
        <p className="text-[14.5px] leading-[1.58] text-[#41586b]">
          {first ? c.factorsLead.replace("{name}", first) : c.factorsLeadAnonymous}
        </p>
        {result.drivingFactors.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-2">
            {result.drivingFactors.map((factor) => (
              <li
                key={factor.id}
                className="rounded-full border border-[#e7d3c4] bg-white px-4 py-2 text-[13px] font-bold leading-none text-[#5f4638]"
              >
                {factor.label}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm leading-snug text-[#8a6a58]">{c.noFactors}</p>
        )}
      </Reveal>

      {card && (
        <Reveal className="mt-9">
          <p className="text-[14.5px] leading-[1.58] text-[#41586b]">{c.goodNews}</p>
          <p className="mt-1 text-[clamp(2.5rem,12vw,2.875rem)] font-extrabold leading-[1.06] tracking-[-0.03em] text-[#1c110a]">
            <CountUpStat stat={card.stat} />
          </p>
          <p className="mt-2 text-[15px] leading-[1.55] text-[#41586b]">{card.body}</p>
          <p className="mt-2 text-xs italic text-[#b79c8e]">Source: {card.source}</p>
        </Reveal>
      )}

      <Reveal className="mt-9">
        <ActionablesCard actions={actions} tone="note" />
      </Reveal>
    </section>
  );
}
