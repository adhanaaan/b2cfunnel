import { describe, expect, it } from "vitest";
import { createInitialState, funnelReducer } from "@/state/funnelMachine";
import { resolveFlow } from "@/config/funnelFlow";

/**
 * The partner (IHH) consent is taken before the game - on its own page on
 * /event-v3, on the landing on /ihhsearegatta - and written much later: with
 * the score, and again with the lead. So it has to survive the whole session,
 * and "declined" has to stay distinct from "never asked": the first is a choice
 * we are obliged to honour, the second is a variant that never asks for it.
 */
describe("partner consent in funnel state", () => {
  const state = createInitialState("event3");

  it("starts unknown", () => {
    expect(state.partnerConsent).toBeUndefined();
  });

  it("records a ticked box", () => {
    const next = funnelReducer(state, {
      type: "SUBMIT_CONSENT",
      partnerConsent: true,
    });
    expect(next.partnerConsent).toBe(true);
  });

  it("records an unticked box as false, not unknown", () => {
    const next = funnelReducer(state, {
      type: "SUBMIT_CONSENT",
      partnerConsent: false,
    });
    expect(next.partnerConsent).toBe(false);
  });

  it("stays unknown for variants with no consent page", () => {
    expect(createInitialState("event2").partnerConsent).toBeUndefined();
    expect(resolveFlow({}, "event2").map((s) => s.kind)).not.toContain(
      "consent",
    );
  });

  // Declining must not be a dead end: the page is not a gate, so an unticked
  // box advances exactly as far as a ticked one.
  it("advances whether or not the box was ticked", () => {
    const agreed = funnelReducer(state, {
      type: "SUBMIT_CONSENT",
      partnerConsent: true,
    });
    const declined = funnelReducer(state, {
      type: "SUBMIT_CONSENT",
      partnerConsent: false,
    });
    expect(declined.cursor).toBe(agreed.cursor);
    expect(declined.cursor).toBe(state.cursor + 1);
  });

  it("keeps the tips consent it was given on the landing", () => {
    const captured = funnelReducer(state, {
      type: "SUBMIT_EMAIL",
      name: "Ada",
      email: "ada@example.com",
      tipsConsent: true,
    });
    const next = funnelReducer(captured, {
      type: "SUBMIT_CONSENT",
      partnerConsent: false,
    });
    expect(next.tipsConsent).toBe(true);
    expect(next.partnerConsent).toBe(false);
    expect(next.email).toBe("ada@example.com");
  });

  // The regatta asks for the partner's consent on the landing, so it arrives
  // with the name and email rather than on a page of its own - and has to be
  // held with the same three states.
  describe("taken on the landing", () => {
    const regatta = createInitialState("ihhsearegatta");

    it("records a ticked box", () => {
      const next = funnelReducer(regatta, {
        type: "SUBMIT_EMAIL",
        name: "Ada",
        email: "ada@example.com",
        tipsConsent: false,
        partnerConsent: true,
      });
      expect(next.partnerConsent).toBe(true);
      expect(next.tipsConsent).toBe(false);
    });

    it("records an unticked box as false, not unknown", () => {
      const next = funnelReducer(regatta, {
        type: "SUBMIT_EMAIL",
        name: "Ada",
        email: "ada@example.com",
        tipsConsent: true,
        partnerConsent: false,
      });
      expect(next.partnerConsent).toBe(false);
    });

    // A landing with no partner row passes nothing, and that must not read as
    // a decline: it is the "never asked" state the database stores as null.
    it("leaves it unknown for landings that never ask", () => {
      const next = funnelReducer(createInitialState("rotary"), {
        type: "SUBMIT_EMAIL",
        name: "Ada",
        email: "ada@example.com",
        tipsConsent: true,
      });
      expect(next.partnerConsent).toBeUndefined();
    });

    it("has no consent page to take it a second time", () => {
      expect(resolveFlow({}, "ihhsearegatta").map((s) => s.kind)).not.toContain(
        "consent",
      );
    });
  });
});
