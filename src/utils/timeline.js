/**
 * Helpers for day-by-day series that mix past observations with forecast days.
 */

/** The "today" entry of a series: the last entry that is not a forecast. */
export function findTodayEntry(entries = []) {
  return [...entries].reverse().find((entry) => !entry.isForecast);
}
