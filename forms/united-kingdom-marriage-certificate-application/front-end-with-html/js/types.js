// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the United Kingdom marriage
// certificate application form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_united_kingdom_marriage_certificate_application.sql`
// (the two parties' columns are prefixed `party_one_` / `party_two_`). This file
// builds and exports the canonical empty Application shape used by the wizard,
// so newly-added fields default correctly when older saved state is rehydrated
// from localStorage. It also exports display helpers (enum labels and
// validity-class / CSS-class hints).
//
// This is a COMPLETENESS and VALIDITY instrument, not a numeric score and NOT
// legal advice. The engine checks that an application to give notice of
// marriage or civil partnership in England and Wales, and to order marriage
// certificate copies, is eligible, complete and evidenced; it classifies it as
// `ready-to-submit` / `incomplete` / `needs-evidence` / `ineligible` and raises
// flags. The register office decides each notice.

/**
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'yes' | 'no' | 'not-applicable' | ''} YesNoNotApplicable
 * @typedef {'marriage' | 'civil-partnership' | ''} NoticeType
 * @typedef {'civil-register-office' | 'civil-approved-premises' | 'religious-registered-building' | 'anglican' | ''} CeremonyType
 * @typedef {'british-or-irish' | 'eu-settlement-scheme' | 'other' | ''} NationalityStatus
 * @typedef {'never-married' | 'divorced' | 'widowed' | 'dissolved-civil-partnership' | 'annulled' | 'currently-married-or-civil-partnered' | ''} MaritalStatus
 * @typedef {'standard' | 'priority' | ''} CertificateService
 * @typedef {'ready-to-submit' | 'incomplete' | 'needs-evidence' | 'ineligible'} ValidityClass
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — the notice.
 * @typedef {Object} Notice
 * @property {NoticeType} noticeType
 * @property {string | null} noticeDate            - ISO date; null when unset
 * @property {string} registrationDistrict
 * @property {YesNo} noticeGivenTogether
 */

/**
 * Step 2 — the ceremony.
 * @typedef {Object} Ceremony
 * @property {CeremonyType} ceremonyType
 * @property {string | null} ceremonyDate          - ISO date; null when unset
 * @property {string} venueName
 * @property {YesNo} venueConfirmed
 * @property {number | null} witnessCount
 */

/**
 * Steps 3 and 4 — each party.
 * @typedef {Object} Party
 * @property {string} name
 * @property {string | null} dateOfBirth           - ISO date; null when unset
 * @property {number | null} daysResidentInDistrict
 * @property {NationalityStatus} nationalityStatus
 * @property {MaritalStatus} maritalStatus
 * @property {YesNo} identityProvided
 * @property {YesNo} addressProofProvided
 * @property {YesNoNotApplicable} priorEndEvidenceProvided
 * @property {YesNoNotApplicable} immigrationEvidenceProvided
 */

/**
 * Step 5 — relationship.
 * @typedef {Object} Relationship
 * @property {YesNo} closelyRelated
 */

/**
 * Step 6 — GRO certificate order.
 * @typedef {Object} CertificateOrder
 * @property {number | null} certificateCopies
 * @property {CertificateService} certificateService
 * @property {string} groIndexReference
 * @property {string} applicantNote
 */

/**
 * @typedef {Object} Application
 * @property {Notice} notice
 * @property {Ceremony} ceremony
 * @property {Party} partyOne
 * @property {Party} partyTwo
 * @property {Relationship} relationship
 * @property {CertificateOrder} certificate
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
 * @property {ValidityClass} validityClass
 * @property {string | null} earliestCeremonyDate
 * @property {string | null} latestCeremonyDate
 * @property {boolean} immigrationReferralIndicated
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

/** @returns {Party} */
function emptyParty() {
  return {
    name: '',
    dateOfBirth: null,
    daysResidentInDistrict: null,
    nationalityStatus: '',
    maritalStatus: '',
    identityProvided: '',
    addressProofProvided: '',
    priorEndEvidenceProvided: '',
    immigrationEvidenceProvided: ''
  };
}

/**
 * Build a fresh, fully-blank application.
 * Text / enum fields default to `''`; numeric and date fields to `null`.
 * @returns {Application}
 */
function emptyApplication() {
  return {
    notice: {
      noticeType: '',
      noticeDate: null,
      registrationDistrict: '',
      noticeGivenTogether: ''
    },
    ceremony: {
      ceremonyType: '',
      ceremonyDate: null,
      venueName: '',
      venueConfirmed: '',
      witnessCount: null
    },
    partyOne: emptyParty(),
    partyTwo: emptyParty(),
    relationship: {
      closelyRelated: ''
    },
    certificate: {
      certificateCopies: null,
      certificateService: '',
      groIndexReference: '',
      applicantNote: ''
    }
  };
}

/** Validity-class label for display. */
function validityClassLabel(cls) {
  switch (cls) {
    case 'ready-to-submit': return 'Ready to submit';
    case 'incomplete': return 'Incomplete';
    case 'needs-evidence': return 'Needs evidence or correction';
    case 'ineligible': return 'Ineligible';
    default: return '';
  }
}

/** CSS class hint for the validity-class badge (reuses the risk palette). */
function validityClassClass(cls) {
  switch (cls) {
    case 'ready-to-submit': return 'risk-low';
    case 'incomplete': return 'risk-moderate';
    case 'needs-evidence': return 'risk-moderate';
    case 'ineligible': return 'risk-high';
    default: return '';
  }
}

/** Notice-type label. */
function noticeTypeLabel(value) {
  switch (value) {
    case 'marriage': return 'Marriage';
    case 'civil-partnership': return 'Civil partnership';
    default: return '';
  }
}

/** Ceremony-type label. */
function ceremonyTypeLabel(value) {
  switch (value) {
    case 'civil-register-office': return 'Civil ceremony at a register office';
    case 'civil-approved-premises': return 'Civil ceremony at approved premises';
    case 'religious-registered-building': return 'Religious ceremony in a registered building';
    case 'anglican': return 'Church of England or Church in Wales ceremony';
    default: return '';
  }
}

/** Nationality-status label. */
function nationalityStatusLabel(value) {
  switch (value) {
    case 'british-or-irish': return 'British or Irish citizen';
    case 'eu-settlement-scheme': return 'EU Settlement Scheme (settled or pre-settled)';
    case 'other': return 'Other (outside the UK and Ireland)';
    default: return '';
  }
}

/** Marital-status label. */
function maritalStatusLabel(value) {
  switch (value) {
    case 'never-married': return 'Never married or in a civil partnership';
    case 'divorced': return 'Divorced';
    case 'widowed': return 'Widowed';
    case 'dissolved-civil-partnership': return 'Civil partnership dissolved';
    case 'annulled': return 'Marriage or civil partnership annulled';
    case 'currently-married-or-civil-partnered': return 'Currently married or in a civil partnership';
    default: return '';
  }
}

/** Certificate-service label. */
function certificateServiceLabel(value) {
  switch (value) {
    case 'standard': return 'Standard';
    case 'priority': return 'Priority (next working day)';
    default: return '';
  }
}

/** Yes / No / Not applicable label. */
function yesNoLabel(value) {
  switch (value) {
    case 'yes': return 'Yes';
    case 'no': return 'No';
    case 'not-applicable': return 'Not applicable';
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

export { emptyApplication, emptyParty, validityClassLabel, validityClassClass, noticeTypeLabel, ceremonyTypeLabel, nationalityStatusLabel, maritalStatusLabel, certificateServiceLabel, yesNoLabel, priorityLabel };
