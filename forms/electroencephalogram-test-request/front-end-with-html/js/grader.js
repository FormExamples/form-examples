import { detectFlags } from './flags.js';
import { scoreAppropriateness, scoreCompleteness, scorePriority, scoreUrgency } from './rules.js';

// Four-axis grader for the Electroencephalogram (EEG) Test Request.
//
// Composes the rule sets in rules.js and the safety flags in flags.js into a
// single pure, deterministic grading result. The public entry point is
// `calculateGrade(data)`. The output shape and rule / flag IDs are identical
// across every front-end and the back-end.
//
// Wrapped in an IIFE; published via `window.ElectroencephalogramTestRequest`.

/**
 * Derive an overall recommendation for the neurophysiology vetting desk from
 * the four axes. Least-alarming wins only when nothing escalates.
 */
function deriveRecommendation(appropriatenessBand, completenessPercent, priorityBand, flags) {
  const usesEegToExclude = flags.some((f) => f.category === 'eeg-not-to-exclude-epilepsy');
  if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
  if (usesEegToExclude) return 'query-referrer';
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

  // Axis A — appropriateness.
  const appr = scoreAppropriateness(
    data.request.primaryIndication,
    data.request.eegType
  );
  if (appr.firedRule) firedRules.push(appr.firedRule);

  // Axis B — urgency.
  const urgency = scoreUrgency(data);
  for (const r of urgency.firedRules) firedRules.push(r);

  // Axis C — completeness.
  const completeness = scoreCompleteness(data);
  for (const m of completeness.missing) firedRules.push(m);

  // Axis D — clinical priority.
  const priority = scorePriority(data);
  for (const r of priority.firedRules) firedRules.push(r);

  const flags = detectFlags(data, {});

  const recommendation = deriveRecommendation(
    appr.band,
    completeness.percent,
    priority.band,
    flags
  );

  return {
    appropriatenessScore: appr.score,
    appropriatenessBand: appr.band,
    triageTier: urgency.tier,
    targetTimeframe: urgency.targetTimeframe,
    completenessPercent: completeness.percent,
    priorityBand: priority.band,
    recommendation,
    recommendationLabel: RECOMMENDATION_LABELS[recommendation] || recommendation,
    firedRules,
    flags
  };
}

export { calculateGrade, deriveRecommendation, RECOMMENDATION_LABELS };
