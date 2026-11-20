// Type definitions for the US Standard Certificate of Death (NCHS 2003
// revision) form. The camelCase property names mirror the snake_case SQL columns
// in `sql/04_create_table_united_states_standard_certificate_of_death.sql`.
//
// This is a DOCUMENTATION-SUPPORT and VALIDITY-CLASSIFICATION instrument, not a
// numeric score and NOT legal advice. The engine checks that the certificate is
// complete and consistent against the NCHS Physicians' Handbook on Medical
// Certification of Death, classifies it, derives the underlying cause, and
// raises flags. The registering state agency decides.

export type YesNo = 'yes' | 'no' | '';
export type Sex = 'female' | 'male' | 'unknown' | '';
export type MannerOfDeath =
  | 'natural'
  | 'accident'
  | 'suicide'
  | 'homicide'
  | 'pending-investigation'
  | 'could-not-be-determined'
  | '';
export type ValidityClass = 'valid' | 'incomplete' | 'refer-to-medical-examiner-or-coroner';
export type Priority = 'high' | 'medium' | 'low';

export interface Jurisdiction {
  state: string;
}

export interface Decedent {
  decedentName: string;
  sex: Sex;
  dateOfBirth: string | null;
  ageYears: number | null;
  maritalStatus: string;
  veteranStatus: YesNo;
  stateOfResidence: string;
}

export interface Death {
  placeOfDeathType: string;
  placeOfDeathFacility: string;
  dateOfDeath: string | null;
  timeOfDeath: string | null;
}

export interface Certifier {
  certifierName: string;
  certifierType: string;
  certifierLicenseNumber: string;
  certificationDate: string | null;
  attendedDeceased: YesNo;
  lastSeenAliveDate: string | null;
}

export interface PartI {
  causeIaCondition: string;
  causeIaInterval: string;
  causeIbCondition: string;
  causeIbInterval: string;
  causeIcCondition: string;
  causeIcInterval: string;
  causeIdCondition: string;
  causeIdInterval: string;
}

export interface PartII {
  partIiConditions: string;
  autopsyPerformed: YesNo;
  autopsyFindingsAvailable: YesNo;
}

export interface Manner {
  mannerOfDeath: MannerOfDeath;
  tobaccoUseContributed: string;
  pregnancyStatus: string;
}

export interface Injury {
  injuryDate: string | null;
  injuryTime: string | null;
  injuryPlace: string;
  injuryAtWork: YesNo;
  injuryLocation: string;
  injuryDescription: string;
  transportationInjuryRole: string;
}

export interface Referral {
  referredToMedicalExaminer: YesNo;
  referralReason: string;
  certifierNote: string;
}

export interface Funeral {
  funeralDirectorName: string;
  funeralDirectorLicenseNumber: string;
  dispositionMethod: string;
  dispositionDate: string | null;
  dispositionPlace: string;
  filedDate: string | null;
}

export interface Copies {
  certifiedCopiesRequested: number | null;
  requesterRelationship: string;
  requesterIdentityVerified: YesNo;
  feePaidInUsd: number | null;
}

/** The whole certificate: one object per wizard section. */
export interface DeathCertificate {
  jurisdiction: Jurisdiction;
  decedent: Decedent;
  death: Death;
  certifier: Certifier;
  partI: PartI;
  partII: PartII;
  manner: Manner;
  injury: Injury;
  referral: Referral;
  funeral: Funeral;
  copies: Copies;
}

/** A prioritized flag (mirrors the grade_flag table). */
export interface FlaggedIssue {
  id: string;
  category: string;
  priority: Priority;
  description: string;
  suggestedAction: string;
}

/** The full validity classification result for one certificate. */
export interface ValidationResult {
  validityClass: ValidityClass;
  /** '' when Part I is empty. */
  underlyingCause: string;
  referralIndicated: boolean;
  flaggedIssues: FlaggedIssue[];
  timestamp: string;
}

export interface StepConfig {
  number: number;
  title: string;
  shortTitle: string;
  section: keyof DeathCertificate | 'summary';
}
