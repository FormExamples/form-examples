// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Kinesiology Assessment form.
//
// This file builds the canonical empty AssessmentData shape used by the
// wizard, so newly-added fields automatically default correctly when older
// saved state is rehydrated from localStorage.

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {0 | 1 | 2 | 3 | null} FMSScore
 * @typedef {'sedentary' | 'light' | 'moderate' | 'vigorous' | 'elite' | ''} ActivityLevel
 * @typedef {'none' | 'mild' | 'moderate' | 'severe' | ''} PainLevel
 */

/**
 * @typedef {Object} Demographics
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {Sex} sex
 */

/**
 * @typedef {Object} ReferralInfo
 * @property {string} referringProvider
 * @property {string} referralReason
 * @property {string} referralDate
 * @property {string} sportOrActivity
 */

/**
 * @typedef {Object} MovementHistory
 * @property {string} injuryHistory
 * @property {ActivityLevel} activityLevel
 * @property {string} sportParticipation
 * @property {PainLevel} currentPain
 * @property {string} currentPainDetails
 * @property {string} previousTreatments
 */

/**
 * @typedef {Object} FMSPatternScore
 * @property {FMSScore} score
 * @property {boolean} painDuringMovement
 * @property {FMSScore} leftScore
 * @property {FMSScore} rightScore
 * @property {string} asymmetryNotes
 */

/**
 * @typedef {Object} ClearingTest
 * @property {YesNo} shoulderClearing
 * @property {boolean} shoulderClearingPain
 * @property {YesNo} trunkFlexionClearing
 * @property {boolean} trunkFlexionClearingPain
 * @property {YesNo} trunkExtensionClearing
 * @property {boolean} trunkExtensionClearingPain
 */

/**
 * @typedef {Object} FMSPatterns
 * @property {FMSPatternScore} deepSquat
 * @property {FMSPatternScore} hurdleStep
 * @property {FMSPatternScore} inLineLunge
 * @property {FMSPatternScore} shoulderMobility
 * @property {FMSPatternScore} activeStraightLegRaise
 * @property {FMSPatternScore} trunkStabilityPushUp
 * @property {FMSPatternScore} rotaryStability
 * @property {ClearingTest} clearingTests
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {ReferralInfo} referralInfo
 * @property {MovementHistory} movementHistory
 * @property {FMSPatterns} fmsPatterns
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} pattern
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
 * @property {number} fmsScore
 * @property {string} fmsCategory
 * @property {'low-risk' | 'at-risk'} riskBand
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.KinesiologyAssessment`.

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric scores default to `null`; booleans
 * default to `false`. Mirrors `types.ts` defaults.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    demographics: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      sex: ''
    },
    referralInfo: {
      referringProvider: '',
      referralReason: '',
      referralDate: '',
      sportOrActivity: ''
    },
    movementHistory: {
      injuryHistory: '',
      activityLevel: '',
      sportParticipation: '',
      currentPain: '',
      currentPainDetails: '',
      previousTreatments: ''
    },
    fmsPatterns: {
      deepSquat: emptyPattern(),
      hurdleStep: emptyPattern(),
      inLineLunge: emptyPattern(),
      shoulderMobility: emptyPattern(),
      activeStraightLegRaise: emptyPattern(),
      trunkStabilityPushUp: emptyPattern(),
      rotaryStability: emptyPattern(),
      clearingTests: {
        shoulderClearing: '',
        shoulderClearingPain: false,
        trunkFlexionClearing: '',
        trunkFlexionClearingPain: false,
        trunkExtensionClearing: '',
        trunkExtensionClearingPain: false
      }
    }
  };
}

/** @returns {FMSPatternScore} */
function emptyPattern() {
  return {
    score: null,
    painDuringMovement: false,
    leftScore: null,
    rightScore: null,
    asymmetryNotes: ''
  };
}

/**
 * FMS score category label.
 *   18-21 = Excellent
 *   14-17 = Good
 *   10-13 = Fair
 *    0-9  = Poor
 * @param {number} score
 */
function fmsCategory(score) {
  if (score >= 18) return 'Excellent';
  if (score >= 14) return 'Good';
  if (score >= 10) return 'Fair';
  return 'Poor';
}

/**
 * CSS class hint for the FMS score badge band.
 * @param {number} score
 */
function fmsBandClass(score) {
  if (score >= 18) return 'band-excellent';
  if (score >= 14) return 'band-good';
  if (score >= 10) return 'band-fair';
  return 'band-poor';
}

/**
 * Risk band classification for the FMS total.
 * Threshold at 14: <=14 = at-risk, >14 = low-risk (no risk pattern below threshold).
 * @param {number} score
 * @returns {'low-risk' | 'at-risk'}
 */
function riskBand(score) {
  return score >= 15 ? 'low-risk' : 'at-risk';
}

/** Friendly label for the risk band. */
function riskBandLabel(band) {
  return band === 'low-risk' ? 'Low Risk' : 'At Risk';
}

/** Calculate age (years) from an ISO `YYYY-MM-DD` string. */
function calculateAge(dob) {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export { emptyAssessment, emptyPattern, fmsCategory, fmsBandClass, riskBand, riskBandLabel, calculateAge };
