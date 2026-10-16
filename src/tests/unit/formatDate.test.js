/** Tests for utils/formatDate.js: locale-aware dates with Latin digits in Arabic. */
import { describe, expect, it } from "vitest";
import {
  formatLongDate,
  formatMonthDay,
  formatWeekdayName,
  formatWeekdayShort,
  getDayOffset,
  getRelativeAge,
} from "@/utils/formatDate";

describe("formatDate", () => {
  it("formats English weekday + day", () => {
    expect(formatWeekdayShort("2024-10-21", "en")).toBe("Mon 21");
    expect(formatWeekdayName("2024-10-24", "en")).toBe("Thu");
  });

  it("formats the long header date", () => {
    expect(formatLongDate("2024-10-24", "en")).toBe("Thursday, Oct 24");
    expect(formatMonthDay("2024-10-25", "en")).toBe("Oct 25");
  });

  it("keeps Latin digits in Arabic output (no Arabic-Indic digits)", () => {
    const arabic = formatWeekdayShort("2024-10-21", "ar");
    expect(arabic).toMatch(/21$/);
    expect(arabic).not.toMatch(/[٠-٩]/);
    expect(formatLongDate("2024-10-24", "ar")).not.toMatch(/[٠-٩]/);
  });

  it("computes whole-day offsets between ISO dates", () => {
    expect(getDayOffset("2024-10-23", "2024-10-24")).toBe(1);
    expect(getDayOffset("2024-10-24", "2024-10-21")).toBe(-3);
  });

  it("describes relative age in minutes, hours and days", () => {
    const now = new Date("2024-10-24T12:00:00Z").getTime();
    expect(getRelativeAge("2024-10-24T11:58:00Z", now)).toEqual({ unit: "minutes", value: 2 });
    expect(getRelativeAge("2024-10-24T08:00:00Z", now)).toEqual({ unit: "hours", value: 4 });
    expect(getRelativeAge("2024-10-22T12:00:00Z", now)).toEqual({ unit: "days", value: 2 });
  });
});
