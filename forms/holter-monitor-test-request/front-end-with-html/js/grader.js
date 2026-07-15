import { detectFlags } from './flags.js';
import { adjustAppropriatenessForMatch, appropriatenessBand, evaluateFrequencyMatch, scoreAppropriateness, scoreCompleteness, scorePriority, scoreTriage } from './rules.js';

// Four-axis grader for the Holter Monitor Test Request.
//
// Composes the rule sets in rules.js and the safety flags in flags.js into a
// single pure, deterministic grading result. The public entry point is
// `calculateGrade(data)`. The output shape and rule / flag IDs are identical
// across every front-end and the back-end.
//
// Wrapped in an IIFE; published via `window.HolterMonitorTestRequest`.

/**
 * Derive an overall recommendation for the cardiac physiology vetting desk
 * from the four axes. Least-alarming wins only when nothing escalates.
 */
function deriveRecommendation(apprBand, matchFit, completenessPercent) {
  if (apprBand === 'usually-not-appropriate') return 'query-referrer';
  if (matchFit === 'mismatched') return 'redirect';
  if (completenessPercent < 50) return 'query-referrer';
  return 'accept';
}

const RECOMMENDATION_LABELS = {
  'accept': 'Accept and book',
  'query-referrer': 'Query the referrer',
  'redirect': 'Redirect to a more suitable monitor',
  'reject': 'Reject'
};

/**
 * Public entry point. Pure and deterministic.
 *
 * @param {object} data - the request data model from emptyRequest()
 * @returns {{
 *   appropriatenessScore:number,
 *   appropriatenessBand:string,
 *   matchFit:string,
 *   recommendedMonitor:string,
 *   triageTier:string,
 *   targetTimeframe:string,
 *   completenessPercent:number,
 *   priorityBand:string,
 *   recommendation:string,
 *   recommendationLabel:string,
 *   firedRules:object[],
 *   flags:object[]
 * }}
 */
function calculateGrade(data) {
  const firedRules = [];

  // Axis A.1 — raw appropriateness from indication x monitor type.
  const appr = scoreAppropriateness(
    data.request.primaryIndication,
    data.request.monitorType
  );
  if (appr.firedRule) firedRules.push(appr.firedRule);

  // Axis A.2 — symptom-frequency / monitor-duration match.
  const match = evaluateFrequencyMatch(
    data.symptoms.symptomFrequency,
    data.request.monitorType
  );
  if (match.firedRule) firedRules.push(match.firedRule);

  // Combine into a final appropriateness score + band.
  const appropriatenessScore = adjustAppropriatenessForMatch(appr.score, match.fit);
  const finalBand = appropriatenessBand(appropriatenessScore);

  // Axis B — urgency / triage.
  const triage = scoreTriage(data);
  for (const r of triage.firedRules) firedRules.push(r);

  // Axis C — completeness.
  const completeness = scoreCompleteness(data);
  for (const m of completeness.missing) firedRules.push(m);

  // Axis D — clinical priority.
  const priority = scorePriority(data);
  for (const r of priority.firedRules) firedRules.push(r);

  const recommendation = deriveRecommendation(
    finalBand,
    match.fit,
    completeness.percent
  );

  const flags = detectFlags(data, {
    matchFit: match.fit,
    recommendedMonitor: match.recommendedMonitor
  });

  return {
    appropriatenessScore,
    appropriatenessBand: finalBand,
    matchFit: match.fit,
    recommendedMonitor: match.recommendedMonitor,
    triageTier: triage.tier,
    targetTimeframe: triage.targetTimeframe,
    completenessPercent: completeness.percent,
    priorityBand: priority.band,
    recommendation,
    recommendationLabel: RECOMMENDATION_LABELS[recommendation] || recommendation,
    firedRules,
    flags
  };
}

export { calculateGrade, deriveRecommendation, RECOMMENDATION_LABELS };
