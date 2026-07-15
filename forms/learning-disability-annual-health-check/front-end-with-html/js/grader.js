import { detectFlaggedIssues } from './flags.js';
import { componentRules } from './rules.js';

// Learning Disability Annual Health Check completeness grader. Pure functions:
// take an `AssessmentData` object and derive the documentation outputs (spec §4).
// This is NOT a numeric severity score. It emits:
//
//   status                   = complete | incomplete
//   completenessPercent      = round(100 * completedCount / requiredCount)  (0..100)
//   healthActionPlanComplete = healthActionPlanProduced == 'yes'
//                              && healthActionPlanShared  == 'yes'
//   componentStatuses[]      = per-component completed flag (the required components)
//   firedRules[]             = audit trail: each completed component, plus a
//                              completeness row and a Health-Action-Plan row
//   flags[]                  = the clinical flags (from flags.js)
//
// Classification (spec §4):
//   status = 'complete' only when EVERY required component is completed AND the
//            Health Action Plan was produced and shared; otherwise 'incomplete'.
//   The Health Action Plan is a required output — without it the status is always
//   'incomplete' even if every component was completed.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').ComponentStatus} ComponentStatus
 * @typedef {import('./types.js').FiredRule} FiredRule
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 * @typedef {import('./types.js').CompletenessStatus} CompletenessStatus
 * @typedef {import('./types.js').GradingResult} GradingResult
 */

// Wrapped in an IIFE; published via window.LearningDisabilityAnnualHealthCheck.

/**
 * Evaluate each required-component rule against the record.
 * @param {AssessmentData} data
 * @returns {ComponentStatus[]}
 */
function computeComponentStatuses(data) {
  return componentRules.map((rule) => ({
    id: rule.component,
    group: rule.group,
    label: rule.label,
    completed: !!rule.completed(data)
  }));
}

/**
 * Is the Health Action Plan complete — produced AND shared (spec §4)?
 * @param {AssessmentData} data
 * @returns {boolean}
 */
function isHealthActionPlanComplete(data) {
  return (
    data.plan.healthActionPlanProduced === 'yes' &&
    data.plan.healthActionPlanShared === 'yes'
  );
}

/**
 * Compute the completeness grade (no flags yet — the incomplete flag needs the
 * status).
 *
 * @param {AssessmentData} data
 * @returns {{ status: CompletenessStatus, completenessPercent: number,
 *             healthActionPlanComplete: boolean,
 *             componentStatuses: ComponentStatus[], completedCount: number,
 *             firedRules: FiredRule[] }}
 */
function calculateGrade(data) {
  const componentStatuses = computeComponentStatuses(data);
  const total = componentStatuses.length; // 18
  const completedCount = componentStatuses.filter((c) => c.completed).length;
  const completenessPercent =
    total > 0 ? Math.round((100 * completedCount) / total) : 0;

  const healthActionPlanComplete = isHealthActionPlanComplete(data);

  /** @type {CompletenessStatus} */
  const status =
    completedCount === total && healthActionPlanComplete
      ? 'complete'
      : 'incomplete';

  // Audit trail: one row per completed component, mirroring grade_rule.
  /** @type {FiredRule[]} */
  const firedRules = [];
  for (let i = 0; i < componentRules.length; i++) {
    const rule = componentRules[i];
    if (componentStatuses[i].completed) {
      firedRules.push({
        id: rule.id,
        component: rule.component,
        category: rule.category,
        description: rule.description
      });
    }
  }
  firedRules.push({
    id: 'R-COMPLETENESS-01',
    component: 'completeness',
    category: 'completeness',
    description:
      completedCount === total
        ? `All ${total} required components completed (${completenessPercent}%)`
        : `${completedCount} of ${total} required components completed (${completenessPercent}%)`
  });
  firedRules.push({
    id: 'R-HEALTH-ACTION-PLAN-01',
    component: 'health-action-plan',
    category: 'health-action-plan',
    description: healthActionPlanComplete
      ? 'Health Action Plan produced and shared with the person'
      : 'Health Action Plan not produced and shared — required for a complete check'
  });

  return {
    status,
    completenessPercent,
    healthActionPlanComplete,
    componentStatuses,
    completedCount,
    firedRules
  };
}

/**
 * Full assessment: completeness grade + clinical flags. Pure; no I/O. This is
 * the canonical engine entry point (spec §6).
 *
 * @param {AssessmentData} data
 * @returns {GradingResult}
 */
function assess(data) {
  const grade = calculateGrade(data);
  
  const flags = detectFlaggedIssues(data, { status: grade.status });

  return {
    status: grade.status,
    completenessPercent: grade.completenessPercent,
    healthActionPlanComplete: grade.healthActionPlanComplete,
    componentStatuses: grade.componentStatuses,
    firedRules: grade.firedRules,
    flags,
    timestamp: new Date().toISOString()
  };
}

export { computeComponentStatuses, isHealthActionPlanComplete, calculateGrade, assess };
