/**
 * Mock GDD series. Each entry carries a realistic dailyGdd and its running
 * accumulatedGdd (ending at the species' current total on "today"), plus
 * degreeUnits - the display-scaled value the Dashboard "Growing Degree Units"
 * bars show (this week averages 179, +12% over last week, as in the design).
 */
import { isoDay } from "./dates";

const FIRST_OFFSET = -59;
const LAST_OFFSET = 3;
const THIS_WEEK_UNITS = [120, 140, 160, 215, 170, 205, 243];
const LAST_WEEK_UNITS = [140, 150, 155, 160, 165, 170, 179];

const GDD_PROFILES = {
  "sp-tuta": { accumulated: 380, stage: "Pupa", scale: 1 },
  "sp-bemisia": { accumulated: 132, stage: "Adult", scale: 0.8 },
  "sp-ceratitis": { accumulated: 210, stage: "Larva", scale: 0.6 },
};

/** Display-scaled dashboard value for a day offset (past weeks follow a gentle wave). */
function degreeUnitsAt(offset, scale) {
  if (offset >= -3) return Math.round(THIS_WEEK_UNITS[offset + 3] * scale);
  if (offset >= -10) return Math.round(LAST_WEEK_UNITS[offset + 10] * scale);
  return Math.round((100 + 12 * Math.sin(offset)) * scale);
}

/** Build the season series for one species. */
export function buildGddSeries(speciesId) {
  const profile = GDD_PROFILES[speciesId] ?? GDD_PROFILES["sp-tuta"];
  const pastDays = 0 - FIRST_OFFSET + 1;
  const weights = Array.from({ length: pastDays }, (_, index) => 1 + 0.3 * Math.sin(index / 4));
  const weightSum = weights.reduce((sum, weight) => sum + weight, 0);
  const average = profile.accumulated / pastDays;

  let running = 0;
  const daily = [];
  for (let offset = FIRST_OFFSET; offset <= LAST_OFFSET; offset += 1) {
    const isForecast = offset > 0;
    const dailyGdd = isForecast ? average * 1.1 : (weights[offset - FIRST_OFFSET] / weightSum) * profile.accumulated;
    running += dailyGdd;
    daily.push({
      date: isoDay(offset),
      dailyGdd: Number(dailyGdd.toFixed(1)),
      accumulatedGdd: Number(running.toFixed(1)),
      degreeUnits: degreeUnitsAt(offset, profile.scale),
      isForecast,
    });
  }
  return {
    speciesId,
    daily,
    accumulatedGdd: profile.accumulated,
    currentLifeStage: profile.stage,
    biofixDate: isoDay(FIRST_OFFSET),
  };
}
