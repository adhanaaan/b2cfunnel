import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { FunnelStep } from "@/types/funnel";
import type { Answers } from "@/types/question";
import { achievableAxisMax, resolveFlow } from "@/config/funnelFlow";
import {
  PHKL2_SOURCE,
  PHKL3_SOURCE,
  PHKL_SOURCE,
  eventSource,
} from "@/config/event";
import { EVENT_PATHS, playUrlFor } from "@/config/eventLinks";
import {
  isPreviewVariant,
  offersLanguageChoice,
  usesDaylightScreens,
} from "@/config/variants";
import { languagesFor } from "@/config/language";
import { COPY, arcCopyFor, copyFor } from "@/config/copy";
import {
  PHKL3_PODIUM_N,
  PHKL3_PRIZE,
  PHKL3_PRIZE_HEADLINE,
} from "@/config/phkl3";
import {
  GRAB_COUPON_IMAGE,
  GRAB_GIFT_BOX_IMAGE,
  GRAB_VOUCHER_IMAGE,
} from "@/config/prizeArt";

/**
 * /phkl-3 is /phkl-2 run again for a third activation, on a bucket of its own
 * and with a board of its own (Figma 892:7134).
 *
 * What must hold: the STEPS are /phkl's exactly, so every score recorded stays
 * comparable with the earlier activations; the three buckets differ, so no
 * room's board shows another's; the partner consent and the languages are
 * /phkl-2's; and the prize panel's total is the sum of its own ladder.
 */

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

describe("phkl-3 flow", () => {
  it("is /phkl's arc, step for step", () => {
    for (const answers of ANSWER_SETS) {
      expect(kindsIn(resolveFlow(answers, "phkl3"))).toEqual(
        kindsIn(resolveFlow(answers, "phkl")),
      );
      expect(idsIn(resolveFlow(answers, "phkl3"))).toEqual(
        idsIn(resolveFlow(answers, "phkl")),
      );
    }
  });

  it("scores on the same maxima, so the activations stay comparable", () => {
    for (const axis of ["risk", "symptom"] as const) {
      expect(achievableAxisMax("phkl3", axis)).toBe(
        achievableAxisMax("phkl", axis),
      );
    }
  });

  it("ranks in a bucket of its own, never /phkl's or /phkl-2's", () => {
    expect(eventSource("phkl3")).toBe(PHKL3_SOURCE);
    expect(PHKL3_SOURCE).not.toBe(PHKL_SOURCE);
    expect(PHKL3_SOURCE).not.toBe(PHKL2_SOURCE);
    expect(isPreviewVariant("phkl3")).toBe(false);
  });

  it("is served at its own route, and wears the daylight screens", () => {
    expect(EVENT_PATHS.phkl3).toBe("/phkl-3");
    expect(playUrlFor("phkl3")).toBe("https://brainhealthcheck.vercel.app/phkl-3");
    expect(usesDaylightScreens("phkl3")).toBe(true);
  });
});

describe("phkl-3 copy", () => {
  it("carries the partner consent, and links the policy on its own route", () => {
    // The same partner, so the same clauses - word for word.
    expect(COPY.screens.phkl3.splash.partnerConsent.clauses).toBe(
      COPY.screens.phkl.splash.partnerConsent.clauses,
    );
    expect(COPY.screens.phkl3.splash.privacyHref).toBe("/phkl-3/privacy-policy");
    expect(COPY.screens.phkl2.splash.privacyHref).toBe("/phkl-2/privacy-policy");
  });

  it("reads /phkl's report, so the offer cannot drift", () => {
    expect(arcCopyFor("phkl3").report).toEqual(arcCopyFor("phkl").report);
  });

  // Two ticks on this landing, both required: the one-tick authorisation in
  // place of the contact and tips rows, and the IHH block made a condition of
  // entry. /phkl and /phkl-2 keep their optional partner row.
  it("asks for two required ticks: the authorisation and the IHH consent", () => {
    const splash = COPY.screens.phkl3.splash;
    expect(splash.consentForm).toBe(COPY.screens["22grams"].splash.consentForm);
    expect(splash.partnerConsent.required).toBe(true);
    expect(splash.partnerConsent.requiredError).toBeTruthy();
    expect(COPY.screens.phkl.splash.partnerConsent.required).toBeUndefined();
    expect(COPY.screens.phkl2.splash.partnerConsent.required).toBeUndefined();
    expect(COPY.screens.phkl2.splash.consentForm).toBeUndefined();
  });

  it("asks for both ticks in every language it offers", () => {
    for (const { id } of languagesFor("phkl3")) {
      const splash = copyFor("phkl3", id).screens.phkl3.splash;
      expect(splash.partnerConsent.required, id).toBe(true);
      expect(splash.partnerConsent.clauses, id).toHaveLength(
        COPY.screens.phkl3.splash.partnerConsent.clauses.length,
      );
      if (id !== "en") {
        expect(splash.consentForm?.authorisation, id).not.toBe(
          COPY.screens.phkl3.splash.consentForm?.authorisation,
        );
        expect(splash.partnerConsent.requiredError, id).not.toBe(
          COPY.screens.phkl3.splash.partnerConsent.requiredError,
        );
        expect(splash.consentRequiredError, id).not.toBe(
          COPY.screens.phkl3.splash.consentRequiredError,
        );
      }
    }
  });

  it("offers /phkl-2's languages", () => {
    expect(offersLanguageChoice("phkl3")).toBe(true);
    expect(languagesFor("phkl3")).toEqual(languagesFor("phkl2"));
  });

  it("translates the landing, and keeps its own privacy link in every language", () => {
    for (const { id } of languagesFor("phkl3")) {
      const copy = copyFor("phkl3", id);
      expect(copy.screens.phkl3.splash.privacyHref, id).toBe(
        "/phkl-3/privacy-policy",
      );
      expect(copy.screens.phkl3.splash.cta, id).toBe(copy.screens.phkl2.splash.cta);
      if (id !== "en") {
        expect(copy.screens.phkl3.splash.cta, id).not.toBe(
          COPY.screens.phkl3.splash.cta,
        );
      }
    }
  });
});

describe("phkl-3 IHH consent, in every language", () => {
  // A required consent is only a consent if the player can read it: every
  // clause of IHH Healthcare Malaysia's block, and every link label in it,
  // must be in the language the landing is showing. The link targets are the
  // English block's in every language.
  it("translates every clause and link label, and keeps the links", () => {
    const en = COPY.screens.phkl3.splash.partnerConsent;
    for (const { id } of languagesFor("phkl3")) {
      if (id === "en") continue;
      const block = copyFor("phkl3", id).screens.phkl3.splash.partnerConsent;
      expect(block.clauses, id).toHaveLength(en.clauses.length);
      block.clauses.forEach((clause, i) => {
        expect(clause.text, `${id} clause ${i}`).not.toBe(en.clauses[i].text);
        expect(clause.text.includes("{link}"), `${id} clause ${i}`).toBe(
          en.clauses[i].link != null,
        );
        expect(clause.link?.href, `${id} clause ${i}`).toBe(en.clauses[i].link?.href);
        if (en.clauses[i].link && !en.clauses[i].link!.href.startsWith("mailto:")) {
          expect(clause.link?.label, `${id} clause ${i}`).not.toBe(en.clauses[i].link?.label);
        }
      });
      expect(block.requiredError, id).toBeTruthy();
      expect(block.requiredError, id).not.toBe(en.requiredError);
    }
  });
});

describe("phkl-3 prize", () => {
  it("is the ladder the design sets, in order", () => {
    expect(PHKL3_PRIZE.ladder.map((t) => [t.rank, t.label])).toEqual([
      ["1ST", "RM 200 voucher"],
      ["2ND", "RM 150 voucher"],
      ["3RD", "RM 50 voucher"],
    ]);
  });

  // The panel prints "Win a total of X" directly above the rows that add up
  // to X, so the total is summed from the ladder, and this holds it there.
  it("sums its headline total from the ladder rather than repeating it", () => {
    const sum = PHKL3_PRIZE.ladder.reduce((n, t) => n + t.ringgit, 0);
    expect(sum).toBe(400);
    expect(PHKL3_PRIZE.total).toBe(`RM ${sum}`);
    expect(PHKL3_PRIZE_HEADLINE).toEqual(["Win a total of", "RM 400 Grab Vouchers"]);
  });

  it("sets the podium depth the standings rank to", () => {
    expect(PHKL3_PODIUM_N).toBe(3);
    expect(PHKL3_PODIUM_N).toBe(PHKL3_PRIZE.ladder.length);
  });
});

/**
 * The Grab artwork is shared by every board with a Grab prize, from one folder.
 * The boards draw it through OptionalImage, so a path that points at nothing
 * fails silently - an empty prize panel on a TV, nothing in the console. This
 * is the loud version of that failure.
 */
describe("shared Grab prize art", () => {
  it("points at files that exist, in the shared folder", () => {
    for (const src of [GRAB_GIFT_BOX_IMAGE, GRAB_COUPON_IMAGE, GRAB_VOUCHER_IMAGE]) {
      expect(src).toMatch(/^\/images\/general\//);
      expect(existsSync(join(process.cwd(), "public", src)), src).toBe(true);
    }
  });
});
