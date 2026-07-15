import { detectFlags } from './flags.js';
import { scoreAppropriateness, scoreCompleteness, scoreSpecimenQuality, scoreTriage } from './rules.js';

// Four-axis grader for the Histopathology Test Request.
//
// Composes the rule sets in rules.js and the safety flags in flags.js into a
// single pure, deterministic grading result. The public entry point is
// `calculateGrade(data)`. The output shape and rule / flag IDs are identical
// across every front-end and the back-end.
//
// Wrapped in an IIFE; published via `window.HistopathologyTestRequest`.

/**
 * Derive an overall recommendation for the pathology vetting desk from the
 * four axes. Least-alarming wins only when nothing escalates.
 */
function deriveRecommendation(appropriatenessBand, specimenQualityBand, completenessPercent) {
  if (specimenQualityBand === 'reject-risk') return 'query-referrer';
  if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
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
 *   specimenQualityBand:string,
 *   completenessPercent:number,
 *   triageTier:string,
 *   targetTimeframe:string,
 *   immediate:boolean,
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
    data.specimen.specimenType
  );
  if (appr.firedRule) firedRules.push(appr.firedRule);

  // Axis B — specimen quality.
  const specimen = scoreSpecimenQuality(data);
  for (const r of specimen.firedRules) firedRules.push(r);

  // Axis C — completeness.
  const completeness = scoreCompleteness(data);
  for (const m of completeness.missing) firedRules.push(m);

  // Axis D — urgency triage.
  const triage = scoreTriage(data);
  for (const r of triage.firedRules) firedRules.push(r);

  const recommendation = deriveRecommendation(
    appr.band,
    specimen.band,
    completeness.percent
  );

  const flags = detectFlags(data, {
    specimenQualityBand: specimen.band
  });

  return {
    appropriatenessScore: appr.score,
    appropriatenessBand: appr.band,
    specimenQualityBand: specimen.band,
    completenessPercent: completeness.percent,
    triageTier: triage.tier,
    targetTimeframe: triage.targetTimeframe,
    immediate: triage.immediate,
    recommendation,
    recommendationLabel: RECOMMENDATION_LABELS[recommendation] || recommendation,
    firedRules,
    flags
  };
}

export { calculateGrade, deriveRecommendation, RECOMMENDATION_LABELS };
