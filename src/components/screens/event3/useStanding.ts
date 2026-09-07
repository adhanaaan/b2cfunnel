"use client";

import { useEffect, useState } from "react";

/** The live standings a post-game screen shows beside the player's time. */
export interface Standing {
  /** The fastest time so far in this event's bucket, and who set it. */
  top: { name: string; timeMs: number } | null;
  /** The player's own rank in that bucket, when their email has a score. */
  rank: number | null;
  total: number | null;
}

const EMPTY: Standing = { top: null, rank: null, total: null };

/**
 * How long to give the score POST (fire-and-forget, sent just before the
 * screen mounts) before asking the board where the player stands. Without it
 * the read can overtake the write and rank a player against a board that does
 * not have their time yet.
 */
const SETTLE_MS = 400;

/**
 * The fastest time so far and the player's rank, scoped to one event's
 * bucket. Re-fetched whenever `refreshKey` changes - pass the game time, so a
 * replay reads its new standing.
 *
 * Shared by the daylight post-game card and the PHKL report so both rank the
 * player against the same board the same way.
 */
export function useStanding(
  source: string | null,
  email?: string,
  refreshKey?: number,
): Standing {
  const [standing, setStanding] = useState<Standing>(EMPTY);

  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/leaderboard?limit=1` +
            (source ? `&source=${encodeURIComponent(source)}` : "") +
            (email ? `&email=${encodeURIComponent(email)}` : ""),
          { cache: "no-store" },
        );
        const data = await res.json();
        if (cancelled) return;
        setStanding({
          top:
            Array.isArray(data.entries) && data.entries[0]
              ? { name: data.entries[0].name, timeMs: data.entries[0].timeMs }
              : null,
          rank: data.you?.rank ?? null,
          total: typeof data.total === "number" ? data.total : null,
        });
      } catch {
        /* the screen still shows the player's own time */
      }
    }, SETTLE_MS);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [email, source, refreshKey]);

  return standing;
}
