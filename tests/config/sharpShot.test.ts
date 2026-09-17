import { describe, expect, it } from "vitest";
import {
  SHARP_SHOT_POSTER,
  SHARP_SHOT_THRESHOLD_LABEL,
  SHARP_SHOT_THRESHOLD_MS,
  SHARP_SHOT_VENUE,
  isSharpShot,
} from "@/config/twentyTwoGrams";
import { formatSeconds, formatStamp } from "@/lib/format";
import { createInitialState, funnelReducer } from "@/state/funnelMachine";

/**
 * Sharp Shot Week (/22grams) hands a free drink to anyone who beats the clock,
 * and the poster IS the voucher. Two ways that goes wrong, both of them a
 * barista holding a screenshot nobody can honour:
 *
 *  - the funnel and the poster disagreeing on what "beating the clock" means,
 *  - the poster promising a threshold the funnel did not actually apply.
 *
 * So the threshold is one number, every label is written from it, and the
 * predicate is the only thing allowed to answer the question.
 */
describe("sharp shot threshold", () => {
  it("is 30 seconds", () => {
    expect(SHARP_SHOT_THRESHOLD_MS).toBe(30_000);
  });

  it("awards a run that beats the clock, and only that", () => {
    expect(isSharpShot(SHARP_SHOT_THRESHOLD_MS - 1)).toBe(true);
    expect(isSharpShot(28_500)).toBe(true);
    expect(isSharpShot(1)).toBe(true);

    // Matching the clock is not beating it.
    expect(isSharpShot(SHARP_SHOT_THRESHOLD_MS)).toBe(false);
    expect(isSharpShot(SHARP_SHOT_THRESHOLD_MS + 1)).toBe(false);
    expect(isSharpShot(45_000)).toBe(false);
  });

  it("never awards a run that is not a run", () => {
    expect(isSharpShot(undefined)).toBe(false);
    expect(isSharpShot(0)).toBe(false);
    expect(isSharpShot(-1)).toBe(false);
    expect(isSharpShot(Number.NaN)).toBe(false);
    expect(isSharpShot(Number.POSITIVE_INFINITY)).toBe(false);
  });

  // The label is printed on the poster; the number decides who gets a drink.
  // If they could drift, the poster would advertise the wrong offer.
  it("prints the label the threshold actually is", () => {
    expect(SHARP_SHOT_THRESHOLD_LABEL).toBe("< 30 s");
    // The headline's second line IS the label, not a copy of it.
    expect(SHARP_SHOT_POSTER.headingThreshold).toBe(SHARP_SHOT_THRESHOLD_LABEL);
    const seconds = String(SHARP_SHOT_THRESHOLD_MS / 1000);
    expect(SHARP_SHOT_THRESHOLD_LABEL).toContain(seconds);
  });

  it("names the venue the drink is redeemed at", () => {
    expect(SHARP_SHOT_VENUE).toBe("22 Grams Coffee Frasers Tower");
    // The line that names it is written from the constant, not beside it.
    expect(SHARP_SHOT_POSTER.reward.drink).toContain(SHARP_SHOT_VENUE);
  });

  // The design (925:9236) drops the "while redemptions last" line and closes
  // on the UK Biobank claim instead of the Lancet figure. Asserted so the two
  // cannot quietly come back through a merge.
  it("closes on the claim the campaign is built on", () => {
    expect(SHARP_SHOT_POSTER.footnote).toContain("UK Biobank");
    expect(JSON.stringify(SHARP_SHOT_POSTER)).not.toContain("redemptions");
  });

  it("tells the reader the whole poster is the close", () => {
    expect(SHARP_SHOT_POSTER.dismiss.toLowerCase()).toContain("tap anywhere");
  });
});

/**
 * The three details staff read off the screenshot. Each is printed by a
 * formatter, and each formatter has one shape a person can check at a glance.
 */
describe("what the poster prints", () => {
  it("states the time in plain seconds, to one decimal", () => {
    expect(formatSeconds(28_500)).toBe("28.5");
    expect(formatSeconds(9_040)).toBe("9.0");
    expect(formatSeconds(29_990)).toBe("30.0"); // rounds as displayed
  });

  it("stamps the moment as YYYY-MM-DD HH:mm:ss, in local time", () => {
    // Built from local parts, so this is the wall clock wherever it runs.
    const at = new Date(2026, 8, 21, 12, 35, 0);
    expect(formatStamp(at)).toBe("2026-09-21 12:35:00");
    expect(formatStamp(new Date(2026, 0, 5, 9, 7, 3))).toBe(
      "2026-01-05 09:07:03",
    );
  });
});

/**
 * The stamp has to be the run's own moment, not the render's - a poster
 * reopened an hour later must still read when the run happened. That means it
 * rides in the funnel's state, arrives with the finish, and leaves with it.
 */
describe("the finish timestamp in funnel state", () => {
  const AT = Date.UTC(2026, 8, 21, 4, 35, 0);

  const atGame = () =>
    funnelReducer(createInitialState("22grams"), {
      type: "SKIP_TO_KIND",
      kind: "game",
    });

  it("records when the run finished, alongside the time", () => {
    const done = funnelReducer(atGame(), {
      type: "GAME_DONE",
      timeMs: 28_500,
      at: AT,
    });
    expect(done.gameTimeMs).toBe(28_500);
    expect(done.gameFinishedAt).toBe(AT);
  });

  // The reducer must stay pure: the same action twice gives the same state,
  // which it cannot if the timestamp is read off the clock inside it.
  it("takes the moment from the action, never from the clock", () => {
    const game = atGame();
    const a = funnelReducer(game, { type: "GAME_DONE", timeMs: 28_500, at: AT });
    const b = funnelReducer(game, { type: "GAME_DONE", timeMs: 28_500, at: AT });
    expect(a).toEqual(b);
  });

  it("clears the stamp with the time it belongs to on a retake", () => {
    const done = funnelReducer(atGame(), {
      type: "GAME_DONE",
      timeMs: 28_500,
      at: AT,
    });
    const replaying = funnelReducer(done, { type: "RETAKE_GAME" });
    expect(replaying.gameTimeMs).toBeUndefined();
    expect(replaying.gameFinishedAt).toBeUndefined();

    // A second run stamps itself, rather than inheriting the first's moment.
    const again = funnelReducer(replaying, {
      type: "GAME_DONE",
      timeMs: 26_000,
      at: AT + 90_000,
    });
    expect(again.gameFinishedAt).toBe(AT + 90_000);
  });
});
