import { detectFlags } from './flags.js';
import { classifyProblem, hasEvaluation, hasGoal, hasIntervention, problemFiredRules } from './rules.js';

// Nursing Care Plan completeness grader. Pure functions: take a `CarePlan`
// object, grade each problem, roll the problem classes up to a plan status,
// compute the completeness percent, and attach the fired-rule audit trail and
// flagged issues. No side effects, no I/O.
//
// Plan status (spec §4):
//   no problems                                    -> 'incomplete'
//   every problem 'complete' AND no high-priority flag -> 'complete'
//   every problem 'incomplete'                      -> 'incomplete'
//   otherwise                                       -> 'partial'
//
// Completeness percent = present required elements / (problems * 3), rounded.

/**
 * @typedef {import('./types.js').CarePlan} CarePlan
 * @typedef {import('./types.js').GradingResult} GradingResult
 * @typedef {import('./types.js').PlanStatus} PlanStatus
 */

// Wrapped in an IIFE; published via window.NursingCarePlan.

/**
 * Completeness percent: the proportion of the three required elements (goal,
 * intervention, evaluation) present across all problems, 0–100, rounded.
 * Returns 0 for an empty plan.
 * @param {CarePlan} plan
 * @returns {number}
 */
function completenessPercent(plan) {
  const problems = Array.isArray(plan.problems) ? plan.problems : [];
  const required = problems.length * 3;
  if (required === 0) return 0;
  let present = 0;
  for (const p of problems) {
    if (hasGoal(p)) present += 1;
    if (hasIntervention(p)) present += 1;
    if (hasEvaluation(p)) present += 1;
  }
  return Math.round((100 * present) / required);
}

/**
 * Roll the per-problem classes up to a plan status.
 * @param {import('./types.js').CompletenessClass[]} classes
 * @param {boolean} hasHighFlag
 * @returns {PlanStatus}
 */
function planStatus(classes, hasHighFlag) {
  if (classes.length === 0) return 'incomplete';
  const everyComplete = classes.every((c) => c === 'complete');
  if (everyComplete && !hasHighFlag) return 'complete';
  const everyIncomplete = classes.every((c) => c === 'incomplete');
  if (everyIncomplete) return 'incomplete';
  return 'partial';
}

/**
 * Grade a whole care plan.
 * @param {CarePlan} plan
 * @returns {GradingResult}
 */
function validate(plan) {
  const problems = Array.isArray(plan.problems) ? plan.problems : [];

  const problemClasses = problems.map((p) => ({
    problemId: p.id,
    completenessClass: classifyProblem(p)
  }));

  /** @type {import('./types.js').FiredRule[]} */
  let firedRules = [];
  problems.forEach((p, idx) => {
    firedRules = firedRules.concat(problemFiredRules(p, idx));
  });

  const flags = detectFlags(plan);
  const hasHighFlag = flags.some((f) => f.priority === 'high');

  const status = planStatus(
    problemClasses.map((pc) => pc.completenessClass),
    hasHighFlag
  );

  return {
    status,
    completenessPercent: completenessPercent(plan),
    problemClasses,
    firedRules,
    flags,
    timestamp: new Date().toISOString()
  };
}

export { completenessPercent, planStatus, validate };
