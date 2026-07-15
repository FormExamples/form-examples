// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Learning Disability
// Assessment form.
//
// This file builds and exports the canonical empty AssessmentData shape
// used by the wizard, so newly-added fields automatically default
// correctly when older saved state is rehydrated from localStorage.

/**
 * @typedef {'male' | 'female' | 'other' | 'prefer-not-to-say' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'yes' | 'no' | 'unknown' | ''} YesNoUnknown
 * @typedef {'independent' | 'some-support' | 'significant-support' | 'full-support' | ''} SupportLevel
 * @typedef {'mild' | 'moderate' | 'severe' | 'profound' | ''} SeverityCategory
 */

/**
 * @typedef {Object} Demographics
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {Sex} sex
 * @property {string} nhsNumber
 * @property {string} gpPractice
 * @property {string} preferredName
 * @property {string} ethnicity
 */

/**
 * @typedef {Object} CarerSupport
 * @property {string} primaryCarerName
 * @property {string} primaryCarerRelationship
 * @property {string} primaryCarerPhone
 * @property {YesNo} livesWithCarer
 * @property {string} livingArrangement
 * @property {YesNo} hasSupportPlan
 * @property {YesNo} hasSocialWorker
 * @property {string} socialWorkerName
 * @property {string} otherSupports
 */

/**
 * @typedef {Object} CommunicationNeeds
 * @property {YesNo} usesEasyRead
 * @property {YesNo} usesMakaton
 * @property {YesNo} usesAac
 * @property {string} aacDetails
 * @property {YesNo} usesPictures
 * @property {YesNo} needsInterpreter
 * @property {string} interpreterLanguage
 * @property {'verbal' | 'limited-verbal' | 'non-verbal' | ''} verbalAbility
 * @property {string} preferredCommunicationMethod
 * @property {string} communicationNotes
 */

/**
 * @typedef {Object} MedicalReview
 * @property {YesNo} hasEpilepsy
 * @property {string} lastSeizureDate
 * @property {number | null} seizuresPerMonth
 * @property {YesNo} hasMentalHealthDiagnosis
 * @property {string} mentalHealthDetails
 * @property {YesNo} takesPsychotropic
 * @property {YesNo} stompReviewDone
 * @property {string} currentMedications
 * @property {YesNo} hasDysphagia
 * @property {YesNo} hasConstipation
 * @property {YesNo} hasIncontinence
 * @property {YesNo} hasSleepProblems
 * @property {string} otherMedicalIssues
 */

/**
 * @typedef {Object} PhysicalExamination
 * @property {number | null} weight
 * @property {number | null} height
 * @property {number | null} bmi
 * @property {number | null} bloodPressureSystolic
 * @property {number | null} bloodPressureDiastolic
 * @property {number | null} pulse
 * @property {YesNoUnknown} visionChecked
 * @property {string} visionDate
 * @property {YesNoUnknown} hearingChecked
 * @property {string} hearingDate
 * @property {YesNoUnknown} dentalChecked
 * @property {string} dentalDate
 * @property {YesNoUnknown} vaccinationsUpToDate
 * @property {YesNoUnknown} cervicalScreening
 * @property {YesNoUnknown} breastScreening
 * @property {YesNoUnknown} bowelScreening
 */

/**
 * @typedef {Object} AdaptiveFunctioning
 * @property {SupportLevel} conceptualLanguage
 * @property {SupportLevel} conceptualReadingWriting
 * @property {SupportLevel} conceptualMoneyTime
 * @property {SupportLevel} socialFriendships
 * @property {SupportLevel} socialEmpathy
 * @property {SupportLevel} socialCommunication
 * @property {SupportLevel} practicalSelfCare
 * @property {SupportLevel} practicalHomeLiving
 * @property {SupportLevel} practicalCommunity
 * @property {SupportLevel} practicalWorkSchool
 */

/**
 * @typedef {Object} BehaviouralConcerns
 * @property {YesNo} selfInjurious
 * @property {YesNo} aggression
 * @property {YesNo} propertyDamage
 * @property {YesNo} absconding
 * @property {YesNo} sexualisedBehaviour
 * @property {string} knownTriggers
 * @property {string} calmingStrategies
 * @property {YesNo} hasBehaviourSupportPlan
 * @property {YesNo} usesPrn
 * @property {string} prnDetails
 */

/**
 * @typedef {Object} MentalCapacityConsent
 * @property {YesNoUnknown} canConsentToHealthCheck
 * @property {YesNoUnknown} canConsentToMedication
 * @property {YesNoUnknown} canConsentToFinances
 * @property {YesNo} hasLpa
 * @property {string} lpaDetails
 * @property {YesNo} hasDols
 * @property {YesNo} bestInterestsRequired
 * @property {string} bestInterestsNotes
 */

/**
 * @typedef {Object} ReasonableAdjustments
 * @property {YesNo} needsLongerAppointments
 * @property {YesNo} needsQuietRoom
 * @property {YesNo} needsFamiliarStaff
 * @property {YesNo} needsEasyReadLetters
 * @property {YesNo} needsHomeVisits
 * @property {YesNo} needsDoubleAppointment
 * @property {YesNo} flagOnRecord
 * @property {string} otherAdjustments
 */

/**
 * @typedef {Object} HealthActionItem
 * @property {string} action
 * @property {string} owner
 * @property {string} dueDate
 */

/**
 * @typedef {Object} HealthActionPlan
 * @property {HealthActionItem[]} actions
 * @property {string} nextReviewDate
 * @property {string} sharedWith
 * @property {string} planNotes
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {CarerSupport} carerSupport
 * @property {CommunicationNeeds} communicationNeeds
 * @property {MedicalReview} medicalReview
 * @property {PhysicalExamination} physicalExamination
 * @property {AdaptiveFunctioning} adaptiveFunctioning
 * @property {BehaviouralConcerns} behaviouralConcerns
 * @property {MentalCapacityConsent} mentalCapacityConsent
 * @property {ReasonableAdjustments} reasonableAdjustments
 * @property {HealthActionPlan} healthActionPlan
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
 * @property {'urgent' | 'high' | 'medium' | 'low'} priority
 */

/**
 * @typedef {Object} GradingResult
 * @property {number} adaptiveScore
 * @property {SeverityCategory} severityCategory
 * @property {number} answeredCount
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.LearningDisabilityAssessment`.

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
      nhsNumber: '',
      gpPractice: '',
      preferredName: '',
      ethnicity: ''
    },
    carerSupport: {
      primaryCarerName: '',
      primaryCarerRelationship: '',
      primaryCarerPhone: '',
      livesWithCarer: '',
      livingArrangement: '',
      hasSupportPlan: '',
      hasSocialWorker: '',
      socialWorkerName: '',
      otherSupports: ''
    },
    communicationNeeds: {
      usesEasyRead: '',
      usesMakaton: '',
      usesAac: '',
      aacDetails: '',
      usesPictures: '',
      needsInterpreter: '',
      interpreterLanguage: '',
      verbalAbility: '',
      preferredCommunicationMethod: '',
      communicationNotes: ''
    },
    medicalReview: {
      hasEpilepsy: '',
      lastSeizureDate: '',
      seizuresPerMonth: null,
      hasMentalHealthDiagnosis: '',
      mentalHealthDetails: '',
      takesPsychotropic: '',
      stompReviewDone: '',
      currentMedications: '',
      hasDysphagia: '',
      hasConstipation: '',
      hasIncontinence: '',
      hasSleepProblems: '',
      otherMedicalIssues: ''
    },
    physicalExamination: {
      weight: null,
      height: null,
      bmi: null,
      bloodPressureSystolic: null,
      bloodPressureDiastolic: null,
      pulse: null,
      visionChecked: '',
      visionDate: '',
      hearingChecked: '',
      hearingDate: '',
      dentalChecked: '',
      dentalDate: '',
      vaccinationsUpToDate: '',
      cervicalScreening: '',
      breastScreening: '',
      bowelScreening: ''
    },
    adaptiveFunctioning: {
      conceptualLanguage: '',
      conceptualReadingWriting: '',
      conceptualMoneyTime: '',
      socialFriendships: '',
      socialEmpathy: '',
      socialCommunication: '',
      practicalSelfCare: '',
      practicalHomeLiving: '',
      practicalCommunity: '',
      practicalWorkSchool: ''
    },
    behaviouralConcerns: {
      selfInjurious: '',
      aggression: '',
      propertyDamage: '',
      absconding: '',
      sexualisedBehaviour: '',
      knownTriggers: '',
      calmingStrategies: '',
      hasBehaviourSupportPlan: '',
      usesPrn: '',
      prnDetails: ''
    },
    mentalCapacityConsent: {
      canConsentToHealthCheck: '',
      canConsentToMedication: '',
      canConsentToFinances: '',
      hasLpa: '',
      lpaDetails: '',
      hasDols: '',
      bestInterestsRequired: '',
      bestInterestsNotes: ''
    },
    reasonableAdjustments: {
      needsLongerAppointments: '',
      needsQuietRoom: '',
      needsFamiliarStaff: '',
      needsEasyReadLetters: '',
      needsHomeVisits: '',
      needsDoubleAppointment: '',
      flagOnRecord: '',
      otherAdjustments: ''
    },
    healthActionPlan: {
      actions: [],
      nextReviewDate: '',
      sharedWith: '',
      planNotes: ''
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
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  if (bmi < 35) return 'Obese Class I';
  if (bmi < 40) return 'Obese Class II';
  return 'Obese Class III';
}

export { emptyAssessment, calculateBMI, bmiCategory };
