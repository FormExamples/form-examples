import { detectFlags } from './flags.js';
import { classifyResult, gradeCompleteness, gradeFollowUp, gradeSeverity } from './rules.js';

// Pure four-axis interpretation engine for a blood cross-match test result.
//
// Faithful vanilla-JS port of the SvelteKit engine's
// `src/lib/engine/grader.ts`. Computes:
// - Axis A: result classification (normal / abnormal / critical / inconclusive).
// - Axis B: abnormality severity + structured reporting category.
// - Axis C: report completeness percent (0-100).
// - Axis D: follow-up urgency + target timeframe + recommended action.
//
// Plus an overall recommendation, the fired-rule audit trail, and safety flags.
//
// Invariant: a critical result (incompatible crossmatch, clinically-significant
// antibodies, an ABO discrepancy, or an unmet two-sample group-check rule)
// auto-escalates Axis D to critical-alert and raises the critical-result-alert
// plus discrepancy-with-request flags, regardless of the other axes. The
// least-urgent band is only chosen when no rule fires.
//
// No side effects, no network calls, no I/O.

/**
 * @typedef {import('./types.js').BloodCrossMatchResult} BloodCrossMatchResult
 * @typedef {import('./types.js').GradingResult} GradingResult
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

/**
 * Derives the overall recommendation from the graded axes.
 *
 * @param {string} classification
 * @param {string} severity
 * @param {string} urgency
 * @returns {import('./types.js').Recommendation}
 */
function deriveRecommendation(classification, severity, urgency) {
  if (urgency === 'critical-alert') return 'urgent-review';
  if (severity === 'major') return 'specialist-referral';
  if (classification === 'inconclusive') return 'further-testing';
  if (severity === 'moderate') return 'further-testing';
  if (severity === 'minor') return 'routine-follow-up';
  if (classification === 'normal') return 'no-action';
  return 'routine-follow-up';
}

/**
 * Grade a blood cross-match test result on all four axes.
 *
 * @param {BloodCrossMatchResult} result
 * @returns {GradingResult}
 */
function calculateGrade(result) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  // Axis A
  const a = classifyResult(result);
  firedRules.push(...a.firedRules);

  // Axis B
  const b = gradeSeverity(result, a.resultClassification);
  firedRules.push(...b.firedRules);

  // Axis C
  const c = gradeCompleteness(result);
  firedRules.push(...c.firedRules);

  // Axis D
  const d = gradeFollowUp(result, a.resultClassification, b.abnormalitySeverity);
  firedRules.push(...d.firedRules);

  const recommendation = deriveRecommendation(
    a.resultClassification,
    b.abnormalitySeverity,
    d.followUpUrgency
  );

  // detectFlags lives in flags.js; it is resolved at call time so the
  // canonical types → rules → grader → flags load order still works.
  const flags = detectFlags(result);

  return {
    resultClassification: a.resultClassification,
    abnormalitySeverity: b.abnormalitySeverity,
    reportingCategory: b.reportingCategory,
    reportCompletenessPercent: c.reportCompletenessPercent,
    followUpUrgency: d.followUpUrgency,
    targetTimeframe: d.targetTimeframe,
    recommendedAction: d.recommendedAction,
    recommendation,
    firedRules,
    flags,
    gradedAt: new Date().toISOString()
  };
}

export { calculateGrade, deriveRecommendation };
