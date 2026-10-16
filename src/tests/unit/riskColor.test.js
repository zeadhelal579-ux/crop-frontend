/** Tests for utils/riskColor.js: tier -> colour mapping and the safe fallback. */
import { describe, expect, it } from "vitest";
import { getRiskStyle, riskHex } from "@/utils/riskColor";

describe("riskColor", () => {
  it("returns a distinct hex colour for each tier", () => {
    const colours = [riskHex("Low"), riskHex("Mid"), riskHex("High")];
    expect(new Set(colours).size).toBe(3);
  });

  it("uses the design red for High risk", () => {
    expect(riskHex("High")).toBe("#B3261E");
  });

  it("falls back to the Low style for unknown values instead of throwing", () => {
    expect(getRiskStyle("Critical")).toEqual(getRiskStyle("Low"));
    expect(getRiskStyle(undefined)).toEqual(getRiskStyle("Low"));
  });

  it("provides badge, dot and border classes for every tier", () => {
    for (const tier of ["Low", "Mid", "High"]) {
      const style = getRiskStyle(tier);
      expect(style.badge).toMatch(/^bg-risk-/);
      expect(style.dot).toMatch(/^bg-risk-/);
      expect(style.border).toMatch(/^border-risk-/);
    }
  });
});
