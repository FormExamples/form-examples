// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the General Practitioner Referral
// Letter form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_general_practitioner_referral_letter.sql` (with the
// referrer identity and core patient demographics — which the SQL model keeps in
// the `clinician` and `patient` tables — carried here on the referral object as
// the front-end contract in spec §3). This file builds and exports the canonical
// empty Referral shape used by the wizard, so newly-added fields default
// correctly when older saved state is rehydrated from localStorage. It also
// exports display helpers (statusLabel, statusClass, urgencyLabel, urgencyClass,
// urgencyPathway, priorityLabel, and per-enum label helpers).
//
// Unlike a scored assessment, this is a documentation-completeness and
// urgency-classification instrument: the engine grades a referral's completeness
// (`Complete` / `Incomplete`) with a completeness percentage, echoes its urgency
// (`routine` / `urgent` / `two-week-wait` / `emergency`), records which
// completeness rules fired, and raises flags. There is no numeric clinical
// score.

/**
 * @typedef {'yes' | 'no' | ''} ConsentToShare
 * @typedef {'female' | 'male' | 'other' | 'unknown' | ''} PatientSex
 * @typedef {'gp' | 'gp-registrar' | 'nurse-practitioner' | 'pharmacist' | 'paramedic' | 'other' | ''} ReferrerRole
 * @typedef {'routine' | 'urgent' | 'two-week-wait' | 'emergency' | ''} Urgency
 * @typedef {'Complete' | 'Incomplete'} Status
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — referrer details. Identity of the referring clinician.
 * @typedef {Object} Referrer
 * @property {string} referrerName
 * @property {ReferrerRole} referrerRole
 * @property {string} referrerRegistrationNumber   - GMC / NMC / GPhC number
 * @property {string} referringPractice
 * @property {string} practiceAddress
 * @property {string} referrerContact              - phone / secure email
 * @property {string | null} referralDate          - ISO date string; null when unset
 */

/**
 * Step 2 — patient identification.
 * @typedef {Object} Patient
 * @property {string} patientIdentifier            - NHS number or local identifier
 * @property {string} patientName
 * @property {string | null} patientDateOfBirth    - ISO date string; null when unset
 * @property {PatientSex} patientSex
 * @property {string} patientAddress
 * @property {string} patientContact
 * @property {string} accessNeeds                  - interpreter / accessibility needs
 */

/**
 * Step 3 — referral destination.
 * @typedef {Object} Destination
 * @property {string} referralSpecialty
 * @property {string} namedClinician
 * @property {string} receivingOrganisation
 */

/**
 * Step 4 — urgency.
 * @typedef {Object} UrgencyInfo
 * @property {Urgency} urgency
 * @property {string} urgencyReason
 * @property {string} suspectedCancerCriterion     - named NICE NG12 criterion
 * @property {string} suspectedCancerPathway       - tumour-site pathway
 */

/**
 * Step 5 — reason and history.
 * @typedef {Object} Clinical
 * @property {string} reasonForReferral
 * @property {string} relevantHistory
 * @property {string} presentingProblem
 * @property {string} symptomDuration
 * @property {string} redFlagSymptoms              - drives the emergency-features flag
 */

/**
 * Step 6 — examination and investigations.
 * @typedef {Object} Examination
 * @property {string} examinationFindings
 * @property {string} investigationResults
 */

/**
 * Step 7 — medications and allergies.
 * @typedef {Object} Medications
 * @property {string} currentMedications
 * @property {string} allergies
 */

/**
 * Step 8 — expectations, consent, and safety-netting.
 * @typedef {Object} Expectations
 * @property {string} patientExpectations
 * @property {ConsentToShare} consentToShare
 * @property {string} safetyNetting
 */

/**
 * Step 9 — summary and review.
 * @typedef {Object} Review
 * @property {string} clinicalNote
 */

/**
 * @typedef {Object} Referral
 * @property {Referrer} referrer
 * @property {Patient} patient
 * @property {Destination} destination
 * @property {UrgencyInfo} urgencyInfo
 * @property {Clinical} clinical
 * @property {Examination} examination
 * @property {Medications} medications
 * @property {Expectations} expectations
 * @property {Review} review
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id           - stable rule id, e.g. R-MANDATORY-PATIENT-IDENTIFIER
 * @property {string} rule         - short rule key
 * @property {boolean} satisfied
 * @property {string} category
 * @property {string} description
 */

/**
 * @typedef {Object} FlaggedIssue
 * @property {string} id
 * @property {string} category
 * @property {Priority} priority
 * @property {string} description
 * @property {string} suggestedAction
 */

/**
 * @typedef {Object} GradingResult
 * @property {Status} status
 * @property {Urgency} urgency
 * @property {number} completenessPercent   - 0..100
 * @property {number} presentCount          - mandatory fields present
 * @property {number} mandatoryCount        - mandatory fields that apply
 * @property {FiredRule[]} firedRules
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a classic
// <script> (no ES modules) so the page can be opened directly via `file://`.
// The IIFE attaches its public symbols to a single global namespace,
// `window.GeneralPractitionerReferralLetter`.

/**
 * Build a fresh, fully-blank referral.
 * Text / enum fields default to `''`; numeric, date, and time fields default
 * to `null`.
 * @returns {Referral}
 */
function emptyReferral() {
  return {
    referrer: {
      referrerName: '',
      referrerRole: '',
      referrerRegistrationNumber: '',
      referringPractice: '',
      practiceAddress: '',
      referrerContact: '',
      referralDate: null
    },
    patient: {
      patientIdentifier: '',
      patientName: '',
      patientDateOfBirth: null,
      patientSex: '',
      patientAddress: '',
      patientContact: '',
      accessNeeds: ''
    },
    destination: {
      referralSpecialty: '',
      namedClinician: '',
      receivingOrganisation: ''
    },
    urgencyInfo: {
      urgency: '',
      urgencyReason: '',
      suspectedCancerCriterion: '',
      suspectedCancerPathway: ''
    },
    clinical: {
      reasonForReferral: '',
      relevantHistory: '',
      presentingProblem: '',
      symptomDuration: '',
      redFlagSymptoms: ''
    },
    examination: {
      examinationFindings: '',
      investigationResults: ''
    },
    medications: {
      currentMedications: '',
      allergies: ''
    },
    expectations: {
      patientExpectations: '',
      consentToShare: '',
      safetyNetting: ''
    },
    review: {
      clinicalNote: ''
    }
  };
}

/** Completeness-status label for display. */
function statusLabel(status) {
  switch (status) {
    case 'Complete': return 'Complete';
    case 'Incomplete': return 'Incomplete';
    default: return '';
  }
}

/** CSS class hint for the status badge (reuses the shared risk palette). */
function statusClass(status) {
  switch (status) {
    case 'Complete': return 'risk-low';
    case 'Incomplete': return 'risk-high';
    default: return '';
  }
}

/** Urgency-classification label for display. */
function urgencyLabel(urgency) {
  switch (urgency) {
    case 'routine': return 'Routine';
    case 'urgent': return 'Urgent';
    case 'two-week-wait': return 'Two-week-wait (suspected cancer)';
    case 'emergency': return 'Emergency';
    default: return 'Not set';
  }
}

/** CSS class hint for the urgency badge (reuses the shared risk palette). */
function urgencyClass(urgency) {
  switch (urgency) {
    case 'routine': return 'risk-low';
    case 'urgent': return 'risk-moderate';
    case 'two-week-wait': return 'risk-high';
    case 'emergency': return 'risk-critical';
    default: return '';
  }
}

/** Pathway text for an urgency classification. */
function urgencyPathway(urgency) {
  switch (urgency) {
    case 'routine':
      return 'Routine outpatient referral — book via e-RS within the service’s standard routine timescales.';
    case 'urgent':
      return 'Urgent referral — flag to the receiving service for prioritised, non-cancer urgent assessment; record why it is urgent.';
    case 'two-week-wait':
      return 'Suspected-cancer (two-week-wait) pathway — route on the NICE NG12 two-week-wait pathway; name the criterion and tumour-site pathway so the patient is seen within two weeks.';
    case 'emergency':
      return 'Emergency — arrange same-day assessment or call 999 / acute admission now; do not send this as a routine letter.';
    default:
      return 'Select an urgency so the referral can be routed.';
  }
}

/** Referrer-role label. */
function referrerRoleLabel(value) {
  switch (value) {
    case 'gp': return 'GP';
    case 'gp-registrar': return 'GP registrar';
    case 'nurse-practitioner': return 'Nurse practitioner';
    case 'pharmacist': return 'Pharmacist';
    case 'paramedic': return 'Paramedic';
    case 'other': return 'Other';
    default: return 'Not recorded';
  }
}

/** Patient-sex label. */
function patientSexLabel(value) {
  switch (value) {
    case 'female': return 'Female';
    case 'male': return 'Male';
    case 'other': return 'Other';
    case 'unknown': return 'Unknown';
    default: return '';
  }
}

/** Consent-to-share label. */
function consentToShareLabel(value) {
  switch (value) {
    case 'yes': return 'Consent documented';
    case 'no': return 'Consent not given';
    default: return 'Not recorded';
  }
}

/** Flag-priority label. */
function priorityLabel(priority) {
  switch (priority) {
    case 'high': return 'HIGH';
    case 'medium': return 'MEDIUM';
    case 'low': return 'LOW';
    default: return '';
  }
}

export { emptyReferral, statusLabel, statusClass, urgencyLabel, urgencyClass, urgencyPathway, referrerRoleLabel, patientSexLabel, consentToShareLabel, priorityLabel };
