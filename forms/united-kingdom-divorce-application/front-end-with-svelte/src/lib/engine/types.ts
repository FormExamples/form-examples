// ──────────────────────────────────────────────
// Core data types (United Kingdom divorce / dissolution application)
//
// This is a COMPLETENESS and VALIDITY instrument, not a numeric score and NOT
// legal advice. The engine checks that an application for England and Wales
// under the Divorce, Dissolution and Separation Act 2020 is complete, that the
// time gates are met (one year of marriage, 20 weeks to the conditional order,
// 6 weeks and 1 day to the final order), classifies it as `ready-to-apply` /
// `incomplete` / `not-eligible-yet`, and raises flagged issues.
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_united_kingdom_divorce_application.sql`. Text / enum
// fields default to `''`; numeric and date fields default to `null`.
// ──────────────────────────────────────────────

export type YesNo = 'yes' | 'no' | '';
export type ApplicationType = 'divorce' | 'dissolution' | '';
export type ApplicationMode = 'sole' | 'joint' | '';
export type Stage = 'application' | 'conditional-order' | 'final-order' | '';
export type CertificateType = 'original' | 'certified-copy' | 'not-held' | '';
export type NameChangeProof = 'marriage-certificate' | 'deed-poll' | 'none' | '';
export type ServiceMethod = 'email' | 'post' | 'alternative-service' | '';
export type ChildrenArrangements = 'agreed' | 'not-agreed' | 'undecided' | '';
export type FinancialOrderIntent = 'yes' | 'no' | 'undecided' | '';
export type FeeStatus =
  'paid' | 'help-with-fees-approved' | 'help-with-fees-pending' | 'unpaid' | '';

export type ApplicationClass = 'ready-to-apply' | 'incomplete' | 'not-eligible-yet';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — application type, stage and date of the check. */
export interface Application {
  applicationType: ApplicationType;
  applicationMode: ApplicationMode;
  stage: Stage;
  /** ISO date the check is made; null when unset. */
  asOfDate: string | null;
  domesticAbuseRisk: YesNo;
}

/** Step 2 — marriage and certificate. */
export interface Marriage {
  marriageDate: string | null;
  marriagePlace: string;
  marriageCountry: string;
  legallyRecognised: YesNo;
  breakdownConfirmed: YesNo;
  marriageCertificateType: CertificateType;
  certificateInEnglish: YesNo;
  certifiedTranslation: YesNo;
  nameChanged: YesNo;
  nameChangeProof: NameChangeProof;
}

/** Step 3 — jurisdiction (Domicile and Matrimonial Proceedings Act 1973 s.5(2)). */
export interface Jurisdiction {
  applicantHabitualResident: YesNo;
  applicantResidenceMonths: number | null;
  applicantDomiciled: YesNo;
  respondentHabitualResident: YesNo;
  respondentDomiciled: YesNo;
  lastHabituallyResidentTogether: YesNo;
}

/** Step 4 — the parties and service address. */
export interface Parties {
  applicantName: string;
  applicantAddress: string;
  applicantEmail: string;
  respondentName: string;
  respondentAddress: string;
  respondentEmail: string;
  respondentAddressKnown: YesNo;
  serviceMethod: ServiceMethod;
}

/** Step 5 — children. */
export interface Children {
  childrenUnder18: YesNo;
  childrenCount: number | null;
  childrenArrangements: ChildrenArrangements;
  childrenNote: string;
}

/** Step 6 — money, property and the fee. */
export interface Finances {
  financialOrderIntended: FinancialOrderIntent;
  financialOrderApplied: YesNo;
  feeStatus: FeeStatus;
}

/** Step 7 — progress dates. */
export interface Progress {
  applicationIssuedDate: string | null;
  respondentAcknowledged: YesNo;
  conditionalOrderGrantedDate: string | null;
  finalOrderDelayExplained: YesNo;
}

/** The full divorce / dissolution application data model. */
export interface DivorceApplication {
  application: Application;
  marriage: Marriage;
  jurisdiction: Jurisdiction;
  parties: Parties;
  children: Children;
  finances: Finances;
  progress: Progress;
}

// ──────────────────────────────────────────────
// Grading / classification types
// ──────────────────────────────────────────────

/** An applicant- / caseworker-facing flag (mirrors grade_flag). */
export interface FlaggedIssue {
  id: string;
  category: string;
  priority: Priority;
  description: string;
  suggestedAction: string;
}

/** An audit row for a fired readiness rule (mirrors grade_rule). */
export interface FiredRule {
  id: string;
  dimension: string;
  category: string;
  description: string;
}

/** The full readiness classification result for one application. */
export interface ValidationResult {
  applicationClass: ApplicationClass;
  /** '' when no time gate applies or the needed date is missing. */
  earliestEligibleDate: string;
  jurisdictionMet: boolean;
  rules: FiredRule[];
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
  section: keyof DivorceApplication;
}
