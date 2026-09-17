import { describe, expect, it, vi } from "vitest";
import type { FunnelStep, QuizVariant } from "@/types/funnel";
import type { Answers } from "@/types/question";
import { COPY, arcCopyFor, boothReportFor, phklReportFor } from "@/config/copy";
import { playUrlFor } from "@/config/eventLinks";
import {
  offersLanguageChoice,
  usesDaylightScreens,
  usesMambaScreens,
} from "@/config/variants";

/**
 * 22 Grams (/22grams) runs the #MambaCares arc - which is /phkl's - and closes
 * on the Siloam summit's report rather than on a fundraiser. Neither the
 * landing nor the report is a step, so what must hold is that the STEPS are
 * #MambaCares' exactly: that is what keeps the question set, the scoring
 * maxima and therefore every Sharp Shot Week score comparable with every score
 * already recorded.
 *
 * The v3 challenge switch is pinned OPEN here so the arcs are compared like
 * for like; that closing v3 leaves this event alone whichever way the live
 * switch is set is asserted separately, against the real config, below.
 */
vi.mock("@/config/event", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/config/event")>()),
  EVENT3_CHALLENGE_CLOSED: false,
}));

const { resolveFlow, achievableAxisMax, AGE_SELECT_QUESTION_ID } = await import(
  "@/config/funnelFlow"
);

/** Question ids in flow order. An ageSelect step IS the age question. */
const idsIn = (flow: FunnelStep[]): string[] =>
  flow.flatMap((s) =>
    s.kind === "question"
      ? [s.questionId]
      : s.kind === "questionGroup"
        ? s.questionIds
        : s.kind === "ageSelect"
          ? [AGE_SELECT_QUESTION_ID]
          : [],
  );

const kindsIn = (flow: FunnelStep[]) => flow.map((s) => s.kind);

const ANSWER_SETS: Answers[] = [
  {},
  { forgetfulness: "notNotice" },
  { forgetfulness: "almostDaily", sex: "female" },
];

describe("22grams flow", () => {
  // The point of the route: it is #MambaCares' arc on a bucket of its own, so
  // the two must not drift apart.
  it("walks the #MambaCares arc, step for step", () => {
    for (const answers of ANSWER_SETS) {
      expect(kindsIn(resolveFlow(answers, "22grams"))).toEqual(
        kindsIn(resolveFlow(answers, "mambacares")),
      );
      expect(idsIn(resolveFlow(answers, "22grams"))).toEqual(
        idsIn(resolveFlow(answers, "mambacares")),
      );
    }
  });

  it("asks exactly the event2/event3 questions, age included", () => {
    for (const answers of ANSWER_SETS) {
      expect(idsIn(resolveFlow(answers, "22grams")).sort()).toEqual(
        idsIn(resolveFlow(answers, "event2")).sort(),
      );
    }
  });

  it("runs the designed step sequence", () => {
    expect(
      kindsIn(resolveFlow({ forgetfulness: "almostDaily" }, "22grams")),
    ).toEqual([
      "nameGate",
      "speedIntro",
      "ageSelect",
      "instructions",
      "game",
      "greatJob",
      "quizIntro",
      "question", // sex
      "questionGroup", // health history
      "questionGroup", // lifestyle
      "question", // tracks
      "question", // concentrating
      "question", // judgement
      "question", // forgetfulness
      "question", // persistence
      "analysing",
      "result",
    ]);
  });

  // No partner in this event, so nothing to consent to; and this arc has no
  // post-game card, no invite and no closing page - the report is the end.
  it("ends on the report, with none of the steps this arc drops", () => {
    const kinds = kindsIn(resolveFlow({}, "22grams"));
    expect(kinds.at(-1)).toBe("result");
    for (const gone of [
      "consent",
      "wrap",
      "gameResult",
      "quizInvite",
      "closing",
      "statCard",
    ] as const) {
      expect(kinds, `still has ${gone}`).not.toContain(gone);
    }
  });

  /**
   * The Sharp Shot poster is raised by the funnel, not by a screen, BECAUSE
   * this arc has no post-game step to hang it off. If one ever appears here,
   * that reasoning is worth revisiting - and if `gameResult` were assumed to
   * exist, the free drink would silently stop being offered.
   */
  it("has no post-game screen for the poster to hang off", () => {
    expect(kindsIn(resolveFlow({}, "22grams"))).not.toContain("gameResult");
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

    // Moving `age` onto its own screen must not change what a full answer
    // can score, or every Sharp Shot Week score would sit on a different
    // scale from the ones the board already ranks.
    for (const axis of ["risk", "symptom"] as const) {
      expect(live.achievableAxisMax("22grams", axis)).toBe(
        live.achievableAxisMax("event2", axis),
      );
      expect(live.achievableAxisMax("22grams", axis)).toBe(
        live.achievableAxisMax("mambacares", axis),
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
describe("22grams screens", () => {
  it("walks the daylight screens", () => {
    expect(usesDaylightScreens("22grams")).toBe(true);
  });

  /**
   * It runs #MambaCares' STEPS but not #MambaCares' SCREENS: that helper is
   * what picks the fundraising report, and this event closes on the summit's.
   * Getting this wrong is silent - the arc would still walk - so it is pinned.
   */
  it("is not on the #MambaCares report", () => {
    expect(usesMambaScreens("22grams")).toBe(false);
  });

  it("never offers the language picker", () => {
    expect(offersLanguageChoice("22grams")).toBe(false);
  });
});

/**
 * Every shared screen reads its words through a helper keyed on the variant,
 * so that one event's wording can never be printed on another's page. /22grams
 * draws the summit's report components, which makes the close the one most
 * likely to leak: the summit sends readers to a booth in Jakarta, and this
 * event is a coffee counter in Singapore.
 */
describe("22grams copy", () => {
  it("has a block of its own", () => {
    expect(COPY.screens["22grams"]).not.toBe(COPY.screens.siloam);
    expect(COPY.screens["22grams"]).not.toBe(COPY.screens.phkl);
    expect(COPY.screens["22grams"]).not.toBe(COPY.screens.mambacares);
  });

  it("reads its own words on every shared screen", () => {
    expect(arcCopyFor("22grams")).toBe(COPY.screens["22grams"]);
    expect(phklReportFor("22grams")).toBe(COPY.screens["22grams"].report);
    expect(boothReportFor("22grams")).toBe(COPY.screens["22grams"].report);
  });

  it("never reaches for the summit's close, and never hands over its own", () => {
    expect(boothReportFor("22grams")).not.toBe(COPY.screens.siloam.report);
    expect(boothReportFor("siloam")).toBe(COPY.screens.siloam.report);
    expect(arcCopyFor("siloam")).not.toBe(COPY.screens["22grams"]);
    expect(arcCopyFor("phkl")).not.toBe(COPY.screens["22grams"]);
    expect(arcCopyFor("mambacares")).not.toBe(COPY.screens["22grams"]);
  });

  // The landing is #MambaCares': the plain two-row consent, no partner block.
  // Asserted against that event's own splash rather than against a literal, so
  // the two cannot drift into different landings while both claim to be one.
  it("ships the #MambaCares landing", () => {
    expect(COPY.screens["22grams"].splash).toEqual(
      COPY.screens.mambacares.splash,
    );
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
