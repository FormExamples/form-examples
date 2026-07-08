// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Neurology Assessment form.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.

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
 */

/**
 * @typedef {Object} ChiefComplaint
 * @property {string} primarySymptom
 * @property {string} onsetDate
 * @property {'sudden' | 'gradual' | ''} onsetType
 * @property {string} duration
 * @property {'improving' | 'stable' | 'worsening' | ''} progression
 * @property {string} associatedSymptoms
 * @property {string} precipitatingEvent
 */

/**
 * @typedef {Object} NIHSSAssessment
 * @property {number | null} consciousness
 * @property {number | null} consciousnessQuestions
 * @property {number | null} consciousnessCommands
 * @property {number | null} gaze
 * @property {number | null} visual
 * @property {number | null} facialPalsy
 * @property {number | null} motorLeftArm
 * @property {number | null} motorRightArm
 * @property {number | null} motorLeftLeg
 * @property {number | null} motorRightLeg
 * @property {number | null} limbAtaxia
 * @property {number | null} sensory
 * @property {number | null} language
 * @property {number | null} dysarthria
 * @property {number | null} extinctionInattention
 */

/**
 * @typedef {Object} HeadacheAssessment
 * @property {YesNo} headachePresent
 * @property {string} headacheType
 * @property {string} frequency
 * @property {number | null} severity
 * @property {YesNo} aura
 * @property {string} auraDescription
 * @property {string} triggers
 * @property {YesNo} redFlagSuddenOnset
 * @property {YesNo} redFlagWorstEver
 * @property {YesNo} redFlagFever
 * @property {YesNo} redFlagNeckStiffness
 * @property {YesNo} redFlagNeurologicalDeficit
 */

/**
 * @typedef {Object} SeizureHistory
 * @property {YesNo} seizureHistory
 * @property {string} seizureType
 * @property {string} frequency
 * @property {string} lastSeizureDate
 * @property {string} triggers
 * @property {YesNo} aura
 * @property {string} auraDescription
 * @property {string} postIctalState
 * @property {YesNo} statusEpilepticus
 */

/**
 * @typedef {Object} MotorSensoryExam
 * @property {string} strengthUpperLeft
 * @property {string} strengthUpperRight
 * @property {string} strengthLowerLeft
 * @property {string} strengthLowerRight
 * @property {string} tone
 * @property {string} reflexes
 * @property {string} plantarResponseLeft
 * @property {string} plantarResponseRight
 * @property {string} sensation
 * @property {string} sensationDetails
 * @property {YesNo} coordination
 * @property {string} coordinationDetails
 * @property {string} gait
 */

/**
 * @typedef {Object} CognitiveAssessment
 * @property {string} orientation
 * @property {YesNo} attentionNormal
 * @property {YesNo} memoryShortTerm
 * @property {YesNo} memoryLongTerm
 * @property {YesNo} languageNormal
 * @property {string} languageDetails
 * @property {YesNo} visuospatialNormal
 * @property {YesNo} executiveFunctionNormal
 * @property {number | null} mmseScore
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
 * @property {YesNo} anticonvulsants
 * @property {string} anticonvulsantDetails
 * @property {YesNo} migraineProphylaxis
 * @property {string} migraineProphylaxisDetails
 * @property {YesNo} neuropathicPainMeds
 * @property {string} neuropathicPainDetails
 * @property {YesNo} anticoagulants
 * @property {string} anticoagulantDetails
 */

/**
 * @typedef {Object} DiagnosticResults
 * @property {YesNo} mriCtPerformed
 * @property {string} mriCtFinding
 * @property {string} mriCtDetails
 * @property {YesNo} eegPerformed
 * @property {string} eegFinding
 * @property {string} eegDetails
 * @property {YesNo} emgNcsPerformed
 * @property {string} emgNcsDetails
 * @property {YesNo} lumbarPuncturePerformed
 * @property {string} lumbarPunctureDetails
 */

/**
 * @typedef {Object} FunctionalSocial
 * @property {number | null} mrsScore
 * @property {string} drivingStatus
 * @property {string} drivingRestrictionDetails
 * @property {string} employmentStatus
 * @property {string} employmentImpact
 * @property {string} supportNeeds
 * @property {string} livingSituation
 * @property {YesNo} carePlanRequired
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {ChiefComplaint} chiefComplaint
 * @property {NIHSSAssessment} nihssAssessment
 * @property {HeadacheAssessment} headacheAssessment
 * @property {SeizureHistory} seizureHistory
 * @property {MotorSensoryExam} motorSensoryExam
 * @property {CognitiveAssessment} cognitiveAssessment
 * @property {CurrentMedications} currentMedications
 * @property {DiagnosticResults} diagnosticResults
 * @property {FunctionalSocial} functionalSocial
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
 * @property {number} nihssScore
 * @property {string} nihssSeverity
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.NeurologyAssessment`.
(function () {
'use strict';
window.NeurologyAssessment = window.NeurologyAssessment || {};

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
      height: null
    },
    chiefComplaint: {
      primarySymptom: '',
      onsetDate: '',
      onsetType: '',
      duration: '',
      progression: '',
      associatedSymptoms: '',
      precipitatingEvent: ''
    },
    nihssAssessment: {
      consciousness: null,
      consciousnessQuestions: null,
      consciousnessCommands: null,
      gaze: null,
      visual: null,
      facialPalsy: null,
      motorLeftArm: null,
      motorRightArm: null,
      motorLeftLeg: null,
      motorRightLeg: null,
      limbAtaxia: null,
      sensory: null,
      language: null,
      dysarthria: null,
      extinctionInattention: null
    },
    headacheAssessment: {
      headachePresent: '',
      headacheType: '',
      frequency: '',
      severity: null,
      aura: '',
      auraDescription: '',
      triggers: '',
      redFlagSuddenOnset: '',
      redFlagWorstEver: '',
      redFlagFever: '',
      redFlagNeckStiffness: '',
      redFlagNeurologicalDeficit: ''
    },
    seizureHistory: {
      seizureHistory: '',
      seizureType: '',
      frequency: '',
      lastSeizureDate: '',
      triggers: '',
      aura: '',
      auraDescription: '',
      postIctalState: '',
      statusEpilepticus: ''
    },
    motorSensoryExam: {
      strengthUpperLeft: '',
      strengthUpperRight: '',
      strengthLowerLeft: '',
      strengthLowerRight: '',
      tone: '',
      reflexes: '',
      plantarResponseLeft: '',
      plantarResponseRight: '',
      sensation: '',
      sensationDetails: '',
      coordination: '',
      coordinationDetails: '',
      gait: ''
    },
    cognitiveAssessment: {
      orientation: '',
      attentionNormal: '',
      memoryShortTerm: '',
      memoryLongTerm: '',
      languageNormal: '',
      languageDetails: '',
      visuospatialNormal: '',
      executiveFunctionNormal: '',
      mmseScore: null
    },
    currentMedications: {
      medications: [],
      anticonvulsants: '',
      anticonvulsantDetails: '',
      migraineProphylaxis: '',
      migraineProphylaxisDetails: '',
      neuropathicPainMeds: '',
      neuropathicPainDetails: '',
      anticoagulants: '',
      anticoagulantDetails: ''
    },
    diagnosticResults: {
      mriCtPerformed: '',
      mriCtFinding: '',
      mriCtDetails: '',
      eegPerformed: '',
      eegFinding: '',
      eegDetails: '',
      emgNcsPerformed: '',
      emgNcsDetails: '',
      lumbarPuncturePerformed: '',
      lumbarPunctureDetails: ''
    },
    functionalSocial: {
      mrsScore: null,
      drivingStatus: '',
      drivingRestrictionDetails: '',
      employmentStatus: '',
      employmentImpact: '',
      supportNeeds: '',
      livingSituation: '',
      carePlanRequired: ''
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

/** Modified Rankin Scale (mRS) descriptive label. */
function mrsLabel(score) {
  if (score === null || score === undefined || score === '') return '';
  switch (Number(score)) {
    case 0: return 'mRS 0 - No symptoms';
    case 1: return 'mRS 1 - No significant disability';
    case 2: return 'mRS 2 - Slight disability';
    case 3: return 'mRS 3 - Moderate disability';
    case 4: return 'mRS 4 - Moderately severe disability';
    case 5: return 'mRS 5 - Severe disability';
    default: return `mRS ${score}`;
  }
}

Object.assign(window.NeurologyAssessment, {
  emptyAssessment,
  calculateAge,
  mrsLabel
});
})();
