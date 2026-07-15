import { detectFlags } from './flags.js';
import { scoreAppropriateness, scoreCompleteness, scoreSafety, scoreTriage } from './rules.js';

// Four-axis grader for the Cardiology Request.
//
// Composes the rule sets in rules.js and the safety flags in flags.js into a
// single pure, deterministic grading result. The public entry point is
// `calculateGrade(data)`. The output shape and rule / flag IDs are identical
// across every front-end and the back-end.

/**
 * Derive an overall recommendation for the cardiology vetting desk from the
 * four axes. A red flag escalates to emergency triage but still warrants
 * accepting the patient onto an urgent pathway; an inappropriate or incomplete
 * referral is queried or redirected. Least-alarming wins only when nothing
 * escalates.
 */
function deriveRecommendation(appropriatenessBand, safetyBand, completenessPercent) {
  if (safetyBand === 'red-flag') return 'accept';
  if (appropriatenessBand === 'usually-not-appropriate') return 'redirect';
  if (completenessPercent < 50) return 'query-referrer';
  if (appropriatenessBand === 'may-be-appropriate') return 'query-referrer';
  return 'accept';
}

const RECOMMENDATION_LABELS = {
  'accept': 'Accept and book',
  'query-referrer': 'Query the referrer',
  'redirect': 'Redirect to a more suitable service',
  'reject': 'Reject'
};

/**
 * Public entry point. Pure and deterministic.
 *
 * @param {object} data - the request data model from emptyRequest()
 * @returns {{
 *   appropriatenessBand:string,
 *   safetyBand:string,
 *   completenessPercent:number,
 *   triageTier:string,
 *   targetTimeframe:string,
 *   recommendation:string,
 *   recommendationLabel:string,
 *   firedRules:object[],
 *   flags:object[]
 * }}
 */
function calculateGrade(data) {
  const firedRules = [];

  // Axis A — referral appropriateness.
  const appr = scoreAppropriateness(
    data.request.referralReason,
    data.request.requestedService
  );
  if (appr.firedRule) firedRules.push(appr.firedRule);

  // Axis B — safety / red-flag.
  const safety = scoreSafety(data);
  for (const r of safety.firedRules) firedRules.push(r);

  // Axis C — completeness.
  const completeness = scoreCompleteness(data);
  for (const m of completeness.missing) firedRules.push(m);

  // Axis D — triage.
  const triage = scoreTriage(data);
  for (const r of triage.firedRules) firedRules.push(r);

  const recommendation = deriveRecommendation(
    appr.band,
    safety.band,
    completeness.percent
  );

  const flags = detectFlags(data);

  return {
    appropriatenessBand: appr.band,
    safetyBand: safety.band,
    completenessPercent: completeness.percent,
    triageTier: triage.tier,
    targetTimeframe: triage.targetTimeframe,
    recommendation,
    recommendationLabel: RECOMMENDATION_LABELS[recommendation] || recommendation,
    firedRules,
    flags
  };
}

export { calculateGrade, deriveRecommendation, RECOMMENDATION_LABELS };
