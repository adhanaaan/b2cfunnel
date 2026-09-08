"use client";

import type { ScoreResult } from "@/types/engine";
import { eventSource } from "@/config/event";
import { playUrlFor } from "@/config/eventLinks";
import { useVariant } from "@/components/VariantContext";
import { Event3Shell } from "@/components/screens/event3/Event3Shell";
import { useStanding } from "@/components/screens/event3/useStanding";
import { useShareCard } from "@/components/screens/event3/useShareCard";
import { PhklResultHeader } from "./result/PhklResultHeader";
import { PhklStickyCta } from "./result/PhklStickyCta";
import { PhklSpeedExplainer } from "./result/PhklSpeedExplainer";
import { PhklRiskSection } from "./result/PhklRiskSection";
import { PhklBaselineCard } from "./result/PhklBaselineCard";
import { PhklScreeningOffer } from "./result/PhklScreeningOffer";
import { PhklWrapUp } from "./result/PhklWrapUp";

interface PhklResultScreenProps {
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
 * The PHKL report (Figma "10. Result (PHKL Customized)"): share and retry in
 * the top corners, the player's time and standing on the daylight backdrop,
 * the brain in its own glow with what processing speed is, then the report
 * proper on its warm white sheet - what else was measured, how much of the
 * brain is still uncovered, the Memory Screening Package, and a close. "Book
 * memory screening" stays pinned to the bottom of the screen the whole way
 * down.
 */
export function PhklResultScreen({
  result,
  name,
  email,
  gameTimeMs,
  gameAttempts,
  ageBand,
  onRetake,
}: PhklResultScreenProps) {
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
        <PhklScreeningOffer />
        <PhklWrapUp ageBand={ageBand} />
      </div>

      <PhklStickyCta />
    </Event3Shell>
  );
}
