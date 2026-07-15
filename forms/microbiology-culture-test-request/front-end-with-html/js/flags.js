import { anyTestSelected } from './types.js';

// Safety-flag detection for the Microbiology Culture Test Request engine.
//
// Pure function returning safety flags using the grade_flag categories from
// SQL migration 07: suspected-sepsis-stat, blood-culture-before-antibiotics,
// specimen-not-collected, missing-clinical-details, missing-indication,
// no-test-selected, other.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.
// Flag IDs are stable and identical across every front-end and the back-end.
// Wrapped in an IIFE; published via `window.MicrobiologyCultureTestRequest`.

/**
 * Detect safety flags for a microbiology culture request.
 *
 * @param {object} data - the request data model
 * @returns {object[]} safety flags
 */
function detectFlags(data) {
  const flags = [];

  // --- Suspected sepsis: process as stat (NICE NG51) ------------------
  if (data.clinical.primaryIndication === 'suspected-sepsis') {
    flags.push({
      flagId: 'F-SUSPECTED-SEPSIS-STAT-001',
      category: 'suspected-sepsis-stat',
      priority: 'high',
      description: 'Suspected sepsis — this request must be processed as stat.',
      suggestedAction: 'Escalate to the on-call microbiologist; take blood cultures and give broad-spectrum antibiotics within the hour (NICE NG51).'
    });
  }

  // --- Blood culture taken while / after antibiotics started ----------
  if (
    data.specimen.specimenType === 'blood-culture' &&
    data.clinical.currentAntibiotics === true
  ) {
    flags.push({
      flagId: 'F-BLOOD-CULTURE-BEFORE-ANTIBIOTICS-001',
      category: 'blood-culture-before-antibiotics',
      priority: 'high',
      description: 'Blood culture requested while the patient is on antibiotics.',
      suggestedAction: 'Cultures should be taken before the first antibiotic dose; flag reduced yield to the requester.'
    });
  }

  // --- Specimen not collected -----------------------------------------
  if (data.specimen.specimenCollected === 'no') {
    flags.push({
      flagId: 'F-SPECIMEN-NOT-COLLECTED-001',
      category: 'specimen-not-collected',
      priority: 'high',
      description: 'Request submitted but no specimen has been collected.',
      suggestedAction: 'Collect and label the specimen before the laboratory can accept the request.'
    });
  }

  // --- No test selected -----------------------------------------------
  if (!anyTestSelected(data.tests)) {
    flags.push({
      flagId: 'F-NO-TEST-SELECTED-001',
      category: 'no-test-selected',
      priority: 'high',
      description: 'No microbiology test has been selected on the request.',
      suggestedAction: 'Select at least one test (culture & sensitivity is the most common) before submitting.'
    });
  }

  // --- Missing clinical details (highest-value field) -----------------
  if (!data.clinical.clinicalDetails || data.clinical.clinicalDetails.trim() === '') {
    flags.push({
      flagId: 'F-MISSING-CLINICAL-DETAILS-001',
      category: 'missing-clinical-details',
      priority: 'medium',
      description: 'No clinical details recorded — the highest-value field for laboratory interpretation.',
      suggestedAction: 'Query the referrer for the clinical details before vetting.'
    });
  }

  // --- Missing indication ---------------------------------------------
  if (!data.clinical.primaryIndication) {
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

export { detectFlags };
