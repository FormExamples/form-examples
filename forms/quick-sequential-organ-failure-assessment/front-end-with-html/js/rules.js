// Declarative qSOFA grading rules.
//
// The qSOFA instrument has exactly three scored criteria, each worth 0 or 1
// point. Each rule below evaluates the patient data and returns true when its
// criterion is positive; the grader (`grader.js`) sums the points into the
// total qSOFA score (0-3) and derives the risk band. Rows here mirror the
// `quick_sequential_organ_failure_assessment_grade_rule` SQL table
// (rule_id, criterion, points, category, description).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 *
 * @typedef {Object} QsofaRule
 * @property {string} id
 * @property {string} criterion   - respiratory-rate | mentation | systolic-blood-pressure
 * @property {number} points      - point contributed when the rule fires (1)
 * @property {string} category
 * @property {string} description
 * @property {(d: AssessmentData) => boolean} evaluate
 */

/** @type {QsofaRule[]} */
const qsofaRules = [
  // ─── CRITERION 1: RESPIRATORY RATE ────────────────────────────
  {
    id: 'R-RESPIRATORY-RATE-01',
    criterion: 'respiratory-rate',
    points: 1,
    category: 'qsofa-criterion',
    description: 'Respiratory rate >= 22 breaths per minute',
    evaluate: (d) =>
      d.respiratory.respiratoryRate !== null &&
      d.respiratory.respiratoryRate >= 22
  },

  // ─── CRITERION 2: MENTATION ───────────────────────────────────
  {
    id: 'R-MENTATION-01',
    criterion: 'mentation',
    points: 1,
    category: 'qsofa-criterion',
    description: 'Altered mentation — Glasgow Coma Scale < 15, or altered from baseline',
    evaluate: (d) =>
      (d.mentation.glasgowComaScale !== null &&
        d.mentation.glasgowComaScale < 15) ||
      d.mentation.mentationAltered === 'yes'
  },

  // ─── CRITERION 3: SYSTOLIC BLOOD PRESSURE ─────────────────────
  {
    id: 'R-SYSTOLIC-BLOOD-PRESSURE-01',
    criterion: 'systolic-blood-pressure',
    points: 1,
    category: 'qsofa-criterion',
    description: 'Systolic blood pressure <= 100 mmHg',
    evaluate: (d) =>
      d.circulation.systolicBloodPressure !== null &&
      d.circulation.systolicBloodPressure <= 100
  }
];

export { qsofaRules };
