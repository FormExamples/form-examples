// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the United Kingdom Birth
// Registration form (register a birth in England and Wales and order the
// birth certificate).
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_united_kingdom_birth_registration.sql`. This file builds
// and exports the canonical empty BirthRegistration shape used by the wizard, so
// newly-added fields default correctly when older saved state is rehydrated
// from localStorage. It also exports display helpers (enum labels and
// readiness-class / CSS-class hints).
//
// This is an ADMINISTRATIVE completeness-and-validity instrument, not a
// clinical score and NOT a substitute for the registrar's statutory
// judgement. The engine checks that the application is complete, internally
// consistent and supported by the evidence GOV.UK asks for, and classifies it
// as `ready-to-submit` / `incomplete` / `needs-additional-evidence` /
// `out-of-scope`. The register entry made by the registrar remains the legal
// record.

/**
 * @typedef {'female' | 'male' | 'indeterminate' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'hospital' | 'home' | 'birth-centre' | 'other' | ''} PlaceOfBirthType
 * @typedef {'england' | 'wales' | 'scotland' | 'northern-ireland' | 'abroad' | ''} BirthCountry
 * @typedef {'single' | 'twins' | 'triplets-or-more' | ''} MultipleBirth
 * @typedef {'married-or-civil-partners' | 'unmarried' | 'female-couple-married' | 'female-couple-unmarried' | 'male-couple' | 'mother-only' | ''} ParentsRelationship
 * @typedef {'married-or-civil-partners' | 'joint-registration' | 'statutory-declaration' | 'court-order-parental-responsibility' | 'parental-order' | 'none' | ''} PaternityBasis
 * @typedef {'mother' | 'father' | 'second-parent' | 'both-parents' | 'person-present-at-birth' | 'person-responsible-for-child' | 'hospital-administrator' | 'other' | ''} InformantRelationship
 * @typedef {'local-register-office' | 'hospital' | 'other-register-office' | ''} RegistrationRoute
 * @typedef {'passport' | 'uk-photocard-driving-licence' | 'eu-photocard-driving-licence' | 'uk-birth-or-adoption-certificate' | 'biometric-immigration-document' | 'uk-travel-document' | 'refugee-or-stateless-travel-document' | 'eu-identity-card' | 'proof-of-age-card' | 'none' | ''} IdentityPrimaryDocument
 * @typedef {'standard' | 'priority' | ''} ServiceLevel
 * @typedef {'ready-to-submit' | 'incomplete' | 'needs-additional-evidence' | 'out-of-scope'} ReadinessClass
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 -- the child.
 * @typedef {Object} Child
 * @property {string} childForenames
 * @property {string} childSurname
 * @property {Sex} sex
 * @property {string | null} dateOfBirth      - ISO date; null when unset
 * @property {string | null} timeOfBirth      - HH:MM; null when unset
 * @property {PlaceOfBirthType} placeOfBirthType
 * @property {string} placeOfBirth
 * @property {BirthCountry} birthCountry
 * @property {MultipleBirth} multipleBirth
 * @property {YesNo} stillbirth
 */

/**
 * Step 2 -- the mother.
 * @typedef {Object} Mother
 * @property {string} motherName
 * @property {string} motherMaidenSurname
 * @property {string | null} motherDateOfBirth
 * @property {string} motherPlaceOfBirth
 * @property {string} motherOccupation
 * @property {string} motherAddress
 */

/**
 * Step 3 -- parentage and the second parent.
 * @typedef {Object} Parentage
 * @property {ParentsRelationship} parentsRelationship
 * @property {string | null} marriageDate
 * @property {YesNo} secondParentIncluded
 * @property {string} secondParentName
 * @property {string | null} secondParentDateOfBirth
 * @property {string} secondParentPlaceOfBirth
 * @property {string} secondParentOccupation
 * @property {PaternityBasis} paternityBasis
 * @property {YesNo} paternityEvidenceHeld
 * @property {YesNo} licensedClinicTreatment
 */

/**
 * Step 4 -- the informant, registration and identity evidence.
 * @typedef {Object} Informant
 * @property {InformantRelationship} informantRelationship
 * @property {string} informantName
 * @property {YesNo} parentsUnableToRegister
 * @property {RegistrationRoute} registrationRoute
 * @property {string | null} registrationDate
 * @property {IdentityPrimaryDocument} identityPrimaryDocument
 * @property {number | null} identitySecondaryCount
 * @property {YesNo} identityOriginals
 * @property {YesNo} redBookPresented
 */

/**
 * Step 5 -- the certificate order.
 * @typedef {Object} CertificateOrder
 * @property {number | null} certificatesRequested
 * @property {ServiceLevel} serviceLevel
 * @property {string} deliveryAddress
 * @property {YesNo} paymentConfirmed
 * @property {string} applicantNote
 */

/**
 * @typedef {Object} BirthRegistration
 * @property {Child} child
 * @property {Mother} mother
 * @property {Parentage} parentage
 * @property {Informant} informant
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
 * @property {ReadinessClass} readinessClass
 * @property {number | null} daysSinceBirth
 * @property {'yes' | 'no' | ''} lateRegistration
 * @property {number} missingItemCount
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

/**
 * Build a fresh, fully-blank application.
 * Text / enum fields default to `''`; numeric, date, and time fields to `null`.
 * @returns {BirthRegistration}
 */
function emptyRegistration() {
  return {
    child: {
      childForenames: '',
      childSurname: '',
      sex: '',
      dateOfBirth: null,
      timeOfBirth: null,
      placeOfBirthType: '',
      placeOfBirth: '',
      birthCountry: '',
      multipleBirth: '',
      stillbirth: ''
    },
    mother: {
      motherName: '',
      motherMaidenSurname: '',
      motherDateOfBirth: null,
      motherPlaceOfBirth: '',
      motherOccupation: '',
      motherAddress: ''
    },
    parentage: {
      parentsRelationship: '',
      marriageDate: null,
      secondParentIncluded: '',
      secondParentName: '',
      secondParentDateOfBirth: null,
      secondParentPlaceOfBirth: '',
      secondParentOccupation: '',
      paternityBasis: '',
      paternityEvidenceHeld: '',
      licensedClinicTreatment: ''
    },
    informant: {
      informantRelationship: '',
      informantName: '',
      parentsUnableToRegister: '',
      registrationRoute: '',
      registrationDate: null,
      identityPrimaryDocument: '',
      identitySecondaryCount: null,
      identityOriginals: '',
      redBookPresented: ''
    },
    certificate: {
      certificatesRequested: null,
      serviceLevel: '',
      deliveryAddress: '',
      paymentConfirmed: '',
      applicantNote: ''
    }
  };
}

/** Readiness-class label for display. */
function readinessClassLabel(cls) {
  switch (cls) {
    case 'ready-to-submit': return 'Ready to submit';
    case 'incomplete': return 'Incomplete';
    case 'needs-additional-evidence': return 'Needs additional evidence';
    case 'out-of-scope': return 'Out of scope';
    default: return '';
  }
}

/** CSS class hint for the readiness badge (reuses the risk palette). */
function readinessClassClass(cls) {
  switch (cls) {
    case 'ready-to-submit': return 'risk-low';
    case 'incomplete': return 'risk-moderate';
    case 'needs-additional-evidence': return 'risk-high';
    case 'out-of-scope': return 'risk-high';
    default: return '';
  }
}

/** Sex label. */
function sexLabel(value) {
  switch (value) {
    case 'female': return 'Female';
    case 'male': return 'Male';
    case 'indeterminate': return 'Indeterminate';
    default: return '';
  }
}

/** Birth-country label. */
function birthCountryLabel(value) {
  switch (value) {
    case 'england': return 'England';
    case 'wales': return 'Wales';
    case 'scotland': return 'Scotland';
    case 'northern-ireland': return 'Northern Ireland';
    case 'abroad': return 'Outside the United Kingdom';
    default: return '';
  }
}

/** Parents-relationship label. */
function parentsRelationshipLabel(value) {
  switch (value) {
    case 'married-or-civil-partners': return 'Married or civil partners (at the birth or conception)';
    case 'unmarried': return 'Not married or civil partners (mother and father)';
    case 'female-couple-married': return 'Female couple, married or civil partners';
    case 'female-couple-unmarried': return 'Female couple, not married or civil partners';
    case 'male-couple': return 'Male couple';
    case 'mother-only': return 'Mother only (no second parent)';
    default: return '';
  }
}

/** Paternity-basis label. */
function paternityBasisLabel(value) {
  switch (value) {
    case 'married-or-civil-partners': return 'Parents married or civil partners';
    case 'joint-registration': return 'Both parents register together';
    case 'statutory-declaration': return 'Signed statutory declaration of parentage';
    case 'court-order-parental-responsibility': return 'Court document giving parental responsibility';
    case 'parental-order': return 'Parental order from the court';
    case 'none': return 'None';
    default: return '';
  }
}

/** Informant-relationship label. */
function informantRelationshipLabel(value) {
  switch (value) {
    case 'mother': return 'Mother';
    case 'father': return 'Father';
    case 'second-parent': return 'Second parent (female parent)';
    case 'both-parents': return 'Both parents together';
    case 'person-present-at-birth': return 'Someone present at the birth';
    case 'person-responsible-for-child': return 'Someone responsible for the child';
    case 'hospital-administrator': return 'Hospital administrative staff';
    case 'other': return 'Other (for example a relative who was not present)';
    default: return '';
  }
}

/** Registration-route label. */
function registrationRouteLabel(value) {
  switch (value) {
    case 'local-register-office': return 'Local register office for the birth area';
    case 'hospital': return 'At the hospital before the mother leaves';
    case 'other-register-office': return 'Any other register office (details passed on)';
    default: return '';
  }
}

/** Identity-document label. */
function identityDocumentLabel(value) {
  switch (value) {
    case 'passport': return 'Passport (valid or expired)';
    case 'uk-photocard-driving-licence': return 'UK photocard driving licence';
    case 'eu-photocard-driving-licence': return 'EU photocard driving licence (full)';
    case 'uk-birth-or-adoption-certificate': return 'UK birth or adoption certificate';
    case 'biometric-immigration-document': return 'UK biometric immigration document';
    case 'uk-travel-document': return 'UK travel document (leave to enter or remain)';
    case 'refugee-or-stateless-travel-document': return 'Refugee or stateless person travel document';
    case 'eu-identity-card': return 'EU Member State identity card';
    case 'proof-of-age-card': return 'National Proof of Age Standards Scheme card';
    case 'none': return 'None of these';
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

export { emptyRegistration, readinessClassLabel, readinessClassClass, sexLabel, birthCountryLabel, parentsRelationshipLabel, paternityBasisLabel, informantRelationshipLabel, registrationRouteLabel, identityDocumentLabel, yesNoLabel, priorityLabel };
