"use client";

import { COPY } from "@/config/copy";
import { ScreenShell } from "@/components/ui/ScreenShell";

interface LeaderboardScreenProps {
  name?: string;
  onDone: () => void;
}

// Placeholder standings until the game is wired to Supabase.
const MOCK_ROWS = [
  { name: "Wei Jie", score: "0.42s" },
  { name: "Aisha", score: "0.46s" },
  { name: "Marcus", score: "0.49s" },
  { name: "Priya", score: "0.51s" },
  { name: "Daniel", score: "0.54s" },
];

/** The reaction-game leaderboard (placeholder). Kept separate from the score. */
export function LeaderboardScreen({ name, onDone }: LeaderboardScreenProps) {
  const c = COPY.screens.leaderboard;
  return (
    <ScreenShell>
      <div className="flex min-h-[80vh] flex-col justify-center animate-fade-up">
        <p className="text-center text-sm font-bold uppercase tracking-widest text-primary">
          {c.eyebrow}
        </p>
        <h1 className="mt-3 text-center font-display text-3xl font-extrabold text-charcoal">
          {c.heading}
        </h1>
        <p className="mt-2 text-center text-base font-semibold text-secondary">
          {c.prize}
        </p>

        <ol className="mt-7 space-y-2">
          {MOCK_ROWS.map((row, i) => (
            <li
              key={row.name}
              className="flex items-center gap-3 rounded-xl bg-surface-lowest px-4 py-3 shadow-card"
            >
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary-container text-sm font-bold text-primary-onContainer">
                {i + 1}
              </span>
              <span className="flex-1 font-semibold text-charcoal">
                {row.name}
              </span>
              <span className="font-bold text-primary">{row.score}</span>
            </li>
          ))}

          {/* The current player's row (no score yet — game is a placeholder). */}
          <li className="flex items-center gap-3 rounded-xl border-2 border-dashed border-primary/60 bg-primary-container/40 px-4 py-3">
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-on">
              ?
            </span>
            <span className="flex-1 font-semibold text-charcoal">
              {name ? `${name} (you)` : "You"}
            </span>
            <span className="text-sm text-outline">—</span>
          </li>
        </ol>

        <p className="mt-4 text-center text-sm text-outline">{c.youNote}</p>

        <button
          type="button"
          onClick={onDone}
          className="mt-7 w-full rounded-lg bg-gradient-to-r from-primary to-[#ff9a4d] px-6 py-4 text-lg font-bold text-primary-on shadow-[0_12px_34px_-8px_rgba(247,117,40,0.65)] transition hover:brightness-105"
        >
          {c.cta}
        </button>
        <p className="mt-4 text-center text-xs italic text-outline">
          {c.disclaimer}
        </p>
      </div>
    </ScreenShell>
  );
}
