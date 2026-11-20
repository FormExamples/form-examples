// ──────────────────────────────────────────────
// Core data types (United Kingdom Vehicle Registration Application)
//
// This is a COMPLETENESS and VALIDITY instrument, not a clinical score and NOT a
// decision on the application. The engine checks that the application is
// complete, internally consistent, and accompanied by the documents and fee the
// DVLA asks for, classifies it as `ready-to-submit` / `incomplete` /
// `needs-supporting-documents`, and raises flagged issues. Only the DVLA decides
// whether a vehicle is registered.
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_united_kingdom_vehicle_registration_application.sql`. Text / enum
// fields default to `''`; numeric, date, and time fields default to `null`.
// ──────────────────────────────────────────────

export type YesNo = 'yes' | 'no' | '';
export type ApplicationType =
  | 'v62-replacement-v5c'
  | 'v62-acquired-without-v5c'
  | 'v55-4-new-vehicle'
  | 'v55-5-used-vehicle'
  | 'imported-vehicle'
  | 'v627-1-rebuilt-or-kit'
  | '';
export type V5cStatus =
  'lost' | 'stolen' | 'destroyed' | 'not-received' | 'damaged' | 'never-had' | 'has-v5c' | '';
export type KeeperType = 'individual' | 'company' | 'organization' | 'trade' | 'other' | '';
export type IdentityDocumentType =
  'photocard-driving-licence' | 'passport' | 'other-name-document' | 'none' | '';
export type AddressDocumentType =
  | 'photocard-driving-licence'
  | 'utility-bill'
  | 'bank-statement'
  | 'council-tax-bill'
  | 'none'
  | '';
export type VehicleCategory =
  'car' | 'motorcycle' | 'light-goods' | 'heavy-goods' | 'bus' | 'other' | '';
export type FuelType = 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'lpg' | 'other' | '';
export type TypeApproval =
  | 'ecwvta'
  | 'gb-type-approval'
  | 'ni-type-approval'
  | 'iva'
  | 'msva'
  | 'exempt-over-10-years'
  | 'none'
  | '';
export type MotStatus = 'valid' | 'not-required' | 'missing' | '';
export type InsuranceStatus = 'in-force' | 'none' | '';
export type NovaStatus = 'notified' | 'not-notified' | 'not-applicable' | '';
export type FeePaymentMethod =
  'cheque' | 'postal-order' | 'post-office-card' | 'online-card' | 'none' | '';

export type ValidityClass = 'ready-to-submit' | 'incomplete' | 'needs-supporting-documents';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — which application, and why a V5C is needed. */
export interface Application {
  applicationType: ApplicationType;
  /** ISO date string; null when unset. */
  applicationDate: string | null;
  v5cStatus: V5cStatus;
  weeksSinceChangeOfKeeper: number | null;
  newKeeperSlipProvided: YesNo;
}

/** Step 2 — the applicant and their identity documents. */
export interface Applicant {
  name: string;
  /** ISO date string; null when unset. */
  birthDate: string | null;
  email: string;
  phone: string;
  postalAddressAsFullText: string;
  postcode: string;
  drivingLicenceNumber: string;
  identityDocumentType: IdentityDocumentType;
  addressDocumentType: AddressDocumentType;
}

/** Step 3 — registered keeper and owner. */
export interface Keeper {
  keeperName: string;
  keeperType: KeeperType;
  companyRegistrationNumber: string;
  ownerDiffersFromKeeper: YesNo;
  ownerName: string;
  keeperAddressInNorthernIreland: YesNo;
}

/** Step 4 — the vehicle. */
export interface Vehicle {
  registrationNumber: string;
  vehicleIdentificationNumber: string;
  engineNumber: string;
  make: string;
  model: string;
  colour: string;
  vehicleCategory: VehicleCategory;
  fuelType: FuelType;
  engineCapacityAsCc: number | null;
  /** ISO date string; null when unset. */
  dateOfManufacture: string | null;
  /** ISO date string; null when unset. */
  dateFirstUsed: string | null;
  seriouslyDamaged: YesNo;
}

/** Step 5 — supporting evidence. */
export interface Evidence {
  certificateOfNewnessProvided: YesNo;
  typeApproval: TypeApproval;
  motStatus: MotStatus;
  insuranceStatus: InsuranceStatus;
  buildEvidenceProvided: YesNo;
  donorVehicleCount: number | null;
}

/** Step 6 — imported vehicles. */
export interface ImportDetails {
  countryOfExport: string;
  /** ISO date string; null when unset. */
  importDate: string | null;
  novaStatus: NovaStatus;
  novaReference: string;
}

/** Step 7 — fee and declaration. */
export interface FeeAndDeclaration {
  feePaymentMethod: FeePaymentMethod;
  feePaidAsPence: number | null;
  declarationSigned: YesNo;
  /** ISO date string; null when unset. */
  declarationDate: string | null;
  applicantNote: string;
}

/** The full United Kingdom Vehicle Registration Application data model. */
export interface VehicleApplication {
  application: Application;
  applicant: Applicant;
  keeper: Keeper;
  vehicle: Vehicle;
  evidence: Evidence;
  importDetails: ImportDetails;
  feeAndDeclaration: FeeAndDeclaration;
}

// ──────────────────────────────────────────────
// Grading / classification types
// ──────────────────────────────────────────────

/** An applicant-facing identity / evidence / fee / format flag (mirrors grade_flag). */
export interface FlaggedIssue {
  id: string;
  category: string;
  priority: Priority;
  description: string;
  suggestedAction: string;
}

/** One validity rule that fired (mirrors grade_rule). */
export interface RuleFinding {
  ruleId: string;
  dimension: string;
  category: string;
  description: string;
}

/** The full validity classification result for one application. */
export interface ValidationResult {
  validityClass: ValidityClass;
  /** Fee the DVLA requires, in pence; null when the application type is unset. */
  feeDueAsPence: number | null;
  missingItemCount: number;
  rules: RuleFinding[];
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
  section: keyof VehicleApplication;
}
