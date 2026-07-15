import { detectFlags } from './flags.js';
import { scoreCompleteness, scoreEligibility, scoreImpact, scorePriority } from './rules.js';

// Four-axis grader for the Neurodiversity Adjustment Request.
//
// Composes the rule sets in rules.js and the flags in flags.js into a single
// pure, deterministic grading result. The public entry point is
// `calculateGrade(data)`. The output shape and rule / flag IDs are identical
// across every front-end and the back-end.
//
// Wrapped in an IIFE; published via `window.NeurodiversityAdjustmentRequest`.

/**
 * Derive an overall handling recommendation from the four axes. An incomplete
 * request is sent back for more detail; a high wellbeing risk without
 * occupational-health input is escalated; an equipment request without Access
 * to Work involvement is signposted; otherwise the request progresses to an
 * adjustments meeting. First match wins.
 */
function deriveRecommendation(completenessPercent, impactBand, data) {
  if (completenessPercent < 50) return 'request-more-detail';
  if (impactBand === 'high-risk' && data.evidence.occupationalHealthInvolved === false) {
    return 'seek-occupational-health';
  }
  if (data.adjustments.adjustmentEquipmentTechnology === true && data.evidence.accessToWorkInvolved === false) {
    return 'signpost-access-to-work';
  }
  return 'progress-to-meeting';
}

const RECOMMENDATION_LABELS = {
  'progress-to-meeting': 'Progress to an adjustments meeting',
  'seek-occupational-health': 'Seek an occupational-health assessment',
  'request-more-detail': 'Request more detail from the worker',
  'signpost-access-to-work': 'Signpost the Access to Work scheme'
};

/**
 * Public entry point. Pure and deterministic.
 *
 * @param {object} data - the request data model from emptyRequest()
 * @returns {{
 *   eligibilityBand:string,
 *   impactBand:string,
 *   completenessPercent:number,
 *   priorityTier:string,
 *   targetTimeframe:string,
 *   recommendation:string,
 *   recommendationLabel:string,
 *   firedRules:object[],
 *   flags:object[]
 * }}
 */
function calculateGrade(data) {
  const firedRules = [];

  // Axis A — Equality Act 2010 eligibility.
  const eligibility = scoreEligibility(data);
  if (eligibility.firedRule) firedRules.push(eligibility.firedRule);

  // Axis B — impact / wellbeing.
  const impact = scoreImpact(data);
  for (const r of impact.firedRules) firedRules.push(r);

  // Axis C — completeness.
  const completeness = scoreCompleteness(data);
  for (const m of completeness.missing) firedRules.push(m);

  // Axis D — priority.
  const priority = scorePriority(data);
  for (const r of priority.firedRules) firedRules.push(r);

  const recommendation = deriveRecommendation(
    completeness.percent,
    impact.band,
    data
  );

  const flags = detectFlags(data, {
    eligibilityBand: eligibility.band,
    impactBand: impact.band
  });

  return {
    eligibilityBand: eligibility.band,
    impactBand: impact.band,
    completenessPercent: completeness.percent,
    priorityTier: priority.tier,
    targetTimeframe: priority.targetTimeframe,
    recommendation,
    recommendationLabel: RECOMMENDATION_LABELS[recommendation] || recommendation,
    firedRules,
    flags
  };
}

export { calculateGrade, deriveRecommendation, RECOMMENDATION_LABELS };
