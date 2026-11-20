// Type definitions for the United States vehicle title and registration
// application. The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_vehicle_title_application.sql`.
//
// This is a COMPLETENESS / VALIDITY / ELIGIBILITY instrument, not a legal
// determination. The engine checks that the application is complete and
// consistent with federal rules (VIN, odometer, NMVTIS) and the encoded state
// rules, classifies it, and raises flags. The issuing state agency decides.

export type YesNo = 'yes' | 'no' | '';
export type TransactionType = 'title-and-registration' | 'title-only' | 'registration-only' | '';
export type VehicleCondition = 'new' | 'used' | '';
export type AcquisitionMethod =
  'dealer-purchase' | 'private-purchase' | 'gift' | 'inheritance' | 'other' | '';
export type OwnerType = 'individual' | 'business' | '';
export type Conjunction = 'and' | 'or' | '';
export type IdentificationType =
  'drivers-license' | 'state-id' | 'passport' | 'fein' | 'other' | '';
export type VehicleClass =
  'passenger' | 'light-truck' | 'heavy-truck' | 'motorcycle' | 'trailer' | 'motorhome' | '';
export type FuelType = 'gasoline' | 'diesel' | 'electric' | 'hybrid' | 'other' | '';
export type OdometerStatus = 'actual' | 'exceeds-mechanical-limits' | 'not-actual' | '';
export type TitleDocument =
  'state-title' | 'manufacturer-statement-of-origin' | 'out-of-state-title' | 'none' | '';
export type TitleBrand =
  | 'none'
  | 'salvage'
  | 'junk'
  | 'rebuilt'
  | 'flood'
  | 'odometer-not-actual'
  | 'lemon-law-buyback'
  | 'hail'
  | 'other'
  | '';
export type NmvtisCheck = 'clear' | 'brand-or-theft-found' | 'not-checked' | '';
export type BrandInspection = 'passed' | 'not-done' | 'not-applicable' | '';
export type LienStatus =
  'none' | 'new-lien' | 'existing-lien-released' | 'existing-lien-unreleased' | '';
export type InsuranceProof = 'provided' | 'not-provided' | '';
export type InspectionStatus = 'passed' | 'not-done' | 'exempt' | 'not-required' | '';
export type VinVerification = 'done' | 'not-done' | 'not-required' | '';
export type SalesTaxStatus = 'paid-to-dealer' | 'due-at-title' | 'exempt' | 'not-calculated' | '';
export type ApplicationClass = 'ready-to-submit' | 'incomplete' | 'title-brand-or-lien-issue';
export type Priority = 'high' | 'medium' | 'low';
export type VinStatus =
  | ''
  | 'valid'
  | 'not-standardized'
  | 'invalid-length'
  | 'invalid-characters'
  | 'check-digit-mismatch';

/** A state's encoded rules. */
export interface StateRule {
  name: string;
  agency: string;
  titleDeadlineDays: number | null;
  salesTaxBasePercent: number | null;
  inspection: string;
  insuranceAtRegistration: boolean;
  outOfStateVinVerification: boolean;
}

/** Step 1 — the application. */
export interface ApplicationDetails {
  state: string;
  transactionType: TransactionType;
  vehicleCondition: VehicleCondition;
  acquisitionMethod: AcquisitionMethod;
  outOfStateTransfer: YesNo;
  previousState: string;
  acquisitionDate: string | null;
  applicationDate: string | null;
}

/** Step 2 — owner identification. */
export interface OwnerDetails {
  ownerType: OwnerType;
  ownerName: string;
  coOwnerName: string;
  coOwnerConjunction: Conjunction;
  identificationType: IdentificationType;
  identificationNumber: string;
  mailingAddress: string;
  ownerSigned: YesNo;
  coOwnerSigned: YesNo;
}

/** Step 3 — the vehicle. */
export interface VehicleDetails {
  vin: string;
  modelYear: number | null;
  make: string;
  model: string;
  bodyType: string;
  vehicleClass: VehicleClass;
  fuelType: FuelType;
  gvwrLbs: number | null;
  color: string;
}

/** Step 4 — odometer disclosure (49 CFR Part 580). */
export interface OdometerDetails {
  odometerReading: number | null;
  odometerStatus: OdometerStatus;
  sellerOdometerStatement: YesNo;
  buyerOdometerAcknowledged: YesNo;
}

/** Step 5 — title history and brands. */
export interface TitleHistory {
  titleDocument: TitleDocument;
  priorTitleSurrendered: YesNo;
  titleBrand: TitleBrand;
  brandDisclosed: YesNo;
  nmvtisCheck: NmvtisCheck;
  brandInspection: BrandInspection;
}

/** Step 6 — lien. */
export interface LienDetails {
  lienStatus: LienStatus;
  lienholderName: string;
  lienElectronic: YesNo;
}

/** Step 7 — insurance and inspections. */
export interface ComplianceDetails {
  insuranceProof: InsuranceProof;
  insuranceExpiryDate: string | null;
  emissionsInspection: InspectionStatus;
  safetyInspection: InspectionStatus;
  vinVerification: VinVerification;
}

/** Step 8 — fees and tax. */
export interface FeesTaxDetails {
  purchasePriceUsd: number | null;
  salesTaxStatus: SalesTaxStatus;
  salesTaxRatePercent: number | null;
  salesTaxAmountUsd: number | null;
  taxExemptionReason: string;
  titleFeeUsd: number | null;
  registrationFeeUsd: number | null;
  feesTendered: YesNo;
  applicantNote: string;
}

/** The full United States vehicle title and registration application data model. */
export interface TitleApplication {
  application: ApplicationDetails;
  owner: OwnerDetails;
  vehicle: VehicleDetails;
  odometer: OdometerDetails;
  titleHistory: TitleHistory;
  lien: LienDetails;
  compliance: ComplianceDetails;
  feesTax: FeesTaxDetails;
}

/** A flag (mirrors grade_flag). */
export interface FlaggedIssue {
  id: string;
  category: string;
  priority: Priority;
  description: string;
  suggestedAction: string;
}

/** An item still missing before the application can be submitted. */
export interface OutstandingItem {
  id: string;
  label: string;
}

/** The classification, without flags. */
export interface Classification {
  applicationClass: ApplicationClass;
  vinStatus: VinStatus;
  odometerDisclosureRequired: boolean;
  brandOrLienIssue: boolean;
  outstandingItemCount: number;
  stateRuleKnown: boolean;
  estimatedStateTaxUsd: number | null;
}

/** The full classification result for one application. */
export interface ValidationResult extends Classification {
  flaggedIssues: FlaggedIssue[];
  timestamp: string;
}

export interface StepConfig {
  number: number;
  title: string;
  shortTitle: string;
  section: keyof TitleApplication;
}
