// Declarative CURB-65 grading rules.
//
// CURB-65 has exactly five scored criteria, each worth 0 or 1 point:
//   C   Confusion (new-onset)
//   U   Urea > 7 mmol/L
//   R   Respiratory rate >= 30 breaths/min
//   B   Blood pressure: systolic < 90 OR diastolic <= 60 mmHg
//   65  Age >= 65 years
// Each rule below evaluates the patient data and returns true when its
// criterion is positive; the grader (`grader.js`) sums the points into the
// CURB-65 total (0-5), or — when serum urea was not measured — the CRB-65 total
// (0-4, omitting the urea rule). Rows here mirror the
// `curb_65_pneumonia_severity_score_grade_rule` SQL table
// (rule_id, criterion, points, category, description).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 *
 * @typedef {Object} Curb65Rule
 * @property {string} id
 * @property {string} criterion   - confusion | urea | respiratory-rate | blood-pressure | age
 * @property {number} points      - point contributed when the rule fires (1)
 * @property {string} category
 * @property {string} description
 * @property {(d: AssessmentData) => boolean} evaluate
 */

// Wrapped in an IIFE; published via window.Curb65PneumoniaSeverityScore.
(function () {
'use strict';
window.Curb65PneumoniaSeverityScore =
  window.Curb65PneumoniaSeverityScore || {};

/** @type {Curb65Rule[]} */
const curb65Rules = [
  // ─── CRITERION C: CONFUSION ───────────────────────────────────
  {
    id: 'R-CONFUSION-01',
    criterion: 'confusion',
    points: 1,
    category: 'curb-65-criterion',
    description: 'New-onset mental confusion (AMT <= 8, or new disorientation in person, place, or time)',
    evaluate: (d) => d.confusion.confusionPresent === 'yes'
  },

  // ─── CRITERION U: UREA ────────────────────────────────────────
  // Only scored when serum urea was measured; when it was not, the grader
  // computes the four-criterion CRB-65 variant and skips this rule.
  {
    id: 'R-UREA-01',
    criterion: 'urea',
    points: 1,
    category: 'curb-65-criterion',
    description: 'Serum urea > 7 mmol/L (blood urea nitrogen > 19 mg/dL)',
    evaluate: (d) =>
      d.urea.ureaMeasured === 'yes' &&
      d.urea.ureaMmolL !== null &&
      d.urea.ureaMmolL > 7
  },

  // ─── CRITERION R: RESPIRATORY RATE ────────────────────────────
  {
    id: 'R-RESPIRATORY-RATE-01',
    criterion: 'respiratory-rate',
    points: 1,
    category: 'curb-65-criterion',
    description: 'Respiratory rate >= 30 breaths per minute',
    evaluate: (d) =>
      d.respiratory.respiratoryRate !== null &&
      d.respiratory.respiratoryRate >= 30
  },

  // ─── CRITERION B: BLOOD PRESSURE ──────────────────────────────
  {
    id: 'R-BLOOD-PRESSURE-01',
    criterion: 'blood-pressure',
    points: 1,
    category: 'curb-65-criterion',
    description: 'Systolic blood pressure < 90 mmHg, or diastolic <= 60 mmHg',
    evaluate: (d) =>
      (d.bloodPressure.systolicBp !== null && d.bloodPressure.systolicBp < 90) ||
      (d.bloodPressure.diastolicBp !== null && d.bloodPressure.diastolicBp <= 60)
  },

  // ─── CRITERION 65: AGE ────────────────────────────────────────
  {
    id: 'R-AGE-01',
    criterion: 'age',
    points: 1,
    category: 'curb-65-criterion',
    description: 'Age >= 65 years',
    evaluate: (d) =>
      d.age.ageYears !== null && d.age.ageYears >= 65
  }
];

window.Curb65PneumoniaSeverityScore.curb65Rules = curb65Rules;
})();
