/**
 * Enforces the RTL convention (ADR-020): components must use Tailwind logical
 * utilities (ms-, me-, ps-, pe-, start-, end-, text-start, text-end) instead of
 * physical ones, so flipping dir="rtl" mirrors the layout automatically.
 * Centering with left-1/2 is allowed because it is symmetrical.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const SOURCE_ROOT = join(process.cwd(), "src");
const PHYSICAL_UTILITIES = /(?<![\w-])(?:-?m[lr]-|p[lr]-|text-(?:left|right)\b|rounded-[lr]-|rounded-[lr]\b|border-[lr]-|border-[lr]\b|(?:left|right)-(?!1\/2))/;

/** Recursively list source files that contain class names. */
function listSourceFiles(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    if (statSync(path).isDirectory()) return name === "tests" || name === "mocks" ? [] : listSourceFiles(path);
    return /\.(jsx|js)$/.test(name) ? [path] : [];
  });
}

describe("logical CSS properties", () => {
  it("uses no physical-direction Tailwind utilities in className strings", () => {
    const offenders = [];
    for (const file of listSourceFiles(SOURCE_ROOT)) {
      const classStrings = readFileSync(file, "utf8").match(/className=(?:"[^"]*"|\{[^}]*\})|cn\([^)]*\)|"[^"]*"/g) ?? [];
      for (const text of classStrings) {
        for (const token of text.split(/[\s"'`{}(),]+/)) {
          if (token && PHYSICAL_UTILITIES.test(token) && /^[-\w/[\].:]+$/.test(token) && /^(?:-?[mp][lr]-|text-(?:left|right)|rounded-[lr]|border-[lr]|(?:left|right)-)/.test(token)) {
            offenders.push(`${file.replace(SOURCE_ROOT, "src")}: ${token}`);
          }
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});
