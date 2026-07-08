// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Respirology Assessment form.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'mild' | 'moderate' | 'severe' | ''} Severity
 * @typedef {'current' | 'ex' | 'never' | ''} SmokingStatus
 * @typedef {'mild' | 'moderate' | 'anaphylaxis' | ''} AllergySeverity
 * @typedef {'clear' | 'white' | 'yellow' | 'green' | 'brown' | 'blood-streaked' | ''} SputumColour
 * @typedef {'productive' | 'dry' | ''} CoughCharacter
 * @typedef {'nasal-cannula' | 'venturi' | 'non-rebreather' | 'cpap' | 'bipap' | ''} OxygenDelivery
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
 * @property {string} onsetDate
 * @property {string} duration
 * @property {number | null} severityRating
 */

/**
 * @typedef {Object} DyspnoeaAssessment
 * @property {'1' | '2' | '3' | '4' | '5' | ''} mrcGrade
 * @property {string} triggers
 * @property {number | null} exerciseToleranceMetres
 * @property {YesNo} orthopnoea
 * @property {number | null} orthopnoeaPillows
 * @property {YesNo} pnd
 */

/**
 * @typedef {Object} CoughAssessment
 * @property {string} duration
 * @property {CoughCharacter} character
 * @property {'none' | 'small' | 'moderate' | 'large' | ''} sputumVolume
 * @property {SputumColour} sputumColour
 * @property {YesNo} haemoptysis
 * @property {string} haemoptysisDetails
 */

/**
 * @typedef {Object} RespiratoryHistory
 * @property {YesNo} asthma
 * @property {YesNo} copd
 * @property {Severity} copdSeverity
 * @property {YesNo} bronchiectasis
 * @property {YesNo} interstitialLungDisease
 * @property {string} ildType
 * @property {YesNo} tuberculosis
 * @property {YesNo} tbTreatmentComplete
 * @property {YesNo} pneumonia
 * @property {YesNo} pneumoniaRecurrent
 * @property {YesNo} pulmonaryEmbolism
 * @property {string} peDate
 */

/**
 * @typedef {Object} PulmonaryFunction
 * @property {number | null} fev1
 * @property {number | null} fvc
 * @property {number | null} fev1FvcRatio
 * @property {number | null} dlco
 * @property {number | null} tlc
 * @property {number | null} oxygenSaturation
 */

/**
 * @typedef {Object} Medication
 * @property {string} name
 * @property {string} dose
 * @property {string} frequency
 */

/**
 * @typedef {Object} CurrentMedications
 * @property {Medication[]} inhalers
 * @property {Medication[]} nebulizers
 * @property {YesNo} oxygenTherapy
 * @property {OxygenDelivery} oxygenDelivery
 * @property {number | null} oxygenFlowRate
 * @property {YesNo} oralSteroids
 * @property {string} oralSteroidDetails
 * @property {YesNo} antibiotics
 * @property {string} antibioticDetails
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
 * @property {string[]} environmentalAllergens
 */

/**
 * @typedef {Object} SmokingExposures
 * @property {SmokingStatus} smokingStatus
 * @property {number | null} packYears
 * @property {YesNo} vaping
 * @property {string} vapingDetails
 * @property {YesNo} occupationalExposure
 * @property {string} occupationalDetails
 * @property {YesNo} asbestosExposure
 * @property {string} asbestosDetails
 * @property {YesNo} pets
 * @property {string} petDetails
 */

/**
 * @typedef {Object} SleepFunctional
 * @property {'good' | 'fair' | 'poor' | ''} sleepQuality
 * @property {YesNo} osaScreenSnoring
 * @property {YesNo} osaScreenTired
 * @property {YesNo} osaScreenObservedApnoea
 * @property {YesNo} osaScreenBMIOver35
 * @property {YesNo} osaScreenAge50Plus
 * @property {YesNo} osaScreenNeckOver40cm
 * @property {YesNo} osaScreenMale
 * @property {number | null} stopBangScore
 * @property {YesNo} daytimeSomnolence
 * @property {number | null} epworthScore
 * @property {'independent' | 'limited' | 'dependent' | ''} functionalStatus
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {ChiefComplaint} chiefComplaint
 * @property {DyspnoeaAssessment} dyspnoeaAssessment
 * @property {CoughAssessment} coughAssessment
 * @property {RespiratoryHistory} respiratoryHistory
 * @property {PulmonaryFunction} pulmonaryFunction
 * @property {CurrentMedications} currentMedications
 * @property {Allergies} allergies
 * @property {SmokingExposures} smokingExposures
 * @property {SleepFunctional} sleepFunctional
 */

/**
 * @typedef {1 | 2 | 3 | 4 | 5} MRCGrade
 *
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} system
 * @property {string} description
 * @property {MRCGrade} grade
 *
 * @typedef {Object} AdditionalFlag
 * @property {string} id
 * @property {string} category
 * @property {string} message
 * @property {'high' | 'medium' | 'low'} priority
 *
 * @typedef {Object} GradingResult
 * @property {MRCGrade} mrcGrade
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.RespirologyAssessment`.
(function () {
'use strict';
window.RespirologyAssessment = window.RespirologyAssessment || {};

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
      onsetDate: '',
      duration: '',
      severityRating: null
    },
    dyspnoeaAssessment: {
      mrcGrade: '',
      triggers: '',
      exerciseToleranceMetres: null,
      orthopnoea: '',
      orthopnoeaPillows: null,
      pnd: ''
    },
    coughAssessment: {
      duration: '',
      character: '',
      sputumVolume: '',
      sputumColour: '',
      haemoptysis: '',
      haemoptysisDetails: ''
    },
    respiratoryHistory: {
      asthma: '',
      copd: '',
      copdSeverity: '',
      bronchiectasis: '',
      interstitialLungDisease: '',
      ildType: '',
      tuberculosis: '',
      tbTreatmentComplete: '',
      pneumonia: '',
      pneumoniaRecurrent: '',
      pulmonaryEmbolism: '',
      peDate: ''
    },
    pulmonaryFunction: {
      fev1: null,
      fvc: null,
      fev1FvcRatio: null,
      dlco: null,
      tlc: null,
      oxygenSaturation: null
    },
    currentMedications: {
      inhalers: [],
      nebulizers: [],
      oxygenTherapy: '',
      oxygenDelivery: '',
      oxygenFlowRate: null,
      oralSteroids: '',
      oralSteroidDetails: '',
      antibiotics: '',
      antibioticDetails: ''
    },
    allergies: {
      drugAllergies: [],
      environmentalAllergens: []
    },
    smokingExposures: {
      smokingStatus: '',
      packYears: null,
      vaping: '',
      vapingDetails: '',
      occupationalExposure: '',
      occupationalDetails: '',
      asbestosExposure: '',
      asbestosDetails: '',
      pets: '',
      petDetails: ''
    },
    sleepFunctional: {
      sleepQuality: '',
      osaScreenSnoring: '',
      osaScreenTired: '',
      osaScreenObservedApnoea: '',
      osaScreenBMIOver35: '',
      osaScreenAge50Plus: '',
      osaScreenNeckOver40cm: '',
      osaScreenMale: '',
      stopBangScore: null,
      daytimeSomnolence: '',
      epworthScore: null,
      functionalStatus: ''
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

/** Calculate STOP-BANG score from individual yes/no items (returns 0-7). */
function calculateStopBang(snoring, tired, observed, bmiOver35, age50Plus, neckOver40, male) {
  let score = 0;
  if (snoring === 'yes') score++;
  if (tired === 'yes') score++;
  if (observed === 'yes') score++;
  if (bmiOver35 === 'yes') score++;
  if (age50Plus === 'yes') score++;
  if (neckOver40 === 'yes') score++;
  if (male === 'yes') score++;
  return score;
}

/** MRC Dyspnoea Scale grade label. */
function mrcGradeLabel(grade) {
  switch (grade) {
    case 1: return 'MRC 1 - Breathless only on strenuous exercise';
    case 2: return 'MRC 2 - Breathless when hurrying or walking up a slight hill';
    case 3: return 'MRC 3 - Walks slower than peers / stops after ~15 min';
    case 4: return 'MRC 4 - Stops for breath after ~100 yards on level';
    case 5: return 'MRC 5 - Too breathless to leave house / breathless dressing';
    default: return `MRC ${grade}`;
  }
}

/** Short severity label for MRC grade. */
function mrcSeverityLabel(grade) {
  switch (grade) {
    case 1: return 'Normal';
    case 2: return 'Mild';
    case 3: return 'Moderate';
    case 4: return 'Severe';
    case 5: return 'Very Severe';
    default: return 'Unknown';
  }
}

/** CSS class suffix for an MRC grade badge. */
function mrcGradeClass(grade) {
  return `grade-${grade}`;
}

Object.assign(window.RespirologyAssessment, {
  emptyAssessment,
  calculateBMI,
  bmiCategory,
  calculateStopBang,
  mrcGradeLabel,
  mrcSeverityLabel,
  mrcGradeClass
});
})();
