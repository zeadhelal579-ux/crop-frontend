/**
 * Pure helpers for Growing Degree Day (GDD) data shared by the dashboard card
 * and the chart components. Thresholds always come from the API species
 * object, never from hard-coded numbers.
 */

/** Arithmetic mean of a list of numbers (0 for an empty list). */
export function average(values) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

/** Progress toward a GDD threshold as a whole percentage clamped to 0-100. */
export function gddProgressPct(accumulatedGdd, thresholdGdd) {
  if (!thresholdGdd || thresholdGdd <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((accumulatedGdd / thresholdGdd) * 100)));
}

/** Turn species life-stage thresholds into chart reference lines (upper bound of each range). */
export function stageReferenceLines(lifeStageThresholds = []) {
  return lifeStageThresholds.map((threshold) => ({ stage: threshold.stage, value: threshold.max }));
}

/**
 * Week-over-week change in percent: the average of the last 7 values against
 * the average of the 7 values before them. Returns null without enough history.
 */
export function computeWeekOverWeekDeltaPct(values) {
  if (values.length < 14) return null;
  const thisWeek = average(values.slice(-7));
  const lastWeek = average(values.slice(-14, -7));
  if (lastWeek === 0) return null;
  return Math.round(((thisWeek - lastWeek) / lastWeek) * 100);
}
