// TypeScript types for the United States Property Tax Exemption Application.
// Mirrors front-end-with-html/js/types.js and the SQL columns in
// sql/04_create_table_property_tax_exemption_application.sql.
//
// Documentation support, not legal or tax advice; the county assessor or state
// agency decides.

export type YesNo = 'yes' | 'no' | '';
export type PropertyType =
  'single-family' | 'condominium' | 'manufactured-home' | 'multi-unit' | 'other' | '';
export type OwnershipType =
  'sole' | 'joint' | 'trust' | 'life-estate' | 'contract-buyer' | 'other' | '';
export type ApplicationType = 'initial' | 'renewal' | 'late' | '';
export type EligibilityClass = 'likely-eligible' | 'incomplete' | 'likely-ineligible';
export type Priority = 'high' | 'medium' | 'low';
export type ExemptionId = 'homestead' | 'senior' | 'disability' | 'veteran' | 'circuit-breaker';

export interface Applicant {
  applicantName: string;
  dateOfBirth: string | null;
  ageOnAssessmentDate: number | null;
  mailingAddress: string;
}

export interface Property {
  state: string;
  county: string;
  parcelNumber: string;
  propertyAddress: string;
  propertyType: PropertyType;
  ownershipType: OwnershipType;
  ownerOnAssessmentDate: YesNo;
  occupiedAsPrimaryResidence: YesNo;
  occupancyStartDate: string | null;
  otherHomesteadClaimed: YesNo;
}

export interface Exemptions {
  claimHomestead: YesNo;
  claimSenior: YesNo;
  claimDisability: YesNo;
  claimVeteran: YesNo;
  claimCircuitBreaker: YesNo;
  veteranDisabilityPercent: number | null;
}

export interface Income {
  householdIncomeDollars: number | null;
  incomeTaxYear: number | null;
}

export interface Documents {
  proofOfOwnership: YesNo;
  proofOfResidency: YesNo;
  proofOfAge: YesNo;
  proofOfIncome: YesNo;
  proofOfDisability: YesNo;
}

export interface Filing {
  assessmentYear: number | null;
  filingDate: string | null;
  applicationType: ApplicationType;
}

export interface Appeal {
  appealRequested: YesNo;
  noticeOfValueDate: string | null;
  appealFiled: YesNo;
}

export interface Declaration {
  penaltyAcknowledged: YesNo;
  signedByApplicant: YesNo;
  signatureDate: string | null;
}

/** The full application data model. */
export interface PropertyTaxApplication {
  applicant: Applicant;
  property: Property;
  exemptions: Exemptions;
  income: Income;
  documents: Documents;
  filing: Filing;
  appeal: Appeal;
  declaration: Declaration;
}

/** An applicant- or assessor-facing flag (mirrors grade_flag). */
export interface FlaggedIssue {
  id: string;
  category: string;
  priority: Priority;
  description: string;
  suggestedAction: string;
}

/** A rule that fired (mirrors grade_rule). */
export interface FiredRule {
  id: string;
  dimension: string;
  category: string;
  description: string;
}

/** The grader's output (no flags; the detector is separate). */
export interface GradeResult {
  eligibilityClass: EligibilityClass;
  filingDeadline: string | null;
  filedLate: boolean;
  qualifyingExemptions: ExemptionId[];
  rules: FiredRule[];
}

/** The full result for one application, as shown in the report. */
export interface ValidationResult {
  eligibilityClass: EligibilityClass;
  filingDeadline: string | null;
  filedLate: boolean;
  qualifyingExemptions: ExemptionId[];
  flaggedIssues: FlaggedIssue[];
  timestamp: string;
}

export interface StateRule {
  name: string;
  homestead: string;
  seniorProgram: boolean;
  seniorAge: number | null;
  incomeLimit: number | null;
  circuitBreaker: boolean;
  deadline: { month: number; day: number; yearOffset: number } | null;
  deadlineNote: string;
  appealNote: string;
  verify: boolean;
}

export interface ExemptionStatus {
  status: 'pass' | 'fail' | 'unknown';
  reason: string;
}

export interface StepConfig {
  number: number;
  title: string;
  shortTitle: string;
  section: keyof PropertyTaxApplication;
}
