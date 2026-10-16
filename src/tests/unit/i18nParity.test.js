/**
 * Guards ADR-020 ("every screen ships in both languages"): every translation
 * key present in English must exist in Arabic, and the other way around.
 */
import { describe, expect, it } from "vitest";
import { resources } from "@/i18n/i18n";

/** Flatten a nested object into dot-separated key paths. */
function flatten(object, prefix = "") {
  return Object.entries(object).flatMap(([key, value]) =>
    typeof value === "object" && value !== null ? flatten(value, `${prefix}${key}.`) : [`${prefix}${key}`],
  );
}

describe("translation key parity (en <-> ar)", () => {
  for (const namespace of Object.keys(resources.en)) {
    it(`has identical keys in the "${namespace}" namespace`, () => {
      expect(flatten(resources.ar[namespace]).sort()).toEqual(flatten(resources.en[namespace]).sort());
    });
  }

  it("keeps the same {{placeholders}} in both languages", () => {
    const placeholders = (text) => (text.match(/{{\w+}}/g) ?? []).sort();
    for (const namespace of Object.keys(resources.en)) {
      for (const key of flatten(resources.en[namespace])) {
        const read = (language) => key.split(".").reduce((node, part) => node[part], resources[language][namespace]);
        expect(placeholders(read("ar"))).toEqual(placeholders(read("en")));
      }
    }
  });
});
