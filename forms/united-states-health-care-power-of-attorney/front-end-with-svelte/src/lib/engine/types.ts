// ──────────────────────────────────────────────
// Core data types (United States Health Care Power of Attorney)
//
// This is a DOCUMENTATION and EXECUTION-READINESS instrument, NOT legal advice.
// The engine checks that the directive is complete, that the agent and
// witnesses are eligible, and that the signing formalities match the
// principal's state rule, and it classifies the directive as `ready-to-execute`,
// `incomplete`, or `execution-risk`. A court or the treating facility decides
// whether a directive is valid.
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_united_states_health_care_power_of_attorney.sql`. Text /
// enum fields default to `''`; numeric and date fields default to `null`.
// ──────────────────────────────────────────────

export type YesNo = 'yes' | 'no' | '';
export type AgentRelationship =
  'spouse' | 'adult-child' | 'parent' | 'sibling' | 'other-relative' | 'friend' | 'other' | '';
export type EffectiveWhen = 'immediately' | 'upon-incapacity' | '';
export type IncapacityDeterminedBy = 'one-physician' | 'two-physicians' | 'other' | '';
export type OrganDonation =
  'any-needs' | 'transplant-only' | 'research-only' | 'none' | 'not-addressed' | '';
export type PriorDirectiveStatus = 'none-existing' | 'revokes-prior' | 'prior-remains' | '';
export type LifeSustainingTreatment =
  'refuse' | 'time-limited-trial' | 'want-all' | 'agent-decides' | '';
export type TreatmentChoice = 'accept' | 'refuse' | 'agent-decides' | '';
export type PolstStatus = 'none' | 'in-place' | 'discussing' | '';
export type ExecutionMethod =
  'two-witnesses' | 'one-witness' | 'notary' | 'witnesses-and-notary' | '';
export type ReadinessClass = 'ready-to-execute' | 'incomplete' | 'execution-risk';
export type Priority = 'high' | 'medium' | 'low';
export type RelativeRule = 'none' | 'one-unrelated' | 'all-unrelated';
export type ProviderBar = 'none' | 'one' | 'all';

/** Step 1 — principal. */
export interface Principal {
  principalName: string;
  birthDate: string | null;
  state: string;
  phone: string;
  capacityConfirmed: YesNo;
  signedVoluntarily: YesNo;
}

/** Step 2 — agent and successors. */
export interface Agent {
  agentName: string;
  agentRelationship: AgentRelationship;
  agentAge: number | null;
  agentPhone: string;
  agentIsHealthCareProvider: YesNo;
  agentIsFacilityEmployee: YesNo;
  agentRelatedToPrincipal: YesNo;
  agentAccepted: YesNo;
  successor1Name: string;
  successor1Phone: string;
  successor2Name: string;
}

/** Step 3 — authority. */
export interface Authority {
  effectiveWhen: EffectiveWhen;
  incapacityDeterminedBy: IncapacityDeterminedBy;
  hipaaRelease: YesNo;
  mentalHealthAuthority: YesNo;
  organDonation: OrganDonation;
  priorDirectiveStatus: PriorDirectiveStatus;
}

/** Step 4 — treatment wishes. */
export interface Wishes {
  lifeSustainingTreatment: LifeSustainingTreatment;
  cpr: TreatmentChoice;
  ventilator: TreatmentChoice;
  artificialNutrition: TreatmentChoice;
  comfortCareFirst: YesNo;
  seriousIllness: YesNo;
  polstStatus: PolstStatus;
  wishesNote: string;
}

/** Step 5 — signing and witnesses. */
export interface Execution {
  signatureDate: string | null;
  executionMethod: ExecutionMethod;
  witnessesPresent: YesNo;
  witness1Name: string;
  witness1IsRelative: YesNo;
  witness1IsHeir: YesNo;
  witness1IsAgent: YesNo;
  witness1IsProvider: YesNo;
  witness2Name: string;
  witness2IsRelative: YesNo;
  witness2IsHeir: YesNo;
  witness2IsAgent: YesNo;
  witness2IsProvider: YesNo;
  notaryName: string;
  principalInSkilledNursingFacility: YesNo;
  ombudsmanSigned: YesNo;
}

/** Distribution of signed copies. */
export interface Distribution {
  copyToAgent: YesNo;
  copyToPhysician: YesNo;
  copyToSuccessor: YesNo;
  copyToFacility: YesNo;
}

/** The full health care power of attorney data model. */
export interface Directive {
  principal: Principal;
  agent: Agent;
  authority: Authority;
  wishes: Wishes;
  execution: Execution;
  distribution: Distribution;
}

// ──────────────────────────────────────────────
// Grading / classification types
// ──────────────────────────────────────────────

/** A principal- / reviewer-facing flag (mirrors grade_flag). */
export interface FlaggedIssue {
  id: string;
  category: string;
  priority: Priority;
  description: string;
  suggestedAction: string;
}

/** The full readiness classification result for one directive. */
export interface ReadinessResult {
  readinessClass: ReadinessClass;
  ruleSetName: string;
  missingCount: number;
  executionRisk: boolean;
  flaggedIssues: FlaggedIssue[];
  timestamp: string;
}

/** One state's execution rule (see rules.ts for the verified values). */
export interface StateRule {
  name: string;
  witnesses: number;
  notaryAlternative: boolean;
  relativeRule: RelativeRule;
  heirRule: RelativeRule;
  providerBar: ProviderBar;
  snfOmbudsman: boolean;
  agentProviderBar: boolean;
  cite: string;
}

/** A hard execution defect: a stable code and a human sentence. */
export interface ExecutionDefect {
  code: string;
  text: string;
}

// ──────────────────────────────────────────────
// Step configuration
// ──────────────────────────────────────────────

export interface StepConfig {
  number: number;
  title: string;
  shortTitle: string;
  section: keyof Directive;
}
