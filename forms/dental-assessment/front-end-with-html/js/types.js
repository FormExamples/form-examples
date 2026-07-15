// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Dental Assessment form.
//
// This file builds and exports the canonical empty AssessmentData shape
// used by the wizard, so that newly-added fields automatically default
// correctly when older saved state is rehydrated from localStorage.

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'none' | 'mild' | 'moderate' | 'severe' | ''} AnxietyLevel
 * @typedef {'every-6-months' | 'annually' | 'rarely' | 'never' | ''} VisitFrequency
 * @typedef {'twice-daily' | 'once-daily' | 'occasionally' | 'rarely' | ''} BrushingFrequency
 * @typedef {'daily' | 'occasionally' | 'rarely' | 'never' | ''} FlossingFrequency
 * @typedef {'none' | 'horizontal' | 'vertical' | 'combined' | ''} BoneLossPattern
 * @typedef {'class-I' | 'class-II' | 'class-III' | ''} OcclusionClass
 * @typedef {'good' | 'fair' | 'poor' | ''} OralHygieneIndex
 * @typedef {'type1' | 'type2' | ''} DiabetesType
 */

/**
 * @typedef {Object} Demographics
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {Sex} sex
 * @property {string} emergencyContactName
 * @property {string} emergencyContactPhone
 */

/**
 * @typedef {Object} ChiefComplaint
 * @property {string} primaryConcern
 * @property {string} painLocation
 * @property {number | null} painSeverity
 * @property {string} painOnset
 * @property {string} painDuration
 */

/**
 * @typedef {Object} DentalHistory
 * @property {string} lastDentalVisit
 * @property {VisitFrequency} visitFrequency
 * @property {BrushingFrequency} brushingFrequency
 * @property {FlossingFrequency} flossingFrequency
 * @property {AnxietyLevel} dentalAnxietyLevel
 */

/**
 * @typedef {Object} DMFTAssessment
 * @property {number | null} decayedTeeth
 * @property {number | null} missingTeeth
 * @property {number | null} filledTeeth
 * @property {string} toothChartNotes
 */

/**
 * @typedef {Object} PeriodontalAssessment
 * @property {YesNo} gumBleeding
 * @property {YesNo} pocketDepthsAboveNormal
 * @property {string} pocketDepthDetails
 * @property {YesNo} gumRecession
 * @property {string} gumRecessionDetails
 * @property {YesNo} toothMobility
 * @property {string} mobilityDetails
 * @property {YesNo} furcationInvolvement
 * @property {string} furcationDetails
 */

/**
 * @typedef {Object} OralExamination
 * @property {string} softTissueFindings
 * @property {YesNo} tmjPain
 * @property {YesNo} tmjClicking
 * @property {YesNo} tmjLimitedOpening
 * @property {OcclusionClass} occlusion
 * @property {OralHygieneIndex} oralHygieneIndex
 */

/**
 * @typedef {Object} MedicalHistory
 * @property {YesNo} cardiovascularDisease
 * @property {string} cardiovascularDetails
 * @property {YesNo} diabetes
 * @property {DiabetesType} diabetesType
 * @property {YesNo} diabetesControlled
 * @property {YesNo} bleedingDisorder
 * @property {string} bleedingDetails
 * @property {YesNo} bisphosphonateUse
 * @property {string} bisphosphonateDetails
 * @property {YesNo} radiationTherapyHeadNeck
 * @property {string} radiationDetails
 * @property {YesNo} immunosuppression
 * @property {string} immunosuppressionDetails
 */

/**
 * @typedef {Object} CurrentMedications
 * @property {YesNo} anticoagulantUse
 * @property {string} anticoagulantType
 * @property {YesNo} bisphosphonateCurrentUse
 * @property {string} bisphosphonateName
 * @property {YesNo} immunosuppressantUse
 * @property {string} immunosuppressantName
 * @property {YesNo} allergyToAnaesthetics
 * @property {string} anaestheticAllergyDetails
 * @property {string} otherMedications
 */

/**
 * @typedef {Object} RadiographicFindings
 * @property {string} panoramicFindings
 * @property {string} periapicalFindings
 * @property {string} bitewingFindings
 * @property {BoneLossPattern} boneLossPattern
 * @property {string} boneLossDetails
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {ChiefComplaint} chiefComplaint
 * @property {DentalHistory} dentalHistory
 * @property {DMFTAssessment} dmftAssessment
 * @property {PeriodontalAssessment} periodontalAssessment
 * @property {OralExamination} oralExamination
 * @property {MedicalHistory} medicalHistory
 * @property {CurrentMedications} currentMedications
 * @property {RadiographicFindings} radiographicFindings
 */

/**
 * @typedef {'caries-free' | 'very-low' | 'low' | 'moderate' | 'high' | 'very-high'} DMFTCategory
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} system
 * @property {string} description
 * @property {DMFTCategory} category
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
 * @property {number} dmftScore
 * @property {DMFTCategory} dmftCategory
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.DentalAssessment`.

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric fields default to `null`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    demographics: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      sex: '',
      emergencyContactName: '',
      emergencyContactPhone: ''
    },
    chiefComplaint: {
      primaryConcern: '',
      painLocation: '',
      painSeverity: null,
      painOnset: '',
      painDuration: ''
    },
    dentalHistory: {
      lastDentalVisit: '',
      visitFrequency: '',
      brushingFrequency: '',
      flossingFrequency: '',
      dentalAnxietyLevel: ''
    },
    dmftAssessment: {
      decayedTeeth: null,
      missingTeeth: null,
      filledTeeth: null,
      toothChartNotes: ''
    },
    periodontalAssessment: {
      gumBleeding: '',
      pocketDepthsAboveNormal: '',
      pocketDepthDetails: '',
      gumRecession: '',
      gumRecessionDetails: '',
      toothMobility: '',
      mobilityDetails: '',
      furcationInvolvement: '',
      furcationDetails: ''
    },
    oralExamination: {
      softTissueFindings: '',
      tmjPain: '',
      tmjClicking: '',
      tmjLimitedOpening: '',
      occlusion: '',
      oralHygieneIndex: ''
    },
    medicalHistory: {
      cardiovascularDisease: '',
      cardiovascularDetails: '',
      diabetes: '',
      diabetesType: '',
      diabetesControlled: '',
      bleedingDisorder: '',
      bleedingDetails: '',
      bisphosphonateUse: '',
      bisphosphonateDetails: '',
      radiationTherapyHeadNeck: '',
      radiationDetails: '',
      immunosuppression: '',
      immunosuppressionDetails: ''
    },
    currentMedications: {
      anticoagulantUse: '',
      anticoagulantType: '',
      bisphosphonateCurrentUse: '',
      bisphosphonateName: '',
      immunosuppressantUse: '',
      immunosuppressantName: '',
      allergyToAnaesthetics: '',
      anaestheticAllergyDetails: '',
      otherMedications: ''
    },
    radiographicFindings: {
      panoramicFindings: '',
      periapicalFindings: '',
      bitewingFindings: '',
      boneLossPattern: '',
      boneLossDetails: ''
    }
  };
}

/**
 * Compute the DMFT score (sum of D + M + F, treating null as 0).
 * @param {number|null} decayed
 * @param {number|null} missing
 * @param {number|null} filled
 * @returns {number}
 */
function getDMFTScore(decayed, missing, filled) {
  return (decayed || 0) + (missing || 0) + (filled || 0);
}

/**
 * Determine the DMFT category from a numeric score.
 * @param {number} score
 * @returns {DMFTCategory}
 */
function getDMFTCategory(score) {
  if (score === 0) return 'caries-free';
  if (score <= 5) return 'very-low';
  if (score <= 10) return 'low';
  if (score <= 15) return 'moderate';
  if (score <= 20) return 'high';
  return 'very-high';
}

/**
 * Friendly label for a DMFTCategory.
 * @param {DMFTCategory} category
 * @returns {string}
 */
function dmftCategoryLabel(category) {
  switch (category) {
    case 'caries-free': return 'Caries-Free (DMFT 0)';
    case 'very-low':    return 'Very Low (DMFT 1-5)';
    case 'low':         return 'Low (DMFT 6-10)';
    case 'moderate':    return 'Moderate (DMFT 11-15)';
    case 'high':        return 'High (DMFT 16-20)';
    case 'very-high':   return 'Very High (DMFT 21+)';
    default:            return '';
  }
}

/**
 * Short label of a DMFTCategory (for inline UI).
 * @param {DMFTCategory} category
 * @returns {string}
 */
function dmftScoreShortLabel(category) {
  switch (category) {
    case 'caries-free': return 'Caries-Free';
    case 'very-low':    return 'Very Low';
    case 'low':         return 'Low';
    case 'moderate':    return 'Moderate';
    case 'high':        return 'High';
    case 'very-high':   return 'Very High';
    default:            return '';
  }
}

/**
 * CSS class hint mapped from a DMFTCategory.
 * @param {DMFTCategory} category
 */
function dmftCategoryClass(category) {
  return `score-${category}`;
}

export { emptyAssessment, getDMFTScore, getDMFTCategory, dmftCategoryLabel, dmftScoreShortLabel, dmftCategoryClass };
