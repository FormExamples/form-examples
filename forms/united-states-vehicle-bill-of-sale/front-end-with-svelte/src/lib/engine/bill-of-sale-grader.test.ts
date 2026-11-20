import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { deriveCompletenessClass, validateBillOfSale } from './bill-of-sale-grader';
import { detectFlaggedIssues } from './flagged-issues';
import {
  daysBetween,
  odometerExemption,
  stateRule,
  vinCheckDigit,
  vinProblem
} from './bill-of-sale-rules';
import { createDefaultBillOfSale } from './defaults';
import type { BillOfSale } from './types';
import personas from '../../../../examples/personas.json';

// The wall clock is frozen, as bin/test-personas freezes it, so deadline flags
// never rot.
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-09-03T12:00:00Z'));
});
afterEach(() => {
  vi.useRealTimers();
});

function withVin(prefix: string): string {
  return prefix.slice(0, 8) + vinCheckDigit(prefix) + prefix.slice(9);
}

/** A complete Texas sale of a 2018 vehicle; individual tests mutate one thing. */
function completeSale(): BillOfSale {
  const d = createDefaultBillOfSale();
  d.transaction = {
    state: 'TX',
    saleDate: '2026-08-25',
    salePriceAsUsd: 12500,
    paymentMethod: 'check',
    taxBasis: 'standard-presumptive-value'
  };
  d.seller = {
    name: 'Dana Whitfield',
    type: 'individual',
    streetAddress: '412 Mesquite Lane',
    city: 'Austin',
    state: 'TX',
    postalCode: '78704',
    phone: '',
    signed: 'yes'
  };
  d.buyer = {
    name: 'Marcus Alvarez',
    type: 'individual',
    streetAddress: '88 Oak Hollow Dr',
    city: 'Round Rock',
    state: 'TX',
    postalCode: '78664',
    phone: '',
    signed: 'yes'
  };
  d.vehicle = {
    year: 2018,
    make: 'Toyota',
    model: 'Corolla',
    bodyType: 'Sedan',
    vin: withVin('2T1BURHE0JC034461'),
    color: '',
    titleNumber: '',
    titleBrand: 'clean',
    gvwrOver16000: 'no',
    selfPropelled: 'yes'
  };
  d.odometer = {
    readingMiles: 64210,
    status: 'actual',
    sellerCertified: 'yes',
    buyerAcknowledged: 'yes'
  };
  d.terms = {
    sellerHoldsTitle: 'yes',
    titleSigned: 'yes',
    lienStatus: 'none',
    lienholderName: '',
    lienReleaseDate: null,
    asIsClause: 'as-is',
    warrantyNote: '',
    notarized: 'not-required'
  };
  d.afterSale = {
    releaseOfLiabilityFiled: 'yes',
    releaseFiledDate: '2026-08-26',
    platesRemoved: 'yes',
    buyerTitleApplicationDate: '2026-08-30'
  };
  return d;
}

const ids = (d: BillOfSale) => detectFlaggedIssues(d).map((f) => f.id);

describe('classification', () => {
  it('a blank bill of sale is incomplete', () => {
    expect(deriveCompletenessClass(createDefaultBillOfSale())).toBe('incomplete');
  });

  it('a fully completed sale is complete, with only the disclaimer flag', () => {
    const d = completeSale();
    expect(validateBillOfSale(d).completenessClass).toBe('complete');
    expect(ids(d)).toEqual(['F-BOS-018']);
  });

  it('risk takes precedence over incompleteness', () => {
    const d = completeSale();
    d.buyer.signed = 'no';
    d.odometer.status = 'not-actual';
    expect(deriveCompletenessClass(d)).toBe('risk-flagged');
  });

  it('each risk condition risk-flags the sale', () => {
    const cases: ((d: BillOfSale) => void)[] = [
      (d) => (d.odometer.status = 'exceeds-mechanical-limits'),
      (d) => (d.vehicle.vin = '1HGCM82633A004353'),
      (d) => (d.terms.lienStatus = 'outstanding'),
      (d) => (d.terms.sellerHoldsTitle = 'no'),
      (d) => (d.vehicle.titleBrand = 'salvage')
    ];
    for (const mutate of cases) {
      const d = completeSale();
      mutate(d);
      expect(deriveCompletenessClass(d)).toBe('risk-flagged');
    }
  });

  it('a missing signature makes the sale incomplete', () => {
    const d = completeSale();
    d.seller.signed = '';
    expect(deriveCompletenessClass(d)).toBe('incomplete');
    expect(ids(d)).toContain('F-BOS-009');
  });
});

describe('federal odometer disclosure (49 CFR 580.17)', () => {
  it('model year 2010 or earlier is exempt once the sale is 10 years on', () => {
    const d = completeSale();
    d.vehicle.year = 2010;
    d.transaction.saleDate = '2026-08-25';
    expect(odometerExemption(d)).toEqual({ exempt: true, reason: 'ten-year' });
  });

  it('model year 2011 or later needs 20 years', () => {
    const d = completeSale();
    d.vehicle.year = 2011;
    expect(odometerExemption(d).exempt).toBe(false);
    d.transaction.saleDate = '2031-01-02';
    expect(odometerExemption(d)).toEqual({ exempt: true, reason: 'twenty-year' });
  });

  it('a heavy vehicle and a trailer are exempt', () => {
    const heavy = completeSale();
    heavy.vehicle.gvwrOver16000 = 'yes';
    expect(odometerExemption(heavy).reason).toBe('gvwr');
    const trailer = completeSale();
    trailer.vehicle.selfPropelled = 'no';
    expect(odometerExemption(trailer).reason).toBe('not-self-propelled');
  });

  it('a missing disclosure is flagged only when required', () => {
    const d = completeSale();
    d.odometer = { readingMiles: null, status: '', sellerCertified: '', buyerAcknowledged: '' };
    expect(ids(d)).toContain('F-BOS-001');
    d.vehicle.gvwrOver16000 = 'yes';
    expect(ids(d)).not.toContain('F-BOS-001');
    expect(ids(d)).toContain('F-BOS-015');
  });
});

describe('VIN', () => {
  it('accepts a valid 17-character VIN', () => {
    expect(vinCheckDigit('1M8GDM9AXKP042788')).toBe('X');
    const d = completeSale();
    d.vehicle.vin = '1M8GDM9AXKP042788';
    expect(vinProblem(d)).toBe('');
  });

  it('rejects illegal letters, a wrong length, and a wrong check digit', () => {
    const d = completeSale();
    d.vehicle.vin = '1M8GDM9AXKP04278O';
    expect(vinProblem(d)).toBe('characters');
    d.vehicle.vin = '1M8GDM9A';
    expect(vinProblem(d)).toBe('length');
    d.vehicle.vin = '1M8GDM9A1KP042788';
    expect(vinProblem(d)).toBe('check-digit');
  });

  it('allows a short VIN on a pre-1981 vehicle', () => {
    const d = completeSale();
    d.vehicle.year = 1975;
    d.vehicle.vin = 'ABC12345';
    expect(vinProblem(d)).toBe('');
  });
});

describe('state rules', () => {
  it('knows the verified states and falls back for others', () => {
    expect(stateRule('wa').known).toBe(true);
    expect(stateRule('WA').rule.sellerNoticeDays).toBe(5);
    expect(stateRule('MN').known).toBe(false);
  });

  it('flags missing notarization where the state requires it', () => {
    const d = completeSale();
    d.transaction.state = 'OH';
    d.terms.notarized = 'no';
    expect(ids(d)).toContain('F-BOS-007');
    expect(deriveCompletenessClass(d)).toBe('incomplete');
    d.terms.notarized = 'yes';
    expect(ids(d)).not.toContain('F-BOS-007');
  });

  it('raises verify-state-rule for a state outside the table', () => {
    const d = completeSale();
    d.transaction.state = 'MN';
    expect(ids(d)).toContain('F-BOS-014');
  });
});

describe('deadlines', () => {
  it('counts whole days between ISO dates', () => {
    expect(daysBetween('2026-08-01', '2026-08-31')).toBe(30);
  });

  it('flags a late release of liability and a late buyer application', () => {
    const d = completeSale();
    d.afterSale.releaseFiledDate = '2026-10-01';
    d.afterSale.buyerTitleApplicationDate = '2026-10-05';
    expect(ids(d)).toContain('F-BOS-011');
    expect(ids(d)).toContain('F-BOS-012');
  });

  it('flags an unfiled release inside and after the window differently', () => {
    const inside = completeSale();
    inside.transaction.saleDate = '2026-09-01';
    inside.afterSale = {
      ...inside.afterSale,
      releaseOfLiabilityFiled: 'no',
      releaseFiledDate: null
    };
    const flag = detectFlaggedIssues(inside).find((f) => f.id === 'F-BOS-011');
    expect(flag?.priority).toBe('medium');
    const after = completeSale();
    after.transaction.state = 'CA';
    after.transaction.saleDate = '2026-08-01';
    after.afterSale = { ...after.afterSale, releaseOfLiabilityFiled: 'no', releaseFiledDate: null };
    expect(detectFlaggedIssues(after).find((f) => f.id === 'F-BOS-011')?.priority).toBe('high');
  });
});

describe('flag ordering', () => {
  it('sorts high before medium before low', () => {
    const d = createDefaultBillOfSale();
    const order = { high: 0, medium: 1, low: 2 } as const;
    const flags = detectFlaggedIssues(d);
    for (let i = 1; i < flags.length; i++) {
      expect(order[flags[i - 1].priority]).toBeLessThanOrEqual(order[flags[i].priority]);
    }
  });
});

describe('persona oracle (examples/personas.json)', () => {
  for (const p of personas.personas) {
    it(`${p.name}`, () => {
      const state = p.state as unknown as BillOfSale;
      const result = validateBillOfSale(state);
      expect(result.completenessClass).toBe(p.expected.completenessClass);
      expect(result.odometerExempt).toBe(p.expected.odometerExempt);
      expect(result.stateRuleKnown).toBe(p.expected.stateRuleKnown);
      expect(detectFlaggedIssues(state)).toEqual(p.expected.flaggedIssues);
    });
  }
});
