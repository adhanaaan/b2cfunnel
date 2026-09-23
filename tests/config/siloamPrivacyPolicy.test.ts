import { describe, expect, it } from "vitest";
import { languagesFor } from "@/config/language";
import type { SiloamPolicyLanguage as Language } from "@/config/privacyPolicyIndonesia";
import { PRIVACY } from "@/config/privacy";
import type { PolicyBlock, PolicySection } from "@/config/privacyPolicy";
import { PRIVACY_POLICY_SECTIONS } from "@/config/privacyPolicy";
import {
  INDONESIA_POLICY_LAW,
  SILOAM_PRIVACY_POLICY_SECTIONS,
} from "@/config/privacyPolicyIndonesia";
import { COPY, copyFor } from "@/config/copy";

/**
 * The summit's policy is the one document on this site written against another
 * country's law: Indonesia's UU No. 27/2022, not Singapore's PDPA 2012.
 *
 * None of what follows is legal review - a practitioner still has to sign the
 * text off. What it can do is hold the things that would make the document
 * wrong in ways nobody would notice on the page: the wrong statute named, a
 * right or a deadline quietly dropped, one language drifting out of step with
 * the other, or a contact address that no longer matches the one the rest of
 * the site answers on.
 */

const ALL = languagesFor("siloam").map((l) => l.id) as Language[];

/** Every string in a policy, headings included. */
function textOf(sections: PolicySection[]): string[] {
  const out: string[] = [];
  const walk = (block: PolicyBlock) => {
    if (typeof block === "string") out.push(block);
    else if ("list" in block) out.push(...block.list);
    else for (const [term, detail] of block.table) out.push(term, detail);
  };
  for (const section of sections) {
    out.push(section.heading);
    section.blocks.forEach(walk);
  }
  return out;
}

describe("the summit's privacy policy", () => {
  it("is written in both languages the landing offers", () => {
    for (const language of ALL) {
      expect(SILOAM_PRIVACY_POLICY_SECTIONS[language], language).toBeTruthy();
      expect(
        SILOAM_PRIVACY_POLICY_SECTIONS[language].length,
      ).toBeGreaterThan(0);
    }
  });

  // A translation that has quietly lost a section has lost a legal obligation
  // with it, and the page gives no sign of that.
  it("says the same number of things in each", () => {
    const [first, ...rest] = ALL;
    for (const language of rest) {
      expect(
        SILOAM_PRIVACY_POLICY_SECTIONS[language].length,
        `${language} has a different number of sections`,
      ).toBe(SILOAM_PRIVACY_POLICY_SECTIONS[first].length);
    }
    // And each section carries the same number of blocks, in order.
    for (const language of rest) {
      SILOAM_PRIVACY_POLICY_SECTIONS[language].forEach((section, i) => {
        expect(
          section.blocks.length,
          `${language} section ${i + 1} has a different number of blocks`,
        ).toBe(SILOAM_PRIVACY_POLICY_SECTIONS[first][i].blocks.length);
      });
    }
  });

  it("is numbered 1 to 14 in both, in order", () => {
    for (const language of ALL) {
      const numbers = SILOAM_PRIVACY_POLICY_SECTIONS[language].map((s) =>
        Number(s.heading.split(".")[0]),
      );
      expect(numbers, language).toEqual(
        Array.from({ length: numbers.length }, (_, i) => i + 1),
      );
    }
  });

  // The whole point of the rewrite: this event is not under Singapore's law,
  // and a policy that still named the PDPA would be telling Indonesian players
  // their rights come from a statute that does not give them.
  it("names Indonesia's statute, and not Singapore's", () => {
    for (const language of ALL) {
      const text = textOf(SILOAM_PRIVACY_POLICY_SECTIONS[language]).join(" ");
      expect(text, language).toMatch(/UU PDP/);
      expect(text, language).toMatch(/27/);
      expect(text, language).not.toMatch(/Personal Data Protection Act 2012/);
      expect(text, language).not.toMatch(/PDPA 2012/);
      // The PDPC is Singapore's regulator and has no jurisdiction here.
      expect(text, language).not.toMatch(/pdpc\.gov\.sg/);
    }
    expect(INDONESIA_POLICY_LAW.en).toContain("27 of 2022");
    expect(INDONESIA_POLICY_LAW.id).toContain("27 Tahun 2022");
  });

  // The general policy is unchanged and still Singapore's - the rewrite must
  // not have reached it.
  it("leaves every other policy on the PDPA", () => {
    const general = textOf(PRIVACY_POLICY_SECTIONS).join(" ");
    expect(general).toContain("Personal Data Protection Act 2012");
    expect(general).not.toContain("UU PDP");
  });

  /**
   * The obligations that differ from the PDPA and that this funnel actually
   * triggers. Each is a thing an Indonesian reader is entitled to find, and
   * each would be invisible by its absence.
   */
  it("answers the parts of the UU PDP this funnel triggers", () => {
    const en = textOf(SILOAM_PRIVACY_POLICY_SECTIONS.en).join(" ");
    const id = textOf(SILOAM_PRIVACY_POLICY_SECTIONS.id).join(" ");

    // Health data is "specific" personal data (art. 4(2)) - and the quiz
    // collects it, so the policy has to say so rather than burying it.
    expect(en).toMatch(/specific personal data/i);
    expect(id).toMatch(/data pribadi yang bersifat spesifik/i);

    // A lawful basis per purpose (art. 20(2)), not consent for everything.
    expect(en).toMatch(/20\(2\)/);
    expect(id).toMatch(/Pasal 20/);

    // The data leaves Indonesia the moment it is collected (art. 56).
    expect(en).toMatch(/56/);
    expect(id).toMatch(/Pasal 56/);

    // Breach notification is 3 x 24 hours (art. 46), not "as soon as able".
    expect(en).toMatch(/3 x 24 hours/);
    expect(id).toMatch(/3 x 24 jam/);

    // A Brain Health Score IS automated processing (art. 10).
    expect(en).toMatch(/automated processing/i);
    expect(id).toMatch(/pemrosesan otomatis/i);

    // Children (art. 25).
    expect(en).toMatch(/\b25\b/);
    expect(id).toMatch(/Pasal 25/);
  });

  // A policy that prints an address nobody reads, or a retention period the
  // rest of the site contradicts, fails at exactly the moment it matters.
  it("quotes the contact and retention the rest of the site uses", () => {
    for (const language of ALL) {
      const text = textOf(SILOAM_PRIVACY_POLICY_SECTIONS[language]).join(" ");
      expect(text, language).toContain(PRIVACY.dpoEmail);
      expect(text, language).toContain(PRIVACY.lastUpdated);
      expect(text, language).toContain(PRIVACY.organisation);
    }
    // The English one states the periods verbatim from the shared config; the
    // Indonesian one states the same spans in its own words, so it is checked
    // for the numbers rather than the sentence.
    const en = textOf(SILOAM_PRIVACY_POLICY_SECTIONS.en).join(" ");
    expect(en).toContain(PRIVACY.retention.leaderboard);
    expect(en).toContain(PRIVACY.retention.contact);
    const id = textOf(SILOAM_PRIVACY_POLICY_SECTIONS.id).join(" ");
    expect(id).toMatch(/6 bulan/);
    expect(id).toMatch(/24 bulan/);
  });

  it("is reachable from the landing that asks for the consent", () => {
    expect(COPY.screens.siloam.splash.privacyHref).toBe(
      "/siloamneurosciencesummit/privacy-policy",
    );
  });
});

describe("the summit's landing consent", () => {
  /**
   * UU PDP art. 22 requires a request for consent to be put in Indonesian and
   * to be plainly understandable. The landing is the request; the policy above
   * is what it points at. Both have to exist in Indonesian, or the consent an
   * Indonesian player gives was asked for in a language the law does not
   * accept.
   */
  it("is asked in Indonesian as well as English", () => {
    for (const language of ALL) {
      const form = copyFor("siloam", language).screens.siloam.splash
        .consentForm;
      expect(form, language).toBeDefined();
      expect(form?.heading, language).toBeTruthy();
      expect(form?.authorisation, language).toBeTruthy();
      expect(form?.registerNote, language).toBeTruthy();
    }
    const id = copyFor("siloam", "id").screens.siloam.splash.consentForm;
    expect(id?.heading).toContain("Dengan ini saya menyatakan");
    expect(id?.registerNote).toContain("Gray Matter Solutions");
    // Actually translated, not the English block showing through.
    expect(id?.authorisation).not.toBe(
      COPY.screens.siloam.splash.consentForm?.authorisation,
    );
  });

  /**
   * "Make the landing the same as /22grams" only stays true if it is checked.
   * Asserted against that event's own splash rather than against a literal, so
   * a change to either lands on both or fails here.
   *
   * Two fields are allowed to differ, and only two: the policy each links (the
   * summit's is under Indonesian law, /22grams' is the shared Singapore one),
   * and the label over the summit's language picker, which /22grams has no
   * picker to label.
   */
  it("is the same landing as /22grams, bar the policy it links", () => {
    const { privacyHref: a, languageLabel: _l, ...summit } =
      COPY.screens.siloam.splash;
    const { privacyHref: b, ...twentyTwo } = COPY.screens["22grams"].splash;
    expect(summit).toEqual(twentyTwo);
    expect(a).toBe("/siloamneurosciencesummit/privacy-policy");
    expect(b).not.toBe(a);
  });

  // The policy describes the ONE-TICK shape - registering as the marketing
  // consent. If the landing went back to two ticks, section 4 would be
  // describing a screen that no longer exists.
  it("is the one-tick shape the policy describes", () => {
    expect(COPY.screens.siloam.splash.consentForm).toBe(
      COPY.screens["22grams"].splash.consentForm,
    );
    for (const language of ALL) {
      const section = SILOAM_PRIVACY_POLICY_SECTIONS[language][3];
      expect(section.heading, language).toMatch(/4\./);
      const text = textOf([section]).join(" ");
      expect(text.length, language).toBeGreaterThan(200);
    }
  });
});
