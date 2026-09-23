import { describe, expect, it } from "vitest";
import { languagesFor, type Language } from "@/config/language";
import {
  COPY,
  arcCopyFor,
  copyFor,
  phklReportFor,
  reportStatFor,
} from "@/config/copy";
import { questionsByIdFor } from "@/config/questions";
import { pickActions } from "@/config/actions";
import { offersLanguageChoice } from "@/config/variants";
import { ordinalFor } from "@/lib/format";
import { STAT_CARDS_BY_ID } from "@/config/statCards";

/**
 * /phkl-2 can be read in English, 中文 or Bahasa Indonesia. As on the summit,
 * the language changes words and nothing else, and /phkl - which reads the
 * same `phkl` block - stays English-only.
 */

const PHKL2_LANGUAGES: Language[] = languagesFor("phkl2").map((l) => l.id);
const TRANSLATIONS = PHKL2_LANGUAGES.filter((l) => l !== "en");

const pairedStars = (line: string) => (line.match(/\*/g) ?? []).length % 2 === 0;

describe("the /phkl-2 picker", () => {
  it("offers English, 中文 and Bahasa Indonesia, in that order", () => {
    expect(languagesFor("phkl2").map((l) => l.label)).toEqual([
      "English",
      "中文",
      "Bahasa Indonesia",
    ]);
  });

  it("is offered on /phkl-2 and not on /phkl", () => {
    expect(offersLanguageChoice("phkl2")).toBe(true);
    expect(offersLanguageChoice("phkl")).toBe(false);
    expect(languagesFor("phkl").map((l) => l.id)).toEqual(["en"]);
  });
});

describe("the /phkl-2 copy in another language", () => {
  it("leaves the English config the one /phkl renders", () => {
    expect(copyFor("phkl", "en")).toBe(COPY);
    expect(reportStatFor("phkl", COPY)).toBe(STAT_CARDS_BY_ID.lancet2024);
  });

  it("translates the landing, the arc and the report", () => {
    for (const language of TRANSLATIONS) {
      const copy = copyFor("phkl2", language);
      const en = COPY.screens;
      expect(copy.screens.phkl2.splash.cta, language).not.toBe(en.phkl2.splash.cta);
      expect(copy.screens.phkl2.splash.body, language).not.toBe(en.phkl2.splash.body);
      expect(arcCopyFor("phkl2", copy).speedIntro.heading, language).not.toBe(
        en.phkl.speedIntro.heading,
      );
      expect(phklReportFor("phkl2", copy).wrapUp.thinkingHeading, language).not.toBe(
        en.phkl.report.wrapUp.thinkingHeading,
      );
      expect(copy.screens.phkl.report.offer.cta, language).not.toBe(
        en.phkl.report.offer.cta,
      );
      expect(copy.screens.phkl.report.sticky.book, language).not.toBe(
        en.phkl.report.sticky.book,
      );
      expect(reportStatFor("phkl2", copy).body, language).not.toBe(
        STAT_CARDS_BY_ID.lancet2024.body,
      );
      expect(copy.quiz.continue, language).not.toBe(COPY.quiz.continue);
    }
  });

  // Only the words move: the privacy link, the price and the partner's links
  // are the English block's, in every language.
  it("keeps the links and the price", () => {
    for (const language of PHKL2_LANGUAGES) {
      const copy = copyFor("phkl2", language);
      expect(copy.screens.phkl2.splash.privacyHref).toBe("/phkl-2/privacy-policy");
      expect(copy.screens.phkl.splash.privacyHref).toBe("/phkl/privacy-policy");
      expect(copy.screens.phkl.report.offer.poster.price).toBe("RM460");
      const links = copy.screens.phkl2.splash.partnerConsent.clauses.map(
        (c) => c.link?.href,
      );
      expect(links).toEqual(
        COPY.screens.phkl2.splash.partnerConsent.clauses.map((c) => c.link?.href),
      );
      for (const clause of copy.screens.phkl2.splash.partnerConsent.clauses) {
        expect(clause.text.includes("{link}"), language).toBe(clause.link != null);
      }
    }
  });

  it("keeps every placeholder and emphasis marker", () => {
    for (const language of PHKL2_LANGUAGES) {
      const copy = copyFor("phkl2", language);
      const arc = arcCopyFor("phkl2", copy);
      const splash = copy.screens.phkl2.splash;
      expect(pairedStars(splash.heading), language).toBe(true);
      expect(pairedStars(splash.consentRequired), language).toBe(true);
      expect(pairedStars(arc.speedIntro.body), language).toBe(true);
      expect(arc.quizIntro.heading, language).toContain("{name}");
      expect(arc.analysing.heading, language).toContain("{name}");
      expect(arc.report.header.heading, language).toContain("{name}");
      expect(arc.report.header.heading, language).toContain("{ordinal}");
      expect(arc.report.header.headingAnonymous, language).toContain("{ordinal}");
      expect(arc.report.risk.factorsLead, language).toContain("{name}");
      expect(copy.quiz.progress, language).toContain("{current}");
      expect(copy.quiz.progress, language).toContain("{total}");
      expect(copy.screens.event3.share.cta.trimEnd().endsWith(":"), language).toBe(
        true,
      );
    }
  });

  // The serif/plain device alternates fragment by fragment, so a translation
  // with a different number of fragments emphasises the wrong words.
  it("keeps the alternating fragments in step with English", () => {
    const en = COPY.screens.phkl;
    for (const language of TRANSLATIONS) {
      const c = copyFor("phkl2", language).screens.phkl;
      expect(c.report.speed.headingParts).toHaveLength(en.report.speed.headingParts.length);
      expect(c.report.wrapUp.quoteParts).toHaveLength(en.report.wrapUp.quoteParts.length);
      expect(c.report.offer.proofParts).toHaveLength(en.report.offer.proofParts.length);
      expect(c.report.offer.assessmentHeading).toHaveLength(2);
      expect(c.report.baseline.axes).toHaveLength(5);
      expect(c.analysing.steps).toHaveLength(en.analysing.steps.length);
      expect(c.quizIntro.factors).toHaveLength(3);
      expect(c.splash.partnerConsent.clauses).toHaveLength(
        en.splash.partnerConsent.clauses.length,
      );
    }
  });
});

describe("the question bank in 中文", () => {
  it("translates the age screen's options", () => {
    expect(questionsByIdFor("zh").age.options?.[0].label).toBe("18 至 29 岁");
    expect(questionsByIdFor("zh").age.options?.[0].score).toBe(0);
  });

  it("picks the same three actions, in other words", () => {
    const input = {
      drivingFactors: [{ id: "sleep" }, { id: "highBp" }],
      band: "elevated" as const,
      gameTimeMs: 41800,
    };
    const en = pickActions(input);
    const zh = pickActions({ ...input, language: "zh" });
    expect(zh).toHaveLength(3);
    zh.forEach((text, i) => expect(text).not.toBe(en[i]));
  });

  it("wraps the ordinal", () => {
    expect(ordinalFor(1, "zh")).toBe("第1次");
    expect(ordinalFor(12, "zh")).toBe("第12次");
  });
});
