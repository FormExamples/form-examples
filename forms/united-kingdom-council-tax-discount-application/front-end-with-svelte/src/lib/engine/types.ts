// ──────────────────────────────────────────────
// Core data types (United Kingdom Council Tax Discount Application)
//
// This is a COMPLETENESS and ELIGIBILITY instrument, not a clinical score. The
// engine checks that the application is complete and consistent with the
// Council Tax rules for England, classifies it as `likely-eligible` /
// `incomplete` / `likely-ineligible`, states the indicative outcome, and raises
// flagged issues. ELIGIBILITY IS DECIDED BY THE BILLING AUTHORITY, not by this
// form.
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_united_kingdom_council_tax_discount_application.sql`
// and `sql/05_create_table_occupant.sql`. Text / enum fields default to `''`;
// numeric and date fields default to `null`.
// ──────────────────────────────────────────────

export type YesNo = 'yes' | 'no' | '';
export type ClaimType =
  | 'single-person-discount'
  | 'all-disregarded-discount'
  | 'student-exemption'
  | 'severe-mental-impairment'
  | 'disabled-band-reduction'
  | 'care-leaver-relief'
  | 'council-tax-reduction'
  | '';
export type OccupantStatus =
  | 'counted-adult'
  | 'full-time-student'
  | 'severely-mentally-impaired'
  | 'under-18'
  | 'apprentice'
  | 'education-18-19'
  | 'live-in-carer'
  | 'care-leaver'
  | 'other-disregarded'
  | '';
export type Band = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | '';
export type LiableRole = 'owner-occupier' | 'tenant' | 'landlord' | 'other' | '';
export type Adaptation =
  'extra-bathroom' | 'extra-kitchen' | 'extra-room' | 'wheelchair-space' | 'none' | '';

export type EligibilityClass = 'likely-eligible' | 'incomplete' | 'likely-ineligible';
export type IndicativeOutcome =
  | '25-percent-discount'
  | '50-percent-discount'
  | 'full-exemption'
  | 'smi-disregard'
  | 'band-reduction'
  | 'care-leaver-relief'
  | 'means-tested-reduction'
  | 'none';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — the claim. */
export interface Claim {
  claimType: ClaimType;
  billingAuthority: string;
  accountReference: string;
  /** ISO date string; null when unset. */
  applicationDate: string | null;
  /** ISO date string; null when unset. */
  effectiveDate: string | null;
}

/** Step 2 — the applicant (the liable person). */
export interface Applicant {
  name: string;
  /** ISO date string; null when unset. */
  birthDate: string | null;
  email: string;
  phone: string;
  /** The applicant's own status; '' or counted-adult means they count. */
  status: OccupantStatus;
}

/** Step 2 — the property. */
export interface Property {
  addressAsFullText: string;
  postcode: string;
  band: Band;
  mainResidence: YesNo;
  liableRole: LiableRole;
}

/** One person on the occupant roster other than the applicant. */
export interface Occupant {
  name: string;
  /** ISO date string; null when unset. */
  birthDate: string | null;
  status: OccupantStatus;
  evidenceHeld: YesNo;
}

/** Step 3 — the household. */
export interface Household {
  othersLive: YesNo;
  occupants: Occupant[];
}

/** Step 4 — supporting evidence. */
export interface Evidence {
  smiCertificate: YesNo;
  qualifyingBenefit: YesNo;
  studentCertificate: YesNo;
  studentCourseMonths: number | null;
  studentHoursPerWeek: number | null;
  disabilityAdaptation: Adaptation;
  disabledPersonMainHome: YesNo;
  apprenticeDeclaration: YesNo;
  careLeaverProof: YesNo;
  careLeaverAgeYears: number | null;
  notes: string;
}

/** Step 5 — the declaration. */
export interface Declaration {
  declaredTrue: YesNo;
  agreesToReportChanges: YesNo;
  fraudWarningAcknowledged: YesNo;
  declarantName: string;
  /** ISO date string; null when unset. */
  declarationDate: string | null;
}

/** The full Council Tax discount application data model. */
export interface Application {
  claim: Claim;
  applicant: Applicant;
  property: Property;
  household: Household;
  evidence: Evidence;
  declaration: Declaration;
}

// ──────────────────────────────────────────────
// Grading / classification types
// ──────────────────────────────────────────────

/** An applicant- / officer-facing eligibility, evidence or governance flag (mirrors grade_flag). */
export interface FlaggedIssue {
  id: string;
  category: string;
  priority: Priority;
  description: string;
  suggestedAction: string;
}

/** The full eligibility classification result for one application. */
export interface ValidationResult {
  eligibilityClass: EligibilityClass;
  countedAdults: number;
  indicativeOutcome: IndicativeOutcome;
  /** Why the class is likely-ineligible or incomplete; empty when likely-eligible. */
  reasons: string[];
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
  section: keyof Application;
}
