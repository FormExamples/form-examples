// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Mental Health Assessment form.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'mild' | 'moderate' | 'anaphylaxis' | ''} AllergySeverity
 *
 * PHQ-9 / GAD-7 item score: 0 = Not at all, 1 = Several days,
 * 2 = More than half the days, 3 = Nearly every day. null = unanswered.
 * @typedef {0 | 1 | 2 | 3 | null} PhqScore
 * @typedef {0 | 1 | 2 | 3 | null} GadScore
 *
 * @typedef {'very-low' | 'low' | 'neutral' | 'good' | 'very-good' | ''} MoodRating
 * @typedef {'very-poor' | 'poor' | 'fair' | 'good' | 'very-good' | ''} SleepQuality
 * @typedef {'significant-decrease' | 'decrease' | 'no-change' | 'increase' | 'significant-increase' | ''} AppetiteChange
 * @typedef {'very-low' | 'low' | 'moderate' | 'high' | 'very-high' | ''} EnergyLevel
 * @typedef {'very-poor' | 'poor' | 'fair' | 'good' | 'excellent' | ''} ConcentrationLevel
 *
 * @typedef {'none' | 'passive' | 'active-no-plan' | 'active-with-plan' | ''} SuicidalIdeation
 * @typedef {'none' | 'past' | 'current' | ''} SelfHarmHistory
 * @typedef {'none' | 'thoughts' | 'intent' | ''} HarmToOthers
 *
 * @typedef {'never' | 'monthly-or-less' | '2-4-per-month' | '2-3-per-week' | '4-or-more-per-week' | ''} AlcoholFrequency
 * @typedef {'1-2' | '3-4' | '5-6' | '7-9' | '10-or-more' | ''} AlcoholQuantity
 * @typedef {'never' | 'less-than-monthly' | 'monthly' | 'weekly' | 'daily-or-almost' | ''} BingeDrinking
 * @typedef {'never' | 'past' | 'occasional' | 'regular' | ''} DrugUseFrequency
 * @typedef {'never' | 'former' | 'current' | ''} TobaccoUse
 *
 * @typedef {'employed-full-time' | 'employed-part-time' | 'unemployed' | 'retired' | 'disabled' | 'student' | ''} EmploymentStatus
 * @typedef {'single' | 'married' | 'partnered' | 'divorced' | 'widowed' | 'separated' | ''} RelationshipStatus
 * @typedef {'stable' | 'unstable' | 'homeless' | ''} HousingStatus
 * @typedef {'strong' | 'moderate' | 'limited' | 'none' | ''} SupportLevel
 * @typedef {'none' | 'mild' | 'moderate' | 'severe' | ''} FunctionalImpairment
 */

/**
 * @typedef {Object} Demographics
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {Sex} sex
 * @property {string} emergencyContactName
 * @property {string} emergencyContactPhone
 * @property {string} emergencyContactRelationship
 */

/**
 * @typedef {Object} PhqResponses
 * @property {PhqScore} interest
 * @property {PhqScore} depression
 * @property {PhqScore} sleep
 * @property {PhqScore} energy
 * @property {PhqScore} appetite
 * @property {PhqScore} selfEsteem
 * @property {PhqScore} concentration
 * @property {PhqScore} psychomotor
 * @property {PhqScore} suicidalThoughts
 */

/**
 * @typedef {Object} GadResponses
 * @property {GadScore} nervousness
 * @property {GadScore} uncontrollableWorry
 * @property {GadScore} excessiveWorry
 * @property {GadScore} troubleRelaxing
 * @property {GadScore} restlessness
 * @property {GadScore} irritability
 * @property {GadScore} fearfulness
 */

/**
 * @typedef {Object} MoodAffect
 * @property {MoodRating} currentMood
 * @property {SleepQuality} sleepQuality
 * @property {AppetiteChange} appetiteChanges
 * @property {EnergyLevel} energyLevel
 * @property {ConcentrationLevel} concentration
 */

/**
 * @typedef {Object} RiskAssessment
 * @property {SuicidalIdeation} suicidalIdeation
 * @property {string} suicidalIdeationDetails
 * @property {SelfHarmHistory} selfHarm
 * @property {string} selfHarmDetails
 * @property {HarmToOthers} harmToOthers
 * @property {string} harmToOthersDetails
 * @property {YesNo} hasSafetyPlan
 * @property {string} safetyPlanDetails
 */

/**
 * @typedef {Object} SubstanceUse
 * @property {AlcoholFrequency} alcoholFrequency
 * @property {AlcoholQuantity} alcoholQuantity
 * @property {BingeDrinking} bingeDrinking
 * @property {DrugUseFrequency} drugUse
 * @property {string} drugDetails
 * @property {TobaccoUse} tobaccoUse
 * @property {string} tobaccoDetails
 */

/**
 * @typedef {Object} Medication
 * @property {string} name
 * @property {string} dose
 * @property {string} frequency
 */

/**
 * @typedef {Object} CurrentMedications
 * @property {Medication[]} psychiatricMedications
 * @property {Medication[]} otherMedications
 */

/**
 * @typedef {Object} TreatmentHistory
 * @property {YesNo} previousTherapy
 * @property {string} therapyDetails
 * @property {YesNo} previousHospitalizations
 * @property {string} hospitalizationDetails
 * @property {string} currentProviders
 */

/**
 * @typedef {Object} SocialFunctional
 * @property {EmploymentStatus} employmentStatus
 * @property {RelationshipStatus} relationshipStatus
 * @property {HousingStatus} housingStatus
 * @property {SupportLevel} supportSystem
 * @property {FunctionalImpairment} functionalImpairment
 * @property {string} additionalNotes
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {PhqResponses} phqResponses
 * @property {GadResponses} gadResponses
 * @property {MoodAffect} moodAffect
 * @property {RiskAssessment} riskAssessment
 * @property {SubstanceUse} substanceUse
 * @property {CurrentMedications} currentMedications
 * @property {TreatmentHistory} treatmentHistory
 * @property {SocialFunctional} socialFunctional
 */

/**
 * @typedef {'minimal' | 'mild' | 'moderate' | 'moderately-severe' | 'severe'} SeverityLevel
 *
 * @typedef {Object} ScoreResult
 * @property {string} instrument
 * @property {number} score
 * @property {number} maxScore
 * @property {SeverityLevel} severity
 * @property {string} label
 * @property {{ id: string, question: string, score: number }[]} itemScores
 *
 * @typedef {Object} AdditionalFlag
 * @property {string} id
 * @property {string} category
 * @property {string} message
 * @property {'urgent' | 'high' | 'medium' | 'low'} priority
 *
 * @typedef {Object} GradingResult
 * @property {ScoreResult} phq9
 * @property {ScoreResult} gad7
 * @property {number | null} auditC
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; PHQ-9 / GAD-7 scores default to `null`;
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
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelationship: ''
    },
    phqResponses: {
      interest: null,
      depression: null,
      sleep: null,
      energy: null,
      appetite: null,
      selfEsteem: null,
      concentration: null,
      psychomotor: null,
      suicidalThoughts: null
    },
    gadResponses: {
      nervousness: null,
      uncontrollableWorry: null,
      excessiveWorry: null,
      troubleRelaxing: null,
      restlessness: null,
      irritability: null,
      fearfulness: null
    },
    moodAffect: {
      currentMood: '',
      sleepQuality: '',
      appetiteChanges: '',
      energyLevel: '',
      concentration: ''
    },
    riskAssessment: {
      suicidalIdeation: '',
      suicidalIdeationDetails: '',
      selfHarm: '',
      selfHarmDetails: '',
      harmToOthers: '',
      harmToOthersDetails: '',
      hasSafetyPlan: '',
      safetyPlanDetails: ''
    },
    substanceUse: {
      alcoholFrequency: '',
      alcoholQuantity: '',
      bingeDrinking: '',
      drugUse: '',
      drugDetails: '',
      tobaccoUse: '',
      tobaccoDetails: ''
    },
    currentMedications: {
      psychiatricMedications: [],
      otherMedications: []
    },
    treatmentHistory: {
      previousTherapy: '',
      therapyDetails: '',
      previousHospitalizations: '',
      hospitalizationDetails: '',
      currentProviders: ''
    },
    socialFunctional: {
      employmentStatus: '',
      relationshipStatus: '',
      housingStatus: '',
      supportSystem: '',
      functionalImpairment: '',
      additionalNotes: ''
    }
  };
}

/** Calculate age from date-of-birth string (ISO yyyy-mm-dd). */
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

export { emptyAssessment, calculateAge };
