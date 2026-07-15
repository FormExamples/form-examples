// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Encounter Satisfaction
// Survey form.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {1 | 2 | 3 | 4 | 5 | null} LikertScore
 *
 * @typedef {'routine-checkup' | 'follow-up' | 'urgent-care' |
 *           'specialist-referral' | 'procedure' | 'other' | ''} VisitType
 */

/**
 * @typedef {Object} Demographics
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {Sex} sex
 */

/**
 * @typedef {Object} VisitInformation
 * @property {string} visitDate
 * @property {string} department
 * @property {string} providerName
 * @property {VisitType} visitType
 * @property {string} reasonForVisit
 * @property {YesNo} firstVisit
 */

/**
 * @typedef {Object} AccessScheduling
 * @property {LikertScore} easeOfScheduling
 * @property {LikertScore} waitForAppointment
 * @property {LikertScore} waitInWaitingRoom
 */

/**
 * @typedef {Object} Communication
 * @property {LikertScore} listening
 * @property {LikertScore} explainingCondition
 * @property {LikertScore} answeringQuestions
 * @property {LikertScore} timeSpent
 */

/**
 * @typedef {Object} StaffProfessionalism
 * @property {LikertScore} receptionCourtesy
 * @property {LikertScore} nursingCourtesy
 * @property {LikertScore} respectShown
 */

/**
 * @typedef {Object} CareQuality
 * @property {LikertScore} involvementInDecisions
 * @property {LikertScore} treatmentPlanExplanation
 * @property {LikertScore} confidenceInCare
 */

/**
 * @typedef {Object} Environment
 * @property {LikertScore} cleanliness
 * @property {LikertScore} waitingAreaComfort
 * @property {LikertScore} privacy
 */

/**
 * @typedef {Object} OverallSatisfaction
 * @property {LikertScore} overallRating
 * @property {LikertScore} likelyToRecommend
 * @property {LikertScore} likelyToReturn
 * @property {string} comments
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {VisitInformation} visitInformation
 * @property {AccessScheduling} accessScheduling
 * @property {Communication} communication
 * @property {StaffProfessionalism} staffProfessionalism
 * @property {CareQuality} careQuality
 * @property {Environment} environment
 * @property {OverallSatisfaction} overallSatisfaction
 */

/**
 * @typedef {Object} DomainScore
 * @property {string} domain
 * @property {number} mean
 * @property {number} count
 * @property {{ id: string, text: string, score: number }[]} questions
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
 * @property {number} compositeScore
 * @property {string} category
 * @property {DomainScore[]} domainScores
 * @property {AdditionalFlag[]} additionalFlags
 * @property {number} answeredCount
 * @property {string} timestamp
 */

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; Likert scores default to `null`.
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
    visitInformation: {
      visitDate: '',
      department: '',
      providerName: '',
      visitType: '',
      reasonForVisit: '',
      firstVisit: ''
    },
    accessScheduling: {
      easeOfScheduling: null,
      waitForAppointment: null,
      waitInWaitingRoom: null
    },
    communication: {
      listening: null,
      explainingCondition: null,
      answeringQuestions: null,
      timeSpent: null
    },
    staffProfessionalism: {
      receptionCourtesy: null,
      nursingCourtesy: null,
      respectShown: null
    },
    careQuality: {
      involvementInDecisions: null,
      treatmentPlanExplanation: null,
      confidenceInCare: null
    },
    environment: {
      cleanliness: null,
      waitingAreaComfort: null,
      privacy: null
    },
    overallSatisfaction: {
      overallRating: null,
      likelyToRecommend: null,
      likelyToReturn: null,
      comments: ''
    }
  };
}

/**
 * Satisfaction score category.
 *   4.5 - 5.0 = Excellent
 *   3.5 - 4.4 = Good
 *   2.5 - 3.4 = Fair
 *   1.5 - 2.4 = Poor
 *   1.0 - 1.4 = Very Poor
 * @param {number} score
 * @returns {string}
 */
function satisfactionCategory(score) {
  if (score >= 4.5) return 'Excellent';
  if (score >= 3.5) return 'Good';
  if (score >= 2.5) return 'Fair';
  if (score >= 1.5) return 'Poor';
  return 'Very Poor';
}

/**
 * CSS class for the ESS score badge based on category.
 * @param {string} category
 * @returns {string}
 */
function categoryClass(category) {
  switch (category) {
    case 'Excellent': return 'score-excellent';
    case 'Good': return 'score-good';
    case 'Fair': return 'score-fair';
    case 'Poor': return 'score-poor';
    case 'Very Poor': return 'score-very-poor';
    default: return '';
  }
}

export { emptyAssessment, satisfactionCategory, categoryClass };
