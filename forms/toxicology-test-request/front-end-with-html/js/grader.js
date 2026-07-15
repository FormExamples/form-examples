import { detectFlags } from './flags.js';
import { evaluateTiming, scoreAppropriateness, scoreCompleteness, scoreTriage } from './rules.js';

// Four-axis grader for the Toxicology Test Request.
//
// Composes the rule sets in rules.js and the safety flags in flags.js into a
// single pure, deterministic grading result. The public entry point is
// `calculateGrade(data)`. The output shape and rule / flag IDs are identical
// across every front-end and the back-end.
//
// Wrapped in an IIFE; published via `window.ToxicologyTestRequest`.

/**
 * Derive an overall recommendation for the toxicology vetting desk from the
 * four axes. Least-alarming wins only when nothing escalates.
 */
function deriveRecommendation(apprBand, timingBand, completenessPercent) {
  if (apprBand === 'usually-not-appropriate') return 'query-referrer';
  if (timingBand === 'invalid') return 'query-referrer';
  if (completenessPercent < 50) return 'query-referrer';
  return 'accept';
}

const RECOMMENDATION_LABELS = {
  'accept': 'Accept and process',
  'query-referrer': 'Query the referrer',
  'redirect': 'Redirect to a more suitable assay',
  'reject': 'Reject'
};

/**
 * Public entry point. Pure and deterministic.
 *
 * @param {object} data - the request data model from emptyRequest()
 * @returns {{
 *   appropriatenessScore:number,
 *   appropriatenessBand:string,
 *   timingBand:string,
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

  // Axis B — ingestion-timing validity.
  const timing = evaluateTiming(data);
  if (timing.firedRule) firedRules.push(timing.firedRule);

  // Axis C — completeness.
  const completeness = scoreCompleteness(data);
  for (const m of completeness.missing) firedRules.push(m);

  // Axis D — triage.
  const triage = scoreTriage(data);
  for (const r of triage.firedRules) firedRules.push(r);

  const recommendation = deriveRecommendation(
    appr.band,
    timing.band,
    completeness.percent
  );

  const flags = detectFlags(data, { timingBand: timing.band });

  return {
    appropriatenessScore: appr.score,
    appropriatenessBand: appr.band,
    timingBand: timing.band,
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
