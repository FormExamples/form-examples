// Fixture LPAs covering a range of registration-readiness states, decision
// modes, and validation outcomes. The donor names are common UK names; the
// addresses, postcodes, and OPG reference numbers are fictional. These are
// used by the dashboard whenever the backend API is unreachable.

import type {
  Address,
  AdditionalFlag,
  Attorney,
  CertificateProvider,
  ContinuationSheet,
  FiredRule,
  Lpa,
  Person,
  PersonToNotify,
  ReplacementAttorney,
  Signature,
  ValidationResult,
} from './types.js';

function address(line1: string, line2: string, postcode: string): Address {
  return {
    addressLine1: line1,
    addressLine2: line2,
    addressLine3: '',
    postcode,
    countryAsIso3166_1Alpha2: 'GB',
  };
}

function person(
  id: string,
  title: string,
  firstNames: string,
  lastName: string,
  dateOfBirth: string,
  addr: Address,
  email = '',
  phone = '',
): Person {
  return {
    id,
    title,
    firstNames,
    lastName,
    otherNames: '',
    dateOfBirth,
    email,
    phone,
    address: addr,
    isTrustCorporation: false,
    trustCorporationNumber: '',
    isBankrupt: false,
    hasDebtReliefOrder: false,
  };
}

function emptyValidation(band: ValidationResult['validityBand']): ValidationResult {
  return {
    validityBand: band,
    compositeRisk: 'low',
    firedRules: [],
    additionalFlags: [],
  };
}

function emptyContinuationSheets(): ContinuationSheet[] {
  return [];
}

function emptyCertificateProvider(p: Person, knowsAs: 'friend' | 'professional'): CertificateProvider {
  return {
    person: p,
    knowsDonorAs: knowsAs,
    isOverEighteen: true,
    readLpa: true,
    noRestrictionsOnActing: true,
    isRelatedToDonorOrAttorney: false,
    isCareHomeOwnerOrEmployee: false,
    eligibilityConfirmationAt: '',
  };
}

function baseLpa(id: string, donor: Person, createdAt: string): Lpa {
  return {
    id,
    donor,
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
    continuationSheets: emptyContinuationSheets(),
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
    validation: emptyValidation('draft'),
    createdAt,
  };
}

// 1. Fresh draft — only the donor entered.
const donor1 = person(
  'p-1-donor',
  'Mrs',
  'Margaret',
  'Thompson',
  '1948-07-12',
  address('14 Cherrywood Lane', 'Wokingham', 'RG40 2AA'),
  'margaret.thompson@example.co.uk',
  '0118 555 0142',
);
const lpa1: Lpa = {
  ...baseLpa('lpa-0001', donor1, '2026-05-10T09:00:00Z'),
  status: 'draft',
  validation: {
    validityBand: 'draft',
    compositeRisk: 'low',
    firedRules: [],
    additionalFlags: [],
  },
};

// 2. Single-attorney LPA with no replacement attorney and no people to notify
// — fires SingleAttorneyNoReplacement + NoPeopleToNotify flags.
const donor2 = person(
  'p-2-donor',
  'Mr',
  'David',
  'Walker',
  '1955-03-04',
  address('27 Beechfield Road', 'Manchester', 'M14 7HQ'),
  'david.walker@example.co.uk',
);
const att2: Attorney = {
  ordinal: 1,
  person: person(
    'p-2-att-1',
    'Mrs',
    'Susan',
    'Walker',
    '1958-11-30',
    address('27 Beechfield Road', 'Manchester', 'M14 7HQ'),
    'susan.walker@example.co.uk',
  ),
};
const flagsLpa2: AdditionalFlag[] = [
  {
    ruleId: 'SingleAttorneyNoReplacement',
    priority: 'moderate',
    citation: 'OPG guidance LP12 §B2',
    fieldPath: 'replacementAttorneys',
    message: 'Only one attorney is appointed and no replacement attorney is named.',
    remediation: 'Consider adding a replacement attorney so the LPA does not fail if the attorney loses capacity.',
  },
  {
    ruleId: 'NoPeopleToNotify',
    priority: 'low',
    citation: 'OPG guidance LP12 §B3',
    fieldPath: 'peopleToNotify',
    message: 'No people-to-notify have been chosen.',
    remediation: 'Adding 1–5 people to notify gives an external safeguarding signal at registration.',
  },
];
const lpa2: Lpa = {
  ...baseLpa('lpa-0002', donor2, '2026-04-22T14:21:00Z'),
  attorneys: [att2],
  decisionMode: 'single_attorney',
  whenAttorneysCanAct: 'as_soon_as_registered',
  certificateProvider: emptyCertificateProvider(
    person(
      'p-2-cp',
      'Dr',
      'Helen',
      'Rashid',
      '1972-02-19',
      address('5 Wilmslow Road', 'Manchester', 'M20 4QF'),
      'helen.rashid@example.nhs.uk',
    ),
    'professional',
  ),
  legalRightsAcknowledged: true,
  status: 'ready_for_signing',
  validation: {
    validityBand: 'ready_for_signing',
    compositeRisk: 'moderate',
    firedRules: [],
    additionalFlags: flagsLpa2,
  },
};

// 3. Fully signed pending registration, jointly and severally, two attorneys
// plus a replacement, three people to notify.
const donor3 = person(
  'p-3-donor',
  'Mr',
  'James',
  'Pemberton',
  '1942-09-21',
  address('42 Ashwood Close', 'Bristol', 'BS9 3RP'),
  'james.pemberton@example.co.uk',
);
const att3a: Attorney = {
  ordinal: 1,
  person: person(
    'p-3-att-1',
    'Ms',
    'Charlotte',
    'Pemberton',
    '1971-06-04',
    address('8 Linden Avenue', 'Bath', 'BA2 5DU'),
    'charlotte.pemberton@example.co.uk',
  ),
};
const att3b: Attorney = {
  ordinal: 2,
  person: person(
    'p-3-att-2',
    'Mr',
    'Edward',
    'Pemberton',
    '1973-12-15',
    address('11 Granville Terrace', 'Bristol', 'BS6 7AB'),
    'edward.pemberton@example.co.uk',
  ),
};
const rep3: ReplacementAttorney = {
  ordinal: 1,
  replacementStepInCondition: '',
  person: person(
    'p-3-rep-1',
    'Mrs',
    'Patricia',
    'Holloway',
    '1969-03-22',
    address('3 Stoke Park Road', 'Bristol', 'BS9 1JS'),
    'patricia.holloway@example.co.uk',
  ),
};
const ptn3 = (n: number, first: string, last: string, addr: Address): PersonToNotify => ({
  ordinal: n,
  person: person(`p-3-ptn-${n}`, '', first, last, '', addr),
});
const lpa3: Lpa = {
  ...baseLpa('lpa-0003', donor3, '2026-03-15T11:05:00Z'),
  attorneys: [att3a, att3b],
  replacementAttorneys: [rep3],
  decisionMode: 'jointly_and_severally',
  whenAttorneysCanAct: 'as_soon_as_registered',
  certificateProvider: emptyCertificateProvider(
    person(
      'p-3-cp',
      'Mr',
      'Andrew',
      'Sheridan',
      '1965-08-10',
      address('19 Whiteladies Road', 'Bristol', 'BS8 2LS'),
      'andrew.sheridan@example.co.uk',
    ),
    'professional',
  ),
  peopleToNotify: [
    ptn3(1, 'Robert', 'Pemberton', address('22 Brook Lane', 'Bristol', 'BS6 5DR')),
    ptn3(2, 'Eleanor', 'Pemberton', address('4 Oakfield Place', 'Bath', 'BA1 6PD')),
    ptn3(3, 'Michael', 'Carter', address('60 Park View', 'Bristol', 'BS7 9NG')),
  ],
  preferencesText:
    'I would prefer my attorneys to consult with each other before any single transaction over £5,000.',
  instructionsText: '',
  legalRightsAcknowledged: true,
  status: 'fully_signed',
  signedDate: '2026-04-10',
  validation: {
    validityBand: 'fully_signed',
    compositeRisk: 'low',
    firedRules: [],
    additionalFlags: [],
  },
};

// 4. Registered LPA — OPG reference number assigned, status registered.
const donor4 = person(
  'p-4-donor',
  'Mrs',
  'Joan',
  'Patel',
  '1944-12-03',
  address('18 Hollybush Drive', 'Leicester', 'LE5 6QJ'),
  'joan.patel@example.co.uk',
);
const att4a: Attorney = {
  ordinal: 1,
  person: person(
    'p-4-att-1',
    'Mr',
    'Raj',
    'Patel',
    '1970-04-18',
    address('18 Hollybush Drive', 'Leicester', 'LE5 6QJ'),
    'raj.patel@example.co.uk',
  ),
};
const att4b: Attorney = {
  ordinal: 2,
  person: person(
    'p-4-att-2',
    'Mrs',
    'Anita',
    'Singh',
    '1972-09-12',
    address('5 Knighton Park Road', 'Leicester', 'LE2 3JG'),
    'anita.singh@example.co.uk',
  ),
};
const lpa4: Lpa = {
  ...baseLpa('lpa-0004', donor4, '2026-01-08T08:42:00Z'),
  attorneys: [att4a, att4b],
  decisionMode: 'jointly_and_severally',
  whenAttorneysCanAct: 'as_soon_as_registered',
  certificateProvider: emptyCertificateProvider(
    person(
      'p-4-cp',
      'Mr',
      'Geoffrey',
      'Bell',
      '1963-06-29',
      address('14 Loseby Lane', 'Leicester', 'LE1 5DR'),
    ),
    'friend',
  ),
  legalRightsAcknowledged: true,
  status: 'registered',
  signedDate: '2026-02-02',
  opgReferenceNumber: 'OPG-2026-77412189',
  opgRegistrationDate: '2026-03-20',
  validation: {
    validityBand: 'registered',
    compositeRisk: 'low',
    firedRules: [],
    additionalFlags: [],
  },
};

// 5. Triggered blocker — attorney under 18 (AttorneyUnderEighteen).
const donor5 = person(
  'p-5-donor',
  'Mr',
  'Peter',
  'Llewellyn',
  '1952-05-14',
  address('9 Castle Street', 'Cardiff', 'CF10 1BS'),
  'peter.llewellyn@example.co.uk',
);
const att5: Attorney = {
  ordinal: 1,
  person: person(
    'p-5-att-1',
    'Miss',
    'Rhian',
    'Llewellyn',
    '2010-08-04', // age 15 at signing — blocker
    address('9 Castle Street', 'Cardiff', 'CF10 1BS'),
  ),
};
const blocker5: FiredRule = {
  ruleId: 'AttorneyUnderEighteen',
  priority: 'critical',
  citation: 'Mental Capacity Act 2005 s. 10(1)(a)',
  fieldPath: 'attorneys[0].person.dateOfBirth',
  message: 'Attorney 1 is under 18 at the proposed signing date.',
  remediation: 'Replace with an attorney aged 18 or over before signing.',
};
const lpa5: Lpa = {
  ...baseLpa('lpa-0005', donor5, '2026-05-01T16:30:00Z'),
  attorneys: [att5],
  decisionMode: 'single_attorney',
  whenAttorneysCanAct: 'as_soon_as_registered',
  status: 'draft',
  validation: {
    validityBand: 'draft',
    compositeRisk: 'critical',
    firedRules: [blocker5],
    additionalFlags: [
      {
        ruleId: 'SingleAttorneyNoReplacement',
        priority: 'moderate',
        citation: 'OPG guidance LP12 §B2',
        fieldPath: 'replacementAttorneys',
        message: 'Only one attorney is appointed and no replacement attorney is named.',
        remediation: 'Add a replacement attorney.',
      },
    ],
  },
};

// 6. Partially signed — donor signed but certificate provider has not.
const donor6 = person(
  'p-6-donor',
  'Mr',
  'Henry',
  'Ashworth',
  '1950-10-08',
  address('33 Park Crescent', 'Sheffield', 'S10 2DG'),
  'henry.ashworth@example.co.uk',
);
const att6: Attorney = {
  ordinal: 1,
  person: person(
    'p-6-att-1',
    'Ms',
    'Olivia',
    'Ashworth',
    '1978-02-27',
    address('11 Endcliffe Vale Road', 'Sheffield', 'S10 3EW'),
    'olivia.ashworth@example.co.uk',
  ),
};
const rep6: ReplacementAttorney = {
  ordinal: 1,
  replacementStepInCondition: '',
  person: person(
    'p-6-rep-1',
    'Mr',
    'Thomas',
    'Ashworth',
    '1980-07-19',
    address('18 Crookes Road', 'Sheffield', 'S10 5BD'),
    'thomas.ashworth@example.co.uk',
  ),
};
const donorSig6: Signature = {
  id: 'sig-6-donor',
  signatoryPersonId: 'p-6-donor',
  role: 'donor',
  lp1fSection: 9,
  signatureBlobPath: '/blobs/sig-6-donor.png',
  signedOn: '2026-05-05',
  signedOnBehalfFullName: '',
  isWitnessed: true,
  witness: {
    person: person(
      'p-6-witness-donor',
      '',
      'Caroline',
      'Whitfield',
      '',
      address('12 Hangingwater Road', 'Sheffield', 'S11 7ES'),
    ),
    witnessSignatureBlobPath: '/blobs/sig-6-witness-donor.png',
    witnessedOn: '2026-05-05',
  },
};
const lpa6: Lpa = {
  ...baseLpa('lpa-0006', donor6, '2026-04-12T13:14:00Z'),
  attorneys: [att6],
  replacementAttorneys: [rep6],
  decisionMode: 'single_attorney',
  whenAttorneysCanAct: 'only_when_no_capacity',
  certificateProvider: emptyCertificateProvider(
    person(
      'p-6-cp',
      'Dr',
      'Marcus',
      'Holland',
      '1968-04-22',
      address('5 Glossop Road', 'Sheffield', 'S10 2GW'),
      'marcus.holland@example.nhs.uk',
    ),
    'professional',
  ),
  legalRightsAcknowledged: true,
  signatures: [donorSig6],
  status: 'partially_signed',
  signedDate: '2026-05-05',
  validation: {
    validityBand: 'partially_signed',
    compositeRisk: 'moderate',
    firedRules: [],
    additionalFlags: [
      {
        ruleId: 'OnlyWhenNoCapacitySelected',
        priority: 'moderate',
        citation: 'OPG guidance LP12 §A5',
        fieldPath: 'whenAttorneysCanAct',
        message: 'Attorneys may only act when the donor lacks mental capacity.',
        remediation: 'Confirm this restriction is intentional; it limits the practical usefulness of the LPA.',
      },
    ],
  },
};

// 7. Mixed decision mode without continuation sheet 2 — fires
// MixedDecisionWithoutContinuationSheet.
const donor7 = person(
  'p-7-donor',
  'Mrs',
  'Elizabeth',
  'Forsyth',
  '1947-01-30',
  address('70 St Stephens Avenue', 'Edinburgh', 'EH3 5AD'),
  'elizabeth.forsyth@example.co.uk',
);
const att7a: Attorney = {
  ordinal: 1,
  person: person(
    'p-7-att-1',
    'Mr',
    'Iain',
    'Forsyth',
    '1972-05-22',
    address('11 Comely Bank', 'Edinburgh', 'EH4 1AG'),
    'iain.forsyth@example.co.uk',
  ),
};
const att7b: Attorney = {
  ordinal: 2,
  person: person(
    'p-7-att-2',
    'Ms',
    'Fiona',
    'MacLeod',
    '1975-11-08',
    address('22 Bruntsfield Place', 'Edinburgh', 'EH10 4HJ'),
    'fiona.macleod@example.co.uk',
  ),
};
const blocker7: FiredRule = {
  ruleId: 'MixedDecisionWithoutContinuationSheet',
  priority: 'critical',
  citation: 'LPA Regulations 2007 reg. 9; OPG guidance LP12 §B1',
  fieldPath: 'continuationSheets',
  message: 'Decision mode is "mixed" but continuation sheet 2 is missing.',
  remediation: 'Attach LPC continuation sheet 2 listing which decisions are joint and which are joint-and-several.',
};
const lpa7: Lpa = {
  ...baseLpa('lpa-0007', donor7, '2026-04-29T10:00:00Z'),
  attorneys: [att7a, att7b],
  decisionMode: 'mixed',
  decisionModeMixedText: 'Property transactions must be made jointly; banking decisions may be made severally.',
  whenAttorneysCanAct: 'as_soon_as_registered',
  certificateProvider: emptyCertificateProvider(
    person(
      'p-7-cp',
      'Mr',
      'Duncan',
      'Reid',
      '1961-09-14',
      address('14 George Street', 'Edinburgh', 'EH2 2PF'),
    ),
    'friend',
  ),
  legalRightsAcknowledged: true,
  status: 'ready_for_signing',
  validation: {
    validityBand: 'ready_for_signing',
    compositeRisk: 'critical',
    firedRules: [blocker7],
    additionalFlags: [],
  },
};

// 8. Ready for registration, jointly with replacement, several flags, reduced
// fee requested without LPA120A evidence (high flag).
const donor8 = person(
  'p-8-donor',
  'Mr',
  'Frank',
  'Doherty',
  '1953-04-17',
  address('5 Riverside Walk', 'Newcastle upon Tyne', 'NE1 3DX'),
  'frank.doherty@example.co.uk',
);
const att8a: Attorney = {
  ordinal: 1,
  person: person(
    'p-8-att-1',
    'Mrs',
    'Sarah',
    'Doherty',
    '1980-07-04',
    address('9 Heaton Park View', 'Newcastle upon Tyne', 'NE6 5AF'),
    'sarah.doherty@example.co.uk',
  ),
};
const att8b: Attorney = {
  ordinal: 2,
  person: person(
    'p-8-att-2',
    'Mr',
    'Liam',
    'Doherty',
    '1982-11-12',
    address('20 Jesmond Vale', 'Newcastle upon Tyne', 'NE2 1NN'),
    'liam.doherty@example.co.uk',
  ),
};
const rep8: ReplacementAttorney = {
  ordinal: 1,
  replacementStepInCondition: '',
  person: person(
    'p-8-rep-1',
    'Ms',
    'Bridget',
    'O\u2019Connor',
    '1978-03-08',
    address('30 Acorn Road', 'Newcastle upon Tyne', 'NE2 2DJ'),
    'bridget.oconnor@example.co.uk',
  ),
};
const lpa8: Lpa = {
  ...baseLpa('lpa-0008', donor8, '2026-02-18T12:25:00Z'),
  attorneys: [att8a, att8b],
  replacementAttorneys: [rep8],
  decisionMode: 'jointly',
  whenAttorneysCanAct: 'as_soon_as_registered',
  certificateProvider: emptyCertificateProvider(
    person(
      'p-8-cp',
      'Mr',
      'Stephen',
      'Mitchell',
      '1959-06-02',
      address('11 Grey Street', 'Newcastle upon Tyne', 'NE1 6EF'),
    ),
    'friend',
  ),
  legalRightsAcknowledged: true,
  status: 'ready_for_registration',
  signedDate: '2026-03-15',
  registrationApplication: {
    applicantKind: 'donor',
    paymentMethod: 'card',
    cardPaymentPhone: '0191 555 0182',
    reducedFeeRequested: true,
    hasLpa120aEvidence: false,
    isRepeatApplication: false,
    repeatCaseNumber: '',
    paymentReference: '',
    paymentDate: '',
    paymentAmount: 41,
  },
  validation: {
    validityBand: 'ready_for_registration',
    compositeRisk: 'high',
    firedRules: [],
    additionalFlags: [
      {
        ruleId: 'ReducedFeeWithoutLPA120A',
        priority: 'high',
        citation: 'OPG fees policy; LPA120A',
        fieldPath: 'registrationApplication.hasLpa120aEvidence',
        message: 'Reduced fee requested without LPA120A evidence attachment.',
        remediation: 'Attach LPA120A and means-test evidence before submitting.',
      },
      {
        ruleId: 'NoPeopleToNotify',
        priority: 'low',
        citation: 'OPG guidance LP12 §B3',
        fieldPath: 'peopleToNotify',
        message: 'No people-to-notify have been chosen.',
        remediation: 'Adding 1–5 people to notify gives an external safeguarding signal at registration.',
      },
    ],
  },
};

export const sampleLpas: Lpa[] = [lpa1, lpa2, lpa3, lpa4, lpa5, lpa6, lpa7, lpa8];

export function findSampleLpa(id: string): Lpa | undefined {
  return sampleLpas.find((l) => l.id === id);
}
