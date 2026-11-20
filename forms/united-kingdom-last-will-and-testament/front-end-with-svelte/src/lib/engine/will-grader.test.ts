import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { deriveValidityClass, validateWill } from './will-grader';
import { detectFlaggedIssues } from './flagged-issues';
import {
  sharesTotalPercent,
  witnessCount,
  witnessIsBeneficiary,
  testatorUnder18
} from './will-rules';
import type { Will } from './types';
import { sampleWills } from '../data/sample-reports';

/** A complete, unsigned draft that classifies as valid. */
function validDraft(): Will {
  return structuredClone(sampleWills[0].data);
}

function signed(d: Will): Will {
  Object.assign(d.execution, {
    executionStatus: 'signed',
    dateOfWill: '2026-08-20',
    testatorSigned: 'yes',
    witnessesPresentTogether: 'yes',
    witnessesSigned: 'yes',
    witnessFirstName: 'Helen Booth',
    witnessFirstOver18: 'yes',
    witnessFirstIsBeneficiaryOrSpouse: 'no',
    witnessSecondName: 'Raj Patel',
    witnessSecondOver18: 'yes',
    witnessSecondIsBeneficiaryOrSpouse: 'no'
  });
  return d;
}

const ids = (d: Will) => detectFlaggedIssues(d).map((f) => f.id);

describe('will grader', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-03T12:00:00Z'));
  });
  afterEach(() => vi.useRealTimers());

  it('classifies a complete draft as valid', () => {
    const d = validDraft();
    expect(deriveValidityClass(d)).toBe('valid');
    expect(sharesTotalPercent(d)).toBe(100);
    expect(ids(d)).toEqual(['F-WITNESSES-PLAN-001']);
  });

  it('classifies a correctly signed will as valid with no flags', () => {
    const d = signed(validDraft());
    const r = validateWill(d);
    expect(r.validityClass).toBe('valid');
    expect(r.witnessCount).toBe(2);
    expect(r.flaggedIssues).toEqual([]);
  });

  it('is incomplete without an executor', () => {
    const d = validDraft();
    d.executors.executorFirstName = '';
    d.executors.executorSecondName = '';
    expect(deriveValidityClass(d)).toBe('incomplete');
    expect(ids(d)).toContain('F-NO-EXECUTOR-001');
  });

  it('is incomplete without a residuary clause', () => {
    const d = validDraft();
    d.beneficiaries.residuaryClause = 'no';
    expect(deriveValidityClass(d)).toBe('incomplete');
    expect(ids(d)).toContain('F-RESIDUARY-001');
  });

  it('is incomplete when shares do not total 100', () => {
    const d = validDraft();
    d.beneficiaries.beneficiaryFirstSharePercent = 30;
    expect(sharesTotalPercent(d)).toBe(80);
    expect(deriveValidityClass(d)).toBe('incomplete');
    expect(ids(d)).toContain('F-SHARES-001');
  });

  it('is incomplete for a minor beneficiary without a trustee', () => {
    const d = validDraft();
    d.beneficiaries.beneficiarySecondIsMinor = 'yes';
    d.beneficiaries.beneficiarySecondHasTrustee = 'no';
    expect(deriveValidityClass(d)).toBe('incomplete');
    expect(ids(d)).toContain('F-MINOR-TRUSTEE-001');
    d.beneficiaries.beneficiarySecondHasTrustee = 'yes';
    expect(deriveValidityClass(d)).toBe('valid');
  });

  it('is a formality risk when signed with one witness', () => {
    const d = signed(validDraft());
    d.execution.witnessSecondName = '';
    expect(witnessCount(d)).toBe(1);
    expect(deriveValidityClass(d)).toBe('formality-risk');
    expect(ids(d)).toContain('F-WITNESSES-001');
  });

  it('is a formality risk when a witness is a beneficiary, by answer or by name', () => {
    const d = signed(validDraft());
    d.execution.witnessFirstName = 'Anna Ellis';
    expect(witnessIsBeneficiary(d)).toBe(true);
    expect(deriveValidityClass(d)).toBe('formality-risk');
    const e = signed(validDraft());
    e.execution.witnessFirstIsBeneficiaryOrSpouse = 'yes';
    expect(ids(e)).toContain('F-WITNESS-BENEFICIARY-001');
  });

  it('is a formality risk for a testator under 18', () => {
    const d = validDraft();
    d.testator.dateOfBirth = '2009-06-01';
    expect(testatorUnder18(d)).toBe(true);
    expect(deriveValidityClass(d)).toBe('formality-risk');
  });

  it('measures age at the date of the will once set', () => {
    const d = signed(validDraft());
    d.testator.dateOfBirth = '2008-09-01';
    d.execution.dateOfWill = '2026-08-20';
    expect(testatorUnder18(d)).toBe(true);
    d.execution.dateOfWill = '2026-09-02';
    expect(testatorUnder18(d)).toBe(false);
  });

  it('is a formality risk when capacity is denied or the domicile is outside England and Wales', () => {
    const a = validDraft();
    a.testator.hasMentalCapacity = 'no';
    expect(deriveValidityClass(a)).toBe('formality-risk');
    const b = validDraft();
    b.testator.domicile = 'scotland';
    expect(deriveValidityClass(b)).toBe('formality-risk');
  });

  it('is a formality risk when marriage is expected without a contemplation clause', () => {
    const d = validDraft();
    d.testator.marriageExpected = 'yes';
    expect(deriveValidityClass(d)).toBe('formality-risk');
    d.testator.contemplationOfMarriageClause = 'yes';
    expect(deriveValidityClass(d)).toBe('valid');
  });

  it('formality risk takes precedence over incomplete', () => {
    const d = validDraft();
    d.testator.hasMentalCapacity = 'no';
    d.executors.executorFirstName = '';
    d.executors.executorSecondName = '';
    expect(deriveValidityClass(d)).toBe('formality-risk');
  });

  it('raises the awareness flags without changing the class', () => {
    const d = validDraft();
    d.testator.maritalStatus = 'cohabiting';
    d.estate.estateOtherJurisdictions = 'yes';
    d.estate.estateValueBand = 'over-2m';
    d.testator.previousWill = 'exists';
    d.testator.revocationClause = 'no';
    d.family.hasChildrenUnder18 = 'yes';
    d.beneficiaries.dependantsConsidered = 'no';
    expect(deriveValidityClass(d)).toBe('valid');
    expect(ids(d)).toEqual(
      expect.arrayContaining([
        'F-PARTNER-001',
        'F-OTHER-JURISDICTIONS-001',
        'F-PREVIOUS-WILL-001',
        'F-GUARDIAN-001',
        'F-INHERITANCE-ACT-001',
        'F-INHERITANCE-TAX-001'
      ])
    );
  });

  it('sorts flags high before medium before low', () => {
    const order = { high: 0, medium: 1, low: 2 } as const;
    for (const s of sampleWills) {
      const ps = detectFlaggedIssues(s.data).map((f) => order[f.priority]);
      expect([...ps].sort()).toEqual(ps);
    }
  });
});

describe('personas oracle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-03T12:00:00Z'));
  });
  afterEach(() => vi.useRealTimers());

  const file = new URL('../../../../examples/personas.json', import.meta.url);
  const personas = JSON.parse(readFileSync(file, 'utf8')).personas as {
    name: string;
    state: Will;
    expected: {
      validityClass: string;
      formalityRisk: boolean;
      sharesTotalPercent: number;
      witnessCount: number;
      flaggedIssues: unknown[];
    };
  }[];

  it.each(personas.map((p) => [p.name, p] as const))('%s matches the oracle', (_name, p) => {
    const r = validateWill(p.state);
    expect(r.validityClass).toBe(p.expected.validityClass);
    expect(r.formalityRisk).toBe(p.expected.formalityRisk);
    expect(r.sharesTotalPercent).toBe(p.expected.sharesTotalPercent);
    expect(r.witnessCount).toBe(p.expected.witnessCount);
    expect(detectFlaggedIssues(p.state)).toEqual(p.expected.flaggedIssues);
  });
});
