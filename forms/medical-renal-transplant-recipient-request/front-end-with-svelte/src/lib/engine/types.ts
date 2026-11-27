// ──────────────────────────────────────────────
// Core data model — Medical Renal Transplant Recipient Request
// ──────────────────────────────────────────────
//
// A generic histocompatibility / immunogenetics request for a kidney,
// kidney/pancreas or pancreas transplant recipient. The shape mirrors the HTML
// front-end's `emptyRequest()` source of truth: camelCase property names; empty
// string for unanswered text / enum fields; `null` for unanswered numeric
// fields; `false` for unticked booleans.

export type Organ = 'kidney' | 'kidney-pancreas' | 'pancreas' | '';
export type AboGroup = 'a' | 'b' | 'ab' | 'o' | 'unknown' | '';
export type DialysisMode =
  | 'unit-haemodialysis'
  | 'capd'
  | 'home-peritoneal-dialysis'
  | 'pre-dialysis'
  | 'failing-transplant'
  | '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
export type DfppStatus = 'pre-dfpp' | 'post-dfpp' | 'no-dfpp' | '';

export interface Recipient {
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

export interface History {
  organRequired: Organ;
  previousTransplantCount: number | null;
  previousTransplantDates: string;
  transfusionCount: number | null;
  transfusionDates: string;
  pregnancyCount: number | null;
  pregnancyDates: string;
}

export interface Clinical {
  autoimmuneDisease: boolean;
  virologyRisk: boolean;
  immunosuppression: string;
  clinicalInformation: string;
  recipientAboGroup: AboGroup;
  dialysisMode: DialysisMode;
  dialysisUnitName: string;
}

/** The 17 test-menu tick boxes, by state field name. */
export type TestField =
  | 'listRegistrationFirstTypingAndRetyping'
  | 'listRegistrationReturningToList'
  | 'listRegistrationOther'
  | 'deceasedDonorFullCrossmatch'
  | 'deceasedDonorDayOfTransplant'
  | 'livingDonorFullCrossmatch'
  | 'livingDonorDayOfTransplant'
  | 'livingDonorVirtualCrossmatch'
  | 'livingDonorMatchGrade'
  | 'livingDonorAboTitresOnly'
  | 'autologousCrossmatch'
  | 'hlaMonitoringRoutineTransplantList'
  | 'hlaMonitoringRoutinePostTransplant'
  | 'hlaMonitoringPostTransfusion'
  | 'hlaRejectionInvestigation'
  | 'aboIncompatibleMonitoring'
  | 'redCellAntibodyFollowUp';

export type Tests = Record<TestField, boolean> & {
  testDetail: string;
  urgentTesting: boolean;
  urgentTestingReason: string;
  dfppStatus: DfppStatus;
  postTransfusionDatesAndNumber: string;
  donorReference: string;
};

export interface Requester {
  clinicianName: string;
  clinicianRole: string;
  clinicianEmail: string;
  transplantCentreName: string;
  requestedBySignedAt: string;
  consentAndIdentityConfirmed: boolean;
}

export interface Sample {
  sampleCollectorName: string;
  sampleCollectedAt: string;
  identifiersOnSampleCount: number | null;
  identifiersOnFormCount: number | null;
  sampleAndFormDetailsMatch: boolean;
  samplesEdtaPurpleCount: number | null;
  samplesEdtaPinkHandLabelledCount: number | null;
  samplesSerumCount: number | null;
}

/** Laboratory-use-only block. */
export interface Lab {
  laboratoryDonorIdentifier: string;
  laboratoryRecipientIdentifier: string;
  laboratorySampleNumber: string;
  laboratorySampleReceivedAt: string;
  laboratoryIdentifiersCheckedBy: string;
}

/** The full renal transplant recipient request data model. */
export interface RenalRecipientRequest {
  recipient: Recipient;
  history: History;
  clinical: Clinical;
  tests: Tests;
  requester: Requester;
  sample: Sample;
  lab: Lab;
}

/** Tube volumes (mL) a test needs, by tube type. Local policy. */
export interface TubeNeeds {
  edta?: number;
  pink?: number;
  serum?: number;
  abo?: number;
}

export interface TestDefinition {
  field: TestField;
  code: string;
  label: string;
  group: string;
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
  section: keyof RenalRecipientRequest;
}
