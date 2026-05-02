// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the DVLA M1 form.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of an M1 submission in one place.

/**
 * @typedef {'yes' | 'no' | ''} YesNo
 */

/**
 * @typedef {'email' | 'sms' | ''} ContactPreference
 */

/**
 * @typedef {'urgent' | 'high' | 'medium' | 'low'} RulePriority
 */

/**
 * @typedef {'completeness' | 'consistency' | 'safety' | 'declaration'} RuleCategory
 */

/**
 * @typedef {Object} PersonalDetails
 * @property {string} title
 * @property {string} fullName
 * @property {string} dateOfBirth
 * @property {string} address
 * @property {string} postcode
 * @property {string} email
 * @property {string} contactNumber
 * @property {string} changeOfDetails
 */

/**
 * @typedef {Object} GpDetails
 * @property {string} gpName
 * @property {string} surgeryName
 * @property {string} address
 * @property {string} town
 * @property {string} postcode
 * @property {string} contactNumber
 * @property {string} email
 * @property {string} dateLastSeen
 */

/**
 * @typedef {Object} ConsultantDetails
 * @property {string} consultantName
 * @property {string} speciality
 * @property {string} department
 * @property {string} hospitalName
 * @property {string} address
 * @property {string} town
 * @property {string} postcode
 * @property {string} contactNumber
 * @property {string} email
 * @property {string} dateLastSeen
 */

/**
 * @typedef {Object} HealthcareProfessionals
 * @property {GpDetails} gp
 * @property {ConsultantDetails} consultant
 */

/**
 * @typedef {Object} DiagnosisConfirmation
 * @property {YesNo} hasMentalHealthDiagnosis
 */

/**
 * @typedef {Object} MentalHealthConditions
 * @property {YesNo} anxietyDepressionWithoutImpairment
 * @property {YesNo} anxietyDepressionWithImpairment
 * @property {YesNo} bipolarAffectiveDisorder
 * @property {YesNo} eatingDisorder
 * @property {YesNo} ocdOrPtsd
 * @property {YesNo} personalityDisorder
 * @property {YesNo} schizophreniaOrPsychosis
 * @property {YesNo} other
 * @property {string} otherDetails
 */

/**
 * @typedef {Object} RecentContact
 * @property {YesNo} hadRecentContact
 * @property {string} doctorLastDate
 * @property {string} consultantLastDate
 * @property {string} communityPsychiatricNurseLastDate
 */

/**
 * @typedef {Object} Authorisation
 * @property {YesNo} declarationConfirmed
 * @property {string} signatoryName
 * @property {string} signatureText
 * @property {string} signatureDate
 * @property {YesNo} electronicCorrespondenceConsent
 * @property {ContactPreference} dvlaContactPreference
 * @property {ContactPreference} healthcareProfessionalContactPreference
 */

/**
 * @typedef {Object} AssessmentData
 * @property {PersonalDetails} personalDetails
 * @property {HealthcareProfessionals} healthcareProfessionals
 * @property {DiagnosisConfirmation} diagnosisConfirmation
 * @property {MentalHealthConditions} mentalHealthConditions
 * @property {RecentContact} recentContact
 * @property {Authorisation} authorisation
 */

/**
 * @typedef {Object} ValidationRule
 * @property {string} id
 * @property {RuleCategory} category
 * @property {RulePriority} priority
 * @property {string} description
 * @property {(d: AssessmentData) => boolean} evaluate
 * @property {string} message
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {RuleCategory} category
 * @property {RulePriority} priority
 * @property {string} description
 * @property {string} message
 */

/**
 * @typedef {Object} AdditionalFlag
 * @property {string} id
 * @property {string} category
 * @property {string} message
 * @property {RulePriority} priority
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} complete
 * @property {boolean} stoppedAtQ1
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {number} conditionCount
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.DvlaM1Form`.
(function () {
'use strict';
window.DvlaM1Form = window.DvlaM1Form || {};

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; date fields default to `''`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    personalDetails: {
      title: '',
      fullName: '',
      dateOfBirth: '',
      address: '',
      postcode: '',
      email: '',
      contactNumber: '',
      changeOfDetails: ''
    },
    healthcareProfessionals: {
      gp: {
        gpName: '',
        surgeryName: '',
        address: '',
        town: '',
        postcode: '',
        contactNumber: '',
        email: '',
        dateLastSeen: ''
      },
      consultant: {
        consultantName: '',
        speciality: '',
        department: '',
        hospitalName: '',
        address: '',
        town: '',
        postcode: '',
        contactNumber: '',
        email: '',
        dateLastSeen: ''
      }
    },
    diagnosisConfirmation: {
      hasMentalHealthDiagnosis: ''
    },
    mentalHealthConditions: {
      anxietyDepressionWithoutImpairment: '',
      anxietyDepressionWithImpairment: '',
      bipolarAffectiveDisorder: '',
      eatingDisorder: '',
      ocdOrPtsd: '',
      personalityDisorder: '',
      schizophreniaOrPsychosis: '',
      other: '',
      otherDetails: ''
    },
    recentContact: {
      hadRecentContact: '',
      doctorLastDate: '',
      consultantLastDate: '',
      communityPsychiatricNurseLastDate: ''
    },
    authorisation: {
      declarationConfirmed: '',
      signatoryName: '',
      signatureText: '',
      signatureDate: '',
      electronicCorrespondenceConsent: '',
      dvlaContactPreference: '',
      healthcareProfessionalContactPreference: ''
    }
  };
}

/** True when a string looks like a non-empty trimmed value. */
function isFilled(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/** Numeric ordering for priority sort: urgent < high < medium < low. */
function priorityOrder(priority) {
  switch (priority) {
    case 'urgent': return 0;
    case 'high': return 1;
    case 'medium': return 2;
    case 'low': return 3;
    default: return 99;
  }
}

/** Human-readable label for a priority. */
function priorityLabel(priority) {
  switch (priority) {
    case 'urgent': return 'Urgent';
    case 'high': return 'High';
    case 'medium': return 'Medium';
    case 'low': return 'Low';
    default: return '';
  }
}

Object.assign(window.DvlaM1Form, {
  emptyAssessment,
  isFilled,
  priorityOrder,
  priorityLabel
});
})();
