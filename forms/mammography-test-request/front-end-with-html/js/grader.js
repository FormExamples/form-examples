// Four-axis grader for the Mammography Test Request.
//
// Composes the rule sets in rules.js and the safety flags in flags.js into a
// single pure, deterministic grading result. The public entry point is
// `calculateGrade(data)`. The output shape and rule / flag IDs are identical
// across every front-end and the back-end, and map onto the
// mammography_test_request_grade SQL columns.
//
// Wrapped in an IIFE; published via `window.MammographyTestRequest`.

(function () {
'use strict';
window.MammographyTestRequest =
  window.MammographyTestRequest || {};
const NS = window.MammographyTestRequest;
const {
  scoreAppropriateness,
  scoreUrgency,
  scoreCompleteness,
  scorePriority,
  detectFlags
} = NS;

/**
 * Derive an overall vetting recommendation from the four axes. Least-alarming
 * wins only when nothing escalates.
 */
function deriveRecommendation(appropriatenessBand, completenessPercent, twoWeekWaitEligible) {
  if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
  if (completenessPercent < 50) return 'query-referrer';
  return 'accept';
}

const RECOMMENDATION_LABELS = {
  'accept': 'Accept and book',
  'query-referrer': 'Query the referrer',
  'redirect': 'Redirect to a more suitable examination',
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
 *   twoWeekWaitRationale:string,
 *   completenessPercent:number,
 *   priorityBand:string,
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
    data.request.examType
  );
  if (appr.firedRule) firedRules.push(appr.firedRule);

  // Axis B — cancer-pathway urgency.
  const urgency = scoreUrgency(data);
  for (const r of urgency.firedRules) firedRules.push(r);

  // Axis C — completeness.
  const completeness = scoreCompleteness(data);
  for (const m of completeness.missing) firedRules.push(m);

  // Axis D — clinical priority.
  const priority = scorePriority(data);
  for (const r of priority.firedRules) firedRules.push(r);

  const recommendation = deriveRecommendation(
    appr.band,
    completeness.percent,
    urgency.twoWeekWaitEligible
  );

  const flags = detectFlags(data, {
    twoWeekWaitEligible: urgency.twoWeekWaitEligible,
    twoWeekWaitRationale: urgency.twoWeekWaitRationale
  });

  return {
    appropriatenessScore: appr.score,
    appropriatenessBand: appr.band,
    triageTier: urgency.tier,
    targetTimeframe: urgency.targetTimeframe,
    twoWeekWaitEligible: urgency.twoWeekWaitEligible,
    twoWeekWaitRationale: urgency.twoWeekWaitRationale,
    completenessPercent: completeness.percent,
    priorityBand: priority.band,
    recommendation,
    recommendationLabel: RECOMMENDATION_LABELS[recommendation] || recommendation,
    firedRules,
    flags
  };
}

Object.assign(NS, {
  calculateGrade,
  deriveRecommendation,
  RECOMMENDATION_LABELS
});
})();
