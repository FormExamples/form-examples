// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Heart Health Check form.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage. It also exports
// the small pure helper functions (BMI, TC/HDL ratio, smoking points, draft
// detection, label formatters) that the grader and rules depend on.

/**
 * @typedef {Object} PatientInformation
 * @property {string} fullName
 * @property {string} dateOfBirth
 * @property {string} nhsNumber
 * @property {string} address
 * @property {string} postcode
 * @property {string} telephone
 * @property {string} email
 * @property {string} gpName
 * @property {string} gpPractice
 */

/**
 * @typedef {Object} DemographicsEthnicity
 * @property {number | null} age
 * @property {string} sex
 * @property {string} ethnicity
 * @property {number | null} townsendDeprivation
 */

/**
 * @typedef {Object} BloodPressure
 * @property {number | null} systolicBP
 * @property {number | null} systolicBPSD
 * @property {number | null} diastolicBP
 * @property {string} onBPTreatment
 * @property {number | null} numberOfBPMedications
 */

/**
 * @typedef {Object} Cholesterol
 * @property {number | null} totalCholesterol
 * @property {number | null} hdlCholesterol
 * @property {number | null} totalHDLRatio
 * @property {string} onStatin
 */

/**
 * @typedef {Object} MedicalConditions
 * @property {string} hasDiabetes
 * @property {string} hasAtrialFibrillation
 * @property {string} hasRheumatoidArthritis
 * @property {string} hasChronicKidneyDisease
 * @property {string} hasMigraine
 * @property {string} hasSevereMentalIllness
 * @property {string} hasErectileDysfunction
 * @property {string} onAtypicalAntipsychotic
 * @property {string} onCorticosteroids
 */

/**
 * @typedef {Object} FamilyHistory
 * @property {string} familyCVDUnder60
 * @property {string} familyCVDRelationship
 * @property {string} familyDiabetesHistory
 */

/**
 * @typedef {Object} SmokingAlcohol
 * @property {string} smokingStatus
 * @property {number | null} cigarettesPerDay
 * @property {number | null} yearsSinceQuit
 * @property {number | null} alcoholUnitsPerWeek
 * @property {string} alcoholFrequency
 */

/**
 * @typedef {Object} PhysicalActivityDiet
 * @property {number | null} physicalActivityMinutesPerWeek
 * @property {string} activityIntensity
 * @property {number | null} fruitVegPortionsPerDay
 * @property {string} dietQuality
 * @property {string} saltIntake
 */

/**
 * @typedef {Object} BodyMeasurements
 * @property {number | null} heightCm
 * @property {number | null} weightKg
 * @property {number | null} bmi
 * @property {number | null} waistCircumferenceCm
 */

/**
 * @typedef {Object} ReviewCalculate
 * @property {string} clinicianName
 * @property {string} reviewDate
 * @property {string} clinicalNotes
 * @property {number | null} auditScore
 */

/**
 * @typedef {Object} AssessmentData
 * @property {PatientInformation} patientInformation
 * @property {DemographicsEthnicity} demographicsEthnicity
 * @property {BloodPressure} bloodPressure
 * @property {Cholesterol} cholesterol
 * @property {MedicalConditions} medicalConditions
 * @property {FamilyHistory} familyHistory
 * @property {SmokingAlcohol} smokingAlcohol
 * @property {PhysicalActivityDiet} physicalActivityDiet
 * @property {BodyMeasurements} bodyMeasurements
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
 * @property {'high' | 'medium' | 'low'} priority
 */

/**
 * @typedef {Object} GradingResult
 * @property {string} riskCategory
 * @property {number} tenYearRiskPercent
 * @property {number | null} heartAge
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

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
      postcode: '',
      telephone: '',
      email: '',
      gpName: '',
      gpPractice: ''
    },
    demographicsEthnicity: {
      age: null,
      sex: '',
      ethnicity: '',
      townsendDeprivation: null
    },
    bloodPressure: {
      systolicBP: null,
      systolicBPSD: null,
      diastolicBP: null,
      onBPTreatment: '',
      numberOfBPMedications: null
    },
    cholesterol: {
      totalCholesterol: null,
      hdlCholesterol: null,
      totalHDLRatio: null,
      onStatin: ''
    },
    medicalConditions: {
      hasDiabetes: '',
      hasAtrialFibrillation: '',
      hasRheumatoidArthritis: '',
      hasChronicKidneyDisease: '',
      hasMigraine: '',
      hasSevereMentalIllness: '',
      hasErectileDysfunction: '',
      onAtypicalAntipsychotic: '',
      onCorticosteroids: ''
    },
    familyHistory: {
      familyCVDUnder60: '',
      familyCVDRelationship: '',
      familyDiabetesHistory: ''
    },
    smokingAlcohol: {
      smokingStatus: '',
      cigarettesPerDay: null,
      yearsSinceQuit: null,
      alcoholUnitsPerWeek: null,
      alcoholFrequency: ''
    },
    physicalActivityDiet: {
      physicalActivityMinutesPerWeek: null,
      activityIntensity: '',
      fruitVegPortionsPerDay: null,
      dietQuality: '',
      saltIntake: ''
    },
    bodyMeasurements: {
      heightCm: null,
      weightKg: null,
      bmi: null,
      waistCircumferenceCm: null
    },
    reviewCalculate: {
      clinicianName: '',
      reviewDate: '',
      clinicalNotes: '',
      auditScore: null
    }
  };
}

/** Calculate BMI from height (cm) and weight (kg). Returns null if invalid. */
function calculateBMI(heightCm, weightKg) {
  if (heightCm == null || weightKg == null || heightCm <= 0) return null;
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

/** BMI category label for display. */
function bmiCategory(bmi) {
  if (bmi == null) return '';
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  if (bmi < 35) return 'Obese class I';
  if (bmi < 40) return 'Obese class II';
  return 'Obese class III';
}

/** Calculate Total/HDL cholesterol ratio. Returns null if invalid. */
function calculateTcHdlRatio(tc, hdl) {
  if (tc == null || hdl == null || hdl <= 0) return null;
  return Math.round((tc / hdl) * 10) / 10;
}

/** True if the smoking status is one of light/moderate/heavy current smoker. */
function isSmoker(status) {
  return status === 'lightSmoker' || status === 'moderateSmoker' || status === 'heavySmoker';
}

/** Smoking points contribution mirrors the SvelteKit engine. */
function smokingPoints(status) {
  switch (status) {
    case 'heavySmoker': return 15;
    case 'moderateSmoker': return 10;
    case 'lightSmoker': return 5;
    case 'exSmoker': return 2;
    default: return 0;
  }
}

/**
 * A submission is "draft" when neither age nor sex is filled in: there is
 * not enough information to even attempt a risk estimate.
 * @param {AssessmentData} data
 */
function isLikelyDraft(data) {
  return data.demographicsEthnicity.age == null && data.demographicsEthnicity.sex === '';
}

/** Friendly label for a risk category. */
function riskCategoryLabel(level) {
  switch (level) {
    case 'low': return 'Low Risk';
    case 'moderate': return 'Moderate Risk';
    case 'high': return 'High Risk';
    case 'draft': return 'Draft';
    default: return 'Unknown';
  }
}

/** CSS class hint for the risk-category badge. */
function riskCategoryClass(level) {
  switch (level) {
    case 'low': return 'risk-low';
    case 'moderate': return 'risk-moderate';
    case 'high': return 'risk-high';
    case 'draft': return 'risk-draft';
    default: return '';
  }
}

export { emptyAssessment, calculateBMI, bmiCategory, calculateTcHdlRatio, isSmoker, smokingPoints, isLikelyDraft, riskCategoryLabel, riskCategoryClass };
