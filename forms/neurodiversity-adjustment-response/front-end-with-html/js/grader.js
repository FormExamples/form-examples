import { detectFlags } from './flags.js';
import { classifyOutcome, gradeCompleteness, gradeFollowUp, gradeLegalRisk } from './rules.js';
import { anyAgreed, flatten, recommendationLabel } from './types.js';

// Four-axis grader for the Neurodiversity Adjustment Response.
//
// Composes the rule sets in rules.js and the compliance-and-risk flags in
// flags.js into a single pure, deterministic grade. The public entry point is
// `calculateGrade(data)`, accepting either the grouped wizard state or the flat
// engine model (it flattens grouped input first). The output shape and rule /
// flag IDs are identical across every front-end and the back-end.
//
// Invariant: declining adjustments for a worker likely covered by the Equality
// Act 2010 without an adequate reasonableness justification or alternatives
// drives the legal-risk axis to high-risk, raises the discrimination-risk flag,
// and auto-escalates the follow-up urgency. The least-alarming band is chosen
// only when no rule fires.

/**
 * Derive the overall recommendation from the response and graded axes.
 * First match wins.
 */
function deriveRecommendation(r, legalRiskBand) {
  if (r.escalated === true) return 'escalate-to-hr';
  if (legalRiskBand === 'high-risk') return 'reconsider-decision';
  if (anyAgreed(r) && r.reviewScheduled === false) return 'schedule-review';
  if (r.overallDecision === 'deferred' && r.occupationalHealthReferred === false) {
    return 'seek-occupational-health';
  }
  // A decline with nothing agreed, not escalated, and not high-risk (i.e. a
  // justified decline, or an unjustified one that hasn't yet been escalated)
  // has nothing to "implement" — record the decline rather than falling
  // through to that misleading default.
  if (r.overallDecision === 'declined') {
    return 'record-decline';
  }
  return 'implement';
}

/**
 * Public entry point. Pure and deterministic.
 *
 * @param {object} data - grouped wizard state (with sections) or the flat model
 * @returns {{
 *   outcomeClassification:string,
 *   legalRiskBand:string,
 *   completenessPercent:number,
 *   followUpUrgency:string,
 *   targetTimeframe:string,
 *   recommendation:string,
 *   recommendationLabel:string,
 *   firedRules:object[],
 *   flags:object[]
 * }}
 */
function calculateGrade(data) {
  // Accept grouped wizard state (has `decision` section) or a flat engine model.
  const r = (data && data.decision && data.adjustments) ? flatten(data) : data;

  const firedRules = [];

  // Axis A — outcome classification.
  const a = classifyOutcome(r);
  for (const rule of a.firedRules) firedRules.push(rule);

  // Axis B — legal / discrimination risk.
  const b = gradeLegalRisk(r);
  for (const rule of b.firedRules) firedRules.push(rule);

  // Axis C — completeness.
  const c = gradeCompleteness(r);
  for (const rule of c.firedRules) firedRules.push(rule);

  // Axis D — follow-up / review urgency (depends on Axis B).
  const d = gradeFollowUp(r, b.legalRiskBand);
  for (const rule of d.firedRules) firedRules.push(rule);

  const recommendation = deriveRecommendation(r, b.legalRiskBand);

  const flags = detectFlags(r, {
    legalRiskBand: b.legalRiskBand,
    completenessPercent: c.completenessPercent
  });

  return {
    outcomeClassification: a.outcomeClassification,
    legalRiskBand: b.legalRiskBand,
    completenessPercent: c.completenessPercent,
    followUpUrgency: d.followUpUrgency,
    targetTimeframe: d.targetTimeframe,
    recommendation,
    recommendationLabel: recommendationLabel(recommendation),
    firedRules,
    flags
  };
}

export { calculateGrade, deriveRecommendation };
