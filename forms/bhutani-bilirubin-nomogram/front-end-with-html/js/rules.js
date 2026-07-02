// Tabulated Bhutani nomogram percentile curves and NICE gestation-specific
// treatment-threshold curves, plus the linear-interpolation helpers and
// gestation-band selector used by the classifier in `grader.js`.
//
// Unlike an additive score, the Bhutani instrument is a *classification*: a
// measured point (age-in-hours, TSB) is banded against interpolated percentile
// tracks (prediction), and the same point is compared with interpolated
// treatment-threshold curves (treatment signal). This file holds the reference
// data — nothing here mutates state or performs I/O.
//
// All TSB values are micromoles per litre (µmol/L, UK/SI convention). The
// percentile anchors are digitised from the Bhutani 1999 hour-specific
// predischarge nomogram (mg/dL × 17.1); the treatment thresholds are digitised
// from the NICE CG98 gestation-specific phototherapy and exchange-transfusion
// graphs. Values are clinically representative anchor points; the engine
// linearly interpolates between them.

// Wrapped in an IIFE; published via window.BhutaniBilirubinNomogram.
(function () {
'use strict';
window.BhutaniBilirubinNomogram = window.BhutaniBilirubinNomogram || {};

// ─── Nomogram domain (spec §4) ──────────────────────────────────
/** Lowest defined age on the nomogram (hours). */
const AGE_MIN_HOURS = 0;
/** Highest defined age on the nomogram (hours, ≈ 7 days). */
const AGE_MAX_HOURS = 168;

// ─── Bhutani percentile tracks (prediction) ─────────────────────
// Each row: [ageHours, p40, p75, p95] in µmol/L. Monotonic in age; the three
// percentile tracks never cross. The engine interpolates each track at the
// measured age, then bands the measured TSB.
/** @type {Array<[number, number, number, number]>} */
const PERCENTILE_ANCHORS = [
  //  age   p40   p75   p95
  [   0,     34,   60,   86],
  [  12,     74,  101,  121],
  [  24,    101,  135,  169],
  [  36,    130,  169,  214],
  [  48,    147,  195,  245],
  [  60,    162,  215,  272],
  [  72,    174,  231,  291],
  [  84,    183,  241,  304],
  [  96,    190,  248,  315],
  [ 120,    198,  257,  328],
  [ 144,    202,  262,  335],
  [ 168,    205,  265,  339]
];

// ─── NICE treatment-threshold curves (treatment signal) ─────────
// Each gestation band maps to a phototherapy curve and an exchange curve.
// Each curve is an array of [ageHours, thresholdUmolL] anchors. Thresholds
// rise with postnatal age then plateau, and are lower for lower gestation.
/** @type {Record<string, {phototherapy: Array<[number, number]>, exchange: Array<[number, number]>}>} */
const THRESHOLD_CURVES = {
  // Term and post-term (≥ 38 completed weeks) — the NICE consolidated chart.
  term: {
    phototherapy: [[0, 100], [24, 200], [48, 260], [72, 300], [96, 350], [168, 350]],
    exchange:     [[0, 150], [24, 250], [48, 350], [72, 450], [96, 450], [168, 450]]
  },
  // 37 completed weeks.
  '37': {
    phototherapy: [[0, 90], [24, 180], [48, 240], [72, 280], [96, 330], [168, 330]],
    exchange:     [[0, 140], [24, 230], [48, 330], [72, 420], [96, 420], [168, 420]]
  },
  // 36 completed weeks.
  '36': {
    phototherapy: [[0, 80], [24, 165], [48, 220], [72, 260], [96, 310], [168, 310]],
    exchange:     [[0, 130], [24, 215], [48, 310], [72, 400], [96, 400], [168, 400]]
  },
  // 35 completed weeks (lower bound of the principally-supported range).
  '35': {
    phototherapy: [[0, 70], [24, 150], [48, 200], [72, 240], [96, 290], [168, 290]],
    exchange:     [[0, 120], [24, 200], [48, 290], [72, 380], [96, 380], [168, 380]]
  },
  // Below 35 weeks — conservative fallback; specialist charts should be used.
  under35: {
    phototherapy: [[0, 60], [24, 135], [48, 180], [72, 220], [96, 260], [168, 260]],
    exchange:     [[0, 110], [24, 185], [48, 270], [72, 350], [96, 350], [168, 350]]
  }
};

/**
 * Select the gestation band whose NICE threshold curve applies. Term curve is
 * the safe default when gestational age is not recorded.
 * @param {number | null} weeks
 * @returns {string} one of 'term' | '37' | '36' | '35' | 'under35'
 */
function gestationBand(weeks) {
  if (weeks === null || weeks === undefined || Number.isNaN(weeks)) return 'term';
  if (weeks >= 38) return 'term';
  if (weeks >= 37) return '37';
  if (weeks >= 36) return '36';
  if (weeks >= 35) return '35';
  return 'under35';
}

/**
 * Linear interpolation of a value against an array of [x, y] anchor points.
 * The lookup `x` is clamped to the anchor domain (no extrapolation).
 * @param {Array<[number, number]>} anchors  - sorted ascending by x
 * @param {number} x
 * @returns {number} interpolated y
 */
function interpolate(anchors, x) {
  const first = anchors[0];
  const last = anchors[anchors.length - 1];
  if (x <= first[0]) return first[1];
  if (x >= last[0]) return last[1];
  for (let i = 0; i < anchors.length - 1; i++) {
    const [x0, y0] = anchors[i];
    const [x1, y1] = anchors[i + 1];
    if (x >= x0 && x <= x1) {
      if (x1 === x0) return y0;
      const t = (x - x0) / (x1 - x0);
      return y0 + t * (y1 - y0);
    }
  }
  return last[1];
}

/**
 * Interpolate the three Bhutani percentile tracks at a given age in hours.
 * @param {number} ageHours  - clamped to the nomogram domain by the caller
 * @returns {{ p40: number, p75: number, p95: number }}
 */
function percentileTracks(ageHours) {
  const p40Anchors = PERCENTILE_ANCHORS.map((r) => [r[0], r[1]]);
  const p75Anchors = PERCENTILE_ANCHORS.map((r) => [r[0], r[2]]);
  const p95Anchors = PERCENTILE_ANCHORS.map((r) => [r[0], r[3]]);
  return {
    p40: interpolate(p40Anchors, ageHours),
    p75: interpolate(p75Anchors, ageHours),
    p95: interpolate(p95Anchors, ageHours)
  };
}

/**
 * Interpolate the phototherapy and exchange thresholds for a gestation band at
 * a given age in hours.
 * @param {string} band       - from gestationBand()
 * @param {number} ageHours   - clamped to the nomogram domain by the caller
 * @returns {{ phototherapy: number, exchange: number }}
 */
function thresholds(band, ageHours) {
  const curves = THRESHOLD_CURVES[band] || THRESHOLD_CURVES.term;
  return {
    phototherapy: interpolate(curves.phototherapy, ageHours),
    exchange: interpolate(curves.exchange, ageHours)
  };
}

/** Round a number to one decimal place (returns null unchanged). */
function roundOne(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return null;
  return Math.round(n * 10) / 10;
}

Object.assign(window.BhutaniBilirubinNomogram, {
  AGE_MIN_HOURS,
  AGE_MAX_HOURS,
  PERCENTILE_ANCHORS,
  THRESHOLD_CURVES,
  gestationBand,
  interpolate,
  percentileTracks,
  thresholds,
  roundOne
});
})();
