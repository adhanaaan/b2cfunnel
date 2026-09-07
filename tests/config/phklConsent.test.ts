import { describe, expect, it } from "vitest";
import { COPY } from "@/config/copy";
import {
  IHHSEA_PRIVACY_POLICY_SECTIONS,
  PHKL_PRIVACY_POLICY_SECTIONS,
  PRIVACY_POLICY_SECTIONS,
} from "@/config/privacyPolicy";

/**
 * The PHKL landing (Figma 697:24953) is the regatta's with the partner's
 * Malaysian wording: every clause names IHH Healthcare Malaysia, the notice
 * link and the DPO are the Malaysian ones, and the privacy link opens the
 * policy written for this event. The Singapore wording must stay exactly
 * where it was, on the regatta.
 */
describe("phkl landing consents", () => {
  const splash = COPY.screens.phkl.splash;
  const clauses = splash.partnerConsent.clauses;

  it("puts the partner's four clauses under one tick", () => {
    expect(clauses).toHaveLength(4);
    for (const clause of clauses) {
      expect(clause.text).toContain("Malaysia");
      expect(clause.text).not.toContain("Singapore");
    }
  });

  it("links the Malaysian data protection notice and DPO", () => {
    expect(clauses[0].link).toEqual({
      label: "IHH Healthcare Malaysia Data Protection Notice",
      href: "https://www.ihhhealthcare.com/my/data-protection-notice",
    });
    expect(clauses[3].link).toEqual({
      label: "my.ihh.dpo@ihhhealthcare.com",
      href: "mailto:my.ihh.dpo@ihhhealthcare.com",
    });
  });

  it("states each clause once", () => {
    const texts = clauses.map((c) => c.text);
    expect(new Set(texts).size).toBe(texts.length);
  });

  it("keeps the two consents every daylight landing has", () => {
    expect(splash.consentRequired).toBe(
      COPY.screens.rotary.splash.consentRequired,
    );
    expect(splash.consentMarketing).toBe(
      COPY.screens.event3.splash.consentMarketing,
    );
  });

  it("links its own privacy policy, and leaves the regatta's alone", () => {
    expect(splash.privacyHref).toBe("/phkl/privacy-policy");
    expect(COPY.screens.ihhsearegatta.splash.privacyHref).toBe(
      "/ihhsearegatta/privacy-policy",
    );
  });

  it("leaves the regatta's Singapore wording untouched", () => {
    for (const clause of COPY.screens.ihhsearegatta.splash.partnerConsent.clauses) {
      expect(clause.text).toContain("Singapore");
      expect(clause.text).not.toContain("Malaysia");
    }
  });
});

describe("phkl privacy policy", () => {
  const text = (sections: typeof PRIVACY_POLICY_SECTIONS) =>
    JSON.stringify(sections);

  it("keeps the general policy's thirteen sections, in order", () => {
    expect(PHKL_PRIVACY_POLICY_SECTIONS.map((s) => s.heading)).toEqual(
      PRIVACY_POLICY_SECTIONS.map((s) => s.heading),
    );
  });

  it("names the Malaysian partner and what is shared with it", () => {
    const phkl = text(PHKL_PRIVACY_POLICY_SECTIONS);
    expect(phkl).toContain("IHH Healthcare Malaysia");
    expect(phkl).toContain("IHH Healthcare Malaysia Data Protection Notice");
    expect(phkl).toContain("Brain Health Score and factor profile with");
    expect(phkl).not.toContain("IHH Healthcare Singapore");
  });

  it("is the regatta policy with only the partner changed", () => {
    const regatta = text(IHHSEA_PRIVACY_POLICY_SECTIONS)
      .replaceAll("IHH Singapore Personal Data Protection Notice", "NOTICE")
      .replaceAll("IHH Healthcare Singapore", "PARTNER");
    const phkl = text(PHKL_PRIVACY_POLICY_SECTIONS)
      .replaceAll("IHH Healthcare Malaysia Data Protection Notice", "NOTICE")
      .replaceAll("IHH Healthcare Malaysia", "PARTNER");
    expect(phkl).toBe(regatta);
  });

  it("keeps every partner out of the general policy", () => {
    expect(text(PRIVACY_POLICY_SECTIONS)).not.toContain("IHH");
  });
});
