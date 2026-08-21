"use client";

import { useState } from "react";
import { COPY } from "@/config/copy";
import { track } from "@/lib/analytics";
import { useVariant } from "@/components/VariantContext";

interface NextStepsCardProps {
  name?: string;
  email?: string;
}

/**
 * The tail of the report: what happens next, the ReCOGnAIze assessment, and the
 * opt-in for tips and early access. The booth line is a callout rather than a
 * button, because tapping it cannot do anything: the next step happens in
 * person.
 */
export function NextStepsCard({ name, email }: NextStepsCardProps) {
  const c = COPY.screens.event2.closing;
  const r = COPY.screens.event2.report;
  const variant = useVariant();
  const [optedIn, setOptedIn] = useState(false);

  const optIn = () => {
    if (optedIn) return;
    setOptedIn(true);
    track("newsletter_optin", { variant, step: "result" });
    // Fire and forget: the tick must never wait on the network.
    void fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, variant }),
    }).catch(() => {});
  };

  return (
    <section className="rounded-2xl bg-surface-container px-5 py-6">
      <p className="text-xs font-bold uppercase tracking-widest text-primary">
        {r.nextStepsHeading}
      </p>
      <h2 className="mt-2 font-display text-xl font-extrabold leading-snug text-charcoal">
        {c.heading}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-secondary">{c.body}</p>
      <p className="mt-2 text-sm leading-relaxed text-secondary">
        {c.reassurance}
      </p>

      <div className="mt-5 rounded-xl bg-surface-lowest px-4 py-4">
        <p className="font-display text-base font-extrabold text-charcoal">
          {c.offerName}
        </p>
        <ul className="mt-2.5 space-y-2">
          {c.offerPoints.map((point) => (
            <li
              key={point}
              className="flex gap-2 text-sm leading-snug text-secondary"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {point}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-4 rounded-xl border border-primary bg-primary-container/40 px-4 py-3 text-center text-base font-bold text-primary-onContainer">
        {c.cta}
      </p>

      {/* Opt-in: the one interactive thing on the report. */}
      <label className="mt-5 flex cursor-pointer items-start gap-3 py-1">
        <input
          type="checkbox"
          checked={optedIn}
          onChange={optIn}
          disabled={optedIn}
          className="mt-0.5 h-6 w-6 shrink-0 cursor-pointer accent-primary"
        />
        <span className="text-sm leading-snug text-secondary">
          {r.optInLabel}
        </span>
      </label>
      {optedIn && (
        <p className="mt-1.5 pl-9 text-sm font-semibold text-primary" role="status">
          {r.optInConfirmed}
        </p>
      )}

      <p className="mt-5 text-center text-xs text-outline">{c.credibility}</p>
    </section>
  );
}
