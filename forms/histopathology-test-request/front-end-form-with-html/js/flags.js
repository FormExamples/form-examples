// Safety-flag detection for the Histopathology Test Request engine.
//
// Pure function returning safety flags using the grade_flag categories from
// SQL migration 07: suspected-cancer-2ww, frozen-section-urgent,
// specimen-fixation-issue, mislabel-risk, missing-clinical-details,
// missing-indication, other.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.
// Flag IDs are stable and identical across every front-end and the back-end.
// Wrapped in an IIFE; published via `window.HistopathologyTestRequest`.

(function () {
'use strict';
window.HistopathologyTestRequest =
  window.HistopathologyTestRequest || {};
const NS = window.HistopathologyTestRequest;

/**
 * Detect safety flags for a histopathology test request.
 *
 * @param {object} data - the request data model
 * @param {object} [context] - optional engine context ({ specimenQualityBand })
 * @returns {object[]} safety flags
 */
function detectFlags(data, context) {
  const flags = [];
  const ctx = context || {};

  // --- Urgency red flags ---------------------------------------------
  if (
    data.urgency.urgentFrozenSection === true ||
    data.specimen.specimenType === 'frozen-section'
  ) {
    flags.push({
      flagId: 'F-FROZEN-SECTION-URGENT-001',
      category: 'frozen-section-urgent',
      priority: 'high',
      description: 'Intra-operative urgent frozen section requested.',
      suggestedAction: 'Alert the on-call pathologist immediately; the patient is in theatre awaiting an immediate diagnosis.'
    });
  }
  if (
    data.urgency.twoWeekWait === true ||
    data.indication.primaryIndication === 'suspected-malignancy'
  ) {
    flags.push({
      flagId: 'F-SUSPECTED-CANCER-2WW-001',
      category: 'suspected-cancer-2ww',
      priority: 'high',
      description: 'Suspected-cancer two-week-wait pathway request.',
      suggestedAction: 'Expedite accessioning and reporting on the suspected-cancer (NICE NG12) pathway.'
    });
  }

  // --- Specimen quality concerns -------------------------------------
  if (ctx.specimenQualityBand === 'reject-risk') {
    flags.push({
      flagId: 'F-SPECIMEN-FIXATION-ISSUE-001',
      category: 'specimen-fixation-issue',
      priority: 'high',
      description: 'Specimen fixation is inadequate (fresh / unfixed outside a frozen-section pathway, or no fixative recorded).',
      suggestedAction: 'Contact the requester urgently; the specimen may be unfit for diagnosis without prompt fixation.'
    });
  } else if (data.specimen.fixative === 'other') {
    flags.push({
      flagId: 'F-SPECIMEN-FIXATION-ISSUE-002',
      category: 'specimen-fixation-issue',
      priority: 'medium',
      description: 'Fixative recorded as "other"; suitability for histology not confirmed.',
      suggestedAction: 'Confirm the fixative used is appropriate for histological processing.'
    });
  }
  if (data.specimen.specimenType && data.specimen.specimenLabelled !== true) {
    flags.push({
      flagId: 'F-MISLABEL-RISK-001',
      category: 'mislabel-risk',
      priority: 'medium',
      description: 'Specimen container labelling not confirmed.',
      suggestedAction: 'Verify the specimen container is labelled with patient identifiers matching the request before accessioning.'
    });
  }

  // --- Completeness / data-quality flags -----------------------------
  if (!data.indication.primaryIndication) {
    flags.push({
      flagId: 'F-MISSING-INDICATION-001',
      category: 'missing-indication',
      priority: 'medium',
      description: 'No primary clinical indication recorded.',
      suggestedAction: 'Query the referrer for the clinical indication before vetting.'
    });
  }
  if (!data.indication.clinicalDetails || data.indication.clinicalDetails.trim() === '') {
    flags.push({
      flagId: 'F-MISSING-CLINICAL-DETAILS-001',
      category: 'missing-clinical-details',
      priority: 'medium',
      description: 'No relevant clinical details recorded for the pathologist.',
      suggestedAction: 'Query the referrer for relevant clinical history and context.'
    });
  }
  if (!data.indication.clinicalQuestion || data.indication.clinicalQuestion.trim() === '') {
    flags.push({
      flagId: 'F-MISSING-CLINICAL-DETAILS-002',
      category: 'missing-clinical-details',
      priority: 'low',
      description: 'No specific clinical question recorded.',
      suggestedAction: 'Query the referrer for the specific question the report should answer.'
    });
  }

  return flags;
}

Object.assign(NS, { detectFlags });
})();
