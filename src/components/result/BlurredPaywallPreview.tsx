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

function LockIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={className}
      aria-hidden
    >
      <rect x="3.5" y="11" width="17" height="10" rx="2" />
      <path d="M7.5 11V7.5a4.5 4.5 0 0 1 9 0V11" />
    </svg>
  );
}

/** Premium "locked analysis" card teasing the full report, with the unlock CTA. */
export function BlurredPaywallPreview({
  factors,
  onUnlock,
}: BlurredPaywallPreviewProps) {
  const { unlockCta, unlockOverlay, unlockTeasers } = COPY.screens.resultBase;
  const heading = buildHeading(factors);

  return (
    <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-[#ec5e3b] p-6 text-primary-on shadow-[0_20px_50px_-20px_rgba(247,117,40,0.6)]">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
        <LockIcon className="h-3.5 w-3.5" />
        Locked
      </span>

      <h2 className="mt-3 text-xl font-extrabold leading-snug">{heading}</h2>
      <p className="mt-2 text-sm leading-relaxed text-white/85">
        {unlockOverlay}
      </p>

      <ul className="mt-5 space-y-2">
        {unlockTeasers.map((t) => (
          <li
            key={t}
            className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3"
          >
            <LockIcon className="h-4 w-4 flex-shrink-0 text-white/80" />
            <span className="text-sm font-semibold">{t}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onUnlock}
        className="mt-6 w-full rounded-lg bg-charcoal px-6 py-4 text-base font-bold text-white shadow-float transition hover:brightness-110"
      >
        {unlockCta}
      </button>
    </div>
  );
}
