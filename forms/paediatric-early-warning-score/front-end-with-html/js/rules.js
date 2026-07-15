// Declarative PEWS per-parameter scoring rules (age-banded aggregate).
//
// PEWS scores seven parameters 0-3 each. Two of them — respiratory rate and
// heart rate — are scored against the NORMAL RANGE FOR THE SELECTED AGE BAND;
// the remaining five are scored from their enum / numeric value independently
// of age. Each pure scoring function below maps a measured value to its
// subscore per the bands in `index.md` / `spec/index.md` §4. The grader
// (`grader.js`) sums the subscores into the aggregate and derives the
// escalation band. The band tables here mirror the
// `paediatric_early_warning_score_grade_rule` SQL instrument rows.
//
// Age-banding is central: a heart or respiratory rate that is normal for a
// neonate is dangerously abnormal for a teenager, and vice versa. The age band
// must be selected first; when it is unset the rate parameters cannot be scored
// and contribute null.

/**
 * @typedef {import('./types.js').AgeBand} AgeBand
 * @typedef {import('./types.js').RespiratoryEffort} RespiratoryEffort
 * @typedef {import('./types.js').SupplementalOxygen} SupplementalOxygen
 * @typedef {import('./types.js').CapillaryRefill} CapillaryRefill
 * @typedef {import('./types.js').Consciousness} Consciousness
 */

// Age-band scoring tables for the two rate parameters. Each parameter is an
// ordered list of [upperBoundInclusive, score] pairs covering the whole
// numeric domain. `scoreAgainstBand` returns the score of the first pair whose
// upper bound is >= the measured value. The score-0 span is the age-band NORMAL
// range from index.md; increasing deviation above or below scores 1, 2, then 3
// (grossly abnormal / apnoea / extreme tachy-/brady-cardia).
//
//   neonate     0–<1 month : RR normal 40–60 | HR normal 110–160
//   infant      1–11 months: RR normal 30–50 | HR normal 100–160
//   young-child 1–4 years  : RR normal 20–40 | HR normal  90–140
//   child       5–11 years : RR normal 18–30 | HR normal  70–120
//   adolescent  ≥ 12 years : RR normal 12–20 | HR normal  60–100
const AGE_BAND_TABLE = {
  neonate: {
    respiratoryRate: [[19, 3], [29, 2], [39, 1], [60, 0], [70, 1], [80, 2], [Infinity, 3]],
    heartRate:       [[79, 3], [99, 2], [109, 1], [160, 0], [180, 1], [200, 2], [Infinity, 3]]
  },
  infant: {
    respiratoryRate: [[14, 3], [24, 2], [29, 1], [50, 0], [60, 1], [70, 2], [Infinity, 3]],
    heartRate:       [[69, 3], [89, 2], [99, 1], [160, 0], [180, 1], [200, 2], [Infinity, 3]]
  },
  'young-child': {
    respiratoryRate: [[9, 3], [14, 2], [19, 1], [40, 0], [50, 1], [60, 2], [Infinity, 3]],
    heartRate:       [[59, 3], [79, 2], [89, 1], [140, 0], [160, 1], [180, 2], [Infinity, 3]]
  },
  child: {
    respiratoryRate: [[7, 3], [12, 2], [17, 1], [30, 0], [40, 1], [50, 2], [Infinity, 3]],
    heartRate:       [[49, 3], [59, 2], [69, 1], [120, 0], [140, 1], [160, 2], [Infinity, 3]]
  },
  adolescent: {
    respiratoryRate: [[5, 3], [8, 2], [11, 1], [20, 0], [24, 1], [29, 2], [Infinity, 3]],
    heartRate:       [[39, 3], [49, 2], [59, 1], [100, 0], [120, 1], [140, 2], [Infinity, 3]]
  }
};

/**
 * Score a measured numeric value against the age-band table for a parameter.
 * @param {number | null} value
 * @param {AgeBand} ageBand
 * @param {'respiratoryRate' | 'heartRate'} parameter
 * @returns {0|1|2|3|null} null when the value is unrecorded or the age band is unset.
 */
function scoreAgainstBand(value, ageBand, parameter) {
  if (value === null || value === undefined || Number.isNaN(value)) return null;
  if (!ageBand || !AGE_BAND_TABLE[ageBand]) return null;
  const table = AGE_BAND_TABLE[ageBand][parameter];
  for (const [upper, score] of table) {
    if (value <= upper) return score;
  }
  return 3;
}

/**
 * Respiratory rate (breaths/min), scored against the age-band normal range.
 * @param {number | null} rr
 * @param {AgeBand} ageBand
 * @returns {0|1|2|3|null}
 */
function scoreRespiratoryRate(rr, ageBand) {
  return scoreAgainstBand(rr, ageBand, 'respiratoryRate');
}

/**
 * Heart rate (beats/min), scored against the age-band normal range.
 * @param {number | null} hr
 * @param {AgeBand} ageBand
 * @returns {0|1|2|3|null}
 */
function scoreHeartRate(hr, ageBand) {
  return scoreAgainstBand(hr, ageBand, 'heartRate');
}

/**
 * Respiratory effort / recession: none 0, mild 1, moderate 2, severe/grunting 3.
 * @param {RespiratoryEffort} effort
 * @returns {0|1|2|3|null}
 */
function scoreRespiratoryEffort(effort) {
  switch (effort) {
    case 'none': return 0;
    case 'mild': return 1;
    case 'moderate': return 2;
    case 'severe': return 3;
    default: return null;
  }
}

/**
 * Oxygen saturation (SpO₂, %): ≥ 96 → 0, 94–95 → 1, 92–93 → 2, < 92 → 3.
 * @param {number | null} spo2
 * @returns {0|1|2|3|null}
 */
function scoreOxygenSaturation(spo2) {
  if (spo2 === null || spo2 === undefined || Number.isNaN(spo2)) return null;
  if (spo2 >= 96) return 0;
  if (spo2 >= 94) return 1;
  if (spo2 >= 92) return 2;
  return 3;
}

/**
 * Supplemental oxygen: room-air 0, low-flow 1, high-flow 3 (there is no 2).
 * @param {SupplementalOxygen} value
 * @returns {0|1|3|null}
 */
function scoreSupplementalOxygen(value) {
  switch (value) {
    case 'room-air': return 0;
    case 'low-flow': return 1;
    case 'high-flow': return 3;
    default: return null;
  }
}

/**
 * Capillary refill / colour: <2s 0, 2–3s 1, 3–4s 2, >4s 3.
 * @param {CapillaryRefill} value
 * @returns {0|1|2|3|null}
 */
function scoreCapillaryRefill(value) {
  switch (value) {
    case 'under-2s': return 0;
    case '2-3s': return 1;
    case '3-4s': return 2;
    case 'over-4s': return 3;
    default: return null;
  }
}

/**
 * Consciousness (ACVPU): alert 0, voice 1, pain 2, unresponsive 3.
 * @param {Consciousness} value
 * @returns {0|1|2|3|null}
 */
function scoreConsciousness(value) {
  switch (value) {
    case 'alert': return 0;
    case 'voice': return 1;
    case 'pain': return 2;
    case 'unresponsive': return 3;
    default: return null;
  }
}

export { AGE_BAND_TABLE, scoreAgainstBand, scoreRespiratoryRate, scoreHeartRate, scoreRespiratoryEffort, scoreOxygenSaturation, scoreSupplementalOxygen, scoreCapillaryRefill, scoreConsciousness };
