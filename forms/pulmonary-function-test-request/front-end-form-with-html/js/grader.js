// Four-axis grader for the Pulmonary Function Test Request.
//
// Composes the rule sets in rules.js and the safety flags in flags.js into a
// single pure, deterministic grading result. The public entry point is
// `calculateGrade(data)`. The output shape and rule / flag IDs are identical
// across every front-end and the back-end.
//
// Wrapped in an IIFE; published via `window.PulmonaryFunctionTestRequest`.

(function () {
'use strict';
window.PulmonaryFunctionTestRequest =
  window.PulmonaryFunctionTestRequest || {};
const NS = window.PulmonaryFunctionTestRequest;
const {
  scoreAppropriateness,
  scoreSafety,
  scoreCompleteness,
  scoreTriage,
  detectFlags
} = NS;

/**
 * Derive an overall recommendation for the lung-function vetting desk from the
 * four axes. Safety dominates: a contraindication redirects / defers the test.
 * Least-alarming wins only when nothing escalates.
 */
function deriveRecommendation(appropriatenessBand, contraindicationBand, completenessPercent) {
  if (contraindicationBand === 'contraindicated') return 'redirect';
  if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
  if (completenessPercent < 50) return 'query-referrer';
  return 'accept';
}

const RECOMMENDATION_LABELS = {
  'accept': 'Accept and book',
  'query-referrer': 'Query the referrer',
  'redirect': 'Defer / redirect',
  'reject': 'Reject'
};

/**
 * Public entry point. Pure and deterministic.
 *
 * @param {object} data - the request data model from emptyRequest()
 * @returns {{
 *   appropriatenessScore:number,
 *   appropriatenessBand:string,
 *   contraindicationBand:string,
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
  const appr = scoreAppropriateness(
    data.request.primaryIndication,
    data.request.testType
  );
  if (appr.firedRule) firedRules.push(appr.firedRule);

  // Axis B — safety / contraindication.
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

  const flags = detectFlags(data, {
    contraindicationBand: safety.band
  });

  return {
    appropriatenessScore: appr.score,
    appropriatenessBand: appr.band,
    contraindicationBand: safety.band,
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
