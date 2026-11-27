// ──────────────────────────────────────────────
// Core data model — Medical Haematopoietic Stem Cell Transplant Patients/Donors HLA Typing Request
// ──────────────────────────────────────────────
//
// A generic HLA typing request for a haematopoietic stem cell transplant (HSCT)
// recipient or a potential donor. One request per person sampled. The shape
// mirrors the HTML front-end's `emptyRequest()` source of truth: camelCase
// property names; empty string for unanswered text / enum fields; `null` for
// unanswered numeric fields; `false` for unticked booleans.

export type SubjectRole = 'hsct-recipient' | 'potential-donor' | '';
export type DonorType =
  | 'matched-sibling'
  | 'haploidentical-relative'
  | 'other-relative'
  | 'unrelated-volunteer'
  | 'unknown'
  | '';
export type Resolution = 'not-specified' | 'low' | 'high' | '';

export interface Subject {
  familyName: string;
  givenNames: string;
  previousName: string;
  birthDate: string;
  sex: string;
  ethnicity: string;
  nationalHealthIdentifier: string;
  medicalRecordNumber: string;
  address: string;
  postcode: string;
}

export interface Referrer {
  clinicianName: string;
  clinicianRole: string;
  clinicianEmail: string;
  department: string;
  organization: string;
  copyOfReportTo: string;
  reportEmail: string;
}

export interface RequestDetails {
  subjectRole: SubjectRole;
  donorType: DonorType;
  hlaTypingResolution: Resolution;
  clinicalDetails: string;
}

export interface LinkedRecipient {
  recipientFamilyName: string;
  recipientGivenNames: string;
  recipientMedicalRecordNumber: string;
  recipientBirthDate: string;
  relationshipToRecipient: string;
}

export interface Urgency {
  urgentTesting: boolean;
  urgentTestingReason: string;
}

export interface Requester {
  requestedBySignedAt: string;
  consentAndIdentityConfirmed: boolean;
}

export interface Sample {
  sampleCollectorName: string;
  sampleCollectedAt: string;
  identifiersOnSampleCount: number | null;
  identifiersOnFormCount: number | null;
  sampleAndFormDetailsMatch: boolean;
  edtaPurpleVolumeMl: number | null;
  edtaPinkVolumeMl: number | null;
  clottedRedVolumeMl: number | null;
  samplesOtherDescription: string;
}

/** Laboratory-use-only block. */
export interface Lab {
  laboratoryRecipientIdentifier: string;
  laboratoryDonorIdentifier: string;
  laboratorySampleNumber: string;
  laboratorySampleReceivedAt: string;
  laboratoryIdentifiersCheckedBy: string;
}

/** The full HSCT HLA typing request data model. */
export interface HsctTypingRequest {
  subject: Subject;
  referrer: Referrer;
  request: RequestDetails;
  recipient: LinkedRecipient;
  urgency: Urgency;
  requester: Requester;
  sample: Sample;
  lab: Lab;
}

/** Tube volumes (mL) a role needs. Local policy. */
export interface TubeNeeds {
  edtaPurple: number;
  edtaPink: number;
  clottedRed: number;
}

// ──────────────────────────────────────────────
// Four-axis grading types
// ──────────────────────────────────────────────

export type AppropriatenessBand =
  'usually-appropriate' | 'may-be-appropriate' | 'usually-not-appropriate';
export type IdentitySafetyBand = 'ok' | 'caution' | 'reject-risk';
export type TriageTier = 'routine' | 'urgent' | 'emergency' | 'stat';
export type Recommendation = 'accept' | 'query-referrer' | 'reject';
export type FlagPriority = 'high' | 'medium' | 'low';

/** A rule that fired during grading, with its axis and human-readable reason. */
export interface FiredRule {
  ruleId: string;
  axis: string;
  category: string;
  description: string;
}

/** A safety flag raised independently of the four axes. */
export interface SafetyFlag {
  flagId: string;
  category: string;
  priority: FlagPriority;
  description: string;
  suggestedAction: string;
}

/** The full four-axis grading result. */
export interface GradingResult {
  appropriatenessScore: number;
  appropriatenessBand: AppropriatenessBand;
  identitySafetyBand: IdentitySafetyBand;
  completenessPercent: number;
  triageTier: TriageTier;
  targetTimeframe: string;
  requiredSamplesSummary: string;
  subjectRole: string;
  recommendation: Recommendation;
  recommendationLabel: string;
  firedRules: FiredRule[];
  flags: SafetyFlag[];
  timestamp: string;
}

// ──────────────────────────────────────────────
// Step configuration
// ──────────────────────────────────────────────

export interface StepConfig {
  number: number;
  title: string;
  shortTitle: string;
  section: keyof HsctTypingRequest;
}
