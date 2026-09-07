"use client";

import { COPY } from "@/config/copy";

/**
 * The three personalised actions, numbered. `tone="note"` is the phkl report's
 * amber note card with rank-gradient numerals (Figma 697:25085); the default
 * is the event2 report's peach card.
 */
export function ActionablesCard({
  actions,
  tone = "default",
}: {
  actions: string[];
  tone?: "default" | "note";
}) {
  if (actions.length === 0) return null;
  const note = tone === "note";

  return (
    <section
      className={
        note
          ? "rounded-[26px] border border-[#f5e6b8] bg-[#fffbee] px-6 py-6"
          : "rounded-2xl bg-surface-low px-5 py-6 ring-1 ring-outline-variant"
      }
    >
      <h2
        className={
          note
            ? "font-display text-[19px] font-extrabold leading-[1.3] tracking-[-0.01em] text-[#1c110a]"
            : "font-display text-lg font-extrabold leading-snug text-charcoal"
        }
      >
        {COPY.screens.event2.report.actionablesHeading}
      </h2>
      <ol className={note ? "mt-3.5 space-y-3.5" : "mt-4 space-y-3.5"}>
        {actions.map((text, i) => (
          <li key={text} className="flex gap-3.5">
            <span
              className={
                note
                  ? "mt-px flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#ff8a1f] via-[#f9550f] to-[#d62f16] text-xs font-semibold text-white"
                  : "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-primary-on"
              }
            >
              {i + 1}
            </span>
            <span
              className={
                note
                  ? "text-[14.5px] leading-[1.58] text-[#5f4638]"
                  : "text-sm leading-relaxed text-secondary"
              }
            >
              {text}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
