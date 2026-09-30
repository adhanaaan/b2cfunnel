import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * What /api/score will and will not accept.
 *
 * This exists because of a live failure: the route required a valid email on
 * every score, and the quiz-night landing collects none - so every score it
 * sent was rejected with a 400 and nothing reached the board. Silently, because
 * the funnel fires the write and does not wait on the answer, so the player saw
 * their time and assumed it had counted.
 */
const submitScore = vi.fn();

vi.mock("@/lib/supabase/game", () => ({ submitScore }));

const { POST } = await import("../../app/api/score/route");

function post(body: unknown) {
  return POST(
    new Request("http://localhost/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

describe("POST /api/score", () => {
  beforeEach(() => submitScore.mockReset());

  it("stores a score that has no email at all", async () => {
    const res = await post({
      name: "Adnan · The Quizzengers",
      email: "",
      timeMs: 35051,
      source: "onetrickpony",
      team: "The Quizzengers",
    });

    expect(res.status).toBe(200);
    expect(submitScore).toHaveBeenCalledTimes(1);
    const [name, email, timeMs, source] = submitScore.mock.calls[0];
    expect(name).toBe("Adnan · The Quizzengers");
    expect(email).toBe("");
    expect(Math.round(timeMs)).toBe(35051);
    expect(source).toBe("onetrickpony");
  });

  it("stores a score whose email field was never sent", async () => {
    const res = await post({ name: "Ada", timeMs: 1000, source: "onetrickpony" });
    expect(res.status).toBe(200);
    expect(submitScore).toHaveBeenCalledTimes(1);
  });

  /** Optional is not the same as unchecked: a given address must be real. */
  it("still rejects an address that is not one", async () => {
    const res = await post({ name: "Ada", email: "not-an-email", timeMs: 1000 });
    expect(res.status).toBe(400);
    expect(submitScore).not.toHaveBeenCalled();
  });

  it("still stores a real address", async () => {
    const res = await post({
      name: "Ada",
      email: "ada@example.com",
      timeMs: 1000,
      source: "general",
    });
    expect(res.status).toBe(200);
    expect(submitScore.mock.calls[0][1]).toBe("ada@example.com");
  });

  it("rejects a score with no name", async () => {
    const res = await post({ name: "  ", timeMs: 1000 });
    expect(res.status).toBe(400);
    expect(submitScore).not.toHaveBeenCalled();
  });

  it("rejects a time that is not a positive number", async () => {
    for (const timeMs of [0, -5, "fast", undefined]) {
      submitScore.mockReset();
      const res = await post({ name: "Ada", timeMs });
      expect(res.status).toBe(400);
      expect(submitScore).not.toHaveBeenCalled();
    }
  });
});
