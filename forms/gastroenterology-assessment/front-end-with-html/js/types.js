// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Gastroenterology Assessment.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so newly-added fields default correctly when older saved
// state is rehydrated from localStorage.

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'none' | 'occasional' | 'moderate' | 'heavy' | ''} AlcoholFrequency
 * @typedef {'current' | 'ex' | 'never' | ''} SmokingStatus
 * @typedef {'1' | '2' | '3' | '4' | '5' | '6' | '7' | ''} BristolStoolType
 * @typedef {'cramping' | 'burning' | 'sharp' | 'dull' | 'colicky' | ''} PainCharacter
 * @typedef {'constant' | 'intermittent' | 'episodic' | ''} PainFrequency
 * @typedef {'epigastric' | 'right-upper-quadrant' | 'left-upper-quadrant' |
 *           'periumbilical' | 'right-lower-quadrant' | 'left-lower-quadrant' |
 *           'suprapubic' | 'diffuse' | ''} AbdominalLocation
 * @typedef {'mild' | 'moderate' | 'severe' | ''} AllergySeverity
 * @typedef {'crohns' | 'ulcerative-colitis' | ''} IbdType
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
 * @property {AbdominalLocation} symptomLocation
 * @property {string} symptomOnset
 * @property {string} symptomDuration
 * @property {number | null} severityScore
 */

/**
 * @typedef {Object} UpperGISymptoms
 * @property {YesNo} dysphagia
 * @property {string} dysphagiaDetails
 * @property {YesNo} odynophagia
 * @property {YesNo} heartburn
 * @property {string} heartburnFrequency
 * @property {YesNo} nausea
 * @property {YesNo} vomiting
 * @property {string} vomitingDetails
 * @property {YesNo} earlySatiety
 */

/**
 * @typedef {Object} LowerGISymptoms
 * @property {YesNo} bowelHabitChange
 * @property {string} bowelHabitDetails
 * @property {YesNo} diarrhoea
 * @property {string} diarrhoeaFrequency
 * @property {YesNo} constipation
 * @property {string} constipationDetails
 * @property {YesNo} rectalBleeding
 * @property {string} rectalBleedingDetails
 * @property {YesNo} tenesmus
 * @property {BristolStoolType} bristolStoolType
 */

/**
 * @typedef {Object} AbdominalPainAssessment
 * @property {AbdominalLocation} painLocation
 * @property {PainCharacter} painCharacter
 * @property {string} painRadiation
 * @property {string} aggravatingFactors
 * @property {string} relievingFactors
 * @property {PainFrequency} painFrequency
 */

/**
 * @typedef {Object} LiverPancreas
 * @property {YesNo} jaundice
 * @property {YesNo} darkUrine
 * @property {YesNo} paleStools
 * @property {AlcoholFrequency} alcoholIntake
 * @property {number | null} alcoholUnitsPerWeek
 * @property {YesNo} hepatitisExposure
 * @property {string} hepatitisDetails
 */

/**
 * @typedef {Object} PreviousGIHistory
 * @property {YesNo} previousEndoscopy
 * @property {string} endoscopyDetails
 * @property {YesNo} previousColonoscopy
 * @property {string} colonoscopyDetails
 * @property {YesNo} previousGISurgery
 * @property {string} surgeryDetails
 * @property {YesNo} ibd
 * @property {IbdType} ibdType
 * @property {YesNo} ibs
 * @property {YesNo} celiacDisease
 * @property {YesNo} polyps
 * @property {string} polypDetails
 * @property {YesNo} giCancer
 * @property {string} giCancerDetails
 */

/**
 * @typedef {Object} Medication
 * @property {string} name
 * @property {string} dose
 * @property {string} frequency
 */

/**
 * @typedef {Object} CurrentMedications
 * @property {YesNo} ppis
 * @property {string} ppiDetails
 * @property {YesNo} antacids
 * @property {YesNo} laxatives
 * @property {string} laxativeDetails
 * @property {YesNo} antiDiarrhoeals
 * @property {YesNo} biologics
 * @property {string} biologicDetails
 * @property {YesNo} steroids
 * @property {string} steroidDetails
 * @property {YesNo} nsaids
 * @property {string} nsaidDetails
 * @property {Medication[]} otherMedications
 */

/**
 * @typedef {Object} Allergy
 * @property {string} allergen
 * @property {string} reaction
 * @property {AllergySeverity} severity
 */

/**
 * @typedef {Object} AllergiesDiet
 * @property {Allergy[]} drugAllergies
 * @property {string} foodIntolerances
 * @property {string} dietaryRestrictions
 * @property {YesNo} glutenIntolerance
 * @property {YesNo} lactoseIntolerance
 */

/**
 * @typedef {Object} RedFlagsSocial
 * @property {YesNo} unexplainedWeightLoss
 * @property {string} weightLossAmount
 * @property {YesNo} appetiteChange
 * @property {string} appetiteDetails
 * @property {YesNo} familyGICancer
 * @property {string} familyCancerDetails
 * @property {SmokingStatus} smoking
 * @property {number | null} smokingPackYears
 * @property {AlcoholFrequency} alcoholUse
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {ChiefComplaint} chiefComplaint
 * @property {UpperGISymptoms} upperGISymptoms
 * @property {LowerGISymptoms} lowerGISymptoms
 * @property {AbdominalPainAssessment} abdominalPainAssessment
 * @property {LiverPancreas} liverPancreas
 * @property {PreviousGIHistory} previousGIHistory
 * @property {CurrentMedications} currentMedications
 * @property {AllergiesDiet} allergiesDiet
 * @property {RedFlagsSocial} redFlagsSocial
 */

/**
 * @typedef {'minimal' | 'mild' | 'moderate' | 'severe' | 'very-severe'} SeverityLevel
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {number} points
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
 * @property {number} severityScore
 * @property {SeverityLevel} severityLevel
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.GastroenterologyAssessment`.
(function () {
'use strict';
window.GastroenterologyAssessment = window.GastroenterologyAssessment || {};

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
      symptomLocation: '',
      symptomOnset: '',
      symptomDuration: '',
      severityScore: null
    },
    upperGISymptoms: {
      dysphagia: '',
      dysphagiaDetails: '',
      odynophagia: '',
      heartburn: '',
      heartburnFrequency: '',
      nausea: '',
      vomiting: '',
      vomitingDetails: '',
      earlySatiety: ''
    },
    lowerGISymptoms: {
      bowelHabitChange: '',
      bowelHabitDetails: '',
      diarrhoea: '',
      diarrhoeaFrequency: '',
      constipation: '',
      constipationDetails: '',
      rectalBleeding: '',
      rectalBleedingDetails: '',
      tenesmus: '',
      bristolStoolType: ''
    },
    abdominalPainAssessment: {
      painLocation: '',
      painCharacter: '',
      painRadiation: '',
      aggravatingFactors: '',
      relievingFactors: '',
      painFrequency: ''
    },
    liverPancreas: {
      jaundice: '',
      darkUrine: '',
      paleStools: '',
      alcoholIntake: '',
      alcoholUnitsPerWeek: null,
      hepatitisExposure: '',
      hepatitisDetails: ''
    },
    previousGIHistory: {
      previousEndoscopy: '',
      endoscopyDetails: '',
      previousColonoscopy: '',
      colonoscopyDetails: '',
      previousGISurgery: '',
      surgeryDetails: '',
      ibd: '',
      ibdType: '',
      ibs: '',
      celiacDisease: '',
      polyps: '',
      polypDetails: '',
      giCancer: '',
      giCancerDetails: ''
    },
    currentMedications: {
      ppis: '',
      ppiDetails: '',
      antacids: '',
      laxatives: '',
      laxativeDetails: '',
      antiDiarrhoeals: '',
      biologics: '',
      biologicDetails: '',
      steroids: '',
      steroidDetails: '',
      nsaids: '',
      nsaidDetails: '',
      otherMedications: []
    },
    allergiesDiet: {
      drugAllergies: [],
      foodIntolerances: '',
      dietaryRestrictions: '',
      glutenIntolerance: '',
      lactoseIntolerance: ''
    },
    redFlagsSocial: {
      unexplainedWeightLoss: '',
      weightLossAmount: '',
      appetiteChange: '',
      appetiteDetails: '',
      familyGICancer: '',
      familyCancerDetails: '',
      smoking: '',
      smokingPackYears: null,
      alcoholUse: ''
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
 * Map a numeric GI severity score to its severity level.
 * 0-10 minimal, 11-20 mild, 21-30 moderate, 31-40 severe, 41+ very-severe.
 * @param {number} score
 * @returns {SeverityLevel}
 */
function severityLevelFromScore(score) {
  if (score <= 10) return 'minimal';
  if (score <= 20) return 'mild';
  if (score <= 30) return 'moderate';
  if (score <= 40) return 'severe';
  return 'very-severe';
}

/** Friendly label for a SeverityLevel. */
function severityLabel(level) {
  switch (level) {
    case 'minimal':     return 'Minimal Symptoms (0-10)';
    case 'mild':        return 'Mild (11-20)';
    case 'moderate':    return 'Moderate (21-30)';
    case 'severe':      return 'Severe (31-40)';
    case 'very-severe': return 'Very Severe (41+)';
    default:            return 'Unknown';
  }
}

/** CSS-class hint for the severity badge. */
function severityClass(level) {
  switch (level) {
    case 'minimal':     return 'severity-minimal';
    case 'mild':        return 'severity-mild';
    case 'moderate':    return 'severity-moderate';
    case 'severe':      return 'severity-severe';
    case 'very-severe': return 'severity-very-severe';
    default:            return '';
  }
}

/** Bristol stool description by type (string '1'..'7'). */
function bristolStoolDescription(type) {
  switch (type) {
    case '1': return 'Type 1 - Separate hard lumps (severe constipation)';
    case '2': return 'Type 2 - Lumpy, sausage-shaped (mild constipation)';
    case '3': return 'Type 3 - Sausage with cracks (normal)';
    case '4': return 'Type 4 - Smooth, soft sausage (normal)';
    case '5': return 'Type 5 - Soft blobs with clear edges (lacking fibre)';
    case '6': return 'Type 6 - Fluffy, mushy pieces (mild diarrhoea)';
    case '7': return 'Type 7 - Entirely liquid (severe diarrhoea)';
    default:  return '';
  }
}

Object.assign(window.GastroenterologyAssessment, {
  emptyAssessment,
  calculateBMI,
  bmiCategory,
  severityLevelFromScore,
  severityLabel,
  severityClass,
  bristolStoolDescription
});
})();
