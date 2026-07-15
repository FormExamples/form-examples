import { detectFlags } from './flags.js';
import { evaluateContrastSafety, evaluateDose, scoreAppropriateness, scoreCompleteness, scoreTriage } from './rules.js';

// Four-axis grader for the CT Scan Test Request.
//
// Composes the rule sets in rules.js and the safety flags in flags.js into a
// single pure, deterministic grading result. The public entry point is
// `calculateGrade(data)`. The output shape and rule / flag IDs are identical
// across every front-end and the back-end, and map onto the
// ct_scan_test_request_grade SQL columns.

/**
 * Derive an overall recommendation for the imaging vetting desk from the four
 * axes. Least-alarming wins only when nothing escalates.
 */
function deriveRecommendation(apprBand, contrastSafetyBand, completenessPercent) {
  if (contrastSafetyBand === 'contraindicated') return 'redirect';
  if (apprBand === 'usually-not-appropriate') return 'query-referrer';
  if (completenessPercent < 50) return 'query-referrer';
  return 'accept';
}

const RECOMMENDATION_LABELS = {
  'accept': 'Accept and protocol',
  'query-referrer': 'Query the referrer',
  'redirect': 'Redirect / alternative study',
  'reject': 'Reject'
};

/**
 * Public entry point. Pure and deterministic.
 *
 * @param {object} data - the request data model from emptyRequest()
 * @returns {{
 *   appropriatenessScore:number,
 *   appropriatenessBand:string,
 *   contrastSafetyBand:string,
 *   estimatedDoseBand:string,
 *   renalRisk:boolean,
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

  // Axis B — radiation & contrast safety.
  const dose = evaluateDose(data.request.bodyRegion);
  if (dose.firedRule) firedRules.push(dose.firedRule);
  const contrast = evaluateContrastSafety(data.contrast);
  for (const r of contrast.firedRules) firedRules.push(r);

  // Axis C — completeness.
  const completeness = scoreCompleteness(data);
  for (const m of completeness.missing) firedRules.push(m);

  // Axis D — triage.
  const triage = scoreTriage(data);
  for (const r of triage.firedRules) firedRules.push(r);

  const recommendation = deriveRecommendation(
    appr.band,
    contrast.band,
    completeness.percent
  );

  const flags = detectFlags(data, {
    estimatedDoseBand: dose.band,
    contrastSafetyBand: contrast.band,
    renalRisk: contrast.renalRisk
  });

  return {
    appropriatenessScore: appr.score,
    appropriatenessBand: appr.band,
    contrastSafetyBand: contrast.band,
    estimatedDoseBand: dose.band,
    renalRisk: contrast.renalRisk,
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
