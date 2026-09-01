import { describe, expect, it } from "vitest";
import {
  DBS_DAY1_SOURCE,
  DBS_DAY2_SOURCE,
  EVENT3_SOURCE,
  SPEEDGAME_SOURCE,
} from "@/config/event";

/**
 * The v3 board is kept clear of other events' history purely by the `source`
 * tag on each row. If EVENT3_SOURCE ever collided with another event's tag the
 * boards would silently merge again - no error, just wrong standings on a TV at
 * an event. These assertions make that failure loud instead.
 */
describe("event3 leaderboard source", () => {
  it("is a non-empty tag", () => {
    expect(typeof EVENT3_SOURCE).toBe("string");
    expect(EVENT3_SOURCE.trim()).not.toBe("");
    expect(EVENT3_SOURCE).toBe(EVENT3_SOURCE.trim());
  });

  it("never collides with the v1, v2 or pre-DBS v3 buckets", () => {
    // "event" and "event2" are the literals Funnel.tsx sends for those
    // variants; "event3" is the bucket the v3 board used before DBS.
    expect(EVENT3_SOURCE).not.toBe("event");
    expect(EVENT3_SOURCE).not.toBe("event2");
    expect(EVENT3_SOURCE).not.toBe("event3");
  });

  it("keeps the two DBS days in separate buckets", () => {
    expect(DBS_DAY1_SOURCE).not.toBe(DBS_DAY2_SOURCE);
    expect([DBS_DAY1_SOURCE, DBS_DAY2_SOURCE]).toContain(EVENT3_SOURCE);
  });
});

/**
 * /speedgame is an independent duplicate of the v3 event, kept clear of it
 * (and every other event) purely by its own `source` tag. Same reasoning as
 * above: a collision would silently merge boards, so make it loud instead.
 */
describe("speedgame leaderboard source", () => {
  it("is a non-empty tag", () => {
    expect(typeof SPEEDGAME_SOURCE).toBe("string");
    expect(SPEEDGAME_SOURCE.trim()).not.toBe("");
    expect(SPEEDGAME_SOURCE).toBe(SPEEDGAME_SOURCE.trim());
  });

  it("never collides with the v1, v2, v3 or DBS buckets", () => {
    expect(SPEEDGAME_SOURCE).not.toBe("event");
    expect(SPEEDGAME_SOURCE).not.toBe("event2");
    expect(SPEEDGAME_SOURCE).not.toBe("event3");
    expect(SPEEDGAME_SOURCE).not.toBe(EVENT3_SOURCE);
    expect(SPEEDGAME_SOURCE).not.toBe(DBS_DAY1_SOURCE);
    expect(SPEEDGAME_SOURCE).not.toBe(DBS_DAY2_SOURCE);
  });
});
