import { ottawaRules } from './rules.js';

// Ottawa Knee Rule grader. Pure functions: take an `AssessmentData` object,
// evaluate the five decision rules in `ottawaRules`, and apply ANY-of (logical
// OR) logic to decide whether a knee radiograph is indicated.
//
// This is a DECISION RULE, not a score (spec §4):
//   ageCriterion              = ageYears != null && ageYears >= 55
//   isolatedPatellarCriterion = patellarTenderness == 'yes' && otherBonyTenderness == 'no'
//   fibularHeadCriterion      = fibularHeadTenderness == 'yes'
//   flexionCriterion          = unableToFlex90 == 'yes'
//   weightBearingCriterion    = unableToBearWeight == 'yes'
//
//   xrayIndicated = ageCriterion || isolatedPatellarCriterion
//                || fibularHeadCriterion || flexionCriterion || weightBearingCriterion
//   decision      = xrayIndicated ? 'xray-indicated' : 'xray-not-indicated'
//
// ANY-of, not additive: exactly one positive criterion produces the same
// "X-ray indicated" decision as five. A missing input does not fire its
// criterion (`flags.js` raises a data-completeness flag separately).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').Decision} Decision
 * @typedef {import('./types.js').FiredCriterion} FiredCriterion
 */

// Wrapped in an IIFE; published via window.OttawaKneeRule.

/**
 * Evaluate the five Ottawa criteria and record each as an audit row (fired
 * true/false), mirroring the `ottawa_knee_rule_grade_rule` table.
 * @param {AssessmentData} data
 * @returns {FiredCriterion[]}
 */
function evaluateCriteria(data) {
  /** @type {FiredCriterion[]} */
  const rows = [];
  for (const rule of ottawaRules) {
    let fired = false;
    try {
      fired = Boolean(rule.evaluate(data));
    } catch (e) {
      console.warn(`Ottawa Knee rule ${rule.id} evaluation failed:`, e);
    }
    rows.push({
      id: rule.id,
      criterion: rule.criterion,
      fired,
      category: rule.category,
      description: rule.description
    });
  }
  return rows;
}

/**
 * Compute the full Ottawa Knee Rule grade for the supplied assessment data.
 * @param {AssessmentData} data
 * @returns {{ ageCriterion: boolean, isolatedPatellarCriterion: boolean,
 *             fibularHeadCriterion: boolean, flexionCriterion: boolean,
 *             weightBearingCriterion: boolean, xrayIndicated: boolean,
 *             decision: Decision, firedCriteria: FiredCriterion[] }}
 */
function gradeOttawaKnee(data) {
  const auditRows = evaluateCriteria(data);
  const firedOf = (criterion) =>
    auditRows.some((r) => r.criterion === criterion && r.fired);

  const ageCriterion = firedOf('age');
  const isolatedPatellarCriterion = firedOf('isolated-patellar-tenderness');
  const fibularHeadCriterion = firedOf('fibular-head-tenderness');
  const flexionCriterion = firedOf('flexion');
  const weightBearingCriterion = firedOf('weight-bearing');

  const xrayIndicated =
    ageCriterion ||
    isolatedPatellarCriterion ||
    fibularHeadCriterion ||
    flexionCriterion ||
    weightBearingCriterion;

  /** @type {Decision} */
  const decision = xrayIndicated ? 'xray-indicated' : 'xray-not-indicated';

  // Keep only the criteria that actually fired for the firedCriteria list, then
  // append the composite decision as an audit row (mirrors the grade_rule
  // table's `decision` criterion / `composite` instrument).
  const firedCriteria = auditRows.filter((r) => r.fired);
  firedCriteria.push({
    id: 'R-DECISION-01',
    criterion: 'decision',
    fired: xrayIndicated,
    category: 'decision',
    description: xrayIndicated
      ? 'One or more criteria present — a knee radiograph is indicated (ANY-of)'
      : 'All five criteria absent — a knee radiograph is not indicated by the rule'
  });

  return {
    ageCriterion,
    isolatedPatellarCriterion,
    fibularHeadCriterion,
    flexionCriterion,
    weightBearingCriterion,
    xrayIndicated,
    decision,
    firedCriteria
  };
}

export { evaluateCriteria, gradeOttawaKnee };
