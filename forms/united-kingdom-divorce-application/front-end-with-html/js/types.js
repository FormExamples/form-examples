// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the United Kingdom divorce (or
// civil-partnership dissolution) application.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_united_kingdom_divorce_application.sql`. This file builds
// and exports the canonical empty DivorceApplication shape used by the wizard,
// so newly-added fields default correctly when older saved state is rehydrated
// from localStorage. It also exports display helpers (enum labels and
// application-class / CSS-class hints).
//
// This is a COMPLETENESS and VALIDITY instrument, not a numeric score and NOT
// legal advice. The engine checks that an application for England and Wales
// under the Divorce, Dissolution and Separation Act 2020 is complete, that the
// time gates are met (one year of marriage, 20 weeks to the conditional order,
// 6 weeks and 1 day to the final order), classifies it as `ready-to-apply` /
// `incomplete` / `not-eligible-yet`, and raises flags.

/**
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'divorce' | 'dissolution' | ''} ApplicationType
 * @typedef {'sole' | 'joint' | ''} ApplicationMode
 * @typedef {'application' | 'conditional-order' | 'final-order' | ''} Stage
 * @typedef {'original' | 'certified-copy' | 'not-held' | ''} CertificateType
 * @typedef {'marriage-certificate' | 'deed-poll' | 'none' | ''} NameChangeProof
 * @typedef {'email' | 'post' | 'alternative-service' | ''} ServiceMethod
 * @typedef {'agreed' | 'not-agreed' | 'undecided' | ''} ChildrenArrangements
 * @typedef {'yes' | 'no' | 'undecided' | ''} FinancialOrderIntent
 * @typedef {'paid' | 'help-with-fees-approved' | 'help-with-fees-pending' | 'unpaid' | ''} FeeStatus
 * @typedef {'ready-to-apply' | 'incomplete' | 'not-eligible-yet'} ApplicationClass
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 - application type, stage and date of check.
 * @typedef {Object} Application
 * @property {ApplicationType} applicationType
 * @property {ApplicationMode} applicationMode
 * @property {Stage} stage
 * @property {string | null} asOfDate           - ISO date the check is made; null when unset
 * @property {YesNo} domesticAbuseRisk
 */

/**
 * Step 2 - marriage and certificate.
 * @typedef {Object} Marriage
 * @property {string | null} marriageDate
 * @property {string} marriagePlace
 * @property {string} marriageCountry
 * @property {YesNo} legallyRecognised
 * @property {YesNo} breakdownConfirmed
 * @property {CertificateType} marriageCertificateType
 * @property {YesNo} certificateInEnglish
 * @property {YesNo} certifiedTranslation
 * @property {YesNo} nameChanged
 * @property {NameChangeProof} nameChangeProof
 */

/**
 * Step 3 - jurisdiction (Domicile and Matrimonial Proceedings Act 1973, s.5(2)).
 * @typedef {Object} Jurisdiction
 * @property {YesNo} applicantHabitualResident
 * @property {number | null} applicantResidenceMonths
 * @property {YesNo} applicantDomiciled
 * @property {YesNo} respondentHabitualResident
 * @property {YesNo} respondentDomiciled
 * @property {YesNo} lastHabituallyResidentTogether
 */

/**
 * Step 4 - the parties and service address.
 * @typedef {Object} Parties
 * @property {string} applicantName
 * @property {string} applicantAddress
 * @property {string} applicantEmail
 * @property {string} respondentName
 * @property {string} respondentAddress
 * @property {string} respondentEmail
 * @property {YesNo} respondentAddressKnown
 * @property {ServiceMethod} serviceMethod
 */

/**
 * Step 5 - children.
 * @typedef {Object} Children
 * @property {YesNo} childrenUnder18
 * @property {number | null} childrenCount
 * @property {ChildrenArrangements} childrenArrangements
 * @property {string} childrenNote
 */

/**
 * Step 6 - money, property and the fee.
 * @typedef {Object} Finances
 * @property {FinancialOrderIntent} financialOrderIntended
 * @property {YesNo} financialOrderApplied
 * @property {FeeStatus} feeStatus
 */

/**
 * Step 7 - progress dates.
 * @typedef {Object} Progress
 * @property {string | null} applicationIssuedDate
 * @property {YesNo} respondentAcknowledged
 * @property {string | null} conditionalOrderGrantedDate
 * @property {YesNo} finalOrderDelayExplained
 */

/**
 * @typedef {Object} DivorceApplication
 * @property {Application} application
 * @property {Marriage} marriage
 * @property {Jurisdiction} jurisdiction
 * @property {Parties} parties
 * @property {Children} children
 * @property {Finances} finances
 * @property {Progress} progress
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
 * @typedef {Object} ValidationResult
 * @property {ApplicationClass} applicationClass
 * @property {string} earliestEligibleDate     - ISO date; '' when no time gate applies
 * @property {boolean} jurisdictionMet
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

/**
 * Build a fresh, fully-blank application.
 * Text / enum fields default to `''`; numeric and date fields to `null`.
 * @returns {DivorceApplication}
 */
function emptyApplication() {
  return {
    application: {
      applicationType: '',
      applicationMode: '',
      stage: '',
      asOfDate: null,
      domesticAbuseRisk: ''
    },
    marriage: {
      marriageDate: null,
      marriagePlace: '',
      marriageCountry: '',
      legallyRecognised: '',
      breakdownConfirmed: '',
      marriageCertificateType: '',
      certificateInEnglish: '',
      certifiedTranslation: '',
      nameChanged: '',
      nameChangeProof: ''
    },
    jurisdiction: {
      applicantHabitualResident: '',
      applicantResidenceMonths: null,
      applicantDomiciled: '',
      respondentHabitualResident: '',
      respondentDomiciled: '',
      lastHabituallyResidentTogether: ''
    },
    parties: {
      applicantName: '',
      applicantAddress: '',
      applicantEmail: '',
      respondentName: '',
      respondentAddress: '',
      respondentEmail: '',
      respondentAddressKnown: '',
      serviceMethod: ''
    },
    children: {
      childrenUnder18: '',
      childrenCount: null,
      childrenArrangements: '',
      childrenNote: ''
    },
    finances: {
      financialOrderIntended: '',
      financialOrderApplied: '',
      feeStatus: ''
    },
    progress: {
      applicationIssuedDate: null,
      respondentAcknowledged: '',
      conditionalOrderGrantedDate: null,
      finalOrderDelayExplained: ''
    }
  };
}

/** Application-class label for display. */
function applicationClassLabel(cls) {
  switch (cls) {
    case 'ready-to-apply': return 'Ready to apply';
    case 'incomplete': return 'Incomplete';
    case 'not-eligible-yet': return 'Not eligible yet';
    default: return '';
  }
}

/** CSS class hint for the application-class badge (reuses the risk palette). */
function applicationClassClass(cls) {
  switch (cls) {
    case 'ready-to-apply': return 'risk-low';
    case 'incomplete': return 'risk-moderate';
    case 'not-eligible-yet': return 'risk-high';
    default: return '';
  }
}

/** Stage label. */
function stageLabel(value) {
  switch (value) {
    case 'application': return 'Application (form D8 or online)';
    case 'conditional-order': return 'Conditional order (form D84)';
    case 'final-order': return 'Final order (form D36)';
    default: return '';
  }
}

/** Application-type label. */
function applicationTypeLabel(value) {
  switch (value) {
    case 'divorce': return 'Divorce';
    case 'dissolution': return 'Dissolution of a civil partnership';
    default: return '';
  }
}

/** Application-mode label. */
function applicationModeLabel(value) {
  switch (value) {
    case 'sole': return 'Sole application';
    case 'joint': return 'Joint application';
    default: return '';
  }
}

/** Marriage-certificate label. */
function certificateTypeLabel(value) {
  switch (value) {
    case 'original': return 'Original certificate';
    case 'certified-copy': return 'Certified copy';
    case 'not-held': return 'Not held';
    default: return '';
  }
}

/** Service-method label. */
function serviceMethodLabel(value) {
  switch (value) {
    case 'email': return 'By email';
    case 'post': return 'By post';
    case 'alternative-service': return 'Alternative service (court order needed)';
    default: return '';
  }
}

/** Children-arrangements label. */
function childrenArrangementsLabel(value) {
  switch (value) {
    case 'agreed': return 'Agreed';
    case 'not-agreed': return 'Not agreed';
    case 'undecided': return 'Undecided';
    default: return '';
  }
}

/** Financial-order-intent label. */
function financialOrderLabel(value) {
  switch (value) {
    case 'yes': return 'Yes, a financial order is intended';
    case 'no': return 'No financial order intended';
    case 'undecided': return 'Undecided';
    default: return '';
  }
}

/** Fee-status label. */
function feeStatusLabel(value) {
  switch (value) {
    case 'paid': return 'Paid';
    case 'help-with-fees-approved': return 'Help with Fees approved';
    case 'help-with-fees-pending': return 'Help with Fees pending';
    case 'unpaid': return 'Not paid';
    default: return '';
  }
}

/** Yes / No label. */
function yesNoLabel(value) {
  switch (value) {
    case 'yes': return 'Yes';
    case 'no': return 'No';
    default: return '';
  }
}

/** Flag-priority label. */
function priorityLabel(priority) {
  switch (priority) {
    case 'high': return 'HIGH';
    case 'medium': return 'MEDIUM';
    case 'low': return 'LOW';
    default: return '';
  }
}

export { emptyApplication, applicationClassLabel, applicationClassClass, stageLabel, applicationTypeLabel, applicationModeLabel, certificateTypeLabel, serviceMethodLabel, childrenArrangementsLabel, financialOrderLabel, feeStatusLabel, yesNoLabel, priorityLabel };
