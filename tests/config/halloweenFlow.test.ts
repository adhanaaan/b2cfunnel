import { describe, expect, it } from "vitest";
import { COPY, boothReportFor, copyFor, reportStatFor } from "@/config/copy";
import { BANNED_PATTERNS } from "@/config/compliance";
import { HALLOWEEN_SOURCE, eventSource } from "@/config/event";
import { EVENT_PATHS, playUrlFor } from "@/config/eventLinks";
import { resolveFlow } from "@/config/funnelFlow";
import { usesDaylightScreens } from "@/config/variants";

/**
 * /halloween is one link handed round several gatherings on the same night -
 * a birthday lunch, then a party - with friends racing each other.
 *
 * That shape is what the tests here hold: the arc stays /general's so a time
 * set at a party is comparable with one set at a hospital booth, and the
 * bucket stays SINGLE so everyone who plays that night lands on one board.
 */
describe("/halloween", () => {
  it("runs /general's steps exactly, so its scores stay comparable", () => {
    const steps = (v: "halloween" | "general") =>
      resolveFlow({}, v).map((s) => JSON.stringify(s));
    expect(steps("halloween")).toEqual(steps("general"));
  });

  /** Unlike /onetrickpony: the report is the brain health teaser. */
  it("keeps the questionnaire and the report", () => {
    const kinds = resolveFlow({}, "halloween").map((s) => s.kind);
    expect(kinds).toContain("question");
    expect(kinds).toContain("analysing");
    expect(kinds).toContain("result");
  });

  it("writes to its own bucket, and its neighbours write to theirs", () => {
    expect(eventSource("halloween")).toBe(HALLOWEEN_SOURCE);
    for (const v of ["general", "eisai", "menopause", "otp"] as const) {
      expect(eventSource(v)).not.toBe(HALLOWEEN_SOURCE);
    }
  });

  /**
   * Dated by YEAR, because Halloween comes round again - but deliberately not
   * dated per gathering. Several parties on one night share this link, and the
   * whole appeal is that everybody lands on the same standings. A bucket per
   * party would split the race the link exists to create.
   */
  it("has one bucket for the night, dated by year", () => {
    expect(HALLOWEEN_SOURCE).toMatch(/^halloween-\d{4}$/);
  });

  it("has a landing the board's QR can point at", () => {
    expect(EVENT_PATHS.halloween).toBe("/halloween");
    expect(playUrlFor("halloween")).toContain("/halloween");
  });

  it("runs the daylight screens, like the rest of the arc", () => {
    expect(usesDaylightScreens("halloween")).toBe(true);
  });

  it("carries the landing's one-tick consent, like /general", () => {
    expect(COPY.screens.halloween.splash.consentForm).toBe(
      COPY.screens.general.splash.consentForm,
    );
  });

  it("reads /general's report, word for word", () => {
    expect(boothReportFor("halloween")).toBe(boothReportFor("general"));
    expect(reportStatFor("halloween")).toBe(reportStatFor("general"));
  });

  describe("its landing's wording", () => {
    const splash = copyFor("halloween", "en").screens.halloween.splash;
    const words = [
      splash.eyebrow,
      splash.heading,
      splash.body,
      splash.cta,
    ].join(" ");

    it("leads on the race, which is what the link is for", () => {
      expect(words).toMatch(/beat|quickest/i);
    });

    it("stays inside the compliance rail", () => {
      for (const pattern of BANNED_PATTERNS) {
        expect(words).not.toMatch(pattern);
      }
    });

    /**
     * The joke this route must not make. The obvious Halloween pun on a speed
     * score is a dead/slow one, and the slow end of a processing-speed result
     * is somebody's real result - not a punchline a brain health company can
     * make. The theming is the occasion, never the score.
     */
    it("makes no joke of a slow score", () => {
      expect(words).not.toMatch(/\bdead\b|\bzombie|\bbrain-?dead|\bcorpse/i);
      expect(words).not.toMatch(/\bslow\b/i);
    });
  });
});
