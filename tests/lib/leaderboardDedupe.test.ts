import { describe, expect, it } from "vitest";

/**
 * The board shows one row per player, keyed on their email. Booth emails are
 * typed by hand, so the same person can arrive as "Rylee@X.com" and
 * "rylee@x.com" - which put Rylee on the DBS board twice, at ranks 2 and 4.
 *
 * getLeaderboard needs Supabase, so this pins the pure grouping rule it uses.
 * Keep the two in step: the map key there is `email.trim().toLowerCase()`.
 */
function bestPerPlayer(
  rows: { name: string; email: string; time_ms: number }[],
): { name: string; timeMs: number }[] {
  const sorted = [...rows].sort((a, b) => a.time_ms - b.time_ms);
  const best = new Map<string, { name: string; timeMs: number }>();
  for (const r of sorted) {
    const key = (r.email ?? "").trim().toLowerCase();
    if (!best.has(key)) best.set(key, { name: r.name, timeMs: r.time_ms });
  }
  return [...best.values()];
}

describe("leaderboard grouping", () => {
  it("counts one player once across email casing and stray spaces", () => {
    const board = bestPerPlayer([
      { name: "Rylee", email: "Rylee@X.com", time_ms: 30700 },
      { name: "Rylee", email: " rylee@x.com ", time_ms: 31200 },
    ]);
    expect(board).toEqual([{ name: "Rylee", timeMs: 30700 }]);
  });

  it("keeps their best time, not their latest", () => {
    const board = bestPerPlayer([
      { name: "Mun Hoe", email: "mh@x.co", time_ms: 34000 },
      { name: "Mun Hoe", email: "mh@x.co", time_ms: 30400 },
    ]);
    expect(board[0].timeMs).toBe(30400);
  });

  it("never merges two people who share a first name", () => {
    const board = bestPerPlayer([
      { name: "Rylee", email: "rylee.tan@x.co", time_ms: 30700 },
      { name: "Rylee", email: "rylee.lim@x.co", time_ms: 31200 },
    ]);
    expect(board).toHaveLength(2);
  });
});
