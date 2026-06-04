import type { Persona } from "@/types/engine";
import type { LeadBlurSection } from "@/types/copy";
import { COPY } from "@/config/copy";

interface BlurredPaywallPreviewProps {
  persona: Persona;
  onUnlock: () => void;
}

// The three blurred sections behind the paywall. The persona's lead section is
// surfaced first (build brief §7).
const SECTIONS: Record<LeadBlurSection, { title: string; lines: number }> = {
  cognitiveInterpretation: {
    title: "What your symptom answers suggest",
    lines: 3,
  },
  vascular: { title: "Vascular vs other contributors", lines: 3 },
  percentile: { title: "Where you sit versus your cohort", lines: 2 },
};

const ALL_SECTIONS: LeadBlurSection[] = [
  "cognitiveInterpretation",
  "vascular",
  "percentile",
];

function orderedSections(lead: LeadBlurSection): LeadBlurSection[] {
  return [lead, ...ALL_SECTIONS.filter((s) => s !== lead)];
}

/** Dark, blurred preview of the paywalled content + the unlock CTA. */
export function BlurredPaywallPreview({
  persona,
  onUnlock,
}: BlurredPaywallPreviewProps) {
  const { leadBlurSection, paywallAngle } = COPY.personas[persona];
  const { unlockCta, paywallPreviewHeading } = COPY.screens.resultBase;
  const sections = orderedSections(leadBlurSection);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-charcoal px-6 pb-7 pt-6 text-white">
      <h2 className="text-lg font-bold">{paywallPreviewHeading}</h2>
      <p className="mt-1 text-sm text-white/70">{paywallAngle}</p>

      {/* Blurred faux-content. */}
      <div
        className="mt-5 space-y-5 select-none blur-sm"
        aria-hidden
      >
        {sections.map((key, idx) => {
          const section = SECTIONS[key];
          return (
            <div key={key}>
              <p
                className={[
                  "mb-2 text-sm font-semibold",
                  idx === 0 ? "text-primary" : "text-white/80",
                ].join(" ")}
              >
                {section.title}
              </p>
              <div className="space-y-2">
                {Array.from({ length: section.lines }).map((_, i) => (
                  <div
                    key={i}
                    className="h-3 rounded bg-white/15"
                    style={{ width: `${90 - i * 12}%` }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA sits above the blur. */}
      <button
        type="button"
        onClick={onUnlock}
        className="mt-7 w-full rounded-lg bg-primary px-6 py-4 text-base font-bold text-primary-on shadow-float transition hover:brightness-105"
      >
        {unlockCta}
      </button>
    </div>
  );
}
