// ──────────────────────────────────────────────
// Core data types (United States durable financial power of attorney)
//
// An execution-READINESS instrument. The engine checks the notary, witness,
// effectiveness, hot-power, and gifting plan against the governing state's rule
// (Uniform Power of Attorney Act baseline plus a STATE_RULES table) and
// classifies it as `ready-to-execute` / `incomplete` / `execution-risk`.
// Documentation support, not legal advice; the statute, the notary, and a court
// decide.
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_united_states_durable_financial_power_of_attorney.sql`.
// Text / enum fields default to `''`; numeric and date fields default to `null`.
// ──────────────────────────────────────────────

export type YesNo = 'yes' | 'no' | '';
export type Effectiveness = 'immediate' | 'springing' | '';
export type SpringingTrigger =
  'physician-certification' | 'named-person-declaration' | 'court-determination' | '';
export type AgentRelationship =
  'spouse' | 'child' | 'other-family' | 'friend' | 'professional' | 'financial-institution' | '';
export type CoAgentsMode = 'sole' | 'jointly' | 'independently' | '';
export type Compensation = 'none' | 'reasonable' | 'fixed' | '';
export type GiftLimitType = 'annual-exclusion' | 'fixed-amount' | 'unlimited' | 'none' | '';
export type BankFormStatus = 'yes' | 'no' | 'not-needed' | '';
export type Form2848Status = 'filed' | 'not-filed' | 'not-needed' | '';

export type ValidityClass = 'ready-to-execute' | 'incomplete' | 'execution-risk';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1: principal and governing state. */
export interface Principal {
  principalName: string;
  /** ISO date string; null when unset. */
  dateOfBirth: string | null;
  /** Two-letter state code or ''. */
  state: string;
  principalAddress: string;
  capacityConfirmed: YesNo;
}

/** Step 2: durability and effectiveness. */
export interface Instrument {
  durableStatement: YesNo;
  effectiveness: Effectiveness;
  springingTrigger: SpringingTrigger;
  statutoryNoticeIncluded: YesNo;
}

/** Step 3: agent and successors. */
export interface Agents {
  agentName: string;
  agentRelationship: AgentRelationship;
  agentIsAdult: YesNo;
  agentSignedAcknowledgment: YesNo;
  successorAgentName: string;
  coAgentsMode: CoAgentsMode;
  compensation: Compensation;
  compensationAmount: number | null;
}

/** Step 4: general grants and hot powers. */
export interface Authority {
  grantBanking: YesNo;
  grantRealEstate: YesNo;
  grantInvestments: YesNo;
  grantBusiness: YesNo;
  grantInsurance: YesNo;
  grantTaxMatters: YesNo;
  grantBenefits: YesNo;
  grantRetirement: YesNo;
  grantClaims: YesNo;
  grantPersonalProperty: YesNo;
  hotCreateTrust: YesNo;
  hotGift: YesNo;
  hotSurvivorship: YesNo;
  hotBeneficiary: YesNo;
  hotDelegate: YesNo;
  hotAnnuityWaiver: YesNo;
  hotDisclaim: YesNo;
  hotPowersInitialed: YesNo;
  giftLimitType: GiftLimitType;
  giftLimitAmount: number | null;
  selfGiftingAllowed: YesNo;
}

/** Step 5: notary and witnesses. */
export interface Execution {
  notaryArranged: YesNo;
  /** Witnesses other than the notary. */
  witnessCount: number | null;
  witnessIsAgent: YesNo;
}

/** Step 6: acceptance and use. */
export interface Acceptance {
  usedForRealEstate: YesNo;
  bankFormCompleted: BankFormStatus;
  form2848Status: Form2848Status;
}

export interface PowerOfAttorney {
  principal: Principal;
  instrument: Instrument;
  agents: Agents;
  authority: Authority;
  execution: Execution;
  acceptance: Acceptance;
}

export interface FlaggedIssue {
  id: string;
  category: string;
  priority: Priority;
  description: string;
  suggestedAction: string;
}

export interface FiredRule {
  ruleId: string;
  dimension: string;
  category: string;
  description: string;
}

/** The readiness classification. */
export interface ValidationResult {
  validityClass: ValidityClass;
  governingState: string;
  executionRiskIndicated: boolean;
  firedRules: FiredRule[];
  flaggedIssues: FlaggedIssue[];
  timestamp: string;
}

export type GrantField =
  | 'grantBanking'
  | 'grantRealEstate'
  | 'grantInvestments'
  | 'grantBusiness'
  | 'grantInsurance'
  | 'grantTaxMatters'
  | 'grantBenefits'
  | 'grantRetirement'
  | 'grantClaims'
  | 'grantPersonalProperty';
export type HotField =
  | 'hotCreateTrust'
  | 'hotGift'
  | 'hotSurvivorship'
  | 'hotBeneficiary'
  | 'hotDelegate'
  | 'hotAnnuityWaiver'
  | 'hotDisclaim';

export interface StateRule {
  name: string;
  citation: string;
  upoaa: boolean;
  notary: 'required' | 'recommended' | 'either';
  witnesses: number;
  notaryCountsAsWitness: boolean;
  springing: 'allowed' | 'prohibited';
  durability: 'default' | 'express';
  initials: boolean;
  agentSignature: 'none' | 'effectiveness' | 'before-acting';
  notice: boolean;
}

/** Wizard step configuration. */
export interface StepConfig {
  number: number;
  title: string;
  shortTitle: string;
  section: string;
}
