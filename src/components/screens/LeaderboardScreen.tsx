"use client";

import { useEffect, useState } from "react";
import { COPY } from "@/config/copy";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { formatTime } from "@/lib/format";

interface LeaderboardScreenProps {
  name?: string;
  email?: string;
  timeMs?: number;
  onDone: () => void;
}

interface Entry {
  name: string;
  timeMs: number;
  you?: boolean;
}

// Fallback standings (seconds to 20 correct) shown only when the leaderboard
// API returns nothing (e.g. Supabase not configured yet).
const MOCK = [
  { name: "Wei Jie", timeMs: 15800 },
  { name: "Aisha", timeMs: 17400 },
  { name: "Marcus", timeMs: 19100 },
  { name: "Priya", timeMs: 22600 },
  { name: "Daniel", timeMs: 26300 },
];

/** The reaction-game leaderboard. Kept separate from the brain-health score. */
export function LeaderboardScreen({
  name,
  email,
  timeMs,
  onDone,
}: LeaderboardScreenProps) {
  const c = COPY.screens.leaderboard;
  const hasTime = timeMs != null;
  const [rows, setRows] = useState<Entry[] | null>(null);
  const [rank, setRank] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/leaderboard?limit=10${email ? `&email=${encodeURIComponent(email)}` : ""}`,
        );
        const data = await res.json();
        if (cancelled) return;
        if (Array.isArray(data.entries) && data.entries.length > 0) {
          setRows(
            data.entries.map((e: { name: string; timeMs: number }) => ({
              name: e.name,
              timeMs: e.timeMs,
              you:
                !!email &&
                data.you != null &&
                e.timeMs === data.you.timeMs &&
                e.name === name,
            })),
          );
          setRank(data.you?.rank ?? null);
          return;
        }
      } catch {
        /* fall back to mock below */
      }
      // Fallback: mock standings + the player's own time slotted in.
      const merged: Entry[] = [
        ...MOCK,
        ...(timeMs != null ? [{ name: name || "You", timeMs, you: true }] : []),
      ].sort((a, b) => a.timeMs - b.timeMs);
      setRows(merged);
      setRank(merged.findIndex((r) => r.you) + 1 || null);
    })();
    return () => {
      cancelled = true;
    };
  }, [email, name, timeMs]);

  const onShare = async () => {
    const text =
      timeMs != null
        ? `I scored ${formatTime(timeMs)} on the Reaction Time Challenge. Think you're faster?`
        : "Try the Reaction Time Challenge!";
    try {
      if (navigator.share) {
        await navigator.share({ title: "Reaction Time Challenge", text });
      } else {
        await navigator.clipboard?.writeText(text);
      }
    } catch {
      /* cancelled/unsupported — the screenshot prompt still stands */
    }
  };

  return (
    <ScreenShell>
      <div className="flex min-h-[80vh] flex-col justify-center animate-fade-up">
        {hasTime && (
          <div className="mb-6 rounded-2xl bg-gradient-to-br from-primary to-[#ec5e3b] px-6 py-5 text-center text-primary-on shadow-[0_16px_40px_-12px_rgba(247,117,40,0.6)]">
            <p className="text-xs font-bold uppercase tracking-widest text-primary-on/80">
              Your time
            </p>
            <p className="font-display text-5xl font-extrabold tabular-nums">
              {formatTime(timeMs!)}
            </p>
            <p className="mt-1 text-sm font-semibold">
              20 correct{rank ? ` · ranked #${rank} today` : ""}
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
          {(rows ?? []).map((row, i) => (
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
                {formatTime(row.timeMs)}
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
