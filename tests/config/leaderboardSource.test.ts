import { describe, expect, it } from "vitest";
import { EVENT3_SOURCE } from "@/config/event";

/**
 * The v3 board is kept clear of v1/v2 history purely by the `source` tag on
 * each row. If EVENT3_SOURCE ever collided with another event's tag the boards
 * would silently merge again - no error, just wrong standings on a TV at an
 * event. These assertions make that failure loud instead.
 */
describe("event3 leaderboard source", () => {
  it("is a non-empty tag", () => {
    expect(typeof EVENT3_SOURCE).toBe("string");
    expect(EVENT3_SOURCE.trim()).not.toBe("");
    expect(EVENT3_SOURCE).toBe(EVENT3_SOURCE.trim());
  });

  it("never collides with the v1 or v2 buckets", () => {
    // "event" and "event2" are the literals Funnel.tsx sends for those variants.
    expect(EVENT3_SOURCE).not.toBe("event");
    expect(EVENT3_SOURCE).not.toBe("event2");
  });
});
