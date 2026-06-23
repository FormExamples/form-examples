// Four-axis grader for the Nuclear Medicine Test Request.
//
// Composes the rule sets in rules.js and the safety flags in flags.js into a
// single pure, deterministic grading result. The public entry point is
// `calculateGrade(data)`. The output shape and rule / flag IDs are identical
// across every front-end and the back-end.
//
// Wrapped in an IIFE; published via `window.NuclearMedicineTestRequest`.

(function () {
'use strict';
window.NuclearMedicineTestRequest =
  window.NuclearMedicineTestRequest || {};
const NS = window.NuclearMedicineTestRequest;
const {
  scoreAppropriateness,
  radiationDoseBand,
  scorePrepSafety,
  scoreCompleteness,
  scoreTriage,
  detectFlags
} = NS;

/**
 * Derive an overall recommendation for the imaging vetting desk from the four
 * axes. Least-alarming wins only when nothing escalates.
 */
function deriveRecommendation(appropriatenessBand, prepSafetyBand, completenessPercent) {
  if (prepSafetyBand === 'contraindicated') return 'reject';
  if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
  if (completenessPercent < 50) return 'query-referrer';
  if (prepSafetyBand === 'caution') return 'redirect';
  return 'accept';
}

const RECOMMENDATION_LABELS = {
  'accept': 'Accept and book',
  'query-referrer': 'Query the referrer',
  'redirect': 'Accept with safety caution',
  'reject': 'Reject'
};

/**
 * Public entry point. Pure and deterministic.
 *
 * @param {object} data - the request data model from emptyRequest()
 * @returns {{
 *   appropriatenessScore:number,
 *   appropriatenessBand:string,
 *   prepSafetyBand:string,
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
    data.request.scanType
  );
  if (appr.firedRule) firedRules.push(appr.firedRule);

  // Axis B — radiation dose + preparation / radiation safety.
  const dose = radiationDoseBand(data.request.scanType);
  if (dose.firedRule) firedRules.push(dose.firedRule);
  const prep = scorePrepSafety(data, dose.band);
  for (const r of prep.firedRules) firedRules.push(r);

  // Axis C — completeness.
  const completeness = scoreCompleteness(data);
  for (const m of completeness.missing) firedRules.push(m);

  // Axis D — triage.
  const triage = scoreTriage(data);
  for (const r of triage.firedRules) firedRules.push(r);

  const recommendation = deriveRecommendation(
    appr.band,
    prep.band,
    completeness.percent
  );

  const flags = detectFlags(data, {
    radiationDoseBand: dose.band
  });

  return {
    appropriatenessScore: appr.score,
    appropriatenessBand: appr.band,
    prepSafetyBand: prep.band,
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

Object.assign(NS, {
  calculateGrade,
  deriveRecommendation,
  RECOMMENDATION_LABELS
});
})();
