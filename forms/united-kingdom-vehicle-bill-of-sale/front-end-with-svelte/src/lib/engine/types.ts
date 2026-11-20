// ──────────────────────────────────────────────
// Core data types (United Kingdom Vehicle Bill of Sale)
//
// This is a COMPLETENESS and VALIDITY instrument, not a numeric score. It is
// documentation support, not legal advice. The engine checks that a private
// vehicle bill of sale is complete, classifies it as `complete` / `incomplete`
// / `risk-flagged`, and raises flagged issues.
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_united_kingdom_vehicle_bill_of_sale.sql` (and the
// `seller` / `buyer` tables). Text / enum fields default to `''`; numeric and
// date fields default to `null`.
// ──────────────────────────────────────────────

export type YesNo = 'yes' | 'no' | '';
export type SellerCapacity = 'private' | 'trader' | '';
export type FuelType = 'petrol' | 'diesel' | 'hybrid' | 'electric' | 'other' | '';
export type MileageAccuracy = 'recorded' | 'not-known' | '';
export type MotStatus = 'valid' | 'expired' | 'exempt' | 'none' | '';
export type FinanceStatus = 'none' | 'outstanding' | 'unchecked' | '';
export type PaymentMethod = 'bank-transfer' | 'cash' | 'cheque' | 'card' | 'other' | '';
export type SaleTerms = 'sold-as-seen' | 'warranty-given' | '';
export type DvlaNotification = 'online' | 'post' | 'not-yet' | '';

export type Classification = 'complete' | 'incomplete' | 'risk-flagged';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — the sale. */
export interface Sale {
  /** ISO date string; null when unset. */
  saleDate: string | null;
  salePlace: string;
  sellerCapacity: SellerCapacity;
}

/** Step 2 — the seller. */
export interface Seller {
  name: string;
  address: string;
  postcode: string;
  phone: string;
  email: string;
  isRegisteredKeeper: YesNo;
}

/** Step 3 — the buyer. */
export interface Buyer {
  name: string;
  address: string;
  postcode: string;
  phone: string;
  email: string;
}

/** Step 4 — the vehicle. */
export interface Vehicle {
  registration: string;
  make: string;
  model: string;
  colour: string;
  vin: string;
  firstRegisteredYear: number | null;
  fuelType: FuelType;
  mileage: number | null;
  mileageAccuracy: MileageAccuracy;
}

/** Step 5 — V5C, MOT, and finance checks. */
export interface Checks {
  v5cPresent: YesNo;
  v5cDetailsMatch: YesNo;
  motStatus: MotStatus;
  /** ISO date string; null when unset. */
  motExpiryDate: string | null;
  financeStatus: FinanceStatus;
  /** ISO date string; null when unset. */
  financeCheckDate: string | null;
}

/** Step 6 — price and payment. */
export interface Payment {
  priceAsGbp: number | null;
  depositAsGbp: number | null;
  paymentMethod: PaymentMethod;
  paymentReceived: YesNo;
}

/** Step 7 — condition and description. */
export interface Condition {
  saleTerms: SaleTerms;
  knownFaults: string;
  descriptionMatchesAdvert: YesNo;
}

/** Step 8 — telling DVLA. */
export interface Dvla {
  newKeeperSlipGiven: YesNo;
  dvlaNotification: DvlaNotification;
}

/** Step 9 — signatures. */
export interface Signatures {
  sellerSigned: YesNo;
  buyerSigned: YesNo;
  /** ISO date string; null when unset. */
  signatureDate: string | null;
  note: string;
}

/** The full United Kingdom Vehicle Bill of Sale data model. */
export interface BillOfSale {
  sale: Sale;
  seller: Seller;
  buyer: Buyer;
  vehicle: Vehicle;
  checks: Checks;
  payment: Payment;
  condition: Condition;
  dvla: Dvla;
  signatures: Signatures;
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

/** An item the engine reports (a missing required item or a risk condition). */
export interface RuleHit {
  id: string;
  dimension: string;
  label: string;
}

/** The full classification result for one bill of sale. */
export interface AssessmentResult {
  classification: Classification;
  missingItemCount: number;
  riskFlagCount: number;
  missingItems: string[];
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
