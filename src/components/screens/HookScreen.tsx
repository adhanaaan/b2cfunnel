"use client";

import Image from "next/image";
import { COPY } from "@/config/copy";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { DoctorAvatar } from "@/components/result/DoctorAvatar";
import { useIsEvent } from "@/components/VariantContext";

interface HookScreenProps {
  onStart: () => void;
}

/** Screen 1 — the hook. Logo + brand, the promise, doctor/NTU credibility, science. */
export function HookScreen({ onStart }: HookScreenProps) {
  const c = COPY.screens.hook;
  const event = useIsEvent();
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

        <h1
          className={[
            "mt-4 font-display text-4xl font-extrabold leading-tight sm:text-5xl",
            event
              ? "bg-gradient-to-br from-charcoal via-charcoal to-primary bg-clip-text text-transparent"
              : "text-charcoal",
          ].join(" ")}
        >
          {c.heading}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-secondary">
          {c.subheading}
        </p>

        {/* Reviewing doctor card. */}
        <div className="mt-8 flex items-center gap-4 rounded-xl bg-surface-container px-5 py-4 text-left shadow-card">
          <DoctorAvatar
            image={c.doctor.image}
            initials={c.doctor.avatarInitials}
          />
          <div className="min-w-0">
            <p className="text-lg font-bold text-charcoal">{c.doctor.name}</p>
            <p className="text-sm font-bold leading-snug text-charcoal">
              {c.doctor.credentials}
            </p>
            <p className="text-sm leading-snug text-outline">
              {c.doctor.affiliation}
            </p>
          </div>
        </div>

        {/* Science the assessment is grounded in. */}
        <div className="mt-4 rounded-xl border border-outline-variant bg-surface-low px-5 py-4">
          <p className="text-sm leading-relaxed text-charcoal">
            {c.resourcesIntro}
          </p>
        </div>

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
          {c.cta}
        </button>
        <p className="mt-3 text-xs text-outline">{c.durationNote}</p>
      </div>
    </ScreenShell>
  );
}
