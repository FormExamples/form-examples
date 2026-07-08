// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Advance Decision To Refuse
// Treatment (ADRT) form.
//
// This file builds and exports the canonical empty AssessmentData shape
// used by the wizard, so that newly-added fields automatically default
// correctly when older saved state is rehydrated from localStorage.

/**
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'mild' | 'moderate' | 'anaphylaxis' | ''} AllergySeverity
 * @typedef {'draft' | 'complete' | 'valid' | 'invalid'} ValidityStatus
 */

/**
 * @typedef {Object} PersonalInformation
 * @property {string} fullLegalName
 * @property {string} dateOfBirth
 * @property {string} nhsNumber
 * @property {string} address
 * @property {string} postcode
 * @property {string} telephone
 * @property {string} email
 * @property {string} gpName
 * @property {string} gpPractice
 * @property {string} gpAddress
 * @property {string} gpTelephone
 */

/**
 * @typedef {Object} CapacityDeclaration
 * @property {YesNo} confirmsCapacity
 * @property {YesNo} understandsConsequences
 * @property {YesNo} noUndueInfluence
 * @property {YesNo} professionalCapacityAssessment
 * @property {string} assessedByName
 * @property {string} assessedByRole
 * @property {string} assessmentDate
 * @property {string} assessmentDetails
 */

/**
 * @typedef {Object} Circumstances
 * @property {string} specificCircumstances
 * @property {string} medicalConditions
 * @property {string} situationsDescription
 */

/**
 * @typedef {Object} TreatmentRefusal
 * @property {string} treatment
 * @property {YesNo} refused
 * @property {string} specification
 */

/**
 * @typedef {Object} TreatmentsRefusedGeneral
 * @property {TreatmentRefusal} antibiotics
 * @property {TreatmentRefusal} bloodTransfusion
 * @property {TreatmentRefusal} ivFluids
 * @property {TreatmentRefusal} tubeFeeding
 * @property {TreatmentRefusal} dialysis
 * @property {TreatmentRefusal} ventilation
 * @property {TreatmentRefusal[]} otherTreatments
 */

/**
 * @typedef {Object} LifeSustainingRefusal
 * @property {string} treatment
 * @property {YesNo} refused
 * @property {YesNo} evenIfLifeAtRisk
 * @property {string} specification
 */

/**
 * @typedef {Object} TreatmentsRefusedLifeSustaining
 * @property {LifeSustainingRefusal} cpr
 * @property {LifeSustainingRefusal} mechanicalVentilation
 * @property {LifeSustainingRefusal} artificialNutritionHydration
 * @property {LifeSustainingRefusal[]} otherLifeSustaining
 */

/**
 * @typedef {Object} ExceptionsConditions
 * @property {YesNo} hasExceptions
 * @property {string} exceptionsDescription
 * @property {YesNo} hasTimeLimitations
 * @property {string} timeLimitationsDescription
 * @property {string} invalidatingConditions
 */

/**
 * @typedef {Object} OtherWishes
 * @property {string} preferredCareSetting
 * @property {string} comfortMeasures
 * @property {string} spiritualReligiousWishes
 * @property {string} otherPreferences
 */

/**
 * @typedef {Object} LastingPowerOfAttorney
 * @property {YesNo} hasLPA
 * @property {'health-and-welfare' | 'property-and-financial' | 'both' | ''} lpaType
 * @property {YesNo} lpaRegistered
 * @property {string} lpaRegistrationDate
 * @property {string} doneeNames
 * @property {string} relationshipBetweenADRTAndLPA
 */

/**
 * @typedef {Object} HealthcareProfessionalReview
 * @property {string} reviewedByClinicianName
 * @property {string} reviewedByClinicianRole
 * @property {string} reviewDate
 * @property {string} clinicalOpinionOnCapacity
 * @property {YesNo} anyConcerns
 * @property {string} concernsDetails
 */

/**
 * @typedef {Object} LegalSignatures
 * @property {YesNo} patientSignature
 * @property {YesNo} patientStatementOfUnderstanding
 * @property {string} patientSignatureDate
 * @property {YesNo} witnessSignature
 * @property {string} witnessName
 * @property {string} witnessAddress
 * @property {string} witnessSignatureDate
 * @property {YesNo} lifeSustainingWrittenStatement
 * @property {string} lifeSustainingStatementText
 * @property {YesNo} lifeSustainingSignature
 * @property {YesNo} lifeSustainingWitnessSignature
 * @property {string} lifeSustainingWitnessName
 * @property {string} lifeSustainingWitnessAddress
 */

/**
 * @typedef {Object} AssessmentData
 * @property {PersonalInformation} personalInformation
 * @property {CapacityDeclaration} capacityDeclaration
 * @property {Circumstances} circumstances
 * @property {TreatmentsRefusedGeneral} treatmentsRefusedGeneral
 * @property {TreatmentsRefusedLifeSustaining} treatmentsRefusedLifeSustaining
 * @property {ExceptionsConditions} exceptionsConditions
 * @property {OtherWishes} otherWishes
 * @property {LastingPowerOfAttorney} lastingPowerOfAttorney
 * @property {HealthcareProfessionalReview} healthcareProfessionalReview
 * @property {LegalSignatures} legalSignatures
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {'critical' | 'required' | 'recommended'} severity
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
 * @property {ValidityStatus} validityStatus
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.AdvanceDecisionToRefuseTreatment`.
(function () {
'use strict';
window.AdvanceDecisionToRefuseTreatment = window.AdvanceDecisionToRefuseTreatment || {};

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; lists default to `[]`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    personalInformation: {
      fullLegalName: '',
      dateOfBirth: '',
      nhsNumber: '',
      address: '',
      postcode: '',
      telephone: '',
      email: '',
      gpName: '',
      gpPractice: '',
      gpAddress: '',
      gpTelephone: ''
    },
    capacityDeclaration: {
      confirmsCapacity: '',
      understandsConsequences: '',
      noUndueInfluence: '',
      professionalCapacityAssessment: '',
      assessedByName: '',
      assessedByRole: '',
      assessmentDate: '',
      assessmentDetails: ''
    },
    circumstances: {
      specificCircumstances: '',
      medicalConditions: '',
      situationsDescription: ''
    },
    treatmentsRefusedGeneral: {
      antibiotics: { treatment: 'Antibiotics', refused: '', specification: '' },
      bloodTransfusion: { treatment: 'Blood Transfusion', refused: '', specification: '' },
      ivFluids: { treatment: 'IV Fluids', refused: '', specification: '' },
      tubeFeeding: { treatment: 'Tube Feeding', refused: '', specification: '' },
      dialysis: { treatment: 'Dialysis', refused: '', specification: '' },
      ventilation: { treatment: 'Ventilation', refused: '', specification: '' },
      otherTreatments: []
    },
    treatmentsRefusedLifeSustaining: {
      cpr: { treatment: 'CPR', refused: '', evenIfLifeAtRisk: '', specification: '' },
      mechanicalVentilation: { treatment: 'Mechanical Ventilation', refused: '', evenIfLifeAtRisk: '', specification: '' },
      artificialNutritionHydration: { treatment: 'Artificial Nutrition/Hydration', refused: '', evenIfLifeAtRisk: '', specification: '' },
      otherLifeSustaining: []
    },
    exceptionsConditions: {
      hasExceptions: '',
      exceptionsDescription: '',
      hasTimeLimitations: '',
      timeLimitationsDescription: '',
      invalidatingConditions: ''
    },
    otherWishes: {
      preferredCareSetting: '',
      comfortMeasures: '',
      spiritualReligiousWishes: '',
      otherPreferences: ''
    },
    lastingPowerOfAttorney: {
      hasLPA: '',
      lpaType: '',
      lpaRegistered: '',
      lpaRegistrationDate: '',
      doneeNames: '',
      relationshipBetweenADRTAndLPA: ''
    },
    healthcareProfessionalReview: {
      reviewedByClinicianName: '',
      reviewedByClinicianRole: '',
      reviewDate: '',
      clinicalOpinionOnCapacity: '',
      anyConcerns: '',
      concernsDetails: ''
    },
    legalSignatures: {
      patientSignature: '',
      patientStatementOfUnderstanding: '',
      patientSignatureDate: '',
      witnessSignature: '',
      witnessName: '',
      witnessAddress: '',
      witnessSignatureDate: '',
      lifeSustainingWrittenStatement: '',
      lifeSustainingStatementText: '',
      lifeSustainingSignature: '',
      lifeSustainingWitnessSignature: '',
      lifeSustainingWitnessName: '',
      lifeSustainingWitnessAddress: ''
    }
  };
}

/** Check whether any life-sustaining treatment has been refused.
 * @param {AssessmentData} data
 * @returns {boolean}
 */
function hasLifeSustainingRefusal(data) {
  const ls = data.treatmentsRefusedLifeSustaining;
  if (ls.cpr.refused === 'yes') return true;
  if (ls.mechanicalVentilation.refused === 'yes') return true;
  if (ls.artificialNutritionHydration.refused === 'yes') return true;
  if (ls.otherLifeSustaining.some((t) => t.refused === 'yes')) return true;
  return false;
}

/** Validity status display label.
 * @param {string} status
 */
function validityStatusLabel(status) {
  switch (status) {
    case 'draft':    return 'Draft - In Progress';
    case 'complete': return 'Complete - All Sections Filled';
    case 'valid':    return 'Valid - Legally Compliant';
    case 'invalid':  return 'Invalid - Missing Legal Requirements';
    default:         return status;
  }
}

/** CSS class hint for a validity-status badge.
 * @param {string} status
 */
function validityStatusClass(status) {
  switch (status) {
    case 'draft':    return 'validity-draft';
    case 'complete': return 'validity-complete';
    case 'valid':    return 'validity-valid';
    case 'invalid':  return 'validity-invalid';
    default:         return '';
  }
}

Object.assign(window.AdvanceDecisionToRefuseTreatment, {
  emptyAssessment,
  hasLifeSustainingRefusal,
  validityStatusLabel,
  validityStatusClass
});
})();
