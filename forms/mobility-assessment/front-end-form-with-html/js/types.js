// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Mobility Assessment form.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'none' | 'mild' | 'moderate' | 'severe' | ''} FearOfFalling
 * @typedef {0 | 1 | 2 | null} TinettiScore
 * @typedef {'normal' | 'mildly-limited' | 'moderately-limited' | 'severely-limited' | ''} ROMStatus
 * @typedef {'independent' | 'modified-independent' | 'supervision' |
 *           'minimal-assist' | 'moderate-assist' | 'maximal-assist' |
 *           'dependent' | ''} IndependenceLevel
 */

/**
 * @typedef {Object} Demographics
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {Sex} sex
 * @property {string} height
 * @property {string} weight
 */

/**
 * @typedef {Object} ReferralInfo
 * @property {string} referringProvider
 * @property {string} referralReason
 * @property {string} referralDate
 * @property {string} primaryDiagnosis
 * @property {string} secondaryDiagnoses
 */

/**
 * @typedef {Object} FallHistory
 * @property {number | null} fallsLastYear
 * @property {string} lastFallDate
 * @property {string} fallCircumstances
 * @property {string} injuriesFromFalls
 * @property {FearOfFalling} fearOfFalling
 * @property {string[]} fallRiskFactors
 */

/**
 * @typedef {Object} BalanceAssessment
 * @property {TinettiScore} sittingBalance
 * @property {TinettiScore} risesFromChair
 * @property {TinettiScore} attemptingToRise
 * @property {TinettiScore} immediateStandingBalance
 * @property {TinettiScore} standingBalance
 * @property {TinettiScore} nudgedBalance
 * @property {TinettiScore} eyesClosed
 * @property {TinettiScore} turning360
 * @property {TinettiScore} sittingDown
 */

/**
 * @typedef {Object} GaitAssessment
 * @property {TinettiScore} initiationOfGait
 * @property {TinettiScore} stepLength
 * @property {TinettiScore} stepHeight
 * @property {TinettiScore} stepSymmetry
 * @property {TinettiScore} stepContinuity
 * @property {TinettiScore} path
 * @property {TinettiScore} trunk
 * @property {TinettiScore} walkingStance
 */

/**
 * @typedef {Object} TimedUpAndGo
 * @property {number | null} timeSeconds
 * @property {YesNo} usedAssistiveDevice
 * @property {string} deviceType
 */

/**
 * @typedef {Object} RangeOfMotion
 * @property {ROMStatus} hipFlexion
 * @property {ROMStatus} hipExtension
 * @property {ROMStatus} kneeFlexion
 * @property {ROMStatus} kneeExtension
 * @property {ROMStatus} ankleFlexion
 * @property {ROMStatus} ankleExtension
 * @property {string} notes
 */

/**
 * @typedef {Object} AssistiveDevices
 * @property {string[]} currentDevices
 * @property {YesNo} deviceFitAdequate
 * @property {string} deviceCondition
 * @property {string} recommendedDevices
 */

/**
 * @typedef {Object} Medication
 * @property {string} name
 * @property {string} dose
 * @property {string} frequency
 */

/**
 * @typedef {Object} CurrentMedications
 * @property {Medication[]} medications
 * @property {string[]} fallRiskMedications
 * @property {string} recentMedicationChanges
 */

/**
 * @typedef {Object} FunctionalIndependence
 * @property {IndependenceLevel} transfers
 * @property {IndependenceLevel} ambulation
 * @property {IndependenceLevel} stairs
 * @property {IndependenceLevel} bathing
 * @property {IndependenceLevel} dressing
 * @property {string} additionalNotes
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {ReferralInfo} referralInfo
 * @property {FallHistory} fallHistory
 * @property {BalanceAssessment} balanceAssessment
 * @property {GaitAssessment} gaitAssessment
 * @property {TimedUpAndGo} timedUpAndGo
 * @property {RangeOfMotion} rangeOfMotion
 * @property {AssistiveDevices} assistiveDevices
 * @property {CurrentMedications} currentMedications
 * @property {FunctionalIndependence} functionalIndependence
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} domain
 * @property {string} description
 * @property {number} score
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
 * @property {number} tinettiTotal
 * @property {number} balanceScore
 * @property {number} gaitScore
 * @property {string} tinettiCategory
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.MobilityAssessment`.
(function () {
'use strict';
window.MobilityAssessment = window.MobilityAssessment || {};

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric fields default to `null`; lists default to `[]`;
 * Tinetti score fields default to `null`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    demographics: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      sex: '',
      height: '',
      weight: ''
    },
    referralInfo: {
      referringProvider: '',
      referralReason: '',
      referralDate: '',
      primaryDiagnosis: '',
      secondaryDiagnoses: ''
    },
    fallHistory: {
      fallsLastYear: null,
      lastFallDate: '',
      fallCircumstances: '',
      injuriesFromFalls: '',
      fearOfFalling: '',
      fallRiskFactors: []
    },
    balanceAssessment: {
      sittingBalance: null,
      risesFromChair: null,
      attemptingToRise: null,
      immediateStandingBalance: null,
      standingBalance: null,
      nudgedBalance: null,
      eyesClosed: null,
      turning360: null,
      sittingDown: null
    },
    gaitAssessment: {
      initiationOfGait: null,
      stepLength: null,
      stepHeight: null,
      stepSymmetry: null,
      stepContinuity: null,
      path: null,
      trunk: null,
      walkingStance: null
    },
    timedUpAndGo: {
      timeSeconds: null,
      usedAssistiveDevice: '',
      deviceType: ''
    },
    rangeOfMotion: {
      hipFlexion: '',
      hipExtension: '',
      kneeFlexion: '',
      kneeExtension: '',
      ankleFlexion: '',
      ankleExtension: '',
      notes: ''
    },
    assistiveDevices: {
      currentDevices: [],
      deviceFitAdequate: '',
      deviceCondition: '',
      recommendedDevices: ''
    },
    currentMedications: {
      medications: [],
      fallRiskMedications: [],
      recentMedicationChanges: ''
    },
    functionalIndependence: {
      transfers: '',
      ambulation: '',
      stairs: '',
      bathing: '',
      dressing: '',
      additionalNotes: ''
    }
  };
}

/** Calculate age from date of birth string. */
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

/**
 * Tinetti total score category label.
 *   25-28 = Low fall risk
 *   19-24 = Moderate fall risk
 *   0-18  = High fall risk
 */
function tinettiCategory(score) {
  if (score >= 25) return 'Low fall risk';
  if (score >= 19) return 'Moderate fall risk';
  return 'High fall risk';
}

/** CSS class hint for the Tinetti score badge. */
function tinettiCategoryClass(score) {
  if (score >= 25) return 'risk-low';
  if (score >= 19) return 'risk-moderate';
  return 'risk-high';
}

/**
 * TUG (Timed Up and Go) category.
 *   <10s   = Freely mobile
 *   10-14s = Mostly independent
 *   14-20s = Variable mobility
 *   >20s   = Impaired mobility
 */
function tugCategory(timeSeconds) {
  if (timeSeconds === null || timeSeconds === undefined) return 'Not assessed';
  if (timeSeconds < 10) return 'Freely mobile';
  if (timeSeconds <= 14) return 'Mostly independent';
  if (timeSeconds <= 20) return 'Variable mobility';
  return 'Impaired mobility';
}

Object.assign(window.MobilityAssessment, {
  emptyAssessment,
  calculateAge,
  tinettiCategory,
  tinettiCategoryClass,
  tugCategory
});
})();
