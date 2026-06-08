"use client";

import { COPY } from "@/config/copy";
import { ScreenShell } from "@/components/ui/ScreenShell";

interface GameScreenProps {
  onDone: () => void;
}

/**
 * The Reaction Time Challenge — a SEPARATE, non-clinical game. Its result must
 * never feed the brain-health score; it's framed as a game with its own
 * disclaimer. This is a placeholder until the symbol-matching game is dropped in
 * (replace the dashed block below, then call onDone with the result).
 */
export function GameScreen({ onDone }: GameScreenProps) {
  const c = COPY.screens.game;
  return (
    <ScreenShell>
      <div className="flex min-h-[80vh] flex-col justify-center text-center animate-fade-up">
        <p className="text-sm font-bold uppercase tracking-widest text-primary">
          {c.eyebrow}
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold leading-tight text-charcoal">
          {c.heading}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-secondary">{c.body}</p>

        {/* TODO: drop the symbol-matching game in here; call onDone() when finished. */}
        <div className="mt-8 flex min-h-[180px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/50 bg-surface-container/60 px-6 py-10 text-center">
          <span className="text-4xl" aria-hidden>
            🎮
          </span>
          <p className="mt-3 text-sm font-medium text-secondary">
            {c.placeholder}
          </p>
        </div>

        <button
          type="button"
          onClick={onDone}
          className="mt-8 w-full rounded-lg bg-gradient-to-r from-primary to-[#ff9a4d] px-6 py-4 text-lg font-bold text-primary-on shadow-[0_12px_34px_-8px_rgba(247,117,40,0.65)] transition hover:brightness-105"
        >
          {c.cta}
        </button>
        <p className="mt-4 text-xs italic text-outline">{c.disclaimer}</p>
      </div>
    </ScreenShell>
  );
}
