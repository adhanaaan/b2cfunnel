import { describe, expect, it } from "vitest";
import { COPY, boothReportFor, copyFor, reportStatFor } from "@/config/copy";
import { BANNED_PATTERNS } from "@/config/compliance";
import { MENOPAUSE_SOURCE, eventSource } from "@/config/event";
import { EVENT_PATHS, playUrlFor } from "@/config/eventLinks";
import { resolveFlow } from "@/config/funnelFlow";
import { usesDaylightScreens } from "@/config/variants";

/**
 * /menopause is the Menopause Awareness Month campaign: /general's arc, with
 * the landing turned to the campaign and a bucket of its own.
 *
 * Two things here are worth holding down.
 *
 * The arc must stay /general's exactly. The whole reason this route exists
 * alongside /general rather than as a new funnel is that its scores have to be
 * comparable with every other event's, and that is true only while the question
 * set is identical.
 *
 * And this is the first route whose landing talks about a health experience
 * rather than naming a host, so the compliance rail matters more here than
 * anywhere. Brain fog around menopause is the hook; a clinical claim is not.
 */
describe("/menopause", () => {
  it("runs /general's steps exactly, so its scores stay comparable", () => {
    const steps = (v: "menopause" | "general") =>
      resolveFlow({}, v).map((s) => JSON.stringify(s));
    expect(steps("menopause")).toEqual(steps("general"));
  });

  /** Unlike /onetrickpony: the report is the point of an awareness campaign. */
  it("keeps the questionnaire and the report", () => {
    const kinds = resolveFlow({}, "menopause").map((s) => s.kind);
    expect(kinds).toContain("question");
    expect(kinds).toContain("analysing");
    expect(kinds).toContain("result");
  });

  it("writes to its own bucket, and its neighbours write to theirs", () => {
    expect(eventSource("menopause")).toBe(MENOPAUSE_SOURCE);
    for (const v of ["general", "eisai", "otp", "siloam", "22grams"] as const) {
      expect(eventSource(v)).not.toBe(MENOPAUSE_SOURCE);
    }
  });

  /**
   * Dated, because this campaign comes round every October. An undated bucket
   * would rank next year's players against this year's and open the board on a
   * time nobody in the room can beat.
   */
  it("has a dated bucket, so next October starts clean", () => {
    expect(MENOPAUSE_SOURCE).toMatch(/\d{4}-\d{2}$/);
  });

  it("has a landing the board's QR can point at", () => {
    expect(EVENT_PATHS.menopause).toBe("/menopause");
    expect(playUrlFor("menopause")).toContain("/menopause");
  });

  it("runs the daylight screens, like the rest of the arc", () => {
    expect(usesDaylightScreens("menopause")).toBe(true);
  });

  it("carries the landing's one-tick consent, like /general", () => {
    expect(COPY.screens.menopause.splash.consentForm).toBe(
      COPY.screens.general.splash.consentForm,
    );
  });

  it("reads /general's report, word for word", () => {
    expect(boothReportFor("menopause")).toBe(boothReportFor("general"));
    expect(reportStatFor("menopause")).toBe(reportStatFor("general"));
  });

  describe("its landing's wording", () => {
    const splash = copyFor("menopause", "en").screens.menopause.splash;
    const words = [
      splash.eyebrow,
      splash.heading,
      splash.body,
      splash.cta,
    ].join(" ");

    it("names the campaign", () => {
      expect(words).toMatch(/menopause/i);
    });

    it("stays inside the compliance rail", () => {
      for (const pattern of BANNED_PATTERNS) {
        expect(words).not.toMatch(pattern);
      }
    });

    /**
     * The line this route could most easily cross: menopause is talked about,
     * dementia is not, and nothing here may suggest one leads to the other.
     */
    it("makes no claim about dementia, risk or cause", () => {
      expect(words).not.toMatch(/dementia|alzheimer/i);
      expect(words).not.toMatch(/\brisk\b/i);
      expect(words).not.toMatch(/\bcause(s|d)?\b/i);
      expect(words).not.toMatch(/\bsymptom/i);
    });

    /** What it may say about the game is what the game does: it times you. */
    it("describes the game as a timed test and nothing more", () => {
      expect(words).toMatch(/processing speed|60-second|symbol-matching/i);
    });
  });
});
