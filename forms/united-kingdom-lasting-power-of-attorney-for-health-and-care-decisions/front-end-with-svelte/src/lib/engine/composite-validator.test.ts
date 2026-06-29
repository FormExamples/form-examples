import { describe, expect, it } from 'vitest';
import { calculateLpaValidity } from './composite-validator.js';
import {
  emptyAttorney,
  emptyCertificateProvider,
  emptyLpaApplication,
  emptyPersonToNotify,
} from './factory.js';
import type { LpaApplication } from './types.js';

function makeReadyToRegister(): LpaApplication {
  const app = emptyLpaApplication();
  app.jurisdiction = 'england';

  app.donor = {
    title: 'Mr',
    givenNames: 'Aled',
    familyName: 'Pritchard',
    otherNamesUsed: '',
    birthDate: '1955-04-12',
    email: 'aled@example.test',
    phone: '+44 20 7000 0000',
    postalAddressAsFullText: '1 Cathedral Road, Cardiff CF11 9LJ',
    countryAsIso31661Alpha2: 'GB',
    postcode: 'CF11 9LJ',
    unitedKingdomNhsNumber: '',
    jurisdiction: 'wales',
    preferredLanguage: 'en',
    capacityDeclared: 'yes',
    capacityDeclaredAt: '2026-05-01T09:00:00Z',
  };

  app.attorneys = [
    {
      ...emptyAttorney(),
      givenNames: 'Bronwen',
      familyName: 'Pritchard',
      birthDate: '1990-08-21',
      postalAddressAsFullText: '2 Cathedral Road, Cardiff',
      countryAsIso31661Alpha2: 'GB',
      relationshipToDonor: 'child',
      isBankrupt: 'no',
      capacityDeclared: 'yes',
    },
  ];

  app.certificateProvider = {
    ...emptyCertificateProvider(),
    givenNames: 'Catrin',
    familyName: 'Davies',
    postalAddressAsFullText: '10 Park Place, Cardiff',
    countryAsIso31661Alpha2: 'GB',
    route: 'skill-based',
    profession: 'solicitor',
    professionRegistrationNumber: 'SRA-12345',
    yearsKnownDonor: null,
    relationshipToDonor: 'professional',
    declaredNotFamily: 'yes',
    declaredNotEmployee: 'yes',
    declaredNotAttorney: 'yes',
  };

  app.peopleToNotify = [];
  app.decisionRule = 'jointly-and-severally';
  app.lstChoice = 'option-a';
  app.lstDonorInitialled = 'yes';

  app.signatures = [
    {
      signerRole: 'donor',
      signerIndex: 0,
      signedAt: '2026-05-01T09:00:00Z',
      signatureMethod: 'wet-ink',
      witnessName: 'David Thomas',
      witnessAddress: '3 King Edward VII Avenue, Cardiff',
      witnessSignedAt: '2026-05-01T09:00:00Z',
      witnessIsAttorney: 'no',
    },
    {
      signerRole: 'certificate-provider',
      signerIndex: 0,
      signedAt: '2026-05-01T10:00:00Z',
      signatureMethod: 'wet-ink',
      witnessName: 'Eira Williams',
      witnessAddress: '4 King Edward VII Avenue, Cardiff',
      witnessSignedAt: '2026-05-01T10:00:00Z',
      witnessIsAttorney: 'no',
    },
    {
      signerRole: 'attorney',
      signerIndex: 0,
      signedAt: '2026-05-01T11:00:00Z',
      signatureMethod: 'wet-ink',
      witnessName: 'David Thomas',
      witnessAddress: '3 King Edward VII Avenue, Cardiff',
      witnessSignedAt: '2026-05-01T11:00:00Z',
      witnessIsAttorney: 'no',
    },
  ];

  app.registration = {
    applicantRole: 'donor',
    applicantSignedAt: '2026-05-02T09:00:00Z',
    feeAmountPounds: 82,
    feeRemission: 'none',
    feeRemissionReason: '',
    submittedAt: '',
    submissionChannel: 'post',
  };

  return app;
}

describe('calculateLpaValidity', () => {
  it('returns invalid for an empty application', () => {
    const result = calculateLpaValidity(emptyLpaApplication());
    expect(result.validityStatus).toBe('invalid');
    expect(result.firedRules.some((r) => r.severity === 'fatal')).toBe(true);
    expect(result.effectiveDate).toBeNull();
  });

  it('returns ready-to-register for a fully populated LPA', () => {
    const result = calculateLpaValidity(makeReadyToRegister());
    expect(result.firedRules.filter((r) => r.severity === 'fatal')).toEqual([]);
    expect(result.firedRules.filter((r) => r.severity === 'high')).toEqual([]);
    expect(result.validityStatus).toBe('ready-to-register');
    expect(result.completenessScore).toBeGreaterThanOrEqual(90);
    expect(result.effectiveDate).toBe('2026-05-01');
  });

  it('fires R-MCA-S9-AGE when the donor is under 18 at signing', () => {
    const app = makeReadyToRegister();
    app.donor.birthDate = '2015-01-01';
    const result = calculateLpaValidity(app);
    expect(result.firedRules.some((r) => r.ruleId === 'R-MCA-S9-AGE')).toBe(true);
    expect(result.validityStatus).toBe('invalid');
  });

  it('fires R-MCA-S10-CAP when the donor has not declared capacity', () => {
    const app = makeReadyToRegister();
    app.donor.capacityDeclared = '';
    const result = calculateLpaValidity(app);
    expect(result.firedRules.some((r) => r.ruleId === 'R-MCA-S10-CAP')).toBe(true);
    expect(result.validityStatus).toBe('invalid');
  });

  it('fires R-MCA-LST-CHOICE when no life-sustaining-treatment option is selected', () => {
    const app = makeReadyToRegister();
    app.lstChoice = '';
    app.lstDonorInitialled = '';
    const result = calculateLpaValidity(app);
    expect(result.firedRules.some((r) => r.ruleId === 'R-MCA-LST-CHOICE')).toBe(true);
    expect(result.validityStatus).toBe('invalid');
  });

  it('fires R-MCA-LST-INITIAL when the option is chosen but not initialled', () => {
    const app = makeReadyToRegister();
    app.lstDonorInitialled = 'no';
    const result = calculateLpaValidity(app);
    expect(result.firedRules.some((r) => r.ruleId === 'R-MCA-LST-INITIAL')).toBe(true);
    expect(result.validityStatus).toBe('invalid');
  });

  it('fires R-MCA-CP-FAM when certificate provider has not declared they are not family', () => {
    const app = makeReadyToRegister();
    app.certificateProvider!.declaredNotFamily = '';
    const result = calculateLpaValidity(app);
    expect(result.firedRules.some((r) => r.ruleId === 'R-MCA-CP-FAM')).toBe(true);
    expect(result.validityStatus).toBe('invalid');
  });

  it('fires R-MCA-CP-ROUTE when knowledge-based but years_known_donor < 2', () => {
    const app = makeReadyToRegister();
    app.certificateProvider!.route = 'knowledge-based';
    app.certificateProvider!.profession = '';
    app.certificateProvider!.professionRegistrationNumber = '';
    app.certificateProvider!.yearsKnownDonor = 1;
    const result = calculateLpaValidity(app);
    expect(result.firedRules.some((r) => r.ruleId === 'R-MCA-CP-ROUTE')).toBe(true);
    expect(result.validityStatus).toBe('invalid');
  });

  it('fires R-MCA-ORDER-DONOR-FIRST when the donor signs after the certificate provider', () => {
    const app = makeReadyToRegister();
    const donorSig = app.signatures.find((s) => s.signerRole === 'donor')!;
    const cpSig = app.signatures.find((s) => s.signerRole === 'certificate-provider')!;
    donorSig.signedAt = '2026-05-01T12:00:00Z';
    cpSig.signedAt = '2026-05-01T10:00:00Z';
    const result = calculateLpaValidity(app);
    expect(result.firedRules.some((r) => r.ruleId === 'R-MCA-ORDER-DONOR-FIRST')).toBe(true);
    expect(result.validityStatus).toBe('invalid');
  });

  it('fires R-MCA-ORDER-CP-BEFORE-ATT when an attorney signs before the certificate provider', () => {
    const app = makeReadyToRegister();
    const attSig = app.signatures.find((s) => s.signerRole === 'attorney')!;
    attSig.signedAt = '2026-05-01T09:30:00Z';
    const result = calculateLpaValidity(app);
    expect(result.firedRules.some((r) => r.ruleId === 'R-MCA-ORDER-CP-BEFORE-ATT')).toBe(true);
    expect(result.validityStatus).toBe('invalid');
  });

  it('fires R-MCA-WIT-NOT-ATT when a witness is also an attorney', () => {
    const app = makeReadyToRegister();
    const donorSig = app.signatures.find((s) => s.signerRole === 'donor')!;
    donorSig.witnessIsAttorney = 'yes';
    const result = calculateLpaValidity(app);
    expect(result.firedRules.some((r) => r.ruleId === 'R-MCA-WIT-NOT-ATT')).toBe(true);
    expect(result.validityStatus).toBe('invalid');
  });

  it('fires R-MCA-JOINT-MIXED-SCOPE for mixed without joint-decision set', () => {
    const app = makeReadyToRegister();
    app.decisionRule = 'mixed';
    app.jointDecisionSet = '';
    const result = calculateLpaValidity(app);
    expect(result.firedRules.some((r) => r.ruleId === 'R-MCA-JOINT-MIXED-SCOPE')).toBe(true);
    expect(result.validityStatus).toBe('needs-correction');
  });

  it('fires R-MCA-NOTIFY-MAX when more than 5 persons to notify', () => {
    const app = makeReadyToRegister();
    app.peopleToNotify = Array.from({ length: 6 }, () => emptyPersonToNotify());
    const result = calculateLpaValidity(app);
    expect(result.firedRules.some((r) => r.ruleId === 'R-MCA-NOTIFY-MAX')).toBe(true);
    expect(result.validityStatus).toBe('invalid');
  });

  it('fires R-MCA-FEE when no fee or remission is recorded', () => {
    const app = makeReadyToRegister();
    app.registration.feeAmountPounds = 0;
    app.registration.feeRemission = 'none';
    const result = calculateLpaValidity(app);
    expect(result.firedRules.some((r) => r.ruleId === 'R-MCA-FEE')).toBe(true);
    expect(result.validityStatus).toBe('invalid');
  });

  it('fires R-MCA-COP-PROHIBITED when an instruction authorises assisted dying', () => {
    const app = makeReadyToRegister();
    app.instructions = [
      {
        category: 'end-of-life-care',
        statement: 'My attorneys may arrange assisted dying for me.',
        lawfulnessAssessed: 'yes',
        contradictsAdrt: 'no',
      },
    ];
    const result = calculateLpaValidity(app);
    expect(result.firedRules.some((r) => r.ruleId.startsWith('R-MCA-COP-PROHIBITED'))).toBe(true);
    expect(result.validityStatus).toBe('invalid');
  });

  it('flags adrt-conflict when an instruction contradicts an ADRT', () => {
    const app = makeReadyToRegister();
    app.instructions = [
      {
        category: 'medical-treatment-limit',
        statement: 'Consent to dialysis even if my ADRT refuses it.',
        lawfulnessAssessed: 'yes',
        contradictsAdrt: 'yes',
      },
    ];
    const result = calculateLpaValidity(app);
    expect(result.additionalFlags.some((f) => f.category === 'adrt-conflict')).toBe(true);
    expect(result.firedRules.some((r) => r.ruleId.startsWith('R-MCA-INSTR-ADRT'))).toBe(true);
  });

  it('flags bilingual-donor when preferred language is Welsh', () => {
    const app = makeReadyToRegister();
    app.donor.preferredLanguage = 'cy';
    const result = calculateLpaValidity(app);
    expect(result.additionalFlags.some((f) => f.category === 'bilingual-donor')).toBe(true);
  });

  it('flags foreign-domicile when country is not GB', () => {
    const app = makeReadyToRegister();
    app.donor.countryAsIso31661Alpha2 = 'IE';
    const result = calculateLpaValidity(app);
    expect(result.additionalFlags.some((f) => f.category === 'foreign-domicile')).toBe(true);
  });

  it('rule identifiers are unique within a single computation', () => {
    const result = calculateLpaValidity(makeReadyToRegister());
    const ids = result.firedRules.map((r) => r.ruleId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('engine version is pinned', () => {
    const result = calculateLpaValidity(emptyLpaApplication());
    expect(result.engineVersion).toBe('0.1.0');
  });
});
