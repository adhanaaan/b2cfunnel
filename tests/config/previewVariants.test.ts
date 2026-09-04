import { describe, expect, it } from "vitest";
import { PREVIEW_VARIANTS, isPreviewVariant } from "@/config/variants";
import type { QuizVariant } from "@/types/funnel";

/**
 * A preview variant writes nothing: no lead, no score, no newsletter opt-in,
 * no analytics. Two ways that can go wrong, and both are silent, so both are
 * pinned here: a live variant slipping into the list would stop recording real
 * players, and v6 dropping out of it would start recording preview walk-throughs
 * into the event's data.
 */
describe("preview variants", () => {
  it("covers the v6 walkthrough", () => {
    expect(isPreviewVariant("event6")).toBe(true);
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
    ];
    for (const variant of live) {
      expect(isPreviewVariant(variant), `${variant} must keep recording`).toBe(
        false,
      );
    }
    expect(PREVIEW_VARIANTS).toEqual(["event6"]);
  });
});
