import { detectFlags } from './flags.js';
import { classifyResult, gradeCompleteness, gradeFollowUp, gradeSeverity } from './rules.js';

// Colonoscopy Test Result grader. Faithful vanilla-JavaScript port of the
// SvelteKit engine module `src/lib/engine/grader.ts`.
//
// Pure four-axis interpretation engine for a colonoscopy result:
// - Axis A: result classification (normal / abnormal / critical / inconclusive).
// - Axis B: abnormality severity + structured reporting category.
// - Axis C: report completeness percent (0-100).
// - Axis D: follow-up urgency + target timeframe + recommended action.
//
// Plus an overall recommendation, the fired-rule audit trail, and safety flags.
//
// Invariant: a critical finding (mass lesion or perforation) auto-escalates Axis
// D to critical-alert and raises the critical-result-alert flag, regardless of
// the other axes. The least-urgent band is only chosen when no rule fires.
//
// No side effects, no network calls, no I/O.

/**
 * @typedef {import('./types.js').ColonoscopyResult} ColonoscopyResult
 * @typedef {import('./types.js').GradingResult} GradingResult
 * @typedef {import('./types.js').Recommendation} Recommendation
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.ColonoscopyTestResult.
// Depends on rules.js (the four axis functions) and flags.js (detectFlags),
// so it must load after both.

/**
 * Compute the full four-axis interpretation grade for a report.
 * @param {ColonoscopyResult} result
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

/**
 * Derive the overall recommendation from the graded axes.
 * @param {string} classification
 * @param {string} severity
 * @param {string} urgency
 * @returns {Recommendation}
 */
function deriveRecommendation(classification, severity, urgency) {
  if (urgency === 'critical-alert') return 'urgent-review';
  if (severity === 'major') return 'specialist-referral';
  if (classification === 'inconclusive') return 'further-imaging';
  if (severity === 'moderate') return 'further-imaging';
  if (severity === 'minor') return 'routine-follow-up';
  if (classification === 'normal') return 'no-action';
  return 'routine-follow-up';
}

export { calculateGrade, deriveRecommendation };
