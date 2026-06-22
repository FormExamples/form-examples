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
  countSelectedTests,
  detectFlags
} = NS;

/**
 * Derive an overall recommendation for the pathology vetting desk from the
 * four axes. Least-alarming wins only when nothing escalates.
 */
function deriveRecommendation(apprBand, preanalyticalBand, completenessPercent, noTestSelected) {
  if (noTestSelected) return 'query-referrer';
  if (apprBand === 'usually-not-appropriate') return 'query-referrer';
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
  const appr = scoreAppropriateness(data);
  if (appr.firedRule) firedRules.push(appr.firedRule);

  // Axis B — preanalytical specimen suitability.
  const preanalytical = scorePreanalytical(data);
  for (const r of preanalytical.firedRules) firedRules.push(r);

  // Axis C — completeness.
  const completeness = scoreCompleteness(data);
  for (const m of completeness.missing) firedRules.push(m);

  // Axis D — triage.
  const triage = scoreTriage(data);
  for (const r of triage.firedRules) firedRules.push(r);

  const noTestSelected = countSelectedTests(data.tests) === 0;

  const recommendation = deriveRecommendation(
    appr.band,
    preanalytical.band,
    completeness.percent,
    noTestSelected
  );

  const flags = detectFlags(data, {
    preanalyticalBand: preanalytical.band
  });

  return {
    appropriatenessScore: appr.score,
    appropriatenessBand: appr.band,
    preanalyticalBand: preanalytical.band,
    fastingOrSpecimen: preanalytical.note,
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
