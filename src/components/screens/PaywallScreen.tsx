"use client";

import { useState } from "react";
import { COPY } from "@/config/copy";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { ComplianceFooter } from "@/components/ui/ComplianceFooter";
import { DoctorAvatar } from "@/components/result/DoctorAvatar";

/** Final convert screen: the ReCOGnAIze offer, what's included, order summary. */
export function PaywallScreen() {
  const c = COPY.screens.paywall;
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [pubmedOk, setPubmedOk] = useState(true);
  const [doctorOpen, setDoctorOpen] = useState(false);
  const doc = c.doctor;

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

        {/* Peer-reviewed reference (PubMed) — under the title. */}
        <a
          href={c.paperUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center gap-2.5 rounded-xl border border-outline-variant bg-surface-low px-4 py-3 transition hover:border-primary"
        >
          {pubmedOk && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/pubmed-logo-blue.svg"
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

        {/* Teleconsult clinic → Eternami → Dr Chris */}
        <div className="mt-5 rounded-2xl bg-surface-lowest p-5 shadow-card">
          <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
            {doc.eyebrow}
          </p>
          <p className="mt-1 font-display text-2xl font-extrabold leading-none text-charcoal">
            {doc.org}
          </p>

          <div className="mt-4 flex items-center gap-3 border-t border-outline-variant pt-4">
            <DoctorAvatar initials={doc.initials} className="h-12 w-12 text-sm" />
            <div className="min-w-0">
              <p className="font-bold leading-snug text-charcoal">{doc.name}</p>
              <p className="text-sm text-secondary">{doc.credentials}</p>
              <p className="text-sm text-secondary">{doc.role}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDoctorOpen((o) => !o)}
            aria-expanded={doctorOpen}
            className="mt-3 text-sm font-semibold text-primary"
          >
            {doctorOpen ? "Hide bio –" : "About the doctor +"}
          </button>
          {doctorOpen && (
            <p className="mt-2 text-sm leading-relaxed text-secondary">
              {doc.bio}
            </p>
          )}
        </div>

        {/* Order summary / checkout */}
        <div className="mt-5 rounded-2xl bg-surface-lowest p-6 shadow-card">
          <p className="text-sm font-bold uppercase tracking-widest text-outline">
            Order summary
          </p>

          <div className="mt-4 flex items-center justify-between gap-4 border-b border-outline-variant pb-4">
            <span className="leading-snug text-charcoal">{c.lineItem}</span>
            <span className="font-semibold text-charcoal">{c.priceOriginal}</span>
          </div>

          {/* Promo code. */}
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder={c.promoPlaceholder}
              aria-label={c.promoPlaceholder}
              className="min-w-0 flex-1 rounded-lg border-2 border-outline-variant bg-surface-lowest px-4 py-2.5 text-sm text-charcoal outline-none transition focus:border-primary"
            />
            <button
              type="button"
              className="flex-shrink-0 rounded-lg bg-surface-container px-4 text-sm font-bold text-charcoal transition hover:brightness-95"
            >
              {c.promoCta}
            </button>
          </div>

          <div className="mt-4 flex items-end justify-between border-t border-outline-variant pt-4">
            <div>
              <span className="font-bold text-charcoal">Subtotal</span>
              <span className="ml-2 inline-block rounded-full bg-[#fde047] px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wide text-charcoal shadow-sm">
                {c.priceTag}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-medium text-outline line-through">
                {c.priceOriginal}
              </span>
              <span className="font-display text-3xl font-extrabold text-charcoal">
                {c.price}
              </span>
            </div>
          </div>

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
