/** Tests for utils/gddHelpers.js and utils/timeline.js. */
import { describe, expect, it } from "vitest";
import { average, computeWeekOverWeekDeltaPct, gddProgressPct, stageReferenceLines } from "@/utils/gddHelpers";
import { findTodayEntry } from "@/utils/timeline";

describe("gddHelpers", () => {
  it("averages a list and handles an empty list", () => {
    expect(average([2, 4, 6])).toBe(4);
    expect(average([])).toBe(0);
  });

  it("computes progress and clamps it to 0-100", () => {
    expect(gddProgressPct(380, 450)).toBe(84);
    expect(gddProgressPct(900, 450)).toBe(100);
    expect(gddProgressPct(-5, 450)).toBe(0);
    expect(gddProgressPct(10, 0)).toBe(0);
  });

  it("builds reference lines from the upper bound of each life stage", () => {
    const lines = stageReferenceLines([{ stage: "Egg", min: 70, max: 90 }, { stage: "Larva", min: 280, max: 300 }]);
    expect(lines).toEqual([{ stage: "Egg", value: 90 }, { stage: "Larva", value: 300 }]);
  });

  it("computes the week-over-week delta from two weeks of values", () => {
    const lastWeek = [140, 150, 155, 160, 165, 170, 179];
    const thisWeek = [120, 140, 160, 215, 170, 205, 243];
    expect(computeWeekOverWeekDeltaPct([...lastWeek, ...thisWeek])).toBe(12);
  });

  it("returns null when there is not enough history", () => {
    expect(computeWeekOverWeekDeltaPct([1, 2, 3])).toBeNull();
  });
});

describe("timeline", () => {
  it("finds the last non-forecast entry as today", () => {
    const entries = [
      { date: "a", isForecast: false },
      { date: "b", isForecast: false },
      { date: "c", isForecast: true },
    ];
    expect(findTodayEntry(entries).date).toBe("b");
    expect(findTodayEntry([])).toBeUndefined();
  });
});
