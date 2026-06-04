import Image from "next/image";
import { COPY } from "@/config/copy";
import { ScreenShell } from "@/components/ui/ScreenShell";

interface HookScreenProps {
  onStart: () => void;
}

/** Screen 1 — the hook. Logo + brand, the promise, doctor/NTU credibility, science. */
export function HookScreen({ onStart }: HookScreenProps) {
  const c = COPY.screens.hook;
  return (
    <ScreenShell>
      <div className="flex min-h-[80vh] flex-col justify-center text-center animate-fade-up">
        {/* Logo beside the brand name. Swap public/brand-logo.svg for the exact asset. */}
        <div className="flex items-center justify-center gap-2.5">
          <Image
            src="/brand-logo.svg"
            alt="Gray Matter Solutions logo"
            width={32}
            height={30}
            className="h-8 w-auto"
            priority
          />
          <p className="text-sm font-bold uppercase tracking-widest text-primary">
            {c.eyebrow}
          </p>
        </div>

        <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight text-charcoal sm:text-5xl">
          {c.heading}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-secondary">
          {c.subheading}
        </p>

        <div className="mt-8 rounded-xl bg-surface-container px-5 py-4 text-sm leading-relaxed text-charcoal shadow-card">
          {c.credibility}
        </div>

        {/* Resources / science the assessment is grounded in. */}
        <div className="mt-4 rounded-xl border border-outline-variant bg-surface-low px-5 py-4 text-left">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">
            {c.resourcesHeading}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-charcoal">
            {c.resourcesIntro}
          </p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {c.resources.map((r) => (
              <li
                key={r}
                className="rounded-full bg-surface-container px-3 py-1 text-xs font-medium text-secondary"
              >
                {r}
              </li>
            ))}
          </ul>
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
