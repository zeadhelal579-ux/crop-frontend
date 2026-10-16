/** Tests for utils/vigorColor.js: NDVI vigor class -> colour mapping. */
import { describe, expect, it } from "vitest";
import { getVigorStyle, vigorHex } from "@/utils/vigorColor";

describe("vigorColor", () => {
  it("maps the three vigor classes to green, amber and red", () => {
    expect(vigorHex("HighVigor")).toBe("#4CAF50");
    expect(vigorHex("ModerateStress")).toBe("#F4C04E");
    expect(vigorHex("CriticalAlert")).toBe("#B3261E");
  });

  it("falls back to HighVigor for unknown values", () => {
    expect(getVigorStyle("Whatever")).toEqual(getVigorStyle("HighVigor"));
  });
});
