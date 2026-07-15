// Plain-JavaScript / JSDoc type definitions and factory for the UK Lasting
// Power of Attorney for Financial Decisions (LP1F) form.
//
// Builds the canonical empty `Lpa` shape (one-to-one with the SQL migrations
// and the SvelteKit `src/lib/types.ts` model) so newly-added fields default
// correctly when older saved state is rehydrated from localStorage. Property
// names are camelCase to match the front-end serde / examples convention.
// Conventions:
//   - empty string '' for unanswered text / enum fields
//   - null for unanswered numeric fields; '' for unanswered dates
//   - boolean flags default to false
//   - UUID-style string ids where the SvelteKit factory uses them
//
// Wrapped in an IIFE; published via `window.UkLpaFinancialDecisions`.

let personCounter = 0;
/** Stable-ish incrementing id (mirrors the SvelteKit factory nextId). */
function nextId(prefix) {
  personCounter += 1;
  return `${prefix}-${personCounter.toString(36)}`;
}

/** Build a fresh, fully-blank address. Country defaults to GB. */
function createEmptyAddress() {
  return {
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    postcode: '',
    countryAsIso3166_1Alpha2: 'GB'
  };
}

/** Build a fresh, fully-blank person record. */
function createEmptyPerson() {
  return {
    id: nextId('person'),
    title: '',
    firstNames: '',
    lastName: '',
    otherNames: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    address: createEmptyAddress(),
    isTrustCorporation: false,
    trustCorporationNumber: '',
    isBankrupt: false,
    hasDebtReliefOrder: false
  };
}

/** Build a fresh certificate-provider record. */
function createEmptyCertificateProvider() {
  return {
    person: createEmptyPerson(),
    knowsDonorAs: '',
    isOverEighteen: false,
    readLpa: false,
    noRestrictionsOnActing: false,
    isRelatedToDonorOrAttorney: false,
    isCareHomeOwnerOrEmployee: false,
    eligibilityConfirmationAt: ''
  };
}

/**
 * Build a fresh, fully-blank LP1F LPA with all fields at their unanswered
 * defaults. Mirrors `createEmptyLpa()` in the SvelteKit factory.
 */
function emptyLpa() {
  return {
    id: nextId('lpa'),
    donor: createEmptyPerson(),
    attorneys: [],
    replacementAttorneys: [],
    decisionMode: '',
    decisionModeMixedText: '',
    whenAttorneysCanAct: '',
    certificateProvider: null,
    peopleToNotify: [],
    preferencesText: '',
    instructionsText: '',
    preferencesAndInstructionsOverflow: {
      preferencesOverflowText: '',
      instructionsOverflowText: '',
      decisionsJointlyOverflowText: '',
      replacementStepInOverflowText: ''
    },
    legalRightsAcknowledged: false,
    signatures: [],
    continuationSheets: [],
    registrationApplication: {
      applicantKind: '',
      paymentMethod: '',
      cardPaymentPhone: '',
      reducedFeeRequested: false,
      hasLpa120aEvidence: false,
      isRepeatApplication: false,
      repeatCaseNumber: '',
      paymentReference: '',
      paymentDate: '',
      paymentAmount: null
    },
    registrationRecipient: {
      recipientKind: '',
      recipientPersonId: '',
      companyName: '',
      prefersPost: false,
      prefersPhone: false,
      prefersEmail: false,
      prefersWelsh: false,
      contactPhone: '',
      contactEmail: '',
      otherFirstNames: '',
      otherLastName: '',
      otherAddressLine1: '',
      otherAddressLine2: '',
      otherAddressLine3: '',
      otherPostcode: ''
    },
    opgReferenceNumber: '',
    opgRegistrationDate: '',
    status: 'draft',
    signedDate: ''
  };
}

// ----------------------------------------------------------------------
// Human-readable label helpers (port of validator/labels.ts)
// ----------------------------------------------------------------------

/** Human-readable label for an LP1F decision mode. */
function decisionModeLabel(mode) {
  switch (mode) {
    case 'single_attorney':       return 'Single attorney';
    case 'jointly_and_severally': return 'Jointly and severally';
    case 'jointly':               return 'Jointly';
    case 'mixed':                 return 'Mixed';
    default:                      return '—';
  }
}

/** Human-readable label for the when-attorneys-can-act choice. */
function whenAttorneysCanActLabel(when) {
  switch (when) {
    case 'as_soon_as_registered': return 'As soon as registered';
    case 'only_when_no_capacity': return 'Only when no capacity';
    default:                      return '—';
  }
}

/** Title-case a snake_case validity band or OPG status. */
function bandLabel(band) {
  if (!band) return '—';
  return String(band)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Human-readable composite-risk label. */
function compositeRiskLabel(risk) {
  switch (risk) {
    case 'low':      return 'Low';
    case 'moderate': return 'Moderate';
    case 'high':     return 'High';
    case 'critical': return 'Critical';
    default:         return '—';
  }
}

export { nextId, createEmptyAddress, createEmptyPerson, createEmptyCertificateProvider, emptyLpa, decisionModeLabel, whenAttorneysCanActLabel, bandLabel, compositeRiskLabel };
