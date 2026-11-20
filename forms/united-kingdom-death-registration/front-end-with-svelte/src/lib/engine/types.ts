// ──────────────────────────────────────────────
// Core data types (United Kingdom death registration, England and Wales)
//
// This is a COMPLETENESS and VALIDITY instrument, not a clinical score and not
// legal advice. The engine checks that a death registration is ready: medical
// examiner confirmation, coroner status, qualified informant, and the 5-day
// registration window. It classifies the registration as `ready-to-register` /
// `incomplete` / `referred-to-coroner-pending` / `registered` and raises
// flagged issues. The registrar's own checks remain definitive.
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_united_kingdom_death_registration.sql`. Text / enum
// fields default to `''`; numeric and date fields default to `null`.
// ──────────────────────────────────────────────

export type YesNo = 'yes' | 'no' | '';
export type Sex = 'female' | 'male' | 'other' | 'unknown' | '';
export type DeathJurisdiction = 'england-wales' | 'scotland' | 'northern-ireland' | 'abroad' | '';
export type MedicalExaminerStatus = 'confirmed' | 'pending' | '';
export type CoronerStage =
  | 'investigating'
  | 'post-mortem'
  | 'inquest-opened'
  | 'released-no-inquest'
  | 'inquest-concluded'
  | '';
export type InformantRelationship =
  | 'relative-present-at-death'
  | 'relative-in-attendance'
  | 'relative-in-district'
  | 'person-present-at-death'
  | 'occupier-of-premises'
  | 'person-arranging-funeral'
  | 'not-qualified'
  | '';
export type DisposalMethod = 'burial' | 'cremation' | 'other' | 'undecided' | '';
export type TellUsOnceStatus = 'reference-received' | 'not-offered' | 'declined' | '';
export type CopyOrderChannel =
  'at-registration' | 'gro-online' | 'phone' | 'post' | 'local-register-office' | '';

export type RegistrationClass =
  'ready-to-register' | 'incomplete' | 'referred-to-coroner-pending' | 'registered';
export type DeadlineStatus =
  | 'not-started'
  | 'paused-coroner'
  | 'on-track'
  | 'due-soon'
  | 'overdue'
  | 'registered'
  | 'registered-late';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — the deceased and the death. */
export interface Deceased {
  deceasedName: string;
  sex: Sex;
  /** ISO date string; null when unset. */
  dateOfBirth: string | null;
  /** ISO date string; null when unset. */
  dateOfDeath: string | null;
  placeOfDeath: string;
  deathJurisdiction: DeathJurisdiction;
  deceasedParticularsKnown: YesNo;
}

/** Step 2 — medical certificate and medical examiner. */
export interface Medical {
  mccdReceived: YesNo;
  medicalExaminerStatus: MedicalExaminerStatus;
  /** ISO date string; starts the 5-day clock; null when unset. */
  medicalExaminerConfirmationDate: string | null;
}

/** Step 3 — coroner. */
export interface Coroner {
  referredToCoroner: YesNo;
  coronerStage: CoronerStage;
  coronerCertificateReceived: YesNo;
}

/** Step 4 — the informant. */
export interface Informant {
  informantName: string;
  informantRelationship: InformantRelationship;
  informantAddress: string;
}

/** Step 5 — registration appointment. */
export interface RegistrationDetails {
  registerOffice: string;
  appointmentBooked: YesNo;
  supportingDocumentsAvailable: YesNo;
  /** ISO date string; null while unregistered. */
  registrationDate: string | null;
  /** ISO date string the assessment is made; null when unset. */
  asOfDate: string | null;
}

/** Step 6 — after registration. */
export interface Aftercare {
  disposalMethod: DisposalMethod;
  disposalCertificateIssued: YesNo;
  tellUsOnceStatus: TellUsOnceStatus;
  tellUsOnceReference: string;
  copiesRequested: number | null;
  copyOrderChannel: CopyOrderChannel;
  groIndexReference: string;
  priorityService: YesNo;
}

/** The full death-registration data model. */
export interface Registration {
  deceased: Deceased;
  medical: Medical;
  coroner: Coroner;
  informant: Informant;
  registration: RegistrationDetails;
  aftercare: Aftercare;
}

// ──────────────────────────────────────────────
// Grading / classification types
// ──────────────────────────────────────────────

/** A family- / registrar-facing flag (mirrors grade_flag). */
export interface FlaggedIssue {
  id: string;
  category: string;
  priority: Priority;
  description: string;
  suggestedAction: string;
}

/** A blocking rule that fired (mirrors grade_rule). */
export interface BlockingRule {
  ruleId: string;
  dimension: string;
  category: string;
  description: string;
}

/** The full classification result for one registration. */
export interface ValidationResult {
  registrationClass: RegistrationClass;
  deadlineStatus: DeadlineStatus;
  daysSinceConfirmation: number | null;
  informantQualified: boolean;
  blockingRules: BlockingRule[];
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
  section: keyof Registration;
}
