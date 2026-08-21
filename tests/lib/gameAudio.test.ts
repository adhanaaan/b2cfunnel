import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  MUSIC_SCALE,
  noteForStep,
  stepMsForProgress,
} from "@/lib/gameAudio";

describe("music bed timing", () => {
  it("tightens the figure as the run progresses", () => {
    const start = stepMsForProgress(0);
    const end = stepMsForProgress(1);
    expect(start).toBeGreaterThan(end);
    // Monotonic across the run, so the tempo never lurches backwards.
    let previous = start;
    for (let i = 1; i <= 20; i++) {
      const next = stepMsForProgress(i / 20);
      expect(next).toBeLessThanOrEqual(previous);
      previous = next;
    }
  });

  it("clamps progress outside 0..1", () => {
    expect(stepMsForProgress(-5)).toBe(stepMsForProgress(0));
    expect(stepMsForProgress(99)).toBe(stepMsForProgress(1));
    expect(Number.isFinite(stepMsForProgress(Number.NaN))).toBe(true);
  });

  it("stays inside a tempo range a booth can live with all day", () => {
    for (let i = 0; i <= 20; i++) {
      const ms = stepMsForProgress(i / 20);
      expect(ms).toBeGreaterThanOrEqual(200);
      expect(ms).toBeLessThanOrEqual(400);
    }
  });
});

describe("note selection", () => {
  it("only ever plays notes from the scale", () => {
    for (let step = -40; step < 200; step++) {
      const note = noteForStep(step);
      if (note !== null) expect(MUSIC_SCALE).toContain(note);
    }
  });

  it("leaves rests in the figure so it does not drone", () => {
    const window = Array.from({ length: 16 }, (_, i) => noteForStep(i));
    expect(window.filter((n) => n === null).length).toBeGreaterThan(3);
    expect(window.filter((n) => n !== null).length).toBeGreaterThan(3);
  });

  it("repeats on a fixed cycle and handles negative steps", () => {
    expect(noteForStep(0)).toBe(noteForStep(16));
    expect(noteForStep(3)).toBe(noteForStep(19));
    expect(noteForStep(-16)).toBe(noteForStep(0));
  });
});

describe("mute preference", () => {
  const store = new Map<string, string>();

  beforeEach(() => {
    store.clear();
    // jsdom is not configured for these tests; stub the storage the module uses.
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        localStorage: {
          getItem: (k: string) => store.get(k) ?? null,
          setItem: (k: string, v: string) => void store.set(k, v),
        },
      },
    });
  });

  afterEach(() => {
    Reflect.deleteProperty(globalThis, "window");
  });

  it("round-trips through storage", async () => {
    // Fresh module instance so the cached preference starts empty.
    vi.resetModules();
    const audio = await import("@/lib/gameAudio");
    expect(audio.isMuted()).toBe(false);
    audio.setMuted(true);
    expect(audio.isMuted()).toBe(true);
    expect(store.get("gms_muted")).toBe("1");
    audio.setMuted(false);
    expect(audio.isMuted()).toBe(false);
    expect(store.get("gms_muted")).toBe("0");
  });
});
