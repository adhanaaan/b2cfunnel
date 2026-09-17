import { describe, expect, it, vi } from "vitest";
import type { FunnelStep, QuizVariant } from "@/types/funnel";
import type { Answers } from "@/types/question";
import { COPY } from "@/config/copy";
import { playUrlFor } from "@/config/eventLinks";
import { offersLanguageChoice, usesDaylightScreens } from "@/config/variants";

/**
 * 22 Grams (/22grams) is /ntuhomecoming under a different name and a different
 * bucket - which is to say the v3 arc with no partner in the event, the same
 * arc /rotaryklwam ships.
 *
 * The v3 challenge switch is pinned OPEN here so the arcs are compared like
 * for like; that closing v3 leaves this event alone whichever way the live
 * switch is set is asserted separately, against the real config, below.
 */
vi.mock("@/config/event", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/config/event")>()),
  EVENT3_CHALLENGE_CLOSED: false,
}));

const { resolveFlow, achievableAxisMax } = await import("@/config/funnelFlow");

const idsIn = (flow: FunnelStep[]): string[] =>
  flow.flatMap((s) =>
    s.kind === "question"
      ? [s.questionId]
      : s.kind === "questionGroup"
        ? s.questionIds
        : [],
  );

const kindsIn = (flow: FunnelStep[]) => flow.map((s) => s.kind);

const ANSWER_SETS: Answers[] = [
  {},
  { forgetfulness: "notNotice" },
  { forgetfulness: "almostDaily", sex: "female" },
];

describe("22grams flow", () => {
  it("asks exactly the event2/event3 questions", () => {
    for (const answers of ANSWER_SETS) {
      expect(idsIn(resolveFlow(answers, "22grams"))).toEqual(
        idsIn(resolveFlow(answers, "event2")),
      );
    }
  });

  // No partner in this event, so nothing to consent to: the landing leads
  // straight into the instructions and their demo round.
  it("goes from the landing to the instructions with no consent page", () => {
    const steps = kindsIn(resolveFlow({}, "22grams"));
    expect(steps).not.toContain("consent");
    expect(steps.indexOf("instructions")).toBe(steps.indexOf("nameGate") + 1);
  });

  // The point of the route: it is /ntuhomecoming on a bucket of its own, so
  // the two arcs must not drift apart.
  it("walks the same steps as ntuhomecoming", () => {
    for (const answers of ANSWER_SETS) {
      expect(kindsIn(resolveFlow(answers, "22grams"))).toEqual(
        kindsIn(resolveFlow(answers, "ntuhomecoming")),
      );
    }
  });

  it("never ends on the wrap screen", () => {
    expect(kindsIn(resolveFlow({}, "22grams"))).not.toContain("wrap");
  });
});

/**
 * The two things that would be silent if they broke: closing the DBS challenge
 * reaching across into this event, and the question set drifting off event2's
 * (which is what keeps a 22 Grams score comparable with every score already
 * recorded). Both asserted against the REAL config, not the mock above.
 */
describe("22grams against the live config", () => {
  it("is untouched by the v3 challenge switch", async () => {
    vi.doUnmock("@/config/event");
    vi.resetModules();
    const live = await import("@/config/funnelFlow");
    const { EVENT3_CHALLENGE_CLOSED } = await import("@/config/event");

    // Proof the unmock took, whichever way the live switch is set.
    expect(live.resolveFlow({}, "event3").some((s) => s.kind === "wrap")).toBe(
      EVENT3_CHALLENGE_CLOSED,
    );

    expect(kindsIn(live.resolveFlow({}, "22grams"))).toEqual(
      kindsIn(resolveFlow({}, "22grams")),
    );
    expect(live.resolveFlow({}, "22grams").some((s) => s.kind === "wrap")).toBe(
      false,
    );

    for (const axis of ["risk", "symptom"] as const) {
      expect(live.achievableAxisMax("22grams", axis)).toBe(
        live.achievableAxisMax("event2", axis),
      );
      expect(achievableAxisMax("22grams", axis)).toBeGreaterThan(0);
    }
  });
});

/**
 * The board's QR and the share card a player sends their friends both read
 * playUrlFor, which falls back to the v3 route for any variant missing from
 * EVENT_PATHS - so a missing entry would quietly send 22 Grams players to the
 * DBS link, or worse, to NTU Homecoming's board's bucket.
 */
describe("22grams play URL", () => {
  it("points at /22grams", () => {
    expect(playUrlFor("22grams")).toMatch(/\/22grams$/);
    expect(playUrlFor("22grams")).not.toBe(playUrlFor("event3"));
    expect(playUrlFor("22grams")).not.toBe(playUrlFor("ntuhomecoming"));
  });
});

/**
 * The landing. /22grams walks the daylight screens, and its wording is a block
 * of its own so this event's copy can be changed without touching NTU
 * Homecoming's - which is only worth having if the two are actually separate
 * objects. It ships in English, like every event but the Siloam summit.
 */
describe("22grams landing", () => {
  it("walks the daylight screens", () => {
    expect(usesDaylightScreens("22grams")).toBe(true);
  });

  it("has a copy block of its own, word for word NTU Homecoming's", () => {
    const own = COPY.screens["22grams"];
    const ntu = COPY.screens.ntuhomecoming;
    expect(own).not.toBe(ntu);
    expect(own.splash).toEqual(ntu.splash);
  });

  it("never offers the language picker", () => {
    expect(offersLanguageChoice("22grams")).toBe(false);
  });
});

/**
 * A new variant that nothing routes to is a route that silently serves the
 * wrong flow. These are the two lookups keyed on the literal.
 */
describe("22grams is wired to its own literal", () => {
  it("resolves a flow and a path under the variant name", () => {
    const variant: QuizVariant = "22grams";
    expect(resolveFlow({}, variant).length).toBeGreaterThan(0);
    expect(playUrlFor(variant)).toContain("/22grams");
  });
});
