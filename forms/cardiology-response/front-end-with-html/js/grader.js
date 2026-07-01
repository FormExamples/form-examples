// Four-axis grader for the Cardiology Response.
//
// Composes the rule sets in rules.js and the safety flags in flags.js into a
// single pure, deterministic interpretation grade. The public entry point is
// `calculateGrade(data)`, accepting either the grouped wizard state or the flat
// engine model (it flattens grouped input first). The output shape and rule /
// flag IDs are identical across every front-end and the back-end.
//
// Invariant: a critical result auto-escalates Axis D to critical-alert and
// raises the critical-finding flag, regardless of the other axes. The
// least-urgent band is only chosen when no rule fires.
//
// Wrapped in an IIFE; published via `window.CardiologyResponse`.

(function () {
'use strict';
window.CardiologyResponse =
  window.CardiologyResponse || {};
const NS = window.CardiologyResponse;
const {
  flatten,
  classifyResponse,
  gradeSeverity,
  gradeCompleteness,
  gradeFollowUp,
  detectFlags,
  recommendationLabel
} = NS;

/**
 * Derive the overall recommendation from the graded axes. A critical result
 * (critical-alert urgency) forces an urgent review; otherwise severity and
 * classification drive the recommendation.
 */
function deriveRecommendation(classification, severity, urgency) {
  if (urgency === 'critical-alert') return 'urgent-review';
  if (severity === 'major') return 'specialist-management';
  if (classification === 'inconclusive') return 'further-investigation';
  if (severity === 'moderate') return 'further-investigation';
  if (severity === 'minor') return 'routine-follow-up';
  if (classification === 'no-abnormality') return 'no-action';
  return 'routine-follow-up';
}

/**
 * Public entry point. Pure and deterministic.
 *
 * @param {object} data - grouped wizard state (with sections) or the flat model
 * @returns {{
 *   responseClassification:string,
 *   severity:string,
 *   severityCategory:string,
 *   completenessPercent:number,
 *   followUpUrgency:string,
 *   targetTimeframe:string,
 *   recommendedAction:string,
 *   recommendation:string,
 *   recommendationLabel:string,
 *   firedRules:object[],
 *   flags:object[]
 * }}
 */
function calculateGrade(data) {
  // Accept grouped wizard state or an already-flat engine model.
  const r = (data && data.identification) ? flatten(data) : data;

  const firedRules = [];

  // Axis A — response classification.
  const a = classifyResponse(r);
  for (const rule of a.firedRules) firedRules.push(rule);

  // Axis B — condition severity.
  const b = gradeSeverity(r, a.responseClassification);
  for (const rule of b.firedRules) firedRules.push(rule);

  // Axis C — completeness.
  const c = gradeCompleteness(r);
  for (const rule of c.firedRules) firedRules.push(rule);

  // Axis D — follow-up urgency.
  const d = gradeFollowUp(r, a.responseClassification, b.severity);
  for (const rule of d.firedRules) firedRules.push(rule);

  const recommendation = deriveRecommendation(
    a.responseClassification,
    b.severity,
    d.followUpUrgency
  );

  const flags = detectFlags(r);

  return {
    responseClassification: a.responseClassification,
    severity: b.severity,
    severityCategory: b.severityCategory,
    completenessPercent: c.completenessPercent,
    followUpUrgency: d.followUpUrgency,
    targetTimeframe: d.targetTimeframe,
    recommendedAction: d.recommendedAction,
    recommendation,
    recommendationLabel: recommendationLabel(recommendation),
    firedRules,
    flags
  };
}

Object.assign(NS, {
  calculateGrade,
  deriveRecommendation
});
})();
