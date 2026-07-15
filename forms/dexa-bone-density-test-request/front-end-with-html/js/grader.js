import { detectFlags } from './flags.js';
import { evaluateRadiationSafety, scoreAppropriateness, scoreCompleteness, scoreTriage } from './rules.js';

// Four-axis grader for the DEXA Bone Density Test Request.
//
// Composes the rule sets in rules.js and the safety flags in flags.js into a
// single pure, deterministic grading result. The public entry point is
// `calculateGrade(data)`. The output shape and rule / flag IDs are identical
// across every front-end and the back-end.
//
// Wrapped in an IIFE; published via `window.DexaBoneDensityTestRequest`.

/**
 * Derive an overall recommendation for the imaging vetting desk from the four
 * axes. Least-alarming wins only when nothing escalates.
 */
function deriveRecommendation(appropriatenessBand, radiationDoseBand, completenessPercent) {
  if (radiationDoseBand === 'high') return 'redirect';
  if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
  if (completenessPercent < 50) return 'query-referrer';
  return 'accept';
}

const RECOMMENDATION_LABELS = {
  'accept': 'Accept and book',
  'query-referrer': 'Query the referrer',
  'redirect': 'Redirect / defer',
  'reject': 'Reject'
};

/**
 * Public entry point. Pure and deterministic.
 *
 * @param {object} data - the request data model from emptyRequest()
 * @returns {{
 *   appropriatenessScore:number,
 *   appropriatenessBand:string,
 *   radiationDoseBand:string,
 *   safetyNote:string,
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

  // Axis A — appropriateness (with FRAX adjustment).
  const appr = scoreAppropriateness(
    data.request.primaryIndication,
    data.request.scanRegion,
    data.riskFactors.fraxMajorFracturePercent
  );
  if (appr.firedRule) firedRules.push(appr.firedRule);
  if (appr.fraxRule) firedRules.push(appr.fraxRule);

  // Axis B — radiation safety.
  const safety = evaluateRadiationSafety(
    data.request.scanRegion,
    data.patient.pregnancyStatus
  );
  if (safety.firedRule) firedRules.push(safety.firedRule);

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

  const flags = detectFlags(data, { radiationDoseBand: safety.band });

  return {
    appropriatenessScore: appr.score,
    appropriatenessBand: appr.band,
    radiationDoseBand: safety.band,
    safetyNote: safety.note,
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
