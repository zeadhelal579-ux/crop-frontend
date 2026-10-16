/**
 * Mock weather: current conditions, the hourly strip and the season-baseline
 * comparison shown on the Dashboard weather card.
 */
import { minutesAgo } from "./dates";

export const WEATHER = {
  current: {
    tempC: 20,
    condition: "PartlyCloudy",
    highC: 24,
    lowC: 16,
    precipitationPct: 10,
    dewPointC: 12,
    pressureHpa: 1014,
    humidityPct: 62,
    windKmh: 14,
    windDirection: "NW",
    seasonBaselineDeltaC: 1.4,
    updatedAt: minutesAgo(2),
  },
  hourly: [
    { time: "12:00", tempC: 22, icon: "sun" },
    { time: "15:00", tempC: 24, icon: "sun" },
    { time: "18:00", tempC: 19, icon: "partlyCloudy" },
    { time: "21:00", tempC: 17, icon: "night" },
  ],
};

/** Daily weather summary used by the 7-day Pest Risk Monitor, keyed by day offset from today. */
export const DAILY_WEATHER = {
  "-3": { tempC: 18, condition: "Clear" },
  "-2": { tempC: 19, condition: "Humid" },
  "-1": { tempC: 21, condition: "Warm" },
  0: { tempC: 20, condition: "HighRH" },
  1: { tempC: 23, condition: "PeakRH" },
  2: { tempC: 22, condition: "Breeze" },
  3: { tempC: 19, condition: "Dry" },
};
