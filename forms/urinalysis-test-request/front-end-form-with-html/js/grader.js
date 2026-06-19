// Four-axis grader for the Urinalysis Test Request.
//
// Composes the rule sets in rules.js and the safety flags in flags.js into a
// single pure, deterministic grading result. The public entry point is
// `calculateGrade(data)`. The output shape and rule / flag IDs are identical
// across every front-end and the back-end.
//
// Wrapped in an IIFE; published via `window.UrinalysisTestRequest`.

(function () {
'use strict';
window.UrinalysisTestRequest = window.UrinalysisTestRequest || {};
const NS = window.UrinalysisTestRequest;
const {
  scoreAppropriateness,
  scorePreanalytical,
  scoreCompleteness,
  scoreTriage,
  detectFlags
} = NS;

/**
 * Derive an overall recommendation for the pathology vetting desk from the
 * four axes. Least-alarming wins only when nothing escalates.
 */
function deriveRecommendation(appropriatenessBand, preanalyticalBand, completenessPercent) {
  if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
  if (preanalyticalBand === 'reject-risk') return 'reject';
  if (completenessPercent < 50) return 'query-referrer';
  return 'accept';
}

const RECOMMENDATION_LABELS = {
  'accept': 'Accept and process',
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
 *   preanalyticalBand:string,
 *   fastingOrSpecimen:string,
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

  // Axis A — appropriateness.
  const appr = scoreAppropriateness(data.context.primaryIndication, data.tests);
  if (appr.firedRule) firedRules.push(appr.firedRule);

  // Axis B — pre-analytical specimen suitability.
  const pre = scorePreanalytical(data);
  if (pre.firedRule) firedRules.push(pre.firedRule);

  // Axis C — completeness.
  const completeness = scoreCompleteness(data);
  for (const m of completeness.missing) firedRules.push(m);

  // Axis D — triage.
  const triage = scoreTriage(data);
  for (const r of triage.firedRules) firedRules.push(r);

  const recommendation = deriveRecommendation(
    appr.band,
    pre.band,
    completeness.percent
  );

  const flags = detectFlags(data);

  return {
    appropriatenessScore: appr.score,
    appropriatenessBand: appr.band,
    preanalyticalBand: pre.band,
    fastingOrSpecimen: pre.note,
    completenessPercent: completeness.percent,
    triageTier: triage.tier,
    targetTimeframe: triage.targetTimeframe,
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
