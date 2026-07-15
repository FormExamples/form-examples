import { wellsRules } from './rules.js';

// Wells DVT grader. Pure functions: take an `AssessmentData` object, evaluate
// the ten rules in `wellsRules`, award +1 per positive criterion (nine of them)
// and −2 for the alternative-diagnosis adjustment, sum the total (−2..9), and
// derive the two-level (NICE NG158) and three-level (original Wells) bands.
//
// Grading algorithm (spec §4):
//   plus  = sum of +1 for each of the nine criteria whose value == 'yes'  // 0..9
//   minus = alternativeDiagnosisAsLikely == 'yes' ? 2 : 0                  // 0 or 2
//   wellsScore = plus - minus                                             // -2..9
//   twoLevelBand   = wellsScore >= 2 ? 'likely' : 'unlikely'
//   threeLevelBand = wellsScore >= 3 ? 'high' : wellsScore >= 1 ? 'moderate' : 'low'
//   recommendedInvestigation = twoLevelBand == 'likely'
//                            ? 'proximal-leg-vein-ultrasound' : 'd-dimer'
//
// A criterion left blank ('') or 'no' contributes 0 points (absent, not
// positive); `flags.js` raises a data-completeness flag separately.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').TwoLevelBand} TwoLevelBand
 * @typedef {import('./types.js').ThreeLevelBand} ThreeLevelBand
 * @typedef {import('./types.js').RecommendedInvestigation} RecommendedInvestigation
 * @typedef {import('./types.js').FiredCriterion} FiredCriterion
 */

/**
 * Evaluate the ten Wells rules and collect the ones that fired.
 * @param {AssessmentData} data
 * @returns {FiredCriterion[]}
 */
function evaluateCriteria(data) {
  /** @type {FiredCriterion[]} */
  const fired = [];
  for (const rule of wellsRules) {
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
      console.warn(`Wells DVT rule ${rule.id} evaluation failed:`, e);
    }
  }
  return fired;
}

/**
 * Compute the full Wells DVT grade for the supplied assessment data.
 * @param {AssessmentData} data
 * @returns {{ criterionPoints: Record<string, number>, wellsScore: number,
 *             twoLevelBand: TwoLevelBand, threeLevelBand: ThreeLevelBand,
 *             recommendedInvestigation: RecommendedInvestigation,
 *             firedCriteria: FiredCriterion[] }}
 */
function calculateWellsGrade(data) {
  const firedCriteria = evaluateCriteria(data);

  /** @type {Record<string, number>} */
  const criterionPoints = {};
  for (const rule of wellsRules) {
    criterionPoints[rule.criterion] = rule.evaluate(data) ? rule.points : 0;
  }

  const plus = wellsRules
    .filter((r) => r.points === 1 && r.evaluate(data))
    .reduce((sum, r) => sum + r.points, 0);
  const minus = data.alternative.alternativeDiagnosisAsLikely === 'yes' ? 2 : 0;

  const wellsScore = plus - minus;

  /** @type {TwoLevelBand} */
  const twoLevelBand = wellsScore >= 2 ? 'likely' : 'unlikely';
  /** @type {ThreeLevelBand} */
  const threeLevelBand =
    wellsScore >= 3 ? 'high' : wellsScore >= 1 ? 'moderate' : 'low';
  /** @type {RecommendedInvestigation} */
  const recommendedInvestigation =
    twoLevelBand === 'likely' ? 'proximal-leg-vein-ultrasound' : 'd-dimer';

  // Record the derived band decisions as audit rows, mirroring the
  // grade_rule table's `band` criterion.
  firedCriteria.push({
    id: 'R-TWO-LEVEL-BAND-01',
    criterion: 'two-level-band',
    points: 0,
    category: 'risk-band',
    description:
      twoLevelBand === 'likely'
        ? 'Wells >= 2 — DVT likely; offer a proximal leg vein ultrasound'
        : 'Wells <= 1 — DVT unlikely; offer a D-dimer test'
  });
  firedCriteria.push({
    id: 'R-THREE-LEVEL-BAND-01',
    criterion: 'three-level-band',
    points: 0,
    category: 'risk-band',
    description:
      threeLevelBand === 'high'
        ? 'Wells >= 3 — high probability (original three-level rule)'
        : threeLevelBand === 'moderate'
          ? 'Wells 1-2 — moderate probability (original three-level rule)'
          : 'Wells <= 0 — low probability (original three-level rule)'
  });

  return {
    criterionPoints,
    wellsScore,
    twoLevelBand,
    threeLevelBand,
    recommendedInvestigation,
    firedCriteria
  };
}

export { evaluateCriteria, calculateWellsGrade };
