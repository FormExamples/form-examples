import { detectFlags } from './flags.js';
import { scoreAppropriateness, scoreCompleteness, scorePreanalytical, scoreTriage } from './rules.js';

// Four-axis grader for the Microbiology Culture Test Request.
//
// Composes the rule sets in rules.js and the safety flags in flags.js into a
// single pure, deterministic grading result. The public entry point is
// `calculateGrade(data)`. The output shape and rule / flag IDs are identical
// across every front-end and the back-end.
//
// Wrapped in an IIFE; published via `window.MicrobiologyCultureTestRequest`.

/**
 * Derive an overall vetting recommendation from the four axes. The
 * least-alarming recommendation wins only when nothing escalates.
 */
function deriveRecommendation(appropriatenessBand, preanalyticalBand, completenessPercent) {
  if (preanalyticalBand === 'reject-risk') return 'reject';
  if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
  if (completenessPercent < 50) return 'query-referrer';
  if (preanalyticalBand === 'caution') return 'query-referrer';
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
    data.clinical.primaryIndication,
    data.specimen.specimenType,
    data.tests
  );
  if (appr.firedRule) firedRules.push(appr.firedRule);

  // Axis B — pre-analytical / specimen safety.
  const preanalytical = scorePreanalytical(data);
  for (const r of preanalytical.firedRules) firedRules.push(r);

  // Axis C — completeness.
  const completeness = scoreCompleteness(data);
  for (const m of completeness.missing) firedRules.push(m);

  // Axis D — triage.
  const triage = scoreTriage(data);
  for (const r of triage.firedRules) firedRules.push(r);

  const recommendation = deriveRecommendation(
    appr.band,
    preanalytical.band,
    completeness.percent
  );

  const flags = detectFlags(data);

  return {
    appropriatenessScore: appr.score,
    appropriatenessBand: appr.band,
    preanalyticalBand: preanalytical.band,
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
