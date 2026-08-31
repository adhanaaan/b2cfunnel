import { describe, expect, it } from "vitest";
import { computeReportRate, MIN_PLAYERS_FOR_RATE } from "@/lib/reportRate";

const players = (n: number) =>
  Array.from({ length: n }, (_, i) => `p${i}@example.com`);

describe("computeReportRate", () => {
  it("counts a person once however often they retry", () => {
    const rate = computeReportRate(
      ["a@x.co", "a@x.co", "a@x.co", "b@x.co"],
      ["a@x.co"],
    );
    expect(rate.players).toBe(2);
    expect(rate.reports).toBe(1);
    expect(rate.rate).toBe(0.5);
  });

  it("matches emails case- and whitespace-insensitively", () => {
    const rate = computeReportRate([" A@x.co ", "b@x.co"], ["a@X.CO"]);
    expect(rate.players).toBe(2);
    expect(rate.reports).toBe(1);
  });

  it("ignores a report from someone who never played here", () => {
    const rate = computeReportRate(["a@x.co"], ["a@x.co", "stranger@x.co"]);
    expect(rate.reports).toBe(1);
    expect(rate.rate).toBe(1);
  });

  it("never divides by zero", () => {
    const rate = computeReportRate([], []);
    expect(rate.players).toBe(0);
    expect(rate.rate).toBe(0);
    expect(rate.meaningful).toBe(false);
  });

  it("shows the rate as soon as somebody has played", () => {
    const none = computeReportRate([], []);
    expect(none.meaningful).toBe(false);

    const enough = computeReportRate(players(MIN_PLAYERS_FOR_RATE), []);
    expect(enough.meaningful).toBe(true);
  });

  it("computes the headline case", () => {
    // 7 of 10 players finished: the stat tile's "70% folks got their report".
    const rate = computeReportRate(players(10), players(7));
    expect(rate.reports).toBe(7);
    expect(Math.round(rate.rate * 100)).toBe(70);
    expect(rate.meaningful).toBe(true);
  });
});
