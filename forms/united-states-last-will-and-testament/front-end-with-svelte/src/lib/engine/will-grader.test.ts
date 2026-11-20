import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { deriveValidityClass, validateWill } from './will-grader';
import { detectFlaggedIssues } from './flagged-issues';
import {
  ageOn,
  electiveShareAmount,
  interestedWitnessOutcome,
  residuaryMismatch,
  residuaryPercentTotal,
  stateRuleFor
} from './will-rules';
import { createDefaultWill, type FlaggedIssue, type Will } from './types';

interface Persona {
  name: string;
  state: Will;
  expected: {
    validityClass: string;
    residuaryPercentTotal: number;
    electiveShareAmount: number | null;
    witnessCount: number;
    selfProved: boolean;
    federalEstateTaxExposure: boolean;
    stateRuleSource: string;
    flaggedIssues: FlaggedIssue[];
  };
}

const personas: Persona[] = JSON.parse(
  readFileSync(new URL('../../../../examples/personas.json', import.meta.url), 'utf8')
).personas;

/** A clean Florida will with two disinterested witnesses, to mutate in tests. */
function cleanWill(): Will {
  return structuredClone(personas[0].state);
}

describe('personas (the shared oracle in examples/personas.json)', () => {
  for (const p of personas) {
    it(`grades "${p.name}" as the HTML engine does`, () => {
      const r = validateWill(p.state);
      expect(r.validityClass).toBe(p.expected.validityClass);
      expect(r.residuaryPercentTotal).toBe(p.expected.residuaryPercentTotal);
      expect(r.electiveShareAmount).toBe(p.expected.electiveShareAmount);
      expect(r.witnessCount).toBe(p.expected.witnessCount);
      expect(r.selfProved).toBe(p.expected.selfProved);
      expect(r.federalEstateTaxExposure).toBe(p.expected.federalEstateTaxExposure);
      expect(r.stateRuleSource).toBe(p.expected.stateRuleSource);
      expect(r.flaggedIssues).toEqual(p.expected.flaggedIssues);
    });
  }
});

describe('classification precedence', () => {
  it('a clean will is valid-ready-to-execute with no flags', () => {
    const w = cleanWill();
    expect(deriveValidityClass(w)).toBe('valid-ready-to-execute');
    expect(detectFlaggedIssues(w)).toEqual([]);
  });

  it('a blank will is incomplete, not a formality risk', () => {
    expect(deriveValidityClass(createDefaultWill())).toBe('incomplete');
  });

  it('formality-risk takes precedence over incomplete', () => {
    const w = createDefaultWill();
    w.testator.dateOfBirth = '2012-01-01';
    w.execution.executionDate = '2026-09-01';
    expect(deriveValidityClass(w)).toBe('formality-risk');
  });
});

describe('capacity', () => {
  it('flags a testator who is 17 on the execution date', () => {
    const w = cleanWill();
    w.testator.dateOfBirth = '2009-09-02';
    w.execution.executionDate = '2026-09-01';
    expect(ageOn(w.testator.dateOfBirth, w.execution.executionDate)).toBe(16);
    expect(detectFlaggedIssues(w).map((f) => f.id)).toContain('F-WILL-001');
  });

  it('accepts a testator who turns 18 on the execution date', () => {
    const w = cleanWill();
    w.testator.dateOfBirth = '2008-09-01';
    w.execution.executionDate = '2026-09-01';
    expect(detectFlaggedIssues(w).map((f) => f.id)).not.toContain('F-WILL-001');
  });
});

describe('witnesses', () => {
  it('requires two witnesses for a witnessed will', () => {
    const w = cleanWill();
    w.execution.witness2Name = '';
    w.execution.witness2Beneficiary = '';
    expect(detectFlaggedIssues(w).map((f) => f.id)).toContain('F-WILL-005');
    expect(deriveValidityClass(w)).toBe('formality-risk');
  });

  it('applies the state interested-witness rule', () => {
    const w = cleanWill();
    w.execution.witness1Beneficiary = 'yes';
    w.testator.state = 'FL';
    expect(interestedWitnessOutcome(w)).toBe('valid');
    w.testator.state = 'WA';
    expect(interestedWitnessOutcome(w)).toBe('presumption');
    w.testator.state = 'NY';
    expect(interestedWitnessOutcome(w)).toBe('void');
    w.execution.witness3Name = 'Extra Witness';
    w.execution.witness3Beneficiary = 'no';
    // Two other disinterested witnesses now signed, so the gift stands.
    expect(interestedWitnessOutcome(w)).toBe('');
    w.execution.witness3Name = '';
    w.execution.witness3Beneficiary = '';
    w.testator.state = 'TX';
    // Texas needs only one disinterested corroborating witness.
    expect(interestedWitnessOutcome(w)).toBe('');
  });
});

describe('bequest arithmetic', () => {
  it('requires residuary shares to total 100', () => {
    const w = cleanWill();
    expect(residuaryPercentTotal(w)).toBe(100);
    expect(residuaryMismatch(w)).toBe(false);
    w.estate.residuary2Percent = 39.5;
    expect(residuaryMismatch(w)).toBe(true);
    expect(detectFlaggedIssues(w).map((f) => f.id)).toContain('F-WILL-012');
  });

  it('flags specific bequests above the estate', () => {
    const w = cleanWill();
    w.estate.specificBequestsTotal = 900000;
    expect(detectFlaggedIssues(w).map((f) => f.id)).toContain('F-WILL-013');
  });
});

describe('state rules and the spousal elective share', () => {
  it('falls back to the UPC default for an unlisted state', () => {
    expect(stateRuleFor('NV').known).toBe(false);
    expect(stateRuleFor('nv').rule.name).toBe('Uniform Probate Code default');
    expect(stateRuleFor('ca').known).toBe(true);
  });

  it('computes the New York greater-of share with its $50,000 floor', () => {
    const w = cleanWill();
    w.testator.state = 'NY';
    w.testator.maritalStatus = 'married';
    w.estate.estimatedEstateValue = 90000;
    expect(electiveShareAmount(w)).toBe(50000);
    w.estate.estimatedEstateValue = 900000;
    expect(electiveShareAmount(w)).toBe(300000);
  });

  it('has no elective share in community property states', () => {
    const w = cleanWill();
    w.testator.state = 'CA';
    w.testator.maritalStatus = 'married';
    expect(electiveShareAmount(w)).toBeNull();
  });

  it('raises estate-tax flags above the exclusions', () => {
    const w = cleanWill();
    w.testator.state = 'WA';
    w.estate.estimatedEstateValue = 4000000;
    const ids = detectFlaggedIssues(w).map((f) => f.id);
    expect(ids).toContain('F-WILL-025');
    expect(ids).not.toContain('F-WILL-024');
    w.estate.estimatedEstateValue = 16000000;
    expect(detectFlaggedIssues(w).map((f) => f.id)).toContain('F-WILL-024');
  });
});
