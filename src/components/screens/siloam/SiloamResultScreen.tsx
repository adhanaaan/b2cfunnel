"use client";

import type { ScoreResult } from "@/types/engine";
import { eventSource } from "@/config/event";
import { playUrlFor } from "@/config/eventLinks";
import { useVariant } from "@/components/VariantContext";
import { Event3Shell } from "@/components/screens/event3/Event3Shell";
import { useStanding } from "@/components/screens/event3/useStanding";
import { useShareCard } from "@/components/screens/event3/useShareCard";
import { PhklResultHeader } from "../phkl/result/PhklResultHeader";
import { PhklSpeedExplainer } from "../phkl/result/PhklSpeedExplainer";
import { PhklRiskSection } from "../phkl/result/PhklRiskSection";
import { PhklBaselineCard } from "../phkl/result/PhklBaselineCard";
import { PhklWrapUp } from "../phkl/result/PhklWrapUp";
import { SiloamOffer } from "./SiloamOffer";
import { SiloamStickyCta } from "./SiloamStickyCta";

interface SiloamResultScreenProps {
  result: ScoreResult;
  name?: string;
  email?: string;
  gameTimeMs?: number;
  gameAttempts?: number;
  /** The `age` option the player chose before the game. */
  ageBand?: string;
  /** Play the reaction game again; the flow brings them straight back here. */
  onRetake: () => void;
}

/**
 * The Siloam Neuroscience Summit's report: /phkl's, with one section swapped.
 *
 * Every part above the close is the PHKL component, shared rather than copied -
 * the header, what processing speed is, what else was measured, and how much of
 * the brain is still uncovered - so a change to the report reaches both events
 * and neither can drift off the other. Each of them reads its words through
 * the copy context, which is what lets this one be read in Bahasa Indonesia
 * while /phkl's is read in English.
 *
 * What differs is the end: `SiloamOffer` in place of `PhklScreeningOffer`, and
 * a sticky bar that walks the reader to it rather than opening a booking form.
 */
export function SiloamResultScreen({
  result,
  name,
  email,
  gameTimeMs,
  gameAttempts,
  ageBand,
  onRetake,
}: SiloamResultScreenProps) {
  const variant = useVariant();
  const source = eventSource(variant);
  const playUrl = playUrlFor(variant);
  const standing = useStanding(source, email, gameTimeMs);
  const { share, sharing, shareNote, qrHost } = useShareCard({
    name,
    timeMs: gameTimeMs,
    standing,
    playUrl,
  });

  return (
    <Event3Shell scroll pills sparkles>
      {qrHost}

      <PhklResultHeader
        name={name}
        timeMs={gameTimeMs}
        attempts={gameAttempts}
        standing={standing}
        share={{ share, sharing, shareNote }}
        onRetry={onRetake}
      />

      <PhklSpeedExplainer />

      {/* The report proper runs edge to edge on its sheet. */}
      <div className="-mx-4 overflow-hidden rounded-t-[28px] shadow-[0_-18px_46px_-30px_rgba(90,40,10,0.35)]">
        <PhklRiskSection result={result} name={name} gameTimeMs={gameTimeMs} />
        <PhklBaselineCard result={result} />
        <SiloamOffer />
        <PhklWrapUp ageBand={ageBand} />
      </div>

      <SiloamStickyCta />
    </Event3Shell>
  );
}
