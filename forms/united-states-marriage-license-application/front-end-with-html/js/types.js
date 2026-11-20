// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the United States marriage license
// application.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_united_states_marriage_license_application.sql`. This
// file builds and exports the canonical empty application shape used by the
// wizard, so newly-added fields default correctly when older saved state is
// rehydrated from localStorage. It also exports display helpers.
//
// This is a DOCUMENTATION-SUPPORT instrument, NOT legal advice. Marriage law
// is made state by state; the issuing county clerk (or a court) decides. The
// engine checks that an application is complete, that nothing in it bars the
// license under the applicable state rule, and raises flags.

/**
 * @typedef {'female' | 'male' | 'nonbinary' | 'unknown' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'never-married' | 'divorced' | 'widowed' | 'annulled' | 'currently-married' | ''} MaritalStatus
 * @typedef {'provided' | 'none-issued' | 'declined' | ''} SsnStatus
 * @typedef {'standard' | 'confidential' | ''} LicenseType
 * @typedef {'not-related' | 'related-prohibited' | ''} Relationship
 * @typedef {'not-applicable' | 'parental-consent' | 'court-order' | 'none' | ''} MinorConsent
 * @typedef {'provided' | 'not-required' | 'not-provided' | ''} BloodTestEvidence
 * @typedef {'clergy' | 'judge' | 'clerk' | 'notary' | 'self-uniting' | 'other' | ''} OfficiantType
 * @typedef {'ready-to-apply' | 'incomplete' | 'not-eligible'} ApplicationClass
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 -- issuing jurisdiction.
 * @typedef {Object} Jurisdiction
 * @property {string} state                - two-letter USPS code
 * @property {string} county
 * @property {string | null} applicationDate - ISO date
 * @property {LicenseType} licenseType
 */

/**
 * Steps 2 and 3 -- one applicant.
 * @typedef {Object} Applicant
 * @property {string} name
 * @property {Sex} sex
 * @property {string | null} dateOfBirth
 * @property {string} placeOfBirth
 * @property {string} residenceState
 * @property {YesNo} idPresented
 * @property {SsnStatus} ssnStatus
 * @property {MaritalStatus} maritalStatus
 * @property {string | null} priorMarriageEndedDate
 */

/**
 * Step 4 -- eligibility.
 * @typedef {Object} Eligibility
 * @property {Relationship} relationshipBetweenApplicants
 * @property {MinorConsent} minorConsent
 * @property {YesNo} activeDutyMilitary
 * @property {YesNo} appearInPerson
 * @property {YesNo} proxyRequested
 * @property {YesNo} premaritalCourseCompleted
 * @property {BloodTestEvidence} bloodTestEvidence
 */

/**
 * Step 5 -- license issuance and fee.
 * @typedef {Object} Issuance
 * @property {number | null} feePaidUsd
 * @property {string | null} licenseIssuedDate
 * @property {string} clerkNote
 */

/**
 * Step 6 -- ceremony and certified certificate.
 * @typedef {Object} Ceremony
 * @property {string | null} ceremonyDate
 * @property {OfficiantType} officiantType
 * @property {string} officiantName
 * @property {YesNo} officiantAuthorized
 * @property {number | null} witnessCount
 * @property {string | null} licenseReturnedDate
 * @property {number | null} certifiedCopiesRequested
 */

/**
 * @typedef {Object} MarriageApplication
 * @property {Jurisdiction} jurisdiction
 * @property {Applicant} applicantOne
 * @property {Applicant} applicantTwo
 * @property {Eligibility} eligibility
 * @property {Issuance} issuance
 * @property {Ceremony} ceremony
 */

/**
 * @typedef {Object} FlaggedIssue
 * @property {string} id
 * @property {string} category
 * @property {Priority} priority
 * @property {string} description
 * @property {string} suggestedAction
 */

function emptyApplicant() {
  return {
    name: '',
    sex: '',
    dateOfBirth: null,
    placeOfBirth: '',
    residenceState: '',
    idPresented: '',
    ssnStatus: '',
    maritalStatus: '',
    priorMarriageEndedDate: null
  };
}

/**
 * Build a fresh, fully-blank application.
 * Text / enum fields default to `''`; numeric, date, and time fields to `null`.
 * @returns {MarriageApplication}
 */
function emptyApplication() {
  return {
    jurisdiction: { state: '', county: '', applicationDate: null, licenseType: '' },
    applicantOne: emptyApplicant(),
    applicantTwo: emptyApplicant(),
    eligibility: {
      relationshipBetweenApplicants: '',
      minorConsent: '',
      activeDutyMilitary: '',
      appearInPerson: '',
      proxyRequested: '',
      premaritalCourseCompleted: '',
      bloodTestEvidence: ''
    },
    issuance: { feePaidUsd: null, licenseIssuedDate: null, clerkNote: '' },
    ceremony: {
      ceremonyDate: null,
      officiantType: '',
      officiantName: '',
      officiantAuthorized: '',
      witnessCount: null,
      licenseReturnedDate: null,
      certifiedCopiesRequested: null
    }
  };
}

const LABELS = {
  sex: { female: 'Female', male: 'Male', nonbinary: 'Nonbinary', unknown: 'Prefer not to say' },
  maritalStatus: {
    'never-married': 'Never married',
    divorced: 'Divorced',
    widowed: 'Widowed',
    annulled: 'Previous marriage annulled',
    'currently-married': 'Currently married'
  },
  ssnStatus: { provided: 'Provided to the clerk', 'none-issued': 'No Social Security number issued', declined: 'Declined to provide' },
  licenseType: { standard: 'Standard (public) license', confidential: 'Confidential license' },
  relationship: { 'not-related': 'Not related', 'related-prohibited': 'Related within a prohibited degree' },
  minorConsent: {
    'not-applicable': 'Not applicable (both 18 or older)',
    'parental-consent': 'Parental or guardian consent',
    'court-order': 'Court order or judicial approval',
    none: 'No consent or court order'
  },
  bloodTest: { provided: 'Test evidence provided', 'not-required': 'Not required', 'not-provided': 'Not provided' },
  officiantType: { clergy: 'Clergy or religious officiant', judge: 'Judge or magistrate', clerk: 'Clerk or deputy clerk', notary: 'Notary public', 'self-uniting': 'Self-uniting (no officiant)', other: 'Other authorized officiant' },
  yesNo: { yes: 'Yes', no: 'No' },
  applicationClass: { 'ready-to-apply': 'Ready to apply', incomplete: 'Incomplete', 'not-eligible': 'Not eligible' },
  priority: { high: 'HIGH', medium: 'MEDIUM', low: 'LOW' }
};

const labeller = (table) => (value) => LABELS[table][value] || '';

const sexLabel = labeller('sex');
const maritalStatusLabel = labeller('maritalStatus');
const ssnStatusLabel = labeller('ssnStatus');
const licenseTypeLabel = labeller('licenseType');
const relationshipLabel = labeller('relationship');
const minorConsentLabel = labeller('minorConsent');
const bloodTestLabel = labeller('bloodTest');
const officiantTypeLabel = labeller('officiantType');
const yesNoLabel = labeller('yesNo');
const applicationClassLabel = labeller('applicationClass');
const priorityLabel = labeller('priority');

/** CSS class hint for the class badge (reuses the risk palette). */
function applicationClassClass(cls) {
  switch (cls) {
    case 'ready-to-apply': return 'risk-low';
    case 'incomplete': return 'risk-moderate';
    case 'not-eligible': return 'risk-high';
    default: return '';
  }
}

export { emptyApplication, emptyApplicant, LABELS, applicationClassLabel, applicationClassClass, sexLabel, maritalStatusLabel, ssnStatusLabel, licenseTypeLabel, relationshipLabel, minorConsentLabel, bloodTestLabel, officiantTypeLabel, yesNoLabel, priorityLabel };
