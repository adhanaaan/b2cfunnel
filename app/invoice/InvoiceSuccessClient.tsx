"use client";

import { useEffect, useMemo, useState } from "react";
import { COPY } from "@/config/copy";
import { ScreenShell } from "@/components/ui/ScreenShell";

const CONTACT_EMAIL = "mohdadnan.azam@ntu.edu.sg";
const CONTACT_PHONE_DISPLAY = "+65 8742 4150";
const REDIRECT_SECONDS = 10;

export function InvoiceSuccessClient() {
  const c = COPY.screens.paywall;
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);

  const whatsappHref = useMemo(
    () =>
      `https://wa.me/${c.whatsappNumber}?text=${encodeURIComponent(
        c.whatsappMessage,
      )}`,
    [c.whatsappMessage, c.whatsappNumber],
  );

  useEffect(() => {
    const countdown = window.setInterval(() => {
      setSecondsLeft((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    const redirect = window.setTimeout(() => {
      window.location.href = whatsappHref;
    }, REDIRECT_SECONDS * 1000);

    return () => {
      window.clearInterval(countdown);
      window.clearTimeout(redirect);
    };
  }, [whatsappHref]);

  return (
    <ScreenShell>
      <div className="animate-fade-up">
        <div className="rounded-3xl bg-gradient-to-b from-white to-[#fff6f0] p-6 shadow-[0_30px_80px_-30px_rgba(247,117,40,0.45)] ring-1 ring-black/5 sm:p-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-container text-primary">
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>

          <p className="mt-7 text-sm font-bold uppercase tracking-widest text-primary">
            Purchase confirmed
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight text-charcoal sm:text-4xl">
            Thank you for booking your ReCOGnAIze Brain Health Consult.
          </h1>

          <div className="mt-6 rounded-2xl bg-surface-low p-5 ring-1 ring-outline-variant">
            <p className="text-sm font-bold uppercase tracking-widest text-outline">
              Next step
            </p>
            <p className="mt-2 text-lg font-semibold leading-snug text-charcoal">
              Confirm your teleconsult details with our team on WhatsApp.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-secondary">
              Redirecting in{" "}
              <span className="font-bold text-primary">{secondsLeft}</span>{" "}
              seconds. If WhatsApp does not open automatically, use the button
              below.
            </p>
          </div>

          <a
            href={whatsappHref}
            className="mt-6 block w-full rounded-lg bg-primary px-6 py-4 text-center text-lg font-bold text-primary-on shadow-float transition hover:brightness-105"
          >
            Confirm on WhatsApp
          </a>

          <div className="mt-6 border-t border-outline-variant pt-5">
            <p className="text-sm font-semibold text-charcoal">
              For assistance:
            </p>
            <div className="mt-2 space-y-1 text-sm leading-relaxed text-secondary">
              <p>
                Email{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-semibold text-primary underline underline-offset-4"
                >
                  {CONTACT_EMAIL}
                </a>
              </p>
              <p>
                Call or WhatsApp{" "}
                <a
                  href={`tel:${c.whatsappNumber}`}
                  className="font-semibold text-primary underline underline-offset-4"
                >
                  {CONTACT_PHONE_DISPLAY}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
