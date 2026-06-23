// Four-axis grader for the Allergy Skin Test Request.
//
// Composes the rule sets in rules.js and the safety flags in flags.js into a
// single pure, deterministic grading result. The public entry point is
// `calculateGrade(data)`. The output shape and rule / flag IDs are identical
// across every front-end and the back-end.
//
// Wrapped in an IIFE; published via `window.AllergySkinTestRequest`.

(function () {
'use strict';
window.AllergySkinTestRequest =
  window.AllergySkinTestRequest || {};
const NS = window.AllergySkinTestRequest;
const {
  scoreAppropriateness,
  noAllergenAppropriatenessRule,
  scoreValiditySafety,
  scoreCompleteness,
  scoreTriage,
  detectFlags
} = NS;

/**
 * Derive an overall recommendation for the allergy vetting desk from the four
 * axes. Least-alarming wins only when nothing escalates.
 */
function deriveRecommendation(appropriatenessBand, validityBand, completenessPercent) {
  if (validityBand === 'contraindicated') return 'redirect';
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
 *   validitySafetyBand:string,
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
    data.indication.primaryIndication,
    data.test.testType
  );
  if (appr.firedRule) firedRules.push(appr.firedRule);

  // No allergen selected drops appropriateness to the lowest band.
  let appropriatenessScore = appr.score;
  let appropriatenessBand = appr.band;
  const noAllergen = noAllergenAppropriatenessRule(data.test);
  if (noAllergen) {
    firedRules.push(noAllergen);
    appropriatenessScore = Math.min(appropriatenessScore, 2);
    appropriatenessBand = 'usually-not-appropriate';
  }

  // Axis B — validity and safety.
  const validity = scoreValiditySafety(data);
  for (const r of validity.firedRules) firedRules.push(r);

  // Axis C — completeness.
  const completeness = scoreCompleteness(data);
  for (const m of completeness.missing) firedRules.push(m);

  // Axis D — triage.
  const triage = scoreTriage(data);
  for (const r of triage.firedRules) firedRules.push(r);

  const recommendation = deriveRecommendation(
    appropriatenessBand,
    validity.band,
    completeness.percent
  );

  const flags = detectFlags(data);

  return {
    appropriatenessScore,
    appropriatenessBand,
    validitySafetyBand: validity.band,
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
