"use client";

import { COPY } from "@/config/copy";
import { SymbolMatchGame } from "@/components/game/symbol-match/SymbolMatchGame";

interface GameScreenProps {
  onComplete: (timeMs: number) => void;
}

/**
 * The Reaction Time Challenge — your real symbol-matching game (Task2Game),
 * wrapped with the race-to-20 timer. A game: its result never feeds the
 * brain-health score.
 */
export function GameScreen({ onComplete }: GameScreenProps) {
  const c = COPY.screens.game;
  return (
    <main className="relative min-h-screen w-full">
      <SymbolMatchGame onComplete={onComplete} />
      <p className="absolute inset-x-0 bottom-1 z-40 px-4 text-center text-[11px] italic text-[#5b2c6f]/80">
        {c.disclaimer}
      </p>
    </main>
  );
}
