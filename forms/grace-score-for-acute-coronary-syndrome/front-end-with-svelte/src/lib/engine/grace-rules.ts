import type { KillipClass, PointBand, RiskBand } from './types';

/**
 * GRACE weighted regression point model — named per-band lookup tables and the
 * mortality-band thresholds.
 *
 * GRACE is NOT a simple sum of yes/no items: each continuous variable maps
 * through a weighted, banded lookup derived from the model's regression
 * coefficients, and the resulting points are summed by `grace-grader.ts`. The
 * point allocations below are representative of the published GRACE / GRACE 2.0
 * point tables (Granger 2003; Fox 2006/2014) and are calibrated so the total
 * reads against the documented mortality-band thresholds:
 *   in-hospital:  <= 108 low | 109-140 intermediate | > 140 high
 *   6-month:      <=  88 low |  89-118 intermediate | > 118 high
 * The overall risk category is the WORSE of the two bands (max-band rule).
 *
 * Each band table is an ordered list of `{ upTo, points, label }` rows; the
 * first row whose `upTo` is >= the value supplies the points. The final row
 * uses `upTo: Infinity` as the open-ended catch-all.
 */

// ─── Variable 1: age (years) — monotonically increasing ───────────────
export const AGE_BANDS: PointBand[] = [
	{ upTo: 29, points: 0, label: '< 30' },
	{ upTo: 39, points: 8, label: '30-39' },
	{ upTo: 49, points: 25, label: '40-49' },
	{ upTo: 59, points: 41, label: '50-59' },
	{ upTo: 69, points: 58, label: '60-69' },
	{ upTo: 79, points: 75, label: '70-79' },
	{ upTo: 89, points: 91, label: '80-89' },
	{ upTo: Infinity, points: 100, label: '>= 90' }
];

// ─── Variable 2: heart rate (beats/min) — increasing ──────────────────
export const HEART_RATE_BANDS: PointBand[] = [
	{ upTo: 49, points: 0, label: '< 50' },
	{ upTo: 69, points: 3, label: '50-69' },
	{ upTo: 89, points: 9, label: '70-89' },
	{ upTo: 109, points: 15, label: '90-109' },
	{ upTo: 149, points: 24, label: '110-149' },
	{ upTo: 199, points: 38, label: '150-199' },
	{ upTo: Infinity, points: 46, label: '>= 200' }
];

// ─── Variable 3: systolic BP (mmHg) — INVERSE (lower scores higher) ────
export const SBP_BANDS: PointBand[] = [
	{ upTo: 79, points: 58, label: '< 80' },
	{ upTo: 99, points: 53, label: '80-99' },
	{ upTo: 119, points: 43, label: '100-119' },
	{ upTo: 139, points: 34, label: '120-139' },
	{ upTo: 159, points: 24, label: '140-159' },
	{ upTo: 199, points: 10, label: '160-199' },
	{ upTo: Infinity, points: 0, label: '>= 200' }
];

// ─── Variable 4: serum creatinine (mg/dL, normalised) — increasing ────
export const CREATININE_BANDS: PointBand[] = [
	{ upTo: 0.39, points: 1, label: '0-0.39' },
	{ upTo: 0.79, points: 4, label: '0.4-0.79' },
	{ upTo: 1.19, points: 7, label: '0.8-1.19' },
	{ upTo: 1.59, points: 10, label: '1.2-1.59' },
	{ upTo: 1.99, points: 13, label: '1.6-1.99' },
	{ upTo: 3.99, points: 21, label: '2.0-3.99' },
	{ upTo: Infinity, points: 28, label: '>= 4.0' }
];

// ─── Variable 5: Killip class (heart-failure severity) ────────────────
export const KILLIP_POINTS: Record<Exclude<KillipClass, ''>, number> = {
	I: 0,
	II: 20,
	III: 39,
	IV: 59
};

// ─── Variables 6-8: fixed yes/no increments ───────────────────────────
export const CARDIAC_ARREST_POINTS = 39;
export const ST_DEVIATION_POINTS = 28;
export const ELEVATED_ENZYMES_POINTS = 14;

// ─── Mortality-band thresholds (spec §4) ──────────────────────────────
export interface BandThresholds {
	low: number;
	intermediate: number;
}
export const IN_HOSPITAL_THRESHOLDS: BandThresholds = { low: 108, intermediate: 140 };
export const SIX_MONTH_THRESHOLDS: BandThresholds = { low: 88, intermediate: 118 };

// ─── Creatinine unit normalisation ────────────────────────────────────
export const UMOL_PER_MGDL = 88.4;

/** Rank the three bands so the worse of two can be chosen. */
export const BAND_RANK: Record<RiskBand, number> = { low: 0, intermediate: 1, high: 2 };
