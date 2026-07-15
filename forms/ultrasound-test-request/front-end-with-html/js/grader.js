import { detectFlags } from './flags.js';
import { evaluateSuitability, scoreAppropriateness, scoreCompleteness, scoreTriage } from './rules.js';

// Four-axis grader for the Ultrasound Test Request
// (general, non-obstetric diagnostic ultrasound).
//
// Composes the rule sets in rules.js and the safety flags in flags.js into a
// single pure, deterministic grading result. The public entry point is
// `calculateGrade(data)`. The output shape and rule / flag IDs are identical
// across every front-end and the back-end.
//
// Wrapped in an IIFE; published via `window.UltrasoundTestRequest`.

/**
 * Derive an overall recommendation for the imaging vetting desk from the four
 * axes. Least-alarming wins only when nothing escalates.
 */
function deriveRecommendation(appropriatenessBand, suitabilityBand, completenessPercent, triageTier) {
  if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
  if (completenessPercent < 50) return 'query-referrer';
  if (suitabilityBand === 'limited') return 'redirect';
  return 'accept';
}

const RECOMMENDATION_LABELS = {
  'accept': 'Accept and book',
  'query-referrer': 'Query the referrer',
  'redirect': 'Redirect / amend preparation',
  'reject': 'Reject'
};

/**
 * Public entry point. Pure and deterministic.
 *
 * @param {object} data - the request data model from emptyRequest()
 * @returns {{
 *   appropriatenessScore:number,
 *   appropriatenessBand:string,
 *   suitabilityBand:string,
 *   prepRequirements:string,
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
    data.request.bodyRegion
  );
  if (appr.firedRule) firedRules.push(appr.firedRule);

  // Axis B — preparation / technical suitability.
  const suitability = evaluateSuitability(data);
  for (const r of suitability.firedRules) firedRules.push(r);

  // Axis C — completeness.
  const completeness = scoreCompleteness(data);
  for (const m of completeness.missing) firedRules.push(m);

  // Axis D — triage.
  const triage = scoreTriage(data);
  for (const r of triage.firedRules) firedRules.push(r);

  const recommendation = deriveRecommendation(
    appr.band,
    suitability.band,
    completeness.percent,
    triage.tier
  );

  const flags = detectFlags(data, {
    suitabilityBand: suitability.band,
    prepRequirements: suitability.prepRequirements
  });

  return {
    appropriatenessScore: appr.score,
    appropriatenessBand: appr.band,
    suitabilityBand: suitability.band,
    prepRequirements: suitability.prepRequirements,
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
