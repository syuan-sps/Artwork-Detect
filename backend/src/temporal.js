/**
 * Temporal classification for exhibitions.
 * Parses date strings and tags each exhibition as:
 *   "past"     — ended before today
 *   "current"  — open today
 *   "upcoming" — starts in the future
 *   "unknown"  — no parseable date
 */

const MONTH_MAP = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, sept: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11,
};

function parseMonthName(s) {
  const key = s.toLowerCase().replace(/\.$/, '');
  return MONTH_MAP[key] ?? -1;
}

/**
 * Extract start and end Date objects from a date string.
 * Handles formats like:
 *   "March 26–May 2, 2026"         (Month Day – Month Day, Year)
 *   "Mar 12 – Apr 25, 2026"        (short month)
 *   "October 19, 2025–April 18, 2026"
 *   "Through April 25, 2026"       (single end date)
 *   "Jan 15 – Feb 28, 2026"
 *   "30 Apr - 20 Jun 2026"         (D Mon YYYY — Tina Kim, Hales, etc.)
 *   "20 Nov 2025 - 24 Jan 2026"    (D Mon YYYY – D Mon YYYY)
 */
function parseDateRange(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return { start: null, end: null };

  const s = dateStr.trim();

  // "Through / through DATE" — only end date
  const throughMatch = s.match(/through\s+(.+)/i);
  if (throughMatch) {
    const end = parseSingleDate(throughMatch[1].trim());
    return { start: null, end };
  }

  // Split on separator: en-dash, em-dash, or isolated hyphen
  // Use a regex that splits on " - " or "–" or "—" but not hyphens inside words
  const parts = s.split(/\s*[–—]\s*|\s+-\s+/);

  if (parts.length >= 2) {
    const left = parts[0].trim();
    const right = parts[parts.length - 1].trim();

    const end = parseSingleDate(right);
    let start = parseSingleDate(left);

    if (start && !start.fullYear && end) {
      start.setFullYear(end.getFullYear());
    }

    return { start, end };
  }

  // Single date
  const single = parseSingleDate(s);
  return { start: single, end: single };
}

/**
 * Parse a single date string.
 * Handles:
 *   "Month Day, Year"  →  "March 26, 2026"
 *   "Month Day Year"   →  "Mar 12 2026"
 *   "Month Day"        →  "March 26"
 *   "Day Month Year"   →  "30 Apr 2026"  (European / Tina Kim format)
 *   "Day Month, Year"  →  "30 Apr, 2026"
 */
function parseSingleDate(s) {
  if (!s) return null;
  s = s.trim();

  // "Month Day, Year" or "Month Day Year" or "Month Day"
  // Anchor to start of string so it doesn't misfire on "8 Nov 2025" → "Nov 20"
  const mdy = s.match(/^([A-Za-z]+\.?)\s+(\d{1,2})(?:,?\s*(\d{4}))?/);
  if (mdy) {
    const monthIdx = parseMonthName(mdy[1]);
    if (monthIdx !== -1) {
      const day = parseInt(mdy[2], 10);
      const year = mdy[3] ? parseInt(mdy[3], 10) : null;
      const d = new Date(year ?? new Date().getFullYear(), monthIdx, day);
      d.fullYear = !!year;
      return d;
    }
  }

  // "Day Month Year" or "Day Month, Year"  (e.g. "30 Apr 2026", "20 Nov 2025", "8 Nov 2025")
  const dmy = s.match(/^(\d{1,2})\s+([A-Za-z]+\.?)(?:,?\s*(\d{4}))?/);
  if (dmy) {
    const monthIdx = parseMonthName(dmy[2]);
    if (monthIdx !== -1) {
      const day = parseInt(dmy[1], 10);
      const year = dmy[3] ? parseInt(dmy[3], 10) : null;
      const d = new Date(year ?? new Date().getFullYear(), monthIdx, day);
      d.fullYear = !!year;
      return d;
    }
  }

  return null;
}

/**
 * Classify a single exhibition as "past", "current", "upcoming", or "unknown".
 */
function classifyExhibition(exhibition) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { start, end } = parseDateRange(exhibition.dates);

  if (!start && !end) return 'unknown';

  // If only end date (Through DATE): current if end >= today
  if (!start && end) {
    return end >= today ? 'current' : 'past';
  }

  if (end && end < today) return 'past';
  if (start && start > today) return 'upcoming';
  return 'current';
}

/**
 * Tag all exhibitions and return them grouped.
 */
function classifyExhibitions(exhibitions) {
  return exhibitions.map((ex) => ({
    ...ex,
    status: classifyExhibition(ex),
  }));
}

module.exports = { classifyExhibitions, parseDateRange };
