// Declarative Rockall grading rules.
//
// The Rockall instrument scores three clinical parameters — age, shock (derived
// from systolic blood pressure and heart rate), and comorbidity — for a
// pre-endoscopy (clinical) score of 0-7, and adds two endoscopic parameters —
// diagnosis and stigmata of recent haemorrhage — for a full (post-endoscopy)
// score of 0-11 when endoscopy has been performed (spec §4). This file holds the
// pure per-parameter scoring helpers, the risk banding, and a declarative rule
// table whose rows mirror the
// `rockall_score_for_upper_gastrointestinal_bleeding_grade_rule` SQL table
// (rule_id, parameter, points, category, description). The grader (`grader.js`)
// sums the clinical points and, when endoscopy is performed, the endoscopic
// points, then bands the total.
//
// Thresholds (spec §4):
//   age (years):    < 60 -> 0,  60-79 -> 1,  >= 80 -> 2
//   shock:          SBP < 100 -> 2 (hypotension); else HR >= 100 -> 1 (tachycardia); else 0
//   comorbidity:    none -> 0,  major -> 2,  severe -> 3
//   diagnosis:      mallory-weiss-or-none -> 0,  all-other -> 1,  upper-gi-malignancy -> 2
//   stigmata:       none-or-dark-spot -> 0,  high-risk -> 2
//
// A missing numeric input contributes 0 points for its parameter; `flags.js`
// raises a data-completeness flag separately.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').RiskBand} RiskBand
 *
 * @typedef {Object} RockallRule
 * @property {string} id
 * @property {string} parameter   - age | shock | comorbidity | diagnosis | stigmata
 * @property {number} points      - points awarded when the rule fires
 * @property {string} category
 * @property {string} description
 * @property {(d: AssessmentData) => boolean} evaluate
 */

/**
 * Clinical parameter — age (years). Returns 0/1/2; a missing age scores 0.
 * @param {AssessmentData} d
 * @returns {0 | 1 | 2}
 */
function agePoints(d) {
  const v = d.identification.ageYears;
  if (v === null || v === undefined) return 0;
  if (v >= 80) return 2;
  if (v >= 60) return 1;
  return 0;
}

/**
 * Clinical parameter — shock, derived from the two vital signs. Hypotension
 * (SBP < 100) scores 2 and takes precedence over tachycardia (HR >= 100, 1);
 * otherwise 0. A missing vital sign simply cannot trigger its band.
 * @param {AssessmentData} d
 * @returns {0 | 1 | 2}
 */
function shockPoints(d) {
  const sbp = d.shock.systolicBloodPressure;
  const hr = d.shock.heartRate;
  if (sbp !== null && sbp !== undefined && sbp < 100) return 2;
  if (hr !== null && hr !== undefined && hr >= 100) return 1;
  return 0;
}

/**
 * Clinical parameter — comorbidity. Returns 0/2/3; unanswered scores 0.
 * @param {AssessmentData} d
 * @returns {0 | 2 | 3}
 */
function comorbidityPoints(d) {
  switch (d.comorbidityStep.comorbidity) {
    case 'severe': return 3;
    case 'major': return 2;
    default: return 0;
  }
}

/**
 * Endoscopic parameter — diagnosis. Returns 0/1/2; unanswered scores 0.
 * @param {AssessmentData} d
 * @returns {0 | 1 | 2}
 */
function diagnosisPoints(d) {
  switch (d.endoscopy.diagnosis) {
    case 'upper-gi-malignancy': return 2;
    case 'all-other': return 1;
    default: return 0; // mallory-weiss-or-none / ''
  }
}

/**
 * Endoscopic parameter — stigmata of recent haemorrhage. Returns 0/2.
 * @param {AssessmentData} d
 * @returns {0 | 2}
 */
function stigmataPoints(d) {
  return d.endoscopy.stigmata === 'high-risk' ? 2 : 0;
}

/**
 * Band a Rockall assessment. When endoscopy has been performed the full score
 * (0-11) drives the band (<= 2 low, 3-4 intermediate, >= 5 high). Otherwise the
 * clinical score stands: a clinical 0 bands as `low`, anything else as
 * `clinical-only` (pre-endoscopy score reported without a full-score band).
 * @param {number} clinical         - clinical Rockall score 0-7
 * @param {number | null} full      - full Rockall score 0-11, or null
 * @returns {RiskBand}
 */
function riskBand(clinical, full) {
  if (full !== null) {
    if (full <= 2) return 'low';
    if (full <= 4) return 'intermediate';
    return 'high';
  }
  return clinical === 0 ? 'low' : 'clinical-only';
}

// Declarative rule table — one row per parameter/band combination. Exactly one
// row per parameter fires (the highest-band clinical rows are exclusive by
// construction of the helpers). Rows mirror the
// `rockall_score_for_upper_gastrointestinal_bleeding_grade_rule` SQL table.
/** @type {RockallRule[]} */
const rockallRules = [
  // ─── CLINICAL PARAMETER 1: AGE ────────────────────────────────
  {
    id: 'R-AGE-0POINT-01',
    parameter: 'age',
    points: 0,
    category: 'clinical-parameter',
    description: 'Age < 60 years',
    evaluate: (d) => d.identification.ageYears !== null && agePoints(d) === 0
  },
  {
    id: 'R-AGE-1POINT-01',
    parameter: 'age',
    points: 1,
    category: 'clinical-parameter',
    description: 'Age 60-79 years',
    evaluate: (d) => agePoints(d) === 1
  },
  {
    id: 'R-AGE-2POINT-01',
    parameter: 'age',
    points: 2,
    category: 'clinical-parameter',
    description: 'Age >= 80 years',
    evaluate: (d) => agePoints(d) === 2
  },

  // ─── CLINICAL PARAMETER 2: SHOCK ──────────────────────────────
  {
    id: 'R-SHOCK-0POINT-01',
    parameter: 'shock',
    points: 0,
    category: 'clinical-parameter',
    description: 'No shock (systolic BP >= 100 mmHg and heart rate < 100 bpm)',
    evaluate: (d) =>
      (d.shock.systolicBloodPressure !== null || d.shock.heartRate !== null) &&
      shockPoints(d) === 0
  },
  {
    id: 'R-SHOCK-1POINT-01',
    parameter: 'shock',
    points: 1,
    category: 'clinical-parameter',
    description: 'Tachycardia (heart rate >= 100 bpm, systolic BP >= 100 mmHg)',
    evaluate: (d) => shockPoints(d) === 1
  },
  {
    id: 'R-SHOCK-2POINT-01',
    parameter: 'shock',
    points: 2,
    category: 'clinical-parameter',
    description: 'Hypotension (systolic BP < 100 mmHg)',
    evaluate: (d) => shockPoints(d) === 2
  },

  // ─── CLINICAL PARAMETER 3: COMORBIDITY ────────────────────────
  {
    id: 'R-COMORBIDITY-0POINT-01',
    parameter: 'comorbidity',
    points: 0,
    category: 'clinical-parameter',
    description: 'No major comorbidity',
    evaluate: (d) => d.comorbidityStep.comorbidity === 'none'
  },
  {
    id: 'R-COMORBIDITY-2POINT-01',
    parameter: 'comorbidity',
    points: 2,
    category: 'clinical-parameter',
    description: 'Cardiac failure, ischaemic heart disease, or any major comorbidity',
    evaluate: (d) => comorbidityPoints(d) === 2
  },
  {
    id: 'R-COMORBIDITY-3POINT-01',
    parameter: 'comorbidity',
    points: 3,
    category: 'clinical-parameter',
    description: 'Renal failure, liver failure, or disseminated malignancy',
    evaluate: (d) => comorbidityPoints(d) === 3
  },

  // ─── ENDOSCOPIC PARAMETER 1: DIAGNOSIS (full score only) ──────
  {
    id: 'R-DIAGNOSIS-0POINT-01',
    parameter: 'diagnosis',
    points: 0,
    category: 'endoscopic-parameter',
    description: 'Mallory-Weiss tear, no lesion, and no stigmata of recent haemorrhage',
    evaluate: (d) =>
      d.endoscopy.endoscopyPerformed === 'yes' &&
      d.endoscopy.diagnosis === 'mallory-weiss-or-none'
  },
  {
    id: 'R-DIAGNOSIS-1POINT-01',
    parameter: 'diagnosis',
    points: 1,
    category: 'endoscopic-parameter',
    description: 'All other diagnoses',
    evaluate: (d) =>
      d.endoscopy.endoscopyPerformed === 'yes' && diagnosisPoints(d) === 1
  },
  {
    id: 'R-DIAGNOSIS-2POINT-01',
    parameter: 'diagnosis',
    points: 2,
    category: 'endoscopic-parameter',
    description: 'Malignancy of the upper GI tract',
    evaluate: (d) =>
      d.endoscopy.endoscopyPerformed === 'yes' && diagnosisPoints(d) === 2
  },

  // ─── ENDOSCOPIC PARAMETER 2: STIGMATA (full score only) ───────
  {
    id: 'R-STIGMATA-0POINT-01',
    parameter: 'stigmata',
    points: 0,
    category: 'endoscopic-parameter',
    description: 'No stigmata, or dark spot only',
    evaluate: (d) =>
      d.endoscopy.endoscopyPerformed === 'yes' &&
      d.endoscopy.stigmata === 'none-or-dark-spot'
  },
  {
    id: 'R-STIGMATA-2POINT-01',
    parameter: 'stigmata',
    points: 2,
    category: 'endoscopic-parameter',
    description: 'Blood in the upper GI tract, adherent clot, or visible / spurting vessel',
    evaluate: (d) =>
      d.endoscopy.endoscopyPerformed === 'yes' && stigmataPoints(d) === 2
  }
];

export { agePoints, shockPoints, comorbidityPoints, diagnosisPoints, stigmataPoints, riskBand, rockallRules };
