import type { Complexity } from './types.js';

/** Human-readable label for a prescription-complexity grade. */
export function complexityLabel(c: Complexity): string {
  switch (c) {
    case 'simple':
      return 'Simple';
    case 'moderate':
      return 'Moderate';
    case 'complex':
      return 'Complex';
    default:
      return 'Not classified';
  }
}

/** Lily token colour triple for a prescription-complexity grade. */
export function complexityColor(c: Complexity): string {
  switch (c) {
    case 'simple':
      return 'bg-success text-success-content border-success';
    case 'moderate':
      return 'bg-warning text-warning-content border-warning';
    case 'complex':
      return 'bg-error text-error-content border-error';
    default:
      return 'bg-base-300 text-base-content border-base-300';
  }
}

/** Lily token colour triple for a flag priority. */
export function priorityColor(p: string): string {
  switch (p) {
    case 'high':
      return 'bg-error text-error-content border-error';
    case 'medium':
      return 'bg-warning text-warning-content border-warning';
    default:
      return 'bg-success text-success-content border-success';
  }
}

/** Human-readable label for a lens-type enum value. */
export function lensTypeLabel(t: string): string {
  switch (t) {
    case 'single-vision-distance':
      return 'Single vision — distance';
    case 'single-vision-near':
      return 'Single vision — near';
    case 'single-vision-intermediate':
      return 'Single vision — intermediate';
    case 'bifocal':
      return 'Bifocal';
    case 'trifocal':
      return 'Trifocal';
    case 'varifocal':
      return 'Varifocal';
    case 'occupational-varifocal':
      return 'Occupational varifocal';
    default:
      return '—';
  }
}

/** Title-case a hyphenated classification token (e.g. `high-myopia` → `High myopia`). */
export function classLabel(c: string): string {
  if (!c || c === 'none') return '—';
  return c.replace(/-/g, ' ');
}

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
