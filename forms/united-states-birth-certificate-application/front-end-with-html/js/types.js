// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the United States Birth Certificate
// Application form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/02_create_table_applicant.sql`, `sql/03_create_table_registrant.sql` and
// `sql/04_create_table_united_states_birth_certificate_application.sql`.
//
// This is a DOCUMENTATION-SUPPORT instrument, NOT legal advice and NOT a
// substitute for the issuing state or territory vital records office, which
// alone decides whether a request is accepted. The engine checks that the
// request is internally complete and that the requester appears eligible under
// the applicable state rule, classifies it as `ready-to-submit` / `incomplete`
// / `ineligible-requester`, and raises flags.

/**
 * @typedef {'female' | 'male' | 'other' | 'unknown' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'self' | 'parent' | 'legal-guardian' | 'legal-representative' | 'spouse' | 'child' | 'sibling' | 'grandparent' | 'grandchild' | 'government-agency' | 'other' | ''} Relationship
 * @typedef {'passport' | 'real-id' | 'school' | 'employment' | 'benefits' | 'genealogy' | 'foreign-use' | 'other' | ''} Purpose
 * @typedef {'certified-long-form' | 'certified-short-form' | 'informational' | ''} CertificateType
 * @typedef {'online' | 'mail' | 'in-person' | ''} DeliveryMethod
 * @typedef {'state-driver-license' | 'state-id-card' | 'us-passport' | 'military-id' | 'other-photo-id' | 'none' | ''} IdType
 * @typedef {'ready-to-submit' | 'incomplete' | 'ineligible-requester'} ApplicationClass
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 - the person completing the request.
 * @typedef {Object} Applicant
 * @property {string} applicantName
 * @property {string | null} dateOfBirth   - ISO date; null when unset
 * @property {string} email
 * @property {string} phone
 * @property {string} postalAddress
 */

/**
 * Step 2 - the person named on the certificate (Standard Certificate of Live Birth data).
 * @typedef {Object} Registrant
 * @property {string} registrantName
 * @property {Sex} sex
 * @property {string | null} dateOfBirth
 * @property {string} placeOfBirth
 * @property {string} countyOfBirth
 * @property {string} state                 - 2-letter code of the state or territory of birth
 * @property {string} birthFacility
 * @property {string} motherNameBeforeFirstMarriage
 * @property {string} fatherName
 * @property {YesNo} deceased
 * @property {YesNo} adopted
 */

/**
 * Step 3 - relationship and purpose.
 * @typedef {Object} PurposeSection
 * @property {Relationship} relationship
 * @property {Purpose} purpose
 * @property {YesNo} needsApostille
 * @property {string} apostilleCountry
 */

/**
 * Step 4 - the order.
 * @typedef {Object} Order
 * @property {CertificateType} certificateType
 * @property {number | null} copies
 * @property {DeliveryMethod} deliveryMethod
 * @property {number | null} feeEnclosedUsd
 */

/**
 * Step 5 - identity and supporting documents.
 * @typedef {Object} Evidence
 * @property {IdType} idType
 * @property {YesNo} idUnexpired
 * @property {YesNo} proofOfRelationship
 * @property {YesNo} authorityDocument
 * @property {YesNo} notarizedSwornStatement
 */

/**
 * Step 6 - declaration.
 * @typedef {Object} Declaration
 * @property {YesNo} declarationSigned
 * @property {string} applicationNote
 */

/**
 * @typedef {Object} BirthCertificateApplication
 * @property {Applicant} applicant
 * @property {Registrant} registrant
 * @property {PurposeSection} purpose
 * @property {Order} order
 * @property {Evidence} evidence
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
 * @typedef {Object} ValidationResult
 * @property {ApplicationClass} applicationClass
 * @property {number | null} expectedFeeUsd
 * @property {'state' | 'default'} stateRuleApplied
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

/**
 * Build a fresh, fully-blank application.
 * Text / enum fields default to `''`; numeric, date, and time fields to `null`.
 * @returns {BirthCertificateApplication}
 */
function emptyApplication() {
  return {
    applicant: {
      applicantName: '',
      dateOfBirth: null,
      email: '',
      phone: '',
      postalAddress: ''
    },
    registrant: {
      registrantName: '',
      sex: '',
      dateOfBirth: null,
      placeOfBirth: '',
      countyOfBirth: '',
      state: '',
      birthFacility: '',
      motherNameBeforeFirstMarriage: '',
      fatherName: '',
      deceased: '',
      adopted: ''
    },
    purpose: {
      relationship: '',
      purpose: '',
      needsApostille: '',
      apostilleCountry: ''
    },
    order: {
      certificateType: '',
      copies: null,
      deliveryMethod: '',
      feeEnclosedUsd: null
    },
    evidence: {
      idType: '',
      idUnexpired: '',
      proofOfRelationship: '',
      authorityDocument: '',
      notarizedSwornStatement: ''
    },
    declaration: {
      declarationSigned: '',
      applicationNote: ''
    }
  };
}

const LABELS = {
  applicationClass: {
    'ready-to-submit': 'Ready to submit',
    'incomplete': 'Incomplete',
    'ineligible-requester': 'Ineligible requester'
  },
  sex: { female: 'Female', male: 'Male', other: 'Other', unknown: 'Unknown' },
  relationship: {
    'self': 'Myself (the person named)',
    'parent': 'Parent named on the certificate',
    'legal-guardian': 'Legal guardian',
    'legal-representative': 'Legal representative (attorney)',
    'spouse': 'Spouse',
    'child': 'Adult child',
    'sibling': 'Sibling',
    'grandparent': 'Grandparent',
    'grandchild': 'Grandchild',
    'government-agency': 'Government agency',
    'other': 'Other (no direct relationship)'
  },
  purpose: {
    'passport': 'US passport',
    'real-id': 'REAL ID driver license',
    'school': 'School enrollment',
    'employment': 'Employment',
    'benefits': 'Benefits or Social Security',
    'genealogy': 'Genealogy or family history',
    'foreign-use': 'Use in another country',
    'other': 'Other'
  },
  certificateType: {
    'certified-long-form': 'Certified long form (full image of the record)',
    'certified-short-form': 'Certified short form (abstract)',
    'informational': 'Informational copy (not valid for identity)'
  },
  deliveryMethod: { 'online': 'Online', 'mail': 'By mail', 'in-person': 'In person' },
  idType: {
    'state-driver-license': 'State driver license',
    'state-id-card': 'State identification card',
    'us-passport': 'US passport',
    'military-id': 'Military ID',
    'other-photo-id': 'Other government photo ID',
    'none': 'No photo ID'
  }
};

const label = (group) => (value) => (LABELS[group] && LABELS[group][value]) || '';
const applicationClassLabel = label('applicationClass');
const sexLabel = label('sex');
const relationshipLabel = label('relationship');
const purposeLabel = label('purpose');
const certificateTypeLabel = label('certificateType');
const deliveryMethodLabel = label('deliveryMethod');
const idTypeLabel = label('idType');

/** CSS class hint for the class badge (reuses the risk palette). */
function applicationClassClass(cls) {
  switch (cls) {
    case 'ready-to-submit': return 'risk-low';
    case 'incomplete': return 'risk-moderate';
    case 'ineligible-requester': return 'risk-high';
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

export { emptyApplication, applicationClassLabel, applicationClassClass, sexLabel, relationshipLabel, purposeLabel, certificateTypeLabel, deliveryMethodLabel, idTypeLabel, yesNoLabel, priorityLabel };
