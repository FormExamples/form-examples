// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Integumentary Assessment form.
//
// This file builds the canonical empty AssessmentData shape used by the
// wizard, so that newly-added fields automatically default correctly when
// older saved state is rehydrated from localStorage.

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
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
 * @typedef {Object} PresentingSkinConcern
 * @property {string} chiefComplaint
 * @property {string} onset
 * @property {string} duration
 * @property {string} location
 * @property {YesNo} pain
 * @property {number | null} painScore
 * @property {YesNo} itching
 * @property {YesNo} bleeding
 * @property {YesNo} discharge
 * @property {string} aggravatingFactors
 * @property {string} relievingFactors
 * @property {string} priorTreatment
 */

/**
 * @typedef {Object} Lesion
 * @property {string} site
 * @property {string} type
 * @property {string} size
 * @property {string} description
 */

/**
 * @typedef {Object} SkinInspection
 * @property {string} colour
 * @property {string} moisture
 * @property {string} integrity
 * @property {string} turgor
 * @property {string} temperature
 * @property {string[]} lesionTypes
 * @property {Lesion[]} lesions
 * @property {string} additionalNotes
 */

/**
 * @typedef {Object} HairScalpExamination
 * @property {string} hairDistribution
 * @property {string} hairTexture
 * @property {YesNo} alopecia
 * @property {string} alopeciaPattern
 * @property {YesNo} scalpLesions
 * @property {string[]} scalpFindings
 * @property {string} scalpNotes
 */

/**
 * @typedef {Object} NailExamination
 * @property {string} nailColour
 * @property {string} nailShape
 * @property {string} nailCapillaryRefill
 * @property {string[]} nailFindings
 * @property {string} nailNotes
 */

/**
 * @typedef {Object} WoundAssessment
 * @property {YesNo} woundPresent
 * @property {string} woundLocation
 * @property {string} woundStage
 * @property {number | null} woundLength
 * @property {number | null} woundWidth
 * @property {number | null} woundDepth
 * @property {string} tissueType
 * @property {string} infectionSigns
 * @property {string} moistureBalance
 * @property {string} edgeCondition
 * @property {string} exudateAmount
 * @property {string} exudateType
 * @property {string} woundOdour
 * @property {string} woundNotes
 */

/**
 * @typedef {Object} BradenScale
 * @property {number | null} sensoryPerception
 * @property {number | null} moisture
 * @property {number | null} activity
 * @property {number | null} mobility
 * @property {number | null} nutrition
 * @property {number | null} frictionShear
 */

/**
 * @typedef {Object} Photo
 * @property {string} site
 * @property {string} date
 * @property {string} reference
 */

/**
 * @typedef {Object} PhotographyDocumentation
 * @property {YesNo} consentObtained
 * @property {YesNo} photosTaken
 * @property {Photo[]} photos
 * @property {string} documentationNotes
 */

/**
 * @typedef {Object} ClinicalImpressionCarePlan
 * @property {string} clinicalImpression
 * @property {string} differentialDiagnoses
 * @property {string} carePlan
 * @property {YesNo} dressingRequired
 * @property {string} dressingType
 * @property {YesNo} pressureReliefRequired
 * @property {YesNo} referralRequired
 * @property {string} referralDetails
 * @property {string} followUpDate
 * @property {string} clinicianName
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {PresentingSkinConcern} presentingSkinConcern
 * @property {SkinInspection} skinInspection
 * @property {HairScalpExamination} hairScalpExamination
 * @property {NailExamination} nailExamination
 * @property {WoundAssessment} woundAssessment
 * @property {BradenScale} bradenScale
 * @property {PhotographyDocumentation} photographyDocumentation
 * @property {ClinicalImpressionCarePlan} clinicalImpressionCarePlan
 */

/**
 * @typedef {'no-risk' | 'mild-risk' | 'moderate-risk' | 'high-risk' | 'very-high-risk'} RiskLevel
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {number} score
 * @property {number} maxScore
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
 * @property {number} bradenScore
 * @property {RiskLevel} riskLevel
 * @property {number} answeredCount
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.IntegumentaryAssessment`.
(function () {
'use strict';
window.IntegumentaryAssessment = window.IntegumentaryAssessment || {};

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
    presentingSkinConcern: {
      chiefComplaint: '',
      onset: '',
      duration: '',
      location: '',
      pain: '',
      painScore: null,
      itching: '',
      bleeding: '',
      discharge: '',
      aggravatingFactors: '',
      relievingFactors: '',
      priorTreatment: ''
    },
    skinInspection: {
      colour: '',
      moisture: '',
      integrity: '',
      turgor: '',
      temperature: '',
      lesionTypes: [],
      lesions: [],
      additionalNotes: ''
    },
    hairScalpExamination: {
      hairDistribution: '',
      hairTexture: '',
      alopecia: '',
      alopeciaPattern: '',
      scalpLesions: '',
      scalpFindings: [],
      scalpNotes: ''
    },
    nailExamination: {
      nailColour: '',
      nailShape: '',
      nailCapillaryRefill: '',
      nailFindings: [],
      nailNotes: ''
    },
    woundAssessment: {
      woundPresent: '',
      woundLocation: '',
      woundStage: '',
      woundLength: null,
      woundWidth: null,
      woundDepth: null,
      tissueType: '',
      infectionSigns: '',
      moistureBalance: '',
      edgeCondition: '',
      exudateAmount: '',
      exudateType: '',
      woundOdour: '',
      woundNotes: ''
    },
    bradenScale: {
      sensoryPerception: null,
      moisture: null,
      activity: null,
      mobility: null,
      nutrition: null,
      frictionShear: null
    },
    photographyDocumentation: {
      consentObtained: '',
      photosTaken: '',
      photos: [],
      documentationNotes: ''
    },
    clinicalImpressionCarePlan: {
      clinicalImpression: '',
      differentialDiagnoses: '',
      carePlan: '',
      dressingRequired: '',
      dressingType: '',
      pressureReliefRequired: '',
      referralRequired: '',
      referralDetails: '',
      followUpDate: '',
      clinicianName: ''
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

/** Compute wound area (cm²) from length × width. */
function calculateWoundArea(length, width) {
  if (length == null || width == null || length <= 0 || width <= 0) return null;
  return Math.round(length * width * 10) / 10;
}

Object.assign(window.IntegumentaryAssessment, {
  emptyAssessment,
  calculateBMI,
  bmiCategory,
  calculateWoundArea
});
})();
