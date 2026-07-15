// Declarative Wells PE grading rules.
//
// The Wells PE instrument has seven weighted clinical criteria. Six are yes/no
// enums; criterion 3 (heart rate > 100) is derived from a measured numeric
// heart rate. Each rule evaluates the patient data and returns true when its
// criterion is positive; the grader (`grader.js`) sums the weighted points into
// the total Wells score (0..12.5) and derives the two-level and three-level
// bands. Rows here mirror the
// `wells_score_for_pulmonary_embolism_grade_rule` SQL table
// (rule_id, points, category, description).
//
// Weights (spec §4): DVT signs +3, PE most likely +3, heart rate > 100 +1.5,
// immobilisation/surgery +1.5, previous DVT/PE +1.5, haemoptysis +1,
// malignancy +1.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 *
 * @typedef {Object} WellsRule
 * @property {string} id
 * @property {string} criterion   - criterion slug
 * @property {number} points      - weighted points contributed when the rule fires
 * @property {string} category
 * @property {string} description
 * @property {(d: AssessmentData) => boolean} evaluate
 */

// Wrapped in an IIFE; published via window.WellsScoreForPulmonaryEmbolism.

/** @type {WellsRule[]} */
const wellsRules = [
  // ─── CRITERION 1: CLINICAL SIGNS OF DVT (+3) ──────────────────
  {
    id: 'R-DVT-SIGNS-01',
    criterion: 'dvt-signs',
    points: 3,
    category: 'clinical-sign',
    description: 'Clinical signs and symptoms of DVT (leg swelling and pain on palpation of the deep veins)',
    evaluate: (d) => d.criteria.dvtSigns === 'yes'
  },

  // ─── CRITERION 2: PE MOST LIKELY (+3) ─────────────────────────
  {
    id: 'R-PE-MOST-LIKELY-01',
    criterion: 'pe-most-likely',
    points: 3,
    category: 'gestalt',
    description: 'PE is the number-one diagnosis, or equally likely',
    evaluate: (d) => d.criteria.peMostLikely === 'yes'
  },

  // ─── CRITERION 3: HEART RATE > 100 (+1.5) ─────────────────────
  {
    id: 'R-HEART-RATE-OVER-100-01',
    criterion: 'heart-rate-over-100',
    points: 1.5,
    category: 'tachycardia',
    description: 'Heart rate greater than 100 beats per minute',
    evaluate: (d) =>
      typeof d.observations.heartRate === 'number' &&
      !Number.isNaN(d.observations.heartRate) &&
      d.observations.heartRate > 100
  },

  // ─── CRITERION 4: IMMOBILISATION OR SURGERY (+1.5) ────────────
  {
    id: 'R-IMMOBILISATION-SURGERY-01',
    criterion: 'immobilisation-surgery',
    points: 1.5,
    category: 'immobilisation',
    description: 'Immobilisation for at least 3 days, or surgery in the previous 4 weeks',
    evaluate: (d) => d.criteria.immobilisationSurgery === 'yes'
  },

  // ─── CRITERION 5: PREVIOUS DVT / PE (+1.5) ────────────────────
  {
    id: 'R-PREVIOUS-DVT-PE-01',
    criterion: 'previous-dvt-pe',
    points: 1.5,
    category: 'previous-vte',
    description: 'Previous, objectively diagnosed DVT or PE',
    evaluate: (d) => d.criteria.previousDvtPe === 'yes'
  },

  // ─── CRITERION 6: HAEMOPTYSIS (+1) ────────────────────────────
  {
    id: 'R-HAEMOPTYSIS-01',
    criterion: 'haemoptysis',
    points: 1,
    category: 'haemoptysis',
    description: 'Haemoptysis',
    evaluate: (d) => d.criteria.haemoptysis === 'yes'
  },

  // ─── CRITERION 7: MALIGNANCY (+1) ─────────────────────────────
  {
    id: 'R-MALIGNANCY-01',
    criterion: 'malignancy',
    points: 1,
    category: 'malignancy',
    description: 'Malignancy on treatment, treated within the last 6 months, or palliative',
    evaluate: (d) => d.criteria.malignancy === 'yes'
  }
];

export { wellsRules };
