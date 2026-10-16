/**
 * Locale-aware date helpers. All functions take the active language as an
 * argument (no hidden global state) so they stay pure and easy to test.
 * Arabic output keeps Latin digits (the approved design never uses ١٢٣).
 */

/** Map an app language code to an Intl locale tag (forcing Latin digits for Arabic). */
function toIntlLocale(language) {
  return language === "ar" ? "ar-u-nu-latn" : "en-US";
}

/** Parse an ISO calendar date (YYYY-MM-DD) at local noon to avoid timezone day shifts. */
function parseIsoDate(isoDate) {
  return new Date(`${isoDate}T12:00:00`);
}

/** Format a date as a short weekday only, e.g. "Mon". */
export function formatWeekdayName(isoDate, language) {
  return new Intl.DateTimeFormat(toIntlLocale(language), { weekday: "short" }).format(parseIsoDate(isoDate));
}

/** Format a date as weekday plus day number, e.g. "Mon 21". */
export function formatWeekdayShort(isoDate, language) {
  const date = parseIsoDate(isoDate);
  const locale = toIntlLocale(language);
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "short" }).format(date);
  const day = new Intl.DateTimeFormat(locale, { day: "numeric" }).format(date);
  return `${weekday} ${day}`;
}

/** Format a date as month plus day, e.g. "Oct 25". */
export function formatMonthDay(isoDate, language) {
  const date = parseIsoDate(isoDate);
  const locale = toIntlLocale(language);
  const month = new Intl.DateTimeFormat(locale, { month: "short" }).format(date);
  const day = new Intl.DateTimeFormat(locale, { day: "numeric" }).format(date);
  return `${month} ${day}`;
}

/** Format a date as a full header date, e.g. "Thursday, Oct 24". */
export function formatLongDate(isoDate, language) {
  const weekday = new Intl.DateTimeFormat(toIntlLocale(language), { weekday: "long" }).format(parseIsoDate(isoDate));
  const separator = language === "ar" ? "، " : ", ";
  return `${weekday}${separator}${formatMonthDay(isoDate, language)}`;
}

/** Format a timestamp as a 24-hour clock time, e.g. "18:00". */
export function formatClockTime(timestamp, language) {
  return new Intl.DateTimeFormat(toIntlLocale(language), {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(timestamp));
}

/** Format a number with locale grouping (Latin digits in both languages). */
export function formatNumber(value, language, options = {}) {
  return new Intl.NumberFormat(toIntlLocale(language), options).format(value);
}

/** Whole days between two ISO dates (b minus a). */
export function getDayOffset(isoDateA, isoDateB) {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.round((parseIsoDate(isoDateB) - parseIsoDate(isoDateA)) / millisecondsPerDay);
}

/**
 * Describe how long ago a timestamp was as { unit, value }.
 * The caller turns it into text with the translation key "time.<unit>Ago".
 */
export function getRelativeAge(timestamp, nowMs = Date.now()) {
  const minutes = Math.max(0, Math.round((nowMs - new Date(timestamp).getTime()) / 60000));
  if (minutes < 60) return { unit: "minutes", value: Math.max(1, minutes) };
  const hours = Math.round(minutes / 60);
  if (hours < 24) return { unit: "hours", value: hours };
  return { unit: "days", value: Math.round(hours / 24) };
}
