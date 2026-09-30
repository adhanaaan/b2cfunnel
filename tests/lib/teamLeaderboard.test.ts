import { beforeEach, describe, expect, it, vi } from "vitest";
import { splitBoardName, teamKey } from "@/lib/boardName";

/**
 * The team board for the quiz night: eight teams, ranked on what their players
 * did on the individual board.
 *
 * The thing under test that matters most is where the team comes FROM. It is
 * read back out of the stored name, not out of the `team` column, because that
 * column is optional and a database without the migration drops it in silence -
 * on the night it may hold nothing at all.
 */
const order = vi.fn();
const eq = vi.fn();
const select = vi.fn(() => ({ order }));
const from = vi.fn(() => ({ select }));

function resolveWith(rows: { name: string; email: string; time_ms: number }[]) {
  const result = { data: rows, error: null };
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

const { getTeamLeaderboard } = await import("@/lib/supabase/game");

describe("splitBoardName", () => {
  it("pulls the team back out of a stored name", () => {
    expect(splitBoardName("Adnan · The Quizzengers")).toEqual({
      player: "Adnan",
      team: "The Quizzengers",
    });
  });

  it("leaves a name with no team alone", () => {
    expect(splitBoardName("Ada")).toEqual({ player: "Ada", team: null });
  });

  /** Splitting on the last separator keeps a separator in the player's name. */
  it("keeps a separator that belongs to the player", () => {
    expect(splitBoardName("Jean · Luc · Team Picard")).toEqual({
      player: "Jean · Luc",
      team: "Team Picard",
    });
  });

  it("treats a dangling separator as part of the name", () => {
    expect(splitBoardName("Ada · ").team).toBeNull();
  });
});

describe("teamKey", () => {
  it("matches teams typed with different caps and spacing", () => {
    expect(teamKey("The  Quizzengers")).toBe(teamKey("the quizzengers"));
  });
});

describe("getTeamLeaderboard", () => {
  beforeEach(() => {
    from.mockClear();
    select.mockClear();
    order.mockReset();
    eq.mockReset();
  });

  it("ranks teams on their fastest player by default", async () => {
    resolveWith([
      { name: "Priya · Quiz Khalifa", email: "", time_ms: 700 },
      { name: "Adnan · The Quizzengers", email: "", time_ms: 800 },
      { name: "Sam · The Quizzengers", email: "", time_ms: 900 },
      { name: "Rai · Quiz Khalifa", email: "", time_ms: 2000 },
    ]);

    const teams = await getTeamLeaderboard("onetrickpony");

    expect(teams.map((t) => t.team)).toEqual([
      "Quiz Khalifa",
      "The Quizzengers",
    ]);
    expect(teams[0].bestMs).toBe(700);
    expect(teams[0].bestPlayer).toBe("Priya");
  });

  /**
   * The whole argument for ranking on the best run: Quiz Khalifa got a fourth
   * person to scan and they were slow. On the average that DEMOTES them, which
   * would tell the slower half of the room to stay off the game.
   */
  it("ranks the other way round on the average", async () => {
    resolveWith([
      { name: "Priya · Quiz Khalifa", email: "", time_ms: 700 },
      { name: "Adnan · The Quizzengers", email: "", time_ms: 800 },
      { name: "Sam · The Quizzengers", email: "", time_ms: 900 },
      { name: "Rai · Quiz Khalifa", email: "", time_ms: 2000 },
    ]);

    const teams = await getTeamLeaderboard("onetrickpony", "average");

    expect(teams.map((t) => t.team)).toEqual([
      "The Quizzengers",
      "Quiz Khalifa",
    ]);
  });

  it("counts a team's players and averages their best runs", async () => {
    resolveWith([
      { name: "Adnan · The Quizzengers", email: "", time_ms: 800 },
      { name: "Sam · The Quizzengers", email: "", time_ms: 1200 },
    ]);

    const [team] = await getTeamLeaderboard("onetrickpony");

    expect(team.players).toBe(2);
    expect(team.averageMs).toBe(1000);
  });

  it("folds together a team typed with different caps and spacing", async () => {
    resolveWith([
      { name: "Adnan · The Quizzengers", email: "", time_ms: 800 },
      { name: "Sam · the  quizzengers", email: "", time_ms: 900 },
    ]);

    const teams = await getTeamLeaderboard("onetrickpony");

    expect(teams).toHaveLength(1);
    expect(teams[0].players).toBe(2);
    // The spelling shown is the one on the team's best run.
    expect(teams[0].team).toBe("The Quizzengers");
  });

  /** A player counts once, at their best, so a team cannot grind up the board. */
  it("does not let one player's repeat runs inflate a team", async () => {
    resolveWith([
      { name: "Adnan · The Quizzengers", email: "", time_ms: 800 },
      { name: "Adnan · The Quizzengers", email: "", time_ms: 1000 },
      { name: "Adnan · The Quizzengers", email: "", time_ms: 1400 },
    ]);

    const [team] = await getTeamLeaderboard("onetrickpony");

    expect(team.players).toBe(1);
    expect(team.bestMs).toBe(800);
    expect(team.averageMs).toBe(800);
  });

  it("leaves a score with no team off the team board entirely", async () => {
    resolveWith([
      { name: "Lone Wolf", email: "", time_ms: 500 },
      { name: "Adnan · The Quizzengers", email: "", time_ms: 800 },
    ]);

    const teams = await getTeamLeaderboard("onetrickpony");

    expect(teams.map((t) => t.team)).toEqual(["The Quizzengers"]);
  });

  it("is empty before anyone has played", async () => {
    resolveWith([]);
    expect(await getTeamLeaderboard("onetrickpony")).toEqual([]);
  });
});
