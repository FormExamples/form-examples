// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the United States Divorce Petition
// (petition for dissolution of marriage, decree, and vital-records divorce
// certificate).
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_united_states_divorce_petition.sql`. This file builds
// and exports the canonical empty petition shape used by the wizard, so
// newly-added fields default correctly when older saved state is rehydrated
// from localStorage. It also exports display helpers.
//
// This is a DOCUMENTATION-SUPPORT instrument, NOT legal advice. Divorce law is
// state law; the engine checks that the petition is complete and that the
// filing state's residency and waiting-period rules look satisfied, then
// classifies it as `ready-to-file` / `incomplete` / `not-yet-eligible`. The
// court decides.

/**
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'uncontested' | 'contested' | ''} CaseType
 * @typedef {'no-fault' | 'fault' | ''} GroundType
 * @typedef {'adultery' | 'cruelty' | 'abandonment' | 'felony-conviction' | 'impotence' | 'other' | ''} FaultGround
 * @typedef {'community' | 'equitable' | ''} PropertyApproach
 * @typedef {'personal' | 'acceptance' | 'mail' | 'publication' | 'none' | ''} ServiceMethod
 * @typedef {'ready-to-file' | 'incomplete' | 'not-yet-eligible'} ReadinessClass
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * @typedef {Object} Filing
 * @property {string} state             - two-letter USPS code
 * @property {string} county
 * @property {string | null} filingDate  - ISO date; null when unset
 * @property {CaseType} caseType
 * @property {GroundType} groundType
 * @property {FaultGround} faultGround
 */

/**
 * @typedef {Object} Spouses
 * @property {string} petitionerName
 * @property {string} respondentName
 * @property {string | null} marriageDate
 * @property {string} marriagePlace
 * @property {string | null} separationDate
 * @property {number | null} petitionerResidencyMonths
 * @property {number | null} countyResidencyDays
 * @property {YesNo} marriedOrLivedInState
 * @property {YesNo} respondentMilitary
 */

/**
 * @typedef {Object} Children
 * @property {YesNo} hasMinorChildren
 * @property {number | null} childrenCount
 * @property {number | null} childrenHomeStateMonths
 * @property {YesNo} pregnant
 * @property {YesNo} custodyPlanDocumented
 * @property {YesNo} childSupportWorksheetCompleted
 * @property {number | null} childSupportMonthlyAmount
 */

/**
 * @typedef {Object} Property
 * @property {PropertyApproach} propertyDivisionApproach
 * @property {YesNo} settlementAgreementSigned
 * @property {YesNo} financialDisclosureFiled
 * @property {YesNo} spousalSupportRequested
 */

/**
 * @typedef {Object} Service
 * @property {ServiceMethod} serviceMethod
 * @property {string | null} serviceDate
 * @property {YesNo} respondentResponded
 */

/**
 * @typedef {Object} Decree
 * @property {YesNo} decreeEntered
 * @property {string | null} decreeDate
 * @property {YesNo} nameRestorationRequested
 * @property {string} nameToRestore
 * @property {YesNo} certificateRequested
 */

/**
 * @typedef {Object} DivorcePetition
 * @property {Filing} filing
 * @property {Spouses} spouses
 * @property {Children} children
 * @property {Property} property
 * @property {Service} service
 * @property {Decree} decree
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
 * @property {ReadinessClass} readinessClass
 * @property {string} propertyRegime            - community | equitable | unknown
 * @property {string | null} earliestDecreeDate - ISO date or null
 * @property {boolean} stateRuleKnown
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

/**
 * Build a fresh, fully-blank petition.
 * Text / enum fields default to `''`; numeric, date, and time fields to `null`.
 * @returns {DivorcePetition}
 */
function emptyPetition() {
  return {
    filing: {
      state: '',
      county: '',
      filingDate: null,
      caseType: '',
      groundType: '',
      faultGround: ''
    },
    spouses: {
      petitionerName: '',
      respondentName: '',
      marriageDate: null,
      marriagePlace: '',
      separationDate: null,
      petitionerResidencyMonths: null,
      countyResidencyDays: null,
      marriedOrLivedInState: '',
      respondentMilitary: ''
    },
    children: {
      hasMinorChildren: '',
      childrenCount: null,
      childrenHomeStateMonths: null,
      pregnant: '',
      custodyPlanDocumented: '',
      childSupportWorksheetCompleted: '',
      childSupportMonthlyAmount: null
    },
    property: {
      propertyDivisionApproach: '',
      settlementAgreementSigned: '',
      financialDisclosureFiled: '',
      spousalSupportRequested: ''
    },
    service: {
      serviceMethod: '',
      serviceDate: null,
      respondentResponded: ''
    },
    decree: {
      decreeEntered: '',
      decreeDate: null,
      nameRestorationRequested: '',
      nameToRestore: '',
      certificateRequested: ''
    }
  };
}

/** Readiness-class label for display. */
function readinessClassLabel(cls) {
  switch (cls) {
    case 'ready-to-file': return 'Ready to file';
    case 'incomplete': return 'Incomplete';
    case 'not-yet-eligible': return 'Not yet eligible';
    default: return '';
  }
}

/** CSS class hint for the readiness badge (reuses the risk palette). */
function readinessClassClass(cls) {
  switch (cls) {
    case 'ready-to-file': return 'risk-low';
    case 'incomplete': return 'risk-moderate';
    case 'not-yet-eligible': return 'risk-high';
    default: return '';
  }
}

/** Case-type label. */
function caseTypeLabel(value) {
  switch (value) {
    case 'uncontested': return 'Uncontested (agreed)';
    case 'contested': return 'Contested';
    default: return '';
  }
}

/** Ground-type label. */
function groundTypeLabel(value) {
  switch (value) {
    case 'no-fault': return 'No-fault (irretrievable breakdown, irreconcilable differences)';
    case 'fault': return 'Fault ground';
    default: return '';
  }
}

/** Fault-ground label. */
function faultGroundLabel(value) {
  switch (value) {
    case 'adultery': return 'Adultery';
    case 'cruelty': return 'Cruelty';
    case 'abandonment': return 'Abandonment or desertion';
    case 'felony-conviction': return 'Felony conviction or imprisonment';
    case 'impotence': return 'Impotence';
    case 'other': return 'Other fault ground';
    default: return '';
  }
}

/** Property-division-approach label. */
function propertyApproachLabel(value) {
  switch (value) {
    case 'community': return 'Community property';
    case 'equitable': return 'Equitable distribution';
    case 'unknown': return 'Unknown (verify state rule)';
    default: return '';
  }
}

/** Service-method label. */
function serviceMethodLabel(value) {
  switch (value) {
    case 'personal': return 'Personal service by a process server or sheriff';
    case 'acceptance': return 'Acceptance or waiver of service signed by the respondent';
    case 'mail': return 'Certified mail with return receipt';
    case 'publication': return 'Service by publication';
    case 'none': return 'Not yet served';
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

export { emptyPetition, readinessClassLabel, readinessClassClass, caseTypeLabel, groundTypeLabel, faultGroundLabel, propertyApproachLabel, serviceMethodLabel, yesNoLabel, priorityLabel };
