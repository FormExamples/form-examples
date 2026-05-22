/** Snap to 0.25 D step; null/empty/NaN → null. */
export function snapQuarter(v: number | string | null | undefined): number | null {
  if (v === null || v === undefined || v === '') return null;
  const n = typeof v === 'number' ? v : Number(v);
  if (!Number.isFinite(n)) return null;
  return Math.round(n * 4) / 4;
}

/** Whole years between two ISO YYYY-MM-DD dates; null if invalid. */
export function ageInYears(birthDate: string, referenceDate: string): number | null {
  if (!birthDate || !referenceDate) return null;
  const b = new Date(birthDate);
  const r = new Date(referenceDate);
  if (Number.isNaN(b.getTime()) || Number.isNaN(r.getTime())) return null;
  let age = r.getFullYear() - b.getFullYear();
  const m = r.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && r.getDate() < b.getDate())) age -= 1;
  return age;
}

/** Default expiry: issue + 2 years (or +1 year if age < 16 or ≥ 70 on issue). */
export function suggestExpiry(birthDate: string, issueDate: string): string {
  if (!issueDate) return '';
  const age = ageInYears(birthDate, issueDate);
  const issue = new Date(issueDate);
  const years = (age !== null && (age < 16 || age >= 70)) ? 1 : 2;
  const expiry = new Date(issue);
  expiry.setFullYear(issue.getFullYear() + years);
  return expiry.toISOString().slice(0, 10);
}

/** Format a signed dioptre value with +/− and 2 decimals; null → '—'. */
export function fmtDioptres(n: number | null | undefined, digits = 2): string {
  if (n === null || n === undefined) return '—';
  if (n === 0) return (0).toFixed(digits);
  const s = n.toFixed(digits);
  return n > 0 ? '+' + s : s;
}
