// Plain-JavaScript / JSDoc type definitions for the Dyslexia Assessment form.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'yes' | 'no' | 'unsure' | ''} YesNoUnsure
 */

/**
 * @typedef {Object} Demographics
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {Sex} sex
 * @property {number | null} ageYears
 * @property {string} preferredLanguage
 * @property {string} firstLanguage
 * @property {string} handedness
 * @property {string} referralSource
 * @property {string} referralReason
 */

/**
 * @typedef {Object} DevelopmentalHistory
 * @property {YesNoUnsure} pregnancyComplications
 * @property {string} pregnancyDetails
 * @property {YesNoUnsure} birthComplications
 * @property {string} birthDetails
 * @property {string} earlyMilestones
 * @property {YesNoUnsure} speechDelay
 * @property {YesNoUnsure} languageDelay
 * @property {YesNoUnsure} hearingProblems
 * @property {YesNoUnsure} visionProblems
 * @property {YesNoUnsure} familyHistoryDyslexia
 * @property {string} familyHistoryDetails
 * @property {string} otherDevelopmentalNotes
 */

/**
 * @typedef {Object} EducationalBackground
 * @property {string} schoolType
 * @property {string} currentYearGroup
 * @property {YesNoUnsure} schoolChanges
 * @property {number | null} schoolChangeCount
 * @property {YesNoUnsure} attendanceIssues
 * @property {string} attendanceDetails
 * @property {YesNoUnsure} eslLearner
 * @property {string} academicStrengths
 * @property {string} academicWeaknesses
 * @property {YesNoUnsure} previousAssessments
 * @property {string} previousAssessmentDetails
 */

/**
 * @typedef {Object} ReadingAssessment
 * @property {number | null} readingFluencyScore
 * @property {number | null} readingComprehensionScore
 * @property {YesNo} difficultyDecoding
 * @property {YesNo} difficultyComprehension
 * @property {YesNo} avoidsReading
 * @property {YesNo} slowReadingSpeed
 * @property {YesNo} losesPlaceWhenReading
 * @property {string} readingNotes
 */

/**
 * @typedef {Object} WritingSpelling
 * @property {number | null} spellingAccuracyScore
 * @property {number | null} writtenExpressionScore
 * @property {YesNo} difficultySpelling
 * @property {YesNo} difficultyHandwriting
 * @property {YesNo} difficultyOrganisingIdeas
 * @property {YesNo} omitsLettersOrWords
 * @property {YesNo} reversesLettersOrNumbers
 * @property {string} writingNotes
 */

/**
 * @typedef {Object} PhonologicalProcessing
 * @property {number | null} phonologicalAwarenessScore
 * @property {number | null} phonologicalMemoryScore
 * @property {number | null} rapidNamingScore
 * @property {YesNo} difficultyRhyming
 * @property {YesNo} difficultySegmentingSounds
 * @property {YesNo} difficultyBlendingSounds
 * @property {YesNo} difficultyLearningLetterSounds
 * @property {string} phonologicalNotes
 */

/**
 * @typedef {Object} WorkingMemoryProcessingSpeed
 * @property {number | null} workingMemoryScore
 * @property {number | null} processingSpeedScore
 * @property {YesNo} difficultyFollowingInstructions
 * @property {YesNo} difficultyRememberingSequences
 * @property {YesNo} slowToCompleteTasks
 * @property {YesNo} difficultyTakingNotes
 * @property {string} memoryNotes
 */

/**
 * @typedef {Object} EmotionalBehavioural
 * @property {YesNo} lowSelfEsteem
 * @property {YesNo} anxietyAboutSchool
 * @property {YesNo} avoidanceBehaviour
 * @property {YesNo} frustrationWithLearning
 * @property {YesNo} peerRelationshipDifficulties
 * @property {YesNo} sleepDisturbance
 * @property {YesNo} mentalHealthConcerns
 * @property {string} mentalHealthDetails
 * @property {string} behaviouralNotes
 */

/**
 * @typedef {Object} PreviousSupport
 * @property {YesNo} previousIntervention
 * @property {string} interventionTypes
 * @property {YesNo} currentEhcpOrIep
 * @property {string} ehcpDetails
 * @property {YesNo} accessArrangements
 * @property {string[]} accessArrangementsList
 * @property {YesNo} tutorialSupport
 * @property {YesNo} assistiveTechnologyUsed
 * @property {string} assistiveTechnologyDetails
 * @property {string} previousSupportNotes
 */

/**
 * @typedef {Object} RecommendationsSupportPlan
 * @property {string[]} recommendedSupports
 * @property {YesNo} structuredLiteracyRecommended
 * @property {YesNo} assistiveTechRecommended
 * @property {YesNo} extraTimeRecommended
 * @property {YesNo} specialistAssessmentRecommended
 * @property {YesNo} parentTrainingRecommended
 * @property {string} keyGoals
 * @property {string} reviewTimeframe
 * @property {string} additionalRecommendations
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {DevelopmentalHistory} developmentalHistory
 * @property {EducationalBackground} educationalBackground
 * @property {ReadingAssessment} readingAssessment
 * @property {WritingSpelling} writingSpelling
 * @property {PhonologicalProcessing} phonologicalProcessing
 * @property {WorkingMemoryProcessingSpeed} workingMemoryProcessingSpeed
 * @property {EmotionalBehavioural} emotionalBehavioural
 * @property {PreviousSupport} previousSupport
 * @property {RecommendationsSupportPlan} recommendationsSupportPlan
 */

/**
 * @typedef {'none' | 'mild' | 'moderate' | 'severe'} Severity
 *
 * @typedef {Object} DomainScore
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {number | null} score
 * @property {Severity} severity
 *
 * @typedef {Object} AdditionalFlag
 * @property {string} id
 * @property {string} category
 * @property {string} message
 * @property {'urgent' | 'high' | 'medium' | 'low'} priority
 *
 * @typedef {Object} GradingResult
 * @property {Severity} overallSeverity
 * @property {number | null} lowestScore
 * @property {number} answeredCount
 * @property {DomainScore[]} domainScores
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.DyslexiaAssessment`.
(function () {
'use strict';
window.DyslexiaAssessment = window.DyslexiaAssessment || {};

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
      ageYears: null,
      preferredLanguage: '',
      firstLanguage: '',
      handedness: '',
      referralSource: '',
      referralReason: ''
    },
    developmentalHistory: {
      pregnancyComplications: '',
      pregnancyDetails: '',
      birthComplications: '',
      birthDetails: '',
      earlyMilestones: '',
      speechDelay: '',
      languageDelay: '',
      hearingProblems: '',
      visionProblems: '',
      familyHistoryDyslexia: '',
      familyHistoryDetails: '',
      otherDevelopmentalNotes: ''
    },
    educationalBackground: {
      schoolType: '',
      currentYearGroup: '',
      schoolChanges: '',
      schoolChangeCount: null,
      attendanceIssues: '',
      attendanceDetails: '',
      eslLearner: '',
      academicStrengths: '',
      academicWeaknesses: '',
      previousAssessments: '',
      previousAssessmentDetails: ''
    },
    readingAssessment: {
      readingFluencyScore: null,
      readingComprehensionScore: null,
      difficultyDecoding: '',
      difficultyComprehension: '',
      avoidsReading: '',
      slowReadingSpeed: '',
      losesPlaceWhenReading: '',
      readingNotes: ''
    },
    writingSpelling: {
      spellingAccuracyScore: null,
      writtenExpressionScore: null,
      difficultySpelling: '',
      difficultyHandwriting: '',
      difficultyOrganisingIdeas: '',
      omitsLettersOrWords: '',
      reversesLettersOrNumbers: '',
      writingNotes: ''
    },
    phonologicalProcessing: {
      phonologicalAwarenessScore: null,
      phonologicalMemoryScore: null,
      rapidNamingScore: null,
      difficultyRhyming: '',
      difficultySegmentingSounds: '',
      difficultyBlendingSounds: '',
      difficultyLearningLetterSounds: '',
      phonologicalNotes: ''
    },
    workingMemoryProcessingSpeed: {
      workingMemoryScore: null,
      processingSpeedScore: null,
      difficultyFollowingInstructions: '',
      difficultyRememberingSequences: '',
      slowToCompleteTasks: '',
      difficultyTakingNotes: '',
      memoryNotes: ''
    },
    emotionalBehavioural: {
      lowSelfEsteem: '',
      anxietyAboutSchool: '',
      avoidanceBehaviour: '',
      frustrationWithLearning: '',
      peerRelationshipDifficulties: '',
      sleepDisturbance: '',
      mentalHealthConcerns: '',
      mentalHealthDetails: '',
      behaviouralNotes: ''
    },
    previousSupport: {
      previousIntervention: '',
      interventionTypes: '',
      currentEhcpOrIep: '',
      ehcpDetails: '',
      accessArrangements: '',
      accessArrangementsList: [],
      tutorialSupport: '',
      assistiveTechnologyUsed: '',
      assistiveTechnologyDetails: '',
      previousSupportNotes: ''
    },
    recommendationsSupportPlan: {
      recommendedSupports: [],
      structuredLiteracyRecommended: '',
      assistiveTechRecommended: '',
      extraTimeRecommended: '',
      specialistAssessmentRecommended: '',
      parentTrainingRecommended: '',
      keyGoals: '',
      reviewTimeframe: '',
      additionalRecommendations: ''
    }
  };
}

/**
 * Classify a single standardised score (mean 100, SD 15) into a severity band.
 * - 85+         → 'none'    (average or above)
 * - 70-84       → 'mild'    (below average)
 * - 55-69       → 'moderate'(well below average)
 * - <55         → 'severe'  (significantly below average)
 *
 * @param {number | null | undefined} score
 * @returns {Severity}
 */
function scoreSeverity(score) {
  if (score === null || score === undefined || Number.isNaN(score)) return 'none';
  if (score >= 85) return 'none';
  if (score >= 70) return 'mild';
  if (score >= 55) return 'moderate';
  return 'severe';
}

/**
 * Friendly band label.
 * @param {number | null | undefined} score
 */
function scoreBandLabel(score) {
  if (score === null || score === undefined || Number.isNaN(score)) return '';
  if (score >= 116) return 'Above average';
  if (score >= 85) return 'Average';
  if (score >= 70) return 'Below average';
  if (score >= 55) return 'Well below average';
  return 'Significantly below average';
}

Object.assign(window.DyslexiaAssessment, {
  emptyAssessment,
  scoreSeverity,
  scoreBandLabel
});
})();
