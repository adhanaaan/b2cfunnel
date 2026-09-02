import { describe, expect, it } from "vitest";
import { resolveFlow } from "@/config/funnelFlow";
import type { FunnelStep } from "@/types/funnel";

const kindsIn = (flow: FunnelStep[]) => flow.map((s) => s.kind);

/**
 * Event v6 is event v3 plus the partner consent page. The point of the variant
 * is where that page sits - straight after the landing, before anything is
 * played - so pin the position, and pin that nothing else moved.
 */
describe("event6 flow", () => {
  const v6 = kindsIn(resolveFlow({}, "event6"));
  const v3 = kindsIn(resolveFlow({}, "event3"));

  it("puts the consent page directly after the landing", () => {
    expect(v6.indexOf("consent")).toBe(v6.indexOf("nameGate") + 1);
  });

  it("shows that page exactly once", () => {
    expect(v6.filter((k) => k === "consent")).toHaveLength(1);
  });

  it("changes nothing else about the v3 flow", () => {
    expect(v6.filter((k) => k !== "consent")).toEqual(v3);
  });

  it("keeps the consent page out of every other variant", () => {
    for (const variant of ["full", "event", "woman", "event2", "event3"] as const) {
      expect(kindsIn(resolveFlow({}, variant))).not.toContain("consent");
    }
  });
});
