// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Asthma Assessment form.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'mild' | 'moderate' | 'anaphylaxis' | ''} AllergySeverity
 * @typedef {'current' | 'ex' | 'never' | ''} SmokingStatus
 * @typedef {'current' | 'ex' | 'never' | ''} VapingStatus
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
 * @typedef {Object} SymptomFrequency
 * @property {string} daytimeSymptoms
 * @property {string} nighttimeAwakening
 * @property {string} rescueInhalerUse
 * @property {string} activityLimitation
 * @property {string} selfRatedControl
 */

/**
 * @typedef {Object} LungFunction
 * @property {number | null} fev1Percent
 * @property {number | null} fev1Fvc
 * @property {number | null} peakFlowBest
 * @property {number | null} peakFlowCurrent
 * @property {number | null} peakFlowPercent
 * @property {string} spirometryDate
 * @property {string} spirometryNotes
 */

/**
 * @typedef {Object} Triggers
 * @property {YesNo} allergens
 * @property {string} allergenDetails
 * @property {YesNo} exercise
 * @property {YesNo} weather
 * @property {string} weatherDetails
 * @property {YesNo} occupational
 * @property {string} occupationalDetails
 * @property {YesNo} infections
 * @property {YesNo} smoke
 * @property {YesNo} stress
 * @property {YesNo} medications
 * @property {string} medicationDetails
 * @property {string} otherTriggers
 */

/**
 * @typedef {Object} Medication
 * @property {string} name
 * @property {string} dose
 * @property {string} frequency
 */

/**
 * @typedef {Object} CurrentMedications
 * @property {Medication[]} controllerMedications
 * @property {Medication[]} rescueInhalers
 * @property {Medication[]} biologics
 * @property {YesNo} oralSteroids
 * @property {string} oralSteroidDetails
 * @property {YesNo} inhalerTechniqueReviewed
 * @property {'good' | 'partial' | 'poor' | ''} medicationAdherence
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
 * @property {string[]} environmentalAllergies
 * @property {YesNo} allergyTestingDone
 * @property {string} allergyTestResults
 */

/**
 * @typedef {Object} ExacerbationHistory
 * @property {number | null} exacerbationsLastYear
 * @property {number | null} edVisitsLastYear
 * @property {number | null} hospitalisationsLastYear
 * @property {YesNo} icuAdmissions
 * @property {number | null} icuAdmissionCount
 * @property {YesNo} intubationHistory
 * @property {number | null} oralSteroidCoursesLastYear
 * @property {string} lastExacerbationDate
 */

/**
 * @typedef {Object} Comorbidities
 * @property {YesNo} allergicRhinitis
 * @property {YesNo} sinusitis
 * @property {YesNo} nasalPolyps
 * @property {YesNo} gord
 * @property {YesNo} obesity
 * @property {YesNo} anxiety
 * @property {YesNo} depression
 * @property {YesNo} eczema
 * @property {YesNo} sleepApnoea
 * @property {YesNo} vocalCordDysfunction
 * @property {string} otherComorbidities
 */

/**
 * @typedef {Object} SocialHistory
 * @property {SmokingStatus} smoking
 * @property {number | null} smokingPackYears
 * @property {VapingStatus} vaping
 * @property {YesNo} occupationalExposures
 * @property {string} occupationalExposureDetails
 * @property {string} homeEnvironment
 * @property {YesNo} pets
 * @property {string} petDetails
 * @property {YesNo} carpetInBedroom
 * @property {YesNo} moldExposure
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {SymptomFrequency} symptomFrequency
 * @property {LungFunction} lungFunction
 * @property {Triggers} triggers
 * @property {CurrentMedications} currentMedications
 * @property {Allergies} allergies
 * @property {ExacerbationHistory} exacerbationHistory
 * @property {Comorbidities} comorbidities
 * @property {SocialHistory} socialHistory
 */

/**
 * @typedef {'well-controlled' | 'well-controlled-but-could-be-better' |
 *           'not-well-controlled' | 'very-poorly-controlled'} ControlLevel
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {number} score
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
 * @property {number} actScore
 * @property {ControlLevel} controlLevel
 * @property {number} answeredCount
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.AsthmaAssessment`.
(function () {
'use strict';
window.AsthmaAssessment = window.AsthmaAssessment || {};

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
    symptomFrequency: {
      daytimeSymptoms: '',
      nighttimeAwakening: '',
      rescueInhalerUse: '',
      activityLimitation: '',
      selfRatedControl: ''
    },
    lungFunction: {
      fev1Percent: null,
      fev1Fvc: null,
      peakFlowBest: null,
      peakFlowCurrent: null,
      peakFlowPercent: null,
      spirometryDate: '',
      spirometryNotes: ''
    },
    triggers: {
      allergens: '',
      allergenDetails: '',
      exercise: '',
      weather: '',
      weatherDetails: '',
      occupational: '',
      occupationalDetails: '',
      infections: '',
      smoke: '',
      stress: '',
      medications: '',
      medicationDetails: '',
      otherTriggers: ''
    },
    currentMedications: {
      controllerMedications: [],
      rescueInhalers: [],
      biologics: [],
      oralSteroids: '',
      oralSteroidDetails: '',
      inhalerTechniqueReviewed: '',
      medicationAdherence: ''
    },
    allergies: {
      drugAllergies: [],
      environmentalAllergies: [],
      allergyTestingDone: '',
      allergyTestResults: ''
    },
    exacerbationHistory: {
      exacerbationsLastYear: null,
      edVisitsLastYear: null,
      hospitalisationsLastYear: null,
      icuAdmissions: '',
      icuAdmissionCount: null,
      intubationHistory: '',
      oralSteroidCoursesLastYear: null,
      lastExacerbationDate: ''
    },
    comorbidities: {
      allergicRhinitis: '',
      sinusitis: '',
      nasalPolyps: '',
      gord: '',
      obesity: '',
      anxiety: '',
      depression: '',
      eczema: '',
      sleepApnoea: '',
      vocalCordDysfunction: '',
      otherComorbidities: ''
    },
    socialHistory: {
      smoking: '',
      smokingPackYears: null,
      vaping: '',
      occupationalExposures: '',
      occupationalExposureDetails: '',
      homeEnvironment: '',
      pets: '',
      petDetails: '',
      carpetInBedroom: '',
      moldExposure: ''
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

/** Calculate peak flow percentage (current/best * 100). */
function calculatePeakFlowPercent(current, best) {
  if (!current || !best || best <= 0) return null;
  return Math.round((current / best) * 100);
}

/** Classify FEV1 percentage into severity. */
function fev1Severity(fev1Percent) {
  if (fev1Percent === null || fev1Percent === undefined) return '';
  if (fev1Percent >= 80) return 'Normal';
  if (fev1Percent >= 60) return 'Mild obstruction';
  if (fev1Percent >= 40) return 'Moderate obstruction';
  return 'Severe obstruction';
}

Object.assign(window.AsthmaAssessment, {
  emptyAssessment,
  calculateBMI,
  bmiCategory,
  calculatePeakFlowPercent,
  fev1Severity
});
})();
