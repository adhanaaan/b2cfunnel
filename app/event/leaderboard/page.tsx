"use client";

import { useEffect, useState } from "react";

interface Entry {
  name: string;
  timeMs: number;
}

/** Standalone leaderboard for a booth TV/second screen. Auto-refreshes. */
export default function LeaderboardBoard() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch("/api/leaderboard?limit=20", {
          cache: "no-store",
        });
        const data = await res.json();
        if (active && Array.isArray(data.entries)) {
          setEntries(data.entries);
          setUpdatedAt(new Date());
        }
      } catch {
        /* keep last good standings */
      }
    };
    load();
    const id = setInterval(load, 8000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#fff4ee] via-surface to-[#fbe7de] px-6 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl"
      />
      <div className="relative mx-auto max-w-3xl">
        <p className="text-center text-sm font-bold uppercase tracking-[0.3em] text-primary">
          Reaction Time Challenge
        </p>
        <h1 className="mt-2 text-center font-display text-5xl font-extrabold text-charcoal">
          Today&apos;s fastest minds
        </h1>
        <p className="mt-2 text-center text-xl font-semibold text-secondary">
          🏆 Top of the day wins a Fitbit
        </p>

        {entries.length === 0 ? (
          <p className="mt-16 text-center text-lg text-outline">
            No scores yet today. Be the first on the board!
          </p>
        ) : (
          <ol className="mt-8 space-y-2.5">
            {entries.map((e, i) => (
              <li
                key={`${e.name}-${i}`}
                className={[
                  "flex items-center gap-4 rounded-2xl px-6 py-4 shadow-card",
                  i === 0
                    ? "bg-gradient-to-r from-primary to-[#ff9a4d] text-primary-on"
                    : "bg-surface-lowest",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-lg font-extrabold",
                    i === 0
                      ? "bg-white/25 text-primary-on"
                      : "bg-primary-container text-primary-onContainer",
                  ].join(" ")}
                >
                  {i + 1}
                </span>
                <span
                  className={[
                    "flex-1 truncate text-2xl font-bold",
                    i === 0 ? "text-primary-on" : "text-charcoal",
                  ].join(" ")}
                >
                  {e.name}
                </span>
                <span className="font-display text-2xl font-extrabold tabular-nums">
                  {(e.timeMs / 1000).toFixed(1)}s
                </span>
              </li>
            ))}
          </ol>
        )}

        <p className="mt-10 text-center text-xs text-outline">
          Resets daily · Updates live
          {updatedAt ? ` · ${updatedAt.toLocaleTimeString()}` : ""} · Reaction-time
          games are fun, but not a cognitive assessment.
        </p>
      </div>
    </main>
  );
}
