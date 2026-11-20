// ──────────────────────────────────────────────
// Core data types (United States Birth Certificate Application)
//
// This is a DOCUMENTATION-SUPPORT and ELIGIBILITY / COMPLETENESS instrument. It is
// NOT legal advice and NOT a substitute for the issuing state or territory vital
// records office, which alone decides whether a request is accepted. The engine
// checks that the request is complete, that the requester appears eligible under
// the applicable state rule, classifies it as `ready-to-submit` / `incomplete` /
// `ineligible-requester`, and raises flagged issues.
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/02_create_table_applicant.sql`, `sql/03_create_table_registrant.sql` and
// `sql/04_create_table_united_states_birth_certificate_application.sql`. Text /
// enum fields default to `''`; numeric, date, and time fields default to `null`.
// ──────────────────────────────────────────────

export type YesNo = 'yes' | 'no' | '';
export type Sex = 'female' | 'male' | 'other' | 'unknown' | '';
export type Relationship =
  | 'self'
  | 'parent'
  | 'legal-guardian'
  | 'legal-representative'
  | 'spouse'
  | 'child'
  | 'sibling'
  | 'grandparent'
  | 'grandchild'
  | 'government-agency'
  | 'other'
  | '';
export type Purpose =
  | 'passport'
  | 'real-id'
  | 'school'
  | 'employment'
  | 'benefits'
  | 'genealogy'
  | 'foreign-use'
  | 'other'
  | '';
export type CertificateType = 'certified-long-form' | 'certified-short-form' | 'informational' | '';
export type DeliveryMethod = 'online' | 'mail' | 'in-person' | '';
export type IdType =
  | 'state-driver-license'
  | 'state-id-card'
  | 'us-passport'
  | 'military-id'
  | 'other-photo-id'
  | 'none'
  | '';

export type ApplicationClass = 'ready-to-submit' | 'incomplete' | 'ineligible-requester';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — the person completing the request. */
export interface Applicant {
  applicantName: string;
  /** ISO date string; null when unset. */
  dateOfBirth: string | null;
  email: string;
  phone: string;
  postalAddress: string;
}

/** Step 2 — the person named on the certificate. */
export interface Registrant {
  registrantName: string;
  sex: Sex;
  /** ISO date string; null when unset. */
  dateOfBirth: string | null;
  placeOfBirth: string;
  countyOfBirth: string;
  /** 2-letter code of the state or territory of birth. */
  state: string;
  birthFacility: string;
  motherNameBeforeFirstMarriage: string;
  fatherName: string;
  deceased: YesNo;
  adopted: YesNo;
}

/** Step 3 — relationship and purpose. */
export interface PurposeSection {
  relationship: Relationship;
  purpose: Purpose;
  needsApostille: YesNo;
  apostilleCountry: string;
}

/** Step 4 — the order. */
export interface Order {
  certificateType: CertificateType;
  copies: number | null;
  deliveryMethod: DeliveryMethod;
  feeEnclosedUsd: number | null;
}

/** Step 5 — identity and supporting documents. */
export interface Evidence {
  idType: IdType;
  idUnexpired: YesNo;
  proofOfRelationship: YesNo;
  authorityDocument: YesNo;
  notarizedSwornStatement: YesNo;
}

/** Step 6 — declaration. */
export interface Declaration {
  declarationSigned: YesNo;
  applicationNote: string;
}

/** The full United States Birth Certificate Application data model. */
export interface BirthCertificateApplication {
  applicant: Applicant;
  registrant: Registrant;
  purpose: PurposeSection;
  order: Order;
  evidence: Evidence;
  declaration: Declaration;
}

// ──────────────────────────────────────────────
// Grading / classification types
// ──────────────────────────────────────────────

/** An applicant-facing flag (mirrors grade_flag). */
export interface FlaggedIssue {
  id: string;
  category: string;
  priority: Priority;
  description: string;
  suggestedAction: string;
}

/** The full classification result for one application. */
export interface ValidationResult {
  applicationClass: ApplicationClass;
  /** Expected total fee in US dollars; null when the state fee is unknown. */
  expectedFeeUsd: number | null;
  stateRuleApplied: 'state' | 'default';
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
  section: keyof BirthCertificateApplication;
}
