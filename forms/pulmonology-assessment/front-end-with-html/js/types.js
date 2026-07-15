// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Pulmonology Assessment form.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'mild' | 'moderate' | 'anaphylaxis' | ''} AllergySeverity
 * @typedef {'current' | 'ex' | 'never' | ''} SmokingStatus
 * @typedef {'1' | '2' | '3' | '4' | '5' | ''} DyspnoeaGrade
 * @typedef {'none' | 'occasional' | 'daily' | 'copious' | ''} SputumFrequency
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
 * @property {string} primarySymptom
 * @property {string} symptomDuration
 * @property {DyspnoeaGrade} dyspnoeaGradeMRC
 */

/**
 * @typedef {Object} Spirometry
 * @property {number | null} fev1
 * @property {number | null} fvc
 * @property {number | null} fev1FvcRatio
 * @property {number | null} fev1PercentPredicted
 * @property {YesNo} bronchodilatorResponse
 */

/**
 * @typedef {Object} SymptomAssessment
 * @property {number | null} catScore
 * @property {DyspnoeaGrade} mmrcDyspnoea
 * @property {'none' | 'occasional' | 'daily' | 'persistent' | ''} coughFrequency
 * @property {SputumFrequency} sputumProduction
 */

/**
 * @typedef {Object} ExacerbationHistory
 * @property {number | null} exacerbationsPerYear
 * @property {number | null} hospitalizationsPerYear
 * @property {number | null} icuAdmissions
 * @property {YesNo} intubationHistory
 */

/**
 * @typedef {Object} Medication
 * @property {string} name
 * @property {string} dose
 * @property {string} frequency
 */

/**
 * @typedef {Object} CurrentMedications
 * @property {YesNo} saba
 * @property {YesNo} laba
 * @property {YesNo} lama
 * @property {YesNo} ics
 * @property {YesNo} oralCorticosteroids
 * @property {YesNo} oxygenTherapy
 * @property {number | null} oxygenLitresPerMinute
 * @property {YesNo} nebulizers
 * @property {Medication[]} otherMedications
 */

/**
 * @typedef {Object} Allergy
 * @property {string} allergen
 * @property {string} reaction
 * @property {AllergySeverity} severity
 */

/**
 * @typedef {Object} Comorbidities
 * @property {YesNo} cardiovascularDisease
 * @property {string} cardiovascularDetails
 * @property {YesNo} diabetes
 * @property {YesNo} osteoporosis
 * @property {YesNo} depression
 * @property {YesNo} lungCancer
 * @property {string} lungCancerDetails
 * @property {string} otherComorbidities
 */

/**
 * @typedef {Object} SmokingExposures
 * @property {SmokingStatus} smokingStatus
 * @property {number | null} packYears
 * @property {YesNo} occupationalExposures
 * @property {string} occupationalDetails
 * @property {YesNo} biomassFuelExposure
 */

/**
 * @typedef {Object} FunctionalStatus
 * @property {'unable' | 'light-housework' | 'climb-stairs' | 'moderate-exercise' | 'vigorous-exercise' | ''} exerciseTolerance
 * @property {number | null} sixMinuteWalkDistance
 * @property {number | null} oxygenSaturationRest
 * @property {number | null} oxygenSaturationExertion
 * @property {YesNo} adlLimitations
 * @property {string} adlDetails
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {ChiefComplaint} chiefComplaint
 * @property {Spirometry} spirometry
 * @property {SymptomAssessment} symptomAssessment
 * @property {ExacerbationHistory} exacerbationHistory
 * @property {CurrentMedications} currentMedications
 * @property {Allergy[]} allergies
 * @property {Comorbidities} comorbidities
 * @property {SmokingExposures} smokingExposures
 * @property {FunctionalStatus} functionalStatus
 */

/**
 * @typedef {1 | 2 | 3 | 4} GoldStage
 * @typedef {'A' | 'B' | 'E'} AbcdGroup
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} system
 * @property {string} description
 * @property {GoldStage} stage
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
 * @property {GoldStage} goldStage
 * @property {AbcdGroup} abcdGroup
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
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
      dateOfBirth: '',
      sex: '',
      weight: null,
      height: null,
      bmi: null
    },
    chiefComplaint: {
      primarySymptom: '',
      symptomDuration: '',
      dyspnoeaGradeMRC: ''
    },
    spirometry: {
      fev1: null,
      fvc: null,
      fev1FvcRatio: null,
      fev1PercentPredicted: null,
      bronchodilatorResponse: ''
    },
    symptomAssessment: {
      catScore: null,
      mmrcDyspnoea: '',
      coughFrequency: '',
      sputumProduction: ''
    },
    exacerbationHistory: {
      exacerbationsPerYear: null,
      hospitalizationsPerYear: null,
      icuAdmissions: null,
      intubationHistory: ''
    },
    currentMedications: {
      saba: '',
      laba: '',
      lama: '',
      ics: '',
      oralCorticosteroids: '',
      oxygenTherapy: '',
      oxygenLitresPerMinute: null,
      nebulizers: '',
      otherMedications: []
    },
    allergies: [],
    comorbidities: {
      cardiovascularDisease: '',
      cardiovascularDetails: '',
      diabetes: '',
      osteoporosis: '',
      depression: '',
      lungCancer: '',
      lungCancerDetails: '',
      otherComorbidities: ''
    },
    smokingExposures: {
      smokingStatus: '',
      packYears: null,
      occupationalExposures: '',
      occupationalDetails: '',
      biomassFuelExposure: ''
    },
    functionalStatus: {
      exerciseTolerance: '',
      sixMinuteWalkDistance: null,
      oxygenSaturationRest: null,
      oxygenSaturationExertion: null,
      adlLimitations: '',
      adlDetails: ''
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

/** Calculate FEV1/FVC ratio rounded to two decimals. */
function calculateFev1FvcRatio(fev1, fvc) {
  if (fev1 == null || fvc == null || fvc <= 0) return null;
  return Math.round((fev1 / fvc) * 100) / 100;
}

/** Friendly label for a GOLD stage. */
function goldStageLabel(stage) {
  switch (stage) {
    case 1: return 'GOLD I - Mild';
    case 2: return 'GOLD II - Moderate';
    case 3: return 'GOLD III - Severe';
    case 4: return 'GOLD IV - Very Severe';
    default: return `GOLD ${stage}`;
  }
}

/** CSS class hint for the GOLD stage badge. */
function goldStageClass(stage) {
  switch (stage) {
    case 1: return 'gold-1';
    case 2: return 'gold-2';
    case 3: return 'gold-3';
    case 4: return 'gold-4';
    default: return 'gold-x';
  }
}

/** Friendly label for an ABCD group. */
function abcdGroupLabel(group) {
  switch (group) {
    case 'A': return 'Group A - Low risk, fewer symptoms';
    case 'B': return 'Group B - Low risk, more symptoms';
    case 'E': return 'Group E - Exacerbation history';
    default: return `Group ${group}`;
  }
}

/**
 * Determine ABCD Group from symptoms (CAT/mMRC) and exacerbation history.
 * Mirrors `utils.ts` `determineAbcdGroup`.
 * @param {number | null} catScore
 * @param {string} mmrcDyspnoea
 * @param {number | null} exacerbationsPerYear
 * @param {number | null} hospitalizationsPerYear
 * @returns {AbcdGroup}
 */
function determineAbcdGroup(catScore, mmrcDyspnoea, exacerbationsPerYear, hospitalizationsPerYear) {
  const highSymptoms =
    (catScore !== null && catScore >= 10) ||
    (mmrcDyspnoea >= '2');
  const highExacerbations =
    (exacerbationsPerYear !== null && exacerbationsPerYear >= 2) ||
    (hospitalizationsPerYear !== null && hospitalizationsPerYear >= 1);
  if (highExacerbations) return 'E';
  if (highSymptoms) return 'B';
  return 'A';
}

/** Plain-language label for the CAT impact band. */
function catImpactLabel(score) {
  if (score === null || score === undefined) return '';
  if (score < 10) return 'Low impact';
  if (score < 20) return 'Medium impact';
  if (score < 30) return 'High impact';
  return 'Very high impact';
}

export { emptyAssessment, calculateBMI, bmiCategory, calculateFev1FvcRatio, goldStageLabel, goldStageClass, abcdGroupLabel, determineAbcdGroup, catImpactLabel };
