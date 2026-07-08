// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Prenatal Assessment form.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.

/**
 * @typedef {'female' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'mild' | 'moderate' | 'anaphylaxis' | ''} AllergySeverity
 * @typedef {'natural' | 'ivf' | 'iui' | 'icsi' | 'donor-egg' | 'donor-embryo' | 'other' | ''} ConceptionMethod
 * @typedef {'anterior' | 'posterior' | 'fundal' | 'lateral' | 'previa' | 'low-lying' | ''} PlacentaLocation
 * @typedef {'positive' | 'negative' | ''} RhFactor
 * @typedef {'A' | 'B' | 'AB' | 'O' | ''} BloodType
 * @typedef {'none' | 'mild' | 'moderate' | 'severe' | ''} AnxietyLevel
 * @typedef {'none' | 'light' | 'moderate' | 'vigorous' | ''} ExerciseLevel
 * @typedef {'poor' | 'fair' | 'good' | 'excellent' | ''} DietQuality
 * @typedef {'low' | 'moderate' | 'high' | 'very-high'} RiskLevel
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.PrenatalAssessment`.
(function () {
'use strict';
window.PrenatalAssessment = window.PrenatalAssessment || {};

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric fields default to `null`.
 */
function emptyAssessment() {
  return {
    demographics: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      sex: 'female'
    },
    pregnancyDetails: {
      gestationalWeeks: null,
      estimatedDueDate: '',
      conceptionMethod: '',
      multipleGestation: '',
      placentaLocation: ''
    },
    obstetricHistory: {
      gravida: null,
      para: null,
      abortions: null,
      livingChildren: null,
      previousComplications: {
        preeclampsia: '',
        gestationalDiabetes: '',
        pretermBirth: '',
        cesareanSection: ''
      }
    },
    medicalHistory: {
      chronicConditions: '',
      autoimmune: '',
      thyroid: '',
      diabetes: '',
      hypertension: ''
    },
    currentSymptoms: {
      nausea: '',
      bleeding: '',
      headache: '',
      visionChanges: '',
      edema: '',
      abdominalPain: '',
      reducedFetalMovement: ''
    },
    vitalSigns: {
      bloodPressureSystolic: null,
      bloodPressureDiastolic: null,
      weight: null,
      height: null,
      bmi: null,
      fundalHeight: null,
      fetalHeartRate: null
    },
    laboratoryResults: {
      bloodType: '',
      rhFactor: '',
      hemoglobin: null,
      glucose: null,
      urinalysis: '',
      gbs: ''
    },
    lifestyleNutrition: {
      smoking: '',
      alcohol: '',
      drugs: '',
      exercise: '',
      diet: '',
      supplements: '',
      folicAcid: ''
    },
    mentalHealthScreening: {
      edinburghScore: null,
      anxietyLevel: '',
      supportSystem: '',
      domesticViolenceScreen: ''
    },
    birthPlanPreferences: {
      deliveryPreference: '',
      painManagement: '',
      feedingPlan: '',
      specialRequests: ''
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
  return 'Obese Class III';
}

/**
 * Risk score category.
 *   0-2   = Low risk
 *   3-5   = Moderate risk
 *   6-9   = High risk
 *   10+   = Very high risk
 */
function riskCategory(score) {
  if (score <= 2) return 'low';
  if (score <= 5) return 'moderate';
  if (score <= 9) return 'high';
  return 'very-high';
}

/** Risk level display label. */
function riskLevelLabel(level) {
  switch (level) {
    case 'low': return 'Low Risk';
    case 'moderate': return 'Moderate Risk';
    case 'high': return 'High Risk';
    case 'very-high': return 'Very High Risk';
    default: return '';
  }
}

/** Risk level CSS class for the score badge. */
function riskLevelClass(level) {
  switch (level) {
    case 'low': return 'risk-low';
    case 'moderate': return 'risk-moderate';
    case 'high': return 'risk-high';
    case 'very-high': return 'risk-very-high';
    default: return '';
  }
}

/** Gestational weeks display label. */
function gestationalWeeksLabel(weeks) {
  if (weeks === null || weeks === undefined || weeks === '') return 'N/A';
  if (weeks < 14) return weeks + ' weeks (1st trimester)';
  if (weeks < 28) return weeks + ' weeks (2nd trimester)';
  return weeks + ' weeks (3rd trimester)';
}

Object.assign(window.PrenatalAssessment, {
  emptyAssessment,
  calculateBMI,
  bmiCategory,
  riskCategory,
  riskLevelLabel,
  riskLevelClass,
  gestationalWeeksLabel
});
})();
