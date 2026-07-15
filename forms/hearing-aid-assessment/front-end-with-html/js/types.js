// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Hearing Aid Assessment form.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {0 | 2 | 4 | null} HHIESScore
 * @typedef {'sudden' | 'gradual' | ''} OnsetType
 * @typedef {'left' | 'right' | 'both' | ''} AffectedEar
 * @typedef {'sensorineural' | 'conductive' | 'mixed' | 'unknown' | ''} HearingLossType
 * @typedef {'none' | 'slight' | 'moderate' | 'severe' | ''} DifficultyLevel
 * @typedef {'very-satisfied' | 'satisfied' | 'neutral' | 'dissatisfied' | 'very-dissatisfied' | ''} SatisfactionLevel
 * @typedef {'very-comfortable' | 'comfortable' | 'somewhat-comfortable' | 'uncomfortable' | ''} TechnologyComfort
 * @typedef {'good' | 'fair' | 'poor' | ''} DexterityLevel
 * @typedef {'good' | 'fair' | 'poor' | ''} VisionStatus
 * @typedef {'very-willing' | 'willing' | 'uncertain' | 'reluctant' | ''} WillingnessLevel
 * @typedef {'none' | 'mild' | 'moderate' | 'significant' | ''} ConcernLevel
 */

/**
 * @typedef {Object} Demographics
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {Sex} sex
 */

/**
 * @typedef {Object} HearingHistory
 * @property {OnsetType} onsetType
 * @property {string} duration
 * @property {AffectedEar} affectedEar
 * @property {YesNo} familyHistory
 * @property {YesNo} noiseExposure
 * @property {YesNo} tinnitus
 * @property {YesNo} vertigo
 * @property {YesNo} earSurgery
 * @property {YesNo} ototoxicMedications
 */

/**
 * @typedef {Object} HHIESQuestionnaire
 * @property {HHIESScore} q1
 * @property {HHIESScore} q2
 * @property {HHIESScore} q3
 * @property {HHIESScore} q4
 * @property {HHIESScore} q5
 * @property {HHIESScore} q6
 * @property {HHIESScore} q7
 * @property {HHIESScore} q8
 * @property {HHIESScore} q9
 * @property {HHIESScore} q10
 */

/**
 * @typedef {Object} CommunicationDifficulties
 * @property {DifficultyLevel} quietConversation
 * @property {DifficultyLevel} groupConversation
 * @property {DifficultyLevel} telephone
 * @property {DifficultyLevel} television
 * @property {DifficultyLevel} publicPlaces
 * @property {DifficultyLevel} workDifficulty
 */

/**
 * @typedef {Object} CurrentHearingAids
 * @property {YesNo} hasHearingAids
 * @property {string} leftAidType
 * @property {string} rightAidType
 * @property {string} aidAge
 * @property {SatisfactionLevel} satisfaction
 * @property {number | null} dailyUseHours
 * @property {string} difficulties
 */

/**
 * @typedef {Object} EarExamination
 * @property {string} leftExternalEar
 * @property {string} rightExternalEar
 * @property {string} leftTympanicMembrane
 * @property {string} rightTympanicMembrane
 * @property {YesNo} cerumenLeft
 * @property {YesNo} cerumenRight
 * @property {string} abnormalities
 */

/**
 * @typedef {Object} AudiogramResults
 * @property {number | null} leftPTA
 * @property {number | null} rightPTA
 * @property {number | null} leftSRT
 * @property {number | null} rightSRT
 * @property {number | null} leftWordRecognition
 * @property {number | null} rightWordRecognition
 * @property {HearingLossType} hearingLossType
 */

/**
 * @typedef {Object} LifestyleNeeds
 * @property {string} socialActivity
 * @property {string} occupationRequirements
 * @property {string} hobbies
 * @property {TechnologyComfort} technologyComfort
 * @property {DexterityLevel} dexterity
 * @property {VisionStatus} visionStatus
 */

/**
 * @typedef {Object} ExpectationsGoals
 * @property {string} primaryGoal
 * @property {YesNo} realisticExpectations
 * @property {WillingnessLevel} willingnessToWear
 * @property {ConcernLevel} budgetConcerns
 * @property {ConcernLevel} cosmeticConcerns
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {HearingHistory} hearingHistory
 * @property {HHIESQuestionnaire} hhiesQuestionnaire
 * @property {CommunicationDifficulties} communicationDifficulties
 * @property {CurrentHearingAids} currentHearingAids
 * @property {EarExamination} earExamination
 * @property {AudiogramResults} audiogramResults
 * @property {LifestyleNeeds} lifestyleNeeds
 * @property {ExpectationsGoals} expectationsGoals
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
 * @property {number} hhiesScore
 * @property {string} hhiesCategory
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.HearingAidAssessment`.

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric fields default to `null`; HHIE-S scores
 * default to `null`.
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
    hearingHistory: {
      onsetType: '',
      duration: '',
      affectedEar: '',
      familyHistory: '',
      noiseExposure: '',
      tinnitus: '',
      vertigo: '',
      earSurgery: '',
      ototoxicMedications: ''
    },
    hhiesQuestionnaire: {
      q1: null,
      q2: null,
      q3: null,
      q4: null,
      q5: null,
      q6: null,
      q7: null,
      q8: null,
      q9: null,
      q10: null
    },
    communicationDifficulties: {
      quietConversation: '',
      groupConversation: '',
      telephone: '',
      television: '',
      publicPlaces: '',
      workDifficulty: ''
    },
    currentHearingAids: {
      hasHearingAids: '',
      leftAidType: '',
      rightAidType: '',
      aidAge: '',
      satisfaction: '',
      dailyUseHours: null,
      difficulties: ''
    },
    earExamination: {
      leftExternalEar: '',
      rightExternalEar: '',
      leftTympanicMembrane: '',
      rightTympanicMembrane: '',
      cerumenLeft: '',
      cerumenRight: '',
      abnormalities: ''
    },
    audiogramResults: {
      leftPTA: null,
      rightPTA: null,
      leftSRT: null,
      rightSRT: null,
      leftWordRecognition: null,
      rightWordRecognition: null,
      hearingLossType: ''
    },
    lifestyleNeeds: {
      socialActivity: '',
      occupationRequirements: '',
      hobbies: '',
      technologyComfort: '',
      dexterity: '',
      visionStatus: ''
    },
    expectationsGoals: {
      primaryGoal: '',
      realisticExpectations: '',
      willingnessToWear: '',
      budgetConcerns: '',
      cosmeticConcerns: ''
    }
  };
}

/**
 * Calculate age from date-of-birth string. Mirrors the SvelteKit
 * engine `calculateAge` helper.
 * @param {string} dob
 * @returns {number | null}
 */
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
 * HHIE-S score category label.
 *   0-8   = No handicap
 *   10-22 = Mild to moderate handicap
 *   24-40 = Significant handicap
 * @param {number} score
 * @returns {string}
 */
function hhiesCategory(score) {
  if (score <= 8) return 'No handicap';
  if (score <= 22) return 'Mild to moderate handicap';
  return 'Significant handicap';
}

/**
 * CSS class hint for the HHIE-S severity badge.
 * @param {number} score
 * @returns {string}
 */
function hhiesSeverityClass(score) {
  if (score <= 8) return 'severity-no';
  if (score <= 22) return 'severity-mild-mod';
  return 'severity-significant';
}

/**
 * Hearing loss grade based on PTA (pure tone average) in dB HL.
 * Uses WHO classification.
 * @param {number | null} pta
 * @returns {string}
 */
function hearingLossGrade(pta) {
  if (pta === null || pta === undefined) return 'Not tested';
  if (pta <= 25) return 'Normal';
  if (pta <= 40) return 'Mild';
  if (pta <= 60) return 'Moderate';
  if (pta <= 80) return 'Severe';
  return 'Profound';
}

export { emptyAssessment, calculateAge, hhiesCategory, hhiesSeverityClass, hearingLossGrade };
