import { COPY } from "@/config/copy";
import { ScreenShell } from "@/components/ui/ScreenShell";

interface HookScreenProps {
  onStart: () => void;
}

/** Screen 1 — the hook. Promises a Brain Health Score, doctor/NTU credibility. */
export function HookScreen({ onStart }: HookScreenProps) {
  const c = COPY.screens.hook;
  return (
    <ScreenShell>
      <div className="flex min-h-[80vh] flex-col justify-center text-center animate-fade-up">
        <p className="text-sm font-bold uppercase tracking-widest text-primary">
          {c.eyebrow}
        </p>
        <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight text-charcoal sm:text-5xl">
          {c.heading}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-secondary">
          {c.subheading}
        </p>

        <div className="mt-8 rounded-xl bg-surface-container px-5 py-4 text-sm leading-relaxed text-charcoal shadow-card">
          {c.credibility}
        </div>

        <button
          type="button"
          onClick={onStart}
          className="mt-8 w-full rounded-lg bg-primary px-6 py-4 text-lg font-bold text-primary-on shadow-float transition hover:brightness-105"
        >
          {c.cta}
        </button>
        <p className="mt-3 text-xs text-outline">{c.durationNote}</p>
      </div>
    </ScreenShell>
  );
}
