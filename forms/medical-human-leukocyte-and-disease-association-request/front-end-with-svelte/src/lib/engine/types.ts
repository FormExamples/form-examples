// ──────────────────────────────────────────────
// Core data model — Medical Human Leukocyte and Disease Association Request
// ──────────────────────────────────────────────
//
// A generic HLA typing request for disease association or drug-hypersensitivity
// screening. The shape mirrors the HTML front-end's `emptyRequest()` source of
// truth: camelCase property names; empty string for unanswered text / enum
// fields; `null` for unanswered numeric fields; `false` for unticked booleans.

export type IndicationCategory =
  | 'suspected-disease'
  | 'pre-treatment-drug-hypersensitivity'
  | 'treatment-response'
  | 'family-screening'
  | 'exclusion-of-disease'
  | 'other'
  | '';

export interface Patient {
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

/** The 8 test-menu tick boxes, by state field name. */
export type TestField =
  | 'hlaA29'
  | 'hlaB27'
  | 'hlaB51'
  | 'hlaB5701'
  | 'hlaDr15Dq6'
  | 'hlaDq2Dq8'
  | 'hlaDqa105'
  | 'otherHlaDiseaseAssociation';

export type Tests = Record<TestField, boolean> & {
  testDetail: string;
};

export interface Clinical {
  indicationCategory: IndicationCategory;
  clinicalDetails: string;
  plannedDrug: string;
  previousHlaTypingKnown: boolean;
}

export interface Urgency {
  urgentTesting: boolean;
  urgentTestingReason: string;
  highRiskSample: boolean;
  highRiskDescription: string;
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
  sampleVolumeMl: number | null;
  samplesOtherDescription: string;
}

/** Laboratory-use-only block. */
export interface Lab {
  laboratorySampleNumber: string;
  laboratorySampleReceivedAt: string;
  laboratoryIdentifiersCheckedBy: string;
}

/** The full HLA disease association request data model. */
export interface HlaAssociationRequest {
  patient: Patient;
  referrer: Referrer;
  tests: Tests;
  clinical: Clinical;
  urgency: Urgency;
  requester: Requester;
  sample: Sample;
  lab: Lab;
}

/** Tube volumes (mL) a test needs, by tube type. Local policy. */
export interface TubeNeeds {
  edta?: number;
}

export interface TestDefinition {
  field: TestField;
  code: string;
  label: string;
  /** Typical use, shown beside the label. */
  use: string;
  samples: TubeNeeds;
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
  selectedTests: string[];
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
  section: keyof HlaAssociationRequest;
}
