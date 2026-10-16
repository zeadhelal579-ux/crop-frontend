/**
 * Date helpers shared by the mock fixtures. Calendar data is anchored to the
 * date shown in the approved design (Thursday, Oct 24, 2024) so weekday labels
 * match it; "relative" values (hours ago, today at 18:00) follow the real clock.
 */

/** The fixed "today" of the mock calendar data. */
const MOCK_TODAY = "2024-10-24";

/** ISO calendar date offset days away from MOCK_TODAY. */
export function isoDay(offsetDays) {
  const date = new Date(`${MOCK_TODAY}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

/** ISO timestamp for a moment N minutes before now. */
export function minutesAgo(minutes) {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

/** ISO timestamp for a moment N hours before now. */
export function hoursAgo(hours) {
  return minutesAgo(hours * 60);
}

/** ISO timestamp for today (real clock) at a local hour and minute. */
export function todayAt(hour, minute = 0) {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}
