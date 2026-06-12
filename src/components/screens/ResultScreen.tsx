"use client";

import type { ScoreResult } from "@/types/engine";
import { COPY } from "@/config/copy";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { ComplianceFooter } from "@/components/ui/ComplianceFooter";
import { ScoreHeader } from "@/components/result/ScoreHeader";
import { BigScore } from "@/components/result/BigScore";
import { Gauge } from "@/components/result/Gauge";
import { DrivingFactorPills } from "@/components/result/DrivingFactorPills";
import { BlurredPaywallPreview } from "@/components/result/BlurredPaywallPreview";
import { useIsEvent } from "@/components/VariantContext";

interface ResultScreenProps {
  result: ScoreResult;
  onUnlock: () => void;
}

// Factors that aren't "movable levers" (can't be acted on), excluded from the
// calibrated blurb list.
const NON_MODIFIABLE = new Set(["age", "familyHistory"]);

/** Format the user's modifiable factors into a readable, sentence-start phrase. */
function formatLevers(result: ScoreResult): string {
  const labels = result.drivingFactors
    .filter((f) => !NON_MODIFIABLE.has(f.id))
    .map((f) => f.label.toLowerCase());

  if (labels.length === 0) return "A few lifestyle and biomedical factors";

  const joined =
    labels.length === 1
      ? labels[0]
      : `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}`;
  return joined.charAt(0).toUpperCase() + joined.slice(1);
}

/** Screen 6 — the score reveal. Brand-critical layout (build brief §6). */
export function ResultScreen({ result, onUnlock }: ResultScreenProps) {
  const base = COPY.screens.resultBase;
  const event = useIsEvent();
  const bandLabel = COPY.bandLabels[result.band];
  // Band-specific blurb, calibrated with the user's reported factors.
  const blurb = COPY.resultBlurbs[result.band].replace(
    "{factors}",
    formatLevers(result),
  );

  return (
    <ScreenShell>
      <div className="animate-fade-up rounded-3xl bg-gradient-to-b from-white to-[#fff6f0] p-6 shadow-[0_30px_80px_-30px_rgba(247,117,40,0.45)] ring-1 ring-black/5 sm:p-8">
        <ScoreHeader />

        <p className="mt-6 text-center text-sm font-bold uppercase tracking-widest text-primary">
          {base.eyebrow}
        </p>
        <div className="mt-2">
          <BigScore score={result.total} />
        </div>

        <p className="mx-auto mt-4 max-w-md text-center text-base leading-relaxed text-secondary">
          {blurb}
        </p>

        <div className="mt-7">
          <Gauge
            score={result.total}
            max={100}
            band={result.band}
            bandLabel={bandLabel}
            lowLabel={base.gaugeLowLabel}
            highLabel={base.gaugeHighLabel}
          />
        </div>

        <div className="mt-8">
          <DrivingFactorPills factors={result.drivingFactors} />
        </div>

        {/* Hard divider into the closing section. */}
        <div className="-mx-5 mt-8 border-t border-outline-variant sm:-mx-7" />

        <div className="mt-8">
          {event ? (
            // Event: no sell — a soft prompt to speak to the team.
            <div className="rounded-2xl bg-surface-container px-6 py-7 text-center">
              <h2 className="font-display text-xl font-extrabold leading-snug text-charcoal">
                {base.eventClosingHeading}
              </h2>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-secondary">
                {base.eventClosingBody}
              </p>
              <button
                type="button"
                onClick={onUnlock}
                className="mt-6 w-full rounded-lg bg-primary px-6 py-4 text-lg font-bold text-primary-on shadow-float transition hover:brightness-105"
              >
                {base.eventClosingCta}
              </button>
            </div>
          ) : (
            <BlurredPaywallPreview onUnlock={onUnlock} />
          )}
        </div>

        <ComplianceFooter />
      </div>
    </ScreenShell>
  );
}
