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
import {
  isPreviewVariant,
  usesDaylightScreens,
  usesMambaScreens,
} from "@/config/variants";
import { COPY, runCopyFor } from "@/config/copy";
import { campaignProgress, communityRunFor } from "@/config/communityRun";
import { MAMBACARES_RUN } from "@/config/mambacares";
import {
  URBANMILERS_CAMPAIGN,
  URBANMILERS_DONATION_URL,
  URBANMILERS_GIVEAWAY_SPONSORS,
  URBANMILERS_PHOTOS,
  URBANMILERS_RUN,
  URBANMILERS_RUNNING_PARTNERS,
} from "@/config/urbanmilers";

/**
 * GMS x Urban Milers (/urbanmilers) is the #MambaCares arc on a bucket of its
 * own. What must hold: the STEPS are that event's exactly, so the question set,
 * the scoring maxima and therefore every score recorded stay comparable with
 * /mambacares, /phkl and event2; this run's rows are tagged with a bucket
 * nothing else uses, which is what opens its board empty and keeps the two runs
 * from ranking each other's players; and the screens the two runs share hand
 * each one its own words and its own campaign.
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

describe("urbanmilers flow", () => {
  it("walks the mambacares arc, step for step", () => {
    for (const answers of ANSWER_SETS) {
      expect(kindsIn(resolveFlow(answers, "urbanmilers"))).toEqual(
        kindsIn(resolveFlow(answers, "mambacares")),
      );
      expect(idsIn(resolveFlow(answers, "urbanmilers"))).toEqual(
        idsIn(resolveFlow(answers, "mambacares")),
      );
    }
  });

  it("runs the designed step sequence", () => {
    expect(
      kindsIn(resolveFlow({ forgetfulness: "almostDaily" }, "urbanmilers")),
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
    const kinds = kindsIn(resolveFlow({}, "urbanmilers"));
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

  // Load-bearing, exactly as on /mambacares: achievableAxisMax sums the max
  // option scores over a variant's question steps, so a shared step list is
  // what keeps an Urban Milers score on the same /100 scale as every score
  // already recorded.
  it("keeps scoring parity with mambacares and event2", () => {
    for (const axis of ["risk", "symptom"] as const) {
      expect(achievableAxisMax("urbanmilers", axis)).toBe(
        achievableAxisMax("event2", axis),
      );
      expect(achievableAxisMax("urbanmilers", axis)).toBeGreaterThan(0);
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
    expect(computeScore(answers, "urbanmilers")).toEqual(
      computeScore(answers, "event2"),
    );
    expect(totalQuestions({}, "urbanmilers")).toBe(
      totalQuestions({}, "mambacares"),
    );
  });

  it("runs the daylight and community-run screens, and records what it collects", () => {
    expect(usesDaylightScreens("urbanmilers")).toBe(true);
    expect(usesMambaScreens("urbanmilers")).toBe(true);
    expect(isPreviewVariant("urbanmilers")).toBe(false);
  });

  // The bucket is the whole point of the route: it is what starts this board
  // empty rather than on #MambaCares' standings, and what stops either run's
  // times appearing on the other's TV.
  it("tags its rows with a bucket no other event uses", () => {
    const source = eventSource("urbanmilers");
    expect(source).toBe("urbanmilers");
    const others = [
      "event",
      "event2",
      "event3",
      "rotary",
      "ntuhomecoming",
      "ihhsearegatta",
      "ihh",
      "phkl",
      "mambacares",
    ] as const;
    for (const variant of others) {
      expect(eventSource(variant), `collides with ${variant}`).not.toBe(source);
    }
  });

  // The QR codes and share cards for this event carry an absolute link built
  // from this path, so a missing or wrong entry sends players to another
  // event's funnel rather than 404ing where someone would notice.
  it("is served at its own route", () => {
    expect(EVENT_PATHS.urbanmilers).toBe("/urbanmilers");
    expect(EVENT_PATHS.urbanmilers).not.toBe(EVENT_PATHS.mambacares);
  });
});

describe("urbanmilers campaign config", () => {
  it("has a real donation link", () => {
    expect(URBANMILERS_DONATION_URL).toMatch(/^https:\/\//);
  });

  it("keeps the thermometer inside its track", () => {
    expect(URBANMILERS_CAMPAIGN.goal).toBeGreaterThan(0);
    expect(URBANMILERS_CAMPAIGN.raised).toBeGreaterThanOrEqual(0);
    const pct = campaignProgress(URBANMILERS_RUN);
    expect(pct).toBeGreaterThanOrEqual(0);
    expect(pct).toBeLessThanOrEqual(1);
  });

  // The campaign paragraph states the number of crews in words. Nothing else
  // ties it to the logo row, so a crew joining would leave the report saying
  // "six" over seven logos - true of the copy, visibly wrong on the page.
  it("keeps the crew count in step with the copy that states it", () => {
    expect(URBANMILERS_RUNNING_PARTNERS).toHaveLength(6);
    expect(COPY.screens.urbanmilers.report.donate.paragraphs[0]).toContain(
      "six running",
    );
  });

  // Every image is optional at runtime, but a duplicated path would silently
  // render the same logo twice and hide a partner.
  it("gives every logo and photo its own file", () => {
    const paths = [
      ...URBANMILERS_RUNNING_PARTNERS.map((l) => l.src),
      ...URBANMILERS_GIVEAWAY_SPONSORS.map((l) => l.src),
      ...URBANMILERS_PHOTOS.campaignPair,
      URBANMILERS_PHOTOS.closing,
    ];
    expect(new Set(paths).size).toBe(paths.length);
  });

  // The screens are shared with /mambacares, so this is what stops one run's
  // link, thermometer or logos being drawn on the other run's report.
  it("is what the shared report screens read for this variant", () => {
    expect(communityRunFor("urbanmilers")).toBe(URBANMILERS_RUN);
    expect(communityRunFor("mambacares")).not.toBe(URBANMILERS_RUN);
    expect(URBANMILERS_RUN.donationUrl).toBe(URBANMILERS_DONATION_URL);
  });
});

describe("urbanmilers copy", () => {
  const report = COPY.screens.urbanmilers.report;

  it("opens on the shared arc's header and risk section", () => {
    expect(report.header).toEqual(COPY.screens.phkl.report.header);
    expect(report.risk).toEqual(COPY.screens.phkl.report.risk);
  });

  it("has no partner consent on its landing", () => {
    expect(
      (COPY.screens.urbanmilers.splash as { partnerConsent?: unknown })
        .partnerConsent,
    ).toBeUndefined();
  });

  // The landing is #MambaCares' bar the consent, which is /22grams' one tick -
  // the same block, so a wording change there reaches this landing too.
  it("ships the #MambaCares landing with /22grams' one-tick consent", () => {
    const { consentForm, ...rest } = COPY.screens.urbanmilers.splash;
    expect(rest).toEqual(COPY.screens.mambacares.splash);
    expect(consentForm).toBe(COPY.screens["22grams"].splash.consentForm);
  });

  // The two runs share every screen, so the words are the only thing naming
  // the event a player is actually at. Nothing on this route may say the
  // other run's name.
  it("names this run wherever the words name the event", () => {
    expect(report.partners.wordmark).toBe("GMS X URBAN MILERS");
    expect(report.cta.shareTitle).toContain("Urban Milers");
    expect(report.cta.shareText).toContain("Urban Milers");
    expect(report.donate.paragraphs[0]).toContain("Urban Milers");
    for (const line of [
      report.partners.wordmark,
      report.cta.shareTitle,
      report.cta.shareText,
      report.donate.paragraphs[0],
    ]) {
      expect(line).not.toContain("MambaCares");
      expect(line).not.toContain("MAMBACARES");
    }
  });

  it("is handed to the shared screens for this variant, and only this one", () => {
    expect(runCopyFor("urbanmilers")).toBe(COPY.screens.urbanmilers);
    expect(runCopyFor("mambacares")).toBe(COPY.screens.mambacares);
    // The v7 preview walks the #MambaCares arc, so it keeps that run's words.
    expect(runCopyFor("event7")).toBe(COPY.screens.mambacares);
    expect(MAMBACARES_RUN).not.toBe(URBANMILERS_RUN);
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
