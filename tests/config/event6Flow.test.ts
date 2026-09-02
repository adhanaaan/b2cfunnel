import { describe, expect, it } from "vitest";
import { resolveFlow } from "@/config/funnelFlow";
import type { FunnelStep } from "@/types/funnel";

const kindsIn = (flow: FunnelStep[]) => flow.map((s) => s.kind);

/**
 * Event v6 walks the same flow as v3 - it exists to preview the split-tick
 * treatment of the partner consents against the single tick v3 ships, so the
 * steps must stay identical or the two are no longer comparable.
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

  it("walks exactly the v3 flow", () => {
    expect(v6).toEqual(v3);
  });

  it("keeps the consent page out of the variants that have no partner", () => {
    for (const variant of ["full", "event", "woman", "event2"] as const) {
      expect(kindsIn(resolveFlow({}, variant))).not.toContain("consent");
    }
  });
});
