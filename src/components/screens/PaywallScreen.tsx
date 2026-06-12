"use client";

import { useState } from "react";
import type { ScoreResult } from "@/types/engine";
import { COPY } from "@/config/copy";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { ComplianceFooter } from "@/components/ui/ComplianceFooter";

interface PaywallScreenProps {
  result: ScoreResult;
}

/** Final convert screen: the ReCOGnAIze offer, what's included, order summary. */
export function PaywallScreen({ result }: PaywallScreenProps) {
  const c = COPY.screens.paywall;
  const angle = COPY.personas[result.persona].paywallAngle;
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [pubmedOk, setPubmedOk] = useState(true);

  // Book now opens WhatsApp to Adnan with a prefilled, fill-in message.
  const bookHref = `https://wa.me/${c.whatsappNumber}?text=${encodeURIComponent(
    c.whatsappMessage,
  )}`;

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

        {/* Product card */}
        <div className="mt-7 rounded-2xl bg-surface-lowest p-6 shadow-card">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/gms-logo.png"
              alt=""
              aria-hidden
              className="h-11 w-11 flex-shrink-0 object-contain"
            />
            <div>
              <p className="font-bold text-charcoal">{c.offerName}</p>
              <p className="text-sm text-secondary">{c.offerNote}</p>
            </div>
          </div>

          {/* Peer-reviewed reference (PubMed). */}
          <a
            href={c.paperUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex items-center gap-2.5 rounded-xl border border-outline-variant bg-surface-low px-4 py-3 transition hover:border-primary"
          >
            {pubmedOk && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/pubmed-logo.png"
                alt="PubMed"
                onError={() => setPubmedOk(false)}
                className="h-5 w-auto flex-shrink-0 object-contain"
              />
            )}
            <span className="text-sm font-medium leading-snug text-charcoal">
              {c.paperNote}
            </span>
            <span className="ml-auto flex-shrink-0 text-primary">→</span>
          </a>

          {/* What's included */}
          <ul className="mt-5 space-y-2.5 border-t border-outline-variant pt-5">
            {c.includes.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-charcoal">
                <svg
                  viewBox="0 0 16 16"
                  className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary"
                >
                  <path
                    d="M3 8.5l3 3 7-8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-medium leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Order summary / checkout */}
        <div className="mt-5 rounded-2xl bg-surface-lowest p-6 shadow-card">
          <p className="text-sm font-bold uppercase tracking-widest text-outline">
            Order summary
          </p>

          <div className="mt-4 flex items-center justify-between gap-4 border-b border-outline-variant pb-4">
            <span className="leading-snug text-charcoal">{c.lineItem}</span>
            <span className="font-semibold text-charcoal">{c.price}</span>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <span className="font-bold text-charcoal">Subtotal</span>
            <span className="font-display text-3xl font-extrabold text-charcoal">
              {c.price}
            </span>
          </div>
          <p className="mt-1 text-right text-sm text-outline">{c.priceNote}</p>

          <a
            href={bookHref}
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
