import { describe, it, expect } from 'vitest';
import { deriveApplicationClass, validateApplication } from './birth-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { expectedFee, ageInYears, hasStateRule, STATE_RULES } from './birth-rules';
import { createDefaultApplication } from './defaults';
import type { BirthCertificateApplication } from './types';

/** A complete, ready California self-request for a passport. */
function ready(): BirthCertificateApplication {
  const d = createDefaultApplication();
  d.applicant = {
    applicantName: 'Elena Maria Garcia',
    dateOfBirth: '1990-04-12',
    email: 'elena@example.org',
    phone: '555-0142',
    postalAddress: '410 Alder Street, Sacramento, CA'
  };
  d.registrant = {
    registrantName: 'Elena Maria Garcia',
    sex: 'female',
    dateOfBirth: '1990-04-12',
    placeOfBirth: 'Fresno',
    countyOfBirth: 'Fresno',
    state: 'CA',
    birthFacility: 'Community Regional Medical Center',
    motherNameBeforeFirstMarriage: 'Rosa Lucia Hernandez',
    fatherName: 'Carlos Garcia',
    deceased: 'no',
    adopted: 'no'
  };
  d.purpose = {
    relationship: 'self',
    purpose: 'passport',
    needsApostille: 'no',
    apostilleCountry: ''
  };
  d.order = {
    certificateType: 'certified-long-form',
    copies: 1,
    deliveryMethod: 'mail',
    feeEnclosedUsd: 31
  };
  d.evidence = {
    idType: 'state-driver-license',
    idUnexpired: 'yes',
    proofOfRelationship: 'no',
    authorityDocument: 'no',
    notarizedSwornStatement: 'yes'
  };
  d.declaration = { declarationSigned: 'yes', applicationNote: '' };
  return d;
}

const ids = (d: BirthCertificateApplication) => detectFlaggedIssues(d).map((f) => f.id);

describe('state rules', () => {
  it('holds a row for each required state', () => {
    for (const s of ['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'WA']) {
      expect(STATE_RULES[s]).toBeDefined();
    }
  });

  it('computes the expected fee with additional copies', () => {
    const d = ready();
    d.registrant.state = 'TX';
    d.order.copies = 2;
    expect(expectedFee(d)).toBe(25);
  });

  it('has no fee for an unknown state', () => {
    const d = ready();
    d.registrant.state = 'MN';
    expect(hasStateRule(d)).toBe(false);
    expect(expectedFee(d)).toBeNull();
  });

  it('computes age in whole years', () => {
    expect(ageInYears('2011-05-05', new Date('2026-09-03T12:00:00Z'))).toBe(15);
    expect(ageInYears(null)).toBeNull();
  });
});

describe('classification', () => {
  it('is ready-to-submit for a complete eligible request with no flags', () => {
    const d = ready();
    expect(deriveApplicationClass(d)).toBe('ready-to-submit');
    expect(ids(d)).toEqual([]);
  });

  it('is incomplete for a blank application', () => {
    expect(deriveApplicationClass(createDefaultApplication())).toBe('incomplete');
  });

  it('is ineligible for a sibling of a living registrant in Florida', () => {
    const d = ready();
    d.registrant.state = 'FL';
    d.purpose.relationship = 'sibling';
    d.evidence.proofOfRelationship = 'yes';
    expect(deriveApplicationClass(d)).toBe('ineligible-requester');
    expect(ids(d)).toContain('F-BIRTH-INELIGIBLE-001');
  });

  it('allows a Florida sibling once the registrant is deceased', () => {
    const d = ready();
    d.registrant.state = 'FL';
    d.registrant.deceased = 'yes';
    d.purpose.relationship = 'sibling';
    d.evidence.proofOfRelationship = 'yes';
    d.order.feeEnclosedUsd = 15;
    expect(deriveApplicationClass(d)).toBe('ready-to-submit');
    expect(ids(d)).toContain('F-BIRTH-DECEASED-001');
  });

  it('treats an under-age self-requester in Pennsylvania as ineligible', () => {
    const d = ready();
    d.registrant.state = 'PA';
    d.applicant.dateOfBirth = '2030-01-01';
    expect(deriveApplicationClass(d)).toBe('ineligible-requester');
    expect(ids(d)).toContain('F-BIRTH-UNDERAGE-001');
  });

  it('treats Ohio records as open to any requester', () => {
    const d = ready();
    d.registrant.state = 'OH';
    d.purpose.relationship = 'other';
    d.evidence.proofOfRelationship = 'yes';
    d.order.feeEnclosedUsd = 21.5;
    expect(deriveApplicationClass(d)).toBe('ready-to-submit');
  });

  it('lets anyone request an informational copy where the state offers one', () => {
    const d = ready();
    d.registrant.state = 'WA';
    d.purpose.relationship = 'other';
    d.purpose.purpose = 'genealogy';
    d.order.certificateType = 'informational';
    d.order.feeEnclosedUsd = 25;
    d.evidence.idType = '';
    d.evidence.idUnexpired = '';
    expect(deriveApplicationClass(d)).toBe('ready-to-submit');
  });
});

describe('flags', () => {
  it('requires a notarized statement for a California mail request', () => {
    const d = ready();
    d.evidence.notarizedSwornStatement = 'no';
    expect(deriveApplicationClass(d)).toBe('incomplete');
    expect(ids(d)).toContain('F-BIRTH-NOTARY-001');
  });

  it('rejects a short form for a passport', () => {
    const d = ready();
    d.order.certificateType = 'certified-short-form';
    expect(ids(d)).toContain('F-BIRTH-TYPE-001');
  });

  it('flags a fee shortfall but not for online orders', () => {
    const d = ready();
    d.order.feeEnclosedUsd = 10;
    expect(ids(d)).toContain('F-BIRTH-FEE-001');
    d.order.deliveryMethod = 'online';
    expect(ids(d)).not.toContain('F-BIRTH-FEE-001');
  });

  it('raises the verify-state-rule flag and uses the default for an unknown state', () => {
    const d = ready();
    d.registrant.state = 'MN';
    expect(ids(d)).toContain('F-BIRTH-STATE-001');
    expect(validateApplication(d).stateRuleApplied).toBe('default');
  });

  it('describes the apostille process and asks for a destination', () => {
    const d = ready();
    d.purpose.needsApostille = 'yes';
    expect(ids(d)).toContain('F-BIRTH-APOSTILLE-001');
    d.purpose.apostilleCountry = 'Italy';
    expect(ids(d)).toContain('F-BIRTH-APOSTILLE-002');
  });

  it('sorts flags high before medium before low', () => {
    const d = createDefaultApplication();
    d.registrant.state = 'NY';
    d.registrant.adopted = 'yes';
    const order = detectFlaggedIssues(d).map((f) => f.priority);
    const rank = { high: 0, medium: 1, low: 2 } as const;
    expect([...order].sort((a, b) => rank[a] - rank[b])).toEqual(order);
  });
});
