"use client";

import { COPY } from "@/config/copy";

/** The three personalised actions, numbered. */
export function ActionablesCard({ actions }: { actions: string[] }) {
  if (actions.length === 0) return null;

  return (
    <section className="rounded-2xl bg-surface-low px-5 py-6 ring-1 ring-outline-variant">
      <h2 className="font-display text-lg font-extrabold leading-snug text-charcoal">
        {COPY.screens.event2.report.actionablesHeading}
      </h2>
      <ol className="mt-4 space-y-3.5">
        {actions.map((text, i) => (
          <li key={text} className="flex gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-primary-on">
              {i + 1}
            </span>
            <span className="text-sm leading-relaxed text-secondary">
              {text}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
