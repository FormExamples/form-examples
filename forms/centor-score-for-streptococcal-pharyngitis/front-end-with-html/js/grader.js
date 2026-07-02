// Centor grader. Pure functions: take an `AssessmentData` object, evaluate the
// four criterion rules in `centorRules`, award 0 or 1 point each, sum the Centor
// total (0-4), apply the McIsaac age modifier, and derive the modified score and
// risk band.
//
// Grading algorithm (spec §4):
//   tonsillarExudatePoint = tonsillarExudate == 'yes'            ? 1 : 0
//   tenderNodesPoint      = tenderAnteriorCervicalNodes == 'yes' ? 1 : 0
//   feverPoint            = feverOver38 == 'yes'
//                           || (measuredTemperatureCelsius != null && > 38.0) ? 1 : 0
//   coughAbsentPoint      = absenceOfCough == 'yes'              ? 1 : 0
//   centorScore  = sum (0..4)
//   ageModifier  = ageYears == null ? 0 : (3..14 ? +1 : >=45 ? -1 : 0)
//   mcIsaacScore = centorScore + ageModifier   (-1..5)
//   riskBand     = mcIsaacScore <= 1 ? 'low' : mcIsaacScore <= 3 ? 'moderate' : 'high'
//
// A missing age applies a modifier of 0 (the adult 15-44 default); `flags.js`
// raises a data-completeness flag separately. Banding uses the McIsaac score so
// the age-related probability is reflected; the original Centor total is
// retained alongside.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').RiskBand} RiskBand
 * @typedef {import('./types.js').FiredCriterion} FiredCriterion
 */

// Wrapped in an IIFE; published via window.CentorScoreForStreptococcalPharyngitis.
(function () {
'use strict';
window.CentorScoreForStreptococcalPharyngitis =
  window.CentorScoreForStreptococcalPharyngitis || {};
const { centorRules } = window.CentorScoreForStreptococcalPharyngitis;

/**
 * Compute the McIsaac age modifier for a whole-year age.
 * +1 for ages 3-14, -1 for ages >= 45, 0 for 15-44, and 0 when age is missing.
 * @param {number | null} ageYears
 * @returns {-1 | 0 | 1}
 */
function ageModifierFor(ageYears) {
  if (ageYears === null || ageYears === undefined) return 0;
  if (ageYears >= 3 && ageYears <= 14) return 1;
  if (ageYears >= 45) return -1;
  return 0;
}

/**
 * Evaluate the four Centor criterion rules and collect the ones that fired.
 * @param {AssessmentData} data
 * @returns {FiredCriterion[]}
 */
function evaluateCriteria(data) {
  /** @type {FiredCriterion[]} */
  const fired = [];
  for (const rule of centorRules) {
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
      console.warn(`Centor rule ${rule.id} evaluation failed:`, e);
    }
  }
  return fired;
}

/**
 * Compute the full Centor / McIsaac grade for the supplied assessment data.
 * @param {AssessmentData} data
 * @returns {{ tonsillarExudatePoint: 0|1, tenderNodesPoint: 0|1,
 *             feverPoint: 0|1, coughAbsentPoint: 0|1,
 *             centorScore: 0|1|2|3|4, ageModifier: -1|0|1,
 *             mcIsaacScore: number, riskBand: RiskBand,
 *             firedCriteria: FiredCriterion[] }}
 */
function calculateCentorGrade(data) {
  const firedCriteria = evaluateCriteria(data);
  const has = (criterion) =>
    firedCriteria.some((f) => f.criterion === criterion);

  const tonsillarExudatePoint = has('tonsillar-exudate') ? 1 : 0;
  const tenderNodesPoint = has('tender-nodes') ? 1 : 0;
  const feverPoint = has('fever') ? 1 : 0;
  const coughAbsentPoint = has('cough-absent') ? 1 : 0;

  const centorScore =
    tonsillarExudatePoint + tenderNodesPoint + feverPoint + coughAbsentPoint;

  const ageModifier = ageModifierFor(data.identification.ageYears);
  const mcIsaacScore = centorScore + ageModifier;

  /** @type {RiskBand} */
  const riskBand =
    mcIsaacScore <= 1 ? 'low' : mcIsaacScore <= 3 ? 'moderate' : 'high';

  // Record the age modifier as an audit row, mirroring the grade_rule table's
  // `age-modifier` criterion.
  firedCriteria.push({
    id: 'R-AGE-MODIFIER-01',
    criterion: 'age-modifier',
    points: ageModifier,
    category: 'mcisaac-modifier',
    description:
      data.identification.ageYears === null
        ? 'Age not recorded — McIsaac age modifier 0 (adult 15–44 default)'
        : ageModifier > 0
          ? 'Age 3–14 — McIsaac age modifier +1'
          : ageModifier < 0
            ? 'Age 45 or over — McIsaac age modifier −1'
            : 'Age 15–44 — McIsaac age modifier 0'
  });

  // Record the derived risk-band decision as a `band` audit row, mirroring the
  // grade_rule table's `band` criterion.
  firedCriteria.push({
    id: 'R-BAND-01',
    criterion: 'band',
    points: 0,
    category: 'risk-band',
    description:
      riskBand === 'high'
        ? 'McIsaac 4–5 — high probability of streptococcal pharyngitis'
        : riskBand === 'moderate'
          ? 'McIsaac 2–3 — moderate probability of streptococcal pharyngitis'
          : 'McIsaac ≤ 1 — low probability of streptococcal pharyngitis'
  });

  return {
    tonsillarExudatePoint,
    tenderNodesPoint,
    feverPoint,
    coughAbsentPoint,
    centorScore,
    ageModifier,
    mcIsaacScore,
    riskBand,
    firedCriteria
  };
}

Object.assign(window.CentorScoreForStreptococcalPharyngitis, {
  ageModifierFor,
  evaluateCriteria,
  calculateCentorGrade
});
})();
