// Plain-JavaScript / JSDoc type definitions for the Renal Assessment form.
//
// Mirrors the SvelteKit reference data model: nine sections covering
// demographics, presenting symptoms, CKD risk factors, physical examination,
// blood tests, urine tests, imaging & biopsy review, medication review, and
// clinical impression / KDIGO staging.
//
// The empty-assessment factory is the canonical source of truth for default
// values: strings default to '', numbers to null, lists to []. Existing
// localStorage state is rehydrated by merging over a fresh empty so newly
// added fields default correctly.

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'current' | 'ex' | 'never' | ''} SmokingStatus
 *
 * @typedef {'low' | 'moderate' | 'high' | 'very-high' | 'unknown'} RiskLevel
 * @typedef {'G1' | 'G2' | 'G3a' | 'G3b' | 'G4' | 'G5' | ''} GfrCategory
 * @typedef {'A1' | 'A2' | 'A3' | ''} AlbuminuriaCategory
 */

/**
 * @typedef {Object} Demographics
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {Sex} sex
 * @property {string} ethnicity
 * @property {number | null} age
 * @property {number | null} weight
 * @property {number | null} height
 * @property {number | null} bmi
 */

/**
 * @typedef {Object} PresentingSymptoms
 * @property {YesNo} fatigue
 * @property {YesNo} edema
 * @property {YesNo} foamyUrine
 * @property {YesNo} nocturia
 * @property {YesNo} hematuria
 * @property {YesNo} flankPain
 * @property {YesNo} reducedUrineOutput
 * @property {YesNo} pruritus
 * @property {YesNo} nauseaVomiting
 * @property {YesNo} appetiteLoss
 * @property {YesNo} dyspnea
 * @property {YesNo} confusion
 * @property {string} symptomDuration
 * @property {string} otherSymptoms
 */

/**
 * @typedef {Object} CKDRiskFactors
 * @property {YesNo} hypertension
 * @property {YesNo} diabetes
 * @property {string} diabetesType
 * @property {YesNo} cardiovascularDisease
 * @property {YesNo} familyHistoryCkd
 * @property {YesNo} familyHistoryPolycysticKidney
 * @property {YesNo} priorAki
 * @property {YesNo} kidneyStones
 * @property {YesNo} recurrentUti
 * @property {YesNo} autoimmuneDisease
 * @property {string} autoimmuneDetails
 * @property {YesNo} nephrotoxicDrugs
 * @property {string} nephrotoxicDrugDetails
 * @property {YesNo} nsaidUse
 * @property {SmokingStatus} smoking
 * @property {YesNo} obesity
 */

/**
 * @typedef {Object} PhysicalExamination
 * @property {number | null} systolicBp
 * @property {number | null} diastolicBp
 * @property {number | null} heartRate
 * @property {YesNo} peripheralEdema
 * @property {YesNo} pulmonaryEdema
 * @property {YesNo} jvdElevated
 * @property {YesNo} pallor
 * @property {YesNo} uremicSkin
 * @property {YesNo} flankTenderness
 * @property {YesNo} palpableKidneys
 * @property {YesNo} bladderDistension
 * @property {string} examNotes
 */

/**
 * @typedef {Object} BloodTests
 * @property {number | null} serumCreatinine
 * @property {number | null} egfr
 * @property {number | null} bun
 * @property {number | null} sodium
 * @property {number | null} potassium
 * @property {number | null} chloride
 * @property {number | null} bicarbonate
 * @property {number | null} calcium
 * @property {number | null} phosphate
 * @property {number | null} magnesium
 * @property {number | null} albumin
 * @property {number | null} hemoglobin
 * @property {number | null} hba1c
 * @property {number | null} pth
 * @property {number | null} vitaminD
 * @property {string} testDate
 */

/**
 * @typedef {Object} UrineTests
 * @property {number | null} acr
 * @property {number | null} pcr
 * @property {string} dipstickProtein
 * @property {string} dipstickBlood
 * @property {string} dipstickGlucose
 * @property {string} dipstickLeukocytes
 * @property {string} dipstickNitrites
 * @property {YesNo} microscopyCasts
 * @property {string} castType
 * @property {string} testDate
 */

/**
 * @typedef {Object} ImagingBiopsy
 * @property {YesNo} renalUltrasoundDone
 * @property {string} ultrasoundFindings
 * @property {number | null} rightKidneyLengthMm
 * @property {number | null} leftKidneyLengthMm
 * @property {YesNo} cysts
 * @property {YesNo} hydronephrosis
 * @property {YesNo} stones
 * @property {YesNo} ctOrMri
 * @property {string} ctMriFindings
 * @property {YesNo} biopsyDone
 * @property {string} biopsyResult
 * @property {string} biopsyDate
 */

/**
 * @typedef {Object} Medication
 * @property {string} name
 * @property {string} dose
 * @property {string} frequency
 */

/**
 * @typedef {Object} MedicationReview
 * @property {Medication[]} currentMedications
 * @property {YesNo} aceiArb
 * @property {YesNo} sglt2Inhibitor
 * @property {YesNo} diuretic
 * @property {YesNo} statin
 * @property {YesNo} phosphateBinder
 * @property {YesNo} erythropoietinAgent
 * @property {YesNo} doseAdjustmentsNeeded
 * @property {string} doseAdjustmentDetails
 * @property {YesNo} contrastImagingPlanned
 * @property {string} medicationNotes
 */

/**
 * @typedef {Object} ClinicalImpression
 * @property {GfrCategory} gfrCategory
 * @property {AlbuminuriaCategory} albuminuriaCategory
 * @property {string} suspectedEtiology
 * @property {YesNo} aksuperimposedOnCkd
 * @property {YesNo} nephrologyReferral
 * @property {string} referralUrgency
 * @property {YesNo} dialysisDiscussionNeeded
 * @property {YesNo} transplantCandidate
 * @property {string} managementPlan
 * @property {string} followUpInterval
 * @property {string} clinicianNotes
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {PresentingSymptoms} presentingSymptoms
 * @property {CKDRiskFactors} ckdRiskFactors
 * @property {PhysicalExamination} physicalExamination
 * @property {BloodTests} bloodTests
 * @property {UrineTests} urineTests
 * @property {ImagingBiopsy} imagingBiopsy
 * @property {MedicationReview} medicationReview
 * @property {ClinicalImpression} clinicalImpression
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {string} value
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
 * @property {GfrCategory} gfrCategory
 * @property {AlbuminuriaCategory} albuminuriaCategory
 * @property {RiskLevel} riskLevel
 * @property {number | null} egfr
 * @property {number | null} acr
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. Public symbols attach to a single global namespace,
// `window.RenalAssessment`.
(function () {
'use strict';
window.RenalAssessment = window.RenalAssessment || {};

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to ''; numeric fields default to null; lists default to [].
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    demographics: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      sex: '',
      ethnicity: '',
      age: null,
      weight: null,
      height: null,
      bmi: null
    },
    presentingSymptoms: {
      fatigue: '',
      edema: '',
      foamyUrine: '',
      nocturia: '',
      hematuria: '',
      flankPain: '',
      reducedUrineOutput: '',
      pruritus: '',
      nauseaVomiting: '',
      appetiteLoss: '',
      dyspnea: '',
      confusion: '',
      symptomDuration: '',
      otherSymptoms: ''
    },
    ckdRiskFactors: {
      hypertension: '',
      diabetes: '',
      diabetesType: '',
      cardiovascularDisease: '',
      familyHistoryCkd: '',
      familyHistoryPolycysticKidney: '',
      priorAki: '',
      kidneyStones: '',
      recurrentUti: '',
      autoimmuneDisease: '',
      autoimmuneDetails: '',
      nephrotoxicDrugs: '',
      nephrotoxicDrugDetails: '',
      nsaidUse: '',
      smoking: '',
      obesity: ''
    },
    physicalExamination: {
      systolicBp: null,
      diastolicBp: null,
      heartRate: null,
      peripheralEdema: '',
      pulmonaryEdema: '',
      jvdElevated: '',
      pallor: '',
      uremicSkin: '',
      flankTenderness: '',
      palpableKidneys: '',
      bladderDistension: '',
      examNotes: ''
    },
    bloodTests: {
      serumCreatinine: null,
      egfr: null,
      bun: null,
      sodium: null,
      potassium: null,
      chloride: null,
      bicarbonate: null,
      calcium: null,
      phosphate: null,
      magnesium: null,
      albumin: null,
      hemoglobin: null,
      hba1c: null,
      pth: null,
      vitaminD: null,
      testDate: ''
    },
    urineTests: {
      acr: null,
      pcr: null,
      dipstickProtein: '',
      dipstickBlood: '',
      dipstickGlucose: '',
      dipstickLeukocytes: '',
      dipstickNitrites: '',
      microscopyCasts: '',
      castType: '',
      testDate: ''
    },
    imagingBiopsy: {
      renalUltrasoundDone: '',
      ultrasoundFindings: '',
      rightKidneyLengthMm: null,
      leftKidneyLengthMm: null,
      cysts: '',
      hydronephrosis: '',
      stones: '',
      ctOrMri: '',
      ctMriFindings: '',
      biopsyDone: '',
      biopsyResult: '',
      biopsyDate: ''
    },
    medicationReview: {
      currentMedications: [],
      aceiArb: '',
      sglt2Inhibitor: '',
      diuretic: '',
      statin: '',
      phosphateBinder: '',
      erythropoietinAgent: '',
      doseAdjustmentsNeeded: '',
      doseAdjustmentDetails: '',
      contrastImagingPlanned: '',
      medicationNotes: ''
    },
    clinicalImpression: {
      gfrCategory: '',
      albuminuriaCategory: '',
      suspectedEtiology: '',
      aksuperimposedOnCkd: '',
      nephrologyReferral: '',
      referralUrgency: '',
      dialysisDiscussionNeeded: '',
      transplantCandidate: '',
      managementPlan: '',
      followUpInterval: '',
      clinicianNotes: ''
    }
  };
}

/** Calculate age in completed years from a date-of-birth string (YYYY-MM-DD). */
function calculateAge(dateOfBirth) {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  if (isNaN(dob.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age >= 0 ? age : null;
}

/** Calculate BMI from weight (kg) and height (cm). Returns null if invalid. */
function calculateBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) return null;
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

/** BMI category label. */
function bmiCategory(bmi) {
  if (bmi == null) return '';
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  if (bmi < 35) return 'Obese Class I';
  if (bmi < 40) return 'Obese Class II';
  return 'Obese Class III';
}

/**
 * Estimate GFR via the CKD-EPI 2021 race-free equation. Inputs:
 *  - serumCreatinine in mg/dL
 *  - age in years
 *  - sex 'male' | 'female' | 'other' (other treated as female)
 * Returns mL/min/1.73 m^2 rounded to one decimal, or null if inputs invalid.
 */
function estimateEgfrCkdEpi2021(serumCreatinine, age, sex) {
  if (!serumCreatinine || serumCreatinine <= 0) return null;
  if (!age || age <= 0) return null;
  const isFemale = sex === 'female' || sex === 'other';
  const k = isFemale ? 0.7 : 0.9;
  const alpha = isFemale ? -0.241 : -0.302;
  const sexFactor = isFemale ? 1.012 : 1.0;
  const scrK = serumCreatinine / k;
  const minTerm = Math.pow(Math.min(scrK, 1), alpha);
  const maxTerm = Math.pow(Math.max(scrK, 1), -1.200);
  const ageTerm = Math.pow(0.9938, age);
  const egfr = 142 * minTerm * maxTerm * ageTerm * sexFactor;
  return Math.round(egfr * 10) / 10;
}

/**
 * Map an eGFR (mL/min/1.73 m^2) to KDIGO GFR category.
 * @param {number | null} egfr
 * @returns {GfrCategory}
 */
function classifyGfrCategory(egfr) {
  if (egfr == null) return '';
  if (egfr >= 90) return 'G1';
  if (egfr >= 60) return 'G2';
  if (egfr >= 45) return 'G3a';
  if (egfr >= 30) return 'G3b';
  if (egfr >= 15) return 'G4';
  return 'G5';
}

/**
 * Map a urine ACR (mg/mmol) to KDIGO albuminuria category.
 * @param {number | null} acr
 * @returns {AlbuminuriaCategory}
 */
function classifyAlbuminuriaCategory(acr) {
  if (acr == null) return '';
  if (acr < 3) return 'A1';
  if (acr <= 30) return 'A2';
  return 'A3';
}

/** Friendly label for a GFR category. */
function gfrCategoryLabel(g) {
  switch (g) {
    case 'G1': return 'G1: Normal or high (>=90)';
    case 'G2': return 'G2: Mildly decreased (60-89)';
    case 'G3a': return 'G3a: Mild to moderately decreased (45-59)';
    case 'G3b': return 'G3b: Moderately to severely decreased (30-44)';
    case 'G4': return 'G4: Severely decreased (15-29)';
    case 'G5': return 'G5: Kidney failure (<15)';
    default: return '';
  }
}

/** Friendly label for an albuminuria category. */
function albuminuriaCategoryLabel(a) {
  switch (a) {
    case 'A1': return 'A1: Normal to mildly increased (<3 mg/mmol)';
    case 'A2': return 'A2: Moderately increased (3-30 mg/mmol)';
    case 'A3': return 'A3: Severely increased (>30 mg/mmol)';
    default: return '';
  }
}

Object.assign(window.RenalAssessment, {
  emptyAssessment,
  calculateAge,
  calculateBMI,
  bmiCategory,
  estimateEgfrCkdEpi2021,
  classifyGfrCategory,
  classifyAlbuminuriaCategory,
  gfrCategoryLabel,
  albuminuriaCategoryLabel
});
})();
