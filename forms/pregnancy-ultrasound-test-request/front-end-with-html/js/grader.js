import { detectFlags } from './flags.js';
import { evaluateWindowFit, scoreAppropriateness, scoreCompleteness, scoreTriage } from './rules.js';
import { gestationalAgeToDays } from './types.js';

// Four-axis grader for the Pregnancy Ultrasound Test Request.
//
// Composes the rule sets in rules.js and the safety flags in flags.js into a
// single pure, deterministic grading result. The public entry point is
// `calculateGrade(data)`. The output shape and rule / flag IDs are identical
// across every front-end and the back-end.

/**
 * Derive an overall recommendation for the imaging vetting desk from the four
 * axes. Least-alarming wins only when nothing escalates.
 */
function deriveRecommendation(appropriatenessBand, windowFit, completenessPercent, triageTier) {
  if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
  if (windowFit === 'outside-window') return 'redirect';
  if (completenessPercent < 50) return 'query-referrer';
  return 'accept';
}

const RECOMMENDATION_LABELS = {
  'accept': 'Accept and book',
  'query-referrer': 'Query the referrer',
  'redirect': 'Redirect to a more suitable scan',
  'reject': 'Reject'
};

/**
 * Public entry point. Pure and deterministic.
 *
 * @param {object} data - the request data model from emptyRequest()
 * @returns {{
 *   appropriatenessScore:number,
 *   appropriatenessBand:string,
 *   windowFit:string,
 *   recommendedScanType:string,
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
    data.request.requestedScanType
  );
  if (appr.firedRule) firedRules.push(appr.firedRule);

  // Axis B — gestational-age window fit.
  const gaDays = gestationalAgeToDays(
    data.dating.gestationalAgeWeeks,
    data.dating.gestationalAgeDays
  );
  const window = evaluateWindowFit(data.request.requestedScanType, gaDays);
  if (window.firedRule) firedRules.push(window.firedRule);

  // Axis C — completeness.
  const completeness = scoreCompleteness(data);
  for (const m of completeness.missing) firedRules.push(m);

  // Axis D — triage.
  const triage = scoreTriage(data);
  for (const r of triage.firedRules) firedRules.push(r);

  const recommendation = deriveRecommendation(
    appr.band,
    window.fit,
    completeness.percent,
    triage.tier
  );

  const flags = detectFlags(data, {
    windowFit: window.fit,
    recommendedScanType: window.recommendedScanType
  });

  return {
    appropriatenessScore: appr.score,
    appropriatenessBand: appr.band,
    windowFit: window.fit,
    recommendedScanType: window.recommendedScanType,
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
