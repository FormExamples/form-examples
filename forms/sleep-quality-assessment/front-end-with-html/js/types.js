// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Sleep Quality Assessment.
//
// This file builds and exports the canonical empty AssessmentData shape
// used by the wizard, so that newly-added fields automatically default
// correctly when older saved state is rehydrated from localStorage.

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'excellent' | 'good' | 'fair' | 'poor' | ''} SleepEnvironment
 * @typedef {'not-during-past-month' | 'less-than-once-week' |
 *           'once-or-twice-week' | 'three-or-more-week' | ''} FrequencyOption
 * @typedef {FrequencyOption} MedicationFrequency
 * @typedef {'none' | 'light-1-2' | 'moderate-3-4' | 'vigorous-5-plus' | ''} ExerciseFrequency
 * @typedef {'none' | 'low-1-2' | 'moderate-3-4' | 'high-5-plus' | ''} CaffeineIntake
 * @typedef {'none' | 'occasional' | 'moderate' | 'heavy' | ''} AlcoholUse
 * @typedef {'none' | 'less-than-30-min' | '30-60-min' | 'more-than-60-min' | ''} ScreenTime
 */

/**
 * @typedef {Object} Demographics
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {Sex} sex
 *
 * @typedef {Object} SleepHabits
 * @property {string} usualBedtime
 * @property {string} usualWakeTime
 * @property {number | null} minutesToFallAsleep
 * @property {number | null} hoursOfSleep
 * @property {SleepEnvironment} sleepEnvironment
 *
 * @typedef {Object} SleepLatency
 * @property {FrequencyOption} timeToFallAsleep
 * @property {FrequencyOption} wakeUpDuringNight
 *
 * @typedef {Object} SleepDuration
 * @property {number | null} actualSleepHours
 * @property {YesNo} feelEnoughSleep
 *
 * @typedef {Object} SleepEfficiency
 * @property {string} bedtime
 * @property {string} wakeTime
 * @property {number | null} hoursInBed
 * @property {number | null} hoursAsleep
 *
 * @typedef {Object} SleepDisturbances
 * @property {FrequencyOption} wakeUpMiddleNight
 * @property {FrequencyOption} bathroomTrips
 * @property {FrequencyOption} breathingDifficulty
 * @property {FrequencyOption} coughingSnoring
 * @property {FrequencyOption} tooHot
 * @property {FrequencyOption} tooCold
 * @property {FrequencyOption} badDreams
 * @property {FrequencyOption} pain
 * @property {string} otherDisturbances
 *
 * @typedef {Object} DaytimeDysfunction
 * @property {FrequencyOption} troubleStayingAwake
 * @property {FrequencyOption} enthusiasmProblem
 * @property {YesNo} drivingDrowsiness
 *
 * @typedef {Object} SleepMedicationUse
 * @property {YesNo} prescriptionSleepMeds
 * @property {YesNo} otcSleepAids
 * @property {MedicationFrequency} frequency
 *
 * @typedef {Object} MedicalLifestyle
 * @property {CaffeineIntake} caffeineIntake
 * @property {AlcoholUse} alcoholUse
 * @property {ExerciseFrequency} exerciseFrequency
 * @property {ScreenTime} screenTimeBeforeBed
 * @property {YesNo} shiftWork
 * @property {string} medicalConditions
 * @property {string} currentMedications
 *
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {SleepHabits} sleepHabits
 * @property {SleepLatency} sleepLatency
 * @property {SleepDuration} sleepDuration
 * @property {SleepEfficiency} sleepEfficiency
 * @property {SleepDisturbances} sleepDisturbances
 * @property {DaytimeDysfunction} daytimeDysfunction
 * @property {SleepMedicationUse} sleepMedicationUse
 * @property {MedicalLifestyle} medicalLifestyle
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} component
 * @property {string} description
 * @property {number} score
 *
 * @typedef {Object} AdditionalFlag
 * @property {string} id
 * @property {string} category
 * @property {string} message
 * @property {'high' | 'medium' | 'low'} priority
 *
 * @typedef {Object} GradingResult
 * @property {number} psqiScore
 * @property {string} psqiCategoryLabel
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

// Wrapped in an IIFE; published via window.SleepQualityAssessment.

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
      sex: ''
    },
    sleepHabits: {
      usualBedtime: '',
      usualWakeTime: '',
      minutesToFallAsleep: null,
      hoursOfSleep: null,
      sleepEnvironment: ''
    },
    sleepLatency: {
      timeToFallAsleep: '',
      wakeUpDuringNight: ''
    },
    sleepDuration: {
      actualSleepHours: null,
      feelEnoughSleep: ''
    },
    sleepEfficiency: {
      bedtime: '',
      wakeTime: '',
      hoursInBed: null,
      hoursAsleep: null
    },
    sleepDisturbances: {
      wakeUpMiddleNight: '',
      bathroomTrips: '',
      breathingDifficulty: '',
      coughingSnoring: '',
      tooHot: '',
      tooCold: '',
      badDreams: '',
      pain: '',
      otherDisturbances: ''
    },
    daytimeDysfunction: {
      troubleStayingAwake: '',
      enthusiasmProblem: '',
      drivingDrowsiness: ''
    },
    sleepMedicationUse: {
      prescriptionSleepMeds: '',
      otcSleepAids: '',
      frequency: ''
    },
    medicalLifestyle: {
      caffeineIntake: '',
      alcoholUse: '',
      exerciseFrequency: '',
      screenTimeBeforeBed: '',
      shiftWork: '',
      medicalConditions: '',
      currentMedications: ''
    }
  };
}

/**
 * PSQI score category label.
 *   0-5   = Good sleep quality
 *   6-10  = Poor sleep quality
 *   11-15 = Sleep disorder likely
 *   16-21 = Severe sleep disturbance
 * @param {number} score
 * @returns {string}
 */
function psqiCategory(score) {
  if (score <= 5) return 'Good sleep quality';
  if (score <= 10) return 'Poor sleep quality';
  if (score <= 15) return 'Sleep disorder likely';
  return 'Severe sleep disturbance';
}

/**
 * CSS class hint for the PSQI score badge.
 * @param {number} score
 */
function psqiCategoryClass(score) {
  if (score <= 5) return 'psqi-good';
  if (score <= 10) return 'psqi-poor';
  if (score <= 15) return 'psqi-disorder';
  return 'psqi-severe';
}

/**
 * Sleep efficiency percentage = (hoursAsleep / hoursInBed) * 100.
 * @param {number | null} hoursAsleep
 * @param {number | null} hoursInBed
 * @returns {number | null}
 */
function sleepEfficiencyCalc(hoursAsleep, hoursInBed) {
  if (hoursAsleep === null || hoursAsleep === undefined) return null;
  if (hoursInBed === null || hoursInBed === undefined) return null;
  if (hoursInBed <= 0) return null;
  return (hoursAsleep / hoursInBed) * 100;
}

export { emptyAssessment, psqiCategory, psqiCategoryClass, sleepEfficiencyCalc };
