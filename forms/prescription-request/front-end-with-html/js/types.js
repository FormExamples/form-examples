// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Prescription Request form.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.

/**
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'routine' | 'urgent' | 'emergency'} PriorityLevel
 * @typedef {'oral' | 'topical' | 'intravenous' | 'intramuscular' |
 *           'subcutaneous' | 'inhaled' | 'rectal' | 'sublingual' |
 *           'transdermal' | 'other' | ''} RouteOfAdministration
 */

/**
 * @typedef {Object} PatientInformation
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} phone
 * @property {string} email
 * @property {string} nhsNumber
 */

/**
 * @typedef {Object} ClinicianInformation
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} phone
 * @property {string} email
 * @property {string} nhsEmployeeNumber
 */

/**
 * @typedef {Object} PrescriptionDetails
 * @property {string} requestDate
 * @property {string} medicationName
 * @property {string} dosage
 * @property {string} frequency
 * @property {RouteOfAdministration} routeOfAdministration
 * @property {string} treatmentInstructions
 */

/**
 * @typedef {Object} SubstitutionOptions
 * @property {YesNo} allowBrandSubstitution
 * @property {YesNo} allowGenericSubstitution
 * @property {YesNo} allowDosageAdjustment
 * @property {string} substitutionNotes
 */

/**
 * @typedef {Object} RequestType
 * @property {YesNo} isNewPrescription
 * @property {YesNo} isEmergency
 * @property {string} additionalNotes
 */

/**
 * @typedef {Object} AssessmentData
 * @property {PatientInformation} patientInformation
 * @property {ClinicianInformation} clinicianInformation
 * @property {PrescriptionDetails} prescriptionDetails
 * @property {SubstitutionOptions} substitutionOptions
 * @property {RequestType} requestType
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {PriorityLevel} priorityLevel
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
 * @property {PriorityLevel} priorityLevel
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
      phone: '',
      email: '',
      nhsNumber: ''
    },
    clinicianInformation: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      nhsEmployeeNumber: ''
    },
    prescriptionDetails: {
      requestDate: '',
      medicationName: '',
      dosage: '',
      frequency: '',
      routeOfAdministration: '',
      treatmentInstructions: ''
    },
    substitutionOptions: {
      allowBrandSubstitution: '',
      allowGenericSubstitution: '',
      allowDosageAdjustment: '',
      substitutionNotes: ''
    },
    requestType: {
      isNewPrescription: '',
      isEmergency: '',
      additionalNotes: ''
    }
  };
}

/** Priority level human-readable label. */
function priorityLevelLabel(level) {
  switch (level) {
    case 'routine':
      return 'Routine - Standard processing';
    case 'urgent':
      return 'Urgent - Requires prompt attention';
    case 'emergency':
      return 'Emergency - Immediate action required';
    default:
      return `Priority: ${level}`;
  }
}

/** Priority level CSS class suffix. */
function priorityLevelClass(level) {
  switch (level) {
    case 'routine':   return 'priority-routine';
    case 'urgent':    return 'priority-urgent';
    case 'emergency': return 'priority-emergency';
    default:          return '';
  }
}

export { emptyAssessment, priorityLevelLabel, priorityLevelClass };
