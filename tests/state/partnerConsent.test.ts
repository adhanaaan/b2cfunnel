import { describe, expect, it } from "vitest";
import { createInitialState, funnelReducer } from "@/state/funnelMachine";
import { resolveFlow } from "@/config/funnelFlow";

/**
 * The partner (IHH) consent is taken on its own page before the game and
 * written much later - with the score, and again with the lead. So it has to
 * survive the whole session, and "declined" has to stay distinct from "never
 * asked": the first is a choice we are obliged to honour, the second is a
 * variant that has no consent page at all.
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
});
