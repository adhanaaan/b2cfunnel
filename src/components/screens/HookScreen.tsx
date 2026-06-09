"use client";

import Image from "next/image";
import { COPY } from "@/config/copy";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { CredibilitySignals } from "@/components/result/CredibilitySignals";

interface HookScreenProps {
  onStart: () => void;
}

/** Screen 1 (full quiz) — the cold-open hook: brand, promise, credibility. */
export function HookScreen({ onStart }: HookScreenProps) {
  const c = COPY.screens.hook;
  return (
    <ScreenShell>
      <div className="flex min-h-[80vh] flex-col justify-center text-center animate-fade-up">
        {/* Logo beside the brand name. */}
        <div className="flex items-center justify-center gap-2.5">
          <Image
            src="/gms-logo.png"
            alt="Gray Matter Solutions logo"
            width={442}
            height={366}
            className="h-9 w-auto"
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

        {/* Institutional / evidence credibility (replaces the clinician card). */}
        <CredibilitySignals
          heading={c.credibility.heading}
          points={c.credibility.points}
          logo={c.credibility.logo}
          className="mt-8"
        />

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
