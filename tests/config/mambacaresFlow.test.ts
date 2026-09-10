import { describe, expect, it } from "vitest";
import type { FunnelStep } from "@/types/funnel";
import type { Answers } from "@/types/question";
import {
  AGE_SELECT_QUESTION_ID,
  achievableAxisMax,
  resolveFlow,
  totalQuestions,
} from "@/config/funnelFlow";
import { computeScore } from "@/engine/scoring";
import { eventSource } from "@/config/event";
import { EVENT_PATHS } from "@/config/eventLinks";
import { isPreviewVariant, usesDaylightScreens } from "@/config/variants";
import { COPY } from "@/config/copy";
import {
  MAMBACARES_CAMPAIGN,
  MAMBACARES_DONATION_URL,
  MAMBACARES_GIVEAWAY_SPONSORS,
  MAMBACARES_PHOTOS,
  MAMBACARES_RUNNING_PARTNERS,
  campaignProgress,
} from "@/config/mambacares";

/**
 * GMS x #MambaCares (/mambacares) is the PHKL arc with a different landing and
 * a different report - neither of which is a step. What must hold: the STEPS
 * are PHKL's exactly, so the question set, the scoring maxima and therefore
 * every score recorded stay comparable with /phkl and with event2; and this
 * event's rows are tagged with a bucket of its own, so its standings never mix
 * with another event's.
 */

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

describe("mambacares flow", () => {
  it("walks the phkl arc, step for step", () => {
    for (const answers of ANSWER_SETS) {
      expect(kindsIn(resolveFlow(answers, "mambacares"))).toEqual(
        kindsIn(resolveFlow(answers, "phkl")),
      );
      expect(idsIn(resolveFlow(answers, "mambacares"))).toEqual(
        idsIn(resolveFlow(answers, "phkl")),
      );
    }
  });

  it("runs the designed step sequence", () => {
    expect(
      kindsIn(resolveFlow({ forgetfulness: "almostDaily" }, "mambacares")),
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

  it("ends on the report, with no post-game card, invite or closing page", () => {
    const kinds = kindsIn(resolveFlow({}, "mambacares"));
    expect(kinds.at(-1)).toBe("result");
    for (const gone of [
      "gameResult",
      "quizInvite",
      "closing",
      "statCard",
      "consent",
      "wrap",
    ] as const) {
      expect(kinds).not.toContain(gone);
    }
  });

  // Load-bearing, exactly as on /phkl: achievableAxisMax sums the max option
  // scores over a variant's question steps, so a shared step list is what keeps
  // a #MambaCares score on the same /100 scale as every score already recorded.
  it("keeps scoring parity with phkl and event2", () => {
    for (const axis of ["risk", "symptom"] as const) {
      expect(achievableAxisMax("mambacares", axis)).toBe(
        achievableAxisMax("event2", axis),
      );
      expect(achievableAxisMax("mambacares", axis)).toBeGreaterThan(0);
    }
    const answers: Answers = {
      age: "50-59",
      sex: "male",
      highBp: "yes",
      highCholesterol: "no",
      diabetes: "unsure",
      smoking: "past",
      sleep: "6to7",
      exercise: "75to149",
      diet: "moderate",
      alcohol: "8to14",
      tracks: ["biometrics"],
      concentrating: "severalWeek",
      judgement: "rarely",
      forgetfulness: "severalWeek",
      persistence: "yes",
    };
    expect(computeScore(answers, "mambacares")).toEqual(
      computeScore(answers, "event2"),
    );
    expect(totalQuestions({}, "mambacares")).toBe(totalQuestions({}, "phkl"));
  });

  it("runs the daylight screens and records everything it collects", () => {
    expect(usesDaylightScreens("mambacares")).toBe(true);
    expect(isPreviewVariant("mambacares")).toBe(false);
  });

  it("tags its rows with a bucket no other event uses", () => {
    const source = eventSource("mambacares");
    expect(source).toBe("mambacares");
    const others = [
      "event",
      "event2",
      "event3",
      "rotary",
      "ntuhomecoming",
      "ihhsearegatta",
      "ihh",
      "phkl",
    ] as const;
    for (const variant of others) {
      expect(eventSource(variant), `collides with ${variant}`).not.toBe(source);
    }
  });

  // The QR codes and share cards for this event carry an absolute link built
  // from this path, so a missing or wrong entry sends players to another
  // event's funnel rather than 404ing where someone would notice.
  it("is served at its own route", () => {
    expect(EVENT_PATHS.mambacares).toBe("/mambacares");
  });
});

describe("mambacares campaign config", () => {
  it("has a real donation link", () => {
    expect(MAMBACARES_DONATION_URL).toMatch(/^https:\/\//);
  });

  it("keeps the thermometer inside its track", () => {
    expect(MAMBACARES_CAMPAIGN.goal).toBeGreaterThan(0);
    expect(MAMBACARES_CAMPAIGN.raised).toBeGreaterThanOrEqual(0);
    const pct = campaignProgress();
    expect(pct).toBeGreaterThanOrEqual(0);
    expect(pct).toBeLessThanOrEqual(1);
  });

  // Every image is optional at runtime, but a duplicated path would silently
  // render the same logo twice and hide a partner.
  it("gives every logo and photo its own file", () => {
    const paths = [
      ...MAMBACARES_RUNNING_PARTNERS.map((l) => l.src),
      ...MAMBACARES_GIVEAWAY_SPONSORS.map((l) => l.src),
      ...MAMBACARES_PHOTOS.campaignPair,
      MAMBACARES_PHOTOS.closing,
    ];
    expect(new Set(paths).size).toBe(paths.length);
    for (const path of paths) {
      expect(path.startsWith("/images/mambacares/"), path).toBe(true);
    }
  });
});

describe("mambacares copy", () => {
  const report = COPY.screens.mambacares.report;

  it("opens on the shared arc's header and risk section", () => {
    expect(report.header).toEqual(COPY.screens.phkl.report.header);
    expect(report.risk).toEqual(COPY.screens.phkl.report.risk);
  });

  it("has no partner consent on its landing", () => {
    expect(
      (COPY.screens.mambacares.splash as { partnerConsent?: unknown })
        .partnerConsent,
    ).toBeUndefined();
  });

  // The placeholders are filled in at render time; a typo in one would print
  // the brace to the player.
  it("keeps every placeholder the report knows how to fill", () => {
    expect(report.donate.heading).toContain("{seconds}");
    expect(report.donate.progressLabel).toContain("{raised}");
    expect(report.donate.progressLabel).toContain("{goal}");
    expect(report.donate.progressUpdated).toContain("{lastUpdated}");
    expect(report.closing.body).toContain("{goal}");
    expect(report.closing.body).toContain("{deadline}");
    expect(report.donate.headingAnonymous).not.toContain("{");
  });
});
