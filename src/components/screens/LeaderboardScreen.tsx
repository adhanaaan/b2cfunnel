"use client";

import { COPY } from "@/config/copy";
import { ScreenShell } from "@/components/ui/ScreenShell";

interface LeaderboardScreenProps {
  name?: string;
  timeMs?: number;
  onDone: () => void;
}

// Placeholder standings (seconds to 20 correct) until the game is wired to
// Supabase for a real shared leaderboard.
const MOCK = [
  { name: "Wei Jie", t: 15.8 },
  { name: "Aisha", t: 17.4 },
  { name: "Marcus", t: 19.1 },
  { name: "Priya", t: 22.6 },
  { name: "Daniel", t: 26.3 },
];

/** The reaction-game leaderboard. Kept separate from the brain-health score. */
export function LeaderboardScreen({
  name,
  timeMs,
  onDone,
}: LeaderboardScreenProps) {
  const c = COPY.screens.leaderboard;
  const youT = timeMs != null ? timeMs / 1000 : null;

  const onShare = async () => {
    const text =
      youT != null
        ? `I scored ${youT.toFixed(1)}s on the Reaction Time Challenge. Think you're faster?`
        : "Try the Reaction Time Challenge!";
    try {
      if (navigator.share) {
        await navigator.share({ title: "Reaction Time Challenge", text });
      } else {
        await navigator.clipboard?.writeText(text);
      }
    } catch {
      /* user cancelled or unsupported — screenshot prompt still stands */
    }
  };

  const rows = [
    ...MOCK.map((m) => ({ ...m, you: false })),
    ...(youT != null ? [{ name: name || "You", t: youT, you: true }] : []),
  ].sort((a, b) => a.t - b.t);

  const yourRank = rows.findIndex((r) => r.you) + 1;

  return (
    <ScreenShell>
      <div className="flex min-h-[80vh] flex-col justify-center animate-fade-up">
        {youT != null && (
          <div className="mb-6 rounded-2xl bg-gradient-to-br from-primary to-[#ec5e3b] px-6 py-5 text-center text-primary-on shadow-[0_16px_40px_-12px_rgba(247,117,40,0.6)]">
            <p className="text-xs font-bold uppercase tracking-widest text-primary-on/80">
              Your time
            </p>
            <p className="font-display text-5xl font-extrabold tabular-nums">
              {youT.toFixed(1)}s
            </p>
            <p className="mt-1 text-sm font-semibold">
              20 correct · ranked #{yourRank} today
            </p>
          </div>
        )}

        <p className="text-center text-sm font-bold uppercase tracking-widest text-primary">
          {c.eyebrow}
        </p>
        <h1 className="mt-2 text-center font-display text-3xl font-extrabold text-charcoal">
          {c.heading}
        </h1>
        <p className="mt-1 text-center text-base font-semibold text-secondary">
          {c.prize}
        </p>

        <ol className="mt-6 space-y-2">
          {rows.map((row, i) => (
            <li
              key={`${row.name}-${i}`}
              className={[
                "flex items-center gap-3 rounded-xl px-4 py-3",
                row.you
                  ? "border-2 border-primary bg-primary-container/50 shadow-card"
                  : "bg-surface-lowest shadow-card",
              ].join(" ")}
            >
              <span
                className={[
                  "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold",
                  i === 0
                    ? "bg-primary text-primary-on"
                    : "bg-primary-container text-primary-onContainer",
                ].join(" ")}
              >
                {i + 1}
              </span>
              <span className="flex-1 font-semibold text-charcoal">
                {row.you ? `${row.name} (you)` : row.name}
              </span>
              <span className="font-bold tabular-nums text-primary">
                {row.t.toFixed(1)}s
              </span>
            </li>
          ))}
        </ol>

        {/* Screenshot / share prompt */}
        <div className="mt-6 rounded-2xl border border-dashed border-primary/50 bg-surface-container/60 px-5 py-4 text-center">
          <p className="font-bold text-charcoal">{c.shareHeading}</p>
          <p className="mt-1 text-sm text-secondary">{c.shareBody}</p>
          <button
            type="button"
            onClick={onShare}
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-charcoal px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-110"
          >
            {c.shareCta}
          </button>
        </div>

        <button
          type="button"
          onClick={onDone}
          className="mt-6 w-full rounded-lg bg-gradient-to-r from-primary to-[#ff9a4d] px-6 py-4 text-lg font-bold text-primary-on shadow-[0_12px_34px_-8px_rgba(247,117,40,0.65)] transition hover:brightness-105"
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
