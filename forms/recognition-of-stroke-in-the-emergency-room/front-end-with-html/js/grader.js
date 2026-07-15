import { rosierRules } from './rules.js';

// ROSIER grader. Pure functions: take an `AssessmentData` object, evaluate the
// seven signed criterion rules in `rosierRules`, award -1 (mimic) or +1 (sign)
// each, sum the signed total (-2..+5), and derive the band with the strict > 0
// stroke-likely threshold.
//
// Grading algorithm (spec §4):
//   lossOfConsciousnessPoint = lossOfConsciousness == 'yes' ? -1 : 0
//   seizureActivityPoint     = seizureActivity     == 'yes' ? -1 : 0
//   facialWeaknessPoint      = facialWeakness       == 'yes' ?  1 : 0
//   armWeaknessPoint         = armWeakness          == 'yes' ?  1 : 0
//   legWeaknessPoint         = legWeakness          == 'yes' ?  1 : 0
//   speechDisturbancePoint   = speechDisturbance    == 'yes' ?  1 : 0
//   visualFieldDefectPoint   = visualFieldDefect    == 'yes' ?  1 : 0
//   rosierScore = sum (-2..+5)
//   band        = rosierScore > 0 ? 'stroke-likely' : 'stroke-unlikely'
//
// The `> 0` threshold is strict: a total of exactly 0 is `stroke-unlikely`. An
// unanswered criterion contributes 0 points for that criterion (absent, not
// positive); `flags.js` raises a data-completeness flag separately. The score
// is only clinically valid once hypoglycaemia has been excluded / corrected —
// a low `bloodGlucose` raises a flag regardless of the total.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').Band} Band
 * @typedef {import('./types.js').FiredCriterion} FiredCriterion
 */

// Wrapped in an IIFE; published via window.RecognitionOfStrokeInTheEmergencyRoom.

/**
 * Evaluate the seven ROSIER criterion rules and collect the ones that fired.
 * @param {AssessmentData} data
 * @returns {FiredCriterion[]}
 */
function evaluateCriteria(data) {
  /** @type {FiredCriterion[]} */
  const fired = [];
  for (const rule of rosierRules) {
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
      console.warn(`ROSIER rule ${rule.id} evaluation failed:`, e);
    }
  }
  return fired;
}

/**
 * Compute the full ROSIER grade for the supplied assessment data.
 * @param {AssessmentData} data
 * @returns {{ lossOfConsciousnessPoint: 0|-1, seizureActivityPoint: 0|-1,
 *             facialWeaknessPoint: 0|1, armWeaknessPoint: 0|1,
 *             legWeaknessPoint: 0|1, speechDisturbancePoint: 0|1,
 *             visualFieldDefectPoint: 0|1, rosierScore: number,
 *             band: Band, firedCriteria: FiredCriterion[] }}
 */
function calculateRosierGrade(data) {
  const firedCriteria = evaluateCriteria(data);
  const pointFor = (criterion) => {
    const hit = firedCriteria.find((f) => f.criterion === criterion);
    return hit ? hit.points : 0;
  };

  const lossOfConsciousnessPoint = pointFor('loss-of-consciousness');
  const seizureActivityPoint = pointFor('seizure-activity');
  const facialWeaknessPoint = pointFor('facial-weakness');
  const armWeaknessPoint = pointFor('arm-weakness');
  const legWeaknessPoint = pointFor('leg-weakness');
  const speechDisturbancePoint = pointFor('speech-disturbance');
  const visualFieldDefectPoint = pointFor('visual-field-defect');

  const rosierScore =
    lossOfConsciousnessPoint + seizureActivityPoint +
    facialWeaknessPoint + armWeaknessPoint + legWeaknessPoint +
    speechDisturbancePoint + visualFieldDefectPoint;

  /** @type {Band} */
  const band = rosierScore > 0 ? 'stroke-likely' : 'stroke-unlikely';

  // Record the derived band decision as a `band` audit row, mirroring the
  // grade_rule table's `band` criterion.
  firedCriteria.push({
    id: 'R-BAND-01',
    criterion: 'band',
    points: 0,
    category: 'band',
    description:
      rosierScore > 0
        ? 'ROSIER > 0 — positive screen; stroke likely, activate the acute stroke pathway'
        : 'ROSIER <= 0 — stroke unlikely but not excluded'
  });

  return {
    lossOfConsciousnessPoint,
    seizureActivityPoint,
    facialWeaknessPoint,
    armWeaknessPoint,
    legWeaknessPoint,
    speechDisturbancePoint,
    visualFieldDefectPoint,
    rosierScore,
    band,
    firedCriteria
  };
}

export { evaluateCriteria, calculateRosierGrade };
