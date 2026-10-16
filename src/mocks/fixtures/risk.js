/**
 * Mock outbreak risk data: latest scores, the 7-day history/forecast window
 * (with the predicted trap count the Pests deep-dive chart draws).
 */
import { DAILY_WEATHER } from "./weather";
import { isoDay } from "./dates";

/** Classify a probability into the three-tier scheme (ADR-015). */
export function classifyRisk(probability) {
  if (probability >= 0.7) return "High";
  if (probability >= 0.4) return "Mid";
  return "Low";
}

/** Latest outbreak numbers per species for the active field. */
export const LATEST_RISK = {
  "sp-tuta": { outbreakProbability3d: 0.81, outbreakProbability7d: 0.84, daysToEvent: 3 },
  "sp-bemisia": { outbreakProbability3d: 0.52, outbreakProbability7d: 0.58, daysToEvent: 2 },
  "sp-ceratitis": { outbreakProbability3d: 0.14, outbreakProbability7d: 0.18, daysToEvent: 6 },
};

/** Outbreak probability for day offsets -3..3 around today (Mon..Sun in the design). */
const WEEK_PROBABILITY = {
  "sp-tuta": [0.12, 0.18, 0.55, 0.84, 0.78, 0.52, 0.25],
  "sp-bemisia": [0.2, 0.3, 0.45, 0.58, 0.6, 0.35, 0.3],
  "sp-ceratitis": [0.1, 0.12, 0.15, 0.18, 0.2, 0.16, 0.12],
};

/** Predicted trap catch for offsets -3..3 (bars of the deep-dive chart). */
const WEEK_TRAP_PREDICTION = {
  "sp-tuta": [14, 22, 36, 48, 44, 28, 18],
  "sp-bemisia": [12, 15, 22, 26, 28, 20, 14],
  "sp-ceratitis": [2, 2, 3, 3, 4, 3, 2],
};

/** Build the risk window from daysBack to daysForward around today. */
export function buildRiskHistory(speciesId, daysBack, daysForward) {
  const probabilities = WEEK_PROBABILITY[speciesId] ?? WEEK_PROBABILITY["sp-tuta"];
  const traps = WEEK_TRAP_PREDICTION[speciesId] ?? WEEK_TRAP_PREDICTION["sp-tuta"];
  const rows = [];
  for (let offset = -daysBack; offset <= daysForward; offset += 1) {
    const inWeek = offset >= -3 && offset <= 3;
    const probability = inWeek ? probabilities[offset + 3] : Number((probabilities[0] * (0.7 + 0.2 * Math.sin(offset))).toFixed(2));
    const weather = DAILY_WEATHER[offset] ?? { tempC: 20, condition: "Clear" };
    rows.push({
      date: isoDay(offset),
      riskClass: classifyRisk(probability),
      outbreakProbability7d: probability,
      predictedTrapCount: inWeek ? traps[offset + 3] : Math.round(traps[0] * 0.8),
      tempC: weather.tempC,
      condition: weather.condition,
      isForecast: offset > 0,
    });
  }
  return rows;
}
