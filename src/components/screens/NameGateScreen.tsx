"use client";

import { useState } from "react";
import { COPY } from "@/config/copy";
import { ScreenShell } from "@/components/ui/ScreenShell";

interface NameGateScreenProps {
  onSubmit: (name: string) => void;
}

/** Capture a first name up front so the leaderboard has it before the game. */
export function NameGateScreen({ onSubmit }: NameGateScreenProps) {
  const c = COPY.screens.nameGate;
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length === 0) {
      setError("Please enter your first name.");
      return;
    }
    onSubmit(name.trim());
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

        <form onSubmit={handleSubmit} className="mt-8">
          <input
            type="text"
            autoComplete="given-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={c.placeholder}
            aria-label="First name"
            className="w-full rounded-lg border-2 border-outline-variant bg-surface-lowest px-5 py-4 text-base text-charcoal outline-none transition focus:border-primary"
          />
          {error && <p className="mt-2 text-sm font-medium text-error">{error}</p>}
          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-gradient-to-r from-primary to-[#ff9a4d] px-6 py-4 text-lg font-bold text-primary-on shadow-[0_12px_34px_-8px_rgba(247,117,40,0.65)] transition hover:brightness-105"
          >
            {c.cta}
          </button>
        </form>
      </div>
    </ScreenShell>
  );
}
