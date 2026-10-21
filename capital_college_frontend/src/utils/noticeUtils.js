/**
 * noticeUtils.js
 * Institutional utilities for Capital College notices.
 * Rule: Notices dynamically display the "NEW" badge for 3 days from their release date.
 */

export function parseNoticeDate(notice) {
  if (!notice) return null;

  const dateCandidates = [notice.event_date, notice.created_at, notice.date, notice.release_date];

  for (const raw of dateCandidates) {
    if (!raw) continue;

    // Check standard Date.parse
    const t1 = Date.parse(raw);
    if (!isNaN(t1)) return new Date(t1);

    // Check SQLite YYYY-MM-DD HH:MM:SS format
    if (typeof raw === 'string' && raw.includes(' ')) {
      const iso = raw.replace(' ', 'T') + 'Z';
      const t2 = Date.parse(iso);
      if (!isNaN(t2)) return new Date(t2);
    }

    // Check DD-MM-YYYY format
    if (typeof raw === 'string') {
      const match = raw.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
      if (match) {
        const d = new Date(parseInt(match[3], 10), parseInt(match[2], 10) - 1, parseInt(match[1], 10));
        if (!isNaN(d.getTime())) return d;
      }
    }
  }

  return null;
}

/**
 * Returns the elapsed age in calendar days since release.
 * Release day = 0, next day = 1, etc.
 */
export function getNoticeAgeDays(notice) {
  const d = parseNoticeDate(notice);
  if (!d) return null;

  const now = new Date();
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const noticeMidnight = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

  return Math.floor((nowMidnight - noticeMidnight) / (24 * 60 * 60 * 1000));
}

/**
 * Determines whether a notice qualifies for the "NEW" tag.
 * Active for 3 days from release (calendar days 0, 1, 2, and 3).
 * Automatically expires on day 4+.
 */
export function isNoticeNew(notice, maxDays = 3) {
  if (!notice) return false;

  const ageDays = getNoticeAgeDays(notice);
  if (ageDays !== null) {
    // Active within 3 days (allows -1 for edge timezone shifts)
    return ageDays >= -1 && ageDays <= maxDays;
  }

  // Fallback if notice explicitly has is_new
  if (notice.is_new !== undefined) return Boolean(notice.is_new);
  return false;
}
