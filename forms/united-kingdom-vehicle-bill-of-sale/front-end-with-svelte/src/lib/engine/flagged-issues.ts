import type { BillOfSale, FlaggedIssue } from './types';
import {
  bothSigned,
  descriptionMismatch,
  faultsNotRecorded,
  financeOutstanding,
  financeUnchecked,
  motIssue,
  noMileage,
  noVin,
  paymentRisk,
  sellerNotKeeper,
  traderSale,
  v5cMismatch,
  v5cMissing
} from './bill-of-sale-rules';
import { paymentMethodLabel } from './utils';

/**
 * Detect seller- and buyer-facing completeness, risk, and advice flags,
 * computed INDEPENDENTLY of the classification (spec §5):
 *
 *   HIGH   no VIN, no mileage, finance outstanding, V5C missing, V5C mismatch,
 *          seller not the registered keeper, description mismatch
 *   MEDIUM payment risk, finance unchecked, MOT issue, trader sale, unsigned,
 *          V5C/2 new keeper slip not given
 *   LOW    DVLA not yet told, sold as seen with no faults recorded
 *
 * Rows mirror the `united_kingdom_vehicle_bill_of_sale_grade_flag` SQL table.
 * Documentation support, not legal advice.
 */
const ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };

export function detectFlaggedIssues(d: BillOfSale): FlaggedIssue[] {
  const flags: FlaggedIssue[] = [];
  const add = (
    id: string,
    category: string,
    priority: FlaggedIssue['priority'],
    description: string,
    suggestedAction: string
  ) => flags.push({ id, category, priority, description, suggestedAction });

  if (noVin(d)) {
    add(
      'F-NO-VIN-001',
      'no-vin',
      'high',
      'No usable vehicle identification number (VIN) is recorded.',
      'Copy the VIN from the V5C and check it matches the number on the vehicle itself.'
    );
  }
  if (noMileage(d)) {
    add(
      'F-NO-MILEAGE-001',
      'no-mileage',
      'high',
      'No odometer reading is recorded.',
      'Record the mileage shown at handover, and compare it with the MOT history.'
    );
  }
  if (financeOutstanding(d)) {
    add(
      'F-FINANCE-OUTSTANDING-001',
      'finance-outstanding',
      'high',
      'Finance is recorded as outstanding. The lender may still own the vehicle and could repossess it from the buyer.',
      'Do not complete the sale until the finance is settled and the lender confirms it in writing.'
    );
  }
  if (v5cMissing(d)) {
    add(
      'F-V5C-MISSING-001',
      'v5c-missing',
      'high',
      'The seller does not have the V5C registration certificate (log book).',
      'The seller should apply to DVLA for a replacement before selling; a buyer should be very cautious without one.'
    );
  }
  if (v5cMismatch(d)) {
    add(
      'F-V5C-MISMATCH-001',
      'v5c-mismatch',
      'high',
      'The V5C details do not match the vehicle or the seller.',
      'Resolve the difference with DVLA before the sale goes ahead.'
    );
  }
  if (sellerNotKeeper(d)) {
    add(
      'F-SELLER-NOT-KEEPER-001',
      'seller-not-keeper',
      'high',
      'The seller is not the registered keeper named on the V5C. The seller may have no right to sell.',
      'Ask the registered keeper to sell, or have the keeper change recorded with DVLA first.'
    );
  }
  if (descriptionMismatch(d)) {
    add(
      'F-DESCRIPTION-MISMATCH-001',
      'description-mismatch',
      'high',
      'The vehicle does not match the advert or description. Under the Sale of Goods Act 1979 s.13 goods sold by description must correspond with it, even in a private sale.',
      'Correct the description in writing or agree a new price before signing; keep the advert as evidence.'
    );
  }
  if (paymentRisk(d)) {
    const m = d.payment.paymentMethod
      ? ` (${paymentMethodLabel(d.payment.paymentMethod).toLowerCase()})`
      : '';
    add(
      'F-PAYMENT-RISK-001',
      'payment-risk',
      'medium',
      `The payment arrangement carries risk${m}: cash at £1,000 or more, an uncleared cheque, or funds not yet received.`,
      'Prefer a bank transfer, hand over the vehicle only once funds have cleared, and keep proof of payment.'
    );
  }
  if (financeUnchecked(d) && !financeOutstanding(d)) {
    add(
      'F-FINANCE-UNCHECKED-001',
      'finance-unchecked',
      'medium',
      'Outstanding finance has not been checked.',
      'Run a vehicle history check to confirm there is no finance, theft marker, or write-off record.'
    );
  }
  if (motIssue(d)) {
    add(
      'F-MOT-ISSUE-001',
      'mot-issue',
      'medium',
      'The vehicle is over three years old and has no current MOT.',
      'The vehicle needs a current MOT to be driven on the road, apart from driving to a pre-booked test.'
    );
  }
  if (traderSale(d)) {
    add(
      'F-TRADER-SALE-001',
      'trader-sale',
      'medium',
      'The seller sells as a trader. The Consumer Rights Act 2015 applies, and "sold as seen" cannot remove the buyer\'s statutory rights.',
      'Treat this as a trade sale, not a private sale, and give the buyer the statutory protections.'
    );
  }
  if (!bothSigned(d)) {
    add(
      'F-UNSIGNED-001',
      'unsigned',
      'medium',
      'The bill of sale is not signed by both the seller and the buyer.',
      'Both parties should sign and date it, and each keep a copy.'
    );
  }
  if (d.dvla.newKeeperSlipGiven === 'no') {
    add(
      'F-KEEPER-SLIP-001',
      'keeper-slip',
      'medium',
      'The V5C/2 new keeper section has not been given to the buyer.',
      'Give the buyer the V5C/2 new keeper section as proof of purchase until the new V5C arrives.'
    );
  }
  if (d.dvla.dvlaNotification === 'not-yet') {
    add(
      'F-DVLA-NOTIFICATION-001',
      'dvla-notification',
      'low',
      'DVLA has not yet been told about the sale.',
      'The seller should tell DVLA at once, online or by post, so vehicle tax is cancelled and any refund can be claimed.'
    );
  }
  if (faultsNotRecorded(d)) {
    add(
      'F-FAULTS-NOT-RECORDED-001',
      'faults-not-recorded',
      'low',
      'The vehicle is sold as seen but no known faults are recorded.',
      'Record any known faults so both parties agree what the buyer was told.'
    );
  }

  return flags
    .map((f, i) => ({ f, i }))
    .sort((a, b) => ORDER[a.f.priority] - ORDER[b.f.priority] || a.i - b.i)
    .map((x) => x.f);
}
