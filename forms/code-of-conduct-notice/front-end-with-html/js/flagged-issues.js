// Flagged-issue detection. Surfaces clinician/compliance-officer-facing
// flags about the acknowledgement state, name plausibility, and missing
// recipient metadata. Ported 1:1 from `src/lib/engine/flagged-issues.ts`.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').AdditionalFlag} AdditionalFlag
 */

// Wrapped in an IIFE; published via window.CodeOfConductNotice.
(function () {
'use strict';
window.CodeOfConductNotice = window.CodeOfConductNotice || {};

/**
 * Detects additional flags that should be highlighted for the compliance officer.
 * @param {AssessmentData} data
 * @returns {AdditionalFlag[]}
 */
function detectAdditionalFlags(data) {
  /** @type {AdditionalFlag[]} */
  const flags = [];

  // ─── Acknowledgement not given ────────────────────────
  if (data.acknowledgementSignature.agreed === false) {
    flags.push({
      id: 'FLAG-NOACK-001',
      category: 'Acknowledgement Not Given',
      message: 'Recipient has not acknowledged the code of conduct',
      priority: 'high'
    });
  }

  // ─── Name looks incomplete ────────────────────────────
  const name = data.acknowledgementSignature.recipientTypedFullName.trim();
  if (name.length > 0 && name.length < 3) {
    flags.push({
      id: 'FLAG-NAME-001',
      category: 'Incomplete Name',
      message: 'Recipient typed name appears incomplete — please verify',
      priority: 'medium'
    });
  }

  // ─── Missing recipient metadata ───────────────────────
  const rd = data.recipientDetails;
  /** @type {string[]} */
  const missingFields = [];
  if (!rd.organisationName.trim()) missingFields.push('organisation name');
  if (!rd.recipientName.trim()) missingFields.push('recipient name');
  if (!rd.recipientRole.trim()) missingFields.push('recipient role');

  if (missingFields.length > 0) {
    flags.push({
      id: 'FLAG-CONFIG-001',
      category: 'Incomplete Recipient Details',
      message: `Recipient details are missing: ${missingFields.join(', ')}`,
      priority: 'high'
    });
  }

  // Sort: high > medium > low
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

window.CodeOfConductNotice.detectAdditionalFlags = detectAdditionalFlags;
})();
