import { describe, it, expect } from 'vitest';
import { assessBillOfSale, deriveClassification } from './bill-of-sale-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { missingItems, noVin, paymentRisk, riskConditions } from './bill-of-sale-rules';
import type { BillOfSale } from './types';

/**
 * A blank bill of sale (mirrors the store's `createDefaultBillOfSale`). Defined
 * locally so the engine tests never import the store, which pulls in the
 * SvelteKit-only `$app/env` module.
 */
function blank(): BillOfSale {
  return {
    sale: { saleDate: null, salePlace: '', sellerCapacity: '' },
    seller: { name: '', address: '', postcode: '', phone: '', email: '', isRegisteredKeeper: '' },
    buyer: { name: '', address: '', postcode: '', phone: '', email: '' },
    vehicle: {
      registration: '',
      make: '',
      model: '',
      colour: '',
      vin: '',
      firstRegisteredYear: null,
      fuelType: '',
      mileage: null,
      mileageAccuracy: ''
    },
    checks: {
      v5cPresent: '',
      v5cDetailsMatch: '',
      motStatus: '',
      motExpiryDate: null,
      financeStatus: '',
      financeCheckDate: null
    },
    payment: { priceAsGbp: null, depositAsGbp: null, paymentMethod: '', paymentReceived: '' },
    condition: { saleTerms: '', knownFaults: '', descriptionMatchesAdvert: '' },
    dvla: { newKeeperSlipGiven: '', dvlaNotification: '' },
    signatures: { sellerSigned: '', buyerSigned: '', signatureDate: null, note: '' }
  };
}

/** A complete sale with no risk conditions and no flags. */
function complete(): BillOfSale {
  const d = blank();
  d.sale = { saleDate: '2026-08-15', salePlace: 'Leeds', sellerCapacity: 'private' };
  d.seller = {
    name: 'Hannah Whitfield',
    address: '14 Mill Lane, Leeds',
    postcode: 'LS6 2AB',
    phone: '',
    email: '',
    isRegisteredKeeper: 'yes'
  };
  d.buyer = {
    name: 'Omar Siddiqui',
    address: '3 Park Row, Bradford',
    postcode: 'BD1 5HT',
    phone: '',
    email: ''
  };
  d.vehicle = {
    registration: 'LB68 KXR',
    make: 'Ford',
    model: 'Focus',
    colour: 'Blue',
    vin: 'WF0XXXGCDXJK12345',
    firstRegisteredYear: 2018,
    fuelType: 'petrol',
    mileage: 48210,
    mileageAccuracy: 'recorded'
  };
  d.checks = {
    v5cPresent: 'yes',
    v5cDetailsMatch: 'yes',
    motStatus: 'valid',
    motExpiryDate: '2027-03-02',
    financeStatus: 'none',
    financeCheckDate: '2026-08-10'
  };
  d.payment = {
    priceAsGbp: 6500,
    depositAsGbp: 500,
    paymentMethod: 'bank-transfer',
    paymentReceived: 'yes'
  };
  d.condition = {
    saleTerms: 'sold-as-seen',
    knownFaults: 'Small scratch on the rear bumper.',
    descriptionMatchesAdvert: 'yes'
  };
  d.dvla = { newKeeperSlipGiven: 'yes', dvlaNotification: 'online' };
  d.signatures = {
    sellerSigned: 'yes',
    buyerSigned: 'yes',
    signatureDate: '2026-08-15',
    note: ''
  };
  return d;
}

const categories = (d: BillOfSale) => detectFlaggedIssues(d).map((f) => f.category);

describe('Vehicle bill of sale classification engine', () => {
  it('classifies a complete, risk-free sale as complete with no flags', () => {
    const d = complete();
    const r = assessBillOfSale(d);
    expect(r.classification).toBe('complete');
    expect(r.missingItemCount).toBe(0);
    expect(r.riskFlagCount).toBe(0);
    expect(r.flaggedIssues).toEqual([]);
  });

  it('classifies a blank bill of sale as incomplete', () => {
    const d = blank();
    expect(deriveClassification(d)).toBe('incomplete');
    expect(missingItems(d).length).toBe(18);
  });

  it('flags a missing VIN and mileage as incomplete', () => {
    const d = complete();
    d.vehicle.vin = '';
    d.vehicle.mileage = null;
    expect(deriveClassification(d)).toBe('incomplete');
    expect(categories(d)).toEqual(['no-vin', 'no-mileage']);
  });

  it('treats a short VIN as no VIN', () => {
    const d = complete();
    d.vehicle.vin = 'ABC123';
    expect(noVin(d)).toBe(true);
  });

  it.each([
    ['finance outstanding', (d: BillOfSale) => (d.checks.financeStatus = 'outstanding')],
    ['seller not keeper', (d: BillOfSale) => (d.seller.isRegisteredKeeper = 'no')],
    ['V5C missing', (d: BillOfSale) => (d.checks.v5cPresent = 'no')],
    ['V5C mismatch', (d: BillOfSale) => (d.checks.v5cDetailsMatch = 'no')],
    ['description mismatch', (d: BillOfSale) => (d.condition.descriptionMatchesAdvert = 'no')]
  ])('classifies %s as risk-flagged', (_name, mutate) => {
    const d = complete();
    mutate(d);
    expect(deriveClassification(d)).toBe('risk-flagged');
    expect(riskConditions(d).length).toBe(1);
  });

  it('gives risk-flagged precedence over incomplete', () => {
    const d = blank();
    d.checks.financeStatus = 'outstanding';
    expect(deriveClassification(d)).toBe('risk-flagged');
    expect(assessBillOfSale(d).missingItemCount).toBeGreaterThan(0);
  });

  it('flags cash at 1000 pounds or more, but not below', () => {
    const d = complete();
    d.payment.paymentMethod = 'cash';
    d.payment.priceAsGbp = 999;
    expect(paymentRisk(d)).toBe(false);
    d.payment.priceAsGbp = 1000;
    expect(paymentRisk(d)).toBe(true);
    expect(categories(d)).toContain('payment-risk');
  });

  it('flags an uncleared cheque and funds not received', () => {
    const d = complete();
    d.payment.paymentMethod = 'cheque';
    d.payment.paymentReceived = '';
    expect(paymentRisk(d)).toBe(true);
    const e = complete();
    e.payment.paymentReceived = 'no';
    expect(paymentRisk(e)).toBe(true);
  });

  it('flags missing signatures as incomplete with an unsigned flag', () => {
    const d = complete();
    d.signatures.sellerSigned = 'no';
    expect(deriveClassification(d)).toBe('incomplete');
    expect(categories(d)).toContain('unsigned');
  });

  it('flags an expired MOT only on a vehicle over three years old', () => {
    const d = complete();
    d.checks.motStatus = 'expired';
    expect(categories(d)).toContain('mot-issue');
    d.vehicle.firstRegisteredYear = 2025;
    expect(categories(d)).not.toContain('mot-issue');
  });

  it('flags a trader sale, a missing keeper slip, DVLA not told, and unrecorded faults', () => {
    const d = complete();
    d.sale.sellerCapacity = 'trader';
    d.dvla.newKeeperSlipGiven = 'no';
    d.dvla.dvlaNotification = 'not-yet';
    d.condition.knownFaults = '';
    expect(categories(d)).toEqual([
      'trader-sale',
      'keeper-slip',
      'dvla-notification',
      'faults-not-recorded'
    ]);
  });

  it('flags unchecked finance as medium and treats it as answered', () => {
    const d = complete();
    d.checks.financeStatus = 'unchecked';
    expect(deriveClassification(d)).toBe('complete');
    expect(categories(d)).toEqual(['finance-unchecked']);
  });

  it('sorts flags high, then medium, then low', () => {
    const d = blank();
    const order = detectFlaggedIssues(d).map((f) => f.priority);
    const sorted = [...order].sort(
      (a, b) => ({ high: 0, medium: 1, low: 2 })[a] - { high: 0, medium: 1, low: 2 }[b]
    );
    expect(order).toEqual(sorted);
  });
});
