// Declarative offboarding validation rules.
//
// Each rule represents a single checklist item. `evaluate(d)` returns true
// when the item is OUTSTANDING (i.e. has fired and is contributing to a
// non-Complete outcome). Mandatory rules contribute to the headline
// outcome calculation; blocker rules force an Incomplete outcome and
// require escalation. Non-mandatory items, when outstanding, downgrade
// outcome from Complete to Partial.
//
// `mandatory` — true if this item must be confirmed for "Complete".
// `blocker`   — true if outstanding-while-mandatory forces "Incomplete".
//                These are the IT/HR critical items: NDA reaffirmation,
//                core access revocation, equipment return, payroll, and
//                final HR/IT/manager sign-off.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 *
 * @typedef {Object} ValidationRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {boolean} mandatory
 * @property {boolean} blocker
 * @property {(d: AssessmentData) => boolean} evaluate
 */

// Wrapped in an IIFE; published via window.EmployeeOffboardingChecklist.
(function () {
'use strict';
window.EmployeeOffboardingChecklist = window.EmployeeOffboardingChecklist || {};

/** "Outstanding" helper: yes-no field is anything other than 'yes'. */
function notYes(v) { return v !== 'yes'; }

/** "Outstanding" helper: yes-no-na field is anything other than 'yes' or 'na'. */
function notYesOrNa(v) { return v !== 'yes' && v !== 'na'; }

/** @type {ValidationRule[]} */
const validationRules = [
  // ─── EMPLOYEE DETAILS (mandatory non-blocking) ──────────────
  {
    id: 'EMP-001',
    category: 'Employee Details',
    description: 'Employee name not recorded',
    mandatory: true,
    blocker: false,
    evaluate: (d) =>
      !d.employeeDetails.firstName.trim() ||
      !d.employeeDetails.lastName.trim()
  },
  {
    id: 'EMP-002',
    category: 'Employee Details',
    description: 'Last working day not recorded',
    mandatory: true,
    blocker: false,
    evaluate: (d) => !d.employeeDetails.lastWorkingDay
  },
  {
    id: 'EMP-003',
    category: 'Employee Details',
    description: 'Reason for leaving not recorded',
    mandatory: true,
    blocker: false,
    evaluate: (d) => !d.employeeDetails.reasonForLeaving
  },

  // ─── EXIT INTERVIEW (non-blocking) ──────────────────────────
  {
    id: 'EXI-001',
    category: 'Exit Interview',
    description: 'Exit interview not offered',
    mandatory: true,
    blocker: false,
    evaluate: (d) => notYes(d.exitInterview.interviewOffered)
  },
  {
    id: 'EXI-002',
    category: 'Exit Interview',
    description: 'Exit interview not completed',
    mandatory: false,
    blocker: false,
    evaluate: (d) => notYes(d.exitInterview.interviewCompleted)
  },
  {
    id: 'EXI-003',
    category: 'Exit Interview',
    description: 'Exit interview feedback not documented',
    mandatory: false,
    blocker: false,
    evaluate: (d) =>
      d.exitInterview.interviewCompleted === 'yes' &&
      notYes(d.exitInterview.feedbackDocumented)
  },

  // ─── KNOWLEDGE TRANSFER (non-blocking) ──────────────────────
  {
    id: 'KT-001',
    category: 'Knowledge Transfer',
    description: 'Successor / handover recipient not identified',
    mandatory: true,
    blocker: false,
    evaluate: (d) => notYes(d.knowledgeTransfer.successorIdentified)
  },
  {
    id: 'KT-002',
    category: 'Knowledge Transfer',
    description: 'Handover document not created',
    mandatory: true,
    blocker: false,
    evaluate: (d) => notYes(d.knowledgeTransfer.handoverDocumentCreated)
  },
  {
    id: 'KT-003',
    category: 'Knowledge Transfer',
    description: 'Work-in-progress not documented',
    mandatory: false,
    blocker: false,
    evaluate: (d) => notYes(d.knowledgeTransfer.workInProgressDocumented)
  },
  {
    id: 'KT-004',
    category: 'Knowledge Transfer',
    description: 'Clinical caseload not reassigned',
    mandatory: true,
    blocker: false,
    evaluate: (d) => notYes(d.knowledgeTransfer.clinicalCaseloadReassigned)
  },

  // ─── EQUIPMENT RETURN (mandatory + blocker) ─────────────────
  {
    id: 'EQ-001',
    category: 'Equipment Return',
    description: 'Laptop not returned',
    mandatory: true,
    blocker: true,
    evaluate: (d) => notYesOrNa(d.equipmentReturn.laptopReturned)
  },
  {
    id: 'EQ-002',
    category: 'Equipment Return',
    description: 'Mobile phone not returned',
    mandatory: true,
    blocker: true,
    evaluate: (d) => notYesOrNa(d.equipmentReturn.mobilePhoneReturned)
  },
  {
    id: 'EQ-003',
    category: 'Equipment Return',
    description: 'ID badge not returned',
    mandatory: true,
    blocker: true,
    evaluate: (d) => notYesOrNa(d.equipmentReturn.idBadgeReturned)
  },
  {
    id: 'EQ-004',
    category: 'Equipment Return',
    description: 'Keys not returned',
    mandatory: true,
    blocker: true,
    evaluate: (d) => notYesOrNa(d.equipmentReturn.keysReturned)
  },
  {
    id: 'EQ-005',
    category: 'Equipment Return',
    description: 'Uniform not returned',
    mandatory: false,
    blocker: false,
    evaluate: (d) => notYesOrNa(d.equipmentReturn.uniformReturned)
  },
  {
    id: 'EQ-006',
    category: 'Equipment Return',
    description: 'Parking pass not returned',
    mandatory: false,
    blocker: false,
    evaluate: (d) => notYesOrNa(d.equipmentReturn.parkingPassReturned)
  },

  // ─── ACCESS REVOCATION (mandatory + blocker for IT criticals) ─
  {
    id: 'AC-001',
    category: 'Access Revocation',
    description: 'Email account not revoked',
    mandatory: true,
    blocker: true,
    evaluate: (d) => notYes(d.accessRevocation.emailRevoked)
  },
  {
    id: 'AC-002',
    category: 'Access Revocation',
    description: 'EHR / EPR access not revoked',
    mandatory: true,
    blocker: true,
    evaluate: (d) => notYes(d.accessRevocation.ehrEprRevoked)
  },
  {
    id: 'AC-003',
    category: 'Access Revocation',
    description: 'VPN access not revoked',
    mandatory: true,
    blocker: true,
    evaluate: (d) => notYes(d.accessRevocation.vpnRevoked)
  },
  {
    id: 'AC-004',
    category: 'Access Revocation',
    description: 'Active Directory account not disabled',
    mandatory: true,
    blocker: true,
    evaluate: (d) => notYes(d.accessRevocation.activeDirectoryDisabled)
  },
  {
    id: 'AC-005',
    category: 'Access Revocation',
    description: 'Building access not revoked',
    mandatory: true,
    blocker: true,
    evaluate: (d) => notYes(d.accessRevocation.buildingAccessRevoked)
  },
  {
    id: 'AC-006',
    category: 'Access Revocation',
    description: 'Cloud applications access not revoked',
    mandatory: true,
    blocker: true,
    evaluate: (d) => notYes(d.accessRevocation.cloudAppsRevoked)
  },

  // ─── FINAL PAYROLL & BENEFITS (mandatory + blocker for payroll) ─
  {
    id: 'PAY-001',
    category: 'Final Payroll & Benefits',
    description: 'Final salary not calculated',
    mandatory: true,
    blocker: true,
    evaluate: (d) => notYes(d.finalPayrollBenefits.finalSalaryCalculated)
  },
  {
    id: 'PAY-002',
    category: 'Final Payroll & Benefits',
    description: 'Accrued holiday pay not settled',
    mandatory: true,
    blocker: false,
    evaluate: (d) => notYes(d.finalPayrollBenefits.accruedHolidayPaid)
  },
  {
    id: 'PAY-003',
    category: 'Final Payroll & Benefits',
    description: 'P45 / final tax document not issued',
    mandatory: true,
    blocker: false,
    evaluate: (d) => notYes(d.finalPayrollBenefits.p45Issued)
  },
  {
    id: 'PAY-004',
    category: 'Final Payroll & Benefits',
    description: 'Payroll details not confirmed with employee',
    mandatory: false,
    blocker: false,
    evaluate: (d) => notYes(d.finalPayrollBenefits.payrollDetailsConfirmed)
  },

  // ─── REFERENCES & RECOMMENDATIONS (non-blocking) ─────────────
  {
    id: 'REF-001',
    category: 'References & Recommendations',
    description: 'Reference consent not obtained or declined',
    mandatory: false,
    blocker: false,
    evaluate: (d) => d.referencesRecommendations.referenceConsentGiven === ''
  },
  {
    id: 'REF-002',
    category: 'References & Recommendations',
    description: 'Reference policy not explained',
    mandatory: false,
    blocker: false,
    evaluate: (d) => notYes(d.referencesRecommendations.referencePolicyExplained)
  },

  // ─── NDA & POST-EMPLOYMENT (mandatory + blocker) ─────────────
  {
    id: 'NDA-001',
    category: 'Non-Disclosure & Post-Employment',
    description: 'Confidentiality not reaffirmed',
    mandatory: true,
    blocker: true,
    evaluate: (d) => notYes(d.nonDisclosurePostEmployment.confidentialityReaffirmed)
  },
  {
    id: 'NDA-002',
    category: 'Non-Disclosure & Post-Employment',
    description: 'Restrictive covenants not explained',
    mandatory: true,
    blocker: false,
    evaluate: (d) => notYes(d.nonDisclosurePostEmployment.restrictiveCovenantsExplained)
  },
  {
    id: 'NDA-003',
    category: 'Non-Disclosure & Post-Employment',
    description: 'Intellectual property not assigned to employer',
    mandatory: true,
    blocker: false,
    evaluate: (d) => notYes(d.nonDisclosurePostEmployment.intellectualPropertyAssigned)
  },
  {
    id: 'NDA-004',
    category: 'Non-Disclosure & Post-Employment',
    description: 'Organisational data not returned or destroyed',
    mandatory: true,
    blocker: true,
    evaluate: (d) => notYes(d.nonDisclosurePostEmployment.dataReturnedOrDestroyed)
  },

  // ─── FORWARDING DETAILS (non-blocking) ───────────────────────
  {
    id: 'FWD-001',
    category: 'Forwarding Details',
    description: 'Forwarding address not recorded',
    mandatory: false,
    blocker: false,
    evaluate: (d) =>
      !d.forwardingDetails.forwardingAddressLine1.trim() ||
      !d.forwardingDetails.forwardingPostcode.trim()
  },
  {
    id: 'FWD-002',
    category: 'Forwarding Details',
    description: 'Personal contact details not confirmed',
    mandatory: false,
    blocker: false,
    evaluate: (d) => notYes(d.forwardingDetails.forwardingDetailsConfirmed)
  },

  // ─── SIGN-OFF (mandatory + blocker for HR/manager/IT) ────────
  {
    id: 'SO-001',
    category: 'Sign-off',
    description: 'HR has not signed off',
    mandatory: true,
    blocker: true,
    evaluate: (d) => notYes(d.signoff.hrSignedOff)
  },
  {
    id: 'SO-002',
    category: 'Sign-off',
    description: 'Line manager has not signed off',
    mandatory: true,
    blocker: true,
    evaluate: (d) => notYes(d.signoff.lineManagerSignedOff)
  },
  {
    id: 'SO-003',
    category: 'Sign-off',
    description: 'IT has not signed off',
    mandatory: true,
    blocker: true,
    evaluate: (d) => notYes(d.signoff.itSignedOff)
  },
  {
    id: 'SO-004',
    category: 'Sign-off',
    description: 'Employee has not acknowledged offboarding',
    mandatory: false,
    blocker: false,
    evaluate: (d) => notYes(d.signoff.employeeAcknowledged)
  }
];

window.EmployeeOffboardingChecklist.validationRules = validationRules;
})();
