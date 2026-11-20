// ──────────────────────────────────────────────
// Core data types (United Kingdom Marriage Certificate Application)
//
// This is a COMPLETENESS and VALIDITY instrument, not a numeric score and NOT
// legal advice. The engine checks that an application to give notice of
// marriage or civil partnership in England and Wales, and to order marriage
// certificate copies, is eligible, complete and evidenced; it classifies it as
// `ready-to-submit` / `incomplete` / `needs-evidence` / `ineligible` and raises
// flagged issues. The register office decides each notice.
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_united_kingdom_marriage_certificate_application.sql` (the
// two parties' columns are prefixed `party_one_` / `party_two_`). Text / enum
// fields default to `''`; numeric and date fields default to `null`.
// ──────────────────────────────────────────────

export type YesNo = 'yes' | 'no' | '';
export type YesNoNotApplicable = 'yes' | 'no' | 'not-applicable' | '';
export type NoticeType = 'marriage' | 'civil-partnership' | '';
export type CeremonyType =
  | 'civil-register-office'
  | 'civil-approved-premises'
  | 'religious-registered-building'
  | 'anglican'
  | '';
export type NationalityStatus = 'british-or-irish' | 'eu-settlement-scheme' | 'other' | '';
export type MaritalStatus =
  | 'never-married'
  | 'divorced'
  | 'widowed'
  | 'dissolved-civil-partnership'
  | 'annulled'
  | 'currently-married-or-civil-partnered'
  | '';
export type CertificateService = 'standard' | 'priority' | '';

export type ValidityClass = 'ready-to-submit' | 'incomplete' | 'needs-evidence' | 'ineligible';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — the notice. */
export interface Notice {
  noticeType: NoticeType;
  /** ISO date string; null when unset. */
  noticeDate: string | null;
  registrationDistrict: string;
  noticeGivenTogether: YesNo;
}

/** Step 2 — the ceremony. */
export interface Ceremony {
  ceremonyType: CeremonyType;
  /** ISO date string; null when unset. */
  ceremonyDate: string | null;
  venueName: string;
  venueConfirmed: YesNo;
  witnessCount: number | null;
}

/** Steps 3 and 4 — one party. */
export interface Party {
  name: string;
  /** ISO date string; null when unset. */
  dateOfBirth: string | null;
  daysResidentInDistrict: number | null;
  nationalityStatus: NationalityStatus;
  maritalStatus: MaritalStatus;
  identityProvided: YesNo;
  addressProofProvided: YesNo;
  priorEndEvidenceProvided: YesNoNotApplicable;
  immigrationEvidenceProvided: YesNoNotApplicable;
}

/** Step 5 — relationship. */
export interface Relationship {
  closelyRelated: YesNo;
}

/** Step 6 — GRO certificate order. */
export interface CertificateOrder {
  certificateCopies: number | null;
  certificateService: CertificateService;
  groIndexReference: string;
  applicantNote: string;
}

/** The whole application the wizard collects and the engine grades. */
export interface Application {
  notice: Notice;
  ceremony: Ceremony;
  partyOne: Party;
  partyTwo: Party;
  relationship: Relationship;
  certificate: CertificateOrder;
}

// ──────────────────────────────────────────────
// Grading / classification types
// ──────────────────────────────────────────────

/** An applicant- / registrar-facing eligibility, evidence or timing flag (mirrors grade_flag). */
export interface FlaggedIssue {
  id: string;
  category: string;
  priority: Priority;
  description: string;
  suggestedAction: string;
}

/** The full classification result for one application. */
export interface ValidationResult {
  validityClass: ValidityClass;
  /** Earliest permitted ceremony date; null without a notice date. */
  earliestCeremonyDate: string | null;
  /** Last day the notice is valid for a ceremony; null without a notice date. */
  latestCeremonyDate: string | null;
  immigrationReferralIndicated: boolean;
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
