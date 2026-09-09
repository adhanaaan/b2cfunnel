import { describe, expect, it, vi } from "vitest";
import type { FunnelStep } from "@/types/funnel";
import type { Answers } from "@/types/question";

/**
 * /ihh is the regatta arc on its own bucket: same landing, same invite, same
 * question set, with only the `source` tag and the switches differing. What
 * this file pins is exactly that - the two flows stay identical step for step,
 * so a change to one can never quietly leave the other behind - and that the
 * switches really are independent.
 *
 * Both challenge switches are pinned OPEN here so the arcs are compared like
 * for like; the independence of the switches is asserted below against the
 * mocked pair, one closed and one open.
 */
vi.mock("@/config/event", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/config/event")>()),
  EVENT3_CHALLENGE_CLOSED: false,
  IHHSEA_CHALLENGE_CLOSED: false,
  IHH_CHALLENGE_CLOSED: false,
}));

const { resolveFlow } = await import("@/config/funnelFlow");
const { eventSource, IHH_SOURCE, IHHSEA_SOURCE } = await import(
  "@/config/event"
);
const { usesDaylightScreens } = await import("@/config/variants");
const { isPreviewVariant } = await import("@/config/variants");
const { EVENT_PATHS } = await import("@/config/eventLinks");
const { COPY } = await import("@/config/copy");

const kindsIn = (flow: FunnelStep[]) => flow.map((s) => s.kind);

const ANSWER_SETS: Answers[] = [
  {},
  { forgetfulness: "notNotice" },
  { forgetfulness: "almostDaily", sex: "female" },
];

describe("ihh flow", () => {
  it("walks the regatta arc, step for step", () => {
    for (const answers of ANSWER_SETS) {
      expect(kindsIn(resolveFlow(answers, "ihh"))).toEqual(
        kindsIn(resolveFlow(answers, "ihhsearegatta")),
      );
    }
  });

  it("takes its consents on the landing, with no consent page", () => {
    const kinds = kindsIn(resolveFlow({}, "ihh"));
    expect(kinds).toContain("nameGate");
    expect(kinds).not.toContain("consent");
    expect(kinds).toContain("quizInvite");
  });

  it("runs the daylight screens and collects for real", () => {
    expect(usesDaylightScreens("ihh")).toBe(true);
    expect(isPreviewVariant("ihh")).toBe(false);
  });

  it("is served at /ihh", () => {
    expect(EVENT_PATHS.ihh).toBe("/ihh");
  });

  it("keeps the reader on /ihh for the privacy policy", () => {
    // The consent row's link: the regatta's copy would walk a reader off this
    // route mid-consent, so this is the one thing the copy block overrides.
    expect(COPY.screens.ihh.splash.privacyHref).toBe("/ihh/privacy-policy");
    expect(COPY.screens.ihhsearegatta.splash.privacyHref).toBe(
      "/ihhsearegatta/privacy-policy",
    );
  });

  it("writes its own column, never the regatta's", () => {
    expect(eventSource("ihh")).toBe(IHH_SOURCE);
    expect(IHH_SOURCE).not.toBe(IHHSEA_SOURCE);
  });
});

/**
 * The two events run the same arc, so a switch that reached across would close
 * an open event with no error anywhere - the failure this asserts against.
 */
describe("ihh and the regatta close independently", () => {
  it("closes /ihh without touching the regatta", async () => {
    vi.resetModules();
    vi.doMock("@/config/event", async (importOriginal) => ({
      ...(await importOriginal<typeof import("@/config/event")>()),
      IHHSEA_CHALLENGE_CLOSED: false,
      IHH_CHALLENGE_CLOSED: true,
    }));
    const flow = await import("@/config/funnelFlow");
    expect(kindsIn(flow.resolveFlow({}, "ihh"))).toEqual(["nameGate", "wrap"]);
    expect(kindsIn(flow.resolveFlow({}, "ihhsearegatta"))).toContain("game");
    vi.doUnmock("@/config/event");
    vi.resetModules();
  });

  it("closes the regatta without touching /ihh", async () => {
    vi.resetModules();
    vi.doMock("@/config/event", async (importOriginal) => ({
      ...(await importOriginal<typeof import("@/config/event")>()),
      IHHSEA_CHALLENGE_CLOSED: true,
      IHH_CHALLENGE_CLOSED: false,
    }));
    const flow = await import("@/config/funnelFlow");
    expect(kindsIn(flow.resolveFlow({}, "ihhsearegatta"))).toEqual([
      "nameGate",
      "wrap",
    ]);
    expect(kindsIn(flow.resolveFlow({}, "ihh"))).toContain("game");
    vi.doUnmock("@/config/event");
    vi.resetModules();
  });
});
