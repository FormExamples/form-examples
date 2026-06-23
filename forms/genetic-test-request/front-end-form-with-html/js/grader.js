// Four-axis grader for the Genetic Test Request.
//
// Composes the rule sets in rules.js and the safety flags in flags.js into a
// single pure, deterministic grading result. The public entry point is
// `calculateGrade(data)`. The output shape and rule / flag IDs are identical
// across every front-end and the back-end.
//
// Wrapped in an IIFE; published via `window.GeneticTestRequest`.

(function () {
'use strict';
window.GeneticTestRequest = window.GeneticTestRequest || {};
const NS = window.GeneticTestRequest;
const {
  scoreAppropriateness,
  scoreConsentCounselling,
  scoreCompleteness,
  scoreTriage,
  detectFlags
} = NS;

/**
 * Derive an overall recommendation for the Genomic Laboratory Hub vetting desk
 * from the four axes. Least-alarming wins only when nothing escalates.
 * The consent axis is mandatory-blocking: `not-met` rejects the request.
 */
function deriveRecommendation(appropriatenessBand, consentBand, completenessPercent) {
  if (consentBand === 'not-met') return 'reject';
  if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
  if (completenessPercent < 50) return 'query-referrer';
  if (consentBand === 'caution') return 'query-referrer';
  return 'accept';
}

const RECOMMENDATION_LABELS = {
  'accept': 'Accept and process',
  'query-referrer': 'Query the referrer',
  'redirect': 'Redirect to a more suitable test',
  'reject': 'Reject — blocking issue'
};

/**
 * Public entry point. Pure and deterministic.
 *
 * @param {object} data - the request data model from emptyRequest()
 * @returns {{
 *   appropriatenessScore:number,
 *   appropriatenessBand:string,
 *   consentCounsellingBand:string,
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

  // Axis B — consent & counselling.
  const consent = scoreConsentCounselling(data);
  for (const r of consent.firedRules) firedRules.push(r);

  // Axis C — completeness.
  const completeness = scoreCompleteness(data);
  for (const m of completeness.missing) firedRules.push(m);

  // Axis D — triage.
  const triage = scoreTriage(data);
  for (const r of triage.firedRules) firedRules.push(r);

  const recommendation = deriveRecommendation(
    appr.band,
    consent.band,
    completeness.percent
  );

  const flags = detectFlags(data, { consentBand: consent.band });

  return {
    appropriatenessScore: appr.score,
    appropriatenessBand: appr.band,
    consentCounsellingBand: consent.band,
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
