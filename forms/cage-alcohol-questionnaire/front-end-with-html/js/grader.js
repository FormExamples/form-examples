import { cageRules } from './rules.js';

// CAGE grader. Pure functions: take an `AssessmentData` object, evaluate the
// four criterion rules in `cageRules`, award 0 or 1 point each, sum the total
// (0-4), and derive the result band against the >= 2 positive-screen cut-off.
//
// Grading algorithm (spec §4):
//   cutDownPoint   = cutDown   == 'yes' ? 1 : 0
//   annoyedPoint   = annoyed   == 'yes' ? 1 : 0
//   guiltyPoint    = guilty    == 'yes' ? 1 : 0
//   eyeOpenerPoint = eyeOpener == 'yes' ? 1 : 0
//   cageScore  = sum (0..4)
//   resultBand = cageScore >= 2 ? 'positive' : cageScore == 1 ? 'low' : 'negative'
//
// An unanswered item ('') contributes 0 points (treated as "no" for scoring);
// `flags.js` raises a data-completeness flag separately.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').ResultBand} ResultBand
 * @typedef {import('./types.js').FiredCriterion} FiredCriterion
 */

/**
 * Evaluate the four CAGE criterion rules and collect the ones that fired.
 * @param {AssessmentData} data
 * @returns {FiredCriterion[]}
 */
function evaluateCriteria(data) {
  /** @type {FiredCriterion[]} */
  const fired = [];
  for (const rule of cageRules) {
    try {
      if (rule.evaluate(data)) {
        fired.push({
          id: rule.id,
          criterion: rule.criterion,
          points: rule.points,
          category: rule.category,
          description: rule.description
        });
      }
    } catch (e) {
      console.warn(`CAGE rule ${rule.id} evaluation failed:`, e);
    }
  }
  return fired;
}

/**
 * Compute the full CAGE grade for the supplied assessment data.
 * @param {AssessmentData} data
 * @returns {{ cutDownPoint: 0|1, annoyedPoint: 0|1, guiltyPoint: 0|1,
 *             eyeOpenerPoint: 0|1, cageScore: 0|1|2|3|4,
 *             resultBand: ResultBand, firedCriteria: FiredCriterion[] }}
 */
function calculateCageGrade(data) {
  const firedCriteria = evaluateCriteria(data);
  const has = (criterion) =>
    firedCriteria.some((f) => f.criterion === criterion);

  const cutDownPoint = has('cut-down') ? 1 : 0;
  const annoyedPoint = has('annoyed') ? 1 : 0;
  const guiltyPoint = has('guilty') ? 1 : 0;
  const eyeOpenerPoint = has('eye-opener') ? 1 : 0;

  const cageScore =
    cutDownPoint + annoyedPoint + guiltyPoint + eyeOpenerPoint;

  /** @type {ResultBand} */
  const resultBand =
    cageScore >= 2 ? 'positive' : cageScore === 1 ? 'low' : 'negative';

  // Record the derived result-band decision as a `total` audit row, mirroring
  // the grade_rule table's `total` parameter.
  firedCriteria.push({
    id: 'R-TOTAL-BAND-01',
    criterion: 'total',
    points: 0,
    category: 'total-band',
    description:
      cageScore >= 2
        ? `CAGE ${cageScore} of 4 (>= 2) — positive screen`
        : cageScore === 1
        ? 'CAGE 1 of 4 — one positive item; below the standard cut-off'
        : 'CAGE 0 of 4 — no positive items'
  });

  return {
    cutDownPoint,
    annoyedPoint,
    guiltyPoint,
    eyeOpenerPoint,
    cageScore,
    resultBand,
    firedCriteria
  };
}

export { evaluateCriteria, calculateCageGrade };
