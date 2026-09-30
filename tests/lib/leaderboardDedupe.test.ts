import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * The board shows one entry per player, best time first. Which rows count as
 * "the same player" is the whole of this file.
 *
 * It used to be the email, full stop. That broke the moment a route started
 * collecting no address: /onetrickpony asks for a name and a team and nothing
 * else, so every one of its rows carries the same empty email, and a whole bar
 * full of players collapsed into a single entry - one name on the TV all night.
 */
const order = vi.fn();
const eq = vi.fn();
const select = vi.fn(() => ({ order }));
const from = vi.fn(() => ({ select }));

/** The rows the query resolves to, ascending by time as the real one is. */
function resolveWith(rows: { name: string; email: string; time_ms: number }[]) {
  const result = { data: rows, error: null };
  // `query` is awaited directly, and may or may not have .eq() called on it.
  const query = {
    eq: eq.mockReturnValue({ then: (r: (v: unknown) => void) => r(result) }),
    then: (r: (v: unknown) => void) => r(result),
  };
  order.mockReturnValue(query);
}

vi.mock("@/lib/supabase/server", () => ({
  isSupabaseConfigured: () => true,
  getServerSupabase: () => ({ from }),
}));

const { getLeaderboard } = await import("@/lib/supabase/game");

describe("getLeaderboard", () => {
  beforeEach(() => {
    from.mockClear();
    select.mockClear();
    order.mockReset();
    eq.mockReset();
  });

  it("keeps one entry per email, fastest first", async () => {
    resolveWith([
      { name: "Ada", email: "ada@example.com", time_ms: 900 },
      { name: "Bo", email: "bo@example.com", time_ms: 1200 },
      { name: "Ada", email: "ada@example.com", time_ms: 1500 },
    ]);

    const board = await getLeaderboard(10, "dbs-day1");

    expect(board).toEqual([
      { name: "Ada", email: "ada@example.com", timeMs: 900 },
      { name: "Bo", email: "bo@example.com", timeMs: 1200 },
    ]);
  });

  /** The quiz night: no addresses at all, so the name has to separate them. */
  it("separates players by name when no one has an email", async () => {
    resolveWith([
      { name: "Adnan · The Quizzengers", email: "", time_ms: 800 },
      { name: "Priya · Quiz Khalifa", email: "", time_ms: 950 },
      { name: "Sam · The Quizzengers", email: "", time_ms: 1100 },
    ]);

    const board = await getLeaderboard(10, "onetrickpony");

    expect(board.map((e) => e.name)).toEqual([
      "Adnan · The Quizzengers",
      "Priya · Quiz Khalifa",
      "Sam · The Quizzengers",
    ]);
  });

  it("still keeps only a player's best run when they have no email", async () => {
    resolveWith([
      { name: "Adnan · The Quizzengers", email: "", time_ms: 800 },
      { name: "adnan · the quizzengers", email: "", time_ms: 1400 },
    ]);

    const board = await getLeaderboard(10, "onetrickpony");

    expect(board).toHaveLength(1);
    expect(board[0].timeMs).toBe(800);
  });

  /**
   * Two teammates who both enter a bare first name are one player to the
   * board. That is the cost of taking no identifier, and it is why the landing
   * refuses to start without a team - the team is what pulls most names apart.
   */
  it("cannot separate two address-less players with identical names", async () => {
    resolveWith([
      { name: "Sam", email: "", time_ms: 700 },
      { name: "Sam", email: "", time_ms: 1300 },
    ]);

    const board = await getLeaderboard(10, "onetrickpony");

    expect(board).toHaveLength(1);
  });

  it("does not let an address-less row swallow a player who has an email", async () => {
    resolveWith([
      { name: "Ada", email: "", time_ms: 600 },
      { name: "Ada", email: "ada@example.com", time_ms: 900 },
    ]);

    const board = await getLeaderboard(10, "mixed");

    expect(board).toHaveLength(2);
  });
});
