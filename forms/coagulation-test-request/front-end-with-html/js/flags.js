// Safety-flag detection for the Coagulation Test Request engine.
//
// Pure function returning safety flags using the grade_flag categories from
// sql/07: active-bleeding-stat, suspected-dic, d-dimer-low-pretest-caution,
// specimen-underfilled-risk, missing-clinical-details, no-test-selected, other.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.
// Flag IDs are stable and identical across every front-end and the back-end.
// Wrapped in an IIFE; published via `window.CoagulationTestRequest`.

(function () {
'use strict';
window.CoagulationTestRequest = window.CoagulationTestRequest || {};
const NS = window.CoagulationTestRequest;
const { countSelectedTests } = NS;

/**
 * Detect safety flags for a coagulation test request.
 *
 * @param {object} data - the request data model
 * @param {object} [context] - optional engine context ({ preanalyticalBand })
 * @returns {object[]} safety flags
 */
function detectFlags(data, context) {
  const flags = [];
  const ctx = context || {};

  // --- Active major bleeding -> STAT ---------------------------------
  if (data.clinical.activeBleeding === true) {
    flags.push({
      flagId: 'F-ACTIVE-BLEEDING-001',
      category: 'active-bleeding-stat',
      priority: 'high',
      description: 'Active major bleeding reported.',
      suggestedAction: 'Discuss with the on-call haematologist; process as STAT and consider fibrinogen / major-haemorrhage pathway.'
    });
  }

  // --- Suspected DIC --------------------------------------------------
  if (
    data.clinical.suspectedDic === true ||
    data.clinical.primaryIndication === 'disseminated-intravascular-coagulation'
  ) {
    flags.push({
      flagId: 'F-SUSPECTED-DIC-001',
      category: 'suspected-dic',
      priority: 'high',
      description: 'Disseminated intravascular coagulation is suspected.',
      suggestedAction: 'Process PT, APTT, fibrinogen, and D-dimer as STAT; alert the haematology team and treat the underlying cause.'
    });
  }

  // --- D-dimer without an unlikely-Wells pre-test probability --------
  if (
    data.tests.dDimer === true &&
    data.clinical.primaryIndication === 'suspected-dvt-pe' &&
    data.clinical.wellsUnlikely !== true
  ) {
    flags.push({
      flagId: 'F-D-DIMER-PRETEST-001',
      category: 'd-dimer-low-pretest-caution',
      priority: 'medium',
      description: 'D-dimer ordered for suspected DVT / PE without an "unlikely" 2-level Wells pre-test probability.',
      suggestedAction: 'Confirm a 2-level Wells "unlikely" score before D-dimer (NICE NG158); a likely score warrants imaging instead.'
    });
  }

  // --- Citrate tube under-filled / wrong ratio -----------------------
  if (
    ctx.preanalyticalBand === 'reject-risk' ||
    data.specimen.citrateTubeFill === 'underfilled' ||
    data.specimen.citrateTubeFill === 'overfilled' ||
    data.specimen.citrateRatioCorrect === 'no'
  ) {
    flags.push({
      flagId: 'F-SPECIMEN-UNDERFILLED-001',
      category: 'specimen-underfilled-risk',
      priority: 'medium',
      description: 'Sodium-citrate tube under-filled / over-filled or 9:1 ratio incorrect.',
      suggestedAction: 'Reject and recollect; coagulation results from a mis-filled citrate tube are unreliable.'
    });
  }

  // --- Missing indication / clinical details -------------------------
  if (
    !data.clinical.primaryIndication ||
    !data.clinical.clinicalDetails ||
    data.clinical.clinicalDetails.trim() === ''
  ) {
    flags.push({
      flagId: 'F-MISSING-CLINICAL-DETAILS-001',
      category: 'missing-clinical-details',
      priority: 'medium',
      description: 'No primary indication or clinical details recorded.',
      suggestedAction: 'Query the referrer for the indication and clinical details before vetting.'
    });
  }

  // --- No test selected ----------------------------------------------
  if (countSelectedTests(data.tests) === 0) {
    flags.push({
      flagId: 'F-NO-TEST-SELECTED-001',
      category: 'no-test-selected',
      priority: 'high',
      description: 'No coagulation test has been selected on the request.',
      suggestedAction: 'Select at least one coagulation test, or cancel the request.'
    });
  }

  return flags;
}

Object.assign(NS, { detectFlags });
})();
