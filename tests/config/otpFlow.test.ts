import { describe, expect, it } from "vitest";
import { COPY, boothReportFor, copyFor } from "@/config/copy";
import { OTP_SOURCE, eventSource } from "@/config/event";
import { EVENT_PATHS, playUrlFor } from "@/config/eventLinks";
import { resolveFlow } from "@/config/funnelFlow";
import { usesDaylightScreens } from "@/config/variants";
import { boardNameFor } from "@/lib/boardName";

/**
 * /onetrickpony is Round 5 of a pub quiz night, and it is the GAME and nothing
 * else: name and team, how to play, play, your time.
 *
 * Two things about it are unlike every other route here, and both are the kind
 * that come back if nothing holds them down.
 *
 * It asks for no email, so no consent block - which means the form must not
 * ask, the copy must not promise anything by email, and the board must still be
 * able to tell two players apart with no address to do it with.
 *
 * And it has no questionnaire, because the room is midway through somebody
 * else's quiz night. That means no question steps at all, which is also why
 * putting one back would need care: `achievableAxisMax` sums question steps, so
 * a route with some questions but not the arc's would score on a scale no other
 * event shares.
 */
describe("/onetrickpony", () => {
  it("is the game and nothing else", () => {
    expect(resolveFlow({}, "otp").map((s) => s.kind)).toEqual([
      "nameGate",
      "speedIntro",
      "instructions",
      "game",
      "gameResult",
    ]);
  });

  it("asks no questions at all", () => {
    const kinds = resolveFlow({}, "otp").map((s) => s.kind);
    expect(kinds).not.toContain("question");
    expect(kinds).not.toContain("questionGroup");
    expect(kinds).not.toContain("ageSelect");
  });

  /** No quiz means no score to reveal, so none of that arc may be reachable. */
  it("never reaches the questionnaire, the report or a lead", () => {
    const kinds = resolveFlow({}, "otp").map((s) => s.kind);
    for (const gone of ["analysing", "result", "emailGate", "quizIntro"]) {
      expect(kinds).not.toContain(gone);
    }
  });

  it("ends on the post-game card, so the player sees their time", () => {
    const flow = resolveFlow({}, "otp");
    expect(flow[flow.length - 1].kind).toBe("gameResult");
  });

  it("is shorter than the arc it used to share", () => {
    expect(resolveFlow({}, "otp").length).toBeLessThan(
      resolveFlow({}, "general").length,
    );
  });

  it("writes to its own bucket, and its neighbours write to theirs", () => {
    expect(eventSource("otp")).toBe(OTP_SOURCE);
    for (const v of ["general", "siloam", "22grams", "eisai", "urbanmilers"] as const) {
      expect(eventSource(v)).not.toBe(OTP_SOURCE);
    }
  });

  it("has a landing the board's QR can point at", () => {
    expect(EVENT_PATHS.otp).toBe("/onetrickpony");
    expect(playUrlFor("otp")).toContain("/onetrickpony");
  });

  it("runs the daylight screens, like the rest of the arc", () => {
    expect(usesDaylightScreens("otp")).toBe(true);
  });

  /**
   * The close /general reads says the score is "on its way to your inbox".
   * Nothing is, because nothing was collected - so this route must not say it.
   */
  it("promises nothing by email anywhere in its copy", () => {
    const report = boothReportFor("otp");
    expect(report.offer.body).not.toMatch(/inbox/i);

    const splash = copyFor("otp", "en").screens.otp.splash;
    const words = [splash.heading, splash.body, splash.cta].join(" ");
    expect(words).not.toMatch(/inbox|e-?mail/i);
  });

  it("keeps the rest of /general's close word for word", () => {
    const otp = boothReportFor("otp");
    const general = boothReportFor("general");
    expect(otp.offer.heading).toBe(general.offer.heading);
    expect(otp.offer.reassurance).toBe(general.offer.reassurance);
    expect(otp.offer.offerName).toBe(general.offer.offerName);
    expect(otp.stat).toBe(general.stat);
  });

  /**
   * The team rides inside the stored name so it survives a database with no
   * `team` column. The client composes the same string to ask the board where
   * it ranks, so the two must agree - a drift here shows up as players never
   * being told their standing.
   */
  it("folds the team into the name it stores and ranks by", () => {
    expect(boardNameFor("Adnan", "The Quizzengers")).toBe(
      "Adnan · The Quizzengers",
    );
  });

  it("leaves a name alone where no team was given", () => {
    expect(boardNameFor("Ada")).toBe("Ada");
    expect(boardNameFor("Ada", "   ")).toBe("Ada");
  });

  it("still carries the consent block in copy, for the day it asks again", () => {
    // Unused by the splash while this route takes no address (Event3Splash
    // renders neither the email field nor the block), but kept so that turning
    // the address back on cannot bring back a landing with no consent on it.
    expect(COPY.screens.otp.splash.consentForm).toBe(
      COPY.screens.general.splash.consentForm,
    );
  });
});
