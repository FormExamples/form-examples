// ──────────────────────────────────────────────
// Core data types (United Kingdom Last Will and Testament — England and Wales)
//
// This is a WILL-DRAFTING DOCUMENTATION and VALIDITY-CLASSIFICATION instrument,
// not a numeric score and NOT legal advice. The engine checks that the will
// record is complete and that the Wills Act 1837 formalities are planned or
// met, classifies it as `valid` / `incomplete` / `formality-risk`, and raises
// flagged issues. It cannot confirm that a will is legally valid.
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/03_create_table_united_kingdom_last_will_and_testament.sql`. Text / enum
// fields default to `''`; numeric and date fields default to `null`.
// ──────────────────────────────────────────────

export type YesNo = 'yes' | 'no' | '';
export type Domicile = 'england-wales' | 'scotland' | 'northern-ireland' | 'other' | '';
export type MaritalStatus =
  | 'single'
  | 'married'
  | 'civil-partnership'
  | 'cohabiting'
  | 'divorced-or-dissolved'
  | 'widowed'
  | '';
export type PreviousWill = 'none' | 'exists' | 'unsure' | '';
export type EstateValueBand = 'under-325k' | '325k-500k' | '500k-2m' | 'over-2m' | '';
export type BeneficiaryRelationship =
  | 'spouse-or-civil-partner'
  | 'unmarried-partner'
  | 'child'
  | 'grandchild'
  | 'other-relative'
  | 'friend'
  | 'charity'
  | 'other'
  | '';
export type FuneralWishes = 'burial' | 'cremation' | 'no-preference' | 'other' | '';
export type ExecutionStatus = 'draft' | 'signed' | '';
export type ValidityClass = 'valid' | 'incomplete' | 'formality-risk';
export type Priority = 'high' | 'medium' | 'low';

/** The testator. */
export interface Testator {
  testatorName: string;
  dateOfBirth: string | null;
  testatorAddress: string;
  domicile: Domicile;
  maritalStatus: MaritalStatus;
  marriageExpected: YesNo;
  contemplationOfMarriageClause: YesNo;
  hasMentalCapacity: YesNo;
  madeVoluntarily: YesNo;
  previousWill: PreviousWill;
  revocationClause: YesNo;
}

/** The estate. */
export interface Estate {
  estateValueBand: EstateValueBand;
  ownsHome: YesNo;
  homeToDirectDescendants: YesNo;
  charityGiftPercent: number | null;
  estateOtherJurisdictions: YesNo;
  otherJurisdictionsDetail: string;
  specificGiftsNotes: string;
}

/** Executors. */
export interface Executors {
  executorFirstName: string;
  executorFirstRelationship: string;
  executorSecondName: string;
  executorSecondRelationship: string;
  executorsAdultConfirmed: YesNo;
}

/** Beneficiaries and residuary estate. */
export interface Beneficiaries {
  beneficiaryFirstName: string;
  beneficiaryFirstRelationship: BeneficiaryRelationship;
  beneficiaryFirstSharePercent: number | null;
  beneficiaryFirstIsMinor: YesNo;
  beneficiaryFirstHasTrustee: YesNo;
  beneficiarySecondName: string;
  beneficiarySecondRelationship: BeneficiaryRelationship;
  beneficiarySecondSharePercent: number | null;
  beneficiarySecondIsMinor: YesNo;
  beneficiarySecondHasTrustee: YesNo;
  beneficiaryThirdName: string;
  beneficiaryThirdRelationship: BeneficiaryRelationship;
  beneficiaryThirdSharePercent: number | null;
  beneficiaryThirdIsMinor: YesNo;
  beneficiaryThirdHasTrustee: YesNo;
  beneficiaryFourthName: string;
  beneficiaryFourthRelationship: BeneficiaryRelationship;
  beneficiaryFourthSharePercent: number | null;
  beneficiaryFourthIsMinor: YesNo;
  beneficiaryFourthHasTrustee: YesNo;
  residuaryClause: YesNo;
  dependantsConsidered: YesNo;
}

/** Guardians and funeral wishes. */
export interface Family {
  hasChildrenUnder18: YesNo;
  guardianName: string;
  funeralWishes: FuneralWishes;
  funeralWishesNote: string;
}

/** Signing and witnessing. */
export interface Execution {
  executionStatus: ExecutionStatus;
  dateOfWill: string | null;
  willInWriting: YesNo;
  testatorSigned: YesNo;
  witnessesPresentTogether: YesNo;
  witnessesSigned: YesNo;
  witnessFirstName: string;
  witnessFirstOver18: YesNo;
  witnessFirstIsBeneficiaryOrSpouse: YesNo;
  witnessSecondName: string;
  witnessSecondOver18: YesNo;
  witnessSecondIsBeneficiaryOrSpouse: YesNo;
  drafterNote: string;
}

/** The full United Kingdom Last Will and Testament data model. */
export interface Will {
  testator: Testator;
  estate: Estate;
  executors: Executors;
  beneficiaries: Beneficiaries;
  family: Family;
  execution: Execution;
}

// ──────────────────────────────────────────────
// Grading / classification types
// ──────────────────────────────────────────────

/** A formality, completeness, or awareness flag (mirrors grade_flag). */
export interface FlaggedIssue {
  id: string;
  category: string;
  priority: Priority;
  description: string;
  suggestedAction: string;
}

/** The full validity classification result for one will record. */
export interface ValidationResult {
  validityClass: ValidityClass;
  /** A Wills Act 1837 formality risk is indicated. */
  formalityRisk: boolean;
  /** Sum of the named beneficiaries' percentage shares. */
  sharesTotalPercent: number;
  /** Witnesses named in the execution section. */
  witnessCount: number;
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
  section: keyof Will;
}
