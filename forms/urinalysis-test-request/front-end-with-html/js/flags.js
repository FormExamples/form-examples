// Safety-flag detection for the Urinalysis Test Request engine.
//
// Pure function returning safety flags using the grade_flag categories from
// SQL migration 07: visible-haematuria-2ww, suspected-pyelonephritis,
// specimen-not-collected, missing-clinical-details, missing-indication,
// no-test-selected, other.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.
// Flag IDs are stable and identical across every front-end and the back-end.
// Wrapped in an IIFE; published via `window.UrinalysisTestRequest`.

(function () {
'use strict';
window.UrinalysisTestRequest = window.UrinalysisTestRequest || {};
const NS = window.UrinalysisTestRequest;
const { countSelectedTests } = NS;

/**
 * Detect safety flags for a urinalysis test request.
 *
 * @param {object} data - the request data model
 * @param {object} [context] - optional engine context
 * @returns {object[]} safety flags
 */
function detectFlags(data, context) {
  const flags = [];

  // --- Red-flag symptom categories -----------------------------------
  if (data.symptoms.symptomVisibleHaematuria === true) {
    flags.push({
      flagId: 'F-VISIBLE-HAEMATURIA-2WW-001',
      category: 'visible-haematuria-2ww',
      priority: 'high',
      description: 'Visible (macroscopic) haematuria reported.',
      suggestedAction: 'Consider NICE NG12 suspected-cancer (2-week-wait) bladder pathway, especially age ≥45 with unexplained visible haematuria.'
    });
  }
  if (data.symptoms.symptomFever === true && data.symptoms.symptomLoinPain === true) {
    flags.push({
      flagId: 'F-SUSPECTED-PYELONEPHRITIS-001',
      category: 'suspected-pyelonephritis',
      priority: 'high',
      description: 'Fever with loin pain — possible upper-tract infection (pyelonephritis) / urosepsis.',
      suggestedAction: 'Expedite MSU culture and clinical assessment; do not delay empirical treatment if systemically unwell.'
    });
  }

  // --- Specimen / preanalytical --------------------------------------
  if (data.specimen.specimenCollected === 'no') {
    flags.push({
      flagId: 'F-SPECIMEN-NOT-COLLECTED-001',
      category: 'specimen-not-collected',
      priority: 'medium',
      description: 'The specimen has not yet been collected.',
      suggestedAction: 'Collect an appropriate specimen (e.g. MSU) before the request can be processed; refrigerate or use boric acid if >4 h to lab.'
    });
  }

  // --- Completeness / data-quality flags -----------------------------
  if (countSelectedTests(data.tests) === 0) {
    flags.push({
      flagId: 'F-NO-TEST-SELECTED-001',
      category: 'no-test-selected',
      priority: 'high',
      description: 'No test has been selected on the panel.',
      suggestedAction: 'Select at least one urine test to order; there is nothing to process.'
    });
  }
  if (!data.context.primaryIndication) {
    flags.push({
      flagId: 'F-MISSING-INDICATION-001',
      category: 'missing-indication',
      priority: 'medium',
      description: 'No primary clinical indication recorded.',
      suggestedAction: 'Query the referrer for the clinical indication before vetting.'
    });
  }
  if (!data.context.clinicalDetails || data.context.clinicalDetails.trim() === '') {
    flags.push({
      flagId: 'F-MISSING-CLINICAL-DETAILS-001',
      category: 'missing-clinical-details',
      priority: 'low',
      description: 'No clinical details recorded (highest-value field).',
      suggestedAction: 'Add the relevant clinical details so the laboratory can interpret and triage the request.'
    });
  }

  return flags;
}

Object.assign(NS, { detectFlags });
})();
