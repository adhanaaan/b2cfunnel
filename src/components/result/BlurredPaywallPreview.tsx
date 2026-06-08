import type { DrivingFactor } from "@/types/engine";
import { COPY } from "@/config/copy";

interface BlurredPaywallPreviewProps {
  factors: DrivingFactor[];
  onUnlock: () => void;
}

/**
 * Build the dynamic heading from the user's reported risk factors, e.g.
 * "What your blood pressure, sleep and cholesterol could mean for you".
 * Falls back to a generic line when no factors stood out.
 */
function buildHeading(factors: DrivingFactor[]): string {
  const labels = factors.map((f) => f.label.toLowerCase());
  if (labels.length === 0) {
    return COPY.screens.resultBase.paywallPreviewHeadingFallback;
  }

  let phrase: string;
  if (labels.length <= 3) {
    phrase =
      labels.length === 1
        ? labels[0]
        : `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}`;
  } else {
    phrase = `${labels.slice(0, 3).join(", ")} and other factors`;
  }

  return COPY.screens.resultBase.paywallPreviewHeading.replace(
    "{factors}",
    phrase,
  );
}

/** Dark, blurred preview of the paywalled content with the unlock overlay + CTA. */
export function BlurredPaywallPreview({
  factors,
  onUnlock,
}: BlurredPaywallPreviewProps) {
  const { unlockCta, unlockOverlay } = COPY.screens.resultBase;
  const heading = buildHeading(factors);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-primary px-6 pb-7 pt-6 text-primary-on">
      <h2 className="text-lg font-bold leading-snug">{heading}</h2>

      {/* A single blurred faux-content block with the unlock message overlaid. */}
      <div className="relative mt-5">
        <div className="space-y-2.5 select-none blur-sm" aria-hidden>
          {[92, 80, 86, 72, 60].map((w, i) => (
            <div
              key={i}
              className="h-3.5 rounded bg-primary-on/25"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>

        {/* Overlay copy sits on top of the blur. */}
        <div className="absolute inset-0 flex items-center justify-center px-2">
          <p className="text-center text-lg font-bold leading-snug text-primary-on">
            {unlockOverlay}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onUnlock}
        className="mt-7 w-full rounded-lg bg-charcoal px-6 py-4 text-base font-bold text-white shadow-float transition hover:brightness-110"
      >
        {unlockCta}
      </button>
    </div>
  );
}
