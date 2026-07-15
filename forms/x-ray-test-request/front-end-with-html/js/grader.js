import { detectFlags } from './flags.js';
import { scoreAppropriateness, scoreCompleteness, scoreRadiationSafety, scoreTriage } from './rules.js';

// Four-axis grader for the X-Ray Test Request.
//
// Composes the rule sets in rules.js and the safety flags in flags.js into a
// single pure, deterministic grading result. The public entry point is
// `calculateGrade(data)`. The output shape and rule / flag IDs are identical
// across every front-end and the back-end.

/**
 * Derive an overall recommendation for the imaging vetting desk from the four
 * axes. Least-alarming wins only when nothing escalates.
 */
function deriveRecommendation(apprBand, radiationSafetyBand, completenessPercent) {
  if (radiationSafetyBand === 'contraindicated') return 'reject';
  if (apprBand === 'usually-not-appropriate') return 'query-referrer';
  if (radiationSafetyBand === 'caution') return 'query-referrer';
  if (completenessPercent < 50) return 'query-referrer';
  return 'accept';
}

const RECOMMENDATION_LABELS = {
  'accept': 'Accept and book',
  'query-referrer': 'Query the referrer',
  'redirect': 'Redirect to another modality',
  'reject': 'Reject'
};

/**
 * Public entry point. Pure and deterministic.
 *
 * @param {object} data - the request data model from emptyRequest()
 * @returns {{
 *   appropriatenessScore:number,
 *   appropriatenessBand:string,
 *   radiationSafetyBand:string,
 *   radiationDoseBand:string,
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
    data.request.bodyRegion,
    data.request.primaryIndication
  );
  if (appr.firedRule) firedRules.push(appr.firedRule);

  // Axis B — radiation safety + dose band.
  const safety = scoreRadiationSafety(data);
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

  const flags = detectFlags(data, { doseBand: safety.doseBand });

  return {
    appropriatenessScore: appr.score,
    appropriatenessBand: appr.band,
    radiationSafetyBand: safety.band,
    radiationDoseBand: safety.doseBand,
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
