import { detectFlags } from './flags.js';
import { scoreAppropriateness, scoreCompleteness, scoreContrastRenal, scoreSafety, scoreTriage } from './rules.js';

// Four-axis grader for the MRI Scan Test Request.
//
// Composes the rule sets in rules.js and the safety flags in flags.js into a
// single pure, deterministic grading result. The public entry point is
// `calculateGrade(data)`. The output shape and rule / flag IDs are identical
// across every front-end and the back-end, and map onto the columns of SQL
// migration 05 (appropriatenessScore / appropriatenessBand, mriSafetyBand,
// contrastRenalFlag, completenessPercent, triageTier / targetTimeframe,
// recommendation).

/**
 * Derive an overall recommendation for the imaging vetting desk from the four
 * axes. Least-alarming wins only when nothing escalates.
 */
function deriveRecommendation(apprBand, mriSafetyBand, contrastRenalFlag, completenessPercent) {
  if (mriSafetyBand === 'contraindicated') return 'reject';
  if (contrastRenalFlag === 'contraindicated') return 'redirect';
  if (mriSafetyBand === 'needs-mri-physics-review') return 'query-referrer';
  if (apprBand === 'usually-not-appropriate') return 'query-referrer';
  if (completenessPercent < 50) return 'query-referrer';
  return 'accept';
}

const RECOMMENDATION_LABELS = {
  'accept': 'Accept and book',
  'query-referrer': 'Query the referrer',
  'redirect': 'Redirect / modify protocol',
  'reject': 'Reject'
};

/**
 * Public entry point. Pure and deterministic.
 *
 * @param {object} data - the request data model from emptyRequest()
 * @returns {{
 *   appropriatenessScore:number,
 *   appropriatenessBand:string,
 *   mriSafetyBand:string,
 *   contrastRenalFlag:string,
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

  // Axis B — MRI safety + contrast-renal.
  const safety = scoreSafety(data);
  for (const r of safety.firedRules) firedRules.push(r);
  const contrastRenal = scoreContrastRenal(data);
  if (contrastRenal.firedRule) firedRules.push(contrastRenal.firedRule);

  // Axis C — completeness.
  const completeness = scoreCompleteness(data);
  for (const m of completeness.missing) firedRules.push(m);

  // Axis D — triage.
  const triage = scoreTriage(data);
  for (const r of triage.firedRules) firedRules.push(r);

  const recommendation = deriveRecommendation(
    appr.band,
    safety.band,
    contrastRenal.flag,
    completeness.percent
  );

  const flags = detectFlags(data, {
    contrastRenalFlag: contrastRenal.flag
  });

  return {
    appropriatenessScore: appr.score,
    appropriatenessBand: appr.band,
    mriSafetyBand: safety.band,
    contrastRenalFlag: contrastRenal.flag,
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
