import { countSelectedAssays } from './types.js';

// Safety-flag detection for the Toxicology Test Request engine.
//
// Pure function returning safety flags using the grade_flag categories from
// SQL migration 07: suspected-overdose-stat, paracetamol-timing-critical,
// deliberate-self-harm-safeguarding, specimen-not-collected,
// missing-clinical-details, no-test-selected, other.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.
// Flag IDs are stable and identical across every front-end and the back-end.

/**
 * Detect safety flags for a toxicology request.
 *
 * @param {object} data - the request data model
 * @param {object} [context] - optional engine context ({ timingBand })
 * @returns {object[]} safety flags
 */
function detectFlags(data, context) {
  const flags = [];
  const ctx = context || {};

  // --- No assay selected ---------------------------------------------
  if (countSelectedAssays(data.assays) === 0) {
    flags.push({
      flagId: 'F-NO-TEST-SELECTED-001',
      category: 'no-test-selected',
      priority: 'high',
      description: 'No assay has been selected.',
      suggestedAction: 'Select at least one assay before submitting; the request cannot be actioned otherwise.'
    });
  }

  // --- Deliberate overdose / suspected overdose escalation -----------
  if (
    data.clinical.deliberateOverdose === true ||
    data.clinical.primaryIndication === 'suspected-overdose'
  ) {
    flags.push({
      flagId: 'F-SUSPECTED-OVERDOSE-STAT-001',
      category: 'suspected-overdose-stat',
      priority: 'high',
      description: 'Overdose context requiring stat handling.',
      suggestedAction: 'Process stat; contact NPIS / TOXBASE (0344 892 0111) and the toxicology team.'
    });
  }

  // --- Paracetamol timing critical -----------------------------------
  if (data.assays.paracetamolLevel === true && ctx.timingBand === 'invalid') {
    flags.push({
      flagId: 'F-PARACETAMOL-TIMING-CRITICAL-001',
      category: 'paracetamol-timing-critical',
      priority: 'high',
      description: 'Paracetamol level requested but the sampling time is invalid (< 4 h post-ingestion) for nomogram interpretation.',
      suggestedAction: 'Repeat the paracetamol level at >= 4 h post-ingestion; do not interpret early levels on the nomogram.'
    });
  }

  // --- Deliberate self-harm / safeguarding ---------------------------
  if (
    data.clinical.deliberateOverdose === true ||
    data.clinical.primaryIndication === 'deliberate-self-harm'
  ) {
    flags.push({
      flagId: 'F-DELIBERATE-SELF-HARM-SAFEGUARDING-001',
      category: 'deliberate-self-harm-safeguarding',
      priority: 'high',
      description: 'Deliberate overdose / self-harm; requires psychosocial / safeguarding assessment.',
      suggestedAction: 'Arrange a psychosocial assessment by mental-health services while the patient is in hospital; consider safeguarding.'
    });
  }

  // --- Specimen not collected ----------------------------------------
  if (data.specimen.specimenCollected === 'no') {
    flags.push({
      flagId: 'F-SPECIMEN-NOT-COLLECTED-001',
      category: 'specimen-not-collected',
      priority: 'medium',
      description: 'Request submitted with no specimen collected.',
      suggestedAction: 'Collect the specimen and record the collection time before sending to the laboratory.'
    });
  }

  // --- Missing clinical details --------------------------------------
  if (!data.clinical.clinicalDetails || data.clinical.clinicalDetails.trim() === '') {
    flags.push({
      flagId: 'F-MISSING-CLINICAL-DETAILS-001',
      category: 'missing-clinical-details',
      priority: 'medium',
      description: 'No clinical details / history recorded.',
      suggestedAction: 'Query the referrer for the clinical details before vetting.'
    });
  }

  return flags;
}

export { detectFlags };
