// Plain-JavaScript / JSDoc type definitions and helpers mirroring the
// SvelteKit `src/lib/engine/types.ts` + `utils.ts` data model for the
// Predicting Risk of Cardiovascular Disease Events (PREVENT) form.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.

/**
 * @typedef {Object} PatientInformation
 * @property {string} fullName
 * @property {string} dateOfBirth
 * @property {string} nhsNumber
 * @property {string} address
 * @property {string} telephone
 * @property {string} email
 * @property {string} gpName
 * @property {string} gpPractice
 */

/**
 * @typedef {Object} Demographics
 * @property {number | null} age
 * @property {string} sex
 * @property {string} ethnicity
 * @property {number | null} heightCm
 * @property {number | null} weightKg
 * @property {string} zipCode
 */

/**
 * @typedef {Object} BloodPressure
 * @property {number | null} systolicBp
 * @property {number | null} diastolicBp
 * @property {string} onAntihypertensive
 * @property {number | null} numberOfBpMedications
 * @property {string} bpAtTarget
 */

/**
 * @typedef {Object} CholesterolLipids
 * @property {number | null} totalCholesterol
 * @property {number | null} hdlCholesterol
 * @property {number | null} ldlCholesterol
 * @property {number | null} triglycerides
 * @property {number | null} nonHdlCholesterol
 * @property {string} onStatin
 * @property {string} statinName
 */

/**
 * @typedef {Object} MetabolicHealth
 * @property {string} hasDiabetes
 * @property {string} diabetesType
 * @property {number | null} hba1cValue
 * @property {string} hba1cUnit
 * @property {number | null} fastingGlucose
 * @property {number | null} bmi
 * @property {number | null} waistCircumferenceCm
 */

/**
 * @typedef {Object} RenalFunction
 * @property {number | null} egfr
 * @property {number | null} creatinine
 * @property {number | null} urineAcr
 * @property {string} ckdStage
 */

/**
 * @typedef {Object} SmokingHistory
 * @property {string} smokingStatus
 * @property {number | null} cigarettesPerDay
 * @property {number | null} yearsSmoked
 * @property {number | null} yearsSinceQuit
 */

/**
 * @typedef {Object} MedicalHistory
 * @property {string} hasKnownCvd
 * @property {string} previousMi
 * @property {string} previousStroke
 * @property {string} heartFailure
 * @property {string} atrialFibrillation
 * @property {string} peripheralArterialDisease
 * @property {string} familyCvdHistory
 * @property {string} familyCvdDetails
 */

/**
 * @typedef {Object} CurrentMedications
 * @property {string} onAntihypertensiveDetail
 * @property {string} onStatinDetail
 * @property {string} onAspirin
 * @property {string} onAnticoagulant
 * @property {string} onDiabetesMedication
 * @property {string} otherMedications
 */

/**
 * @typedef {Object} ReviewCalculate
 * @property {string} modelType
 * @property {string} clinicianName
 * @property {string} reviewDate
 * @property {string} clinicalNotes
 */

/**
 * @typedef {Object} AssessmentData
 * @property {PatientInformation} patientInformation
 * @property {Demographics} demographics
 * @property {BloodPressure} bloodPressure
 * @property {CholesterolLipids} cholesterolLipids
 * @property {MetabolicHealth} metabolicHealth
 * @property {RenalFunction} renalFunction
 * @property {SmokingHistory} smokingHistory
 * @property {MedicalHistory} medicalHistory
 * @property {CurrentMedications} currentMedications
 * @property {ReviewCalculate} reviewCalculate
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {string} riskLevel
 */

/**
 * @typedef {Object} AdditionalFlag
 * @property {string} id
 * @property {string} category
 * @property {string} message
 * @property {string} priority
 */

/**
 * @typedef {Object} GradingResult
 * @property {string} riskCategory
 * @property {number} tenYearRiskPercent
 * @property {number} thirtyYearRiskPercent
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.PredictingRiskOfCardiovascularDiseaseEvents`.
(function () {
'use strict';
window.PredictingRiskOfCardiovascularDiseaseEvents =
  window.PredictingRiskOfCardiovascularDiseaseEvents || {};

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric fields default to `null`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    patientInformation: {
      fullName: '',
      dateOfBirth: '',
      nhsNumber: '',
      address: '',
      telephone: '',
      email: '',
      gpName: '',
      gpPractice: ''
    },
    demographics: {
      age: null,
      sex: '',
      ethnicity: '',
      heightCm: null,
      weightKg: null,
      zipCode: ''
    },
    bloodPressure: {
      systolicBp: null,
      diastolicBp: null,
      onAntihypertensive: '',
      numberOfBpMedications: null,
      bpAtTarget: ''
    },
    cholesterolLipids: {
      totalCholesterol: null,
      hdlCholesterol: null,
      ldlCholesterol: null,
      triglycerides: null,
      nonHdlCholesterol: null,
      onStatin: '',
      statinName: ''
    },
    metabolicHealth: {
      hasDiabetes: '',
      diabetesType: '',
      hba1cValue: null,
      hba1cUnit: '',
      fastingGlucose: null,
      bmi: null,
      waistCircumferenceCm: null
    },
    renalFunction: {
      egfr: null,
      creatinine: null,
      urineAcr: null,
      ckdStage: ''
    },
    smokingHistory: {
      smokingStatus: '',
      cigarettesPerDay: null,
      yearsSmoked: null,
      yearsSinceQuit: null
    },
    medicalHistory: {
      hasKnownCvd: '',
      previousMi: '',
      previousStroke: '',
      heartFailure: '',
      atrialFibrillation: '',
      peripheralArterialDisease: '',
      familyCvdHistory: '',
      familyCvdDetails: ''
    },
    currentMedications: {
      onAntihypertensiveDetail: '',
      onStatinDetail: '',
      onAspirin: '',
      onAnticoagulant: '',
      onDiabetesMedication: '',
      otherMedications: ''
    },
    reviewCalculate: {
      modelType: '',
      clinicianName: '',
      reviewDate: '',
      clinicalNotes: ''
    }
  };
}

/** Calculate BMI from height (cm) and weight (kg). Returns null if invalid. */
function calculateBmi(heightCm, weightKg) {
  if (heightCm === null || heightCm === undefined ||
      weightKg === null || weightKg === undefined ||
      heightCm <= 0) {
    return null;
  }
  const heightM = heightCm / 100.0;
  return Math.round((weightKg / (heightM * heightM)) * 10.0) / 10.0;
}

/** Determine if the patient is a current smoker based on smoking status string. */
function isSmoker(status) {
  const lower = String(status || '').toLowerCase();
  return lower === 'current' || lower === 'yes' || lower === 'currentsmoker';
}

/** Check if the assessment is likely a draft (missing key required fields). */
function isLikelyDraft(data) {
  return data.demographics.age === null && data.demographics.sex === '';
}

/**
 * Convert HbA1c from mmol/mol to percent if needed.
 * If unit is "mmolMol", converts using IFCC formula: % = (mmol/mol / 10.929) + 2.15
 * Otherwise returns value as-is (assumed to be in %).
 */
function hba1cToPercent(value, unit) {
  if (value === null || value === undefined) return null;
  if (unit === 'mmolMol' || unit === 'mmol/mol') {
    return value / 10.929 + 2.15;
  }
  return value;
}

/**
 * Estimate 10-year CVD risk using a point-based scoring system
 * that approximates the PREVENT Base model outcomes.
 * Mirrors the Svelte engine's utils.estimateTenYearRisk().
 */
function estimateTenYearRisk(data) {
  const age = data.demographics.age;
  if (age === null || age === undefined) return 0.0;

  const isMale = String(data.demographics.sex || '').toLowerCase() === 'male';

  let points;
  if (isMale) {
    if (age >= 75) points = 16.0;
    else if (age >= 70) points = 14.0;
    else if (age >= 65) points = 12.0;
    else if (age >= 60) points = 10.0;
    else if (age >= 55) points = 8.0;
    else if (age >= 50) points = 6.0;
    else if (age >= 45) points = 4.0;
    else if (age >= 40) points = 2.0;
    else points = 0.0;
  } else {
    if (age >= 75) points = 13.0;
    else if (age >= 70) points = 11.0;
    else if (age >= 65) points = 9.0;
    else if (age >= 60) points = 7.0;
    else if (age >= 55) points = 5.0;
    else if (age >= 50) points = 4.0;
    else if (age >= 45) points = 2.0;
    else if (age >= 40) points = 1.0;
    else points = 0.0;
  }

  const tc = data.cholesterolLipids.totalCholesterol;
  if (tc !== null && tc !== undefined) {
    if (tc >= 280.0) points += 3.0;
    else if (tc >= 240.0) points += 2.0;
    else if (tc >= 200.0) points += 1.0;
  }

  const hdl = data.cholesterolLipids.hdlCholesterol;
  if (hdl !== null && hdl !== undefined) {
    if (hdl < 35.0) points += 3.0;
    else if (hdl < 40.0) points += 2.0;
    else if (hdl < 50.0) points += 1.0;
    else if (hdl >= 60.0) points -= 1.0;
  }

  const sbp = data.bloodPressure.systolicBp;
  if (sbp !== null && sbp !== undefined) {
    if (sbp >= 180.0) points += 5.0;
    else if (sbp >= 160.0) points += 4.0;
    else if (sbp >= 140.0) points += 3.0;
    else if (sbp >= 130.0) points += 2.0;
    else if (sbp >= 120.0) points += 1.0;
  }

  if (data.metabolicHealth.hasDiabetes === 'yes') points += 3.0;
  if (isSmoker(data.smokingHistory.smokingStatus)) points += 3.0;

  const egfr = data.renalFunction.egfr;
  if (egfr !== null && egfr !== undefined) {
    if (egfr < 30.0) points += 4.0;
    else if (egfr < 45.0) points += 3.0;
    else if (egfr < 60.0) points += 2.0;
    else if (egfr < 90.0) points += 1.0;
  }

  const bmi = (data.metabolicHealth.bmi !== null && data.metabolicHealth.bmi !== undefined)
    ? data.metabolicHealth.bmi
    : calculateBmi(data.demographics.heightCm, data.demographics.weightKg);
  if (bmi !== null && bmi !== undefined) {
    if (bmi >= 35.0) points += 3.0;
    else if (bmi >= 30.0) points += 2.0;
    else if (bmi >= 25.0) points += 1.0;
  }

  if (data.bloodPressure.onAntihypertensive === 'yes') points += 1.0;
  if (data.cholesterolLipids.onStatin === 'yes') points += 0.5;

  let risk = 0.5 * Math.exp(0.18 * points);
  risk = Math.round(risk * 10.0) / 10.0;
  return Math.max(0.1, Math.min(95.0, risk));
}

/** Estimate 30-year risk from 10-year risk. */
function estimateThirtyYearRisk(tenYear) {
  let thirty = tenYear * 2.5;
  thirty = Math.round(thirty * 10.0) / 10.0;
  return Math.min(95.0, thirty);
}

/** Returns a human-readable label for a risk category. */
function riskCategoryLabel(level) {
  switch (level) {
    case 'low': return 'Low Risk';
    case 'borderline': return 'Borderline Risk';
    case 'intermediate': return 'Intermediate Risk';
    case 'high': return 'High Risk';
    case 'draft': return 'Draft';
    default: return 'Unknown';
  }
}

/** CSS class name suffix for a risk category badge. */
function riskCategoryClass(level) {
  switch (level) {
    case 'low': return 'risk-low';
    case 'borderline': return 'risk-borderline';
    case 'intermediate': return 'risk-intermediate';
    case 'high': return 'risk-high';
    case 'draft': return 'risk-draft';
    default: return 'risk-draft';
  }
}

Object.assign(window.PredictingRiskOfCardiovascularDiseaseEvents, {
  emptyAssessment,
  calculateBmi,
  isSmoker,
  isLikelyDraft,
  hba1cToPercent,
  estimateTenYearRisk,
  estimateThirtyYearRisk,
  riskCategoryLabel,
  riskCategoryClass
});
})();
