/**
 * Mock per-field time series: trap counts and NDVI readings. Values scale with each field's pest pressure so charts
 * agree with the risk badges (B-02 is high, the others are quiet).
 */
import { FIELDS } from "./farm";
import { isoDay } from "./dates";

const INTENSITY = { "fld-b01": 0.1, "fld-b02": 1, "fld-b03": 0.25, "fld-b04": 0.15 };
const SPECIES_MEDFLY = "sp-ceratitis";

/** Find the static field record (or undefined for unknown ids). */
function findField(fieldId) {
  return FIELDS.find((field) => field.id === fieldId);
}

/** 14 days of trap observations for a field/species pair. */
export function buildTrapCounts(fieldId, speciesId) {
  const intensity = INTENSITY[fieldId] ?? 0.2;
  return Array.from({ length: 14 }, (_, index) => {
    const adults = Math.round(intensity * (10 + 3.2 * index));
    const base = { id: `trap-${fieldId}-${speciesId}-${index}`, fieldId, speciesId, date: isoDay(index - 13) };
    if (speciesId === SPECIES_MEDFLY) {
      return { ...base, eggCount: null, larvaeCount: null, adultCount: null, fliesPerTrapPerDay: Number((intensity * (1 + index * 0.2)).toFixed(1)) };
    }
    return { ...base, eggCount: Math.round(adults * 1.4), larvaeCount: Math.round(adults * 0.8), adultCount: adults, fliesPerTrapPerDay: null };
  });
}

/** Classify an NDVI value into a vigor class. */
function vigorFromNdvi(value) {
  if (value >= 0.75) return "HighVigor";
  if (value >= 0.6) return "ModerateStress";
  return "CriticalAlert";
}

/** Ten satellite readings (about every 5 days) plus one drone upload for a field. */
export function buildNdviSeries(fieldId) {
  const field = findField(fieldId);
  const latest = field?.ndvi.value ?? 0.7;
  const readings = Array.from({ length: 10 }, (_, index) => {
    const value = Number((latest + (index - 9) * 0.012 + 0.01 * Math.sin(index)).toFixed(2));
    return { id: `ndvi-${fieldId}-${index}`, captureDate: isoDay(-45 + index * 5), ndviValue: value, vigorClass: vigorFromNdvi(value), sourceProvider: "sentinel-2" };
  });
  readings.push({ id: `ndvi-${fieldId}-drone`, captureDate: isoDay(-12), ndviValue: Number((latest - 0.03).toFixed(2)), vigorClass: vigorFromNdvi(latest - 0.03), sourceProvider: "drone-upload" });
  return readings.sort((a, b) => a.captureDate.localeCompare(b.captureDate));
}
