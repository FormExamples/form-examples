// ──────────────────────────────────────────────
// Core data types (United States Social Security card application — Form SS-5)
//
// This is a DOCUMENTATION-SUPPORT and COMPLETENESS instrument, not legal advice
// and not an SSA decision. The engine checks that the application and its
// evidence are complete and consistent with the published SS-5 rules and
// classifies it as `ready-to-submit` / `incomplete` / `evidence-missing` /
// `not-eligible`. The Social Security Administration decides every application.
// The Social Security number is deliberately never collected.
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_ss5_application.sql`. Text / enum fields default to `''`;
// numeric and date fields default to `null`.
// ──────────────────────────────────────────────

export type YesNo = 'yes' | 'no' | '';
export type YesNoUnknown = 'yes' | 'no' | 'dont-know' | '';

export type RequestType = 'original' | 'replacement' | 'correction' | '';
export type Channel = 'in-person' | 'mail' | '';
export type NameChangeReason = 'marriage' | 'divorce' | 'court-order' | 'other' | '';
export type LimitExceptionReason =
  'name-change' | 'legend-change' | 'non-receipt' | 'ssa-error' | 'hardship' | '';
export type Sex = 'female' | 'male' | '';
export type Citizenship =
  'us-citizen' | 'legal-alien-allowed-to-work' | 'legal-alien-not-allowed-to-work' | 'other' | '';
export type IdentityDocument =
  | 'us-driver-license'
  | 'state-id-card'
  | 'us-passport'
  | 'military-id'
  | 'employee-id'
  | 'school-id'
  | 'health-insurance-card'
  | 'other'
  | 'none'
  | '';
export type AgeDocument =
  | 'us-birth-certificate'
  | 'us-passport'
  | 'hospital-record'
  | 'religious-record'
  | 'immigration-record'
  | 'other'
  | 'none'
  | '';
export type CitizenshipDocument =
  | 'us-birth-certificate'
  | 'us-passport'
  | 'certificate-of-naturalization'
  | 'certificate-of-citizenship'
  | 'consular-report-of-birth-abroad'
  | 'permanent-resident-card'
  | 'i-94-with-work-authorization'
  | 'employment-authorization-document'
  | 'other'
  | 'none'
  | '';
export type NameChangeDocument =
  | 'marriage-certificate'
  | 'divorce-decree'
  | 'court-order'
  | 'certificate-of-naturalization'
  | 'other'
  | 'none'
  | '';
export type SignerRelationship = 'self' | 'parent' | 'legal-guardian' | 'custodian' | 'other' | '';

export type ApplicationClass =
  'ready-to-submit' | 'incomplete' | 'evidence-missing' | 'not-eligible';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — what is being requested. */
export interface Request {
  applicationDate: string | null;
  requestType: RequestType;
  channel: Channel;
  previouslyApplied: YesNoUnknown;
  nameChange: YesNo;
  nameChangeReason: NameChangeReason;
  dateOfBirthCorrection: YesNo;
  replacementsThisYear: number | null;
  replacementsLifetime: number | null;
  limitExceptionReason: LimitExceptionReason;
  limitExceptionEvidence: YesNo;
}

/** Step 2 — the applicant (SS-5 items 1-11, 13, 14, 16, 17). */
export interface Applicant {
  nameOnCard: string;
  nameAtBirth: string;
  otherNamesUsed: string;
  nameOnMostRecentCard: string;
  dateOfBirth: string | null;
  placeOfBirthCity: string;
  placeOfBirthRegion: string;
  sex: Sex;
  citizenship: Citizenship;
  nonWorkReasonValid: YesNo;
  motherNameAtBirth: string;
  fatherName: string;
  stateOfResidence: string;
  mailingAddress: string;
  phone: string;
}

/** Step 3 — evidence documents. */
export interface Evidence {
  identityDocument: IdentityDocument;
  identityDocumentExpired: YesNo;
  ageDocument: AgeDocument;
  citizenshipDocument: CitizenshipDocument;
  citizenshipOnFile: YesNoUnknown;
  nameChangeDocument: NameChangeDocument;
  documentsOriginalOrCertified: YesNo;
}

/** Step 4 — filer and signature. */
export interface Filer {
  signerRelationship: SignerRelationship;
  signerName: string;
  signerIdentityDocument: YesNo;
  signaturePresent: YesNo;
}

/** Step 5 — death-related Tell-SSA items. */
export interface TellSsa {
  applicantDeceased: YesNo;
  deathReportedToSsa: YesNo;
  preparerNote: string;
}

/** The full Social Security card application data model. */
export interface SocialSecurityApplication {
  request: Request;
  applicant: Applicant;
  evidence: Evidence;
  filer: Filer;
  tellSsa: TellSsa;
}

// ──────────────────────────────────────────────
// Grading / classification types
// ──────────────────────────────────────────────

/** An applicant- / preparer-facing eligibility, evidence, or completeness flag (mirrors grade_flag). */
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
  missingEvidenceCount: number;
  replacementLimitReached: boolean;
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
  section: keyof SocialSecurityApplication | 'summary';
}
