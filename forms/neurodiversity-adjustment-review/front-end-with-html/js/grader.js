import { detectFlags } from './flags.js';
import { classifyEffectiveness, gradeCompleteness, gradeNextStep, gradeWellbeingRisk } from './rules.js';
import { anyNotWorking, flatten, recommendationLabel } from './types.js';

// Four-axis grader for the Neurodiversity Adjustment Review.
//
// Composes the rule sets in rules.js and the review flags in flags.js into a
// single pure, deterministic grade. The public entry point is
// `calculateGrade(data)`, accepting either the grouped wizard state or the flat
// engine model (it flattens grouped input first). The output shape and rule /
// flag IDs are identical across every front-end and the back-end.
//
// Invariant: any adjustment reported not-working, a dissatisfied worker,
// declining wellbeing, or an escalation drives the wellbeing-risk axis and the
// next-step urgency and raises the corresponding flag, regardless of the other
// axes. The least-alarming band is chosen only when no rule fires.

/**
 * Derive the overall recommendation from the review and graded axes.
 * First match wins.
 */
function deriveRecommendation(r, effectivenessBand, wellbeingRiskBand) {
  if (r.escalated === true) return 'escalate-to-hr';
  if (effectivenessBand === 'ineffective' && r.occupationalHealthRereferral === false) {
    return 'seek-occupational-health';
  }
  if (wellbeingRiskBand === 'high-risk' || anyNotWorking(r) || r.changesNeeded === true) {
    return 'adjust-adjustments';
  }
  if (String(r.nextReviewDate || '').trim() === '') return 'schedule-next-review';
  return 'maintain';
}

/**
 * Public entry point. Pure and deterministic.
 *
 * @param {object} data - grouped wizard state (with sections) or the flat model
 * @returns {{
 *   effectivenessBand:string,
 *   wellbeingRiskBand:string,
 *   completenessPercent:number,
 *   nextStepUrgency:string,
 *   targetTimeframe:string,
 *   recommendation:string,
 *   recommendationLabel:string,
 *   firedRules:object[],
 *   flags:object[]
 * }}
 */
function calculateGrade(data) {
  // Accept grouped wizard state (has `effectiveness` section) or a flat model.
  const r = (data && data.effectiveness && data.experience) ? flatten(data) : data;

  const firedRules = [];

  // Axis A — effectiveness.
  const a = classifyEffectiveness(r);
  for (const rule of a.firedRules) firedRules.push(rule);

  // Axis B — wellbeing risk.
  const b = gradeWellbeingRisk(r);
  for (const rule of b.firedRules) firedRules.push(rule);

  // Axis C — completeness.
  const c = gradeCompleteness(r);
  for (const rule of c.firedRules) firedRules.push(rule);

  // Axis D — next-step urgency (depends on Axis B).
  const d = gradeNextStep(r, b.wellbeingRiskBand);
  for (const rule of d.firedRules) firedRules.push(rule);

  const recommendation = deriveRecommendation(
    r,
    a.effectivenessBand,
    b.wellbeingRiskBand
  );

  const flags = detectFlags(r, {
    completenessPercent: c.completenessPercent
  });

  return {
    effectivenessBand: a.effectivenessBand,
    wellbeingRiskBand: b.wellbeingRiskBand,
    completenessPercent: c.completenessPercent,
    nextStepUrgency: d.nextStepUrgency,
    targetTimeframe: d.targetTimeframe,
    recommendation,
    recommendationLabel: recommendationLabel(recommendation),
    firedRules,
    flags
  };
}

export { calculateGrade, deriveRecommendation };
