import { describe, expect, it } from "vitest";
import {
  DEFAULT_LANGUAGE,
  LANGUAGES,
  isLanguage,
  languagesFor,
  languageLabel,
  type Language,
} from "@/config/language";
import { COPY, arcCopyFor, copyFor } from "@/config/copy";
import { COPY_BY_LANGUAGE } from "@/config/copy.translations";
import { QUESTIONS, questionsByIdFor, questionsFor } from "@/config/questions";
import { pickActions } from "@/config/actions";
import { deepMerge } from "@/lib/deepMerge";
import { ordinal, ordinalFor } from "@/lib/format";
import { achievableAxisMax } from "@/config/funnelFlow";
import { computeScore } from "@/engine/scoring";
import type { Answers } from "@/types/question";

/**
 * The Siloam summit can be read in English or Bahasa Indonesia. Two things
 * have to be true of that, and both fail silently if they stop being true:
 *
 * 1. The language changes WORDS AND NOTHING ELSE. Not a score, not a weight,
 *    not a branch, not which of three actions a player is given. An
 *    Indonesian player and an English one with the same answers must get the
 *    same number.
 * 2. Every English-only event is untouched by the layer existing. `copyFor`
 *    hands them the COPY object itself, so nothing merged can reach them.
 */

const ALL_LANGUAGES: Language[] = LANGUAGES.map((l) => l.id);
const TRANSLATIONS = ALL_LANGUAGES.filter((l) => l !== "en");

describe("the language list", () => {
  // The brief was explicit: English and Bahasa Indonesia, and NOT the Mandarin
  // and Bahasa Melayu the ReCOGnAIze assessment offers. Neither belongs at an
  // Indonesian summit, and both are one careless shared edit away - the build
  // now carries 中文 for /phkl-2, so the summit's own list is what is pinned.
  it("offers the summit English and Bahasa Indonesia, and only those two", () => {
    const summit = languagesFor("siloam");
    expect(summit.map((l) => l.id)).toEqual(["en", "id"]);
    expect(summit.map((l) => l.label)).toEqual([
      "English",
      "Bahasa Indonesia",
    ]);
    const labels = summit.map((l) => l.label.toLowerCase()).join(" ");
    for (const gone of ["melayu", "mandarin", "chinese", "中文"]) {
      expect(labels, `${gone} must not be offered`).not.toContain(gone);
    }
  });

  it("opens on a language every string is written in", () => {
    expect(DEFAULT_LANGUAGE).toBe("en");
    expect(isLanguage(DEFAULT_LANGUAGE)).toBe(true);
  });

  it("rejects anything that is not a language it can render", () => {
    for (const bad of ["ms-MY", "zh-TW", "", null, undefined, 7]) {
      expect(isLanguage(bad)).toBe(false);
    }
    expect(languageLabel("id")).toBe("Bahasa Indonesia");
  });

  // A language in the picker with no overlay behind it would switch to a page
  // that is still entirely English - a control that does nothing, which is
  // worse than no control.
  it("ships a translation for every language it offers", () => {
    for (const language of TRANSLATIONS) {
      expect(COPY_BY_LANGUAGE[language], language).toBeTruthy();
    }
  });
});

describe("copyFor", () => {
  // The whole containment argument for this layer: an English-only event is
  // handed the same object it was handed before any of this existed, so no
  // translation can change what it renders.
  it("hands English events the COPY object itself, not a copy of it", () => {
    expect(copyFor("phkl", "en")).toBe(COPY);
    expect(copyFor("siloam", "en")).toBe(COPY);
  });

  it("is stable, so screens do not re-render on identity alone", () => {
    expect(copyFor("siloam", "id")).toBe(copyFor("siloam", "id"));
  });

  it("leaves the English config untouched when it merges", () => {
    const before = JSON.stringify(COPY);
    copyFor("siloam", "id");
    expect(JSON.stringify(COPY)).toBe(before);
  });

  it("translates the summit's screens", () => {
    const id = copyFor("siloam", "id");
    expect(id.screens.siloam.splash.cta).toBe("Mulai tantangan");
    expect(id.screens.siloam.rail.resultsLabel).toBe("Hasil");
    expect(id.screens.siloam.report.header.timeLabel).toBe("Waktu");
    expect(id.screens.siloam.report.offer.cta).toBe("Temui tim kami di booth");
    // The notice behind the landing. Both halves have to arrive translated:
    // the results are settled, and the game is still open - a player told only
    // the first, in a language they read, would put the phone down.
    expect(id.screens.siloam.scoresFinal.cta).toBe("Tetap mainkan");
    expect(id.screens.siloam.scoresFinal.heading).not.toBe(
      COPY.screens.siloam.scoresFinal.heading,
    );
    expect(id.screens.siloam.scoresFinal.note).not.toBe(
      COPY.screens.siloam.scoresFinal.note,
    );
    expect(id.screens.symbolMatch.go).toBe("MULAI!");
    expect(id.bandLabels.moderate).toBe("Risiko sedang");
    expect(arcCopyFor("siloam", id)).toBe(id.screens.siloam);
  });

  // The failure mode worth designing for: something nobody translated should
  // read as English, never as a blank.
  it("falls back to English for anything a translation leaves out", () => {
    const id = copyFor("siloam", "id");
    // Never translated: no Indonesian player reaches the paywall.
    expect(id.screens.paywall.price).toBe(COPY.screens.paywall.price);
    expect(id.screens.booking.title).toBe(COPY.screens.booking.title);
  });
});

describe("deepMerge", () => {
  it("merges objects key by key and leaves the base alone", () => {
    const base = { a: 1, nested: { x: "en", y: "en" } };
    const out = deepMerge(base, { nested: { y: "id" } });
    expect(out).toEqual({ a: 1, nested: { x: "en", y: "id" } });
    expect(base.nested.y).toBe("en");
  });

  // Load-bearing: a list of consent clauses or report paragraphs only reads
  // correctly as a set, and a per-index merge would leave one English
  // paragraph inside an Indonesian block.
  it("replaces arrays whole rather than merging them element by element", () => {
    const out = deepMerge({ list: ["a", "b", "c"] }, { list: ["x"] });
    expect(out.list).toEqual(["x"]);
  });

  it("is the identity when there is no overlay", () => {
    const base = { a: 1 };
    expect(deepMerge(base, undefined)).toBe(base);
  });
});

describe("the question bank in another language", () => {
  it("hands English the bank itself", () => {
    expect(questionsFor("en")).toBe(QUESTIONS);
    expect(questionsByIdFor("en").age).toBe(
      QUESTIONS.find((q) => q.id === "age"),
    );
  });

  it("translates the prompts and the option labels", () => {
    const id = questionsByIdFor("id");
    expect(id.age.prompt).toBe("Berapa usia Anda?");
    expect(id.age.options?.[0].label).toBe("18 hingga 29");
    expect(id.sleep.helpText).toBeUndefined(); // the English question has none
    expect(id.alcohol.helpText).toContain("1 gelas");
  });

  // THE assertion this file exists for. A translation that could move a score
  // would put an Indonesian player on a different scale from every score
  // already recorded, and nothing on screen would say so.
  it("carries every id, score, axis and branch across untouched", () => {
    for (const language of ALL_LANGUAGES) {
      const translated = questionsFor(language);
      expect(translated).toHaveLength(QUESTIONS.length);
      translated.forEach((q, i) => {
        const base = QUESTIONS[i];
        expect(q.id).toBe(base.id);
        expect(q.axis).toBe(base.axis);
        expect(q.type).toBe(base.type);
        expect(q.control).toBe(base.control);
        expect(q.multiSelect).toBe(base.multiSelect);
        expect(q.showIf).toEqual(base.showIf);
        expect(q.options?.map((o) => o.id)).toEqual(
          base.options?.map((o) => o.id),
        );
        expect(q.options?.map((o) => o.score)).toEqual(
          base.options?.map((o) => o.score),
        );
        expect(q.options?.map((o) => o.personaSignal)).toEqual(
          base.options?.map((o) => o.personaSignal),
        );
      });
    }
  });

  // Scoring reads the English bank directly (the engine never sees a
  // translation), so this is belt and braces on top of the assertion above.
  it("scores an Indonesian walk-through exactly as an English one", () => {
    const answers: Answers = {
      age: "60+",
      sex: "female",
      highBp: "yes",
      highCholesterol: "yes",
      diabetes: "no",
      smoking: "current",
      sleep: "lt6",
      exercise: "lt75",
      diet: "poor",
      alcohol: "gt21",
      tracks: ["family"],
      concentrating: "almostDaily",
      judgement: "severalWeek",
      forgetfulness: "almostDaily",
      persistence: "yes",
    };
    expect(computeScore(answers, "siloam")).toEqual(
      computeScore(answers, "phkl"),
    );
    for (const axis of ["risk", "symptom"] as const) {
      expect(achievableAxisMax("siloam", axis)).toBe(
        achievableAxisMax("phkl", axis),
      );
    }
  });
});

describe("the three actions in another language", () => {
  const input = {
    drivingFactors: [{ id: "sleep" }, { id: "highBp" }],
    band: "elevated" as const,
    gameTimeMs: 41800,
  };

  it("picks the same three, and only changes the words", () => {
    const en = pickActions(input);
    const id = pickActions({ ...input, language: "id" });
    expect(id).toHaveLength(en.length);
    expect(id).toHaveLength(3);
    for (const [i, text] of id.entries()) {
      expect(text, `action ${i} was not translated`).not.toBe(en[i]);
    }
    expect(id[1]).toContain("tidur"); // the sleep factor, in order
  });

  it("falls back to English rather than dropping a row", () => {
    const id = pickActions({
      drivingFactors: [{ id: "notATranslatedFactor" }],
      band: "low",
      language: "id",
    });
    expect(id).toHaveLength(3);
  });
});

describe("ordinals", () => {
  // "{ordinal} record" is one string in both languages, and English suffixes
  // where Bahasa Indonesia prefixes - so the heading can only work if this
  // does.
  it("suffixes in English and prefixes in Bahasa Indonesia", () => {
    expect(ordinalFor(1, "en")).toBe("1st");
    expect(ordinalFor(2, "en")).toBe("2nd");
    expect(ordinalFor(11, "en")).toBe("11th");
    expect(ordinalFor(1, "id")).toBe("ke-1");
    expect(ordinalFor(2, "id")).toBe("ke-2");
    expect(ordinalFor(11, "id")).toBe("ke-11");
  });

  it("leaves the English helper exactly as it was", () => {
    for (const n of [1, 2, 3, 4, 11, 12, 13, 21, 22, 101]) {
      expect(ordinalFor(n, "en")).toBe(ordinal(n));
    }
  });
});

describe("the placeholders the summit's screens fill in", () => {
  // A typo in a brace prints "{name}" to the player, in a language nobody on
  // the team is reading the screen in.
  it("survives translation", () => {
    for (const language of ALL_LANGUAGES) {
      const c = copyFor("siloam", language).screens.siloam;
      expect(c.quizIntro.heading, language).toContain("{name}");
      expect(c.quizIntro.headingAnonymous, language).not.toContain("{");
      expect(c.analysing.heading, language).toContain("{name}");
      expect(c.analysing.headingAnonymous, language).not.toContain("{");
      expect(c.report.header.heading, language).toContain("{name}");
      expect(c.report.header.heading, language).toContain("{ordinal}");
      expect(c.report.header.headingAnonymous, language).toContain("{ordinal}");
      expect(c.report.risk.factorsLead, language).toContain("{name}");
      expect(c.report.risk.factorsLeadAnonymous, language).not.toContain("{");

      const sm = copyFor("siloam", language).screens.symbolMatch;
      expect(sm.readyLine, language).toContain("{count}");
      expect(sm.tour.findMatch, language).toContain("{number}");
      expect(sm.tour.tapNumber, language).toContain("{number}");

      const share = copyFor("siloam", language).screens.event3.share;
      expect(share.text, language).toContain("{time}");
      expect(share.rankLine, language).toContain("{rank}");
      expect(share.rankLine, language).toContain("{total}");
      // The share ladder appends the play URL under the last line.
      expect(share.cta.trimEnd().endsWith(":"), language).toBe(true);
    }
  });

  // The landing's hero and its required consent row mark their emphasis with
  // *asterisks*, in pairs. An odd one renders a literal asterisk to the player.
  it("keeps the emphasis markers paired", () => {
    for (const language of ALL_LANGUAGES) {
      const splash = copyFor("siloam", language).screens.siloam.splash;
      for (const line of [splash.heading, splash.consentRequired]) {
        expect((line.match(/\*/g) ?? []).length % 2, `${language}: ${line}`).toBe(
          0,
        );
      }
      const speedIntro = copyFor("siloam", language).screens.siloam.speedIntro;
      expect((speedIntro.body.match(/\*/g) ?? []).length % 2).toBe(0);
      const scoresFinal = copyFor("siloam", language).screens.siloam.scoresFinal;
      for (const line of [scoresFinal.body, scoresFinal.note]) {
        expect((line.match(/\*/g) ?? []).length % 2, `${language}: ${line}`).toBe(
          0,
        );
      }
      // Nothing on this page is filled in at render time, in any language.
      for (const line of Object.values(scoresFinal)) {
        expect(line, language).not.toContain("{");
      }
    }
  });

  // The serif/plain device alternates fragment by fragment, starting plain, so
  // a translation with a different number of fragments emphasises the wrong
  // words rather than failing.
  it("keeps the alternating fragments in step with English", () => {
    for (const language of TRANSLATIONS) {
      const siloam = copyFor("siloam", language).screens.siloam;
      const c = siloam.report;
      expect(c.speed.headingParts).toHaveLength(
        COPY.screens.siloam.report.speed.headingParts.length,
      );
      expect(c.wrapUp.quoteParts).toHaveLength(
        COPY.screens.siloam.report.wrapUp.quoteParts.length,
      );
      expect(c.baseline.axes).toHaveLength(5);
      expect(c.baseline.paragraphs).toHaveLength(
        COPY.screens.siloam.report.baseline.paragraphs.length,
      );
      expect(siloam.analysing.steps).toHaveLength(
        COPY.screens.siloam.analysing.steps.length,
      );
      expect(siloam.quizIntro.factors).toHaveLength(3);
      expect(c.offer.offerPoints).toHaveLength(
        COPY.screens.siloam.report.offer.offerPoints.length,
      );
    }
  });
});
