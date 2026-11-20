import { describe, expect, it } from 'vitest';
import personas from '../../../../examples/personas.json';
import { createDefaultApplication } from './defaults';
import { detectFlaggedIssues } from './flagged-issues';
import { validateApplication } from './title-grader';
import {
  modelYearCode,
  normalizeVin,
  odometerExemption,
  outstandingItems,
  stateRule,
  vinCheckDigit,
  vinStatus
} from './title-rules';
import type { TitleApplication } from './types';

function blank(): TitleApplication {
  return createDefaultApplication();
}

describe('VIN (49 CFR 565.15)', () => {
  it('computes the check digit of the CFR worked example VIN', () => {
    expect(vinCheckDigit('1HGCM82633A004352')).toBe('3');
  });

  it('yields X when the remainder is 10', () => {
    expect(vinCheckDigit('1G1YY22GXY5112233')).toBe('X');
  });

  it('classifies VIN status', () => {
    const a = blank();
    expect(vinStatus(a)).toBe('');
    a.vehicle.vin = '1HGCM82633A004352';
    expect(vinStatus(a)).toBe('valid');
    a.vehicle.vin = '1HGCM82643A004352';
    expect(vinStatus(a)).toBe('check-digit-mismatch');
    a.vehicle.vin = '1HGCM8263';
    expect(vinStatus(a)).toBe('invalid-length');
    a.vehicle.vin = '1HGCM82O33A004352';
    expect(vinStatus(a)).toBe('invalid-characters');
    a.vehicle.modelYear = 1972;
    expect(vinStatus(a)).toBe('not-standardized');
  });

  it('normalizes case and whitespace', () => {
    expect(normalizeVin('  1hgcm82633a004352 ')).toBe('1HGCM82633A004352');
  });

  it('maps model years to position-10 codes', () => {
    expect(modelYearCode(2026)).toBe('T');
    expect(modelYearCode(2010)).toBe('A');
    expect(modelYearCode(2003)).toBe('3');
    expect(modelYearCode(1998)).toBe('W');
    expect(modelYearCode(2031)).toBe('1');
    expect(modelYearCode(1950)).toBe('');
  });
});

describe('odometer exemption (49 CFR 580.17)', () => {
  it('exempts a vehicle over 16,000 pounds', () => {
    const a = blank();
    a.vehicle.gvwrLbs = 16001;
    expect(odometerExemption(a)).toBe('gvwr');
    a.vehicle.gvwrLbs = 16000;
    expect(odometerExemption(a)).toBe('');
  });

  it('applies the 10-year rule to model year 2010 and earlier', () => {
    const a = blank();
    a.vehicle.modelYear = 2010;
    a.application.acquisitionDate = '2020-01-01';
    expect(odometerExemption(a)).toBe('age-10-year');
    a.application.acquisitionDate = '2019-12-31';
    expect(odometerExemption(a)).toBe('');
  });

  it('applies the 20-year rule to model year 2011 and later', () => {
    const a = blank();
    a.vehicle.modelYear = 2011;
    a.application.acquisitionDate = '2031-01-01';
    expect(odometerExemption(a)).toBe('age-20-year');
    a.application.acquisitionDate = '2030-06-01';
    expect(odometerExemption(a)).toBe('');
  });
});

describe('state rules', () => {
  it('knows the nine encoded states and falls back for the rest', () => {
    for (const code of ['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'WA', 'AZ']) {
      expect(stateRule(code).known).toBe(true);
    }
    expect(stateRule('ca').known).toBe(true);
    expect(stateRule('MT').known).toBe(false);
    expect(stateRule('').known).toBe(false);
  });
});

describe('classification', () => {
  it('classifies a blank application as incomplete with outstanding items', () => {
    const r = validateApplication(blank());
    expect(r.applicationClass).toBe('incomplete');
    expect(r.outstandingItemCount).toBeGreaterThan(20);
  });

  it('puts a brand ahead of completeness', () => {
    const a = blank();
    a.titleHistory.titleBrand = 'salvage';
    expect(validateApplication(a).applicationClass).toBe('title-brand-or-lien-issue');
  });

  it('treats a brand of none as no brand', () => {
    const a = blank();
    a.titleHistory.titleBrand = 'none';
    expect(validateApplication(a).brandOrLienIssue).toBe(false);
  });

  it('flags an unreleased lien and an NMVTIS alert', () => {
    const a = blank();
    a.lien.lienStatus = 'existing-lien-unreleased';
    expect(validateApplication(a).brandOrLienIssue).toBe(true);
    const b = blank();
    b.titleHistory.nmvtisCheck = 'brand-or-theft-found';
    expect(validateApplication(b).brandOrLienIssue).toBe(true);
  });

  it('sorts flags high before medium before low', () => {
    const flags = detectFlaggedIssues(blank());
    const rank = { high: 0, medium: 1, low: 2 } as const;
    for (let i = 1; i < flags.length; i++) {
      expect(rank[flags[i - 1].priority]).toBeLessThanOrEqual(rank[flags[i].priority]);
    }
  });
});

describe('persona parity with the HTML engine', () => {
  for (const p of personas.personas) {
    it(p.name, () => {
      const state = p.state as unknown as TitleApplication;
      const result = validateApplication(state);
      const expected = p.expected as Record<string, unknown>;
      expect(result.applicationClass).toBe(expected.applicationClass);
      expect(result.vinStatus).toBe(expected.vinStatus);
      expect(result.odometerDisclosureRequired).toBe(expected.odometerDisclosureRequired);
      expect(result.brandOrLienIssue).toBe(expected.brandOrLienIssue);
      expect(result.outstandingItemCount).toBe(expected.outstandingItemCount);
      expect(result.stateRuleKnown).toBe(expected.stateRuleKnown);
      expect(result.estimatedStateTaxUsd).toBe(expected.estimatedStateTaxUsd);
      expect(outstandingItems(state).length).toBe(expected.outstandingItemCount);
      expect(detectFlaggedIssues(state)).toEqual(expected.flaggedIssues);
    });
  }
});
