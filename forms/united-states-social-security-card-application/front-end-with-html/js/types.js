// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the United States Social Security
// card application (Form SS-5).
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_ss5_application.sql`. This file builds and exports the
// canonical empty SocialSecurityApplication shape used by the wizard, so
// newly-added fields default correctly when older saved state is rehydrated
// from localStorage. It also exports the option lists and display helpers.
//
// This is a DOCUMENTATION-SUPPORT and COMPLETENESS instrument, not legal
// advice and not an SSA decision. The engine checks that the application and
// its evidence are complete and consistent with the published SS-5 rules and
// classifies it as `ready-to-submit` / `incomplete` / `evidence-missing` /
// `not-eligible`. The Social Security Administration decides every application.
// The Social Security number itself is deliberately never collected.

/**
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'yes' | 'no' | 'dont-know' | ''} YesNoUnknown
 * @typedef {'original' | 'replacement' | 'correction' | ''} RequestType
 * @typedef {'in-person' | 'mail' | ''} Channel
 * @typedef {'us-citizen' | 'legal-alien-allowed-to-work' | 'legal-alien-not-allowed-to-work' | 'other' | ''} Citizenship
 * @typedef {'ready-to-submit' | 'incomplete' | 'evidence-missing' | 'not-eligible'} ApplicationClass
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 - what is being requested.
 * @typedef {Object} Request
 * @property {string | null} applicationDate
 * @property {RequestType} requestType
 * @property {Channel} channel
 * @property {YesNoUnknown} previouslyApplied
 * @property {YesNo} nameChange
 * @property {string} nameChangeReason
 * @property {YesNo} dateOfBirthCorrection
 * @property {number | null} replacementsThisYear
 * @property {number | null} replacementsLifetime
 * @property {string} limitExceptionReason
 * @property {YesNo} limitExceptionEvidence
 */

/**
 * Step 2 - the applicant (SS-5 items 1-11, 13, 14, 16, 17).
 * @typedef {Object} Applicant
 * @property {string} nameOnCard
 * @property {string} nameAtBirth
 * @property {string} otherNamesUsed
 * @property {string} nameOnMostRecentCard
 * @property {string | null} dateOfBirth
 * @property {string} placeOfBirthCity
 * @property {string} placeOfBirthRegion
 * @property {string} sex
 * @property {Citizenship} citizenship
 * @property {YesNo} nonWorkReasonValid
 * @property {string} motherNameAtBirth
 * @property {string} fatherName
 * @property {string} stateOfResidence
 * @property {string} mailingAddress
 * @property {string} phone
 */

/**
 * Step 3 - evidence documents.
 * @typedef {Object} Evidence
 * @property {string} identityDocument
 * @property {YesNo} identityDocumentExpired
 * @property {string} ageDocument
 * @property {string} citizenshipDocument
 * @property {YesNoUnknown} citizenshipOnFile
 * @property {string} nameChangeDocument
 * @property {YesNo} documentsOriginalOrCertified
 */

/**
 * Step 4 - filer and signature.
 * @typedef {Object} Filer
 * @property {string} signerRelationship
 * @property {string} signerName
 * @property {YesNo} signerIdentityDocument
 * @property {YesNo} signaturePresent
 */

/**
 * Step 5 - death-related Tell-SSA items.
 * @typedef {Object} TellSsa
 * @property {YesNo} applicantDeceased
 * @property {YesNo} deathReportedToSsa
 * @property {string} preparerNote
 */

/**
 * @typedef {Object} SocialSecurityApplication
 * @property {Request} request
 * @property {Applicant} applicant
 * @property {Evidence} evidence
 * @property {Filer} filer
 * @property {TellSsa} tellSsa
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
 * @property {number} missingEvidenceCount
 * @property {boolean} replacementLimitReached
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

/**
 * Build a fresh, fully-blank application.
 * Text / enum fields default to `''`; numeric and date fields to `null`.
 * @returns {SocialSecurityApplication}
 */
function emptyApplication() {
  return {
    request: {
      applicationDate: null,
      requestType: '',
      channel: '',
      previouslyApplied: '',
      nameChange: '',
      nameChangeReason: '',
      dateOfBirthCorrection: '',
      replacementsThisYear: null,
      replacementsLifetime: null,
      limitExceptionReason: '',
      limitExceptionEvidence: ''
    },
    applicant: {
      nameOnCard: '',
      nameAtBirth: '',
      otherNamesUsed: '',
      nameOnMostRecentCard: '',
      dateOfBirth: null,
      placeOfBirthCity: '',
      placeOfBirthRegion: '',
      sex: '',
      citizenship: '',
      nonWorkReasonValid: '',
      motherNameAtBirth: '',
      fatherName: '',
      stateOfResidence: '',
      mailingAddress: '',
      phone: ''
    },
    evidence: {
      identityDocument: '',
      identityDocumentExpired: '',
      ageDocument: '',
      citizenshipDocument: '',
      citizenshipOnFile: '',
      nameChangeDocument: '',
      documentsOriginalOrCertified: ''
    },
    filer: {
      signerRelationship: '',
      signerName: '',
      signerIdentityDocument: '',
      signaturePresent: ''
    },
    tellSsa: {
      applicantDeceased: '',
      deathReportedToSsa: '',
      preparerNote: ''
    }
  };
}

const YES_NO = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' }
];
const YES_NO_UNKNOWN = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'dont-know', label: "Don't know" }
];

/** Option lists for every enum field, shared by the wizard and the labels. */
const OPTIONS = {
  requestType: [
    { value: 'original', label: 'Original Social Security card' },
    { value: 'replacement', label: 'Replacement card (same name and number)' },
    { value: 'correction', label: 'Corrected card (name, date of birth, or other data)' }
  ],
  channel: [
    { value: 'in-person', label: 'In person at a Social Security office' },
    { value: 'mail', label: 'By mail' }
  ],
  nameChangeReason: [
    { value: 'marriage', label: 'Marriage' },
    { value: 'divorce', label: 'Divorce' },
    { value: 'court-order', label: 'Court order' },
    { value: 'other', label: 'Other legal name change' }
  ],
  limitExceptionReason: [
    { value: 'name-change', label: 'Legal name change' },
    { value: 'legend-change', label: 'Legend (work authorization) change' },
    { value: 'non-receipt', label: 'Card issued but never received' },
    { value: 'ssa-error', label: 'Social Security Administration error' },
    { value: 'hardship', label: 'Hardship of the number holder' }
  ],
  sex: [
    { value: 'female', label: 'Female' },
    { value: 'male', label: 'Male' }
  ],
  citizenship: [
    { value: 'us-citizen', label: 'US citizen' },
    { value: 'legal-alien-allowed-to-work', label: 'Legal alien allowed to work' },
    { value: 'legal-alien-not-allowed-to-work', label: 'Legal alien not allowed to work' },
    { value: 'other', label: 'Other' }
  ],
  identityDocument: [
    { value: 'us-driver-license', label: 'US driver license' },
    { value: 'state-id-card', label: 'State-issued non-driver identification card' },
    { value: 'us-passport', label: 'US passport' },
    { value: 'military-id', label: 'US military identification' },
    { value: 'employee-id', label: 'Employee identification card' },
    { value: 'school-id', label: 'School identification card' },
    { value: 'health-insurance-card', label: 'Health insurance card (not Medicare)' },
    { value: 'other', label: 'Other document' },
    { value: 'none', label: 'No identity document' }
  ],
  ageDocument: [
    { value: 'us-birth-certificate', label: 'US birth certificate' },
    { value: 'us-passport', label: 'US passport' },
    { value: 'hospital-record', label: 'Hospital record of birth' },
    { value: 'religious-record', label: 'Religious record of birth or baptism' },
    { value: 'immigration-record', label: 'Immigration record showing age' },
    { value: 'other', label: 'Other document' },
    { value: 'none', label: 'No proof of age' }
  ],
  citizenshipDocument: [
    { value: 'us-birth-certificate', label: 'US birth certificate' },
    { value: 'us-passport', label: 'US passport' },
    { value: 'certificate-of-naturalization', label: 'Certificate of Naturalization' },
    { value: 'certificate-of-citizenship', label: 'Certificate of Citizenship' },
    { value: 'consular-report-of-birth-abroad', label: 'Consular Report of Birth Abroad' },
    { value: 'permanent-resident-card', label: 'Permanent Resident Card (Form I-551)' },
    { value: 'i-94-with-work-authorization', label: 'Form I-94 with an unexpired foreign passport and work authorization' },
    { value: 'employment-authorization-document', label: 'Employment Authorization Document (Form I-766)' },
    { value: 'other', label: 'Other document' },
    { value: 'none', label: 'No proof of citizenship or status' }
  ],
  nameChangeDocument: [
    { value: 'marriage-certificate', label: 'Marriage certificate' },
    { value: 'divorce-decree', label: 'Divorce decree' },
    { value: 'court-order', label: 'Court order for the name change' },
    { value: 'certificate-of-naturalization', label: 'Certificate of Naturalization showing the new name' },
    { value: 'other', label: 'Other document' },
    { value: 'none', label: 'No name-change document' }
  ],
  signerRelationship: [
    { value: 'self', label: 'The applicant (self)' },
    { value: 'parent', label: 'Parent' },
    { value: 'legal-guardian', label: 'Legal guardian' },
    { value: 'custodian', label: 'Custodian or other person with legal authority' },
    { value: 'other', label: 'Other' }
  ],
  yesNo: YES_NO,
  yesNoUnknown: YES_NO_UNKNOWN
};

/**
 * Look up the display label of an option value.
 * @param {keyof typeof OPTIONS} list
 * @param {string} value
 * @returns {string}
 */
function optionLabel(list, value) {
  const found = (OPTIONS[list] || []).find((o) => o.value === value);
  return found ? found.label : '';
}

/** @param {ApplicationClass | string} cls */
function applicationClassLabel(cls) {
  switch (cls) {
    case 'ready-to-submit': return 'Ready to submit';
    case 'incomplete': return 'Incomplete';
    case 'evidence-missing': return 'Evidence missing';
    case 'not-eligible': return 'Not eligible';
    default: return 'N/A';
  }
}

/** CSS risk class for a badge. @param {ApplicationClass | string} cls */
function applicationClassClass(cls) {
  switch (cls) {
    case 'ready-to-submit': return 'risk-low';
    case 'incomplete': return 'risk-moderate';
    case 'evidence-missing': return 'risk-moderate';
    case 'not-eligible': return 'risk-high';
    default: return '';
  }
}

/** @param {string} value */
function yesNoLabel(value) {
  if (value === 'yes') return 'Yes';
  if (value === 'no') return 'No';
  if (value === 'dont-know') return "Don't know";
  return '';
}

/** @param {Priority | string} priority */
function priorityLabel(priority) {
  switch (priority) {
    case 'high': return 'High';
    case 'medium': return 'Medium';
    case 'low': return 'Low';
    default: return '';
  }
}

export { emptyApplication, OPTIONS, optionLabel, applicationClassLabel, applicationClassClass, yesNoLabel, priorityLabel };
