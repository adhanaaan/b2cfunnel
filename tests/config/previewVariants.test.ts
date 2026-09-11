import { describe, expect, it } from "vitest";
import { PREVIEW_VARIANTS, isPreviewVariant } from "@/config/variants";
import type { QuizVariant } from "@/types/funnel";

/**
 * A preview variant writes nothing: no lead, no score, no newsletter opt-in,
 * no analytics. Two ways that can go wrong, and both are silent, so both are
 * pinned here: a live variant slipping into the list would stop recording real
 * players, and a preview dropping out of it would start recording walk-throughs
 * into the event's data.
 *
 * Membership is all this file can check. That a write path actually consults
 * the list is a separate question, and not one these assertions answer.
 */
describe("preview variants", () => {
  it("covers the walkthrough variants", () => {
    expect(isPreviewVariant("event6")).toBe(true);
    expect(isPreviewVariant("event7")).toBe(true);
  });

  it("never covers a variant that runs at an event", () => {
    const live: QuizVariant[] = [
      "full",
      "event",
      "woman",
      "event2",
      "event3",
      "rotary",
      "ntuhomecoming",
      "ihhsearegatta",
      // /ihh and /mambacares were missing here while both were live - a
      // variant left off this list is a variant this test cannot protect.
      "ihh",
      "phkl",
      "mambacares",
    ];
    for (const variant of live) {
      expect(isPreviewVariant(variant), `${variant} must keep recording`).toBe(
        false,
      );
    }
    expect(PREVIEW_VARIANTS).toEqual(["event6", "event7"]);
  });
});
