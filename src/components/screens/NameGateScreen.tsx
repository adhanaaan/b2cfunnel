"use client";

import { useState } from "react";
import { COPY } from "@/config/copy";
import { ScreenShell } from "@/components/ui/ScreenShell";

interface NameGateScreenProps {
  onSubmit: (name: string, email: string) => void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Event first page: pitch the challenge + capture name and Accenture email. */
export function NameGateScreen({ onSubmit }: NameGateScreenProps) {
  const c = COPY.screens.nameGate;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length === 0) {
      setError("Please enter your name.");
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    onSubmit(name.trim(), email.trim());
  };

  return (
    <ScreenShell>
      <div className="flex min-h-[80vh] flex-col justify-center animate-fade-up">
        <p className="text-sm font-bold uppercase tracking-widest text-primary">
          {c.eyebrow}
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold leading-tight text-charcoal">
          {c.heading}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-secondary">{c.body}</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-3">
          <input
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={c.placeholder}
            aria-label="Name"
            className="w-full rounded-lg border-2 border-outline-variant bg-surface-lowest px-5 py-4 text-base text-charcoal outline-none transition focus:border-primary"
          />
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={c.emailPlaceholder}
            aria-label="Email"
            className="w-full rounded-lg border-2 border-outline-variant bg-surface-lowest px-5 py-4 text-base text-charcoal outline-none transition focus:border-primary"
          />
          {error && <p className="text-sm font-medium text-error">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-primary to-[#ff9a4d] px-6 py-4 text-lg font-bold text-primary-on shadow-[0_12px_34px_-8px_rgba(247,117,40,0.65)] transition hover:brightness-105"
          >
            {c.cta}
          </button>
        </form>
        <p className="mt-3 text-center text-xs text-outline">{c.emailNote}</p>
      </div>
    </ScreenShell>
  );
}
