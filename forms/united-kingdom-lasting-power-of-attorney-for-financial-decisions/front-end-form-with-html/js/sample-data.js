/* United Kingdom LPA for Financial Decisions — sample fixture for the
 * single-page wizard demo. The fixture matches the "clean deed" example
 * in doc/lpa-validation-rules.md (Example 4).
 */
(function () {
  'use strict';

  window.LpaSampleData = {
    donor: {
      title: 'Mrs',
      firstNames: 'Margaret Anne',
      lastName: 'Whitfield',
      otherNames: 'Maggie',
      dateOfBirth: '1948-06-12',
      email: 'margaret.whitfield@example.co.uk',
      phone: '020 7946 0123',
      addressLine1: '14 Linden Gardens',
      addressLine2: 'Notting Hill',
      addressLine3: 'London',
      postcode: 'W2 4HG',
      isTrustCorporation: false,
      trustCorporationNumber: '',
      isBankrupt: false,
      hasDebtReliefOrder: false
    },
    attorneys: [
      {
        title: 'Mr',
        firstNames: 'James Edward',
        lastName: 'Whitfield',
        otherNames: '',
        dateOfBirth: '1972-03-04',
        email: 'james.whitfield@example.co.uk',
        phone: '07700 900111',
        addressLine1: '47 Elm Park Avenue',
        addressLine2: '',
        addressLine3: 'Reading',
        postcode: 'RG4 7QH',
        isTrustCorporation: false,
        trustCorporationNumber: '',
        isBankrupt: false,
        hasDebtReliefOrder: false
      },
      {
        title: 'Dr',
        firstNames: 'Helen Marie',
        lastName: 'Whitfield-Brown',
        otherNames: '',
        dateOfBirth: '1975-11-21',
        email: 'helen.wb@example.co.uk',
        phone: '07700 900222',
        addressLine1: '8 Apsley Way',
        addressLine2: '',
        addressLine3: 'Bristol',
        postcode: 'BS9 3LJ',
        isTrustCorporation: false,
        trustCorporationNumber: '',
        isBankrupt: false,
        hasDebtReliefOrder: false
      }
    ],
    decisionMode: 'jointly_and_severally',
    decisionModeMixedText: '',
    hasContinuationSheet1: false,
    hasContinuationSheet2: false,
    hasContinuationSheet3: false,
    hasContinuationSheet4: false,
    replacementAttorneys: [
      {
        title: 'Mr',
        firstNames: 'Robert',
        lastName: 'Whitfield',
        otherNames: '',
        dateOfBirth: '1980-09-15',
        email: 'rob.w@example.co.uk',
        phone: '',
        addressLine1: '3 Hawthorne Close',
        addressLine2: '',
        addressLine3: 'Oxford',
        postcode: 'OX2 7HE',
        isTrustCorporation: false,
        trustCorporationNumber: '',
        isBankrupt: false,
        hasDebtReliefOrder: false
      }
    ],
    whenAttorneysCanAct: 'as_soon_as_registered',
    peopleToNotify: [
      {
        title: 'Mr',
        firstNames: 'David',
        lastName: 'Patel',
        addressLine1: '21 Maple Avenue',
        postcode: 'W2 5LP'
      },
      {
        title: 'Ms',
        firstNames: 'Susan',
        lastName: 'Cooper',
        addressLine1: '6 Beech Drive',
        postcode: 'OX3 0JD'
      }
    ],
    preferencesText: 'Please consult my children before any sale of the family home in Notting Hill, and keep my regular charitable direct debits running.',
    instructionsText: '',
    legalRightsAcknowledged: true,
    donorSignature: {
      present: true,
      signedAt: '2026-02-10',
      signedOnBehalf: false,
      capacityConfirmed: true,
      witness: {
        firstNames: 'Linda',
        lastName: 'Garcia',
        addressLine1: '12 Linden Gardens',
        postcode: 'W2 4HG',
        signedAt: '2026-02-10',
        signaturePresent: true
      }
    },
    certificateProvider: {
      title: 'Dr',
      firstNames: 'Anita',
      lastName: 'Khan',
      otherNames: '',
      dateOfBirth: '1965-04-19',
      email: 'a.khan@example.nhs.uk',
      phone: '020 7946 8000',
      addressLine1: 'Notting Hill Medical Practice',
      addressLine2: '88 Pembridge Villas',
      addressLine3: 'London',
      postcode: 'W11 3EP',
      isTrustCorporation: false,
      trustCorporationNumber: '',
      isBankrupt: false,
      hasDebtReliefOrder: false,
      knowsDonorAs: 'professional',
      isOverEighteen: true,
      readLpa: true,
      noRestrictionsOnActing: true,
      isCareHomeOwner: false,
      isRelatedToDonorOrAttorney: false,
      signature: { present: true, signedAt: '2026-02-12' }
    },
    attorneySignatures: [
      {
        present: true,
        signedAt: '2026-02-14',
        witness: {
          firstNames: 'Robert',
          lastName: 'Lim',
          addressLine1: '49 Elm Park Avenue',
          postcode: 'RG4 7QH',
          signedAt: '2026-02-14',
          signaturePresent: true
        }
      },
      {
        present: true,
        signedAt: '2026-02-14',
        witness: {
          firstNames: 'Priya',
          lastName: 'Shah',
          addressLine1: '10 Apsley Way',
          postcode: 'BS9 3LJ',
          signedAt: '2026-02-14',
          signaturePresent: true
        }
      }
    ],
    replacementSignatures: [],
    applicantKind: 'donor',
    applicants: [],
    recipientKind: 'donor',
    recipientCompanyName: '',
    recipientPersonIndex: null,
    prefersPost: true,
    prefersPhone: false,
    prefersEmail: true,
    prefersWelsh: false,
    prefersToBeContactedBy: 'email',
    contactPhone: '020 7946 0123',
    contactEmail: 'margaret.whitfield@example.co.uk',
    paymentMethod: 'card',
    cardPaymentPhone: '020 7946 0123',
    reducedFeeRequested: false,
    hasLpa120aEvidence: false,
    isRepeatApplication: false,
    repeatCaseNumber: '',
    registrationSignatures: [
      { present: true, signedAt: '2026-02-15' }
    ],
    status: 'ready_for_registration'
  };
})();
