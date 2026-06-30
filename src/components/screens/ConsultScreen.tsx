"use client";

import Image from "next/image";
import { COPY } from "@/config/copy";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { ComplianceFooter } from "@/components/ui/ComplianceFooter";

/** Event closing screen - no sell, just an invite to speak to the team. */
export function ConsultScreen() {
  const c = COPY.screens.consult;
  return (
    <ScreenShell>
      <div className="flex min-h-[80vh] flex-col justify-center text-center animate-fade-up">
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

        <h1 className="mt-5 font-display text-3xl font-extrabold leading-tight text-charcoal sm:text-4xl">
          {c.heading}
        </h1>
        <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-secondary">
          {c.body}
        </p>

        <div className="mx-auto mt-8 flex h-20 w-20 items-center justify-center rounded-full bg-primary-container">
          <svg viewBox="0 0 24 24" className="h-10 w-10 text-primary" aria-hidden>
            <path
              d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.5 8.5 0 0 1-.9-3.8A8.38 8.38 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <p className="mt-8 text-xs text-outline">{c.closing}</p>
        <ComplianceFooter />
      </div>
    </ScreenShell>
  );
}
