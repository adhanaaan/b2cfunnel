import { describe, expect, it } from "vitest";
import {
  DBS_DAY1_SOURCE,
  DBS_DAY2_SOURCE,
  EVENT3_SOURCE,
  GENERAL_SOURCE,
  IHH_SOURCE,
  IHHSEA_SOURCE,
  MAMBACARES_SOURCE,
  NTU_HOMECOMING_SOURCE,
  PHKL_SOURCE,
  ROTARY_SOURCE,
  SILOAM_SOURCE,
  TWENTY_TWO_GRAMS_SOURCE,
  URBANMILERS_SOURCE,
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
      PHKL_SOURCE,
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
      PHKL_SOURCE,
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

/**
 * The Pantai Hospital KL board is scoped the same way, and `phkl` is the
 * literal the database's `source` column carries for this event.
 */
describe("phkl leaderboard source", () => {
  it("is the tag the database column expects", () => {
    expect(PHKL_SOURCE).toBe("phkl");
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
      IHHSEA_SOURCE,
    ]) {
      expect(PHKL_SOURCE).not.toBe(other);
    }
  });

  // A score and the report that follows it must carry the SAME tag, or the
  // board's completion rate divides one event's reports by another's players.
  it("tags both the score and the lead from the phkl funnel", () => {
    expect(eventSource("phkl")).toBe(PHKL_SOURCE);
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
      "ihhsearegatta",
    ];
    for (const variant of others) {
      expect(eventSource(variant)).not.toBe(PHKL_SOURCE);
    }
  });
});

/**
 * /ihh runs the regatta's arc, so the ONLY thing separating the two events'
 * rows is this tag - which makes a collision here the whole failure the route
 * exists to avoid: one bucket, two events, and standings nobody can unpick
 * afterwards. Pinned to the literal the database's `source` column carries.
 */
describe("ihh leaderboard source", () => {
  it("is the tag the database column expects", () => {
    expect(IHH_SOURCE).toBe("ihh");
  });

  it("never collides with another event's bucket, the regatta's above all", () => {
    for (const other of [
      "event",
      "event2",
      "event3",
      EVENT3_SOURCE,
      DBS_DAY1_SOURCE,
      DBS_DAY2_SOURCE,
      ROTARY_SOURCE,
      NTU_HOMECOMING_SOURCE,
      IHHSEA_SOURCE,
      PHKL_SOURCE,
    ]) {
      expect(IHH_SOURCE).not.toBe(other);
    }
  });

  // A score and the report that follows it must carry the SAME tag, or the
  // board's completion rate divides one event's reports by another's players.
  it("tags both the score and the lead from the /ihh funnel", () => {
    expect(eventSource("ihh")).toBe(IHH_SOURCE);
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
      "ihhsearegatta",
      "phkl",
    ];
    for (const variant of others) {
      expect(eventSource(variant)).not.toBe(IHH_SOURCE);
    }
  });
});

/**
 * The #MambaCares board is scoped the same way, and `mambacares` is the
 * literal the database's `source` column carries for this event. The board at
 * /mambacares/leaderboard reads this bucket, and the rank on the report reads
 * it too - so a collision here would put another event's times on both.
 */
describe("mambacares leaderboard source", () => {
  it("is the tag the database column expects", () => {
    expect(MAMBACARES_SOURCE).toBe("mambacares");
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
      IHHSEA_SOURCE,
      IHH_SOURCE,
      PHKL_SOURCE,
      URBANMILERS_SOURCE,
      SILOAM_SOURCE,
    ]) {
      expect(MAMBACARES_SOURCE).not.toBe(other);
    }
  });

  // A score and the report that follows it must carry the SAME tag, or the
  // board's completion rate divides one event's reports by another's players.
  it("tags both the score and the lead from the /mambacares funnel", () => {
    expect(eventSource("mambacares")).toBe(MAMBACARES_SOURCE);
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
      "ihhsearegatta",
      "ihh",
      "phkl",
      "urbanmilers",
      "siloam",
    ];
    for (const variant of others) {
      expect(eventSource(variant)).not.toBe(MAMBACARES_SOURCE);
    }
  });
});

/**
 * The Urban Milers board is scoped the same way, and `urbanmilers` is the
 * literal the database's `source` column carries for this run.
 *
 * This bucket is also what makes the new board start EMPTY: /urbanmilers and
 * /mambacares run the same arc, and only this tag keeps one run's times off the
 * other's TV. A collision would merge two live boards with no error at all.
 */
describe("urbanmilers leaderboard source", () => {
  it("is the tag the database column expects", () => {
    expect(URBANMILERS_SOURCE).toBe("urbanmilers");
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
      IHHSEA_SOURCE,
      IHH_SOURCE,
      PHKL_SOURCE,
      MAMBACARES_SOURCE,
      SILOAM_SOURCE,
    ]) {
      expect(URBANMILERS_SOURCE).not.toBe(other);
    }
  });

  // A score and the report that follows it must carry the SAME tag, or the
  // board's completion rate divides one event's reports by another's players.
  it("tags both the score and the lead from the /urbanmilers funnel", () => {
    expect(eventSource("urbanmilers")).toBe(URBANMILERS_SOURCE);
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
      "ihhsearegatta",
      "ihh",
      "phkl",
      "mambacares",
      "siloam",
    ];
    for (const variant of others) {
      expect(eventSource(variant)).not.toBe(URBANMILERS_SOURCE);
    }
  });
});

/**
 * The 22 Grams board is scoped the same way, and `22grams` is the literal the
 * database's `source` column carries for this event.
 *
 * This bucket is also what makes the new board start EMPTY: /22grams and
 * /ntuhomecoming run the same arc, and only this tag keeps one event's times
 * off the other's TV. A collision would merge two live boards with no error at
 * all.
 */
describe("22grams leaderboard source", () => {
  it("is the tag the database column expects", () => {
    expect(TWENTY_TWO_GRAMS_SOURCE).toBe("22grams");
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
      IHHSEA_SOURCE,
      IHH_SOURCE,
      PHKL_SOURCE,
      MAMBACARES_SOURCE,
      URBANMILERS_SOURCE,
      SILOAM_SOURCE,
      GENERAL_SOURCE,
    ]) {
      expect(TWENTY_TWO_GRAMS_SOURCE).not.toBe(other);
    }
  });

  // A score and the report that follows it must carry the SAME tag, or the
  // board's completion rate divides one event's reports by another's players.
  it("tags both the score and the lead from the /22grams funnel", () => {
    expect(eventSource("22grams")).toBe(TWENTY_TWO_GRAMS_SOURCE);
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
      "ihhsearegatta",
      "ihh",
      "phkl",
      "mambacares",
      "urbanmilers",
      "siloam",
      "general",
    ];
    for (const variant of others) {
      expect(eventSource(variant)).not.toBe(TWENTY_TWO_GRAMS_SOURCE);
    }
  });
});


/**
 * /general is scoped the same way, and `general` is the literal the database's
 * `source` column carries for it.
 *
 * This bucket is also what makes its board start EMPTY: /general runs the
 * Siloam summit's arc, and only this tag keeps a summit in Jakarta off a screen
 * running this route. A collision would merge two live boards with no error at
 * all.
 */
describe("general leaderboard source", () => {
  it("is the tag the database column expects", () => {
    expect(GENERAL_SOURCE).toBe("general");
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
      IHHSEA_SOURCE,
      IHH_SOURCE,
      PHKL_SOURCE,
      MAMBACARES_SOURCE,
      URBANMILERS_SOURCE,
      SILOAM_SOURCE,
      TWENTY_TWO_GRAMS_SOURCE,
    ]) {
      expect(GENERAL_SOURCE).not.toBe(other);
    }
  });

  // A score and the report that follows it must carry the SAME tag, or the
  // board's completion rate divides one event's reports by another's players.
  it("tags both the score and the lead from the /general funnel", () => {
    expect(eventSource("general")).toBe(GENERAL_SOURCE);
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
      "ihhsearegatta",
      "ihh",
      "phkl",
      "mambacares",
      "urbanmilers",
      "siloam",
      "22grams",
    ];
    for (const variant of others) {
      expect(eventSource(variant)).not.toBe(GENERAL_SOURCE);
    }
  });
});
