// Four-axis grader for the Nerve Conduction Study Test Request.
//
// Composes the rule sets in rules.js and the safety flags in flags.js into a
// single pure, deterministic grading result. The public entry point is
// `calculateGrade(data)`. The output shape and rule / flag IDs are identical
// across every front-end and the back-end.
//
// Wrapped in an IIFE; published via `window.NerveConductionStudyTestRequest`.

(function () {
'use strict';
window.NerveConductionStudyTestRequest =
  window.NerveConductionStudyTestRequest || {};
const NS = window.NerveConductionStudyTestRequest;
const {
  scoreAppropriateness,
  scoreProceduralRisk,
  scoreCompleteness,
  scoreTriage,
  detectFlags
} = NS;

/**
 * Derive an overall recommendation for the neurophysiology vetting desk from
 * the four axes. Least-alarming wins only when nothing escalates.
 */
function deriveRecommendation(appropriatenessBand, proceduralRiskBand, completenessPercent, triageTier) {
  if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
  if (completenessPercent < 50) return 'query-referrer';
  if (proceduralRiskBand === 'high') return 'query-referrer';
  return 'accept';
}

const RECOMMENDATION_LABELS = {
  'accept': 'Accept and book',
  'query-referrer': 'Query the referrer',
  'redirect': 'Redirect to a more suitable study',
  'reject': 'Reject'
};

/**
 * Public entry point. Pure and deterministic.
 *
 * @param {object} data - the request data model from emptyRequest()
 * @returns {{
 *   appropriatenessScore:number,
 *   appropriatenessBand:string,
 *   proceduralRiskBand:string,
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
    data.study.studyType
  );
  if (appr.firedRule) firedRules.push(appr.firedRule);

  // Axis B — procedural risk.
  const risk = scoreProceduralRisk(data);
  for (const r of risk.firedRules) firedRules.push(r);

  // Axis C — completeness.
  const completeness = scoreCompleteness(data);
  for (const m of completeness.missing) firedRules.push(m);

  // Axis D — triage.
  const triage = scoreTriage(data);
  for (const r of triage.firedRules) firedRules.push(r);

  const recommendation = deriveRecommendation(
    appr.band,
    risk.band,
    completeness.percent,
    triage.tier
  );

  const flags = detectFlags(data, {});

  return {
    appropriatenessScore: appr.score,
    appropriatenessBand: appr.band,
    proceduralRiskBand: risk.band,
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
