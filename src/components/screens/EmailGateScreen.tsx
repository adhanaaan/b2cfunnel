"use client";

import { useState } from "react";
import { COPY } from "@/config/copy";
import { ScreenShell } from "@/components/ui/ScreenShell";

interface EmailGateScreenProps {
  onSubmit: (email: string) => Promise<void> | void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Screen 4 — email gate at peak perceived value, just before the reveal. */
export function EmailGateScreen({ onSubmit }: EmailGateScreenProps) {
  const c = COPY.screens.emailGate;
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit(email.trim());
    } catch {
      setSubmitting(false);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <ScreenShell>
      <div className="flex min-h-[80vh] flex-col justify-center animate-fade-up">
        <p className="text-sm font-bold uppercase tracking-widest text-primary">
          {c.eyebrow}
        </p>
        <h1 className="mt-3 font-display text-3xl font-extrabold text-charcoal">
          {c.heading}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-secondary">{c.body}</p>

        <form onSubmit={handleSubmit} className="mt-8">
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={c.placeholder}
            aria-label="Email address"
            aria-invalid={Boolean(error)}
            className="w-full rounded-lg border-2 border-outline-variant bg-surface-lowest px-5 py-4 text-base text-charcoal outline-none transition focus:border-primary"
          />
          {error && (
            <p className="mt-2 text-sm font-medium text-error">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-4 w-full rounded-lg bg-primary px-6 py-4 text-lg font-bold text-primary-on shadow-float transition hover:brightness-105 disabled:opacity-60"
          >
            {submitting ? "Revealing…" : c.cta}
          </button>
        </form>

        <p className="mt-4 text-center text-xs leading-relaxed text-outline">
          {c.privacyNote}
        </p>
      </div>
    </ScreenShell>
  );
}
