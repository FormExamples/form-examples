import type { FitnessBand } from './types.js';

const BAND_ORDER: FitnessBand[] = [
  'fit',
  'fit-with-conditions',
  'requires-review',
  'unfit-to-fly',
];

export function maxBand(a: FitnessBand, b: FitnessBand): FitnessBand {
  return BAND_ORDER.indexOf(a) >= BAND_ORDER.indexOf(b) ? a : b;
}

export function daysBetween(isoDate: string, referenceIso?: string): number | null {
  if (!isoDate) return null;
  const a = new Date(isoDate);
  const b = referenceIso ? new Date(referenceIso) : new Date();
  if (Number.isNaN(a.valueOf()) || Number.isNaN(b.valueOf())) return null;
  const ms = b.getTime() - a.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

export function addDaysIso(isoDate: string, days: number): string {
  const base = isoDate ? new Date(isoDate) : new Date();
  if (Number.isNaN(base.valueOf())) return '';
  base.setDate(base.getDate() + days);
  return base.toISOString().slice(0, 10);
}

export function isInPast(isoDate: string): boolean {
  const n = daysBetween(isoDate);
  return n !== null && n >= 0;
}

export function deskRecommendationFor(band: FitnessBand): string {
  switch (band) {
    case 'fit':
      return 'Proceed; no further medical clearance needed beyond this form.';
    case 'fit-with-conditions':
      return 'Clear with documented conditions (oxygen flow rate, seat allocation, escort).';
    case 'requires-review':
      return 'Submit to airline medical desk; senior physician review required before clearance.';
    case 'unfit-to-fly':
      return 'Do not fly until reassessed by the attending physician and airline medical desk.';
  }
}

/** Human-readable label for a fitness-to-fly band. */
export function fitnessBandLabel(band: FitnessBand): string {
  switch (band) {
    case 'fit':
      return 'Fit to fly';
    case 'fit-with-conditions':
      return 'Fit with conditions';
    case 'requires-review':
      return 'Requires review';
    case 'unfit-to-fly':
      return 'Unfit to fly';
  }
}

/** Lily-token colour triple for a fitness-to-fly band. */
export function fitnessBandColor(band: FitnessBand): string {
  switch (band) {
    case 'fit':
      return 'bg-success text-success-content border-success';
    case 'fit-with-conditions':
      return 'bg-info text-info-content border-info';
    case 'requires-review':
      return 'bg-warning text-warning-content border-warning';
    case 'unfit-to-fly':
      return 'bg-error text-error-content border-error';
  }
}

/** Lily-token colour triple for a safety-flag priority. */
export function priorityColor(priority: 'low' | 'medium' | 'high'): string {
  switch (priority) {
    case 'high':
      return 'bg-error text-error-content border-error';
    case 'medium':
      return 'bg-warning text-warning-content border-warning';
    case 'low':
      return 'bg-base-300 text-base-content border-base-300';
  }
}
