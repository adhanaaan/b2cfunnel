"use client";

import Image from "next/image";
import { COPY } from "@/config/copy";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { ComplianceFooter } from "@/components/ui/ComplianceFooter";

/**
 * Event2 finale, in daylight: the ReCOGnAIze assessment as the next step,
 * with a caring line for low scorers and a last nudge to share. No pricing,
 * no teleconsult pitch; the team at the booth takes it from here.
 */
export function Event2Closing({ tookQuiz = true }: { tookQuiz?: boolean }) {
  const c = COPY.screens.event2.closing;
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

        <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight text-charcoal">
          {c.heading}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-secondary">
          {tookQuiz ? c.body : c.bodyNoQuiz}
        </p>
        {tookQuiz && (
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-secondary">
            {c.reassurance}
          </p>
        )}

        <div className="mx-auto mt-8 w-full max-w-md rounded-2xl bg-surface-container px-6 py-6 text-left shadow-card">
          <p className="font-display text-lg font-extrabold text-charcoal">
            {c.offerName}
          </p>
          <ul className="mt-3 space-y-2">
            {c.offerPoints.map((point) => (
              <li key={point} className="flex gap-2 text-sm leading-snug text-secondary">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto mt-6 w-full max-w-md">
          <div className="w-full rounded-xl bg-gradient-to-r from-primary to-[#ff9a4d] px-6 py-4 text-lg font-bold text-primary-on shadow-[0_12px_34px_-8px_rgba(247,117,40,0.65)]">
            {c.cta}
          </div>
          <p className="mt-3 text-sm text-outline">{c.shareReminder}</p>
        </div>

        <p className="mt-8 text-xs text-outline">{c.credibility}</p>
        <ComplianceFooter />
      </div>
    </ScreenShell>
  );
}
