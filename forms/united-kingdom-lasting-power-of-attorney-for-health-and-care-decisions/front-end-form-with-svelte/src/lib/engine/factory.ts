import type {
  Attorney,
  CertificateProvider,
  Donor,
  LpaApplication,
  PersonToNotify,
  RegistrationApplication,
  ReplacementAttorney,
} from './types.js';

export function emptyDonor(): Donor {
  return {
    title: '',
    givenNames: '',
    familyName: '',
    otherNamesUsed: '',
    birthDate: '',
    email: '',
    phone: '',
    postalAddressAsFullText: '',
    countryAsIso31661Alpha2: '',
    postcode: '',
    unitedKingdomNhsNumber: '',
    jurisdiction: '',
    preferredLanguage: '',
    capacityDeclared: '',
    capacityDeclaredAt: '',
  };
}

export function emptyAttorney(): Attorney {
  return {
    title: '',
    givenNames: '',
    familyName: '',
    birthDate: '',
    email: '',
    phone: '',
    postalAddressAsFullText: '',
    countryAsIso31661Alpha2: '',
    postcode: '',
    relationshipToDonor: '',
    isBankrupt: '',
    capacityDeclared: '',
  };
}

export function emptyReplacementAttorney(): ReplacementAttorney {
  return {
    ...emptyAttorney(),
    replacementTrigger: '',
  };
}

export function emptyCertificateProvider(): CertificateProvider {
  return {
    title: '',
    givenNames: '',
    familyName: '',
    email: '',
    phone: '',
    postalAddressAsFullText: '',
    countryAsIso31661Alpha2: '',
    postcode: '',
    route: '',
    profession: '',
    professionRegistrationNumber: '',
    yearsKnownDonor: null,
    relationshipToDonor: '',
    declaredNotFamily: '',
    declaredNotEmployee: '',
    declaredNotAttorney: '',
  };
}

export function emptyPersonToNotify(): PersonToNotify {
  return {
    title: '',
    givenNames: '',
    familyName: '',
    email: '',
    phone: '',
    postalAddressAsFullText: '',
    countryAsIso31661Alpha2: '',
    postcode: '',
    relationshipToDonor: '',
  };
}

export function emptyRegistrationApplication(): RegistrationApplication {
  return {
    applicantRole: '',
    applicantSignedAt: '',
    feeAmountPounds: 0,
    feeRemission: '',
    feeRemissionReason: '',
    submittedAt: '',
    submissionChannel: '',
  };
}

export function emptyLpaApplication(): LpaApplication {
  return {
    formVersion: 'LP1H-2024',
    jurisdiction: '',
    donor: emptyDonor(),
    attorneys: [],
    replacementAttorneys: [],
    certificateProvider: null,
    peopleToNotify: [],
    decisionRule: '',
    jointDecisionSet: '',
    lstChoice: '',
    lstDonorInitialled: '',
    preferences: [],
    instructions: [],
    signatures: [],
    registration: emptyRegistrationApplication(),
  };
}
