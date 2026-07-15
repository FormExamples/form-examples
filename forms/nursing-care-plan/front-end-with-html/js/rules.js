// Completeness rules for the Nursing Care Plan.
//
// Unlike a scored instrument, this form GRADES COMPLETENESS: every problem is
// worked through the nursing process (ADPIE) and should carry at least one
// goal, at least one intervention, and an evaluation. This module holds the
// pure per-problem predicates (`hasGoal`, `hasIntervention`, `hasEvaluation`),
// the per-problem classifier (`classifyProblem`), and the audit-trail builder
// (`problemFiredRules`) that records which of the three required elements are
// present or missing for each problem. The plan-level roll-up lives in
// `grader.js`; the flagged issues live in `flags.js`.
//
// See spec §4 (`../spec/index.md`).

/**
 * @typedef {import('./types.js').CarePlan} CarePlan
 * @typedef {import('./types.js').Problem} Problem
 * @typedef {import('./types.js').CompletenessClass} CompletenessClass
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

/**
 * True when the problem carries at least one goal.
 * @param {Problem} p
 * @returns {boolean}
 */
function hasGoal(p) {
  return Array.isArray(p.goals) && p.goals.length > 0;
}

/**
 * True when the problem carries at least one intervention.
 * @param {Problem} p
 * @returns {boolean}
 */
function hasIntervention(p) {
  return Array.isArray(p.interventions) && p.interventions.length > 0;
}

/**
 * True when the problem carries an evaluation: either a free-text evaluation
 * note, or an explicit goal-met status other than "not-evaluated". An empty
 * `goalMet` ('') counts as not evaluated.
 * @param {Problem} p
 * @returns {boolean}
 */
function hasEvaluation(p) {
  const note = (p.evaluationNote || '').trim();
  const met = p.goalMet || '';
  return note !== '' || (met !== '' && met !== 'not-evaluated');
}

/**
 * Grade a single problem's completeness.
 *   Complete   — goal AND intervention AND evaluation
 *   Partial    — some but not all of the three
 *   Incomplete — none of the three (a problem statement only)
 * @param {Problem} p
 * @returns {CompletenessClass}
 */
function classifyProblem(p) {
  const g = hasGoal(p);
  const i = hasIntervention(p);
  const e = hasEvaluation(p);
  if (g && i && e) return 'complete';
  if (g || i || e) return 'partial';
  return 'incomplete';
}

/**
 * Build the completeness audit trail for one problem: one FiredRule per
 * required ADPIE element (goal / intervention / evaluation), recording whether
 * it is present.
 * @param {Problem} p
 * @param {number} index  zero-based index of the problem within the plan
 * @returns {FiredRule[]}
 */
function problemFiredRules(p, index) {
  const label = `Problem ${index + 1}`;
  const g = hasGoal(p);
  const i = hasIntervention(p);
  const e = hasEvaluation(p);
  return [
    {
      id: `${p.id}-goal`,
      problemId: p.id,
      problemLabel: label,
      element: 'goal',
      present: g,
      description: g
        ? `${label}: goal recorded (${p.goals.length})`
        : `${label}: no goal recorded`
    },
    {
      id: `${p.id}-intervention`,
      problemId: p.id,
      problemLabel: label,
      element: 'intervention',
      present: i,
      description: i
        ? `${label}: intervention recorded (${p.interventions.length})`
        : `${label}: no intervention recorded`
    },
    {
      id: `${p.id}-evaluation`,
      problemId: p.id,
      problemLabel: label,
      element: 'evaluation',
      present: e,
      description: e
        ? `${label}: evaluation recorded`
        : `${label}: no evaluation recorded`
    }
  ];
}

export { hasGoal, hasIntervention, hasEvaluation, classifyProblem, problemFiredRules };
