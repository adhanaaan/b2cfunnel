import { describe, expect, it, vi } from "vitest";
import type { FunnelStep, QuizVariant } from "@/types/funnel";
import type { Answers } from "@/types/question";
import {
  COPY,
  arcCopyFor,
  boothReportFor,
  copyFor,
  phklReportFor,
  reportStatFor,
} from "@/config/copy";
import { playUrlFor } from "@/config/eventLinks";
import { LANGUAGES } from "@/config/language";
import { STAT_CARDS_BY_ID } from "@/config/statCards";
import {
  offersLanguageChoice,
  usesDaylightScreens,
  usesMambaScreens,
} from "@/config/variants";

/**
 * /general runs the Siloam summit's arc - which is /phkl's - on /22grams'
 * landing, with the summit's booth report and NTU Homecoming's board. None of
 * the landing, the board or the language is a step, so what must hold is that
 * the STEPS are the summit's exactly: that is what keeps the question set, the
 * scoring maxima and therefore every score recorded here comparable with every
 * score already recorded.
 *
 * The v3 challenge switch is pinned OPEN here so the arcs are compared like for
 * like; that closing v3 leaves this route alone whichever way the live switch
 * is set is asserted separately, against the real config, below.
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

describe("general flow", () => {
  // The point of the route: it is the summit's arc on a bucket of its own, so
  // the two must not drift apart.
  it("walks the summit's arc, step for step", () => {
    for (const answers of ANSWER_SETS) {
      expect(kindsIn(resolveFlow(answers, "general"))).toEqual(
        kindsIn(resolveFlow(answers, "siloam")),
      );
      expect(idsIn(resolveFlow(answers, "general"))).toEqual(
        idsIn(resolveFlow(answers, "siloam")),
      );
    }
  });

  it("asks exactly the event2/event3 questions, age included", () => {
    for (const answers of ANSWER_SETS) {
      expect(idsIn(resolveFlow(answers, "general")).sort()).toEqual(
        idsIn(resolveFlow(answers, "event2")).sort(),
      );
    }
  });

  it("runs the designed step sequence", () => {
    expect(
      kindsIn(resolveFlow({ forgetfulness: "almostDaily" }, "general")),
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

  // No partner on this route, so nothing to consent to; and this arc has no
  // post-game card, no invite and no closing page - the report is the end.
  it("ends on the report, with none of the steps this arc drops", () => {
    const kinds = kindsIn(resolveFlow({}, "general"));
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
});

/**
 * The two things that would be silent if they broke: closing the DBS challenge
 * reaching across into this route, and the question set drifting off event2's
 * (which is what keeps a /general score comparable with every score already
 * recorded). Both asserted against the REAL config, not the mock above.
 */
describe("general against the live config", () => {
  it("is untouched by the v3 challenge switch", async () => {
    vi.doUnmock("@/config/event");
    vi.resetModules();
    const live = await import("@/config/funnelFlow");
    const { EVENT3_CHALLENGE_CLOSED } = await import("@/config/event");

    // Proof the unmock took, whichever way the live switch is set.
    expect(live.resolveFlow({}, "event3").some((s) => s.kind === "wrap")).toBe(
      EVENT3_CHALLENGE_CLOSED,
    );

    expect(kindsIn(live.resolveFlow({}, "general"))).toEqual(
      kindsIn(resolveFlow({}, "general")),
    );
    expect(live.resolveFlow({}, "general").some((s) => s.kind === "wrap")).toBe(
      false,
    );

    // Moving `age` onto its own screen must not change what a full answer can
    // score, or every /general score would sit on a different scale from the
    // ones the board already ranks.
    for (const axis of ["risk", "symptom"] as const) {
      expect(live.achievableAxisMax("general", axis)).toBe(
        live.achievableAxisMax("event2", axis),
      );
      expect(live.achievableAxisMax("general", axis)).toBe(
        live.achievableAxisMax("siloam", axis),
      );
      expect(achievableAxisMax("general", axis)).toBeGreaterThan(0);
    }
  });
});

/**
 * The board's QR and the share card a player sends their friends both read
 * playUrlFor, which falls back to the v3 route for any variant missing from
 * EVENT_PATHS - so a missing entry would quietly send /general players to the
 * DBS link, or to a summit in Jakarta.
 */
describe("general play URL", () => {
  it("points at /general", () => {
    expect(playUrlFor("general")).toMatch(/\/general$/);
    expect(playUrlFor("general")).not.toBe(playUrlFor("event3"));
    expect(playUrlFor("general")).not.toBe(playUrlFor("siloam"));
    expect(playUrlFor("general")).not.toBe(playUrlFor("ntuhomecoming"));
  });
});

describe("general screens", () => {
  it("walks the daylight screens", () => {
    expect(usesDaylightScreens("general")).toBe(true);
  });

  /**
   * It runs the summit's steps, and the summit is on PHKL's arc rather than the
   * community runs' - so this helper, which is what picks the FUNDRAISING
   * report, must stay false. Getting it wrong is silent: the arc would still
   * walk, and the report would quietly become Dementia Singapore's.
   */
  it("is not on the #MambaCares report", () => {
    expect(usesMambaScreens("general")).toBe(false);
  });

  /**
   * The whole difference between this route and the summit it copies. English
   * only, like every other event: nothing mounts a LanguageProvider here, so a
   * picker appearing on this landing would be a route serving Bahasa Indonesia
   * to a room that never asked for it.
   */
  it("never offers the language picker", () => {
    expect(offersLanguageChoice("general")).toBe(false);
  });

  /**
   * The language layer being inert is not the same as the picker being absent:
   * `copyFor` is what every screen reads through, and for this route it must
   * hand back the English config ITSELF in every language, not a merged copy.
   */
  it("reads the English config whatever language is asked for", () => {
    for (const language of LANGUAGES) {
      expect(copyFor("general", language.id).screens.general).toBe(
        COPY.screens.general,
      );
    }
  });
});

/**
 * Every shared screen reads its words through a helper keyed on the variant, so
 * that one event's wording can never be printed on another's page. /general
 * draws the summit's report components, which makes the close the one most
 * likely to leak: the summit sends readers to a booth in Jakarta.
 */
describe("general copy", () => {
  it("has a block of its own", () => {
    expect(COPY.screens.general).not.toBe(COPY.screens.siloam);
    expect(COPY.screens.general).not.toBe(COPY.screens["22grams"]);
    expect(COPY.screens.general).not.toBe(COPY.screens.phkl);
    expect(COPY.screens.general).not.toBe(COPY.screens.mambacares);
  });

  it("reads its own words on every shared screen", () => {
    expect(arcCopyFor("general")).toBe(COPY.screens.general);
    expect(phklReportFor("general")).toBe(COPY.screens.general.report);
    expect(boothReportFor("general")).toBe(COPY.screens.general.report);
    expect(reportStatFor("general")).toBe(COPY.screens.general.report.stat);
  });

  it("never reaches for another event's close, and never hands over its own", () => {
    expect(boothReportFor("general")).not.toBe(COPY.screens.siloam.report);
    expect(boothReportFor("general")).not.toBe(COPY.screens["22grams"].report);
    expect(boothReportFor("siloam")).toBe(COPY.screens.siloam.report);
    expect(boothReportFor("22grams")).toBe(COPY.screens["22grams"].report);
    expect(arcCopyFor("siloam")).not.toBe(COPY.screens.general);
    expect(arcCopyFor("22grams")).not.toBe(COPY.screens.general);
    expect(arcCopyFor("phkl")).not.toBe(COPY.screens.general);
  });

  // The landing is /22grams', consent block and all. Asserted against that
  // event's own splash rather than against a literal, so the two cannot drift
  // while both claim to be the same landing.
  it("ships the /22grams landing", () => {
    expect(COPY.screens.general.splash).toEqual(COPY.screens["22grams"].splash);
    expect(COPY.screens.general.splash.consentForm).toBe(
      COPY.screens["22grams"].splash.consentForm,
    );
  });

  /**
   * The summit's landing links a policy written for Indonesia's UU PDP. This
   * route has no country in its name and no policy of its own, so it must link
   * the shared notice - and must not pick up the summit's by inheriting it.
   */
  it("links the shared privacy policy, not the summit's", () => {
    expect(COPY.screens.general.splash.privacyHref).toBe("/privacy-policy");
    expect(COPY.screens.general.splash.privacyHref).not.toBe(
      COPY.screens.siloam.splash.privacyHref,
    );
  });

  /**
   * The close is the summit's words, and there is no `ctaThanks` - which is
   * what keeps the call to action a line rather than a button (see
   * `SiloamOffer`). A thank-you appearing here would be this route promising a
   * follow-up that whoever is running it has not promised.
   */
  it("closes on the summit's booth wording, with no button to answer", () => {
    const offer = COPY.screens.general.report.offer;
    expect(offer).toEqual(COPY.screens.siloam.report.offer);
    expect(offer.ctaThanks).toBeUndefined();
    expect(COPY.screens.general.report.sticky.talk).toBe(
      COPY.screens.siloam.report.sticky.talk,
    );
  });

  /**
   * The headline statistic is the shared Lancet card, read rather than typed
   * out: the summit types its own because it is holding a slot for an
   * Indonesian figure, and this route has no such pending substitution.
   */
  it("quotes the shared Lancet card", () => {
    expect(COPY.screens.general.report.stat).toBe(STAT_CARDS_BY_ID.lancet2024);
  });
});

/**
 * A new variant that nothing routes to is a route that silently serves the
 * wrong flow. These are the two lookups keyed on the literal.
 */
describe("general is wired to its own literal", () => {
  it("resolves a flow and a path under the variant name", () => {
    const variant: QuizVariant = "general";
    expect(resolveFlow({}, variant).length).toBeGreaterThan(0);
    expect(playUrlFor(variant)).toContain("/general");
  });
});
