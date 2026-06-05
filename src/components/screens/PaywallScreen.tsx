"use client";

import { useState } from "react";
import type { ScoreResult } from "@/types/engine";
import { COPY } from "@/config/copy";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { ComplianceFooter } from "@/components/ui/ComplianceFooter";

interface PaywallScreenProps {
  result: ScoreResult;
  onBook: () => void;
}

/** Screen 7 — the paywall / convert screen: named doctor, price, bundle, FAQ. */
export function PaywallScreen({ result, onBook }: PaywallScreenProps) {
  const c = COPY.screens.paywall;
  const angle = COPY.personas[result.persona].paywallAngle;
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <ScreenShell>
      <div className="animate-fade-up">
        <p className="text-sm font-bold uppercase tracking-widest text-primary">
          {c.eyebrow}
        </p>
        <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight text-charcoal">
          {c.heading}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-secondary">{angle}</p>

        {/* Offer card */}
        <div className="mt-7 rounded-2xl bg-surface-lowest p-6 shadow-card">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-base font-bold text-secondary-on">
              {COPY.screens.resultBase.reviewerInitials}
            </span>
            <div>
              <p className="font-bold text-charcoal">{c.doctorName}</p>
              <p className="text-sm text-secondary">{c.doctorTitle}</p>
            </div>
          </div>

          <p className="mt-5 leading-relaxed text-charcoal">{c.bundle}</p>

          <div className="mt-6 flex items-end gap-2">
            <span className="font-display text-4xl font-extrabold text-charcoal">
              {c.price}
            </span>
          </div>
          <p className="mt-1 text-sm text-outline">{c.priceNote}</p>

          <button
            type="button"
            onClick={onBook}
            className="mt-6 w-full rounded-lg bg-primary px-6 py-4 text-lg font-bold text-primary-on shadow-float transition hover:brightness-105"
          >
            {c.cta}
          </button>
        </div>

        {/* FAQ */}
        <div className="mt-8 space-y-2">
          {c.faqs.map((faq, i) => {
            const open = openFaq === i;
            return (
              <div
                key={faq.q}
                className="overflow-hidden rounded-lg bg-surface-container"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(open ? null : i)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between px-5 py-4 text-left font-semibold text-charcoal"
                >
                  <span>{faq.q}</span>
                  <span className="ml-3 text-primary">{open ? "–" : "+"}</span>
                </button>
                {open && (
                  <p className="px-5 pb-4 text-sm leading-relaxed text-secondary">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <ComplianceFooter />
      </div>
    </ScreenShell>
  );
}
