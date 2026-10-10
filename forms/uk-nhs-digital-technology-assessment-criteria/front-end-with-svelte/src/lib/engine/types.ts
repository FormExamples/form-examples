// Types for the DTAC assessment, derived from defaults.ts (the canonical blank
// state) and the engine contract in spec/index.md. '' = unanswered text/enum,
// null = unanswered date.

export type CriterionStatus = "met" | "partially-met" | "not-met" | "not-applicable";
/** A criterion answer: a status, or '' when unanswered. */
export type CriterionAnswer = CriterionStatus | "";
export type SectionId = "a" | "b" | "c" | "d" | "e" | "f" | "g";
export type Outcome = "meets" | "conditional" | "does-not-meet" | "incomplete";
export type SectionResult = "met" | "partially-met" | "not-met" | "incomplete";
export type FlagSeverity = "critical" | "warning" | "info";

export interface Section {
  id: SectionId;
  title: string;
}

export interface Criterion {
  id: string;
  key: string;
  column: string;
  mandatory: boolean;
  description: string;
  section: SectionId;
}

export interface Supplier {
  name: string;
  tradingName: string;
  companyRegistrationNumber: string;
  countryOfRegistration: string;
  icoRegistrationNumber: string;
  website: string;
  postalAddress: string;
  postcode: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

export interface Product {
  name: string;
  version: string;
  description: string;
  intendedPurpose: string;
  productType: string;
  medicalDeviceClass: string;
  handlesPatientData: string;
  isPatientFacing: string;
}

export interface Assessor {
  name: string;
  email: string;
  phone: string;
  organisation: string;
  role: string;
}

export interface AssessmentMeta {
  status: string;
  assessmentDate: string | null;
  reviewDueDate: string | null;
  dtacVersion: string;
  commissioningOrganisation: string;
  assessorNotes: string;
  finalOutcome: string;
  assessorOverrideReason: string;
}

export interface DtacAssessment {
  supplier: Supplier;
  product: Product;
  assessor: Assessor;
  assessment: AssessmentMeta;
  criteria: Record<string, CriterionAnswer>;
  notes: Record<string, string>;
}

export interface FiredRule {
  ruleId: string;
  section: SectionId;
  criterionId: string;
  status: CriterionStatus;
  mandatory: boolean;
  description: string;
}

export interface Flag {
  flagId: string;
  category: string;
  severity: FlagSeverity;
  message: string;
}

export interface GradingResult {
  outcome: Outcome;
  outcomeLabel: string;
  mandatoryTotal: number;
  mandatoryMet: number;
  advisoryTotal: number;
  advisoryMet: number;
  sections: Record<string, SectionResult>;
  firedRules: FiredRule[];
  flags: Flag[];
}
