import { describe, expect, it } from "vitest";
import { createInitialState, funnelReducer } from "@/state/funnelMachine";

/**
 * The landing-page consent has to survive the whole session: it is captured on
 * the first screen but written with the score (after the game) and the lead
 * (after the report is built). "Never asked" must stay distinct from "declined".
 */
describe("tips consent in funnel state", () => {
  const state = createInitialState("event3");

  it("starts unknown", () => {
    expect(state.tipsConsent).toBeUndefined();
  });

  it("records a ticked box", () => {
    const next = funnelReducer(state, {
      type: "SUBMIT_EMAIL",
      name: "Ada",
      email: "ada@example.com",
      tipsConsent: true,
    });
    expect(next.tipsConsent).toBe(true);
  });

  it("records an unticked box as false, not unknown", () => {
    const next = funnelReducer(state, {
      type: "SUBMIT_EMAIL",
      name: "Ada",
      email: "ada@example.com",
      tipsConsent: false,
    });
    expect(next.tipsConsent).toBe(false);
  });

  it("leaves it unknown for gates that never ask", () => {
    const next = funnelReducer(createInitialState("event2"), {
      type: "SUBMIT_EMAIL",
      name: "Ada",
      email: "ada@example.com",
    });
    expect(next.tipsConsent).toBeUndefined();
  });
});
