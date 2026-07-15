// Plain-JavaScript / JSDoc type definitions for the Sundowner Syndrome
// Assessment form. Mirrors the structure used by the SvelteKit reference
// implementations across the monorepo: an empty AssessmentData factory is
// the canonical source of truth so newly-added fields default correctly
// when older saved state is rehydrated from localStorage.

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'mild' | 'moderate' | 'severe' | 'critical'} Severity
 *
 * @typedef {'none' | 'mild' | 'moderate' | 'severe' | ''} CognitiveImpairment
 * @typedef {'normal' | 'mild' | 'moderate' | 'severe' | ''} DementiaStage
 * @typedef {'none' | 'occasional' | 'frequent' | 'continuous' | ''} EpisodeFrequency
 * @typedef {'good' | 'partial' | 'poor' | ''} Adherence
 * @typedef {'none' | 'minimal' | 'moderate' | 'severe' | ''} CarerStrain
 */

/**
 * @typedef {Object} Demographics
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {Sex} sex
 * @property {number | null} ageYears
 * @property {string} primaryDiagnosis
 * @property {string} careSetting
 */

/**
 * @typedef {Object} CognitiveStatus
 * @property {DementiaStage} dementiaStage
 * @property {CognitiveImpairment} cognitiveImpairment
 * @property {number | null} mmseScore
 * @property {string} mmseDate
 * @property {YesNo} priorDeliriumHistory
 * @property {string} cognitiveNotes
 */

/**
 * Map of CMAI item id -> 1..7 score. Default 0 means unanswered.
 * Item ids are `cmai01` through `cmai29`.
 * @typedef {{ [id: string]: number }} CMAIResponses
 */

/**
 * Map of NPI domain key -> { frequency: 0..4, severity: 0..3 }.
 * 0 means unanswered. The product of frequency and severity yields the
 * domain score (0-12).
 * @typedef {Object} NPIDomainScore
 * @property {number} frequency
 * @property {number} severity
 */

/** @typedef {{ [domain: string]: NPIDomainScore }} NPIResponses */

/**
 * @typedef {Object} BehaviouralSymptoms
 * @property {CMAIResponses} cmai
 * @property {NPIResponses} npi
 * @property {string} behaviouralNotes
 */

/**
 * @typedef {Object} TemporalPattern
 * @property {string} typicalOnsetTime
 * @property {string} typicalOffsetTime
 * @property {string} peakTime
 * @property {EpisodeFrequency} episodeFrequency
 * @property {number | null} averageDurationMinutes
 * @property {YesNo} worseAtDusk
 * @property {YesNo} worseSeasonally
 * @property {string} temporalNotes
 */

/**
 * @typedef {Object} TriggerIdentification
 * @property {YesNo} fatigue
 * @property {YesNo} hunger
 * @property {YesNo} pain
 * @property {YesNo} infection
 * @property {YesNo} dehydration
 * @property {YesNo} sensoryOverload
 * @property {YesNo} unfamiliarSurroundings
 * @property {YesNo} carerChange
 * @property {YesNo} lowLight
 * @property {YesNo} medicationTiming
 * @property {string} otherTriggers
 */

/**
 * @typedef {Object} SleepWakeCycle
 * @property {number | null} bedtimeHourClock
 * @property {number | null} averageHoursOfSleep
 * @property {YesNo} difficultyFallingAsleep
 * @property {YesNo} nighttimeWandering
 * @property {YesNo} earlyMorningWaking
 * @property {YesNo} daytimeNapping
 * @property {number | null} nightAwakeningCount
 * @property {YesNo} reversedSleepCycle
 * @property {string} sleepNotes
 */

/**
 * @typedef {Object} MedicationItem
 * @property {string} name
 * @property {string} dose
 * @property {string} frequency
 * @property {string} indication
 */

/**
 * @typedef {Object} MedicationReview
 * @property {MedicationItem[]} currentMedications
 * @property {YesNo} anticholinergicBurden
 * @property {YesNo} sedativeUse
 * @property {YesNo} antipsychoticUse
 * @property {YesNo} recentMedicationChange
 * @property {string} recentMedicationChangeDetails
 * @property {Adherence} medicationAdherence
 * @property {string} medicationNotes
 */

/**
 * @typedef {Object} EnvironmentalAssessment
 * @property {YesNo} adequateDaylight
 * @property {YesNo} excessiveNoise
 * @property {YesNo} unfamiliarEnvironment
 * @property {YesNo} cluttered
 * @property {YesNo} mirrorsOrShadows
 * @property {YesNo} consistentRoutine
 * @property {YesNo} adequateSocialContact
 * @property {string} environmentalNotes
 */

/**
 * @typedef {Object} CarerImpact
 * @property {string} primaryCarer
 * @property {string} carerRelationship
 * @property {CarerStrain} carerStrainLevel
 * @property {YesNo} carerSleepDisturbed
 * @property {YesNo} carerBurnoutSigns
 * @property {YesNo} respiteCareInPlace
 * @property {YesNo} formalSupportEngaged
 * @property {string} carerNotes
 */

/**
 * @typedef {Object} ManagementPlan
 * @property {YesNo} nonPharmacologicalPlan
 * @property {string} nonPharmacologicalDetails
 * @property {YesNo} environmentalModifications
 * @property {string} environmentalModificationDetails
 * @property {YesNo} medicationReviewRequired
 * @property {YesNo} referralRequired
 * @property {string} referralDetails
 * @property {string} reviewDate
 * @property {string} planSummary
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {CognitiveStatus} cognitiveStatus
 * @property {BehaviouralSymptoms} behaviouralSymptoms
 * @property {TemporalPattern} temporalPattern
 * @property {TriggerIdentification} triggerIdentification
 * @property {SleepWakeCycle} sleepWakeCycle
 * @property {MedicationReview} medicationReview
 * @property {EnvironmentalAssessment} environmentalAssessment
 * @property {CarerImpact} carerImpact
 * @property {ManagementPlan} managementPlan
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {string} detail
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
 * @property {number} cmaiScore
 * @property {number} npiScore
 * @property {Severity} severity
 * @property {number} cmaiAnsweredCount
 * @property {number} npiAnsweredCount
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.SundownerSyndromeAssessment`.

// CMAI item ids. Kept here so `emptyAssessment()` can populate every key
// even before `cmai-rules.js` has loaded.
const CMAI_ITEM_IDS = [];
for (let i = 1; i <= 29; i++) {
  CMAI_ITEM_IDS.push(`cmai${String(i).padStart(2, '0')}`);
}

// NPI domain keys. Order matches the standard NPI questionnaire.
const NPI_DOMAIN_KEYS = [
  'delusions',
  'hallucinations',
  'agitationAggression',
  'depressionDysphoria',
  'anxiety',
  'elationEuphoria',
  'apathyIndifference',
  'disinhibition',
  'irritabilityLability',
  'motorDisturbance',
  'sleep',
  'appetiteEating'
];

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric fields default to `null`; lists default
 * to `[]`. CMAI and NPI maps are populated with all known keys at score 0
 * so the grader can iterate consistently.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  /** @type {CMAIResponses} */
  const cmai = {};
  for (const id of CMAI_ITEM_IDS) cmai[id] = 0;

  /** @type {NPIResponses} */
  const npi = {};
  for (const key of NPI_DOMAIN_KEYS) {
    npi[key] = { frequency: 0, severity: 0 };
  }

  return {
    demographics: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      sex: '',
      ageYears: null,
      primaryDiagnosis: '',
      careSetting: ''
    },
    cognitiveStatus: {
      dementiaStage: '',
      cognitiveImpairment: '',
      mmseScore: null,
      mmseDate: '',
      priorDeliriumHistory: '',
      cognitiveNotes: ''
    },
    behaviouralSymptoms: {
      cmai,
      npi,
      behaviouralNotes: ''
    },
    temporalPattern: {
      typicalOnsetTime: '',
      typicalOffsetTime: '',
      peakTime: '',
      episodeFrequency: '',
      averageDurationMinutes: null,
      worseAtDusk: '',
      worseSeasonally: '',
      temporalNotes: ''
    },
    triggerIdentification: {
      fatigue: '',
      hunger: '',
      pain: '',
      infection: '',
      dehydration: '',
      sensoryOverload: '',
      unfamiliarSurroundings: '',
      carerChange: '',
      lowLight: '',
      medicationTiming: '',
      otherTriggers: ''
    },
    sleepWakeCycle: {
      bedtimeHourClock: null,
      averageHoursOfSleep: null,
      difficultyFallingAsleep: '',
      nighttimeWandering: '',
      earlyMorningWaking: '',
      daytimeNapping: '',
      nightAwakeningCount: null,
      reversedSleepCycle: '',
      sleepNotes: ''
    },
    medicationReview: {
      currentMedications: [],
      anticholinergicBurden: '',
      sedativeUse: '',
      antipsychoticUse: '',
      recentMedicationChange: '',
      recentMedicationChangeDetails: '',
      medicationAdherence: '',
      medicationNotes: ''
    },
    environmentalAssessment: {
      adequateDaylight: '',
      excessiveNoise: '',
      unfamiliarEnvironment: '',
      cluttered: '',
      mirrorsOrShadows: '',
      consistentRoutine: '',
      adequateSocialContact: '',
      environmentalNotes: ''
    },
    carerImpact: {
      primaryCarer: '',
      carerRelationship: '',
      carerStrainLevel: '',
      carerSleepDisturbed: '',
      carerBurnoutSigns: '',
      respiteCareInPlace: '',
      formalSupportEngaged: '',
      carerNotes: ''
    },
    managementPlan: {
      nonPharmacologicalPlan: '',
      nonPharmacologicalDetails: '',
      environmentalModifications: '',
      environmentalModificationDetails: '',
      medicationReviewRequired: '',
      referralRequired: '',
      referralDetails: '',
      reviewDate: '',
      planSummary: ''
    }
  };
}

/**
 * Classify a CMAI total (29-203) into a severity band.
 * @param {number} cmai
 * @returns {Severity}
 */
function severityFromCMAI(cmai) {
  if (cmai > 120) return 'critical';
  if (cmai >= 76) return 'severe';
  if (cmai >= 46) return 'moderate';
  return 'mild';
}

/** Friendly label for a Severity. */
function severityLabel(s) {
  switch (s) {
    case 'mild': return 'Mild';
    case 'moderate': return 'Moderate';
    case 'severe': return 'Severe';
    case 'critical': return 'Critical';
    default: return '';
  }
}

/** CSS hint for the severity badge. */
function severityClass(s) {
  switch (s) {
    case 'mild': return 'severity-mild';
    case 'moderate': return 'severity-moderate';
    case 'severe': return 'severity-severe';
    case 'critical': return 'severity-critical';
    default: return 'severity-unset';
  }
}

export { emptyAssessment, severityFromCMAI, severityLabel, severityClass, CMAI_ITEM_IDS, NPI_DOMAIN_KEYS };
