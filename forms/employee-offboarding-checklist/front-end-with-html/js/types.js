// Plain-JavaScript / JSDoc type definitions for the Employee Offboarding
// Checklist data model. This form has no Svelte engine to port; the model
// is built fresh from the AGENTS.md specification.
//
// The canonical empty AssessmentData shape lives here, so newly-added
// fields default correctly when older saved state is rehydrated from
// localStorage. Presentation helpers (outcome / priority labels and CSS
// classes) are exposed alongside the factory.

/**
 * @typedef {'yes' | 'no' | 'na' | ''} YesNoNa
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'complete' | 'partial' | 'incomplete'} Outcome
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * @typedef {Object} EmployeeDetails
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} employeeId
 * @property {string} email
 * @property {string} jobTitle
 * @property {string} department
 * @property {string} lineManager
 * @property {string} startDate
 * @property {string} lastWorkingDay
 * @property {'resignation' | 'retirement' | 'redundancy' | 'dismissal' | 'end-of-fixed-term' | 'transfer' | 'other' | ''} reasonForLeaving
 * @property {string} reasonForLeavingOther
 * @property {string} employeeDetailsNotes
 */

/**
 * @typedef {Object} ExitInterview
 * @property {YesNo} interviewOffered
 * @property {YesNo} interviewCompleted
 * @property {string} interviewDate
 * @property {string} interviewerName
 * @property {YesNo} feedbackProvided
 * @property {YesNo} feedbackDocumented
 * @property {YesNo} concernsRaised
 * @property {string} concernsDetails
 * @property {string} exitInterviewNotes
 */

/**
 * @typedef {Object} KnowledgeTransfer
 * @property {YesNo} successorIdentified
 * @property {string} successorName
 * @property {YesNo} handoverDocumentCreated
 * @property {YesNo} handoverMeetingsHeld
 * @property {YesNo} workInProgressDocumented
 * @property {YesNo} keyContactsShared
 * @property {YesNo} sopFilesTransferred
 * @property {YesNo} clinicalCaseloadReassigned
 * @property {string} knowledgeTransferNotes
 */

/**
 * @typedef {Object} EquipmentReturn
 * @property {YesNoNa} laptopReturned
 * @property {string} laptopAssetTag
 * @property {YesNoNa} mobilePhoneReturned
 * @property {YesNoNa} idBadgeReturned
 * @property {YesNoNa} keysReturned
 * @property {YesNoNa} uniformReturned
 * @property {YesNoNa} parkingPassReturned
 * @property {YesNoNa} otherEquipmentReturned
 * @property {string} otherEquipmentDescription
 * @property {string} equipmentReturnNotes
 */

/**
 * @typedef {Object} AccessRevocation
 * @property {YesNo} emailRevoked
 * @property {YesNo} ehrEprRevoked
 * @property {YesNo} vpnRevoked
 * @property {YesNo} activeDirectoryDisabled
 * @property {YesNo} buildingAccessRevoked
 * @property {YesNo} cloudAppsRevoked
 * @property {YesNo} smartcardDeactivated
 * @property {YesNo} dataDownloadAuditPerformed
 * @property {YesNo} unauthorisedDownloadDetected
 * @property {string} accessRevocationNotes
 */

/**
 * @typedef {Object} FinalPayrollBenefits
 * @property {YesNo} finalSalaryCalculated
 * @property {YesNo} accruedHolidayPaid
 * @property {YesNo} expensesReimbursed
 * @property {YesNo} pensionInformationProvided
 * @property {YesNo} p45Issued
 * @property {YesNo} benefitsTerminated
 * @property {YesNo} payrollDetailsConfirmed
 * @property {string} finalPaymentDate
 * @property {string} finalPayrollNotes
 */

/**
 * @typedef {Object} ReferencesRecommendations
 * @property {YesNo} referenceConsentGiven
 * @property {YesNo} referenceContactDetailsRecorded
 * @property {YesNo} recommendationLetterRequested
 * @property {YesNo} recommendationLetterProvided
 * @property {YesNo} referencePolicyExplained
 * @property {string} referencesNotes
 */

/**
 * @typedef {Object} NonDisclosurePostEmployment
 * @property {YesNo} confidentialityReaffirmed
 * @property {YesNo} ndaSigned
 * @property {YesNo} restrictiveCovenantsExplained
 * @property {YesNo} restrictiveCovenantsAcknowledged
 * @property {YesNo} intellectualPropertyAssigned
 * @property {YesNo} dataReturnedOrDestroyed
 * @property {YesNo} postEmploymentObligationsExplained
 * @property {string} ndaNotes
 */

/**
 * @typedef {Object} ForwardingDetails
 * @property {string} forwardingAddressLine1
 * @property {string} forwardingAddressLine2
 * @property {string} forwardingCity
 * @property {string} forwardingPostcode
 * @property {string} forwardingCountry
 * @property {string} personalEmail
 * @property {string} personalPhone
 * @property {YesNo} forwardingDetailsConfirmed
 * @property {string} forwardingNotes
 */

/**
 * @typedef {Object} Signoff
 * @property {YesNo} hrSignedOff
 * @property {string} hrSignOffName
 * @property {string} hrSignOffDate
 * @property {YesNo} lineManagerSignedOff
 * @property {string} lineManagerSignOffName
 * @property {string} lineManagerSignOffDate
 * @property {YesNo} itSignedOff
 * @property {string} itSignOffName
 * @property {string} itSignOffDate
 * @property {YesNo} employeeAcknowledged
 * @property {string} employeeSignOffDate
 * @property {string} signoffNotes
 */

/**
 * @typedef {Object} AssessmentData
 * @property {EmployeeDetails} employeeDetails
 * @property {ExitInterview} exitInterview
 * @property {KnowledgeTransfer} knowledgeTransfer
 * @property {EquipmentReturn} equipmentReturn
 * @property {AccessRevocation} accessRevocation
 * @property {FinalPayrollBenefits} finalPayrollBenefits
 * @property {ReferencesRecommendations} referencesRecommendations
 * @property {NonDisclosurePostEmployment} nonDisclosurePostEmployment
 * @property {ForwardingDetails} forwardingDetails
 * @property {Signoff} signoff
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {boolean} mandatory
 * @property {boolean} blocker
 *
 * @typedef {Object} Blocker
 * @property {string} id
 * @property {string} category
 * @property {string} description
 *
 * @typedef {Object} AdditionalFlag
 * @property {string} id
 * @property {string} category
 * @property {string} message
 * @property {Priority} priority
 *
 * @typedef {Object} ValidationResult
 * @property {Outcome} outcome
 * @property {number} completionPercent
 * @property {Blocker[]} blockers
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {number} mandatoryTotal
 * @property {number} mandatorySatisfied
 * @property {string} timestamp
 */

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric fields default to `null`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    employeeDetails: {
      firstName: '',
      lastName: '',
      employeeId: '',
      email: '',
      jobTitle: '',
      department: '',
      lineManager: '',
      startDate: '',
      lastWorkingDay: '',
      reasonForLeaving: '',
      reasonForLeavingOther: '',
      employeeDetailsNotes: ''
    },
    exitInterview: {
      interviewOffered: '',
      interviewCompleted: '',
      interviewDate: '',
      interviewerName: '',
      feedbackProvided: '',
      feedbackDocumented: '',
      concernsRaised: '',
      concernsDetails: '',
      exitInterviewNotes: ''
    },
    knowledgeTransfer: {
      successorIdentified: '',
      successorName: '',
      handoverDocumentCreated: '',
      handoverMeetingsHeld: '',
      workInProgressDocumented: '',
      keyContactsShared: '',
      sopFilesTransferred: '',
      clinicalCaseloadReassigned: '',
      knowledgeTransferNotes: ''
    },
    equipmentReturn: {
      laptopReturned: '',
      laptopAssetTag: '',
      mobilePhoneReturned: '',
      idBadgeReturned: '',
      keysReturned: '',
      uniformReturned: '',
      parkingPassReturned: '',
      otherEquipmentReturned: '',
      otherEquipmentDescription: '',
      equipmentReturnNotes: ''
    },
    accessRevocation: {
      emailRevoked: '',
      ehrEprRevoked: '',
      vpnRevoked: '',
      activeDirectoryDisabled: '',
      buildingAccessRevoked: '',
      cloudAppsRevoked: '',
      smartcardDeactivated: '',
      dataDownloadAuditPerformed: '',
      unauthorisedDownloadDetected: '',
      accessRevocationNotes: ''
    },
    finalPayrollBenefits: {
      finalSalaryCalculated: '',
      accruedHolidayPaid: '',
      expensesReimbursed: '',
      pensionInformationProvided: '',
      p45Issued: '',
      benefitsTerminated: '',
      payrollDetailsConfirmed: '',
      finalPaymentDate: '',
      finalPayrollNotes: ''
    },
    referencesRecommendations: {
      referenceConsentGiven: '',
      referenceContactDetailsRecorded: '',
      recommendationLetterRequested: '',
      recommendationLetterProvided: '',
      referencePolicyExplained: '',
      referencesNotes: ''
    },
    nonDisclosurePostEmployment: {
      confidentialityReaffirmed: '',
      ndaSigned: '',
      restrictiveCovenantsExplained: '',
      restrictiveCovenantsAcknowledged: '',
      intellectualPropertyAssigned: '',
      dataReturnedOrDestroyed: '',
      postEmploymentObligationsExplained: '',
      ndaNotes: ''
    },
    forwardingDetails: {
      forwardingAddressLine1: '',
      forwardingAddressLine2: '',
      forwardingCity: '',
      forwardingPostcode: '',
      forwardingCountry: '',
      personalEmail: '',
      personalPhone: '',
      forwardingDetailsConfirmed: '',
      forwardingNotes: ''
    },
    signoff: {
      hrSignedOff: '',
      hrSignOffName: '',
      hrSignOffDate: '',
      lineManagerSignedOff: '',
      lineManagerSignOffName: '',
      lineManagerSignOffDate: '',
      itSignedOff: '',
      itSignOffName: '',
      itSignOffDate: '',
      employeeAcknowledged: '',
      employeeSignOffDate: '',
      signoffNotes: ''
    }
  };
}

// ──────────────────────────────────────────────
// Presentation helpers
// ──────────────────────────────────────────────

/**
 * Outcome label.
 * @param {Outcome} outcome
 */
function outcomeLabel(outcome) {
  switch (outcome) {
    case 'complete':   return 'Complete';
    case 'partial':    return 'Partial';
    case 'incomplete': return 'Incomplete';
    default: return '';
  }
}

/**
 * Outcome CSS class hint.
 * @param {Outcome} outcome
 */
function outcomeClass(outcome) {
  switch (outcome) {
    case 'complete':   return 'outcome-complete';
    case 'partial':    return 'outcome-partial';
    case 'incomplete': return 'outcome-incomplete';
    default: return '';
  }
}

/**
 * Priority label.
 * @param {Priority} priority
 */
function priorityLabel(priority) {
  switch (priority) {
    case 'high':   return 'HIGH';
    case 'medium': return 'MEDIUM';
    case 'low':    return 'LOW';
    default: return '';
  }
}

/**
 * Priority CSS class hint.
 * @param {Priority} priority
 */
function priorityClass(priority) {
  switch (priority) {
    case 'high':   return 'flag-high';
    case 'medium': return 'flag-medium';
    case 'low':    return 'flag-low';
    default: return '';
  }
}

/** Format date string for display. */
function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** Check if a date string parses to a date in the past. */
function isDatePast(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return false;
  return d < new Date();
}

export { emptyAssessment, outcomeLabel, outcomeClass, priorityLabel, priorityClass, formatDate, isDatePast };
