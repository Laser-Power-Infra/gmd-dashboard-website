/**
 * Canonical date parser for the GMD text date columns.
 *
 * Those columns are free text in the source spreadsheet, so the stored value is
 * whatever the sheet or a human typed. The important rule: a bare numeric
 * string is never a date. `new Date("45913")` is parsed by V8 as the YEAR
 * 45913, not as an Excel serial, which silently pushed rows to the far future
 * so they vanished from every date-filtered view instead of being reported as
 * unparseable. Excel serials are converted by the sync script, not guessed at
 * here.
 */

const MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

/** A string that is only digits (optionally one decimal) is not a date. */
function isBareNumber(s: string): boolean {
  return /^\d+(\.\d+)?$/.test(s);
}

export function parseGmdDate(str: unknown): Date | null {
  if (typeof str !== "string") return null;
  const s = str.trim();
  if (!s) return null;
  if (isBareNumber(s)) return null;

  // Primary: DD-Mmm-YY / DD-MMM-YYYY e.g. 12-Jan-24, 05-Feb-2023
  const m = s.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{2,4})$/);
  if (m) {
    const mon = MONTHS[m[2].toLowerCase()];
    if (mon !== undefined) {
      const day = parseInt(m[1], 10);
      let year = parseInt(m[3], 10);
      if (year < 100) year += 2000;
      if (!isNaN(day) && day >= 1 && day <= 31 && !isNaN(year)) {
        return new Date(year, mon, day);
      }
    }
  }

  // Fallback: ISO / locale strings (e.g. 2024-01-12)
  const d = new Date(s);
  if (!isNaN(d.getTime())) return d;
  return null;
}
