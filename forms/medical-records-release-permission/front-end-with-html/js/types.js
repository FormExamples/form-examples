// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Medical Records Release
// Permission form.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.

/**
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'continuing-care' | 'second-opinion' | 'insurance' | 'legal' |
 *           'personal' | 'research' | 'employment' | 'other' | ''} ReleasePurpose
 */

/**
 * @typedef {Object} PatientInformation
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {Sex} sex
 * @property {string} address
 * @property {string} phone
 * @property {string} email
 * @property {string} nhsNumber
 * @property {string} gpName
 * @property {string} gpPractice
 */

/**
 * @typedef {Object} AuthorizedRecipient
 * @property {string} recipientName
 * @property {string} recipientOrganization
 * @property {string} recipientAddress
 * @property {string} recipientPhone
 * @property {string} recipientEmail
 * @property {string} recipientRole
 */

/**
 * @typedef {Object} RecordsToRelease
 * @property {string[]} recordTypes
 * @property {YesNo} specificDateRange
 * @property {string} dateFrom
 * @property {string} dateTo
 * @property {string} specificRecordDetails
 */

/**
 * @typedef {Object} PurposeOfRelease
 * @property {ReleasePurpose} purpose
 * @property {string} otherDetails
 */

/**
 * @typedef {Object} AuthorizationPeriod
 * @property {string} startDate
 * @property {string} endDate
 * @property {YesNo} singleUse
 */

/**
 * @typedef {Object} RestrictionsLimitations
 * @property {YesNo} excludeHIV
 * @property {YesNo} excludeSubstanceAbuse
 * @property {YesNo} excludeMentalHealth
 * @property {YesNo} excludeGeneticInfo
 * @property {YesNo} excludeSTI
 * @property {string} additionalRestrictions
 */

/**
 * @typedef {Object} PatientRights
 * @property {YesNo} acknowledgedRightToRevoke
 * @property {YesNo} acknowledgedNoChargeForAccess
 * @property {YesNo} acknowledgedDataProtection
 */

/**
 * @typedef {Object} SignatureConsent
 * @property {YesNo} patientSignatureConfirmed
 * @property {string} signatureDate
 * @property {string} witnessName
 * @property {YesNo} witnessSignatureConfirmed
 * @property {string} witnessDate
 * @property {string} parentGuardianName
 */

/**
 * @typedef {Object} AssessmentData
 * @property {PatientInformation} patientInformation
 * @property {AuthorizedRecipient} authorizedRecipient
 * @property {RecordsToRelease} recordsToRelease
 * @property {PurposeOfRelease} purposeOfRelease
 * @property {AuthorizationPeriod} authorizationPeriod
 * @property {RestrictionsLimitations} restrictionsLimitations
 * @property {PatientRights} patientRights
 * @property {SignatureConsent} signatureConsent
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} domain
 * @property {string} description
 * @property {number} score
 */

/**
 * @typedef {Object} AdditionalFlag
 * @property {string} id
 * @property {string} category
 * @property {string} message
 * @property {'high' | 'medium' | 'low'} priority
 */

/**
 * @typedef {Object} GradingResult
 * @property {number} completenessScore
 * @property {string} completenessStatus
 * @property {string} validationStatus
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; lists default to `[]`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    patientInformation: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      sex: '',
      address: '',
      phone: '',
      email: '',
      nhsNumber: '',
      gpName: '',
      gpPractice: ''
    },
    authorizedRecipient: {
      recipientName: '',
      recipientOrganization: '',
      recipientAddress: '',
      recipientPhone: '',
      recipientEmail: '',
      recipientRole: ''
    },
    recordsToRelease: {
      recordTypes: [],
      specificDateRange: '',
      dateFrom: '',
      dateTo: '',
      specificRecordDetails: ''
    },
    purposeOfRelease: {
      purpose: '',
      otherDetails: ''
    },
    authorizationPeriod: {
      startDate: '',
      endDate: '',
      singleUse: ''
    },
    restrictionsLimitations: {
      excludeHIV: '',
      excludeSubstanceAbuse: '',
      excludeMentalHealth: '',
      excludeGeneticInfo: '',
      excludeSTI: '',
      additionalRestrictions: ''
    },
    patientRights: {
      acknowledgedRightToRevoke: '',
      acknowledgedNoChargeForAccess: '',
      acknowledgedDataProtection: ''
    },
    signatureConsent: {
      patientSignatureConfirmed: '',
      signatureDate: '',
      witnessName: '',
      witnessSignatureConfirmed: '',
      witnessDate: '',
      parentGuardianName: ''
    }
  };
}

/** Calculate completeness percentage. */
function completenessPercent(completed, total) {
  if (total === 0) return 100;
  return Math.round((completed / total) * 100);
}

/** Validation status label based on issue count. */
function validationStatus(issueCount) {
  if (issueCount === 0) return 'Valid';
  if (issueCount <= 3) return 'Minor Issues';
  return 'Needs Attention';
}

/** Completeness status label based on score (matches form-validator output). */
function completenessStatus(score) {
  if (score === 100) return 'Complete';
  if (score >= 75) return 'Nearly Complete';
  if (score >= 50) return 'Partially Complete';
  return 'Incomplete';
}

/** CSS modifier class for the completeness badge. */
function completenessBadgeClass(score) {
  if (score === 100) return 'score-complete';
  if (score >= 75) return 'score-near';
  if (score >= 50) return 'score-partial';
  return 'score-low';
}

/** CSS modifier class for the validation-status pill. */
function validationStatusClass(label) {
  if (label === 'Valid') return 'valid';
  if (label === 'Minor Issues') return 'minor';
  return 'needs';
}

/** Email format check used by both the validator and the report. */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export { emptyAssessment, completenessPercent, validationStatus, completenessStatus, completenessBadgeClass, validationStatusClass, isValidEmail };
