// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the WHO Acute Referral Form.
// This file publishes the empty-state factory and shared helpers used
// across the wizard.

/**
 * @typedef {'yes' | 'no' | 'unknown' | ''} YesNoUnknown
 * @typedef {'male' | 'female' | 'unknown' | ''} Sex
 * @typedef {'ground' | 'air' | 'sea' | ''} ModeOfTransfer
 * @typedef {'urgent' | 'high' | 'medium' | 'low'} FlagPriority
 */

/**
 * @typedef {Object} EmergencyContact
 * @property {string} name
 * @property {string} contactInformation
 */

/**
 * @typedef {Object} PatientIdentification
 * @property {string} patientLastName
 * @property {string} patientFirstName
 * @property {string} dateOfBirth
 * @property {Sex} sex
 * @property {string} patientContactInformation
 * @property {EmergencyContact} emergencyContact
 */

/**
 * @typedef {Object} FacilityDetails
 * @property {string} name
 * @property {string} focalPoint
 * @property {string} phoneNumber
 */

/**
 * @typedef {Object} AmbulanceDetails
 * @property {string} name
 * @property {string} focalPoint
 * @property {string} phoneNumber
 */

/**
 * @typedef {Object} FacilityAndTransport
 * @property {FacilityDetails} initiatingFacility
 * @property {string} reasonForReferral
 * @property {boolean} referralFacilityContacted
 * @property {FacilityDetails} referralFacility
 * @property {AmbulanceDetails} ambulance
 * @property {string} transferDecisionDateTime
 * @property {string} departureDateTime
 * @property {ModeOfTransfer} modeOfTransfer
 */

/**
 * @typedef {Object} Situation
 * @property {string} chiefComplaint
 * @property {string} primaryDiagnosis
 * @property {YesNoUnknown} pregnant
 * @property {string} otherAcuteDiagnoses
 * @property {string} treatmentsInitiated
 */

/**
 * @typedef {Object} AbcdeEntry
 * @property {boolean} findingNormal
 * @property {string} findingDetails
 * @property {boolean} interventionNone
 * @property {string} interventionDetails
 */

/**
 * @typedef {Object} Background
 * @property {string} historyOfPresentIllness
 * @property {string} pastMedicalAndSurgicalHistory
 * @property {AbcdeEntry} airway
 * @property {AbcdeEntry} breathing
 * @property {AbcdeEntry} circulation
 * @property {AbcdeEntry} disability
 * @property {AbcdeEntry} exposure
 * @property {string} otherSignificantTreatments
 */

/**
 * @typedef {Object} VitalSigns
 * @property {number|null} heartRate
 * @property {number|null} respiratoryRate
 * @property {number|null} systolicBloodPressure
 * @property {number|null} diastolicBloodPressure
 * @property {number|null} temperatureCelsius
 * @property {number|null} oxygenSaturation
 * @property {number|null} glasgowComaScale
 */

/**
 * @typedef {Object} Assessment
 * @property {string} clinicalAssessment
 * @property {VitalSigns} vitalSigns
 */

/**
 * @typedef {Object} Precautions
 * @property {boolean} highlyInfectiousDisease
 * @property {boolean} spinalPrecautions
 * @property {boolean} weightBearingRestrictions
 * @property {boolean} fallRisk
 * @property {boolean} aspirationRisk
 * @property {boolean} other
 * @property {string} otherDetails
 */

/**
 * @typedef {Object} Recommendations
 * @property {string} treatmentPlanDuringTransport
 * @property {string} potentialWorseningOfCondition
 * @property {string} cautionsRegardingPriorTherapies
 * @property {Precautions} precautions
 */

/**
 * @typedef {Object} InitiatingProviderSignoff
 * @property {string} providerName
 * @property {string} signature
 * @property {string} signatureDate
 */

/**
 * @typedef {Object} ReferralFacilityReceipt
 * @property {string} patientArrivalDateTime
 * @property {string} receivingProviderName
 * @property {string} receivingProviderSignature
 * @property {boolean} feedbackProvidedToInitiatingFacility
 */

/**
 * @typedef {Object} AssessmentData
 * @property {PatientIdentification} patientIdentification
 * @property {FacilityAndTransport} facilityAndTransport
 * @property {Situation} situation
 * @property {Background} background
 * @property {Assessment} assessment
 * @property {Recommendations} recommendations
 * @property {InitiatingProviderSignoff} initiatingProviderSignoff
 * @property {ReferralFacilityReceipt} referralFacilityReceipt
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} section
 * @property {string} description
 */

/**
 * @typedef {Object} SectionCompleteness
 * @property {string} section
 * @property {number} required
 * @property {number} satisfied
 * @property {FiredRule[]} missing
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} complete
 * @property {number} totalRequired
 * @property {number} totalSatisfied
 * @property {SectionCompleteness[]} sections
 * @property {FiredRule[]} missing
 */

/**
 * @typedef {Object} FlaggedIssue
 * @property {string} id
 * @property {string} category
 * @property {string} message
 * @property {FlagPriority} priority
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.WhoAcuteReferralForm`.
(function () {
'use strict';
window.WhoAcuteReferralForm = window.WhoAcuteReferralForm || {};

/** @returns {AbcdeEntry} */
function emptyAbcdeEntry() {
  return {
    findingNormal: false,
    findingDetails: '',
    interventionNone: false,
    interventionDetails: ''
  };
}

/** @returns {AssessmentData} */
function emptyAssessment() {
  return {
    patientIdentification: {
      patientLastName: '',
      patientFirstName: '',
      dateOfBirth: '',
      sex: '',
      patientContactInformation: '',
      emergencyContact: {
        name: '',
        contactInformation: ''
      }
    },
    facilityAndTransport: {
      initiatingFacility: { name: '', focalPoint: '', phoneNumber: '' },
      reasonForReferral: '',
      referralFacilityContacted: false,
      referralFacility: { name: '', focalPoint: '', phoneNumber: '' },
      ambulance: { name: '', focalPoint: '', phoneNumber: '' },
      transferDecisionDateTime: '',
      departureDateTime: '',
      modeOfTransfer: ''
    },
    situation: {
      chiefComplaint: '',
      primaryDiagnosis: '',
      pregnant: '',
      otherAcuteDiagnoses: '',
      treatmentsInitiated: ''
    },
    background: {
      historyOfPresentIllness: '',
      pastMedicalAndSurgicalHistory: '',
      airway: emptyAbcdeEntry(),
      breathing: emptyAbcdeEntry(),
      circulation: emptyAbcdeEntry(),
      disability: emptyAbcdeEntry(),
      exposure: emptyAbcdeEntry(),
      otherSignificantTreatments: ''
    },
    assessment: {
      clinicalAssessment: '',
      vitalSigns: {
        heartRate: null,
        respiratoryRate: null,
        systolicBloodPressure: null,
        diastolicBloodPressure: null,
        temperatureCelsius: null,
        oxygenSaturation: null,
        glasgowComaScale: null
      }
    },
    recommendations: {
      treatmentPlanDuringTransport: '',
      potentialWorseningOfCondition: '',
      cautionsRegardingPriorTherapies: '',
      precautions: {
        highlyInfectiousDisease: false,
        spinalPrecautions: false,
        weightBearingRestrictions: false,
        fallRisk: false,
        aspirationRisk: false,
        other: false,
        otherDetails: ''
      }
    },
    initiatingProviderSignoff: {
      providerName: '',
      signature: '',
      signatureDate: ''
    },
    referralFacilityReceipt: {
      patientArrivalDateTime: '',
      receivingProviderName: '',
      receivingProviderSignature: '',
      feedbackProvidedToInitiatingFacility: false
    }
  };
}

/** True if a string is non-empty after trimming. */
function hasText(s) {
  return typeof s === 'string' && s.trim() !== '';
}

/** True if a Yes/No/Unknown field has been answered. */
function isYesNoUnknownAnswered(value) {
  return value === 'yes' || value === 'no' || value === 'unknown';
}

/** True if a value is a finite number (not null and not NaN). */
function hasNumber(v) {
  return typeof v === 'number' && Number.isFinite(v);
}

/** @param {string} section */
function sectionLabel(section) {
  switch (section) {
    case 'patientIdentification': return 'Patient Identification';
    case 'facilityAndTransport': return 'Facility & Transport';
    case 'situation': return 'Situation';
    case 'background': return 'Background';
    case 'assessment': return 'Assessment';
    case 'recommendations': return 'Recommendations';
    case 'initiatingProviderSignoff': return 'Provider Sign-off';
    case 'referralFacilityReceipt': return 'Referral Facility Receipt';
    default: return section;
  }
}

/** @param {FlagPriority} priority */
function priorityLabel(priority) {
  switch (priority) {
    case 'urgent': return 'Urgent';
    case 'high': return 'High';
    case 'medium': return 'Medium';
    case 'low': return 'Low';
    default: return '';
  }
}

Object.assign(window.WhoAcuteReferralForm, {
  emptyAssessment,
  emptyAbcdeEntry,
  hasText,
  isYesNoUnknownAnswered,
  hasNumber,
  sectionLabel,
  priorityLabel
});
})();
