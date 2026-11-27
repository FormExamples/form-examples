// ──────────────────────────────────────────────
// Core data model — Medical Renal Living Donor Request
// ──────────────────────────────────────────────
//
// A generic histocompatibility request for a living kidney donor. The shape
// mirrors the HTML front-end's `emptyRequest()` source of truth: camelCase
// property names; empty string for unanswered text / enum fields; `null` for
// unanswered numeric fields; `false` for unticked booleans. The sample on the
// request is the donor's; the recipient is optional (an altruistic donor has
// none).

export type DonationPathway = 'directed' | 'altruistic' | 'paired-exchange' | '';
export type AboGroup = 'a' | 'b' | 'ab' | 'o' | 'unknown' | '';

/** A person's identity block, used for both the donor and the recipient. */
export interface Person {
  familyName: string;
  givenNames: string;
  previousName: string;
  birthDate: string;
  sex: string;
  nationalHealthIdentifier: string;
  medicalRecordNumber: string;
  address: string;
  postcode: string;
}

export interface Pathway {
  donationPathway: DonationPathway;
  relationshipOfDonorToRecipient: string;
  recipientTransplantCentreName: string;
  donorAboGroup: AboGroup;
  recipientAboGroup: AboGroup;
}

/** The 7 test-menu tick boxes, by state field name. */
export type TestField =
  | 'livingDonorFullCrossmatch'
  | 'livingDonorVirtualCrossmatch'
  | 'livingDonorMatchGrade'
  | 'altruisticDonor'
  | 'dayOfTransplantSamples'
  | 'aboTitresOnly'
  | 'redCellAntibodyFollowUp';

export type Tests = Record<TestField, boolean> & {
  testDetail: string;
  urgentTesting: boolean;
  urgentTestingReason: string;
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
  samplesOtherDescription: string;
}

/** Laboratory-use-only block. */
export interface Lab {
  laboratoryDonorIdentifier: string;
  laboratoryRecipientIdentifier: string;
  laboratorySampleNumber: string;
  laboratorySampleReceivedAt: string;
  laboratoryIdentifiersCheckedBy: string;
}

/** The full renal living donor request data model. */
export interface RenalLivingDonorRequest {
  donor: Person;
  recipient: Person;
  pathway: Pathway;
  tests: Tests;
  requester: Requester;
  sample: Sample;
  lab: Lab;
}

/** Tube volumes (mL) a test needs, by tube type. Local policy. */
export interface TubeNeeds {
  edta?: number;
  pink?: number;
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
  section: keyof RenalLivingDonorRequest;
}
