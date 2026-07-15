// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Code of Conduct Notice form.
//
// This file builds the canonical empty AssessmentData shape used by the
// wizard, so that newly-added fields automatically default correctly when
// older saved state is rehydrated from localStorage. It also publishes a
// few presentation helpers (status labels and CSS class hints).

/**
 * @typedef {Object} RecipientDetails
 * @property {string} organisationName
 * @property {string} recipientName
 * @property {string} recipientRole
 * @property {string} recipientEmployeeId
 */

/**
 * @typedef {Object} AcknowledgementSignature
 * @property {boolean} agreed
 * @property {string} recipientTypedFullName
 * @property {string} recipientTypedDate
 */

/**
 * @typedef {Object} AssessmentData
 * @property {RecipientDetails} recipientDetails
 * @property {AcknowledgementSignature} acknowledgementSignature
 */

/**
 * @typedef {Object} ValidationRule
 * @property {string} id
 * @property {string} section
 * @property {string} field
 * @property {string} message
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} section
 * @property {string} description
 * @property {string} field
 */

/**
 * @typedef {Object} AdditionalFlag
 * @property {string} id
 * @property {string} category
 * @property {string} message
 * @property {'high' | 'medium' | 'low'} priority
 */

/**
 * @typedef {'Complete' | 'Incomplete'} ValidationStatus
 */

/**
 * @typedef {Object} GradingResult
 * @property {number} completenessPercent
 * @property {ValidationStatus} status
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; the `agreed` boolean defaults to `false`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    recipientDetails: {
      organisationName: '',
      recipientName: '',
      recipientRole: '',
      recipientEmployeeId: ''
    },
    acknowledgementSignature: {
      agreed: false,
      recipientTypedFullName: '',
      recipientTypedDate: ''
    }
  };
}

/**
 * Calculate completeness percentage. Mirrors `utils.ts` `completenessPercent`.
 * @param {number} completed
 * @param {number} total
 * @returns {number}
 */
function completenessPercent(completed, total) {
  if (total === 0) return 100;
  return Math.round((completed / total) * 100);
}

/**
 * Get validation status label from completeness percentage. Mirrors
 * `utils.ts` `validationStatus`.
 * @param {number} completeness
 * @returns {ValidationStatus}
 */
function validationStatus(completeness) {
  return completeness === 100 ? 'Complete' : 'Incomplete';
}

/**
 * Completeness label for display.
 * @param {number} completeness
 * @returns {string}
 */
function completenessLabel(completeness) {
  return `${completeness}% Complete`;
}

/**
 * Effective acknowledgement status for badge display:
 *   - `acknowledged` — all required fields filled and `agreed` is true
 *   - `declined`     — required fields filled but `agreed` is explicitly false
 *   - `incomplete`   — anything else (some required fields missing)
 *
 * @typedef {'acknowledged' | 'declined' | 'incomplete'} AcknowledgementStatus
 *
 * @param {ValidationStatus} status
 * @param {AssessmentData} data
 * @returns {AcknowledgementStatus}
 */
function acknowledgementStatus(status, data) {
  if (status === 'Complete' && data.acknowledgementSignature.agreed === true) {
    return 'acknowledged';
  }
  // Declined: the recipient typed their name AND date but un-checked the box.
  const ack = data.acknowledgementSignature;
  if (
    ack.agreed === false &&
    ack.recipientTypedFullName.trim() !== '' &&
    ack.recipientTypedDate.trim() !== ''
  ) {
    return 'declined';
  }
  return 'incomplete';
}

/**
 * Friendly label for an AcknowledgementStatus.
 * @param {AcknowledgementStatus} s
 * @returns {string}
 */
function acknowledgementStatusLabel(s) {
  switch (s) {
    case 'acknowledged': return 'Acknowledged';
    case 'declined':     return 'Declined';
    case 'incomplete':   return 'Incomplete';
    default:             return '';
  }
}

/**
 * CSS class hint for the acknowledgement-status badge.
 * @param {AcknowledgementStatus} s
 * @returns {string}
 */
function acknowledgementStatusClass(s) {
  switch (s) {
    case 'acknowledged': return 'status-acknowledged';
    case 'declined':     return 'status-declined';
    case 'incomplete':   return 'status-incomplete';
    default:             return '';
  }
}

export { emptyAssessment, completenessPercent, validationStatus, completenessLabel, acknowledgementStatus, acknowledgementStatusLabel, acknowledgementStatusClass };
