// ──────────────────────────────────────────────
// Core data types (United States Marriage License Application)
//
// This is a DOCUMENTATION-SUPPORT and ELIGIBILITY-CLASSIFICATION instrument, NOT
// legal advice. Marriage law is made state by state; the issuing county clerk
// (or a court) decides. The engine checks that an application is complete, that
// nothing in it bars the license under the applicable state rule, classifies it
// as `ready-to-apply` / `incomplete` / `not-eligible`, and raises flagged issues.
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_united_states_marriage_license_application.sql`. Text /
// enum fields default to `''`; numeric, date, and time fields default to `null`.
// ──────────────────────────────────────────────

export type YesNo = 'yes' | 'no' | '';
export type Sex = 'female' | 'male' | 'nonbinary' | 'unknown' | '';
export type MaritalStatus =
  'never-married' | 'divorced' | 'widowed' | 'annulled' | 'currently-married' | '';
export type SsnStatus = 'provided' | 'none-issued' | 'declined' | '';
export type LicenseType = 'standard' | 'confidential' | '';
export type Relationship = 'not-related' | 'related-prohibited' | '';
export type MinorConsent = 'not-applicable' | 'parental-consent' | 'court-order' | 'none' | '';
export type BloodTestEvidence = 'provided' | 'not-required' | 'not-provided' | '';
export type OfficiantType = 'clergy' | 'judge' | 'clerk' | 'notary' | 'self-uniting' | 'other' | '';

export type ApplicationClass = 'ready-to-apply' | 'incomplete' | 'not-eligible';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — issuing jurisdiction. */
export interface Jurisdiction {
  /** Two-letter USPS code. */
  state: string;
  county: string;
  /** ISO date string; null when unset. */
  applicationDate: string | null;
  licenseType: LicenseType;
}

/** Steps 2 and 3 — one applicant. */
export interface Applicant {
  name: string;
  sex: Sex;
  /** ISO date string; null when unset. */
  dateOfBirth: string | null;
  placeOfBirth: string;
  residenceState: string;
  idPresented: YesNo;
  ssnStatus: SsnStatus;
  maritalStatus: MaritalStatus;
  /** ISO date string; null when unset. */
  priorMarriageEndedDate: string | null;
}

/** Step 4 — eligibility. */
export interface Eligibility {
  relationshipBetweenApplicants: Relationship;
  minorConsent: MinorConsent;
  activeDutyMilitary: YesNo;
  appearInPerson: YesNo;
  proxyRequested: YesNo;
  premaritalCourseCompleted: YesNo;
  bloodTestEvidence: BloodTestEvidence;
}

/** Step 5 — license issuance and fee. */
export interface Issuance {
  feePaidUsd: number | null;
  /** ISO date string; null when unset. */
  licenseIssuedDate: string | null;
  clerkNote: string;
}

/** Step 6 — ceremony and certified certificate. */
export interface Ceremony {
  /** ISO date string; null when unset. */
  ceremonyDate: string | null;
  officiantType: OfficiantType;
  officiantName: string;
  officiantAuthorized: YesNo;
  witnessCount: number | null;
  /** ISO date string; null when unset. */
  licenseReturnedDate: string | null;
  certifiedCopiesRequested: number | null;
}

/** The full United States marriage license application data model. */
export interface MarriageApplication {
  jurisdiction: Jurisdiction;
  applicantOne: Applicant;
  applicantTwo: Applicant;
  eligibility: Eligibility;
  issuance: Issuance;
  ceremony: Ceremony;
}

// ──────────────────────────────────────────────
// Grading / classification types
// ──────────────────────────────────────────────

/** An applicant- / clerk-facing flag (mirrors grade_flag). */
export interface FlaggedIssue {
  id: string;
  category: string;
  priority: Priority;
  description: string;
  suggestedAction: string;
}

/** The classification and derived dates for one application. */
export interface ApplicationGrade {
  applicationClass: ApplicationClass;
  /** ISO date; null when the issue (or application) date is unknown. */
  earliestCeremonyDate: string | null;
  /** ISO date; null when the issue (or application) date is unknown. */
  licenseExpiryDate: string | null;
  stateRuleKnown: boolean;
}

/** The full classification result for one application. */
export interface ValidationResult extends ApplicationGrade {
  flaggedIssues: FlaggedIssue[];
  timestamp: string;
}

/** One state's marriage-license rule (see `rules.ts`). */
export interface StateRule {
  name: string;
  minAge: number;
  minorPath: 'none' | 'court' | 'parental';
  minorMinAge: number | null;
  minorPathEnds: string | null;
  maxGapYears: number | null;
  waitingHours: number;
  waitingWaivers: string[];
  validDays: number;
  witnesses: number;
  confidentialWitnesses: number;
  bloodTest: boolean;
  proxy: 'none' | 'military';
  returnWithinDays: number;
  typicalFeeUsd: number;
}

// ──────────────────────────────────────────────
// Step configuration
// ──────────────────────────────────────────────

export interface StepConfig {
  number: number;
  title: string;
  shortTitle: string;
  section: keyof MarriageApplication;
}
