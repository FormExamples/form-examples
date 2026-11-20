// Declarative United States vehicle bill-of-sale rules.
//
// This form is a DOCUMENTATION-SUPPORT and COMPLETENESS-CLASSIFICATION
// instrument, not legal advice. This module holds the primitive predicates the
// grader (`grader.js`) and the flag detector (`flags.js`) compose (spec §4):
//
//   - the federal odometer-disclosure exemption test (49 CFR 580.17),
//   - the VIN structural and check-digit test (ISO 3779 / 49 CFR 565),
//   - the STATE_RULES table (notarization, deadlines, official forms) and its
//     uniform default for a state not in the table,
//   - the missing-item and risk predicates.
//
// Federal law (49 CFR Part 580) applies in every state. State law varies, so the
// state table below encodes only the rules whose values were checked against an
// agency page or, where flagged `verified: 'secondary'`, a secondary guide; the
// issuing state agency decides, and every state rule should be re-verified.

import type { BillOfSale } from './types';

export const nonEmpty = (s: unknown): boolean => typeof s === 'string' && s.trim() !== '';

/** The 50 states, the District of Columbia, and territories as USPS codes. */
export const STATE_CODES: string[] = [
  'AL',
  'AK',
  'AZ',
  'AR',
  'CA',
  'CO',
  'CT',
  'DE',
  'DC',
  'FL',
  'GA',
  'HI',
  'ID',
  'IL',
  'IN',
  'IA',
  'KS',
  'KY',
  'LA',
  'ME',
  'MD',
  'MA',
  'MI',
  'MN',
  'MS',
  'MO',
  'MT',
  'NE',
  'NV',
  'NH',
  'NJ',
  'NM',
  'NY',
  'NC',
  'ND',
  'OH',
  'OK',
  'OR',
  'PA',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VT',
  'VA',
  'WA',
  'WV',
  'WI',
  'WY',
  'PR',
  'GU',
  'VI',
  'AS',
  'MP'
];

/**
 * State rules for a private-party vehicle sale.
 *   billOfSale        'recommended' | 'official-form' (the state publishes a form
 *                     its agency expects) | 'required'
 *   billOfSaleForm    name of the official form, '' when none
 *   notary            'none' | 'title' (title signatures notarized) |
 *                     'bill-of-sale' (bill of sale notarized)
 *   sellerNoticeDays  days within which the seller must notify the agency of the
 *                     sale (release of liability); null when no deadline found
 *   sellerNoticeForm  name of the notice, '' when none
 *   buyerTransferDays days within which the buyer must apply to title; null
 *   taxNote           one-line sales / use tax basis
 *   verified          'agency' (an agency or form page was read) | 'secondary'
 */
export interface StateRule {
  name: string;
  billOfSale: 'recommended' | 'official-form' | 'required';
  billOfSaleForm: string;
  notary: 'none' | 'title' | 'bill-of-sale';
  sellerNoticeDays: number | null;
  sellerNoticeForm: string;
  buyerTransferDays: number | null;
  taxNote: string;
  verified: 'agency' | 'secondary' | 'default';
}

export const STATE_RULES: Record<string, StateRule> = {
  CA: {
    name: 'California',
    billOfSale: 'recommended',
    billOfSaleForm: '',
    notary: 'none',
    sellerNoticeDays: 5,
    sellerNoticeForm: 'Notice of Transfer and Release of Liability (REG 138)',
    buyerTransferDays: 10,
    taxNote: "Use tax at the buyer's county rate, collected at transfer.",
    verified: 'agency'
  },
  NY: {
    name: 'New York',
    billOfSale: 'official-form',
    billOfSaleForm: 'MV-912 Bill of Sale',
    notary: 'none',
    sellerNoticeDays: null,
    sellerNoticeForm: '',
    buyerTransferDays: null,
    taxNote: 'Buyer pays sales tax at the DMV; DTF-802 states the transaction.',
    verified: 'secondary'
  },
  TX: {
    name: 'Texas',
    billOfSale: 'recommended',
    billOfSaleForm: 'Form 130-U (signed by both parties, shows the price)',
    notary: 'none',
    sellerNoticeDays: 30,
    sellerNoticeForm: 'Vehicle Transfer Notification',
    buyerTransferDays: 30,
    taxNote: '6.25% of the price or the standard presumptive value, whichever is higher.',
    verified: 'agency'
  },
  FL: {
    name: 'Florida',
    billOfSale: 'recommended',
    billOfSaleForm: 'HSMV 82050 Notice of Sale and Bill of Sale',
    notary: 'none',
    sellerNoticeDays: 30,
    sellerNoticeForm: 'Notice of Sale (HSMV 82050 or the title back)',
    buyerTransferDays: 30,
    taxNote: '6% state sales tax plus any county surtax, collected at titling.',
    verified: 'secondary'
  },
  IL: {
    name: 'Illinois',
    billOfSale: 'recommended',
    billOfSaleForm: '',
    notary: 'none',
    sellerNoticeDays: null,
    sellerNoticeForm: "Seller's report of sale",
    buyerTransferDays: 20,
    taxNote: 'Private party vehicle use tax on Form RUT-50, by price or age.',
    verified: 'secondary'
  },
  PA: {
    name: 'Pennsylvania',
    billOfSale: 'recommended',
    billOfSaleForm: 'MV-4ST (price and mileage, buyer)',
    notary: 'title',
    sellerNoticeDays: null,
    sellerNoticeForm: '',
    buyerTransferDays: 20,
    taxNote: '6% state sales tax plus local tax, reported on MV-4ST.',
    verified: 'agency'
  },
  OH: {
    name: 'Ohio',
    billOfSale: 'recommended',
    billOfSaleForm: '',
    notary: 'title',
    sellerNoticeDays: null,
    sellerNoticeForm: '',
    buyerTransferDays: 30,
    taxNote: 'Sales tax on the price at the county rate, collected by the clerk of courts.',
    verified: 'secondary'
  },
  WA: {
    name: 'Washington',
    billOfSale: 'official-form',
    billOfSaleForm: 'Vehicle/Vessel Bill of Sale (420-065)',
    notary: 'none',
    sellerNoticeDays: 5,
    sellerNoticeForm: 'Report of Sale',
    buyerTransferDays: 15,
    taxNote: "Sales or use tax at the buyer's location when titling.",
    verified: 'agency'
  },
  LA: {
    name: 'Louisiana',
    billOfSale: 'required',
    billOfSaleForm: '',
    notary: 'bill-of-sale',
    sellerNoticeDays: null,
    sellerNoticeForm: '',
    buyerTransferDays: null,
    taxNote: 'State and parish sales tax at titling.',
    verified: 'secondary'
  }
};

/**
 * The uniform default used for a state not in STATE_RULES: a bill of sale is
 * recommended, no notarization, no deadlines. The engine raises a "verify state
 * rule" flag whenever it applies.
 */
export const DEFAULT_RULE: StateRule = {
  name: 'Uniform default',
  billOfSale: 'recommended',
  billOfSaleForm: '',
  notary: 'none',
  sellerNoticeDays: null,
  sellerNoticeForm: '',
  buyerTransferDays: null,
  taxNote: 'Sales or use tax is due when the buyer titles the vehicle.',
  verified: 'default'
};

/**
 * Look up the state rule.
 * @param code two-letter USPS code
 */
export function stateRule(code: string): { rule: StateRule; known: boolean } {
  const key = String(code || '').toUpperCase();
  if (Object.prototype.hasOwnProperty.call(STATE_RULES, key)) {
    return { rule: STATE_RULES[key], known: true };
  }
  return { rule: DEFAULT_RULE, known: false };
}

/** True when the state is a recognised USPS code. */
export function validStateCode(code: string): boolean {
  return STATE_CODES.indexOf(String(code || '').toUpperCase()) !== -1;
}

// ---------------------------------------------------------------------
// Dates
// ---------------------------------------------------------------------

/** @returns {string} today as an ISO date (the engine clock; frozen in tests). */
export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Whole days from ISO date `a` to ISO date `b`; NaN when either is unparseable. */
export function daysBetween(a: string | null, b: string | null): number {
  const x = Date.parse(`${a}T00:00:00Z`);
  const y = Date.parse(`${b}T00:00:00Z`);
  return Math.round((y - x) / 86400000);
}

/** The calendar year of the sale, or null. */
export function saleYear(d: BillOfSale): number | null {
  const s = d.transaction.saleDate;
  if (s === null || s.trim() === '') return null;
  const y = Number(s.slice(0, 4));
  return Number.isFinite(y) ? y : null;
}

// ---------------------------------------------------------------------
// Federal odometer disclosure (49 CFR Part 580)
// ---------------------------------------------------------------------

/**
 * The 49 CFR 580.17 exemption test.
 *   (a)(1) GVWR over 16,000 pounds
 *   (a)(2) not self-propelled
 *   (a)(3) model year 2010 or earlier, transferred at least 10 years after
 *          January 1 of the calendar year of its model year
 *   (a)(4) model year 2011 or later, transferred at least 20 years after
 *          January 1 of the calendar year of its model year
 * @param d
 */
export function odometerExemption(d: BillOfSale): {
  exempt: boolean;
  reason: '' | 'gvwr' | 'not-self-propelled' | 'ten-year' | 'twenty-year';
} {
  if (d.vehicle.gvwrOver16000 === 'yes') return { exempt: true, reason: 'gvwr' };
  if (d.vehicle.selfPropelled === 'no') return { exempt: true, reason: 'not-self-propelled' };
  const sy = saleYear(d);
  const my = d.vehicle.year;
  if (sy !== null && typeof my === 'number' && Number.isFinite(my)) {
    if (my <= 2010 && sy - my >= 10) return { exempt: true, reason: 'ten-year' };
    if (my >= 2011 && sy - my >= 20) return { exempt: true, reason: 'twenty-year' };
  }
  return { exempt: false, reason: '' };
}

/** True when the federal odometer disclosure is required for this sale. */
export function odometerRequired(d: BillOfSale): boolean {
  return !odometerExemption(d).exempt;
}

/** True when the seller certified the reading is not the actual mileage, or exceeds limits. */
export function odometerDiscrepancy(d: BillOfSale): boolean {
  return d.odometer.status === 'not-actual' || d.odometer.status === 'exceeds-mechanical-limits';
}

/**
 * The items of the odometer disclosure still missing when it is required
 * (49 CFR 580.5: reading, certification statement, both signatures, body type).
 * @param d
 */
export function odometerMissing(d: BillOfSale): string[] {
  if (!odometerRequired(d)) return [];
  const missing: string[] = [];
  if (typeof d.odometer.readingMiles !== 'number') missing.push('odometer reading');
  if (d.odometer.status === '') missing.push('mileage certification statement');
  if (d.odometer.sellerCertified !== 'yes') missing.push('seller signature on the disclosure');
  if (d.odometer.buyerAcknowledged !== 'yes') missing.push('buyer acknowledgement signature');
  return missing;
}

// ---------------------------------------------------------------------
// VIN
// ---------------------------------------------------------------------

const VIN_VALUES: Record<string, number> = {
  A: 1,
  B: 2,
  C: 3,
  D: 4,
  E: 5,
  F: 6,
  G: 7,
  H: 8,
  J: 1,
  K: 2,
  L: 3,
  M: 4,
  N: 5,
  P: 7,
  R: 9,
  S: 2,
  T: 3,
  U: 4,
  V: 5,
  W: 6,
  X: 7,
  Y: 8,
  Z: 9
};
const VIN_WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

/** Normalise a VIN: trim, upper-case, drop spaces and hyphens. */
export function normalizeVin(vin: string): string {
  return String(vin || '')
    .toUpperCase()
    .replace(/[\s-]+/g, '');
}

/**
 * The check digit a 17-character VIN should carry in position 9.
 * @param vin normalized 17-character VIN of legal characters
 */
export function vinCheckDigit(vin: string): string {
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    const c = vin[i];
    const v = /[0-9]/.test(c) ? Number(c) : VIN_VALUES[c];
    sum += v * VIN_WEIGHTS[i];
  }
  const r = sum % 11;
  return r === 10 ? 'X' : String(r);
}

/**
 * The structural problem with the VIN, or '' when it is acceptable. A vehicle
 * of model year 1981 or later carries a 17-character VIN with a check digit;
 * an older vehicle may carry a shorter manufacturer number, so only the
 * illegal characters I, O, and Q are rejected there. An empty VIN is "missing",
 * not "invalid".
 * @param d
 */
export function vinProblem(d: BillOfSale): '' | 'length' | 'characters' | 'check-digit' {
  const vin = normalizeVin(d.vehicle.vin);
  if (vin === '') return '';
  if (/[IOQ]/.test(vin) || /[^A-Z0-9]/.test(vin)) return 'characters';
  const my = d.vehicle.year;
  const modern = typeof my !== 'number' || my >= 1981;
  if (modern && vin.length !== 17) return 'length';
  if (vin.length === 17 && vinCheckDigit(vin) !== vin[8]) return 'check-digit';
  return '';
}

// ---------------------------------------------------------------------
// Missing-item predicates
// ---------------------------------------------------------------------

/** Labels of the seller / buyer details still missing. */
export function missingPartyDetails(d: BillOfSale): string[] {
  const missing: string[] = [];
  for (const key of ['seller', 'buyer'] as const) {
    const label = key;
    const p = d[key];
    if (!nonEmpty(p.name)) missing.push(`${label} printed name`);
    if (!nonEmpty(p.streetAddress)) missing.push(`${label} street address`);
    if (!nonEmpty(p.city)) missing.push(`${label} city`);
    if (!nonEmpty(p.state)) missing.push(`${label} state`);
    if (!nonEmpty(p.postalCode)) missing.push(`${label} ZIP code`);
  }
  return missing;
}

/** Labels of the signatures still missing. */
export function missingSignatures(d: BillOfSale): string[] {
  const missing: string[] = [];
  if (d.seller.signed !== 'yes') missing.push('seller signature');
  if (d.buyer.signed !== 'yes') missing.push('buyer signature');
  return missing;
}

/** Labels of the sale and vehicle details still missing. */
export function missingTerms(d: BillOfSale): string[] {
  const missing: string[] = [];
  if (!nonEmpty(d.transaction.state)) missing.push('state');
  if (!nonEmpty(d.transaction.saleDate)) missing.push('date of sale');
  if (typeof d.transaction.salePriceAsUsd !== 'number') missing.push('sale price');
  if (typeof d.vehicle.year !== 'number') missing.push('vehicle year');
  if (!nonEmpty(d.vehicle.make)) missing.push('vehicle make');
  if (!nonEmpty(d.vehicle.model)) missing.push('vehicle model');
  if (!nonEmpty(d.vehicle.vin)) missing.push('VIN');
  if (odometerRequired(d) && !nonEmpty(d.vehicle.bodyType)) missing.push('vehicle body type');
  if (d.terms.asIsClause === '') missing.push('as-is or warranty statement');
  if (d.terms.asIsClause === 'warranty' && !nonEmpty(d.terms.warrantyNote))
    missing.push('warranty description');
  if (d.terms.lienStatus === '') missing.push('lien status');
  if (d.terms.sellerHoldsTitle === '') missing.push('whether the seller holds the title');
  return missing;
}

/** True when the title is held but not yet signed over to the buyer. */
export function titleNotSigned(d: BillOfSale): boolean {
  return d.terms.sellerHoldsTitle === 'yes' && d.terms.titleSigned !== 'yes';
}

/** True when the state requires notarization and it is not recorded as done. */
export function notarizationMissing(d: BillOfSale): boolean {
  const { rule } = stateRule(d.transaction.state);
  return rule.notary !== 'none' && d.terms.notarized !== 'yes';
}

/** True when the title carries a brand that the buyer must be told about. */
export function brandedTitle(d: BillOfSale): boolean {
  return ['salvage', 'rebuilt', 'flood', 'lemon', 'junk'].indexOf(d.vehicle.titleBrand) !== -1;
}

/** True when a lien is recorded as outstanding. */
export function lienOutstanding(d: BillOfSale): boolean {
  return d.terms.lienStatus === 'outstanding';
}

/** True when the seller says they do not hold the title. */
export function noTitleInHand(d: BillOfSale): boolean {
  return d.terms.sellerHoldsTitle === 'no';
}

/**
 * True when any risk condition is present (spec §4): an odometer discrepancy,
 * an invalid VIN, an outstanding lien, no title in hand, or a branded title.
 * @param d
 */
export function riskIndicated(d: BillOfSale): boolean {
  return (
    odometerDiscrepancy(d) ||
    vinProblem(d) !== '' ||
    lienOutstanding(d) ||
    noTitleInHand(d) ||
    brandedTitle(d)
  );
}

/**
 * True when any required item is missing (spec §4).
 * @param d
 */
export function incompleteIndicated(d: BillOfSale): boolean {
  return (
    missingPartyDetails(d).length > 0 ||
    missingSignatures(d).length > 0 ||
    missingTerms(d).length > 0 ||
    odometerMissing(d).length > 0 ||
    titleNotSigned(d) ||
    notarizationMissing(d)
  );
}
