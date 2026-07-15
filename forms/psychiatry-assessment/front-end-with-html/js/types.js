// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Psychiatry Assessment form.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.

/**
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'mild' | 'moderate' | 'severe' | ''} Severity
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'voluntary' | 'involuntary' | ''} LegalStatus
 * @typedef {'euthymic' | 'depressed' | 'elevated' | 'irritable' | 'anxious' | 'flat' | ''} MoodState
 * @typedef {'congruent' | 'incongruent' | 'restricted' | 'blunted' | 'flat' | 'labile' | ''} AffectType
 * @typedef {'linear' | 'circumstantial' | 'tangential' | 'loosening' | 'flight-of-ideas' | 'thought-blocking' | ''} ThoughtProcess
 * @typedef {'full' | 'partial' | 'none' | ''} InsightLevel
 * @typedef {'intact' | 'impaired' | 'poor' | ''} JudgementLevel
 * @typedef {'none' | 'low' | 'moderate' | 'high' | 'imminent' | ''} RiskLevel
 * @typedef {'none' | 'occasional' | 'regular' | 'daily' | 'dependent' | ''} SubstanceFrequency
 * @typedef {'stable' | 'temporary' | 'homeless' | 'supported' | 'institution' | ''} HousingStatus
 * @typedef {'employed' | 'unemployed' | 'retired' | 'student' | 'disability' | ''} EmploymentStatus
 * @typedef {'has-capacity' | 'lacks-capacity' | 'fluctuating' | 'not-assessed' | ''} CapacityDecision
 */

/**
 * @typedef {Object} Demographics
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {Sex} sex
 * @property {string} emergencyContactName
 * @property {string} emergencyContactPhone
 * @property {LegalStatus} legalStatus
 */

/**
 * @typedef {Object} PresentingComplaint
 * @property {string} chiefComplaint
 * @property {string} onsetDate
 * @property {string} duration
 * @property {Severity} severity
 * @property {string} precipitatingFactors
 */

/**
 * @typedef {Object} PsychiatricHistory
 * @property {string} previousDiagnoses
 * @property {YesNo} previousHospitalizations
 * @property {string} hospitalizationDetails
 * @property {YesNo} previousSuicideAttempts
 * @property {string} suicideAttemptDetails
 * @property {YesNo} selfHarmHistory
 * @property {string} selfHarmDetails
 */

/**
 * @typedef {Object} MentalStatusExam
 * @property {string} appearance
 * @property {string} behaviour
 * @property {string} speech
 * @property {MoodState} mood
 * @property {AffectType} affect
 * @property {ThoughtProcess} thoughtProcess
 * @property {string} thoughtContent
 * @property {YesNo} perceptualDisturbances
 * @property {string} perceptualDetails
 * @property {YesNo} cognitionIntact
 * @property {string} cognitionDetails
 * @property {InsightLevel} insight
 * @property {JudgementLevel} judgement
 */

/**
 * @typedef {Object} RiskAssessment
 * @property {YesNo} suicidalIdeation
 * @property {YesNo} suicidalPlan
 * @property {YesNo} suicidalIntent
 * @property {YesNo} suicidalMeans
 * @property {string} protectiveFactors
 * @property {YesNo} selfHarmCurrent
 * @property {RiskLevel} violenceRisk
 * @property {YesNo} safeguardingConcerns
 * @property {string} safeguardingDetails
 */

/**
 * @typedef {Object} MoodAndAnxiety
 * @property {number | null} phq9Score
 * @property {number | null} gad7Score
 * @property {YesNo} maniaScreen
 * @property {string} maniaDetails
 * @property {YesNo} psychoticSymptoms
 * @property {string} psychoticDetails
 */

/**
 * @typedef {Object} SubstanceUse
 * @property {number | null} alcoholAuditScore
 * @property {SubstanceFrequency} alcoholFrequency
 * @property {YesNo} drugUse
 * @property {string} drugDetails
 * @property {YesNo} tobaccoUse
 * @property {string} tobaccoDetails
 * @property {YesNo} gamblingProblem
 * @property {YesNo} withdrawalRisk
 * @property {string} withdrawalDetails
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
 * @property {string} sideEffects
 * @property {YesNo} compliance
 * @property {string} complianceDetails
 */

/**
 * @typedef {Object} MedicalHistory
 * @property {YesNo} neurologicalConditions
 * @property {string} neurologicalDetails
 * @property {YesNo} endocrineConditions
 * @property {string} endocrineDetails
 * @property {YesNo} chronicPain
 * @property {string} chronicPainDetails
 * @property {YesNo} pregnancy
 * @property {string} pregnancyDetails
 */

/**
 * @typedef {Object} SocialHistory
 * @property {HousingStatus} housing
 * @property {string} housingDetails
 * @property {EmploymentStatus} employment
 * @property {string} employmentDetails
 * @property {string} relationships
 * @property {YesNo} legalIssues
 * @property {string} legalDetails
 * @property {YesNo} financialDifficulties
 * @property {string} supportNetwork
 */

/**
 * @typedef {Object} CapacityAndConsent
 * @property {CapacityDecision} decisionMakingCapacity
 * @property {string} capacityDetails
 * @property {YesNo} advanceDirectives
 * @property {string} advanceDirectiveDetails
 * @property {YesNo} powerOfAttorney
 * @property {string} powerOfAttorneyDetails
 * @property {string} treatmentPreferences
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {PresentingComplaint} presentingComplaint
 * @property {PsychiatricHistory} psychiatricHistory
 * @property {MentalStatusExam} mentalStatusExam
 * @property {RiskAssessment} riskAssessment
 * @property {MoodAndAnxiety} moodAndAnxiety
 * @property {SubstanceUse} substanceUse
 * @property {CurrentMedications} currentMedications
 * @property {MedicalHistory} medicalHistory
 * @property {SocialHistory} socialHistory
 * @property {CapacityAndConsent} capacityAndConsent
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} domain
 * @property {string} description
 * @property {number} scoreImpact
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
 * @property {number} gafScore
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
      emergencyContactName: '',
      emergencyContactPhone: '',
      legalStatus: ''
    },
    presentingComplaint: {
      chiefComplaint: '',
      onsetDate: '',
      duration: '',
      severity: '',
      precipitatingFactors: ''
    },
    psychiatricHistory: {
      previousDiagnoses: '',
      previousHospitalizations: '',
      hospitalizationDetails: '',
      previousSuicideAttempts: '',
      suicideAttemptDetails: '',
      selfHarmHistory: '',
      selfHarmDetails: ''
    },
    mentalStatusExam: {
      appearance: '',
      behaviour: '',
      speech: '',
      mood: '',
      affect: '',
      thoughtProcess: '',
      thoughtContent: '',
      perceptualDisturbances: '',
      perceptualDetails: '',
      cognitionIntact: '',
      cognitionDetails: '',
      insight: '',
      judgement: ''
    },
    riskAssessment: {
      suicidalIdeation: '',
      suicidalPlan: '',
      suicidalIntent: '',
      suicidalMeans: '',
      protectiveFactors: '',
      selfHarmCurrent: '',
      violenceRisk: '',
      safeguardingConcerns: '',
      safeguardingDetails: ''
    },
    moodAndAnxiety: {
      phq9Score: null,
      gad7Score: null,
      maniaScreen: '',
      maniaDetails: '',
      psychoticSymptoms: '',
      psychoticDetails: ''
    },
    substanceUse: {
      alcoholAuditScore: null,
      alcoholFrequency: '',
      drugUse: '',
      drugDetails: '',
      tobaccoUse: '',
      tobaccoDetails: '',
      gamblingProblem: '',
      withdrawalRisk: '',
      withdrawalDetails: ''
    },
    currentMedications: {
      medications: [],
      sideEffects: '',
      compliance: '',
      complianceDetails: ''
    },
    medicalHistory: {
      neurologicalConditions: '',
      neurologicalDetails: '',
      endocrineConditions: '',
      endocrineDetails: '',
      chronicPain: '',
      chronicPainDetails: '',
      pregnancy: '',
      pregnancyDetails: ''
    },
    socialHistory: {
      housing: '',
      housingDetails: '',
      employment: '',
      employmentDetails: '',
      relationships: '',
      legalIssues: '',
      legalDetails: '',
      financialDifficulties: '',
      supportNetwork: ''
    },
    capacityAndConsent: {
      decisionMakingCapacity: '',
      capacityDetails: '',
      advanceDirectives: '',
      advanceDirectiveDetails: '',
      powerOfAttorney: '',
      powerOfAttorneyDetails: '',
      treatmentPreferences: ''
    }
  };
}

/** GAF full label (range and bracket name). */
function gafScoreLabel(score) {
  if (score >= 91) return 'GAF 91-100 - Superior functioning';
  if (score >= 81) return 'GAF 81-90 - Absent/minimal symptoms';
  if (score >= 71) return 'GAF 71-80 - Transient/expectable reactions';
  if (score >= 61) return 'GAF 61-70 - Mild symptoms';
  if (score >= 51) return 'GAF 51-60 - Moderate symptoms';
  if (score >= 41) return 'GAF 41-50 - Serious symptoms';
  if (score >= 31) return 'GAF 31-40 - Major impairment';
  if (score >= 21) return 'GAF 21-30 - Influenced by delusions/hallucinations';
  if (score >= 11) return 'GAF 11-20 - Some danger of hurting self/others';
  return 'GAF 1-10 - Persistent danger';
}

/** GAF bracket short label. */
function gafBracketLabel(score) {
  if (score >= 91) return 'Superior functioning';
  if (score >= 81) return 'Absent/minimal symptoms';
  if (score >= 71) return 'Transient/expectable reactions';
  if (score >= 61) return 'Mild symptoms';
  if (score >= 51) return 'Moderate symptoms';
  if (score >= 41) return 'Serious symptoms';
  if (score >= 31) return 'Major impairment';
  if (score >= 21) return 'Influenced by delusions/hallucinations';
  if (score >= 11) return 'Some danger of hurting self/others';
  return 'Persistent danger';
}

/** Visual class name for the GAF score badge. */
function gafBracketClass(score) {
  if (score >= 81) return 'bracket-superior';
  if (score >= 61) return 'bracket-mild';
  if (score >= 41) return 'bracket-moderate';
  if (score >= 21) return 'bracket-serious';
  return 'bracket-danger';
}

export { emptyAssessment, gafScoreLabel, gafBracketLabel, gafBracketClass };
