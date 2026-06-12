"use client";

import { useState } from "react";
import type { ScoreResult } from "@/types/engine";
import { COPY } from "@/config/copy";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { ComplianceFooter } from "@/components/ui/ComplianceFooter";

interface PaywallScreenProps {
  result: ScoreResult;
}

/** Final convert screen: the ReCOGnAIze offer, what's included, price, FAQ. */
export function PaywallScreen({ result }: PaywallScreenProps) {
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
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-container text-primary-onContainer">
              <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
                <path
                  d="M12 2l7 3v6c0 4.5-3 8.3-7 9-4-.7-7-4.5-7-9V5l7-3z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.5 12l2.5 2.5L16 9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div>
              <p className="font-bold text-charcoal">{c.offerName}</p>
              <p className="text-sm text-secondary">{c.offerNote}</p>
            </div>
          </div>

          <p className="mt-5 leading-relaxed text-charcoal">{c.bundle}</p>

          {/* What's included */}
          <ul className="mt-5 space-y-2.5 border-t border-outline-variant pt-5">
            {c.includes.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-charcoal">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/gms-logo.png"
                  alt=""
                  aria-hidden
                  className="mt-0.5 h-5 w-5 flex-shrink-0 object-contain"
                />
                <span className="font-medium leading-snug">{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-end gap-2">
            <span className="font-display text-4xl font-extrabold text-charcoal">
              {c.price}
            </span>
          </div>
          <p className="mt-1 text-sm text-outline">{c.priceNote}</p>

          <a
            href={c.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 block w-full rounded-lg bg-primary px-6 py-4 text-center text-lg font-bold text-primary-on shadow-float transition hover:brightness-105"
          >
            {c.cta}
          </a>
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
