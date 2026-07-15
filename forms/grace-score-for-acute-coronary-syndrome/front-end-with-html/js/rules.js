// GRACE weighted regression point model — named per-band lookup tables and the
// band-lookup / creatinine-normalisation helpers.
//
// GRACE is NOT a simple sum of yes/no items: each continuous variable maps
// through a weighted, banded lookup derived from the model's regression
// coefficients, and the resulting points are summed by `grader.js`. The point
// allocations below are representative of the published GRACE / GRACE 2.0 point
// tables (Granger 2003; Fox 2006/2014) and are calibrated so the total reads
// against the documented mortality-band thresholds:
//   in-hospital:  <= 108 low | 109-140 intermediate | > 140 high
//   6-month:      <=  88 low |  89-118 intermediate | > 118 high
// The overall risk category is the WORSE of the two bands (max-band rule).
//
// Each band table is an ordered list of `{ upTo, points, label }` rows; the
// first row whose `upTo` is >= the value supplies the points. The final row
// uses `upTo: Infinity` as the open-ended catch-all.

/**
 * @typedef {Object} PointBand
 * @property {number} upTo    - inclusive upper bound for this band
 * @property {number} points  - points contributed when the value lands here
 * @property {string} label   - human-readable band range
 */

// Wrapped in an IIFE; published via window.GraceScoreForAcuteCoronarySyndrome.

// ─── Variable 1: age (years) — monotonically increasing ───────────────
/** @type {PointBand[]} */
const AGE_BANDS = [
  { upTo: 29, points: 0, label: '< 30' },
  { upTo: 39, points: 8, label: '30–39' },
  { upTo: 49, points: 25, label: '40–49' },
  { upTo: 59, points: 41, label: '50–59' },
  { upTo: 69, points: 58, label: '60–69' },
  { upTo: 79, points: 75, label: '70–79' },
  { upTo: 89, points: 91, label: '80–89' },
  { upTo: Infinity, points: 100, label: '≥ 90' }
];

// ─── Variable 2: heart rate (beats/min) — increasing ──────────────────
/** @type {PointBand[]} */
const HEART_RATE_BANDS = [
  { upTo: 49, points: 0, label: '< 50' },
  { upTo: 69, points: 3, label: '50–69' },
  { upTo: 89, points: 9, label: '70–89' },
  { upTo: 109, points: 15, label: '90–109' },
  { upTo: 149, points: 24, label: '110–149' },
  { upTo: 199, points: 38, label: '150–199' },
  { upTo: Infinity, points: 46, label: '≥ 200' }
];

// ─── Variable 3: systolic BP (mmHg) — INVERSE (lower scores higher) ────
/** @type {PointBand[]} */
const SBP_BANDS = [
  { upTo: 79, points: 58, label: '< 80' },
  { upTo: 99, points: 53, label: '80–99' },
  { upTo: 119, points: 43, label: '100–119' },
  { upTo: 139, points: 34, label: '120–139' },
  { upTo: 159, points: 24, label: '140–159' },
  { upTo: 199, points: 10, label: '160–199' },
  { upTo: Infinity, points: 0, label: '≥ 200' }
];

// ─── Variable 4: serum creatinine (mg/dL, normalised) — increasing ────
/** @type {PointBand[]} */
const CREATININE_BANDS = [
  { upTo: 0.39, points: 1, label: '0–0.39' },
  { upTo: 0.79, points: 4, label: '0.4–0.79' },
  { upTo: 1.19, points: 7, label: '0.8–1.19' },
  { upTo: 1.59, points: 10, label: '1.2–1.59' },
  { upTo: 1.99, points: 13, label: '1.6–1.99' },
  { upTo: 3.99, points: 21, label: '2.0–3.99' },
  { upTo: Infinity, points: 28, label: '≥ 4.0' }
];

// ─── Variable 5: Killip class (heart-failure severity) ────────────────
const KILLIP_POINTS = { I: 0, II: 20, III: 39, IV: 59 };

// ─── Variables 6-8: fixed yes/no increments ───────────────────────────
const CARDIAC_ARREST_POINTS = 39;
const ST_DEVIATION_POINTS = 28;
const ELEVATED_ENZYMES_POINTS = 14;

// ─── Mortality-band thresholds (spec §4) ──────────────────────────────
const IN_HOSPITAL_THRESHOLDS = { low: 108, intermediate: 140 };
const SIX_MONTH_THRESHOLDS = { low: 88, intermediate: 118 };

// ─── Creatinine unit normalisation ────────────────────────────────────
const UMOL_PER_MGDL = 88.4;

/**
 * Normalise a serum-creatinine value to mg/dL. µmol/L is divided by 88.4;
 * mg/dL (or an unspecified unit) is passed through unchanged.
 * @param {number | null} value
 * @param {string} unit
 * @returns {number | null}
 */
function normaliseCreatinine(value, unit) {
  if (value === null || value === undefined) return null;
  return unit === 'umol/L' ? value / UMOL_PER_MGDL : value;
}

/**
 * Look up the points for a numeric value against an ordered band table.
 * A missing (null) value contributes 0 points.
 * @param {number | null} value
 * @param {PointBand[]} bands
 * @returns {{ points: number, label: string }}
 */
function bandLookup(value, bands) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return { points: 0, label: 'not recorded' };
  }
  for (const band of bands) {
    if (value <= band.upTo) return { points: band.points, label: band.label };
  }
  const last = bands[bands.length - 1];
  return { points: last.points, label: last.label };
}

/**
 * Map a point total to a low / intermediate / high band using the supplied
 * threshold pair.
 * @param {number} points
 * @param {{ low: number, intermediate: number }} thresholds
 * @returns {'low' | 'intermediate' | 'high'}
 */
function bandForTotal(points, thresholds) {
  if (points <= thresholds.low) return 'low';
  if (points <= thresholds.intermediate) return 'intermediate';
  return 'high';
}

/** Rank the three bands so the worse of two can be chosen. */
const BAND_RANK = { low: 0, intermediate: 1, high: 2 };

/** Return the worse (higher-rank) of two bands — the max-band rule. */
function worseBand(a, b) {
  return BAND_RANK[a] >= BAND_RANK[b] ? a : b;
}

/** Derived invasive-strategy recommendation keyed on the overall risk category. */
function invasiveStrategyText(category) {
  switch (category) {
    case 'high':
      return 'Early invasive strategy: coronary angiography within 24 hours, with senior cardiology review.';
    case 'intermediate':
      return 'Invasive strategy: coronary angiography within 72 hours.';
    case 'low':
      return 'Selective invasive strategy: non-invasive testing for ischaemia first, with angiography if positive.';
    default:
      return '';
  }
}

export { AGE_BANDS, HEART_RATE_BANDS, SBP_BANDS, CREATININE_BANDS, KILLIP_POINTS, CARDIAC_ARREST_POINTS, ST_DEVIATION_POINTS, ELEVATED_ENZYMES_POINTS, IN_HOSPITAL_THRESHOLDS, SIX_MONTH_THRESHOLDS, UMOL_PER_MGDL, normaliseCreatinine, bandLookup, bandForTotal, worseBand, invasiveStrategyText };
