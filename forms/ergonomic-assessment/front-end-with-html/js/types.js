// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Ergonomic Assessment form.
//
// Builds and exports the canonical empty AssessmentData shape used by the
// wizard. Newly-added fields automatically default correctly when older
// saved state is rehydrated from localStorage.

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
 * @property {string} occupation
 * @property {string} employer
 * @property {string} jobTitle
 * @property {number | null} yearsInRole
 */

/**
 * @typedef {Object} WorkstationSetup
 * @property {'too-low' | 'correct' | 'too-high' | ''} deskHeight
 * @property {'fixed' | 'adjustable' | 'standing-desk' | 'other' | ''} chairType
 * @property {YesNo} chairAdjustability
 * @property {'too-close' | 'correct' | 'too-far' | ''} monitorPosition
 * @property {'less-than-40cm' | '40-70cm' | 'more-than-70cm' | ''} monitorDistance
 * @property {'below-eye-level' | 'at-eye-level' | 'above-eye-level' | ''} monitorHeight
 * @property {'correct' | 'too-high' | 'too-far' | 'angled-incorrectly' | ''} keyboardPlacement
 * @property {'beside-keyboard' | 'too-far' | 'awkward-reach' | ''} mousePlacement
 * @property {'adequate' | 'too-bright' | 'too-dim' | 'glare-present' | ''} lighting
 * @property {'comfortable' | 'too-hot' | 'too-cold' | ''} temperature
 */

/**
 * @typedef {Object} PostureAssessment
 * @property {'upright' | 'slouched' | 'leaning-forward' | 'reclined' | ''} sittingPosture
 * @property {'upright' | 'leaning' | 'asymmetric' | 'not-applicable' | ''} standingPosture
 * @property {'neutral' | 'flexed-0-20' | 'flexed-20-plus' | 'extended' | 'twisted' | ''} neckAngle
 * @property {'neutral' | 'flexed-0-20' | 'flexed-20-60' | 'flexed-60-plus' | 'twisted' | ''} trunkAngle
 * @property {'neutral' | 'raised' | 'abducted' | 'flexed' | ''} shoulderPosition
 * @property {'neutral' | 'flexed' | 'extended' | 'ulnar-deviated' | 'radial-deviated' | ''} wristDeviation
 * @property {number | null} neckScore
 * @property {number | null} trunkScore
 * @property {number | null} legScore
 * @property {number | null} upperArmScore
 * @property {number | null} lowerArmScore
 * @property {number | null} wristScore
 */

/**
 * @typedef {Object} RepetitiveTasks
 * @property {string} taskDescription
 * @property {'rarely' | 'occasionally' | 'frequently' | 'constantly' | ''} frequency
 * @property {'less-than-1hr' | '1-2hrs' | '2-4hrs' | 'more-than-4hrs' | ''} durationPerSession
 * @property {'none' | 'light' | 'moderate' | 'heavy' | ''} forceRequired
 * @property {YesNo} vibrationExposure
 * @property {number | null} cycleTimeSeconds
 */

/**
 * @typedef {Object} ManualHandling
 * @property {'none' | 'occasional' | 'frequent' | 'constant' | ''} liftingFrequency
 * @property {number | null} loadWeightKg
 * @property {number | null} carryDistanceMetres
 * @property {'none' | 'light' | 'moderate' | 'heavy' | ''} pushPullForces
 * @property {YesNo} teamLifting
 * @property {YesNo} mechanicalAidsAvailable
 */

/**
 * @typedef {Object} CurrentSymptoms
 * @property {string[]} painLocations
 * @property {number | null} painSeverity
 * @property {string} onsetDate
 * @property {'less-than-1-week' | '1-4-weeks' | '1-3-months' | '3-6-months' | 'more-than-6-months' | ''} duration
 * @property {string} aggravatingFactors
 * @property {string} relievingFactors
 * @property {'none' | 'mild' | 'moderate' | 'severe' | 'unable-to-work' | ''} impactOnWork
 */

/**
 * @typedef {Object} MedicalHistory
 * @property {string[]} musculoskeletalConditions
 * @property {string} previousInjuries
 * @property {string} surgeries
 * @property {YesNo} chronicPain
 * @property {YesNo} rsiCarpalTunnel
 * @property {YesNo} backProblems
 */

/**
 * @typedef {Object} CurrentInterventions
 * @property {string[]} ergonomicEquipment
 * @property {YesNo} physiotherapy
 * @property {YesNo} occupationalTherapy
 * @property {string} workplaceAdjustments
 * @property {string} medications
 */

/**
 * @typedef {Object} PsychosocialFactors
 * @property {'very-satisfied' | 'satisfied' | 'neutral' | 'dissatisfied' | 'very-dissatisfied' | ''} jobSatisfaction
 * @property {'manageable' | 'slightly-heavy' | 'heavy' | 'excessive' | ''} workload
 * @property {'low' | 'moderate' | 'high' | 'very-high' | ''} stressLevel
 * @property {'regular' | 'occasional' | 'rarely' | 'none' | ''} breaksTaken
 * @property {'high' | 'moderate' | 'low' | 'none' | ''} autonomy
 * @property {'excellent' | 'good' | 'fair' | 'poor' | ''} employerSupport
 */

/**
 * @typedef {Object} Recommendations
 * @property {string} equipmentChanges
 * @property {string} workstationModifications
 * @property {string} trainingRequired
 * @property {string} breakSchedule
 * @property {string} followUpDate
 * @property {string} referrals
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {WorkstationSetup} workstationSetup
 * @property {PostureAssessment} postureAssessment
 * @property {RepetitiveTasks} repetitiveTasks
 * @property {ManualHandling} manualHandling
 * @property {CurrentSymptoms} currentSymptoms
 * @property {MedicalHistory} medicalHistory
 * @property {CurrentInterventions} currentInterventions
 * @property {PsychosocialFactors} psychosocialFactors
 * @property {Recommendations} recommendations
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} system
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
 * @property {number} rebaScore
 * @property {string} riskLevel
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
      occupation: '',
      employer: '',
      jobTitle: '',
      yearsInRole: null
    },
    workstationSetup: {
      deskHeight: '',
      chairType: '',
      chairAdjustability: '',
      monitorPosition: '',
      monitorDistance: '',
      monitorHeight: '',
      keyboardPlacement: '',
      mousePlacement: '',
      lighting: '',
      temperature: ''
    },
    postureAssessment: {
      sittingPosture: '',
      standingPosture: '',
      neckAngle: '',
      trunkAngle: '',
      shoulderPosition: '',
      wristDeviation: '',
      neckScore: null,
      trunkScore: null,
      legScore: null,
      upperArmScore: null,
      lowerArmScore: null,
      wristScore: null
    },
    repetitiveTasks: {
      taskDescription: '',
      frequency: '',
      durationPerSession: '',
      forceRequired: '',
      vibrationExposure: '',
      cycleTimeSeconds: null
    },
    manualHandling: {
      liftingFrequency: '',
      loadWeightKg: null,
      carryDistanceMetres: null,
      pushPullForces: '',
      teamLifting: '',
      mechanicalAidsAvailable: ''
    },
    currentSymptoms: {
      painLocations: [],
      painSeverity: null,
      onsetDate: '',
      duration: '',
      aggravatingFactors: '',
      relievingFactors: '',
      impactOnWork: ''
    },
    medicalHistory: {
      musculoskeletalConditions: [],
      previousInjuries: '',
      surgeries: '',
      chronicPain: '',
      rsiCarpalTunnel: '',
      backProblems: ''
    },
    currentInterventions: {
      ergonomicEquipment: [],
      physiotherapy: '',
      occupationalTherapy: '',
      workplaceAdjustments: '',
      medications: ''
    },
    psychosocialFactors: {
      jobSatisfaction: '',
      workload: '',
      stressLevel: '',
      breaksTaken: '',
      autonomy: '',
      employerSupport: ''
    },
    recommendations: {
      equipmentChanges: '',
      workstationModifications: '',
      trainingRequired: '',
      breakSchedule: '',
      followUpDate: '',
      referrals: ''
    }
  };
}

/** REBA risk level label (1-15 score). */
function rebaRiskLevel(score) {
  if (score <= 1) return 'Negligible risk';
  if (score <= 3) return 'Low risk';
  if (score <= 7) return 'Medium risk';
  if (score <= 10) return 'High risk';
  return 'Very high risk';
}

/** REBA risk-level CSS class. */
function rebaRiskClass(score) {
  if (score <= 1) return 'risk-negligible';
  if (score <= 3) return 'risk-low';
  if (score <= 7) return 'risk-medium';
  if (score <= 10) return 'risk-high';
  return 'risk-very-high';
}

/** Action level description for a given REBA score. */
function rebaActionLevel(score) {
  if (score <= 1) return 'No action required';
  if (score <= 3) return 'Action may be necessary';
  if (score <= 7) return 'Action necessary';
  if (score <= 10) return 'Action necessary soon';
  return 'Immediate action required';
}

export { emptyAssessment, rebaRiskLevel, rebaRiskClass, rebaActionLevel };
