// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Endocrinology Assessment form.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'normal' | 'subclinical' | 'mild' | 'moderate' | 'severe' | ''} AxisStatus
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
 * @property {string} ethnicity
 */

/**
 * @typedef {Object} PresentingSymptoms
 * @property {YesNo} fatigue
 * @property {YesNo} weightChange
 * @property {string} weightChangeDirection
 * @property {YesNo} heatIntolerance
 * @property {YesNo} coldIntolerance
 * @property {YesNo} palpitations
 * @property {YesNo} tremor
 * @property {YesNo} sweating
 * @property {YesNo} polyuria
 * @property {YesNo} polydipsia
 * @property {YesNo} mood
 * @property {YesNo} skinChanges
 * @property {YesNo} hairChanges
 * @property {string} symptomDuration
 * @property {string} otherSymptoms
 */

/**
 * @typedef {Object} ThyroidAxis
 * @property {number | null} tsh
 * @property {number | null} ft4
 * @property {number | null} ft3
 * @property {YesNo} antibodiesPositive
 * @property {YesNo} goitre
 * @property {YesNo} familyHistoryThyroid
 * @property {string} thyroidNotes
 */

/**
 * @typedef {Object} AdrenalAxis
 * @property {number | null} morningCortisol
 * @property {number | null} acth
 * @property {number | null} aldosterone
 * @property {number | null} renin
 * @property {YesNo} hyperpigmentation
 * @property {YesNo} cushingoidFeatures
 * @property {YesNo} posturalHypotension
 * @property {string} adrenalNotes
 */

/**
 * @typedef {Object} GlucoseMetabolism
 * @property {number | null} hba1c
 * @property {number | null} fastingGlucose
 * @property {number | null} randomGlucose
 * @property {YesNo} knownDiabetes
 * @property {string} diabetesType
 * @property {YesNo} hypoglycaemiaEpisodes
 * @property {string} glucoseNotes
 */

/**
 * @typedef {Object} ReproductiveAxis
 * @property {number | null} fsh
 * @property {number | null} lh
 * @property {number | null} testosterone
 * @property {number | null} oestradiol
 * @property {YesNo} menstrualIrregularity
 * @property {YesNo} infertility
 * @property {YesNo} libidoChange
 * @property {YesNo} galactorrhoea
 * @property {string} reproductiveNotes
 */

/**
 * @typedef {Object} PituitaryFunction
 * @property {number | null} prolactin
 * @property {number | null} igf1
 * @property {number | null} growthHormone
 * @property {YesNo} headaches
 * @property {YesNo} visualDisturbance
 * @property {YesNo} acromegalicFeatures
 * @property {YesNo} pituitaryImagingDone
 * @property {string} pituitaryImagingFindings
 * @property {string} pituitaryNotes
 */

/**
 * @typedef {Object} BoneCalcium
 * @property {number | null} pth
 * @property {number | null} vitaminD
 * @property {number | null} calciumCorrected
 * @property {number | null} phosphate
 * @property {YesNo} fragilityFracture
 * @property {YesNo} bonePain
 * @property {YesNo} dexaScanDone
 * @property {string} dexaResult
 * @property {string} boneNotes
 */

/**
 * @typedef {Object} MedicationItem
 * @property {string} name
 * @property {string} dose
 * @property {string} frequency
 */

/**
 * @typedef {Object} MedicationsLifestyle
 * @property {MedicationItem[]} currentMedications
 * @property {YesNo} steroidUse
 * @property {string} steroidDetails
 * @property {YesNo} hormoneTherapy
 * @property {string} hormoneTherapyDetails
 * @property {'current' | 'ex' | 'never' | ''} smoking
 * @property {string} alcoholUnits
 * @property {string} exerciseLevel
 * @property {string} dietPattern
 * @property {string} familyHistoryEndocrine
 */

/**
 * @typedef {Object} ClinicalImpression
 * @property {string} workingDiagnosis
 * @property {string} differentialDiagnoses
 * @property {string} investigationsRequested
 * @property {string} managementPlan
 * @property {string} followUpPlan
 * @property {YesNo} referralRequired
 * @property {string} referralSpecialty
 * @property {string} clinicianNotes
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {PresentingSymptoms} presentingSymptoms
 * @property {ThyroidAxis} thyroidAxis
 * @property {AdrenalAxis} adrenalAxis
 * @property {GlucoseMetabolism} glucoseMetabolism
 * @property {ReproductiveAxis} reproductiveAxis
 * @property {PituitaryFunction} pituitaryFunction
 * @property {BoneCalcium} boneCalcium
 * @property {MedicationsLifestyle} medicationsLifestyle
 * @property {ClinicalImpression} clinicalImpression
 */

/**
 * @typedef {Object} AxisGrade
 * @property {string} axis
 * @property {AxisStatus} status
 * @property {string} rationale
 * @property {string[]} contributingFindings
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {AxisStatus} status
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
 * @property {AxisGrade[]} axisGrades
 * @property {AxisStatus} overallStatus
 * @property {number} answeredCount
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.EndocrinologyAssessment`.
(function () {
'use strict';
window.EndocrinologyAssessment = window.EndocrinologyAssessment || {};

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
      bmi: null,
      ethnicity: ''
    },
    presentingSymptoms: {
      fatigue: '',
      weightChange: '',
      weightChangeDirection: '',
      heatIntolerance: '',
      coldIntolerance: '',
      palpitations: '',
      tremor: '',
      sweating: '',
      polyuria: '',
      polydipsia: '',
      mood: '',
      skinChanges: '',
      hairChanges: '',
      symptomDuration: '',
      otherSymptoms: ''
    },
    thyroidAxis: {
      tsh: null,
      ft4: null,
      ft3: null,
      antibodiesPositive: '',
      goitre: '',
      familyHistoryThyroid: '',
      thyroidNotes: ''
    },
    adrenalAxis: {
      morningCortisol: null,
      acth: null,
      aldosterone: null,
      renin: null,
      hyperpigmentation: '',
      cushingoidFeatures: '',
      posturalHypotension: '',
      adrenalNotes: ''
    },
    glucoseMetabolism: {
      hba1c: null,
      fastingGlucose: null,
      randomGlucose: null,
      knownDiabetes: '',
      diabetesType: '',
      hypoglycaemiaEpisodes: '',
      glucoseNotes: ''
    },
    reproductiveAxis: {
      fsh: null,
      lh: null,
      testosterone: null,
      oestradiol: null,
      menstrualIrregularity: '',
      infertility: '',
      libidoChange: '',
      galactorrhoea: '',
      reproductiveNotes: ''
    },
    pituitaryFunction: {
      prolactin: null,
      igf1: null,
      growthHormone: null,
      headaches: '',
      visualDisturbance: '',
      acromegalicFeatures: '',
      pituitaryImagingDone: '',
      pituitaryImagingFindings: '',
      pituitaryNotes: ''
    },
    boneCalcium: {
      pth: null,
      vitaminD: null,
      calciumCorrected: null,
      phosphate: null,
      fragilityFracture: '',
      bonePain: '',
      dexaScanDone: '',
      dexaResult: '',
      boneNotes: ''
    },
    medicationsLifestyle: {
      currentMedications: [],
      steroidUse: '',
      steroidDetails: '',
      hormoneTherapy: '',
      hormoneTherapyDetails: '',
      smoking: '',
      alcoholUnits: '',
      exerciseLevel: '',
      dietPattern: '',
      familyHistoryEndocrine: ''
    },
    clinicalImpression: {
      workingDiagnosis: '',
      differentialDiagnoses: '',
      investigationsRequested: '',
      managementPlan: '',
      followUpPlan: '',
      referralRequired: '',
      referralSpecialty: '',
      clinicianNotes: ''
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

/** Friendly label for an AxisStatus. */
function axisStatusLabel(status) {
  switch (status) {
    case 'normal': return 'Normal';
    case 'subclinical': return 'Subclinical';
    case 'mild': return 'Mild';
    case 'moderate': return 'Moderate';
    case 'severe': return 'Severe';
    default: return 'Not assessed';
  }
}

/** CSS class hint for an AxisStatus badge. */
function axisStatusClass(status) {
  switch (status) {
    case 'normal': return 'status-normal';
    case 'subclinical': return 'status-subclinical';
    case 'mild': return 'status-mild';
    case 'moderate': return 'status-moderate';
    case 'severe': return 'status-severe';
    default: return 'status-none';
  }
}

/**
 * Compare two AxisStatus values. Returns the more severe of the two.
 * Order: severe > moderate > mild > subclinical > normal > '' (not assessed).
 */
function maxStatus(a, b) {
  const order = { '': 0, normal: 1, subclinical: 2, mild: 3, moderate: 4, severe: 5 };
  return (order[a] || 0) >= (order[b] || 0) ? a : b;
}

Object.assign(window.EndocrinologyAssessment, {
  emptyAssessment,
  calculateBMI,
  bmiCategory,
  axisStatusLabel,
  axisStatusClass,
  maxStatus
});
})();
