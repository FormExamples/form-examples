// Four-axis grader for the Eye Vision Test Request.
//
// Composes the rule sets in rules.js and the safety flags in flags.js into a
// single pure, deterministic grading result. The public entry point is
// `calculateGrade(data)`. The output shape and rule / flag IDs are identical
// across every front-end and the back-end.
//
// Wrapped in an IIFE; published via `window.EyeVisionTestRequest`.

(function () {
'use strict';
window.EyeVisionTestRequest =
  window.EyeVisionTestRequest || {};
const NS = window.EyeVisionTestRequest;
const {
  scoreAppropriateness,
  scoreTriage,
  scoreCompleteness,
  scorePriority,
  detectFlags
} = NS;

/**
 * Derive an overall recommendation for the eye-care vetting desk from the four
 * axes. Least-alarming wins only when nothing escalates.
 */
function deriveRecommendation(appropriatenessBand, triageTier, completenessPercent, priorityBand) {
  if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
  if (completenessPercent < 50) return 'query-referrer';
  return 'accept';
}

const RECOMMENDATION_LABELS = {
  'accept': 'Accept and book',
  'query-referrer': 'Query the referrer',
  'redirect': 'Redirect to a more suitable test',
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
    data.request.testType
  );
  if (appr.firedRule) firedRules.push(appr.firedRule);

  // Axis B — urgency / triage.
  const triage = scoreTriage(data);
  for (const r of triage.firedRules) firedRules.push(r);

  // Axis C — completeness.
  const completeness = scoreCompleteness(data);
  for (const m of completeness.missing) firedRules.push(m);

  // Axis D — clinical priority.
  const priority = scorePriority(data);
  for (const r of priority.firedRules) firedRules.push(r);

  const recommendation = deriveRecommendation(
    appr.band,
    triage.tier,
    completeness.percent,
    priority.band
  );

  const flags = detectFlags(data, {});

  return {
    appropriatenessScore: appr.score,
    appropriatenessBand: appr.band,
    triageTier: triage.tier,
    targetTimeframe: triage.targetTimeframe,
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
