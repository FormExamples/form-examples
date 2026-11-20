// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the United States Property Tax
// Exemption Application.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_property_tax_exemption_application.sql`. This file builds
// and exports the canonical empty PropertyTaxApplication shape used by the
// wizard (so newly added fields default correctly when older saved state is
// rehydrated from localStorage) plus display helpers.
//
// This is a DOCUMENTATION-SUPPORT instrument, not legal or tax advice. The
// engine checks that the application is complete and plausibly eligible under
// the state's published rule; the county assessor (or state agency) decides.

/**
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'single-family' | 'condominium' | 'manufactured-home' | 'multi-unit' | 'other' | ''} PropertyType
 * @typedef {'sole' | 'joint' | 'trust' | 'life-estate' | 'contract-buyer' | 'other' | ''} OwnershipType
 * @typedef {'initial' | 'renewal' | 'late' | ''} ApplicationType
 * @typedef {'likely-eligible' | 'incomplete' | 'likely-ineligible'} EligibilityClass
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * @typedef {Object} Applicant
 * @property {string} applicantName
 * @property {string | null} dateOfBirth          - ISO date; null when unset
 * @property {number | null} ageOnAssessmentDate
 * @property {string} mailingAddress
 */

/**
 * @typedef {Object} Property
 * @property {string} state                       - 2-letter state code, upper case
 * @property {string} county
 * @property {string} parcelNumber
 * @property {string} propertyAddress
 * @property {PropertyType} propertyType
 * @property {OwnershipType} ownershipType
 * @property {YesNo} ownerOnAssessmentDate
 * @property {YesNo} occupiedAsPrimaryResidence
 * @property {string | null} occupancyStartDate   - ISO date; null when unset
 * @property {YesNo} otherHomesteadClaimed
 */

/**
 * @typedef {Object} Exemptions
 * @property {YesNo} claimHomestead
 * @property {YesNo} claimSenior
 * @property {YesNo} claimDisability
 * @property {YesNo} claimVeteran
 * @property {YesNo} claimCircuitBreaker
 * @property {number | null} veteranDisabilityPercent
 */

/**
 * @typedef {Object} Income
 * @property {number | null} householdIncomeDollars
 * @property {number | null} incomeTaxYear
 */

/**
 * @typedef {Object} Documents
 * @property {YesNo} proofOfOwnership
 * @property {YesNo} proofOfResidency
 * @property {YesNo} proofOfAge
 * @property {YesNo} proofOfIncome
 * @property {YesNo} proofOfDisability
 */

/**
 * @typedef {Object} Filing
 * @property {number | null} assessmentYear
 * @property {string | null} filingDate           - ISO date; null when unset
 * @property {ApplicationType} applicationType
 */

/**
 * @typedef {Object} Appeal
 * @property {YesNo} appealRequested
 * @property {string | null} noticeOfValueDate    - ISO date; null when unset
 * @property {YesNo} appealFiled
 */

/**
 * @typedef {Object} Declaration
 * @property {YesNo} penaltyAcknowledged
 * @property {YesNo} signedByApplicant
 * @property {string | null} signatureDate        - ISO date; null when unset
 */

/**
 * @typedef {Object} PropertyTaxApplication
 * @property {Applicant} applicant
 * @property {Property} property
 * @property {Exemptions} exemptions
 * @property {Income} income
 * @property {Documents} documents
 * @property {Filing} filing
 * @property {Appeal} appeal
 * @property {Declaration} declaration
 */

/**
 * @typedef {Object} FlaggedIssue
 * @property {string} id
 * @property {string} category
 * @property {Priority} priority
 * @property {string} description
 * @property {string} suggestedAction
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} dimension
 * @property {string} category
 * @property {string} description
 */

/**
 * @typedef {Object} ValidationResult
 * @property {EligibilityClass} eligibilityClass
 * @property {string | null} filingDeadline
 * @property {boolean} filedLate
 * @property {string[]} qualifyingExemptions
 * @property {FiredRule[]} rules
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

/** @returns {PropertyTaxApplication} */
function emptyApplication() {
  return {
    applicant: { applicantName: '', dateOfBirth: null, ageOnAssessmentDate: null, mailingAddress: '' },
    property: {
      state: '', county: '', parcelNumber: '', propertyAddress: '', propertyType: '',
      ownershipType: '', ownerOnAssessmentDate: '', occupiedAsPrimaryResidence: '',
      occupancyStartDate: null, otherHomesteadClaimed: ''
    },
    exemptions: {
      claimHomestead: '', claimSenior: '', claimDisability: '', claimVeteran: '',
      claimCircuitBreaker: '', veteranDisabilityPercent: null
    },
    income: { householdIncomeDollars: null, incomeTaxYear: null },
    documents: {
      proofOfOwnership: '', proofOfResidency: '', proofOfAge: '', proofOfIncome: '', proofOfDisability: ''
    },
    filing: { assessmentYear: null, filingDate: null, applicationType: '' },
    appeal: { appealRequested: '', noticeOfValueDate: null, appealFiled: '' },
    declaration: { penaltyAcknowledged: '', signedByApplicant: '', signatureDate: null }
  };
}

const CLASS_LABELS = {
  'likely-eligible': 'Likely eligible',
  incomplete: 'Incomplete',
  'likely-ineligible': 'Likely ineligible'
};
const CLASS_CSS = {
  'likely-eligible': 'risk-low',
  incomplete: 'risk-moderate',
  'likely-ineligible': 'risk-high'
};

/** @param {string} c */
function eligibilityClassLabel(c) { return CLASS_LABELS[c] || c; }
/** @param {string} c */
function eligibilityClassClass(c) { return CLASS_CSS[c] || ''; }

const PRIORITY_LABELS = { high: 'High', medium: 'Medium', low: 'Low' };
/** @param {string} p */
function priorityLabel(p) { return PRIORITY_LABELS[p] || p; }

const EXEMPTION_LABELS = {
  homestead: 'Homestead',
  senior: 'Senior',
  disability: 'Disability',
  veteran: 'Disabled veteran',
  'circuit-breaker': 'Circuit-breaker'
};
/** @param {string} e */
function exemptionLabel(e) { return EXEMPTION_LABELS[e] || e; }

export {
  emptyApplication, eligibilityClassLabel, eligibilityClassClass, priorityLabel, exemptionLabel
};
