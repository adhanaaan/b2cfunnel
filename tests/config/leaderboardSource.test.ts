import { describe, expect, it } from "vitest";
import {
  DBS_DAY1_SOURCE,
  DBS_DAY2_SOURCE,
  EVENT3_SOURCE,
  IHHSEA_SOURCE,
  NTU_HOMECOMING_SOURCE,
  ROTARY_SOURCE,
  eventSource,
} from "@/config/event";
import type { QuizVariant } from "@/types/funnel";

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
 * The Rotary board is scoped the same way, and shares the table with every
 * other event - so the same failure is possible, and just as silent.
 */
describe("rotary leaderboard source", () => {
  it("is the tag the database column expects", () => {
    expect(ROTARY_SOURCE).toBe("rotaryklwam");
  });

  it("never collides with another event's bucket", () => {
    for (const other of [
      "event",
      "event2",
      "event3",
      EVENT3_SOURCE,
      DBS_DAY1_SOURCE,
      DBS_DAY2_SOURCE,
      NTU_HOMECOMING_SOURCE,
    ]) {
      expect(ROTARY_SOURCE).not.toBe(other);
    }
  });

  // A score and the report that follows it must carry the SAME tag, or the
  // board's completion rate divides one event's reports by another's players.
  it("tags both the score and the lead from the rotary funnel", () => {
    expect(eventSource("rotary")).toBe(ROTARY_SOURCE);
  });

  it("leaves every other variant's tag alone", () => {
    const others: QuizVariant[] = ["full", "woman", "event", "event2", "event3"];
    for (const variant of others) {
      expect(eventSource(variant)).not.toBe(ROTARY_SOURCE);
    }
  });
});

/**
 * The regatta board is scoped the same way again, and its tag is also the
 * value the database's `source` column carries for this event - so it is
 * pinned to the literal, not just to "something non-empty".
 */
describe("ihhsearegatta leaderboard source", () => {
  it("is the tag the database column expects", () => {
    expect(IHHSEA_SOURCE).toBe("ihhsearegatta");
  });

  it("never collides with another event's bucket", () => {
    for (const other of [
      "event",
      "event2",
      "event3",
      EVENT3_SOURCE,
      DBS_DAY1_SOURCE,
      DBS_DAY2_SOURCE,
      ROTARY_SOURCE,
      NTU_HOMECOMING_SOURCE,
    ]) {
      expect(IHHSEA_SOURCE).not.toBe(other);
    }
  });

  // A score and the report that follows it must carry the SAME tag, or the
  // board's completion rate divides one event's reports by another's players.
  it("tags both the score and the lead from the regatta funnel", () => {
    expect(eventSource("ihhsearegatta")).toBe(IHHSEA_SOURCE);
  });

  it("leaves every other variant's tag alone", () => {
    const others: QuizVariant[] = [
      "full",
      "woman",
      "event",
      "event2",
      "event3",
      "rotary",
      "ntuhomecoming",
    ];
    for (const variant of others) {
      expect(eventSource(variant)).not.toBe(IHHSEA_SOURCE);
    }
  });
});

/**
 * The NTU Homecoming board is scoped the same way again, and `ntuhomecoming`
 * is the value the database's `source` column carries for this event - so it
 * is pinned to the literal, not just to "something non-empty". Changing it
 * strands every row already written under it.
 */
describe("ntuhomecoming leaderboard source", () => {
  it("is the tag the database column expects", () => {
    expect(NTU_HOMECOMING_SOURCE).toBe("ntuhomecoming");
  });

  it("never collides with another event's bucket", () => {
    for (const other of [
      "event",
      "event2",
      "event3",
      EVENT3_SOURCE,
      DBS_DAY1_SOURCE,
      DBS_DAY2_SOURCE,
      ROTARY_SOURCE,
      IHHSEA_SOURCE,
    ]) {
      expect(NTU_HOMECOMING_SOURCE).not.toBe(other);
    }
  });

  // A score and the report that follows it must carry the SAME tag, or the
  // board's completion rate divides one event's reports by another's players.
  it("tags both the score and the lead from the NTU funnel", () => {
    expect(eventSource("ntuhomecoming")).toBe(NTU_HOMECOMING_SOURCE);
  });

  it("leaves every other variant's tag alone", () => {
    const others: QuizVariant[] = [
      "full",
      "woman",
      "event",
      "event2",
      "event3",
      "rotary",
      "ihhsearegatta",
    ];
    for (const variant of others) {
      expect(eventSource(variant)).not.toBe(NTU_HOMECOMING_SOURCE);
    }
  });
});
