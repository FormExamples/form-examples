import type { BillOfSale, RuleHit } from './types';

// Declarative United Kingdom Vehicle Bill of Sale completeness and risk rules.
//
// This form is a COMPLETENESS and VALIDITY instrument, not a scored assessment.
// It is documentation support, not legal advice. This module holds the
// primitive predicates the grader and the flag detector compose (spec §4).
// Nothing here decides who owns a vehicle or what a buyer's legal rights are.

export const nonEmpty = (s: string | null | undefined): boolean =>
  typeof s === 'string' && s.trim() !== '';

/** Minimum plausible length of a VIN / chassis number. */
export const VIN_MIN_LENGTH = 11;

/** Cash payments at or above this many pounds are flagged. */
export const CASH_RISK_THRESHOLD_GBP = 1000;

/** True when the VIN is missing or too short to be a real VIN. */
export function noVin(d: BillOfSale): boolean {
  return !nonEmpty(d.vehicle.vin) || d.vehicle.vin.trim().length < VIN_MIN_LENGTH;
}

/** True when no odometer reading is recorded. */
export function noMileage(d: BillOfSale): boolean {
  return d.vehicle.mileage === null || d.vehicle.mileage === undefined;
}

/** True when the price is missing or not above zero. */
export function noPrice(d: BillOfSale): boolean {
  const p = d.payment.priceAsGbp;
  return p === null || p === undefined || !(p > 0);
}

/** Finance is recorded as outstanding. */
export function financeOutstanding(d: BillOfSale): boolean {
  return d.checks.financeStatus === 'outstanding';
}

/** Finance was not checked (explicitly unchecked or unanswered). */
export function financeUnchecked(d: BillOfSale): boolean {
  return d.checks.financeStatus === 'unchecked' || d.checks.financeStatus === '';
}

/** The seller has no V5C. */
export function v5cMissing(d: BillOfSale): boolean {
  return d.checks.v5cPresent === 'no';
}

/** The V5C details do not match the vehicle or the seller. */
export function v5cMismatch(d: BillOfSale): boolean {
  return d.checks.v5cDetailsMatch === 'no';
}

/** The seller is not the registered keeper. */
export function sellerNotKeeper(d: BillOfSale): boolean {
  return d.seller.isRegisteredKeeper === 'no';
}

/** The vehicle does not match its advert or description. */
export function descriptionMismatch(d: BillOfSale): boolean {
  return d.condition.descriptionMatchesAdvert === 'no';
}

/** Seller sells as a trader. */
export function traderSale(d: BillOfSale): boolean {
  return d.sale.sellerCapacity === 'trader';
}

/** Both parties have signed. */
export function bothSigned(d: BillOfSale): boolean {
  return d.signatures.sellerSigned === 'yes' && d.signatures.buyerSigned === 'yes';
}

/**
 * Payment-method risk: cash at or above the threshold, a cheque that has not
 * cleared, or funds not yet received.
 */
export function paymentRisk(d: BillOfSale): boolean {
  const { paymentMethod, paymentReceived, priceAsGbp } = d.payment;
  const price = priceAsGbp === null || priceAsGbp === undefined ? 0 : priceAsGbp;
  if (paymentMethod === 'cash' && price >= CASH_RISK_THRESHOLD_GBP) return true;
  if (paymentMethod === 'cheque' && paymentReceived !== 'yes') return true;
  if (paymentReceived === 'no') return true;
  return false;
}

/** The year used to judge vehicle age: the sale year, else the current year. */
function referenceYear(d: BillOfSale): number {
  const sd = d.sale.saleDate;
  if (nonEmpty(sd) && /^\d{4}/.test(sd as string)) return Number((sd as string).slice(0, 4));
  return new Date().getFullYear();
}

/** The vehicle is at least three years old (needs an MOT). */
export function vehicleOverThreeYears(d: BillOfSale): boolean {
  const y = d.vehicle.firstRegisteredYear;
  if (y === null || y === undefined) return false;
  return referenceYear(d) - y >= 3;
}

/** MOT is expired or absent on a vehicle old enough to need one. */
export function motIssue(d: BillOfSale): boolean {
  return (
    (d.checks.motStatus === 'expired' || d.checks.motStatus === 'none') && vehicleOverThreeYears(d)
  );
}

/** "Sold as seen" with no faults recorded. */
export function faultsNotRecorded(d: BillOfSale): boolean {
  return d.condition.saleTerms === 'sold-as-seen' && !nonEmpty(d.condition.knownFaults);
}

/** The required items still empty. */
export function missingItems(d: BillOfSale): RuleHit[] {
  const out: RuleHit[] = [];
  const need = (cond: boolean, id: string, dimension: string, label: string) => {
    if (cond) out.push({ id, dimension, label });
  };
  need(!nonEmpty(d.sale.saleDate), 'R-MISSING-SALE-DATE-01', 'parties', 'Date of sale');
  need(!nonEmpty(d.seller.name), 'R-MISSING-SELLER-NAME-01', 'parties', 'Seller name');
  need(!nonEmpty(d.seller.address), 'R-MISSING-SELLER-ADDRESS-01', 'parties', 'Seller address');
  need(!nonEmpty(d.buyer.name), 'R-MISSING-BUYER-NAME-01', 'parties', 'Buyer name');
  need(!nonEmpty(d.buyer.address), 'R-MISSING-BUYER-ADDRESS-01', 'parties', 'Buyer address');
  need(
    !nonEmpty(d.seller.isRegisteredKeeper),
    'R-MISSING-KEEPER-01',
    'parties',
    'Whether the seller is the registered keeper'
  );
  need(
    !nonEmpty(d.vehicle.registration),
    'R-MISSING-REGISTRATION-01',
    'vehicle',
    'Registration number'
  );
  need(!nonEmpty(d.vehicle.make), 'R-MISSING-MAKE-01', 'vehicle', 'Make');
  need(!nonEmpty(d.vehicle.model), 'R-MISSING-MODEL-01', 'vehicle', 'Model');
  need(noVin(d), 'R-MISSING-VIN-01', 'vehicle', 'Vehicle identification number (VIN)');
  need(noMileage(d), 'R-MISSING-MILEAGE-01', 'vehicle', 'Mileage');
  need(!nonEmpty(d.checks.v5cPresent), 'R-MISSING-V5C-01', 'vehicle', 'Whether the V5C is present');
  need(
    !nonEmpty(d.checks.financeStatus),
    'R-MISSING-FINANCE-01',
    'vehicle',
    'Outstanding finance status'
  );
  need(noPrice(d), 'R-MISSING-PRICE-01', 'price', 'Price');
  need(
    !nonEmpty(d.payment.paymentMethod),
    'R-MISSING-PAYMENT-METHOD-01',
    'price',
    'Payment method'
  );
  need(!nonEmpty(d.condition.saleTerms), 'R-MISSING-SALE-TERMS-01', 'condition', 'Sale terms');
  need(
    d.signatures.sellerSigned !== 'yes',
    'R-MISSING-SELLER-SIGNATURE-01',
    'signatures',
    'Seller signature'
  );
  need(
    d.signatures.buyerSigned !== 'yes',
    'R-MISSING-BUYER-SIGNATURE-01',
    'signatures',
    'Buyer signature'
  );
  return out;
}

/** The risk conditions that hold. */
export function riskConditions(d: BillOfSale): RuleHit[] {
  const out: RuleHit[] = [];
  if (financeOutstanding(d))
    out.push({ id: 'R-RISK-FINANCE-01', dimension: 'vehicle', label: 'Finance outstanding' });
  if (sellerNotKeeper(d))
    out.push({
      id: 'R-RISK-KEEPER-01',
      dimension: 'parties',
      label: 'Seller is not the registered keeper'
    });
  if (v5cMissing(d))
    out.push({ id: 'R-RISK-V5C-MISSING-01', dimension: 'vehicle', label: 'V5C not present' });
  if (v5cMismatch(d))
    out.push({
      id: 'R-RISK-V5C-MISMATCH-01',
      dimension: 'vehicle',
      label: 'V5C details do not match'
    });
  if (descriptionMismatch(d))
    out.push({
      id: 'R-RISK-DESCRIPTION-01',
      dimension: 'condition',
      label: 'Vehicle does not match its description'
    });
  return out;
}
