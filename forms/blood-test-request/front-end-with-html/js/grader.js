import { detectFlags } from './flags.js';
import { scoreAppropriateness, scoreCompleteness, scorePreanalytical, scoreTriage } from './rules.js';
import { countSelectedPanels } from './types.js';

// Four-axis grader for the Blood Test Request.
//
// Composes the rule sets in rules.js and the safety flags in flags.js into a
// single pure, deterministic grading result. The public entry point is
// `calculateGrade(data)`. The output shape and rule / flag IDs are identical
// across every front-end and the back-end.
//
// Wrapped in an IIFE; published via `window.BloodTestRequest`.

/**
 * Derive an overall recommendation for the laboratory vetting desk from the
 * four axes. Least-alarming wins only when nothing escalates.
 */
function deriveRecommendation(apprBand, preanalyticalBand, completenessPercent, selectedCount) {
  if (selectedCount === 0) return 'reject';
  if (apprBand === 'usually-not-appropriate') return 'query-referrer';
  if (preanalyticalBand === 'reject-risk') return 'query-referrer';
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
 *   preanalyticalBand:string,
 *   fastingViolation:boolean,
 *   completenessPercent:number,
 *   triageTier:string,
 *   targetTimeframe:string,
 *   testsSelectedCount:number,
 *   recommendation:string,
 *   recommendationLabel:string,
 *   firedRules:object[],
 *   flags:object[]
 * }}
 */
function calculateGrade(data) {
  const firedRules = [];

  // Axis A — appropriateness.
  const appr = scoreAppropriateness(data.clinical.primaryIndication, data.panels);
  if (appr.firedRule) firedRules.push(appr.firedRule);

  // Axis B — pre-analytical / specimen safety.
  const pre = scorePreanalytical(data);
  for (const r of pre.firedRules) firedRules.push(r);

  // Axis C — completeness.
  const completeness = scoreCompleteness(data);
  for (const m of completeness.missing) firedRules.push(m);

  // Axis D — triage.
  const triage = scoreTriage(data);
  for (const r of triage.firedRules) firedRules.push(r);

  const testsSelectedCount = countSelectedPanels(data.panels);

  const recommendation = deriveRecommendation(
    appr.band,
    pre.band,
    completeness.percent,
    testsSelectedCount
  );

  const flags = detectFlags(data, {
    fastingViolation: pre.fastingViolation,
    preanalyticalBand: pre.band,
    triageTier: triage.tier
  });

  return {
    appropriatenessScore: appr.score,
    appropriatenessBand: appr.band,
    preanalyticalBand: pre.band,
    fastingViolation: pre.fastingViolation,
    completenessPercent: completeness.percent,
    triageTier: triage.tier,
    targetTimeframe: triage.targetTimeframe,
    testsSelectedCount,
    recommendation,
    recommendationLabel: RECOMMENDATION_LABELS[recommendation] || recommendation,
    firedRules,
    flags
  };
}

export { calculateGrade, deriveRecommendation, RECOMMENDATION_LABELS };
