import { describe, expect, it } from "vitest";
import type { FunnelStep, QuizVariant } from "@/types/funnel";
import type { Answers } from "@/types/question";
import {
  AGE_SELECT_QUESTION_ID,
  achievableAxisMax,
  resolveFlow,
  totalQuestions,
} from "@/config/funnelFlow";
import { computeScore } from "@/engine/scoring";
import {
  SILOAM_SCORES_FINAL,
  SILOAM_SOURCE,
  eventSource,
} from "@/config/event";
import { EVENT_PATHS, SILOAM_OFFER_SECTION_ID } from "@/config/eventLinks";
import {
  isPreviewVariant,
  offersLanguageChoice,
  usesDaylightScreens,
  usesMambaScreens,
} from "@/config/variants";
import { COPY, arcCopyFor, phklReportFor, reportStatFor } from "@/config/copy";
import {
  SILOAM_PODIUM_N,
  SILOAM_PRIZE,
  SILOAM_PRIZE_HEADLINE,
} from "@/config/siloam";

/**
 * The Siloam Neuroscience Summit (/siloamneurosciencesummit) is the PHKL arc
 * with a different landing, a different close and a language choice - none of
 * which is a step - plus ONE step of its own behind the landing: the notice
 * that the standings have been recapped and the winners announced
 * (SILOAM_SCORES_FINAL). What must hold: everything from the primer onwards is
 * PHKL's exactly, so the question set, the scoring maxima and therefore every
 * score recorded stay comparable with /phkl and with event2; the notice never
 * reaches another event; and this event's rows are tagged with a bucket of its
 * own, so its standings never mix with another event's.
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

describe("siloam flow", () => {
  it("walks the phkl arc, step for step, behind its own notice", () => {
    for (const answers of ANSWER_SETS) {
      const siloam = kindsIn(resolveFlow(answers, "siloam"));
      // The notice is the ONLY difference, and it sits behind the landing:
      // take it out and the two arcs are the same list.
      expect(siloam.filter((kind) => kind !== "scoresFinal")).toEqual(
        kindsIn(resolveFlow(answers, "phkl")),
      );
      // A notice is not a question, so nothing it does can move a score.
      expect(idsIn(resolveFlow(answers, "siloam"))).toEqual(
        idsIn(resolveFlow(answers, "phkl")),
      );
    }
  });

  // The whole point of the page: it is passed THROUGH on the way to the game,
  // not parked in front of it. If the arc ever ended here it would read as a
  // closed event, which is exactly what this event is not.
  it("puts the results-are-final notice between the landing and the primer", () => {
    expect(SILOAM_SCORES_FINAL).toBe(true);
    const kinds = kindsIn(resolveFlow({}, "siloam"));
    expect(kinds.indexOf("scoresFinal")).toBe(kinds.indexOf("nameGate") + 1);
    expect(kinds.indexOf("scoresFinal")).toBe(kinds.indexOf("speedIntro") - 1);
    expect(kinds.filter((k) => k === "scoresFinal")).toHaveLength(1);
    expect(kinds.at(-1)).toBe("result");
    // Everything behind it still runs - this opens a page, it does not close
    // an event.
    for (const kind of ["game", "analysing", "result"] as const) {
      expect(kinds).toContain(kind);
    }
  });

  // Inserted per variant, exactly as each event's challenge-closed switch is:
  // /general runs this same arc, and a notice about a Jakarta prize-giving
  // must never appear on it.
  it("shows the notice at the summit and nowhere else", () => {
    const others: QuizVariant[] = [
      "phkl",
      "general",
      "22grams",
      "mambacares",
      "urbanmilers",
      "event3",
      "ihhsearegatta",
      "event2",
      "full",
    ];
    for (const variant of others) {
      expect(kindsIn(resolveFlow({}, variant)), variant).not.toContain(
        "scoresFinal",
      );
    }
  });

  it("runs the designed step sequence", () => {
    expect(
      kindsIn(resolveFlow({ forgetfulness: "almostDaily" }, "siloam")),
    ).toEqual([
      "nameGate",
      "scoresFinal", // while SILOAM_SCORES_FINAL is on
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
    const kinds = kindsIn(resolveFlow({}, "siloam"));
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

  // Load-bearing, exactly as on /phkl and the community runs: achievableAxisMax
  // sums the max option scores over a variant's question steps, so a shared
  // step list is what keeps a summit score on the same /100 scale as every
  // score already recorded.
  it("keeps scoring parity with phkl and event2", () => {
    for (const axis of ["risk", "symptom"] as const) {
      expect(achievableAxisMax("siloam", axis)).toBe(
        achievableAxisMax("event2", axis),
      );
      expect(achievableAxisMax("siloam", axis)).toBeGreaterThan(0);
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
    expect(computeScore(answers, "siloam")).toEqual(
      computeScore(answers, "event2"),
    );
    expect(totalQuestions({}, "siloam")).toBe(totalQuestions({}, "phkl"));
  });

  it("runs the daylight screens and records everything it collects", () => {
    expect(usesDaylightScreens("siloam")).toBe(true);
    // Not a community run: it has no fundraising report, so it must not be
    // handed the #MambaCares screens.
    expect(usesMambaScreens("siloam")).toBe(false);
    expect(isPreviewVariant("siloam")).toBe(false);
  });

  // The QR codes and share cards for this event carry an absolute link built
  // from this path, so a missing or wrong entry sends players to another
  // event's funnel rather than 404ing where someone would notice.
  it("is served at its own route", () => {
    expect(EVENT_PATHS.siloam).toBe("/siloamneurosciencesummit");
  });
});

describe("siloam leaderboard source", () => {
  it("is the tag the database column expects", () => {
    expect(SILOAM_SOURCE).toBe("siloam");
  });

  // The summit runs PHKL's arc, so this tag is the ONLY thing separating the
  // two events' rows - which makes a collision here the whole failure the
  // route exists to avoid: one bucket, two events, and standings nobody can
  // unpick afterwards.
  it("never collides with another event's bucket", () => {
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
    ];
    for (const variant of others) {
      expect(eventSource(variant), `collides with ${variant}`).not.toBe(
        SILOAM_SOURCE,
      );
    }
  });

  // A score and the report that follows it must carry the SAME tag, or the
  // board's completion rate divides one event's reports by another's players.
  it("tags both the score and the lead from the summit funnel", () => {
    expect(eventSource("siloam")).toBe(SILOAM_SOURCE);
  });
});

describe("siloam copy", () => {
  const report = COPY.screens.siloam.report;

  it("opens on the shared arc's header and risk section", () => {
    expect(report.header).toEqual(COPY.screens.phkl.report.header);
    expect(report.risk).toEqual(COPY.screens.phkl.report.risk);
  });

  it("shares the three report sections /phkl draws with the same components", () => {
    for (const section of ["speed", "baseline", "wrapUp"] as const) {
      expect(report[section]).toEqual(COPY.screens.phkl.report[section]);
    }
  });

  it("has no partner consent on its landing", () => {
    expect(
      (COPY.screens.siloam.splash as { partnerConsent?: unknown })
        .partnerConsent,
    ).toBeUndefined();
  });

  // Its own policy route is the whole point of having one: the Indonesian
  // rewrite must be able to land without touching the Singapore policy every
  // other no-partner event links.
  it("links a privacy policy written for this route", () => {
    expect(COPY.screens.siloam.splash.privacyHref).toBe(
      "/siloamneurosciencesummit/privacy-policy",
    );
    expect(COPY.screens.mambacares.splash.privacyHref).toBe("/privacy-policy");
  });

  // The close is NTU Homecoming's, and deliberately has nothing to click
  // through to - see SiloamOffer. If a booking URL ever appears in it, the
  // sticky button and this assertion both need revisiting.
  it("closes on the NTU Homecoming call to action, not a bookable package", () => {
    expect(report.offer.offerName).toBe(
      COPY.screens.event2.closing.offerName,
    );
    expect(report.offer.offerPoints).toEqual(
      COPY.screens.event2.closing.offerPoints,
    );
    expect(report.sticky).toEqual({ talk: "Speak to our team" });
    expect(report).not.toHaveProperty("offer.poster");
    expect(JSON.stringify(report.offer)).not.toMatch(/https?:\/\//);
  });

  // The shared screens must read the event being walked, never one event's
  // block by name - or the summit's report prints Pantai Hospital's words.
  it("hands its own words to the shared arc screens", () => {
    expect(arcCopyFor("siloam")).toBe(COPY.screens.siloam);
    expect(arcCopyFor("phkl")).toBe(COPY.screens.phkl);
    expect(phklReportFor("siloam")).toBe(COPY.screens.siloam.report);
    expect(phklReportFor("phkl")).toBe(COPY.screens.phkl.report);
  });

  // The risk section's headline figure is this event's own, so an Indonesian
  // number can replace it without moving the one every other event quotes.
  it("quotes a statistic of its own, and leaves every other event's alone", () => {
    expect(reportStatFor("siloam")).toBe(COPY.screens.siloam.report.stat);
    expect(reportStatFor("phkl").stat).toBe("About 45%");
    expect(reportStatFor("mambacares")).toEqual(reportStatFor("phkl"));
  });

  it("offers the language choice, and no other event does", () => {
    expect(offersLanguageChoice("siloam")).toBe(true);
    const others: QuizVariant[] = [
      "full",
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
    ];
    for (const variant of others) {
      expect(offersLanguageChoice(variant), variant).toBe(false);
    }
  });
});

describe("siloam prize", () => {
  it("is the ladder the client asked for, in order", () => {
    expect(SILOAM_PRIZE.ladder.map((t) => [t.rank, t.label])).toEqual([
      ["1ST", "IDR 300k voucher"],
      ["2ND", "IDR 200k voucher"],
      ["3RD", "IDR 100k voucher"],
    ]);
  });

  // The panel prints "Win a total of X" directly above the rows that add up to
  // X. Typed side by side those two can disagree, and nobody re-reads a TV
  // board at an event - so the total is summed from the ladder, and this holds
  // it there.
  it("sums its headline total from the ladder rather than repeating it", () => {
    const sum = SILOAM_PRIZE.ladder.reduce((n, t) => n + t.thousands, 0);
    expect(sum).toBe(600);
    expect(SILOAM_PRIZE.total).toBe(`IDR ${sum}k`);
    expect(SILOAM_PRIZE_HEADLINE[1]).toContain(SILOAM_PRIZE.total);
  });

  // Rupiah was the one thing the brief was explicit about.
  it("is priced in rupiah, and in nobody else's currency", () => {
    for (const text of [
      SILOAM_PRIZE.total,
      ...SILOAM_PRIZE.ladder.map((t) => t.label),
      ...SILOAM_PRIZE_HEADLINE,
    ]) {
      expect(text).not.toMatch(/RM\s*\d|S?\$\s*\d/);
    }
    expect(SILOAM_PRIZE.total).toMatch(/^IDR\s/);
    for (const tier of SILOAM_PRIZE.ladder) {
      expect(tier.label).toMatch(/^IDR\s\d+k voucher$/);
    }
  });

  // The ladder's length is the board's PODIUM_N: how many rows ride the prize
  // gradient, and what the eyebrow promises. A fourth tier with no fourth
  // gradient row would be a prize the standings never show anyone winning.
  it("sets the podium depth the standings rank to", () => {
    expect(SILOAM_PODIUM_N).toBe(3);
    expect(SILOAM_PODIUM_N).toBe(SILOAM_PRIZE.ladder.length);
  });
});

describe("siloam report anchors", () => {
  // The sticky button scrolls to this id, and SiloamOffer renders it. A
  // mismatch is a dead button on a phone at an event, with nothing in the
  // console to say so.
  it("has an offer section id the sticky button can reach", () => {
    expect(SILOAM_OFFER_SECTION_ID).toBe("siloam-next-step");
  });
});
