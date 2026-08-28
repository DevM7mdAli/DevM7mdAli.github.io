/**
 * Month-and-year label for a `date` column.
 *
 * Note the explicit `calendar: "gregory"`. Passing "ar-SA" to
 * toLocaleDateString resolves to the Islamic calendar in most browsers, which
 * rendered a 2025 role as 1446. Arabic readers here expect the same Gregorian
 * timeline as the English page — only the numerals and month names differ.
 */
export function formatMonthYear(dateStr: string, locale: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;

  return date.toLocaleDateString(locale === "ar" ? "ar" : "en-US", {
    year: "numeric",
    month: "short",
    calendar: "gregory",
  });
}

/** "Feb 2025 — Present" style range. */
export function formatDateRange(
  start: string,
  end: string | null,
  locale: string,
  presentLabel: string,
): string {
  const from = formatMonthYear(start, locale);
  const to = end ? formatMonthYear(end, locale) : presentLabel;
  return `${from} — ${to}`;
}
