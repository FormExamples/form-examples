import { detectFlags } from './flags.js';
import { scoreAppropriateness, scoreCompleteness, scoreInterpretation, scoreTriage } from './rules.js';

// Four-axis grader for the Tumor Marker Test Request.
//
// Composes the rule sets in rules.js and the safety flags in flags.js into a
// single pure, deterministic grading result. The public entry point is
// `calculateGrade(data)`. The output shape and rule / flag IDs are identical
// across every front-end and the back-end.

/**
 * Derive an overall recommendation for the laboratory vetting desk from the
 * four axes. Least-alarming wins only when nothing escalates.
 */
function deriveRecommendation(appropriatenessBand, interpretationBand, completenessPercent) {
  if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
  if (interpretationBand === 'misuse-risk') return 'redirect';
  if (completenessPercent < 50) return 'query-referrer';
  return 'accept';
}

const RECOMMENDATION_LABELS = {
  'accept': 'Accept and process',
  'query-referrer': 'Query the referrer',
  'redirect': 'Redirect / reconsider request',
  'reject': 'Reject'
};

/**
 * Public entry point. Pure and deterministic.
 *
 * @param {object} data - the request data model from emptyRequest()
 * @returns {{
 *   appropriatenessScore:number,
 *   appropriatenessBand:string,
 *   interpretationBand:string,
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

  // Axis A — appropriateness (marker-to-indication fit).
  const appr = scoreAppropriateness(data.markers, data.context.primaryIndication);
  for (const r of appr.firedRules) firedRules.push(r);

  // Axis B — interpretation safety.
  const interp = scoreInterpretation(data, {
    screeningMisuse: appr.screeningMisuse
  });
  for (const r of interp.firedRules) firedRules.push(r);

  // Axis C — completeness.
  const completeness = scoreCompleteness(data);
  for (const m of completeness.missing) firedRules.push(m);

  // Axis D — triage.
  const triage = scoreTriage(data);
  for (const r of triage.firedRules) firedRules.push(r);

  const recommendation = deriveRecommendation(
    appr.band,
    interp.band,
    completeness.percent
  );

  const flags = detectFlags(data, {
    triageTier: triage.tier,
    mismatchedMarkers: appr.mismatchedMarkers,
    screeningMisuse: appr.screeningMisuse
  });

  return {
    appropriatenessScore: appr.score,
    appropriatenessBand: appr.band,
    interpretationBand: interp.band,
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
