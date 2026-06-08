"use client";

import { useState } from "react";
import Image from "next/image";
import { COPY } from "@/config/copy";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { ComplianceFooter } from "@/components/ui/ComplianceFooter";
import { CredibilitySignals } from "@/components/result/CredibilitySignals";

/** A primary "Book now" call to action, linking to the booking destination. */
function BookButton({ label, url }: { label: string; url: string }) {
  return (
    <a
      href={url}
      className="block w-full rounded-lg bg-primary px-6 py-4 text-center text-lg font-bold text-primary-on shadow-float transition hover:brightness-105"
    >
      {label}
    </a>
  );
}

/** Final screen — the consultation booking page. */
export function BookingScreen() {
  const c = COPY.screens.booking;
  const credibility = COPY.screens.hook.credibility;
  const faqs = COPY.screens.paywall.faqs;
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <ScreenShell>
      <div className="animate-fade-up">
        {/* Title + price */}
        <h1 className="font-display text-3xl font-extrabold leading-tight text-charcoal">
          {c.title}
        </h1>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-lg font-medium text-outline line-through">
            {c.priceOriginal}
          </span>
          <span className="font-display text-4xl font-extrabold text-primary">
            {c.priceNow}
          </span>
        </div>

        <div className="mt-5">
          <BookButton label={c.bookCta} url={c.bookingUrl} />
        </div>

        {/* What's included + biomarker panels */}
        <div className="mt-7 overflow-hidden rounded-2xl bg-surface-lowest shadow-card">
          <ul className="space-y-2 border-b border-outline-variant px-6 py-5">
            {c.includes.map((item) => (
              <li key={item} className="flex items-center gap-2 text-charcoal">
                <svg viewBox="0 0 16 16" className="h-4 w-4 flex-shrink-0 text-primary">
                  <path
                    d="M3 8.5l3 3 7-8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </ul>

          <div className="divide-y divide-outline-variant">
            {c.panels.map((panel) => (
              <div key={panel.title} className="px-6 py-4">
                <p className="font-semibold text-charcoal">{panel.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-secondary">
                  {panel.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Why this is credible (institutional / evidence). */}
        <h2 className="mt-9 font-display text-2xl font-bold text-charcoal">
          {c.credibilityHeading}
        </h2>
        <div className="mt-4 rounded-2xl bg-surface-lowest p-6 shadow-card">
          <CredibilitySignals points={credibility.points} />
          <div className="mt-5">
            <BookButton label={c.bookCta} url={c.bookingUrl} />
          </div>
        </div>

        {/* FAQ */}
        <h2 className="mt-9 font-display text-2xl font-bold text-charcoal">
          {c.faqHeading}
        </h2>
        <div className="mt-4 space-y-2">
          {faqs.map((faq, i) => {
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

        {/* Partner logo */}
        <div className="mt-9 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-outline">
            {c.trustHeading}
          </p>
          <div className="mt-4 flex items-center justify-center">
            <Image
              src={c.trustLogo}
              alt="Partner: NTU and Lee Kong Chian School of Medicine, Dementia Research Centre Singapore"
              width={2560}
              height={976}
              loading="eager"
              className="h-auto w-full max-w-xs"
            />
          </div>
        </div>

        <ComplianceFooter />
      </div>
    </ScreenShell>
  );
}
