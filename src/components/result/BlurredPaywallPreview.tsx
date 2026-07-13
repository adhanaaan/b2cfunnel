import { COPY } from "@/config/copy";
import { useVariant } from "@/components/VariantContext";

interface BlurredPaywallPreviewProps {
  onUnlock: () => void;
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

/** Locked preview: a clean title over a blurred faux-report, with the CTA. */
export function BlurredPaywallPreview({ onUnlock }: BlurredPaywallPreviewProps) {
  const { unlockCta, unlockOverlay } = COPY.screens.resultBase;
  const woman = useVariant() === "woman";

  return (
    <div
      className={
        woman
          ? "overflow-hidden rounded-[18px] bg-[#6c886d] p-6 text-white shadow-[0_22px_54px_-24px_rgba(71,91,71,0.55)]"
          : "overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-[#ec5e3b] p-6 text-primary-on shadow-[0_20px_50px_-20px_rgba(247,117,40,0.6)]"
      }
    >
      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
        <LockIcon className="h-3.5 w-3.5" />
        Locked
      </span>

      <h2 className="mt-3 text-xl font-extrabold leading-snug">
        {unlockOverlay}
      </h2>

      {/* Blurred faux-report content behind the lock. */}
      <div
        className="mt-5 select-none space-y-2.5 opacity-90 blur-[3px]"
        aria-hidden
      >
        {[94, 82, 88, 74, 90, 64].map((w, i) => (
          <div
            key={i}
            className={woman ? "h-3.5 rounded bg-[#f3eee5]/35" : "h-3.5 rounded bg-white/30"}
            style={{ width: `${w}%` }}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onUnlock}
        className={
          woman
            ? "mt-6 w-full rounded-lg bg-[#f3eee5] px-6 py-4 text-base font-bold text-[#475b47] shadow-float transition hover:brightness-105"
            : "mt-6 w-full rounded-lg bg-charcoal px-6 py-4 text-base font-bold text-white shadow-float transition hover:brightness-110"
        }
      >
        {unlockCta}
      </button>
    </div>
  );
}
