"use client";

import Image from "next/image";
import { COPY } from "@/config/copy";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { CredibilitySignals } from "@/components/result/CredibilitySignals";
import { useIsEvent } from "@/components/VariantContext";

interface HookScreenProps {
  onStart: () => void;
  /** Event opt-in only: decline the optional brain-health check. */
  onDecline?: () => void;
}

/** Screen 1 — the hook. Logo + brand, the promise, credibility, science. */
export function HookScreen({ onStart, onDecline }: HookScreenProps) {
  const c = COPY.screens.hook;
  const event = useIsEvent();

  // Event: this is an explicit, optional opt-in shown after the game.
  const eyebrow = event ? c.eventEyebrow : c.eyebrow;
  const heading = event ? c.eventHeading : c.heading;
  const subheading = event ? c.eventSubheading : c.subheading;
  const cta = event ? c.eventCta : c.cta;
  const durationNote = event ? c.eventDurationNote : c.durationNote;

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
            {eyebrow}
          </p>
        </div>

        <h1
          className={[
            "mt-4 font-display text-4xl font-extrabold leading-tight sm:text-5xl",
            event
              ? "bg-gradient-to-br from-charcoal via-charcoal to-primary bg-clip-text text-transparent"
              : "text-charcoal",
          ].join(" ")}
        >
          {heading}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-secondary">
          {subheading}
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
          className={[
            "mt-8 w-full rounded-lg px-6 py-4 text-lg font-bold text-primary-on transition hover:brightness-105",
            event
              ? "bg-gradient-to-r from-primary to-[#ff9a4d] shadow-[0_12px_34px_-8px_rgba(247,117,40,0.65)]"
              : "bg-primary shadow-float",
          ].join(" ")}
        >
          {cta}
        </button>
        <p className="mt-3 text-xs text-outline">{durationNote}</p>

        {/* Event: declining is a first-class option (opt-in, no hard sell). */}
        {event && onDecline && (
          <button
            type="button"
            onClick={onDecline}
            className="mt-4 text-sm font-semibold text-outline underline-offset-4 hover:underline"
          >
            {c.eventDecline}
          </button>
        )}
      </div>
    </ScreenShell>
  );
}
