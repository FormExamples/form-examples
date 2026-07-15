import { detectFlags } from './flags.js';
import { scoreAppropriateness, scoreCompleteness, scoreSuitability, scoreTriage } from './rules.js';

// Four-axis grader for the Ambulatory Blood Pressure Test Request.
//
// Composes the rule sets in rules.js and the safety flags in flags.js into a
// single pure, deterministic grading result. The public entry point is
// `calculateGrade(data)`. The output shape and rule / flag IDs are identical
// across every front-end and the back-end (mirrors SQL migration 05 columns).
//
// Wrapped in an IIFE; published via
// `window.AmbulatoryBloodPressureTestRequest`.

/**
 * Derive an overall vetting recommendation from the four axes. The
 * least-alarming recommendation wins only when nothing escalates.
 */
function deriveRecommendation(apprBand, suitabilityBand, completenessPercent, triageTier) {
  if (apprBand === 'usually-not-appropriate') return 'query-referrer';
  if (completenessPercent < 50) return 'query-referrer';
  if (suitabilityBand === 'limited') return 'redirect';
  return 'accept';
}

const RECOMMENDATION_LABELS = {
  'accept': 'Accept and book',
  'query-referrer': 'Query the referrer',
  'redirect': 'Redirect / use alternative method',
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

  // Axis B — suitability.
  const suitability = scoreSuitability(data);
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

  const flags = detectFlags(data);

  return {
    appropriatenessScore: appr.score,
    appropriatenessBand: appr.band,
    suitabilityBand: suitability.band,
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
