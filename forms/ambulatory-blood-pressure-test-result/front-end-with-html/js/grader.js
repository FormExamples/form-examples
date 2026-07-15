import { detectFlags } from './flags.js';
import { classifyResult, gradeCompleteness, gradeFollowUp, gradeSeverity } from './rules.js';

// ABPM four-axis interpretation grader. Faithful vanilla-JavaScript port of
// the SvelteKit engine `src/lib/engine/grader.ts`.
//
// Pure function: takes an `AmbulatoryBloodPressureResult` object and computes:
// - Axis A: result classification (normal / abnormal / critical / inconclusive).
// - Axis B: abnormality severity + structured-reporting category (hypertension stage).
// - Axis C: report completeness percent (0-100).
// - Axis D: follow-up urgency + target timeframe + recommended action.
//
// Plus an overall recommendation, the fired-rule audit trail, and safety flags.
//
// Invariant: a severe-hypertension result (ABPM average >= 150/95, equivalent
// to clinic >= 180/120) auto-escalates Axis D to critical-alert and raises the
// critical-result-alert flag, regardless of the other axes. The least-urgent
// band is only chosen when no rule fires.
//
// No side effects, no network calls, no I/O.

/**
 * @typedef {import('./types.js').AmbulatoryBloodPressureResult} AmbulatoryBloodPressureResult
 * @typedef {import('./types.js').GradingResult} GradingResult
 * @typedef {import('./types.js').Recommendation} Recommendation
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

/**
 * Derives the overall recommendation from the graded axes.
 *
 * @param {string} classification
 * @param {string} severity
 * @param {string} urgency
 * @returns {Recommendation}
 */
function deriveRecommendation(classification, severity, urgency) {
  if (urgency === 'critical-alert') return 'urgent-review';
  if (severity === 'major') return 'specialist-referral';
  if (classification === 'inconclusive') return 'further-imaging';
  if (severity === 'moderate') return 'specialist-referral';
  if (severity === 'minor') return 'routine-follow-up';
  if (classification === 'normal') return 'no-action';
  return 'routine-follow-up';
}

/**
 * Compute the full four-axis interpretation grade for the supplied result.
 *
 * @param {AmbulatoryBloodPressureResult} result
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

  // Resolved at call time: flags.js loads after grader.js in the page's
  // classic-script order (types -> rules -> grader -> flags -> form-app).
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
