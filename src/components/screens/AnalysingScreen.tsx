"use client";

import { useEffect, useState } from "react";
import { COPY } from "@/config/copy";
import { ScreenShell } from "@/components/ui/ScreenShell";

interface AnalysingScreenProps {
  name?: string;
  onDone: () => void;
}

const CRUMB_MS = 1300;

/** Screen 5 — a few seconds of suspense, cycling credibility crumbs. */
export function AnalysingScreen({ name, onDone }: AnalysingScreenProps) {
  const { heading, headingFallback, crumbs } = COPY.screens.analysing;
  const [index, setIndex] = useState(0);

  const personalisedHeading = name
    ? heading.replace("{name}", name)
    : headingFallback;

  useEffect(() => {
    if (index >= crumbs.length - 1) {
      const t = setTimeout(onDone, CRUMB_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setIndex((i) => i + 1), CRUMB_MS);
    return () => clearTimeout(t);
  }, [index, crumbs.length, onDone]);

  return (
    <ScreenShell>
      <div className="flex min-h-[80vh] flex-col items-center justify-center text-center">
        {/* Spinner */}
        <div
          className="h-14 w-14 animate-spin rounded-full border-4 border-surface-high border-t-primary"
          role="status"
          aria-label="Building your profile"
        />
        <h1 className="mt-8 font-display text-2xl font-bold text-charcoal">
          {personalisedHeading}
        </h1>
        <p
          key={index}
          className="mt-4 min-h-[1.5rem] text-base text-secondary animate-crumb"
        >
          {crumbs[index]}
        </p>
      </div>
    </ScreenShell>
  );
}
