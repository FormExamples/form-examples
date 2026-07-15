import { detectFlags } from './flags.js';
import { scoreAppropriateness, scoreCompleteness, scoreRadiationDose, scoreSafety, scoreTriage } from './rules.js';
import { isBariumStudy } from './types.js';

// Four-axis grader for the Fluoroscopy Test Request.
//
// Composes the rule sets in rules.js and the safety flags in flags.js into a
// single pure, deterministic grading result. The public entry point is
// `calculateGrade(data)`. The output shape and rule / flag IDs are identical
// across every front-end and the back-end.
//
// Wrapped in an IIFE; published via `window.FluoroscopyTestRequest`.

/**
 * Derive an overall recommendation for the imaging vetting desk from the four
 * axes. A safety contraindication forces query-referrer / redirect regardless
 * of the other axes. Least-alarming wins only when nothing escalates.
 */
function deriveRecommendation(appropriatenessBand, safetyBand, completenessPercent, suspectedPerforationBarium) {
  if (safetyBand === 'contraindicated') {
    // Barium-vs-perforation has a clear safe redirect target.
    return suspectedPerforationBarium ? 'redirect' : 'query-referrer';
  }
  if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
  if (completenessPercent < 50) return 'query-referrer';
  return 'accept';
}

const RECOMMENDATION_LABELS = {
  'accept': 'Accept and book',
  'query-referrer': 'Query the referrer',
  'redirect': 'Redirect to a more suitable study',
  'reject': 'Reject'
};

/**
 * Public entry point. Pure and deterministic.
 *
 * @param {object} data - the request data model from emptyRequest()
 * @returns {{
 *   appropriatenessScore:number,
 *   appropriatenessBand:string,
 *   safetyBand:string,
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
    data.request.primaryIndication,
    data.request.studyType
  );
  if (appr.firedRule) firedRules.push(appr.firedRule);

  // Axis B — radiation dose.
  const dose = scoreRadiationDose(data.request.studyType);
  if (dose.firedRule) firedRules.push(dose.firedRule);

  // Axis B — safety band.
  const safety = scoreSafety(data);
  for (const r of safety.firedRules) firedRules.push(r);

  // Axis C — completeness.
  const completeness = scoreCompleteness(data);
  for (const m of completeness.missing) firedRules.push(m);

  // Axis D — triage.
  const triage = scoreTriage(data);
  for (const r of triage.firedRules) firedRules.push(r);

  const suspectedPerforationBarium =
    data.request.primaryIndication === 'suspected-perforation' &&
    isBariumStudy(data.request.studyType);

  const recommendation = deriveRecommendation(
    appr.band,
    safety.band,
    completeness.percent,
    suspectedPerforationBarium
  );

  const flags = detectFlags(data, {
    radiationDoseBand: dose.band
  });

  return {
    appropriatenessScore: appr.score,
    appropriatenessBand: appr.band,
    safetyBand: safety.band,
    radiationDoseBand: dose.band,
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
