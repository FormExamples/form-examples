// ──────────────────────────────────────────────
// Core data types (United States Vehicle Bill of Sale)
//
// This is a DOCUMENTATION-SUPPORT and COMPLETENESS-CLASSIFICATION instrument, not
// legal advice. The engine checks that a private-party vehicle bill of sale is
// internally complete and consistent against federal law (49 CFR Part 580
// odometer disclosure) and a small table of state rules, classifies it as
// `complete` / `incomplete` / `risk-flagged`, and raises flagged issues. The
// state motor vehicle agency decides.
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_united_states_vehicle_bill_of_sale.sql` (a section's field
// `seller.name` is the column `seller_name`). Text / enum fields default to `''`;
// numeric, date, and time fields default to `null`.
// ──────────────────────────────────────────────

export type YesNo = 'yes' | 'no' | '';
export type PartyType = 'individual' | 'business' | '';
export type PaymentMethod = 'cash' | 'check' | 'wire' | 'financing' | 'trade' | 'gift' | '';
export type TaxBasis =
  | 'purchase-price'
  | 'standard-presumptive-value'
  | 'fair-market-value'
  | 'exempt-gift'
  | 'exempt-family'
  | '';
export type TitleBrand =
  'clean' | 'salvage' | 'rebuilt' | 'flood' | 'lemon' | 'junk' | 'unknown' | '';
export type OdometerStatus = 'actual' | 'exceeds-mechanical-limits' | 'not-actual' | '';
export type LienStatus = 'none' | 'released' | 'outstanding' | '';
export type AsIsClause = 'as-is' | 'warranty' | '';
export type Notarized = 'yes' | 'no' | 'not-required' | '';

export type CompletenessClass = 'complete' | 'incomplete' | 'risk-flagged';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1: sale transaction. */
export interface Transaction {
  /** Two-letter USPS code; '' when unset. */
  state: string;
  /** ISO date string; null when unset. */
  saleDate: string | null;
  /** Dollars; 0 for a gift; null when unset. */
  salePriceAsUsd: number | null;
  paymentMethod: PaymentMethod;
  taxBasis: TaxBasis;
}

/** Steps 2 and 3: a party (seller or buyer). */
export interface Party {
  name: string;
  type: PartyType;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  signed: YesNo;
}

/** Step 4: vehicle. */
export interface Vehicle {
  year: number | null;
  make: string;
  model: string;
  bodyType: string;
  vin: string;
  color: string;
  titleNumber: string;
  titleBrand: TitleBrand;
  gvwrOver16000: YesNo;
  selfPropelled: YesNo;
}

/** Step 5: federal odometer disclosure (49 CFR 580.5). */
export interface Odometer {
  readingMiles: number | null;
  status: OdometerStatus;
  sellerCertified: YesNo;
  buyerAcknowledged: YesNo;
}

/** Step 6: terms, title, lien, and notarization. */
export interface Terms {
  sellerHoldsTitle: YesNo;
  titleSigned: YesNo;
  lienStatus: LienStatus;
  lienholderName: string;
  /** ISO date string; null when unset. */
  lienReleaseDate: string | null;
  asIsClause: AsIsClause;
  warrantyNote: string;
  notarized: Notarized;
}

/** Step 7: after the sale. */
export interface AfterSale {
  releaseOfLiabilityFiled: YesNo;
  /** ISO date string; null when unset. */
  releaseFiledDate: string | null;
  platesRemoved: YesNo;
  /** ISO date string; null when unset. */
  buyerTitleApplicationDate: string | null;
}

/** The full United States vehicle bill of sale data model. */
export interface BillOfSale {
  transaction: Transaction;
  seller: Party;
  buyer: Party;
  vehicle: Vehicle;
  odometer: Odometer;
  terms: Terms;
  afterSale: AfterSale;
}

// ──────────────────────────────────────────────
// Grading / classification types
// ──────────────────────────────────────────────

/** A seller- / buyer-facing flag (mirrors grade_flag). */
export interface FlaggedIssue {
  id: string;
  category: string;
  priority: Priority;
  description: string;
  suggestedAction: string;
}

/** The full completeness classification result for one bill of sale. */
export interface ValidationResult {
  completenessClass: CompletenessClass;
  odometerExempt: boolean;
  stateRuleKnown: boolean;
  flaggedIssues: FlaggedIssue[];
  timestamp: string;
}

// ──────────────────────────────────────────────
// Step configuration
// ──────────────────────────────────────────────

export interface StepConfig {
  number: number;
  title: string;
  shortTitle: string;
  section: keyof BillOfSale;
}
