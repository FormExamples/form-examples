// Safety-flag detection for the Cytology Test Request engine.
//
// Pure function returning safety flags using the grade_flag categories from
// SQL migration 07: suspected-cancer-2ww, previous-high-grade-cytology,
// specimen-not-collected, missing-clinical-details, missing-indication, other.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.
// Flag IDs are stable and identical across every front-end and the back-end.
// Wrapped in an IIFE; published via `window.CytologyTestRequest`.

(function () {
'use strict';
window.CytologyTestRequest =
  window.CytologyTestRequest || {};
const NS = window.CytologyTestRequest;

/**
 * Detect safety flags for a cytology specimen request.
 *
 * @param {object} data - the request data model
 * @param {object} [context] - optional engine context ({ preanalyticalBand })
 * @returns {object[]} safety flags
 */
function detectFlags(data, context) {
  const flags = [];
  const ctx = context || {};

  // --- Suspected-cancer two-week-wait ---------------------------------
  if (
    data.request.primaryIndication === 'suspected-malignancy' ||
    data.request.primaryIndication === 'breast-lump'
  ) {
    flags.push({
      flagId: 'F-SUSPECTED-CANCER-2WW-001',
      category: 'suspected-cancer-2ww',
      priority: 'high',
      description: 'Suspected-cancer indication recorded.',
      suggestedAction: 'Route on the NICE NG12 two-week-wait suspected-cancer pathway; do not delay for routine booking.'
    });
  }

  // --- Previous high-grade cytology -----------------------------------
  if (data.context.previousAbnormalCytology === 'high-grade') {
    flags.push({
      flagId: 'F-PREVIOUS-HIGH-GRADE-CYTOLOGY-001',
      category: 'previous-high-grade-cytology',
      priority: 'high',
      description: 'Previous high-grade abnormal cytology recorded.',
      suggestedAction: 'Expedite to colposcopy / two-week-wait pathway; ensure prior results are reviewed.'
    });
  }

  // --- Specimen not collected -----------------------------------------
  if (data.collection.specimenCollected === 'no') {
    flags.push({
      flagId: 'F-SPECIMEN-NOT-COLLECTED-001',
      category: 'specimen-not-collected',
      priority: 'medium',
      description: 'Specimen has not yet been collected.',
      suggestedAction: 'Arrange specimen collection before laboratory processing; confirm fixation and labelling.'
    });
  }

  // --- Completeness / data-quality flags ------------------------------
  if (!data.request.primaryIndication) {
    flags.push({
      flagId: 'F-MISSING-INDICATION-001',
      category: 'missing-indication',
      priority: 'medium',
      description: 'No primary clinical indication recorded.',
      suggestedAction: 'Query the referrer for the clinical indication before vetting.'
    });
  }
  if (!data.request.clinicalDetails || data.request.clinicalDetails.trim() === '') {
    flags.push({
      flagId: 'F-MISSING-CLINICAL-DETAILS-001',
      category: 'missing-clinical-details',
      priority: 'low',
      description: 'No relevant clinical details recorded for the reporting cytologist.',
      suggestedAction: 'Provide relevant history and findings to support accurate cytological interpretation.'
    });
  }

  return flags;
}

Object.assign(NS, { detectFlags });
})();
