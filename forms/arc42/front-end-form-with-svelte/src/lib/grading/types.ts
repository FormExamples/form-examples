// Arc42Documentation — input shape for the scoring engine. Mirrors the SQL
// schema (snake_case columns become camelCase TS properties).

export type Priority = 'high' | 'medium' | 'low' | '';
export type Probability = Priority;
export type Impact = Priority;
export type AdrStatus = 'draft' | 'proposed' | 'accepted' | 'deprecated' | 'superseded' | '';
export type Completeness = 'empty' | 'partial' | 'complete' | '';
export type Maturity = 'draft' | 'reviewable' | 'ready' | 'mature' | '';

export interface BusinessGoal { ordinal: number; name: string; description: string; }
export interface QualityGoal { ordinal: number; name: string; priority: Priority; scenario: string; }
export interface Stakeholder { ordinal: number; name: string; role: string; concerns: string; }
export interface ConstraintItem { ordinal: number; kind: 'technical' | 'organizational' | 'convention' | ''; name: string; description: string; }
export interface ContextPartner { ordinal: number; kind: 'business' | 'technical' | ''; name: string; interfaceDescription: string; protocol: string; direction: 'inbound' | 'outbound' | 'bidirectional' | ''; }
export interface TechnologyDecision { ordinal: number; category: string; choice: string; rationale: string; }
export interface BuildingBlock { ordinal: number; parentOrdinal: number | null; name: string; responsibility: string; interfaces: string; }
export interface RuntimeScenario { ordinal: number; name: string; triggerDescription: string; stepsSummary: string; }
export interface DeploymentNode { ordinal: number; environment: 'development' | 'staging' | 'production' | 'disaster-recovery' | 'other' | ''; nodeName: string; responsibility: string; }
export interface CrosscuttingConcept { ordinal: number; name: string; description: string; }
export interface ArchitecturalDecision { ordinal: number; title: string; status: AdrStatus; context: string; decision: string; consequences: string; }
export interface QualityScenario { ordinal: number; source: string; stimulus: string; artifact: string; response: string; measure: string; }
export interface RiskItem { ordinal: number; kind: 'risk' | 'technical-debt' | ''; name: string; probability: Probability; impact: Impact; mitigation: string; }
export interface GlossaryTerm { ordinal: number; term: string; definition: string; }

export interface Arc42Documentation {
  architecture: { name: string; version: string; owner: string; status: 'draft' | 'active' | 'archived' | ''; description: string; };
  authorName: string;
  authorRole: string;
  documentDate: string;

  introduction: string;
  businessGoals: BusinessGoal[];
  qualityGoals: QualityGoal[];
  stakeholders: Stakeholder[];

  constraintItems: ConstraintItem[];

  businessContextDescription: string;
  technicalContextDescription: string;
  contextPartners: ContextPartner[];

  solutionStrategySummary: string;
  technologyDecisions: TechnologyDecision[];
  topLevelDecompositionSummary: string;
  qualityStrategies: string[]; // ≤5 free-text bullets

  buildingBlockOverview: string;
  buildingBlocks: BuildingBlock[];

  runtimeOverview: string;
  runtimeScenarios: RuntimeScenario[];

  deploymentOverview: string;
  deploymentNodes: DeploymentNode[];

  crosscuttingOverview: string;
  crosscuttingConcepts: CrosscuttingConcept[];

  architecturalDecisions: ArchitecturalDecision[];

  qualityTreeSummary: string;
  qualityScenarios: QualityScenario[];

  riskItems: RiskItem[];

  glossaryTerms: GlossaryTerm[];

  // Sign-off
  recommendation: 'proceed' | 'revise-first' | 'block' | '';
  additionalNotes: string;
  signedBy: string;
  signedAt: string;
  finalMaturityOverride: Maturity;
  finalMaturityOverrideReason: string;
}

export interface FiredRule { ruleId: string; sectionNumber: number; description: string; }
export interface AdditionalFlag { category: string; priority: 'high' | 'medium' | 'low'; description: string; }

export interface MaturityResult {
  computedMaturity: Maturity;
  finalMaturity: Maturity;
  completenessBySection: Record<number, Completeness>; // 1..12
  firedRules: FiredRule[];
  additionalFlags: AdditionalFlag[];
}
