// Plain-JavaScript / JSDoc type definitions for the Sports Medicine
// Assessment (Pre-Participation Physical Evaluation, PPE 5th ed.) form.
//
// This file builds and exports the canonical empty AssessmentData shape
// used by the wizard, so newly-added fields automatically default
// correctly when older saved state is rehydrated from localStorage.

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | 'unknown' | ''} YesNo
 * @typedef {'low' | 'moderate' | 'high' | ''} ContactLevel
 *   Sport contact level: low (e.g. archery, golf), moderate (e.g. baseball,
 *   soccer), high (e.g. football, rugby, MMA, ice hockey).
 * @typedef {'cleared' | 'conditional' | 'pending' | 'not-cleared' | ''} Clearance
 */

/**
 * @typedef {Object} Demographics
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {Sex} sex
 * @property {number | null} weight    Weight in kilograms.
 * @property {number | null} height    Height in centimetres.
 * @property {number | null} bmi       Auto-calculated.
 * @property {string} emergencyContactName
 * @property {string} emergencyContactPhone
 */

/**
 * @typedef {Object} SportPositionDetails
 * @property {string} primarySport
 * @property {string} primaryPosition
 * @property {ContactLevel} contactLevel
 * @property {string} secondarySports
 * @property {string} competitiveLevel    e.g. recreational, school, club, elite
 * @property {number | null} hoursPerWeek
 * @property {YesNo} previousClearanceIssue
 * @property {string} previousClearanceDetails
 */

/**
 * @typedef {Object} MedicalHistory
 * @property {YesNo} chronicIllness
 * @property {string} chronicIllnessDetails
 * @property {YesNo} currentMedications
 * @property {string} currentMedicationDetails
 * @property {YesNo} allergiesKnown
 * @property {string} allergyDetails
 * @property {YesNo} priorSurgery
 * @property {string} priorSurgeryDetails
 * @property {YesNo} hospitalisedLastYear
 * @property {YesNo} asthmaOrExerciseInducedBronchospasm
 * @property {YesNo} diabetes
 * @property {YesNo} sickleCellTraitOrDisease
 * @property {YesNo} heatIllnessHistory
 * @property {YesNo} eatingDisorderHistory
 */

/**
 * @typedef {Object} FamilyHistory
 * @property {YesNo} suddenCardiacDeathUnder50
 * @property {string} suddenCardiacDeathRelation
 * @property {YesNo} hypertrophicCardiomyopathy
 * @property {YesNo} marfanSyndrome
 * @property {YesNo} longQTSyndrome
 * @property {YesNo} arrhythmiaOrPacemaker
 * @property {YesNo} unexplainedSeizureOrFainting
 */

/**
 * @typedef {Object} MenstrualHistoryREDS
 * @property {boolean} applicable          False if sex is not female.
 * @property {number | null} ageAtMenarche
 * @property {YesNo} regularPeriods
 * @property {YesNo} amenorrhoeaSixMonths
 * @property {number | null} cyclesLast12Months
 * @property {YesNo} restrictiveEatingPattern
 * @property {YesNo} stressFractureHistory
 * @property {YesNo} lowEnergyAvailabilityConcern
 */

/**
 * @typedef {Object} CardiovascularScreening
 * @property {YesNo} chestPainWithExertion
 * @property {YesNo} unexplainedSyncope
 * @property {YesNo} excessiveBreathlessness
 * @property {YesNo} palpitationsOrIrregularBeat
 * @property {YesNo} highBloodPressureDiagnosis
 * @property {YesNo} heartMurmurDetected
 * @property {YesNo} restrictedActivityForHeart
 * @property {number | null} restingSystolic
 * @property {number | null} restingDiastolic
 * @property {number | null} restingHeartRate
 */

/**
 * @typedef {Object} MusculoskeletalScreening
 * @property {YesNo} uncorrectedMajorInjury
 * @property {string} majorInjuryDetails
 * @property {YesNo} jointInstability
 * @property {string} jointInstabilityDetails
 * @property {YesNo} ongoingPainOrSwelling
 * @property {YesNo} chronicJointDisease
 * @property {YesNo} useBraceOrAssistiveDevice
 * @property {YesNo} fullRangeOfMotion
 * @property {YesNo} normalStrengthBilateral
 */

/**
 * @typedef {Object} NeurologicalConcussionBaseline
 * @property {number | null} totalConcussions
 * @property {YesNo} concussionLastSixMonths
 * @property {string} mostRecentConcussionDate
 * @property {YesNo} ongoingPostConcussiveSymptoms
 * @property {YesNo} historyOfSeizures
 * @property {YesNo} stinger Or burner (cervical nerve traction injury).
 * @property {YesNo} historyOfHeadOrNeckSurgery
 * @property {YesNo} baselineHeadachesOrMigraine
 */

/**
 * @typedef {Object} VisionSkin
 * @property {YesNo} correctiveLensesWorn
 * @property {YesNo} monocularAthlete    Vision in only one eye.
 * @property {YesNo} protectiveEyewearAvailable
 * @property {YesNo} activeSkinInfection
 * @property {string} activeSkinInfectionDetails
 * @property {YesNo} herpesGladiatorum
 * @property {YesNo} impetigoOrMRSA
 * @property {YesNo} openWoundsOrLesions
 */

/**
 * @typedef {Object} ClearanceDecision
 * @property {Clearance} preferredClearance   Clinician's draft decision.
 * @property {string} clearanceConditions
 * @property {string} followUpRequired
 * @property {string} clinicianName
 * @property {string} clinicianSignatureDate
 * @property {string} additionalNotes
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {SportPositionDetails} sportPositionDetails
 * @property {MedicalHistory} medicalHistory
 * @property {FamilyHistory} familyHistory
 * @property {MenstrualHistoryREDS} menstrualHistoryREDS
 * @property {CardiovascularScreening} cardiovascularScreening
 * @property {MusculoskeletalScreening} musculoskeletalScreening
 * @property {NeurologicalConcussionBaseline} neurologicalConcussionBaseline
 * @property {VisionSkin} visionSkin
 * @property {ClearanceDecision} clearanceDecision
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {1 | 2 | 3 | 4} grade   1=info, 2=conditional, 3=pending, 4=not-cleared.
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
 * @property {Clearance} clearance
 * @property {number} answeredCount
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.SportsMedicineAssessment`.
(function () {
'use strict';
window.SportsMedicineAssessment = window.SportsMedicineAssessment || {};

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric fields default to `null`.
 * `menstrualHistoryREDS.applicable` mirrors `demographics.sex === 'female'`
 * and is recomputed by the app whenever sex changes.
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
      bmi: null,
      emergencyContactName: '',
      emergencyContactPhone: ''
    },
    sportPositionDetails: {
      primarySport: '',
      primaryPosition: '',
      contactLevel: '',
      secondarySports: '',
      competitiveLevel: '',
      hoursPerWeek: null,
      previousClearanceIssue: '',
      previousClearanceDetails: ''
    },
    medicalHistory: {
      chronicIllness: '',
      chronicIllnessDetails: '',
      currentMedications: '',
      currentMedicationDetails: '',
      allergiesKnown: '',
      allergyDetails: '',
      priorSurgery: '',
      priorSurgeryDetails: '',
      hospitalisedLastYear: '',
      asthmaOrExerciseInducedBronchospasm: '',
      diabetes: '',
      sickleCellTraitOrDisease: '',
      heatIllnessHistory: '',
      eatingDisorderHistory: ''
    },
    familyHistory: {
      suddenCardiacDeathUnder50: '',
      suddenCardiacDeathRelation: '',
      hypertrophicCardiomyopathy: '',
      marfanSyndrome: '',
      longQTSyndrome: '',
      arrhythmiaOrPacemaker: '',
      unexplainedSeizureOrFainting: ''
    },
    menstrualHistoryREDS: {
      applicable: false,
      ageAtMenarche: null,
      regularPeriods: '',
      amenorrhoeaSixMonths: '',
      cyclesLast12Months: null,
      restrictiveEatingPattern: '',
      stressFractureHistory: '',
      lowEnergyAvailabilityConcern: ''
    },
    cardiovascularScreening: {
      chestPainWithExertion: '',
      unexplainedSyncope: '',
      excessiveBreathlessness: '',
      palpitationsOrIrregularBeat: '',
      highBloodPressureDiagnosis: '',
      heartMurmurDetected: '',
      restrictedActivityForHeart: '',
      restingSystolic: null,
      restingDiastolic: null,
      restingHeartRate: null
    },
    musculoskeletalScreening: {
      uncorrectedMajorInjury: '',
      majorInjuryDetails: '',
      jointInstability: '',
      jointInstabilityDetails: '',
      ongoingPainOrSwelling: '',
      chronicJointDisease: '',
      useBraceOrAssistiveDevice: '',
      fullRangeOfMotion: '',
      normalStrengthBilateral: ''
    },
    neurologicalConcussionBaseline: {
      totalConcussions: null,
      concussionLastSixMonths: '',
      mostRecentConcussionDate: '',
      ongoingPostConcussiveSymptoms: '',
      historyOfSeizures: '',
      stinger: '',
      historyOfHeadOrNeckSurgery: '',
      baselineHeadachesOrMigraine: ''
    },
    visionSkin: {
      correctiveLensesWorn: '',
      monocularAthlete: '',
      protectiveEyewearAvailable: '',
      activeSkinInfection: '',
      activeSkinInfectionDetails: '',
      herpesGladiatorum: '',
      impetigoOrMRSA: '',
      openWoundsOrLesions: ''
    },
    clearanceDecision: {
      preferredClearance: '',
      clearanceConditions: '',
      followUpRequired: '',
      clinicianName: '',
      clinicianSignatureDate: '',
      additionalNotes: ''
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
  if (bmi < 17.5) return 'Very low (RED-S risk)';
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

/**
 * Friendly label for a Clearance value.
 * @param {Clearance} c
 */
function clearanceLabel(c) {
  switch (c) {
    case 'cleared': return 'Cleared';
    case 'conditional': return 'Cleared with Conditions';
    case 'pending': return 'Not Cleared Pending Further Evaluation';
    case 'not-cleared': return 'Not Cleared for Sport';
    default: return '';
  }
}

/**
 * CSS class hint for the clearance badge.
 * @param {Clearance} c
 */
function clearanceClass(c) {
  switch (c) {
    case 'cleared': return 'clearance-cleared';
    case 'conditional': return 'clearance-conditional';
    case 'pending': return 'clearance-pending';
    case 'not-cleared': return 'clearance-not-cleared';
    default: return '';
  }
}

/** Friendly label for a rule grade. */
function gradeLabel(g) {
  switch (g) {
    case 4: return 'Not Cleared';
    case 3: return 'Pending';
    case 2: return 'Conditional';
    case 1: return 'Informational';
    default: return '';
  }
}

/** CSS class hint for the rule-grade badge. */
function gradeClass(g) {
  switch (g) {
    case 4: return 'grade-4';
    case 3: return 'grade-3';
    case 2: return 'grade-2';
    case 1: return 'grade-1';
    default: return '';
  }
}

Object.assign(window.SportsMedicineAssessment, {
  emptyAssessment,
  calculateBMI,
  bmiCategory,
  clearanceLabel,
  clearanceClass,
  gradeLabel,
  gradeClass
});
})();
