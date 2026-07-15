// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Semaglutide Assessment form.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'type2-diabetes' | 'weight-management' | 'cardiovascular-risk-reduction' | ''} PrimaryIndication
 * @typedef {'low' | 'moderate' | 'high' | ''} MotivationLevel
 * @typedef {'subcutaneous-weekly' | 'oral-daily' | ''} SelectedFormulation
 * @typedef {'Eligible' | 'Conditional' | 'Ineligible'} EligibilityStatus
 */

/**
 * @typedef {Object} Demographics
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dob
 * @property {Sex} sex
 */

/**
 * @typedef {Object} IndicationGoals
 * @property {PrimaryIndication} primaryIndication
 * @property {number | null} weightLossGoalPercent
 * @property {string} previousWeightLossAttempts
 * @property {MotivationLevel} motivationLevel
 */

/**
 * @typedef {Object} BodyComposition
 * @property {number | null} heightCm
 * @property {number | null} weightKg
 * @property {number | null} bmi
 * @property {number | null} waistCircumference
 * @property {number | null} bodyFatPercent
 * @property {number | null} previousMaxWeight
 */

/**
 * @typedef {Object} MetabolicProfile
 * @property {number | null} hba1c
 * @property {number | null} fastingGlucose
 * @property {number | null} insulinLevel
 * @property {number | null} totalCholesterol
 * @property {number | null} ldl
 * @property {number | null} hdl
 * @property {number | null} triglycerides
 * @property {string} thyroidFunction
 */

/**
 * @typedef {Object} CardiovascularRisk
 * @property {number | null} bloodPressureSystolic
 * @property {number | null} bloodPressureDiastolic
 * @property {number | null} heartRate
 * @property {YesNo} previousMI
 * @property {YesNo} heartFailure
 * @property {YesNo} peripheralVascularDisease
 * @property {YesNo} cerebrovascularDisease
 * @property {number | null} qriskScore
 */

/**
 * @typedef {Object} ContraindicationsScreening
 * @property {YesNo} personalHistoryMTC
 * @property {YesNo} familyHistoryMTC
 * @property {YesNo} men2Syndrome
 * @property {YesNo} pancreatitisHistory
 * @property {YesNo} severeGIDisease
 * @property {YesNo} pregnancyPlanned
 * @property {YesNo} breastfeeding
 * @property {YesNo} type1Diabetes
 * @property {YesNo} diabeticRetinopathySevere
 * @property {YesNo} allergySemaglutide
 */

/**
 * @typedef {Object} GastrointestinalHistory
 * @property {YesNo} nauseaHistory
 * @property {YesNo} vomitingHistory
 * @property {YesNo} gastroparesis
 * @property {YesNo} gallstoneHistory
 * @property {YesNo} ibd
 * @property {YesNo} gerdHistory
 * @property {YesNo} previousBariatricSurgery
 * @property {string} currentGISymptoms
 */

/**
 * @typedef {Object} Medication
 * @property {string} name
 * @property {string} dose
 * @property {string} frequency
 */

/**
 * @typedef {Object} CurrentMedications
 * @property {YesNo} insulinTherapy
 * @property {string} insulinType
 * @property {YesNo} sulfonylureas
 * @property {Medication[]} otherDiabetesMedications
 * @property {Medication[]} antihypertensives
 * @property {Medication[]} lipidLowering
 * @property {Medication[]} otherMedications
 */

/**
 * @typedef {Object} MentalHealthScreening
 * @property {YesNo} eatingDisorderHistory
 * @property {string} eatingDisorderDetails
 * @property {YesNo} depressionHistory
 * @property {YesNo} suicidalIdeation
 * @property {YesNo} bodyDysmorphia
 * @property {YesNo} bingeDrinkingHistory
 * @property {string} currentMentalHealthTreatment
 */

/**
 * @typedef {Object} TreatmentPlan
 * @property {SelectedFormulation} selectedFormulation
 * @property {string} startingDose
 * @property {string} titrationSchedule
 * @property {string} monitoringFrequency
 * @property {YesNo} dietaryGuidance
 * @property {YesNo} exercisePlan
 * @property {number | null} followUpWeeks
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {IndicationGoals} indicationGoals
 * @property {BodyComposition} bodyComposition
 * @property {MetabolicProfile} metabolicProfile
 * @property {CardiovascularRisk} cardiovascularRisk
 * @property {ContraindicationsScreening} contraindicationsScreening
 * @property {GastrointestinalHistory} gastrointestinalHistory
 * @property {CurrentMedications} currentMedications
 * @property {MentalHealthScreening} mentalHealthScreening
 * @property {TreatmentPlan} treatmentPlan
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {'absolute' | 'relative'} type
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
 * @property {EligibilityStatus} eligibilityStatus
 * @property {number | null} bmi
 * @property {string} bmiCategoryLabel
 * @property {FiredRule[]} absoluteContraindications
 * @property {FiredRule[]} relativeContraindications
 * @property {AdditionalFlag[]} monitoringFlags
 * @property {string} timestamp
 */

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
      dob: '',
      sex: ''
    },
    indicationGoals: {
      primaryIndication: '',
      weightLossGoalPercent: null,
      previousWeightLossAttempts: '',
      motivationLevel: ''
    },
    bodyComposition: {
      heightCm: null,
      weightKg: null,
      bmi: null,
      waistCircumference: null,
      bodyFatPercent: null,
      previousMaxWeight: null
    },
    metabolicProfile: {
      hba1c: null,
      fastingGlucose: null,
      insulinLevel: null,
      totalCholesterol: null,
      ldl: null,
      hdl: null,
      triglycerides: null,
      thyroidFunction: ''
    },
    cardiovascularRisk: {
      bloodPressureSystolic: null,
      bloodPressureDiastolic: null,
      heartRate: null,
      previousMI: '',
      heartFailure: '',
      peripheralVascularDisease: '',
      cerebrovascularDisease: '',
      qriskScore: null
    },
    contraindicationsScreening: {
      personalHistoryMTC: '',
      familyHistoryMTC: '',
      men2Syndrome: '',
      pancreatitisHistory: '',
      severeGIDisease: '',
      pregnancyPlanned: '',
      breastfeeding: '',
      type1Diabetes: '',
      diabeticRetinopathySevere: '',
      allergySemaglutide: ''
    },
    gastrointestinalHistory: {
      nauseaHistory: '',
      vomitingHistory: '',
      gastroparesis: '',
      gallstoneHistory: '',
      ibd: '',
      gerdHistory: '',
      previousBariatricSurgery: '',
      currentGISymptoms: ''
    },
    currentMedications: {
      insulinTherapy: '',
      insulinType: '',
      sulfonylureas: '',
      otherDiabetesMedications: [],
      antihypertensives: [],
      lipidLowering: [],
      otherMedications: []
    },
    mentalHealthScreening: {
      eatingDisorderHistory: '',
      eatingDisorderDetails: '',
      depressionHistory: '',
      suicidalIdeation: '',
      bodyDysmorphia: '',
      bingeDrinkingHistory: '',
      currentMentalHealthTreatment: ''
    },
    treatmentPlan: {
      selectedFormulation: '',
      startingDose: '',
      titrationSchedule: '',
      monitoringFrequency: '',
      dietaryGuidance: '',
      exercisePlan: '',
      followUpWeeks: null
    }
  };
}

/** Calculate age from a date-of-birth ISO string. Returns null if invalid. */
function calculateAge(dob) {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

/** Calculate BMI from height (cm) and weight (kg). Returns null if invalid. */
function calculateBMI(heightCm, weightKg) {
  if (heightCm === null || weightKg === null) return null;
  if (heightCm === undefined || weightKg === undefined) return null;
  if (heightCm <= 0 || weightKg <= 0) return null;
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

/**
 * BMI category label.
 *   <18.5     = Underweight
 *   18.5-24.9 = Normal weight
 *   25-29.9   = Overweight
 *   30-34.9   = Obesity class I
 *   35-39.9   = Obesity class II
 *   >=40      = Obesity class III (severe)
 * @param {number} bmi
 */
function bmiCategory(bmi) {
  if (bmi === null || bmi === undefined) return '';
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  if (bmi < 35) return 'Obesity class I';
  if (bmi < 40) return 'Obesity class II';
  return 'Obesity class III (severe)';
}

/**
 * Friendly label for an EligibilityStatus.
 * @param {EligibilityStatus | string} status
 */
function eligibilityLabel(status) {
  switch (status) {
    case 'Eligible': return 'Eligible for Semaglutide';
    case 'Conditional': return 'Conditional - Requires Clinical Review';
    case 'Ineligible': return 'Ineligible for Semaglutide';
    default: return '';
  }
}

/**
 * CSS class hint for the eligibility badge.
 * @param {EligibilityStatus | string} status
 */
function eligibilityClass(status) {
  switch (status) {
    case 'Eligible': return 'eligibility-eligible';
    case 'Conditional': return 'eligibility-conditional';
    case 'Ineligible': return 'eligibility-ineligible';
    default: return '';
  }
}

export { emptyAssessment, calculateAge, calculateBMI, bmiCategory, eligibilityLabel, eligibilityClass };
