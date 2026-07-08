// Flagged-issue detection. Surfaces information-governance-officer-facing
// flags about the acknowledgement state, opt-out preferences, name
// plausibility, and missing recipient metadata. Ported 1:1 from
// `src/lib/engine/flagged-issues.ts`.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').AdditionalFlag} AdditionalFlag
 */

// Wrapped in an IIFE; published via window.ResearchAndPlanningPrivacyNotice.
(function () {
'use strict';
window.ResearchAndPlanningPrivacyNotice = window.ResearchAndPlanningPrivacyNotice || {};

/**
 * Detects additional flags that should be highlighted for the
 * information-governance officer.
 * @param {AssessmentData} data
 * @returns {AdditionalFlag[]}
 */
function detectAdditionalFlags(data) {
  /** @type {AdditionalFlag[]} */
  const flags = [];
  const ack = data.acknowledgementSignature;

  // ─── Acknowledgement not given ────────────────────────
  if (ack.agreed === false) {
    flags.push({
      id: 'FLAG-NOACK-001',
      category: 'Acknowledgement Not Given',
      message: 'Recipient has not acknowledged the research and planning privacy notice',
      priority: 'high'
    });
  }

  // ─── Type 1 opt-out elected ───────────────────────────
  if (ack.type1OptOut === 'opt-out') {
    flags.push({
      id: 'FLAG-TYPE1-OPTOUT-001',
      category: 'Type 1 Opt-Out',
      message: 'Recipient has elected Type 1 opt-out — confidential patient information must not be shared from this practice for purposes beyond direct care',
      priority: 'high'
    });
  }

  // ─── National Data Opt-Out elected ────────────────────
  if (ack.nationalDataOptOut === 'opt-out') {
    flags.push({
      id: 'FLAG-NATIONAL-OPTOUT-001',
      category: 'National Data Opt-Out',
      message: 'Recipient has elected the NHS National Data Opt-Out — data must not be used for research and planning across the wider NHS',
      priority: 'high'
    });
  }

  // ─── Name looks incomplete ────────────────────────────
  const name = ack.recipientTypedFullName.trim();
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

window.ResearchAndPlanningPrivacyNotice.detectAdditionalFlags = detectAdditionalFlags;
})();
