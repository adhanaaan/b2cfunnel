"use client";

import { STAT_CARDS_BY_ID } from "@/config/statCards";

/**
 * The prevention headline, inline in the report. Reads the same Lancet card the
 * funnel shows mid-quiz, so the claim and its citation live in one place.
 */
export function PreventionStat() {
  const card = STAT_CARDS_BY_ID.lancet2024;
  if (!card) return null;

  return (
    <section className="px-1 text-center">
      <p className="font-display text-4xl font-extrabold leading-tight text-primary sm:text-5xl">
        {card.stat}
      </p>
      <p className="mx-auto mt-2 max-w-sm text-base leading-relaxed text-charcoal">
        {card.body}
      </p>
      <p className="mt-3 text-xs italic text-outline">Source: {card.source}</p>
    </section>
  );
}
