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
 * @returns {object[]} safety flags
 */
function detectFlags(data) {
  const flags = [];

  // --- Red-flag clinical categories ----------------------------------
  if (data.symptoms.visibleHaematuria === true) {
    flags.push({
      flagId: 'F-VISIBLE-HAEMATURIA-2WW-001',
      category: 'visible-haematuria-2ww',
      priority: 'high',
      description: 'Visible (macroscopic) haematuria reported.',
      suggestedAction: 'Consider NICE NG12 suspected-cancer (2-week-wait) referral — age ≥45 with unexplained visible haematuria.'
    });
  }
  if (data.symptoms.fever === true && data.symptoms.loinPain === true) {
    flags.push({
      flagId: 'F-SUSPECTED-PYELONEPHRITIS-001',
      category: 'suspected-pyelonephritis',
      priority: 'high',
      description: 'Fever with loin pain — possible upper-tract infection / pyelonephritis / urosepsis.',
      suggestedAction: 'Expedite assessment; send MSU for culture and treat per NICE NG109 pyelonephritis pathway.'
    });
  }

  // --- Pre-analytical / data-quality flags ---------------------------
  if (data.specimen.specimenCollected === 'no') {
    flags.push({
      flagId: 'F-SPECIMEN-NOT-COLLECTED-001',
      category: 'specimen-not-collected',
      priority: 'medium',
      description: 'Specimen not yet collected; the request cannot proceed at the bench.',
      suggestedAction: 'Collect an appropriate specimen and record the collection date-time before submitting to the laboratory.'
    });
  }
  if (countSelectedTests(data.tests) === 0) {
    flags.push({
      flagId: 'F-NO-TEST-SELECTED-001',
      category: 'no-test-selected',
      priority: 'medium',
      description: 'No test selected on the panel; there is nothing to order.',
      suggestedAction: 'Select at least one urine test before submitting the request.'
    });
  }
  if (!data.context.clinicalDetails || data.context.clinicalDetails.trim() === '') {
    flags.push({
      flagId: 'F-MISSING-CLINICAL-DETAILS-001',
      category: 'missing-clinical-details',
      priority: 'medium',
      description: 'No clinical details recorded (the highest-value field).',
      suggestedAction: 'Query the referrer for the relevant clinical details before vetting.'
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

  return flags;
}

Object.assign(NS, { detectFlags });
})();
