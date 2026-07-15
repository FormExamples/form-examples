import { detectFlags } from './flags.js';
import { scoreAppropriateness, scoreCompleteness, scoreRisk, scoreUrgency } from './rules.js';

// Four-axis grader for the Cystoscopy Test Request.
//
// Composes the rule sets in rules.js and the safety flags in flags.js into a
// single pure, deterministic grading result. The public entry point is
// `calculateGrade(data)`. The output shape and rule / flag IDs are identical
// across every front-end and the back-end.

/**
 * Derive an overall recommendation for the urology vetting desk from the four
 * axes. Least-alarming wins only when nothing escalates.
 */
function deriveRecommendation(appropriatenessBand, riskBand, completenessPercent, twoWeekWaitEligible) {
  if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
  if (completenessPercent < 50) return 'query-referrer';
  return 'accept';
}

const RECOMMENDATION_LABELS = {
  'accept': 'Accept and book',
  'query-referrer': 'Query the referrer',
  'redirect': 'Redirect to a more suitable pathway',
  'reject': 'Reject'
};

/**
 * Public entry point. Pure and deterministic.
 *
 * @param {object} data - the request data model from emptyRequest()
 * @returns {{
 *   appropriatenessScore:number,
 *   appropriatenessBand:string,
 *   triageTier:string,
 *   targetTimeframe:string,
 *   twoWeekWaitEligible:boolean,
 *   completenessPercent:number,
 *   riskBand:string,
 *   anticoagulantAction:string,
 *   recommendation:string,
 *   recommendationLabel:string,
 *   firedRules:object[],
 *   flags:object[]
 * }}
 */
function calculateGrade(data) {
  const firedRules = [];

  // Axis A — appropriateness.
  const appr = scoreAppropriateness(
    data.request.primaryIndication,
    data.request.procedure
  );
  if (appr.firedRule) firedRules.push(appr.firedRule);

  // Axis B — cancer-pathway urgency.
  const urgency = scoreUrgency(data);
  for (const r of urgency.firedRules) firedRules.push(r);

  // Axis C — completeness.
  const completeness = scoreCompleteness(data);
  for (const m of completeness.missing) firedRules.push(m);

  // Axis D — pre-procedure risk.
  const risk = scoreRisk(data);
  for (const r of risk.firedRules) firedRules.push(r);

  const recommendation = deriveRecommendation(
    appr.band,
    risk.band,
    completeness.percent,
    urgency.twoWeekWaitEligible
  );

  const flags = detectFlags(data, {
    twoWeekWaitEligible: urgency.twoWeekWaitEligible
  });

  return {
    appropriatenessScore: appr.score,
    appropriatenessBand: appr.band,
    triageTier: urgency.tier,
    targetTimeframe: urgency.targetTimeframe,
    twoWeekWaitEligible: urgency.twoWeekWaitEligible,
    completenessPercent: completeness.percent,
    riskBand: risk.band,
    anticoagulantAction: risk.anticoagulantAction,
    recommendation,
    recommendationLabel: RECOMMENDATION_LABELS[recommendation] || recommendation,
    firedRules,
    flags
  };
}

export { calculateGrade, deriveRecommendation, RECOMMENDATION_LABELS };
