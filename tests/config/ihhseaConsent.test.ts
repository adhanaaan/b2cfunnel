import { describe, expect, it } from "vitest";
import { COPY } from "@/config/copy";
import {
  IHHSEA_PRIVACY_POLICY_SECTIONS,
  PRIVACY_POLICY_SECTIONS,
} from "@/config/privacyPolicy";

/**
 * The regatta landing (Figma 638:7729) carries every consent itself: the two
 * the daylight landing has, and the partner's block as a third row. The
 * partner's words have to be the ones IHH supplied - the same clauses the v3
 * consent page shows - and the privacy link has to open the policy written for
 * this event, which is the one that names the partner it shares data with.
 */
describe("ihhsearegatta landing consents", () => {
  const splash = COPY.screens.ihhsearegatta.splash;
  const v3Consent = COPY.screens.event3.consent;

  it("puts the partner's clauses and the withdrawal right under one tick", () => {
    expect(splash.partnerConsent.clauses).toEqual([
      ...v3Consent.clauses,
      v3Consent.withdrawal,
    ]);
  });

  it("states each clause once", () => {
    const texts = splash.partnerConsent.clauses.map((c) => c.text);
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

  it("links the regatta's own privacy policy, and the others link the general one", () => {
    expect(splash.privacyHref).toBe("/ihhsearegatta/privacy-policy");
    for (const other of [
      COPY.screens.event3.splash,
      COPY.screens.rotary.splash,
      COPY.screens.ntuhomecoming.splash,
    ]) {
      expect(other.privacyHref).toBe("/privacy-policy");
    }
  });
});

describe("ihhsearegatta privacy policy", () => {
  const text = (sections: typeof PRIVACY_POLICY_SECTIONS) =>
    JSON.stringify(sections);

  it("keeps the general policy's thirteen sections, in order", () => {
    expect(IHHSEA_PRIVACY_POLICY_SECTIONS.map((s) => s.heading)).toEqual(
      PRIVACY_POLICY_SECTIONS.map((s) => s.heading),
    );
  });

  // The one thing that makes this policy the regatta's: it says what is
  // shared with the partner, and where the partner's own notice takes over.
  it("names the partner and what is shared with it", () => {
    const regatta = text(IHHSEA_PRIVACY_POLICY_SECTIONS);
    expect(regatta).toContain("IHH Healthcare Singapore");
    expect(regatta).toContain("IHH Singapore Personal Data Protection Notice");
    expect(regatta).toContain("Brain Health Score and factor profile with");
  });

  // The events with no partner must not tell players their data goes to one.
  it("keeps the partner out of the general policy", () => {
    expect(text(PRIVACY_POLICY_SECTIONS)).not.toContain("IHH");
  });
});
