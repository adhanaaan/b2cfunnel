import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * The score row is where the partner (IHH) consent from the consent page lands
 * for a player who never finishes the questionnaire - so it has to be written
 * with the score, and it has to survive a database that does not have the
 * column yet (the migration can land after the deploy).
 */
const insert = vi.fn();
const from = vi.fn(() => ({ insert }));

vi.mock("@/lib/supabase/server", () => ({
  isSupabaseConfigured: () => true,
  getServerSupabase: () => ({ from }),
}));

const { submitScore } = await import("@/lib/supabase/game");

describe("submitScore", () => {
  beforeEach(() => {
    insert.mockReset();
    from.mockClear();
    insert.mockResolvedValue({ error: null });
  });

  it("writes both consents alongside the score", async () => {
    await submitScore("Ada", "ada@example.com", 12345.6, "dbs-day1", true, true);

    expect(from).toHaveBeenCalledWith("game_scores");
    expect(insert).toHaveBeenCalledWith({
      name: "Ada",
      email: "ada@example.com",
      time_ms: 12346,
      source: "dbs-day1",
      tips_consent: true,
      partner_consent: true,
      age_band: null,
      team: null,
    });
  });

  // /phkl asks the age band before the game and writes it with the score.
  it("writes the age band when the funnel asked for it", async () => {
    await submitScore("Ada", "ada@example.com", 9000, "phkl", false, true, "40-49");

    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({ source: "phkl", age_band: "40-49" }),
    );
  });

  it("still records the score when age_band is not in the database yet", async () => {
    insert
      .mockResolvedValueOnce({
        error: {
          message: "Could not find the 'age_band' column of 'game_scores'",
        },
      })
      .mockResolvedValueOnce({ error: null });

    await submitScore("Ada", "ada@example.com", 9000, "phkl", false, true, "40-49");

    expect(insert).toHaveBeenCalledTimes(2);
    const retry = insert.mock.calls[1][0] as Record<string, unknown>;
    expect(retry).not.toHaveProperty("age_band");
    expect(retry).toMatchObject({ time_ms: 9000, partner_consent: true });
  });

  it("records a declined partner consent as false, not null", async () => {
    await submitScore("Ada", "ada@example.com", 9000, "dbs-day1", false, false);

    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({ partner_consent: false }),
    );
  });

  it("stores null when the funnel never asked", async () => {
    await submitScore("Ada", "ada@example.com", 9000, "event2");

    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({ tips_consent: null, partner_consent: null }),
    );
  });

  it("still records the score when partner_consent is not in the database yet", async () => {
    insert
      .mockResolvedValueOnce({
        error: {
          message:
            "Could not find the 'partner_consent' column of 'game_scores'",
        },
      })
      .mockResolvedValueOnce({ error: null });

    await submitScore("Ada", "ada@example.com", 9000, "dbs-day1", true, true);

    // The score and the consent we CAN store both survive; only the column the
    // database named is dropped.
    expect(insert).toHaveBeenCalledTimes(2);
    expect(insert).toHaveBeenLastCalledWith({
      name: "Ada",
      email: "ada@example.com",
      time_ms: 9000,
      source: "dbs-day1",
      tips_consent: true,
      age_band: null,
      team: null,
    });
  });

  /**
   * The quiz-night round is scored BY TEAM, so a row with no team is a row
   * that cannot be scored. `team` is an optional column, and an optional
   * column on a database that has not had its migration run is dropped
   * silently - so the team is also folded into the name, which is the copy
   * that cannot be lost, and is what the board prints anyway.
   */
  it("writes the team to its column and into the name", async () => {
    await submitScore(
      "Adnan",
      "adnan@example.com",
      35051.7,
      "onetrickpony",
      null,
      null,
      null,
      "  The Quizzengers  ",
    );

    expect(insert).toHaveBeenCalledWith({
      name: "Adnan · The Quizzengers",
      email: "adnan@example.com",
      time_ms: 35052,
      source: "onetrickpony",
      tips_consent: null,
      partner_consent: null,
      age_band: null,
      team: "The Quizzengers",
    });
  });

  it("leaves the name alone when no team was asked for", async () => {
    await submitScore("Ada", "ada@example.com", 1000, "general");
    const row = insert.mock.calls[0][0] as { name: string; team: unknown };
    expect(row.name).toBe("Ada");
    expect(row.team).toBeNull();
  });

  /**
   * The point of the fallback: on a database with no `team` column the insert
   * is retried without it, and the team still reaches the row inside the name.
   */
  it("keeps the team in the name when the column does not exist", async () => {
    insert
      .mockResolvedValueOnce({ error: { code: "42703", message: 'column "team" does not exist' } })
      .mockResolvedValueOnce({ error: null });

    await submitScore("Adnan", "a@example.com", 1000, "onetrickpony", null, null, null, "Quizzengers");

    const retried = insert.mock.calls.at(-1)?.[0] as { name: string; team?: unknown };
    expect(retried.team).toBeUndefined();
    expect(retried.name).toBe("Adnan · Quizzengers");
  });
});
