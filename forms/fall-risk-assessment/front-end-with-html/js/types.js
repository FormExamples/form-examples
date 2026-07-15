// Plain-JavaScript / JSDoc type definitions for the Fall Risk Assessment
// form. The shape mirrors what a SvelteKit `src/lib/engine/types.ts` would
// declare; this file is the canonical empty `AssessmentData` factory used
// by the wizard, so newly-added fields default correctly when older saved
// state is rehydrated from localStorage.

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
 * @property {number | null} age
 * @property {string} careSetting
 * @property {string} primaryDiagnosis
 */

/**
 * @typedef {Object} FallHistory
 * @property {YesNo} hasFallenInPastYear
 * @property {number | null} numberOfFallsPastYear
 * @property {string} lastFallDate
 * @property {YesNo} mostRecentFallInjurious
 * @property {string} mostRecentFallInjuryDetails
 * @property {YesNo} recurrentFallsWithInjury
 * @property {YesNo} fearOfFalling
 * @property {string} fallCircumstances
 */

/**
 * MFS responses. Each value is the integer score the patient selected for
 * that item (0 indicates "no"/"none"; null indicates not yet answered).
 *
 * @typedef {Object} MorseFallScale
 * @property {number | null} historyOfFalling          // 0 or 25
 * @property {number | null} secondaryDiagnosis        // 0 or 15
 * @property {number | null} ambulatoryAid             // 0, 15, or 30
 * @property {number | null} ivOrHeparinLock           // 0 or 20
 * @property {number | null} gaitTransferring          // 0, 10, or 20
 * @property {number | null} mentalStatus              // 0 or 15
 */

/**
 * @typedef {Object} MobilityGait
 * @property {string} mobilityLevel
 * @property {string} assistiveDeviceUsed
 * @property {YesNo} unsteadyGait
 * @property {YesNo} difficultyRisingFromChair
 * @property {YesNo} balanceImpairment
 * @property {YesNo} weaknessLowerExtremity
 * @property {YesNo} orthostaticHypotension
 * @property {YesNo} orthostaticHypotensionSevere
 * @property {string} timedUpAndGoSeconds
 * @property {string} mobilityNotes
 */

/**
 * @typedef {Object} Medication
 * @property {string} name
 * @property {string} dose
 * @property {string} frequency
 */

/**
 * @typedef {Object} MedicationReview
 * @property {Medication[]} medications
 * @property {YesNo} polypharmacy
 * @property {YesNo} sedativesOrHypnotics
 * @property {YesNo} antihypertensives
 * @property {YesNo} diuretics
 * @property {YesNo} anticoagulants
 * @property {YesNo} opioids
 * @property {YesNo} antidepressants
 * @property {YesNo} antipsychotics
 * @property {YesNo} recentMedicationChange
 * @property {string} medicationNotes
 */

/**
 * @typedef {Object} VisionSensory
 * @property {YesNo} visionImpairment
 * @property {YesNo} visionCorrected
 * @property {YesNo} hearingImpairment
 * @property {YesNo} peripheralNeuropathy
 * @property {YesNo} cataracts
 * @property {YesNo} glaucoma
 * @property {YesNo} macularDegeneration
 * @property {string} visionLastChecked
 * @property {string} sensoryNotes
 */

/**
 * @typedef {Object} EnvironmentalAssessment
 * @property {YesNo} loosThrowRugs
 * @property {YesNo} clutteredWalkways
 * @property {YesNo} poorLighting
 * @property {YesNo} stairsWithoutHandrails
 * @property {YesNo} bathroomGrabBarsAbsent
 * @property {YesNo} unsuitableFootwear
 * @property {YesNo} bedHeightProblem
 * @property {YesNo} hipProtectorsUsed
 * @property {string} environmentalNotes
 */

/**
 * @typedef {Object} CognitiveAssessment
 * @property {YesNo} dementiaDiagnosis
 * @property {YesNo} confusionOrDisorientation
 * @property {YesNo} impulsivity
 * @property {YesNo} overestimatesAbility
 * @property {YesNo} delirium
 * @property {string} cognitiveScreenTool
 * @property {string} cognitiveScreenScore
 * @property {string} cognitiveNotes
 */

/**
 * @typedef {Object} PreviousInterventions
 * @property {YesNo} fallsClinicReferral
 * @property {YesNo} physiotherapyProvided
 * @property {YesNo} occupationalTherapyProvided
 * @property {YesNo} medicationReviewCompleted
 * @property {YesNo} homeSafetyAssessment
 * @property {YesNo} interventionDeclined
 * @property {YesNo} missedReferral
 * @property {string} interventionNotes
 */

/**
 * @typedef {Object} FallPreventionPlan
 * @property {YesNo} bedAlarm
 * @property {YesNo} chairAlarm
 * @property {YesNo} nonSlipFootwear
 * @property {YesNo} hipProtectorsRecommended
 * @property {YesNo} exerciseProgramme
 * @property {YesNo} vitaminDSupplement
 * @property {YesNo} environmentalModifications
 * @property {YesNo} medicationDeprescribing
 * @property {YesNo} carerEducationProvided
 * @property {string} planNotes
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {FallHistory} fallHistory
 * @property {MorseFallScale} mfs
 * @property {MobilityGait} mobilityGait
 * @property {MedicationReview} medicationReview
 * @property {VisionSensory} visionSensory
 * @property {EnvironmentalAssessment} environmental
 * @property {CognitiveAssessment} cognitive
 * @property {PreviousInterventions} previousInterventions
 * @property {FallPreventionPlan} preventionPlan
 */

/**
 * @typedef {'low' | 'moderate' | 'high' | 'critical'} Severity
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} category
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
 * @property {number} mfsScore
 * @property {Severity} severity
 * @property {boolean} criticalOverride
 * @property {string[]} criticalReasons
 * @property {number} answeredCount
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
      age: null,
      careSetting: '',
      primaryDiagnosis: ''
    },
    fallHistory: {
      hasFallenInPastYear: '',
      numberOfFallsPastYear: null,
      lastFallDate: '',
      mostRecentFallInjurious: '',
      mostRecentFallInjuryDetails: '',
      recurrentFallsWithInjury: '',
      fearOfFalling: '',
      fallCircumstances: ''
    },
    mfs: {
      historyOfFalling: null,
      secondaryDiagnosis: null,
      ambulatoryAid: null,
      ivOrHeparinLock: null,
      gaitTransferring: null,
      mentalStatus: null
    },
    mobilityGait: {
      mobilityLevel: '',
      assistiveDeviceUsed: '',
      unsteadyGait: '',
      difficultyRisingFromChair: '',
      balanceImpairment: '',
      weaknessLowerExtremity: '',
      orthostaticHypotension: '',
      orthostaticHypotensionSevere: '',
      timedUpAndGoSeconds: '',
      mobilityNotes: ''
    },
    medicationReview: {
      medications: [],
      polypharmacy: '',
      sedativesOrHypnotics: '',
      antihypertensives: '',
      diuretics: '',
      anticoagulants: '',
      opioids: '',
      antidepressants: '',
      antipsychotics: '',
      recentMedicationChange: '',
      medicationNotes: ''
    },
    visionSensory: {
      visionImpairment: '',
      visionCorrected: '',
      hearingImpairment: '',
      peripheralNeuropathy: '',
      cataracts: '',
      glaucoma: '',
      macularDegeneration: '',
      visionLastChecked: '',
      sensoryNotes: ''
    },
    environmental: {
      loosThrowRugs: '',
      clutteredWalkways: '',
      poorLighting: '',
      stairsWithoutHandrails: '',
      bathroomGrabBarsAbsent: '',
      unsuitableFootwear: '',
      bedHeightProblem: '',
      hipProtectorsUsed: '',
      environmentalNotes: ''
    },
    cognitive: {
      dementiaDiagnosis: '',
      confusionOrDisorientation: '',
      impulsivity: '',
      overestimatesAbility: '',
      delirium: '',
      cognitiveScreenTool: '',
      cognitiveScreenScore: '',
      cognitiveNotes: ''
    },
    previousInterventions: {
      fallsClinicReferral: '',
      physiotherapyProvided: '',
      occupationalTherapyProvided: '',
      medicationReviewCompleted: '',
      homeSafetyAssessment: '',
      interventionDeclined: '',
      missedReferral: '',
      interventionNotes: ''
    },
    preventionPlan: {
      bedAlarm: '',
      chairAlarm: '',
      nonSlipFootwear: '',
      hipProtectorsRecommended: '',
      exerciseProgramme: '',
      vitaminDSupplement: '',
      environmentalModifications: '',
      medicationDeprescribing: '',
      carerEducationProvided: '',
      planNotes: ''
    }
  };
}

/**
 * Friendly label for a Severity value.
 * @param {Severity} s
 */
function severityLabel(s) {
  switch (s) {
    case 'low': return 'Low Risk';
    case 'moderate': return 'Moderate Risk';
    case 'high': return 'High Risk';
    case 'critical': return 'Critical Risk';
    default: return '';
  }
}

/**
 * CSS class hint for the severity badge.
 * @param {Severity} s
 */
function severityClass(s) {
  switch (s) {
    case 'low': return 'severity-low';
    case 'moderate': return 'severity-moderate';
    case 'high': return 'severity-high';
    case 'critical': return 'severity-critical';
    default: return '';
  }
}

export { emptyAssessment, severityLabel, severityClass };
