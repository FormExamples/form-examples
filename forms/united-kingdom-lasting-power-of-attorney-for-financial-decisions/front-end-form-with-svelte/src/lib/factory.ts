import type { Address, Lpa, Person } from './types.js';

let personCounter = 0;
function nextId(prefix: string): string {
  personCounter += 1;
  return `${prefix}-${personCounter.toString(36)}`;
}

export function createEmptyAddress(): Address {
  return {
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    postcode: '',
    countryAsIso3166_1Alpha2: 'GB',
  };
}

export function createEmptyPerson(): Person {
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
    hasDebtReliefOrder: false,
  };
}

export function createEmptyLpa(): Lpa {
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
      replacementStepInOverflowText: '',
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
      paymentAmount: null,
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
      otherPostcode: '',
    },
    opgReferenceNumber: '',
    opgRegistrationDate: '',
    status: 'draft',
    signedDate: '',
  };
}
