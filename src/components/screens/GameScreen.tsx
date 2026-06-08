"use client";

import { COPY } from "@/config/copy";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { SymbolMatchChallenge } from "@/components/game/SymbolMatchChallenge";

interface GameScreenProps {
  onComplete: (timeMs: number) => void;
}

/**
 * The Reaction Time Challenge — a SEPARATE, non-clinical game. Its result must
 * never feed the brain-health score; it's framed as a game with its own
 * disclaimer.
 */
export function GameScreen({ onComplete }: GameScreenProps) {
  const c = COPY.screens.game;
  return (
    <ScreenShell>
      <SymbolMatchChallenge onComplete={onComplete} />
      <p className="mt-4 text-center text-xs italic text-outline">
        {c.disclaimer}
      </p>
    </ScreenShell>
  );
}
