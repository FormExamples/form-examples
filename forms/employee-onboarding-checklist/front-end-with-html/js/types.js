// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Employee Onboarding Checklist.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage. It also exposes
// presentation helpers (status / grade / risk labels and CSS classes)
// ported 1-to-1 from `src/lib/engine/utils.ts`.

/**
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'low' | 'moderate' | 'high' | 'critical'} RiskLevel
 * @typedef {'not-started' | 'in-progress' | 'mostly-complete' | 'complete'} CompletionStatus
 */

/**
 * @typedef {Object} Demographics
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {string} email
 * @property {string} phone
 * @property {string} jobTitle
 * @property {string} department
 * @property {string} startDate
 * @property {string} emergencyContactName
 * @property {string} emergencyContactPhone
 * @property {string} emergencyContactRelationship
 */

/**
 * @typedef {Object} PreEmploymentChecks
 * @property {'not-started' | 'applied' | 'received' | 'cleared' | ''} dbsCheckStatus
 * @property {string} dbsCertificateNumber
 * @property {string} dbsCheckDate
 * @property {YesNo} dbsUpdateServiceRegistered
 * @property {YesNo} rightToWorkVerified
 * @property {string} rightToWorkDocumentType
 * @property {string} rightToWorkExpiryDate
 * @property {number | null} referencesReceived
 * @property {number | null} referencesRequired
 * @property {YesNo} referencesSatisfactory
 * @property {YesNo} identityVerified
 * @property {string} preEmploymentNotes
 */

/**
 * @typedef {Object} OccupationalHealth
 * @property {YesNo} ohQuestionnaireSubmitted
 * @property {YesNo} ohClearanceReceived
 * @property {string} ohClearanceDate
 * @property {YesNo} ohRestrictions
 * @property {string} ohRestrictionDetails
 * @property {'immune' | 'non-immune' | 'vaccinating' | 'declined' | ''} hepatitisBStatus
 * @property {'not-required' | 'required' | 'completed' | 'referred' | ''} tbScreeningStatus
 * @property {'complete' | 'incomplete' | 'in-progress' | ''} immunisationStatus
 * @property {YesNo} fitToWork
 * @property {string} occupationalHealthNotes
 */

/**
 * @typedef {Object} MandatoryTraining
 * @property {YesNo} fireSafetyCompleted
 * @property {string} fireSafetyDate
 * @property {YesNo} manualHandlingCompleted
 * @property {string} manualHandlingDate
 * @property {YesNo} infectionControlCompleted
 * @property {string} infectionControlDate
 * @property {YesNo} safeguardingAdultsCompleted
 * @property {'level-1' | 'level-2' | 'level-3' | ''} safeguardingAdultsLevel
 * @property {YesNo} safeguardingChildrenCompleted
 * @property {'level-1' | 'level-2' | 'level-3' | ''} safeguardingChildrenLevel
 * @property {YesNo} informationGovernanceCompleted
 * @property {string} informationGovernanceDate
 * @property {YesNo} basicLifeSupportCompleted
 * @property {string} basicLifeSupportDate
 * @property {YesNo} equalityDiversityCompleted
 * @property {YesNo} healthSafetyCompleted
 * @property {YesNo} conflictResolutionCompleted
 * @property {string} mandatoryTrainingNotes
 */

/**
 * @typedef {Object} ProfessionalRegistration
 * @property {YesNo} registrationRequired
 * @property {'nmc' | 'gmc' | 'hcpc' | 'gdc' | 'gphc' | 'other' | ''} regulatoryBody
 * @property {string} regulatoryBodyOther
 * @property {string} registrationNumber
 * @property {YesNo} registrationVerified
 * @property {string} registrationExpiryDate
 * @property {YesNo} registrationConditions
 * @property {string} registrationConditionDetails
 * @property {string} revalidationDate
 * @property {'yes' | 'no' | 'na' | ''} indemnityInsurance
 * @property {string} professionalRegistrationNotes
 */

/**
 * @typedef {Object} ITSystemsAccess
 * @property {YesNo} nhsSmartcardIssued
 * @property {string} nhsSmartcardNumber
 * @property {YesNo} emailAccountCreated
 * @property {YesNo} networkLoginCreated
 * @property {YesNo} clinicalSystemAccess
 * @property {string} clinicalSystemName
 * @property {YesNo} clinicalSystemTrainingCompleted
 * @property {YesNo} rosteringSystemAccess
 * @property {string} phoneExtension
 * @property {string} bleepNumber
 * @property {string} itAccessNotes
 */

/**
 * @typedef {Object} UniformIDBadge
 * @property {YesNo} uniformRequired
 * @property {YesNo} uniformOrdered
 * @property {YesNo} uniformReceived
 * @property {string} uniformSize
 * @property {YesNo} idBadgePhotoTaken
 * @property {YesNo} idBadgeIssued
 * @property {string} idBadgeNumber
 * @property {YesNo} accessCardIssued
 * @property {string} accessCardAreas
 * @property {YesNo} lockerAllocated
 * @property {string} lockerNumber
 * @property {string} uniformIdNotes
 */

/**
 * @typedef {Object} InductionProgramme
 * @property {YesNo} corporateInductionCompleted
 * @property {string} corporateInductionDate
 * @property {YesNo} localInductionCompleted
 * @property {string} localInductionDate
 * @property {YesNo} departmentTourCompleted
 * @property {YesNo} introducedToTeam
 * @property {YesNo} emergencyProceduresBriefed
 * @property {YesNo} policiesHandbookReceived
 * @property {YesNo} buddyAssigned
 * @property {string} buddyName
 * @property {string} inductionProgrammeNotes
 */

/**
 * @typedef {Object} ProbationSupervision
 * @property {number | null} probationPeriodMonths
 * @property {string} probationStartDate
 * @property {string} probationEndDate
 * @property {string} lineManagerName
 * @property {string} lineManagerEmail
 * @property {string} supervisorName
 * @property {'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | ''} supervisionFrequency
 * @property {string} firstSupervisionDate
 * @property {YesNo} objectivesSet
 * @property {YesNo} appraisalDateAgreed
 * @property {string} appraisalDate
 * @property {string} probationSupervisionNotes
 */

/**
 * @typedef {Object} SignOffCompliance
 * @property {YesNo} confidentialityAgreementSigned
 * @property {YesNo} codeOfConductSigned
 * @property {YesNo} socialMediaPolicyAcknowledged
 * @property {YesNo} itAcceptableUseSigned
 * @property {YesNo} gdprTrainingCompleted
 * @property {YesNo} dutyOfCandourBriefed
 * @property {YesNo} whistleblowingPolicyBriefed
 * @property {YesNo} employeeSignedOff
 * @property {string} employeeSignOffDate
 * @property {YesNo} managerSignedOff
 * @property {string} managerSignOffDate
 * @property {string} managerSignOffName
 * @property {string} signOffComplianceNotes
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {PreEmploymentChecks} preEmploymentChecks
 * @property {OccupationalHealth} occupationalHealth
 * @property {MandatoryTraining} mandatoryTraining
 * @property {ProfessionalRegistration} professionalRegistration
 * @property {ITSystemsAccess} itSystemsAccess
 * @property {UniformIDBadge} uniformIDBadge
 * @property {InductionProgramme} inductionProgramme
 * @property {ProbationSupervision} probationSupervision
 * @property {SignOffCompliance} signOffCompliance
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {number} grade
 *
 * @typedef {Object} AdditionalFlag
 * @property {string} id
 * @property {string} category
 * @property {string} message
 * @property {'high' | 'medium' | 'low'} priority
 *
 * @typedef {Object} GradingResult
 * @property {number} completionPercentage
 * @property {CompletionStatus} completionStatus
 * @property {RiskLevel} overallRisk
 * @property {number} itemsCompleted
 * @property {number} itemsTotal
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.EmployeeOnboardingChecklist`.
(function () {
'use strict';
window.EmployeeOnboardingChecklist = window.EmployeeOnboardingChecklist || {};

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
      email: '',
      phone: '',
      jobTitle: '',
      department: '',
      startDate: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelationship: ''
    },
    preEmploymentChecks: {
      dbsCheckStatus: '',
      dbsCertificateNumber: '',
      dbsCheckDate: '',
      dbsUpdateServiceRegistered: '',
      rightToWorkVerified: '',
      rightToWorkDocumentType: '',
      rightToWorkExpiryDate: '',
      referencesReceived: null,
      referencesRequired: null,
      referencesSatisfactory: '',
      identityVerified: '',
      preEmploymentNotes: ''
    },
    occupationalHealth: {
      ohQuestionnaireSubmitted: '',
      ohClearanceReceived: '',
      ohClearanceDate: '',
      ohRestrictions: '',
      ohRestrictionDetails: '',
      hepatitisBStatus: '',
      tbScreeningStatus: '',
      immunisationStatus: '',
      fitToWork: '',
      occupationalHealthNotes: ''
    },
    mandatoryTraining: {
      fireSafetyCompleted: '',
      fireSafetyDate: '',
      manualHandlingCompleted: '',
      manualHandlingDate: '',
      infectionControlCompleted: '',
      infectionControlDate: '',
      safeguardingAdultsCompleted: '',
      safeguardingAdultsLevel: '',
      safeguardingChildrenCompleted: '',
      safeguardingChildrenLevel: '',
      informationGovernanceCompleted: '',
      informationGovernanceDate: '',
      basicLifeSupportCompleted: '',
      basicLifeSupportDate: '',
      equalityDiversityCompleted: '',
      healthSafetyCompleted: '',
      conflictResolutionCompleted: '',
      mandatoryTrainingNotes: ''
    },
    professionalRegistration: {
      registrationRequired: '',
      regulatoryBody: '',
      regulatoryBodyOther: '',
      registrationNumber: '',
      registrationVerified: '',
      registrationExpiryDate: '',
      registrationConditions: '',
      registrationConditionDetails: '',
      revalidationDate: '',
      indemnityInsurance: '',
      professionalRegistrationNotes: ''
    },
    itSystemsAccess: {
      nhsSmartcardIssued: '',
      nhsSmartcardNumber: '',
      emailAccountCreated: '',
      networkLoginCreated: '',
      clinicalSystemAccess: '',
      clinicalSystemName: '',
      clinicalSystemTrainingCompleted: '',
      rosteringSystemAccess: '',
      phoneExtension: '',
      bleepNumber: '',
      itAccessNotes: ''
    },
    uniformIDBadge: {
      uniformRequired: '',
      uniformOrdered: '',
      uniformReceived: '',
      uniformSize: '',
      idBadgePhotoTaken: '',
      idBadgeIssued: '',
      idBadgeNumber: '',
      accessCardIssued: '',
      accessCardAreas: '',
      lockerAllocated: '',
      lockerNumber: '',
      uniformIdNotes: ''
    },
    inductionProgramme: {
      corporateInductionCompleted: '',
      corporateInductionDate: '',
      localInductionCompleted: '',
      localInductionDate: '',
      departmentTourCompleted: '',
      introducedToTeam: '',
      emergencyProceduresBriefed: '',
      policiesHandbookReceived: '',
      buddyAssigned: '',
      buddyName: '',
      inductionProgrammeNotes: ''
    },
    probationSupervision: {
      probationPeriodMonths: null,
      probationStartDate: '',
      probationEndDate: '',
      lineManagerName: '',
      lineManagerEmail: '',
      supervisorName: '',
      supervisionFrequency: '',
      firstSupervisionDate: '',
      objectivesSet: '',
      appraisalDateAgreed: '',
      appraisalDate: '',
      probationSupervisionNotes: ''
    },
    signOffCompliance: {
      confidentialityAgreementSigned: '',
      codeOfConductSigned: '',
      socialMediaPolicyAcknowledged: '',
      itAcceptableUseSigned: '',
      gdprTrainingCompleted: '',
      dutyOfCandourBriefed: '',
      whistleblowingPolicyBriefed: '',
      employeeSignedOff: '',
      employeeSignOffDate: '',
      managerSignedOff: '',
      managerSignOffDate: '',
      managerSignOffName: '',
      signOffComplianceNotes: ''
    }
  };
}

// ──────────────────────────────────────────────
// Presentation helpers (ported from utils.ts)
// ──────────────────────────────────────────────

/**
 * Derive completion status from percentage.
 * @param {number} percentage
 * @returns {CompletionStatus}
 */
function deriveCompletionStatus(percentage) {
  if (percentage <= 0) return 'not-started';
  if (percentage < 50) return 'in-progress';
  if (percentage < 90) return 'mostly-complete';
  return 'complete';
}

/**
 * Completion status label.
 * @param {CompletionStatus} status
 */
function completionStatusLabel(status) {
  switch (status) {
    case 'not-started': return 'Not Started';
    case 'in-progress': return 'In Progress';
    case 'mostly-complete': return 'Mostly Complete';
    case 'complete': return 'Complete';
    default: return '';
  }
}

/**
 * Completion status CSS class hint.
 * @param {CompletionStatus} status
 */
function completionStatusClass(status) {
  switch (status) {
    case 'not-started': return 'status-not-started';
    case 'in-progress': return 'status-in-progress';
    case 'mostly-complete': return 'status-mostly-complete';
    case 'complete': return 'status-complete';
    default: return '';
  }
}

/**
 * Risk level label.
 * @param {RiskLevel} risk
 */
function riskLevelLabel(risk) {
  switch (risk) {
    case 'low': return 'Low Risk';
    case 'moderate': return 'Moderate Risk';
    case 'high': return 'High Risk';
    case 'critical': return 'Critical Risk';
    default: return '';
  }
}

/**
 * Risk level CSS class hint.
 * @param {RiskLevel} risk
 */
function riskLevelClass(risk) {
  switch (risk) {
    case 'low': return 'risk-low';
    case 'moderate': return 'risk-moderate';
    case 'high': return 'risk-high';
    case 'critical': return 'risk-critical';
    default: return '';
  }
}

/** Grade label for fired rules. */
function gradeLabel(grade) {
  switch (grade) {
    case 1: return 'Minor';
    case 2: return 'Moderate';
    case 3: return 'Significant';
    case 4: return 'Critical';
    default: return `Grade ${grade}`;
  }
}

/** Grade CSS class hint. */
function gradeClass(grade) {
  switch (grade) {
    case 1: return 'grade-1';
    case 2: return 'grade-2';
    case 3: return 'grade-3';
    case 4: return 'grade-4';
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

/** Check if a date is in the past. */
function isDatePast(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return false;
  return d < new Date();
}

Object.assign(window.EmployeeOnboardingChecklist, {
  emptyAssessment,
  deriveCompletionStatus,
  completionStatusLabel,
  completionStatusClass,
  riskLevelLabel,
  riskLevelClass,
  gradeLabel,
  gradeClass,
  formatDate,
  isDatePast
});
})();
