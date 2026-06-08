"use client";

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
  return <SymbolMatchGame onComplete={onComplete} />;
}
