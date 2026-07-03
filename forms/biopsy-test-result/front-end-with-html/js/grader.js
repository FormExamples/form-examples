// Biopsy four-axis grader. Faithful vanilla-JS port of the tested SvelteKit
// engine module `grader.ts`.
//
// Pure four-axis interpretation engine for a biopsy histopathology result.
//
// Computes:
// - Axis A: result classification (normal / abnormal / critical / inconclusive).
// - Axis B: abnormality severity + structured reporting category.
// - Axis C: report completeness percent (0-100).
// - Axis D: follow-up urgency + target timeframe + recommended action.
//
// Plus an overall recommendation, the fired-rule audit trail, and safety flags.
//
// Invariant: a critical finding (an unexpected malignancy or an involved
// resection margin) auto-escalates Axis D to critical-alert and raises the
// critical-result-alert flag, regardless of the other axes. The least-urgent
// band is only chosen when no rule fires.
//
// No side effects, no network calls, no I/O.

/**
 * @typedef {import('./types.js').BiopsyResult} BiopsyResult
 * @typedef {import('./types.js').GradingResult} GradingResult
 * @typedef {import('./types.js').Recommendation} Recommendation
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.BiopsyTestResult.
(function () {
'use strict';
window.BiopsyTestResult = window.BiopsyTestResult || {};
const NS = window.BiopsyTestResult;
const {
  classifyResult,
  gradeSeverity,
  gradeCompleteness,
  gradeFollowUp
} = NS;

/**
 * Derives the overall recommendation from the graded axes.
 * @param {string} classification
 * @param {string} severity
 * @param {string} urgency
 * @returns {Recommendation}
 */
function deriveRecommendation(classification, severity, urgency) {
  if (urgency === 'critical-alert') return 'urgent-mdt';
  if (severity === 'major') return 'specialist-referral';
  if (classification === 'inconclusive') return 'further-testing';
  if (severity === 'moderate') return 'further-testing';
  if (severity === 'minor') return 'routine-follow-up';
  if (classification === 'normal') return 'no-action';
  return 'routine-follow-up';
}

/**
 * Compute the full four-axis interpretation grade for the supplied result.
 * @param {BiopsyResult} result
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

  // `flags.js` loads after this file (types → rules → grader → flags), so
  // resolve detectFlags at call time rather than at script-load time.
  const flags = NS.detectFlags(result);

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

Object.assign(window.BiopsyTestResult, {
  deriveRecommendation,
  calculateGrade
});
})();
