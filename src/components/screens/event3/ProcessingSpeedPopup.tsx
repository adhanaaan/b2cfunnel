"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { COPY } from "@/config/copy";
import { springs } from "@/lib/motion";

interface ProcessingSpeedPopupProps {
  open: boolean;
  onClose: () => void;
}

/**
 * The "?" popup on the event3 result: what processing speed actually means.
 * A night-toned card (the design system's ember-night surface) over the
 * daylight page, with the serif-italic / bold-sans mixed heading and the
 * three "with high processing speed" rows.
 */
export function ProcessingSpeedPopup({ open, onClose }: ProcessingSpeedPopupProps) {
  const c = COPY.screens.event3.speedPopup;
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center px-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.2 }}
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label={c.closeLabel}
            onClick={onClose}
            className="absolute inset-0 bg-night-ink/60 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="speed-popup-heading"
            className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-gradient-to-b from-[#4b2513] via-[#331709] to-[#210e06] px-6 pb-7 pt-8 text-left shadow-[0_24px_80px_-16px_rgba(26,14,8,0.8)]"
            initial={reduced ? false : { opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: 16, scale: 0.97 }}
            transition={springs.enter}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={c.closeLabel}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-cream-dim transition hover:bg-white/10 hover:text-cream"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M5 5l10 10M15 5L5 15" />
              </svg>
            </button>

            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-cream-dim">
              {c.eyebrow}
            </p>

            <h2
              id="speed-popup-heading"
              className="mt-4 text-[1.75rem] font-bold leading-[1.3] text-white"
            >
              {c.headingParts.map((part, i) =>
                i % 2 === 1 ? (
                  <em
                    key={i}
                    className="font-serif text-[1.9rem] font-medium italic text-cream"
                  >
                    {part}
                  </em>
                ) : (
                  <span key={i}>{part}</span>
                ),
              )}
            </h2>

            <p className="mt-6 text-[15px] leading-relaxed text-cream-dim">
              {c.intro}
            </p>

            <ul className="mt-4 space-y-2.5">
              {c.points.map((point, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3.5 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3.5"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-[11px] font-bold text-cream-dim">
                    {i + 1}
                  </span>
                  <span className="text-[15px] leading-snug text-cream">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
