import { describe, expect, it } from "vitest";
import { displayName } from "@/lib/format";

/**
 * A leaderboard row has a fixed share of the board's width. Before this, one
 * long name widened the standings column and pushed the prize card off the
 * canvas, so what a name comes out as here is load-bearing for the layout, not
 * only for how it reads.
 */
describe("displayName", () => {
  it("leaves a name that fits exactly as it is", () => {
    for (const name of ["Wei", "Jamie Tan", "Arun Krishnan", "Michelle"]) {
      expect(displayName(name)).toBe(name);
    }
  });

  it("keeps the first name and initials the last when it is too long", () => {
    expect(displayName("Adnan Azam Mohammed")).toBe("Adnan M.");
    expect(displayName("Michelle Angela Aryanto Wijaya")).toBe("Michelle W.");
    expect(displayName("Nurul Aisyah binti Abdul Rahman Al-Hakim")).toBe(
      "Nurul A.",
    );
  });

  it("has nothing to abbreviate in one long word, and says so plainly", () => {
    const word = "Supercalifragilisticexpialidocious";
    expect(displayName(word)).toBe(word);
  });

  it("never returns something longer than it was given", () => {
    const names = [
      "Adnan Azam Mohammed",
      "A B",
      "Jo Wong",
      "Xiao Ming Li Wei Chen",
      "  spaced   out   name  ",
    ];
    for (const name of names) {
      const clean = name.trim().replace(/\s+/g, " ");
      expect(displayName(name).length).toBeLessThanOrEqual(clean.length);
    }
  });

  it("tidies the whitespace it is given", () => {
    expect(displayName("  Jamie   Tan  ")).toBe("Jamie Tan");
  });
});
