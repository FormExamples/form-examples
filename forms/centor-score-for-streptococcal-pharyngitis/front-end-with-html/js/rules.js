// Declarative Centor grading rules.
//
// The Centor instrument has exactly four scored criteria, each worth 0 or 1
// point. Each rule below evaluates the patient data and returns true when its
// criterion is positive; the grader (`grader.js`) sums the points into the
// Centor total (0-4), applies the McIsaac age modifier, and derives the
// modified score and risk band. Rows here mirror the
// `centor_score_for_streptococcal_pharyngitis_grade_rule` SQL table
// (rule_id, criterion, points, category, description).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 *
 * @typedef {Object} CentorRule
 * @property {string} id
 * @property {string} criterion   - tonsillar-exudate | tender-nodes | fever | cough-absent
 * @property {number} points      - point contributed when the rule fires (1)
 * @property {string} category
 * @property {string} description
 * @property {(d: AssessmentData) => boolean} evaluate
 */

// Wrapped in an IIFE; published via window.CentorScoreForStreptococcalPharyngitis.

/** @type {CentorRule[]} */
const centorRules = [
  // ─── CRITERION 1: TONSILLAR EXUDATE ───────────────────────────
  {
    id: 'R-TONSILLAR-EXUDATE-01',
    criterion: 'tonsillar-exudate',
    points: 1,
    category: 'centor-criterion',
    description: 'Tonsillar exudate or swelling present',
    evaluate: (d) => d.exudate.tonsillarExudate === 'yes'
  },

  // ─── CRITERION 2: TENDER ANTERIOR CERVICAL NODES ──────────────
  {
    id: 'R-TENDER-NODES-01',
    criterion: 'tender-nodes',
    points: 1,
    category: 'centor-criterion',
    description: 'Tender, swollen anterior cervical lymphadenopathy',
    evaluate: (d) => d.nodes.tenderAnteriorCervicalNodes === 'yes'
  },

  // ─── CRITERION 3: FEVER (> 38 °C OR HISTORY OF FEVER) ──────────
  {
    id: 'R-FEVER-01',
    criterion: 'fever',
    points: 1,
    category: 'centor-criterion',
    description: 'Fever — temperature > 38 °C or a history of fever',
    evaluate: (d) =>
      d.fever.feverOver38 === 'yes' ||
      (d.fever.measuredTemperatureCelsius !== null &&
        d.fever.measuredTemperatureCelsius > 38.0)
  },

  // ─── CRITERION 4: ABSENCE OF COUGH ────────────────────────────
  {
    id: 'R-COUGH-ABSENT-01',
    criterion: 'cough-absent',
    points: 1,
    category: 'centor-criterion',
    description: 'Cough absent',
    evaluate: (d) => d.cough.absenceOfCough === 'yes'
  }
];

export { centorRules };
