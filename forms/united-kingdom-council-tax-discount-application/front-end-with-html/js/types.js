// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the United Kingdom Council Tax
// Discount Application.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_united_kingdom_council_tax_discount_application.sql`
// and `sql/05_create_table_occupant.sql`. This file builds and exports the
// canonical empty Application shape used by the wizard, so newly-added fields
// default correctly when older saved state is rehydrated from localStorage. It
// also exports display helpers (enum labels and eligibility-class CSS hints).
//
// This is a COMPLETENESS and ELIGIBILITY instrument, not a clinical score. The
// engine checks that the application is complete and consistent with the
// Council Tax rules for England, classifies it as `likely-eligible`,
// `incomplete` or `likely-ineligible`, states the indicative outcome and
// raises flags. ELIGIBILITY IS DECIDED BY THE BILLING AUTHORITY, not by this
// form.

/**
 * @typedef {'single-person-discount' | 'all-disregarded-discount' | 'student-exemption' | 'severe-mental-impairment' | 'disabled-band-reduction' | 'care-leaver-relief' | 'council-tax-reduction' | ''} ClaimType
 * @typedef {'counted-adult' | 'full-time-student' | 'severely-mentally-impaired' | 'under-18' | 'apprentice' | 'education-18-19' | 'live-in-carer' | 'care-leaver' | 'other-disregarded' | ''} OccupantStatus
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | ''} Band
 * @typedef {'owner-occupier' | 'tenant' | 'landlord' | 'other' | ''} LiableRole
 * @typedef {'extra-bathroom' | 'extra-kitchen' | 'extra-room' | 'wheelchair-space' | 'none' | ''} Adaptation
 * @typedef {'likely-eligible' | 'incomplete' | 'likely-ineligible'} EligibilityClass
 * @typedef {'25-percent-discount' | '50-percent-discount' | 'full-exemption' | 'smi-disregard' | 'band-reduction' | 'care-leaver-relief' | 'means-tested-reduction' | 'none'} IndicativeOutcome
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * @typedef {Object} Occupant
 * @property {string} name
 * @property {string | null} birthDate     - ISO date; null when unset
 * @property {OccupantStatus} status
 * @property {YesNo} evidenceHeld
 */

/**
 * @typedef {Object} Application
 * @property {{claimType: ClaimType, billingAuthority: string, accountReference: string, applicationDate: string | null, effectiveDate: string | null}} claim
 * @property {{name: string, birthDate: string | null, email: string, phone: string, status: OccupantStatus}} applicant
 * @property {{addressAsFullText: string, postcode: string, band: Band, mainResidence: YesNo, liableRole: LiableRole}} property
 * @property {{othersLive: YesNo, occupants: Occupant[]}} household
 * @property {{smiCertificate: YesNo, qualifyingBenefit: YesNo, studentCertificate: YesNo, studentCourseMonths: number | null, studentHoursPerWeek: number | null, disabilityAdaptation: Adaptation, disabledPersonMainHome: YesNo, apprenticeDeclaration: YesNo, careLeaverProof: YesNo, careLeaverAgeYears: number | null, notes: string}} evidence
 * @property {{declaredTrue: YesNo, agreesToReportChanges: YesNo, fraudWarningAcknowledged: YesNo, declarantName: string, declarationDate: string | null}} declaration
 */

/**
 * @typedef {Object} FlaggedIssue
 * @property {string} id
 * @property {string} category
 * @property {Priority} priority
 * @property {string} description
 * @property {string} suggestedAction
 */

/** @returns {Occupant} */
function emptyOccupant() {
  return { name: '', birthDate: null, status: '', evidenceHeld: '' };
}

/** @returns {Application} */
function emptyApplication() {
  return {
    claim: {
      claimType: '',
      billingAuthority: '',
      accountReference: '',
      applicationDate: null,
      effectiveDate: null
    },
    applicant: { name: '', birthDate: null, email: '', phone: '', status: '' },
    property: { addressAsFullText: '', postcode: '', band: '', mainResidence: '', liableRole: '' },
    household: { othersLive: '', occupants: [] },
    evidence: {
      smiCertificate: '',
      qualifyingBenefit: '',
      studentCertificate: '',
      studentCourseMonths: null,
      studentHoursPerWeek: null,
      disabilityAdaptation: '',
      disabledPersonMainHome: '',
      apprenticeDeclaration: '',
      careLeaverProof: '',
      careLeaverAgeYears: null,
      notes: ''
    },
    declaration: {
      declaredTrue: '',
      agreesToReportChanges: '',
      fraudWarningAcknowledged: '',
      declarantName: '',
      declarationDate: null
    }
  };
}

/** Eligibility-class label. */
function eligibilityClassLabel(value) {
  switch (value) {
    case 'likely-eligible': return 'Likely eligible';
    case 'incomplete': return 'Incomplete';
    case 'likely-ineligible': return 'Likely ineligible';
    default: return 'N/A';
  }
}

/** Eligibility-class CSS hint (existing risk-badge classes). */
function eligibilityClassClass(value) {
  switch (value) {
    case 'likely-eligible': return 'risk-low';
    case 'incomplete': return 'risk-moderate';
    case 'likely-ineligible': return 'risk-high';
    default: return '';
  }
}

/** Claim-type label. */
function claimTypeLabel(value) {
  switch (value) {
    case 'single-person-discount': return 'Single person discount (25%)';
    case 'all-disregarded-discount': return 'Everyone disregarded (50% discount)';
    case 'student-exemption': return 'Full-time student exemption';
    case 'severe-mental-impairment': return 'Severe mental impairment disregard';
    case 'disabled-band-reduction': return 'Disabled band reduction';
    case 'care-leaver-relief': return 'Care leaver relief';
    case 'council-tax-reduction': return 'Council Tax Reduction (means-tested)';
    default: return '';
  }
}

/** Occupant-status label. */
function occupantStatusLabel(value) {
  switch (value) {
    case 'counted-adult': return 'Adult (counts)';
    case 'full-time-student': return 'Full-time student';
    case 'severely-mentally-impaired': return 'Severely mentally impaired';
    case 'under-18': return 'Under 18';
    case 'apprentice': return 'Apprentice';
    case 'education-18-19': return 'Aged 18 or 19 in full-time education';
    case 'live-in-carer': return 'Live-in carer';
    case 'care-leaver': return 'Care leaver';
    case 'other-disregarded': return 'Other disregarded person';
    default: return '';
  }
}

/** Indicative-outcome label. */
function indicativeOutcomeLabel(value) {
  switch (value) {
    case '25-percent-discount': return '25% discount';
    case '50-percent-discount': return '50% discount';
    case 'full-exemption': return 'Full exemption (no bill)';
    case 'smi-disregard': return 'Severe mental impairment disregard';
    case 'band-reduction': return 'Reduction to the next lower band';
    case 'care-leaver-relief': return 'Care leaver relief';
    case 'means-tested-reduction': return 'Means-tested reduction (decided by the authority)';
    case 'none': return 'No discount indicated';
    default: return '';
  }
}

/** Adaptation label. */
function adaptationLabel(value) {
  switch (value) {
    case 'extra-bathroom': return 'Extra bathroom';
    case 'extra-kitchen': return 'Extra kitchen';
    case 'extra-room': return 'Extra room needed by the disabled person';
    case 'wheelchair-space': return 'Extra indoor space for a wheelchair';
    case 'none': return 'No qualifying adaptation';
    default: return '';
  }
}

/** Liable-role label. */
function liableRoleLabel(value) {
  switch (value) {
    case 'owner-occupier': return 'Owner-occupier';
    case 'tenant': return 'Tenant';
    case 'landlord': return 'Landlord';
    case 'other': return 'Other';
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

export { emptyApplication, emptyOccupant, eligibilityClassLabel, eligibilityClassClass, claimTypeLabel, occupantStatusLabel, indicativeOutcomeLabel, adaptationLabel, liableRoleLabel, yesNoLabel, priorityLabel };
