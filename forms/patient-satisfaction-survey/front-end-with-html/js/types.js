// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Patient Satisfaction Survey.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'18-24' | '25-34' | '35-44' | '45-54' | '55-64' | '65-74' | '75-plus' | ''} AgeRange
 * @typedef {'outpatient' | 'inpatient' | 'day-case' | 'emergency' | 'telehealth' | 'home-visit' | ''} VisitType
 * @typedef {'gp' | 'self' | 'emergency' | 'another-hospital' | 'specialist' | ''} ReferralSource
 * @typedef {1 | 2 | 3 | 4 | 5 | null} LikertScore
 */

/**
 * @typedef {Object} Demographics
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {Sex} sex
 * @property {AgeRange} ageRange
 * @property {string} ethnicity
 * @property {string} preferredLanguage
 * @property {YesNo} interpreterRequired
 */

/**
 * @typedef {Object} VisitDetails
 * @property {string} visitDate
 * @property {VisitType} visitType
 * @property {string} department
 * @property {string} hospitalSite
 * @property {number | null} lengthOfStayDays
 * @property {ReferralSource} referralSource
 * @property {YesNo} isFirstVisit
 */

/**
 * @typedef {Object} AccessWaitingTimes
 * @property {number | null} easeOfBooking
 * @property {number | null} waitingTimeForAppointment
 * @property {number | null} waitingTimeOnDay
 * @property {number | null} receptionService
 * @property {number | null} signageWayfinding
 * @property {number | null} parkingTransport
 * @property {number | null} actualWaitMinutes
 */

/**
 * @typedef {Object} CommunicationInformation
 * @property {number | null} explanationOfCondition
 * @property {number | null} explanationOfTreatment
 * @property {number | null} opportunityToAskQuestions
 * @property {number | null} listenedTo
 * @property {number | null} informedAboutMedication
 * @property {number | null} writtenInformationQuality
 */

/**
 * @typedef {Object} ClinicalCareQuality
 * @property {number | null} confidenceInClinician
 * @property {number | null} thoroughnessOfExamination
 * @property {number | null} painManagement
 * @property {number | null} involvementInDecisions
 * @property {number | null} privacyDuringExamination
 * @property {number | null} coordinationOfCare
 */

/**
 * @typedef {Object} StaffAttitude
 * @property {number | null} doctorCourtesy
 * @property {number | null} nurseCourtesy
 * @property {number | null} receptionCourtesy
 * @property {number | null} respectForDignity
 * @property {number | null} culturalSensitivity
 * @property {number | null} emotionalSupport
 */

/**
 * @typedef {Object} EnvironmentFacilities
 * @property {number | null} cleanliness
 * @property {number | null} comfort
 * @property {number | null} noiseLevels
 * @property {number | null} foodQuality
 * @property {number | null} toiletFacilities
 * @property {number | null} temperatureComfort
 */

/**
 * @typedef {Object} DischargeFollowUp
 * @property {number | null} dischargeInformation
 * @property {number | null} medicationExplanation
 * @property {number | null} followUpArrangements
 * @property {number | null} knewWhoToContact
 * @property {number | null} recoveryInformation
 * @property {number | null} carePlanClarity
 */

/**
 * @typedef {Object} OverallExperience
 * @property {number | null} overallSatisfaction
 * @property {number | null} wouldRecommend
 * @property {number | null} metExpectations
 * @property {number | null} feltSafe
 * @property {number | null} wouldReturn
 * @property {number | null} nhsRating
 */

/**
 * @typedef {Object} CommentsSuggestions
 * @property {string} whatWentWell
 * @property {string} whatCouldImprove
 * @property {string} specificStaffPraise
 * @property {YesNo} complaintRaised
 * @property {string} complaintDetails
 * @property {string} additionalComments
 * @property {YesNo} consentToContact
 * @property {string} contactEmail
 * @property {string} contactPhone
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {VisitDetails} visitDetails
 * @property {AccessWaitingTimes} accessWaitingTimes
 * @property {CommunicationInformation} communicationInformation
 * @property {ClinicalCareQuality} clinicalCareQuality
 * @property {StaffAttitude} staffAttitude
 * @property {EnvironmentFacilities} environmentFacilities
 * @property {DischargeFollowUp} dischargeFollowUp
 * @property {OverallExperience} overallExperience
 * @property {CommentsSuggestions} commentsSuggestions
 */

/**
 * @typedef {'excellent' | 'good' | 'satisfactory' | 'poor' | 'very-poor'} SatisfactionCategory
 */

/**
 * @typedef {Object} DomainScores
 * @property {number | null} access
 * @property {number | null} communication
 * @property {number | null} clinicalCare
 * @property {number | null} staff
 * @property {number | null} environment
 * @property {number | null} discharge
 * @property {number | null} overall
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} domain
 * @property {string} description
 * @property {number} severity
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
 * @property {number} normalizedScore
 * @property {SatisfactionCategory} satisfactionCategory
 * @property {DomainScores} domainScores
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.PatientSatisfactionSurvey`.

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
      sex: '',
      ageRange: '',
      ethnicity: '',
      preferredLanguage: '',
      interpreterRequired: ''
    },
    visitDetails: {
      visitDate: '',
      visitType: '',
      department: '',
      hospitalSite: '',
      lengthOfStayDays: null,
      referralSource: '',
      isFirstVisit: ''
    },
    accessWaitingTimes: {
      easeOfBooking: null,
      waitingTimeForAppointment: null,
      waitingTimeOnDay: null,
      receptionService: null,
      signageWayfinding: null,
      parkingTransport: null,
      actualWaitMinutes: null
    },
    communicationInformation: {
      explanationOfCondition: null,
      explanationOfTreatment: null,
      opportunityToAskQuestions: null,
      listenedTo: null,
      informedAboutMedication: null,
      writtenInformationQuality: null
    },
    clinicalCareQuality: {
      confidenceInClinician: null,
      thoroughnessOfExamination: null,
      painManagement: null,
      involvementInDecisions: null,
      privacyDuringExamination: null,
      coordinationOfCare: null
    },
    staffAttitude: {
      doctorCourtesy: null,
      nurseCourtesy: null,
      receptionCourtesy: null,
      respectForDignity: null,
      culturalSensitivity: null,
      emotionalSupport: null
    },
    environmentFacilities: {
      cleanliness: null,
      comfort: null,
      noiseLevels: null,
      foodQuality: null,
      toiletFacilities: null,
      temperatureComfort: null
    },
    dischargeFollowUp: {
      dischargeInformation: null,
      medicationExplanation: null,
      followUpArrangements: null,
      knewWhoToContact: null,
      recoveryInformation: null,
      carePlanClarity: null
    },
    overallExperience: {
      overallSatisfaction: null,
      wouldRecommend: null,
      metExpectations: null,
      feltSafe: null,
      wouldReturn: null,
      nhsRating: null
    },
    commentsSuggestions: {
      whatWentWell: '',
      whatCouldImprove: '',
      specificStaffPraise: '',
      complaintRaised: '',
      complaintDetails: '',
      additionalComments: '',
      consentToContact: '',
      contactEmail: '',
      contactPhone: ''
    }
  };
}

/**
 * Normalize an array of Likert scores (1-5) to a 0-100 scale.
 * Ignores null values. Returns null if no valid scores.
 * @param {(number | null)[]} scores
 * @returns {number | null}
 */
function normalizeLikertScores(scores) {
  const valid = scores.filter((s) => s !== null && s !== undefined && s >= 1 && s <= 5);
  if (valid.length === 0) return null;
  const sum = valid.reduce((a, b) => a + b, 0);
  const maxPossible = valid.length * 5;
  return Math.round((sum / maxPossible) * 100 * 10) / 10;
}

/** Get satisfaction category from normalized score. */
function categorizeScore(score) {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 50) return 'satisfactory';
  if (score >= 25) return 'poor';
  return 'very-poor';
}

/** Satisfaction category label. */
function satisfactionCategoryLabel(category) {
  switch (category) {
    case 'excellent': return 'Excellent';
    case 'good': return 'Good';
    case 'satisfactory': return 'Satisfactory';
    case 'poor': return 'Poor';
    case 'very-poor': return 'Very Poor';
    default: return '';
  }
}

/** CSS-class hint for the satisfaction-category badge. */
function satisfactionCategoryClass(category) {
  switch (category) {
    case 'excellent': return 'cat-excellent';
    case 'good': return 'cat-good';
    case 'satisfactory': return 'cat-satisfactory';
    case 'poor': return 'cat-poor';
    case 'very-poor': return 'cat-very-poor';
    default: return '';
  }
}

/** Severity label for a fired rule (1-4). */
function severityLabel(severity) {
  switch (severity) {
    case 1: return 'Minor';
    case 2: return 'Moderate';
    case 3: return 'Significant';
    case 4: return 'Critical';
    default: return `Level ${severity}`;
  }
}

export { emptyAssessment, normalizeLikertScores, categorizeScore, satisfactionCategoryLabel, satisfactionCategoryClass, severityLabel };
