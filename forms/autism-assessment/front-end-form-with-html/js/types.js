// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Autism Assessment form.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'child' | 'adolescent' | 'adult' | ''} AgeGroup
 * @typedef {'self' | 'gp' | 'school' | 'employer' | 'family' | 'other' | ''} ReferralSource
 * @typedef {'never' | 'rarely' | 'sometimes' | 'often' | 'always' | ''} FrequencyLevel
 * @typedef {'none' | 'mild' | 'moderate' | 'severe' | ''} SensoryLevel
 * @typedef {0 | 1 | null} AQ10Score
 */

/**
 * @typedef {Object} Demographics
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {Sex} sex
 * @property {AgeGroup} ageGroup
 */

/**
 * @typedef {Object} ScreeningPurpose
 * @property {ReferralSource} referralSource
 * @property {string} referralSourceOther
 * @property {string} reasonForScreening
 * @property {YesNo} previousAssessments
 * @property {string} previousAssessmentDetails
 */

/**
 * @typedef {Object} AQ10Questionnaire
 * @property {AQ10Score} q1
 * @property {AQ10Score} q2
 * @property {AQ10Score} q3
 * @property {AQ10Score} q4
 * @property {AQ10Score} q5
 * @property {AQ10Score} q6
 * @property {AQ10Score} q7
 * @property {AQ10Score} q8
 * @property {AQ10Score} q9
 * @property {AQ10Score} q10
 * @property {Object} rawResponses    Map of questionKey -> raw response value
 */

/**
 * @typedef {Object} SocialCommunication
 * @property {FrequencyLevel} eyeContact
 * @property {FrequencyLevel} socialReciprocity
 * @property {FrequencyLevel} conversationSkills
 * @property {string} friendshipPatterns
 * @property {string} socialDifficultiesDetails
 */

/**
 * @typedef {Object} RepetitiveBehaviors
 * @property {FrequencyLevel} routineAdherence
 * @property {string} specialInterests
 * @property {YesNo} repetitiveMovements
 * @property {string} repetitiveMovementsDetails
 * @property {FrequencyLevel} resistanceToChange
 */

/**
 * @typedef {Object} SensoryProfile
 * @property {SensoryLevel} visualSensitivity
 * @property {SensoryLevel} auditorySensitivity
 * @property {SensoryLevel} tactileSensitivity
 * @property {SensoryLevel} olfactorySensitivity
 * @property {SensoryLevel} gustatorySensitivity
 * @property {string} sensorySeekingBehaviors
 */

/**
 * @typedef {Object} DevelopmentalHistory
 * @property {string} languageMilestones
 * @property {string} motorMilestones
 * @property {string} earlySocialBehavior
 * @property {string} developmentalConcerns
 */

/**
 * @typedef {Object} Medication
 * @property {string} name
 * @property {string} dose
 * @property {string} frequency
 */

/**
 * @typedef {Object} CurrentSupport
 * @property {string} currentAccommodations
 * @property {string[]} currentTherapies
 * @property {string} educationalSupport
 * @property {Medication[]} medications
 */

/**
 * @typedef {Object} FamilyHistory
 * @property {YesNo} autismFamily
 * @property {string} autismFamilyDetails
 * @property {YesNo} adhdFamily
 * @property {string} adhdFamilyDetails
 * @property {YesNo} learningDisabilities
 * @property {string} learningDisabilitiesDetails
 * @property {YesNo} mentalHealthFamily
 * @property {string} mentalHealthFamilyDetails
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {ScreeningPurpose} screeningPurpose
 * @property {AQ10Questionnaire} aq10Questionnaire
 * @property {SocialCommunication} socialCommunication
 * @property {RepetitiveBehaviors} repetitiveBehaviors
 * @property {SensoryProfile} sensoryProfile
 * @property {DevelopmentalHistory} developmentalHistory
 * @property {CurrentSupport} currentSupport
 * @property {FamilyHistory} familyHistory
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
 * @property {number} aq10Score
 * @property {string} aq10Category
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.AutismAssessment`.
(function () {
'use strict';
window.AutismAssessment = window.AutismAssessment || {};

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric (AQ-10) fields default to `null`;
 * lists default to `[]`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    demographics: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      sex: '',
      ageGroup: ''
    },
    screeningPurpose: {
      referralSource: '',
      referralSourceOther: '',
      reasonForScreening: '',
      previousAssessments: '',
      previousAssessmentDetails: ''
    },
    aq10Questionnaire: {
      q1: null, q2: null, q3: null, q4: null, q5: null,
      q6: null, q7: null, q8: null, q9: null, q10: null,
      rawResponses: {}
    },
    socialCommunication: {
      eyeContact: '',
      socialReciprocity: '',
      conversationSkills: '',
      friendshipPatterns: '',
      socialDifficultiesDetails: ''
    },
    repetitiveBehaviors: {
      routineAdherence: '',
      specialInterests: '',
      repetitiveMovements: '',
      repetitiveMovementsDetails: '',
      resistanceToChange: ''
    },
    sensoryProfile: {
      visualSensitivity: '',
      auditorySensitivity: '',
      tactileSensitivity: '',
      olfactorySensitivity: '',
      gustatorySensitivity: '',
      sensorySeekingBehaviors: ''
    },
    developmentalHistory: {
      languageMilestones: '',
      motorMilestones: '',
      earlySocialBehavior: '',
      developmentalConcerns: ''
    },
    currentSupport: {
      currentAccommodations: '',
      currentTherapies: [],
      educationalSupport: '',
      medications: []
    },
    familyHistory: {
      autismFamily: '',
      autismFamilyDetails: '',
      adhdFamily: '',
      adhdFamilyDetails: '',
      learningDisabilities: '',
      learningDisabilitiesDetails: '',
      mentalHealthFamily: '',
      mentalHealthFamilyDetails: ''
    }
  };
}

/**
 * AQ-10 score category label.
 *   0-5  = Below threshold
 *   6-10 = At or above threshold
 * @param {number} score
 */
function aq10Category(score) {
  if (score <= 5) return 'Below threshold';
  return 'At or above threshold';
}

/**
 * CSS hint class for the AQ-10 score badge.
 * @param {number} score
 */
function aq10ScoreClass(score) {
  if (score <= 3) return 'aq10-low';
  if (score <= 5) return 'aq10-mid';
  if (score <= 8) return 'aq10-high';
  return 'aq10-very-high';
}

Object.assign(window.AutismAssessment, {
  emptyAssessment,
  aq10Category,
  aq10ScoreClass
});
})();
