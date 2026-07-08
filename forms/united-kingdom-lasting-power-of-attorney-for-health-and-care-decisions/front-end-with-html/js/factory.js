// Factory helpers for building empty engine inputs.

(function () {
'use strict';
window.UkLpaForm = window.UkLpaForm || {};

function emptyDonor() {
  return {
    title: '', givenNames: '', familyName: '', otherNamesUsed: '',
    birthDate: '', email: '', phone: '',
    postalAddressAsFullText: '', countryAsIso31661Alpha2: '', postcode: '',
    unitedKingdomNhsNumber: '', jurisdiction: '', preferredLanguage: '',
    capacityDeclared: '', capacityDeclaredAt: '',
  };
}

function emptyAttorney() {
  return {
    title: '', givenNames: '', familyName: '', birthDate: '',
    email: '', phone: '',
    postalAddressAsFullText: '', countryAsIso31661Alpha2: '', postcode: '',
    relationshipToDonor: '', isBankrupt: '', capacityDeclared: '',
  };
}

function emptyReplacementAttorney() {
  return Object.assign(emptyAttorney(), { replacementTrigger: '' });
}

function emptyCertificateProvider() {
  return {
    title: '', givenNames: '', familyName: '',
    email: '', phone: '',
    postalAddressAsFullText: '', countryAsIso31661Alpha2: '', postcode: '',
    route: '', profession: '', professionRegistrationNumber: '',
    yearsKnownDonor: null, relationshipToDonor: '',
    declaredNotFamily: '', declaredNotEmployee: '', declaredNotAttorney: '',
  };
}

function emptyPersonToNotify() {
  return {
    title: '', givenNames: '', familyName: '',
    email: '', phone: '',
    postalAddressAsFullText: '', countryAsIso31661Alpha2: '', postcode: '',
    relationshipToDonor: '',
  };
}

function emptyRegistrationApplication() {
  return {
    applicantRole: '', applicantSignedAt: '',
    feeAmountPounds: 0, feeRemission: '', feeRemissionReason: '',
    submittedAt: '', submissionChannel: '',
  };
}

function emptyLpaApplication() {
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

Object.assign(window.UkLpaForm, {
  emptyDonor, emptyAttorney, emptyReplacementAttorney,
  emptyCertificateProvider, emptyPersonToNotify,
  emptyRegistrationApplication, emptyLpaApplication,
});
})();
