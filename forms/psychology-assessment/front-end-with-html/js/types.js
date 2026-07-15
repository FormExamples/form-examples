// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of an assessment in one place.

/**
 * @typedef {'male' | 'female' | 'other' | 'prefer-not-to-say' | ''} Sex
 */

/**
 * @typedef {'yes' | 'no' | ''} YesNo
 */

/**
 * DASS-21 item response. 0 = did not apply, 3 = applied very much.
 * `null` represents an unanswered item.
 * @typedef {0 | 1 | 2 | 3 | null} DassItem
 */

/**
 * DASS-21 severity category for a subscale.
 * @typedef {'normal' | 'mild' | 'moderate' | 'severe' | 'extremely-severe'} DassSeverity
 */

/**
 * @typedef {'self-referral' | 'gp-referral' | 'employer-referral' |
 *           'follow-up' | 'screening' | 'other' | ''} AssessmentReason
 */

/**
 * @typedef {Object} Demographics
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {Sex} sex
 * @property {string} occupation
 */

/**
 * @typedef {Object} ReasonForAssessment
 * @property {AssessmentReason} reason
 * @property {string} reasonDetails
 * @property {string} primaryConcern
 * @property {number | null} symptomDurationWeeks
 */

/**
 * @typedef {Object} DassDepression
 * @property {DassItem} item3CouldNotExperiencePositive
 * @property {DassItem} item5DifficultInitiating
 * @property {DassItem} item10NothingToLookForwardTo
 * @property {DassItem} item13DownheartedBlue
 * @property {DassItem} item16UnableToBecomeEnthusiastic
 * @property {DassItem} item17NotWorthMuch
 * @property {DassItem} item21LifeMeaningless
 */

/**
 * @typedef {Object} DassAnxiety
 * @property {DassItem} item2DrynessOfMouth
 * @property {DassItem} item4BreathingDifficulty
 * @property {DassItem} item7Trembling
 * @property {DassItem} item9PanicWorry
 * @property {DassItem} item15ClosedToPanic
 * @property {DassItem} item19HeartActionAware
 * @property {DassItem} item20ScaredWithoutReason
 */

/**
 * @typedef {Object} DassStress
 * @property {DassItem} item1HardToWindDown
 * @property {DassItem} item6OverReact
 * @property {DassItem} item8NervousEnergy
 * @property {DassItem} item11AgitatedEasily
 * @property {DassItem} item12DifficultToRelax
 * @property {DassItem} item14Intolerant
 * @property {DassItem} item18TouchyEasily
 */

/**
 * @typedef {'none' | 'mild' | 'moderate' | 'severe' | ''} ImpactLevel
 */

/**
 * @typedef {Object} FunctionalImpact
 * @property {ImpactLevel} workImpact
 * @property {ImpactLevel} relationshipImpact
 * @property {ImpactLevel} dailyActivitiesImpact
 * @property {ImpactLevel} sleepImpact
 * @property {string} notes
 */

/**
 * @typedef {Object} RiskScreen
 * @property {YesNo} suicidalIdeation
 * @property {string} suicidalIdeationDetails
 * @property {YesNo} selfHarm
 * @property {YesNo} harmToOthers
 * @property {YesNo} psychiatricEmergencyHistory
 * @property {YesNo} hasSafetyPlan
 */

/**
 * @typedef {Object} SupportAndHistory
 * @property {YesNo} previousMentalHealthCare
 * @property {string} previousMentalHealthDetails
 * @property {YesNo} currentlyInTreatment
 * @property {string} currentTreatmentDetails
 * @property {string} currentMedications
 * @property {YesNo} familyMentalHealthHistory
 * @property {string} familyMentalHealthDetails
 * @property {'strong' | 'adequate' | 'limited' | 'isolated' | ''} socialSupport
 * @property {YesNo} substanceUseConcern
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {ReasonForAssessment} reasonForAssessment
 * @property {DassDepression} dassDepression
 * @property {DassAnxiety} dassAnxiety
 * @property {DassStress} dassStress
 * @property {FunctionalImpact} functionalImpact
 * @property {RiskScreen} riskScreen
 * @property {SupportAndHistory} supportAndHistory
 */

/**
 * @typedef {Object} SubscaleScore
 * @property {number} raw     - sum of 7 raw 0-3 item scores (0-21)
 * @property {number} scaled  - doubled raw, aligned with DASS-42 norms (0-42)
 * @property {DassSeverity} severity
 * @property {number} answered - count of items answered out of 7
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {'depression' | 'anxiety' | 'stress'} subscale
 * @property {number} itemNumber
 * @property {string} description
 * @property {number} score
 */

/**
 * @typedef {Object} AdditionalFlag
 * @property {string} id
 * @property {string} category
 * @property {string} message
 * @property {'urgent' | 'high' | 'medium' | 'low'} priority
 */

/**
 * @typedef {Object} GradingResult
 * @property {SubscaleScore} depression
 * @property {SubscaleScore} anxiety
 * @property {SubscaleScore} stress
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.PsychologyAssessment`.

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric / DassItem fields default to `null`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    demographics: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      sex: '',
      occupation: ''
    },
    reasonForAssessment: {
      reason: '',
      reasonDetails: '',
      primaryConcern: '',
      symptomDurationWeeks: null
    },
    dassDepression: {
      item3CouldNotExperiencePositive: null,
      item5DifficultInitiating: null,
      item10NothingToLookForwardTo: null,
      item13DownheartedBlue: null,
      item16UnableToBecomeEnthusiastic: null,
      item17NotWorthMuch: null,
      item21LifeMeaningless: null
    },
    dassAnxiety: {
      item2DrynessOfMouth: null,
      item4BreathingDifficulty: null,
      item7Trembling: null,
      item9PanicWorry: null,
      item15ClosedToPanic: null,
      item19HeartActionAware: null,
      item20ScaredWithoutReason: null
    },
    dassStress: {
      item1HardToWindDown: null,
      item6OverReact: null,
      item8NervousEnergy: null,
      item11AgitatedEasily: null,
      item12DifficultToRelax: null,
      item14Intolerant: null,
      item18TouchyEasily: null
    },
    functionalImpact: {
      workImpact: '',
      relationshipImpact: '',
      dailyActivitiesImpact: '',
      sleepImpact: '',
      notes: ''
    },
    riskScreen: {
      suicidalIdeation: '',
      suicidalIdeationDetails: '',
      selfHarm: '',
      harmToOthers: '',
      psychiatricEmergencyHistory: '',
      hasSafetyPlan: ''
    },
    supportAndHistory: {
      previousMentalHealthCare: '',
      previousMentalHealthDetails: '',
      currentlyInTreatment: '',
      currentTreatmentDetails: '',
      currentMedications: '',
      familyMentalHealthHistory: '',
      familyMentalHealthDetails: '',
      socialSupport: '',
      substanceUseConcern: ''
    }
  };
}

export { emptyAssessment };
