// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Rheumatology Assessment form.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'mild' | 'moderate' | 'anaphylaxis' | ''} AllergySeverity
 * @typedef {'current' | 'ex' | 'never' | ''} SmokingStatus
 */

/**
 * @typedef {Object} Demographics
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {Sex} sex
 * @property {number | null} weight
 * @property {number | null} height
 * @property {number | null} bmi
 */

/**
 * @typedef {Object} ChiefComplaint
 * @property {string} primaryJointComplaint
 * @property {string} onsetDate
 * @property {number | null} durationMonths
 * @property {number | null} morningStiffnessDurationMinutes
 * @property {YesNo} symmetricInvolvement
 */

/**
 * @typedef {Object} JointAssessment
 * @property {number | null} tenderJointCount28
 * @property {number | null} swollenJointCount28
 * @property {number | null} painVAS
 * @property {number | null} patientGlobalVAS
 */

/**
 * @typedef {Object} DiseaseHistory
 * @property {'rheumatoid-arthritis' | 'psoriatic-arthritis' | 'ankylosing-spondylitis' | 'systemic-lupus' | 'gout' | 'osteoarthritis' | 'other' | ''} primaryDiagnosis
 * @property {string} diagnosisDate
 * @property {number | null} diseaseDurationYears
 * @property {string} previousDMARDs
 * @property {string} previousBiologics
 * @property {YesNo} remissionPeriods
 * @property {string} remissionDetails
 */

/**
 * @typedef {Object} ExtraArticularFeatures
 * @property {YesNo} rheumatoidNodules
 * @property {YesNo} skinRash
 * @property {string} skinRashDetails
 * @property {YesNo} eyeDryness
 * @property {YesNo} uveitis
 * @property {string} uveitisDetails
 * @property {YesNo} interstitialLungDisease
 * @property {string} ildDetails
 * @property {YesNo} cardiovascularInvolvement
 * @property {string} cardiovascularDetails
 */

/**
 * @typedef {Object} LaboratoryResults
 * @property {number | null} esr
 * @property {number | null} crp
 * @property {YesNo} rheumatoidFactor
 * @property {YesNo} antiCCP
 * @property {YesNo} ana
 * @property {YesNo} hlaB27
 * @property {number | null} haemoglobin
 * @property {number | null} whiteBloodCellCount
 * @property {number | null} plateletCount
 * @property {number | null} creatinine
 * @property {number | null} egfr
 * @property {number | null} alt
 * @property {number | null} ast
 */

/**
 * @typedef {Object} Medication
 * @property {string} name
 * @property {string} dose
 * @property {string} frequency
 */

/**
 * @typedef {Object} CurrentMedications
 * @property {Medication[]} dmards
 * @property {Medication[]} biologics
 * @property {Medication[]} nsaids
 * @property {Medication[]} steroids
 * @property {Medication[]} painMedication
 * @property {Medication[]} supplements
 */

/**
 * @typedef {Object} Allergy
 * @property {string} allergen
 * @property {string} reaction
 * @property {AllergySeverity} severity
 */

/**
 * @typedef {Object} Allergies
 * @property {Allergy[]} drugAllergies
 * @property {YesNo} latexAllergy
 */

/**
 * @typedef {Object} FunctionalAssessment
 * @property {number | null} haqDiScore
 * @property {number | null} gripStrengthLeft
 * @property {number | null} gripStrengthRight
 * @property {'independent' | 'with-aid' | 'wheelchair' | 'bedbound' | ''} walkingAbility
 * @property {string} adlLimitations
 * @property {YesNo} workDisability
 * @property {string} workDisabilityDetails
 */

/**
 * @typedef {Object} ComorbiditiesSocial
 * @property {YesNo} cardiovascularRisk
 * @property {string} cardiovascularRiskDetails
 * @property {YesNo} osteoporosis
 * @property {YesNo} osteoporosisOnTreatment
 * @property {YesNo} recentInfections
 * @property {string} recentInfectionDetails
 * @property {YesNo} tuberculosisScreening
 * @property {YesNo} vaccinationStatusUpToDate
 * @property {string} vaccinationDetails
 * @property {SmokingStatus} smoking
 * @property {number | null} smokingPackYears
 * @property {'none' | 'occasional' | 'regular' | 'daily' | ''} exerciseFrequency
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {ChiefComplaint} chiefComplaint
 * @property {JointAssessment} jointAssessment
 * @property {DiseaseHistory} diseaseHistory
 * @property {ExtraArticularFeatures} extraArticularFeatures
 * @property {LaboratoryResults} laboratoryResults
 * @property {CurrentMedications} currentMedications
 * @property {Allergies} allergies
 * @property {FunctionalAssessment} functionalAssessment
 * @property {ComorbiditiesSocial} comorbiditiesSocial
 */

/**
 * @typedef {'remission' | 'low' | 'moderate' | 'high'} DiseaseActivity
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
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
 * @property {number | null} das28Score
 * @property {DiseaseActivity | null} diseaseActivity
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.RheumatologyAssessment`.
(function () {
'use strict';
window.RheumatologyAssessment = window.RheumatologyAssessment || {};

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric fields default to `null`; lists default to `[]`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    demographics: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      sex: '',
      weight: null,
      height: null,
      bmi: null
    },
    chiefComplaint: {
      primaryJointComplaint: '',
      onsetDate: '',
      durationMonths: null,
      morningStiffnessDurationMinutes: null,
      symmetricInvolvement: ''
    },
    jointAssessment: {
      tenderJointCount28: null,
      swollenJointCount28: null,
      painVAS: null,
      patientGlobalVAS: null
    },
    diseaseHistory: {
      primaryDiagnosis: '',
      diagnosisDate: '',
      diseaseDurationYears: null,
      previousDMARDs: '',
      previousBiologics: '',
      remissionPeriods: '',
      remissionDetails: ''
    },
    extraArticularFeatures: {
      rheumatoidNodules: '',
      skinRash: '',
      skinRashDetails: '',
      eyeDryness: '',
      uveitis: '',
      uveitisDetails: '',
      interstitialLungDisease: '',
      ildDetails: '',
      cardiovascularInvolvement: '',
      cardiovascularDetails: ''
    },
    laboratoryResults: {
      esr: null,
      crp: null,
      rheumatoidFactor: '',
      antiCCP: '',
      ana: '',
      hlaB27: '',
      haemoglobin: null,
      whiteBloodCellCount: null,
      plateletCount: null,
      creatinine: null,
      egfr: null,
      alt: null,
      ast: null
    },
    currentMedications: {
      dmards: [],
      biologics: [],
      nsaids: [],
      steroids: [],
      painMedication: [],
      supplements: []
    },
    allergies: {
      drugAllergies: [],
      latexAllergy: ''
    },
    functionalAssessment: {
      haqDiScore: null,
      gripStrengthLeft: null,
      gripStrengthRight: null,
      walkingAbility: '',
      adlLimitations: '',
      workDisability: '',
      workDisabilityDetails: ''
    },
    comorbiditiesSocial: {
      cardiovascularRisk: '',
      cardiovascularRiskDetails: '',
      osteoporosis: '',
      osteoporosisOnTreatment: '',
      recentInfections: '',
      recentInfectionDetails: '',
      tuberculosisScreening: '',
      vaccinationStatusUpToDate: '',
      vaccinationDetails: '',
      smoking: '',
      smokingPackYears: null,
      exerciseFrequency: ''
    }
  };
}

/** Calculate BMI from weight (kg) and height (cm). Returns null if invalid. */
function calculateBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) return null;
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

/** Get BMI category label. */
function bmiCategory(bmi) {
  if (bmi === null || bmi === undefined) return '';
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  if (bmi < 35) return 'Obese Class I';
  if (bmi < 40) return 'Obese Class II';
  return 'Obese Class III (Morbid)';
}

/**
 * Classify disease activity from a numeric DAS28 score.
 * Boundaries: <2.6 remission, <3.2 low, <=5.1 moderate, >5.1 high.
 * @param {number | null} das28
 * @returns {DiseaseActivity | null}
 */
function classifyDiseaseActivity(das28) {
  if (das28 === null || das28 === undefined) return null;
  if (das28 < 2.6) return 'remission';
  if (das28 < 3.2) return 'low';
  if (das28 <= 5.1) return 'moderate';
  return 'high';
}

/**
 * Friendly label for a DiseaseActivity.
 * @param {DiseaseActivity | null} activity
 */
function diseaseActivityLabel(activity) {
  switch (activity) {
    case 'remission': return 'Remission';
    case 'low': return 'Low Disease Activity';
    case 'moderate': return 'Moderate Disease Activity';
    case 'high': return 'High Disease Activity';
    default: return 'Not calculated';
  }
}

/**
 * CSS class hint for the activity badge.
 * @param {DiseaseActivity | null} activity
 */
function diseaseActivityClass(activity) {
  switch (activity) {
    case 'remission': return 'activity-remission';
    case 'low': return 'activity-low';
    case 'moderate': return 'activity-moderate';
    case 'high': return 'activity-high';
    default: return 'activity-none';
  }
}

Object.assign(window.RheumatologyAssessment, {
  emptyAssessment,
  calculateBMI,
  bmiCategory,
  classifyDiseaseActivity,
  diseaseActivityLabel,
  diseaseActivityClass
});
})();
