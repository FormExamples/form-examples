// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the International Patient
// Summary (IPS) form.
//
// The IPS is a standardised, minimal, specialty-agnostic clinical
// extract conforming to ISO 27269 and HL7 FHIR R5. The data model here
// mirrors the eight mandatory IPS sections plus three optional ones
// (devices, advance directives, and the authoring clinician).
//
// This file builds and exports the canonical empty AssessmentData
// shape used by the wizard, so that newly-added fields automatically
// default correctly when older saved state is rehydrated from
// localStorage.

/**
 * @typedef {'male' | 'female' | 'other' | 'unknown' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'active' | 'inactive' | 'resolved' | ''} ProblemStatus
 * @typedef {'mild' | 'moderate' | 'severe' | ''} ClinicalSeverity
 * @typedef {'low' | 'high' | 'unable-to-assess' | ''} AllergyCriticality
 * @typedef {'low' | 'normal' | 'high' | 'critical' | ''} ResultInterpretation
 * @typedef {'draft' | 'final' | ''} AuthoringStatus
 */

/**
 * @typedef {Object} PatientDemographics
 * @property {string} givenName
 * @property {string} familyName
 * @property {string} dateOfBirth
 * @property {Sex} sex
 * @property {string} nationalIdentifier
 * @property {string} addressLine
 * @property {string} city
 * @property {string} postalCode
 * @property {string} country
 * @property {string} preferredLanguage
 * @property {string} contactPhone
 */

/**
 * @typedef {Object} Problem
 * @property {string} description
 * @property {string} icd10Code
 * @property {string} onsetDate
 * @property {ProblemStatus} status
 */

/**
 * @typedef {Object} Medication
 * @property {string} name
 * @property {string} atcCode
 * @property {string} dose
 * @property {string} frequency
 * @property {string} route
 */

/**
 * @typedef {Object} Allergy
 * @property {string} substance
 * @property {string} reaction
 * @property {ClinicalSeverity} severity
 * @property {AllergyCriticality} criticality
 */

/**
 * @typedef {Object} Immunisation
 * @property {string} vaccine
 * @property {string} date
 * @property {string} lotNumber
 */

/**
 * @typedef {Object} Procedure
 * @property {string} description
 * @property {string} date
 * @property {string} performer
 */

/**
 * @typedef {Object} Result
 * @property {string} testName
 * @property {string} value
 * @property {string} unit
 * @property {ResultInterpretation} interpretation
 * @property {string} date
 */

/**
 * @typedef {Object} Device
 * @property {string} description
 * @property {string} udi
 * @property {string} implantDate
 */

/**
 * @typedef {Object} AdvanceDirective
 * @property {YesNo} dnrInPlace
 * @property {YesNo} livingWillInPlace
 * @property {YesNo} consentToShareEu
 * @property {string} directiveNotes
 */

/**
 * @typedef {Object} AuthoringClinician
 * @property {string} clinicianName
 * @property {string} clinicianRole
 * @property {string} organisation
 * @property {string} country
 * @property {string} email
 * @property {string} phone
 * @property {string} signoffDate
 * @property {AuthoringStatus} authoringStatus
 */

/**
 * @typedef {Object} AssessmentData
 * @property {PatientDemographics} patientDemographics
 * @property {Problem[]} problemList
 * @property {Medication[]} medicationSummary
 * @property {Allergy[]} allergiesIntolerances
 * @property {Immunisation[]} immunisations
 * @property {Procedure[]} procedures
 * @property {Result[]} resultsInvestigations
 * @property {Device[]} medicalDevices
 * @property {AdvanceDirective} advanceDirectives
 * @property {AuthoringClinician} authoringClinician
 */

/**
 * @typedef {'complete' | 'partial' | 'incomplete'} CompletenessLevel
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {'ok' | 'empty' | 'optional'} status
 * @property {boolean} mandatory
 */

/**
 * @typedef {Object} AdditionalFlag
 * @property {string} id
 * @property {string} category
 * @property {string} message
 * @property {'urgent' | 'high' | 'medium' | 'low'} priority
 */

/**
 * @typedef {Object} GradingResult
 * @property {CompletenessLevel} completenessLevel
 * @property {number} mandatoryPopulated
 * @property {number} mandatoryTotal
 * @property {number} optionalPopulated
 * @property {number} optionalTotal
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric fields default to `null`; lists default to `[]`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    patientDemographics: {
      givenName: '',
      familyName: '',
      dateOfBirth: '',
      sex: '',
      nationalIdentifier: '',
      addressLine: '',
      city: '',
      postalCode: '',
      country: '',
      preferredLanguage: '',
      contactPhone: ''
    },
    problemList: [],
    medicationSummary: [],
    allergiesIntolerances: [],
    immunisations: [],
    procedures: [],
    resultsInvestigations: [],
    medicalDevices: [],
    advanceDirectives: {
      dnrInPlace: '',
      livingWillInPlace: '',
      consentToShareEu: '',
      directiveNotes: ''
    },
    authoringClinician: {
      clinicianName: '',
      clinicianRole: '',
      organisation: '',
      country: '',
      email: '',
      phone: '',
      signoffDate: '',
      authoringStatus: ''
    }
  };
}

/**
 * IPS specifies these eight sections as mandatory per ISO 27269 and the
 * HL7 FHIR IPS Implementation Guide. The validator tests each one for
 * "populated" (>= 1 entry, or all required scalar fields filled).
 */
const MANDATORY_SECTIONS = [
  'patientDemographics',
  'problemList',
  'medicationSummary',
  'allergiesIntolerances',
  'immunisations',
  'procedures',
  'resultsInvestigations',
  'authoringClinician'
];

const OPTIONAL_SECTIONS = [
  'medicalDevices',
  'advanceDirectives'
];

export { emptyAssessment, MANDATORY_SECTIONS, OPTIONAL_SECTIONS };
