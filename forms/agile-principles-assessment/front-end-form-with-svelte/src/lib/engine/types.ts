export type LikertScore = 1 | 2 | 3 | 4 | 5 | null;

export type Maturity =
  | 'optimising'
  | 'mature'
  | 'developing'
  | 'initial'
  | 'ad-hoc'
  | 'insufficient-data';

export type PrincipleBand = 'high' | 'mid' | 'low' | 'unanswered';

export type FlagPriority = 'low' | 'medium' | 'high';

export type FlagCategory =
  | 'customer-disconnect'
  | 'change-resistance'
  | 'slow-delivery'
  | 'silo-collaboration'
  | 'morale-risk'
  | 'communication-gap'
  | 'output-not-outcome'
  | 'burnout-risk'
  | 'technical-debt'
  | 'over-engineering'
  | 'command-and-control'
  | 'no-retrospective'
  | 'critical-principle-gap'
  | 'insufficient-data'
  | 'other';

export interface Respondent {
  isAnonymous: boolean;
  fullName: string;
  email: string;
  role:
    | 'individual-contributor'
    | 'team-lead'
    | 'scrum-master'
    | 'product-owner'
    | 'engineering-manager'
    | 'agile-coach'
    | 'executive-sponsor'
    | 'other'
    | '';
  teamName: string;
  organisationName: string;
  yearsInAgile: number | null;
  assessmentDate: string;
  assessmentPeriod: 'sprint' | 'quarter' | 'half-year' | 'annual' | 'ad-hoc' | '';
}

export interface PrincipleResponse {
  score: LikertScore;
  comment: string;
  weight: number; // 0.5..2.0, default 1.0
}

export interface ActionPlan {
  topAction1: string;
  topAction2: string;
  topAction3: string;
  coachNotes: string;
  signedAt: string;
  overallNotes: string;
}

export interface AgileAssessment {
  respondent: Respondent;
  responses: PrincipleResponse[]; // length 12, indexed 0..11 → principles 1..12
  actionPlan: ActionPlan;
}

export interface FiredRule {
  ruleId: string;
  principleNumber: number;
  principleSlug: string;
  band: PrincipleBand;
  description: string;
}

export interface AdditionalFlag {
  flagId: string;
  category: FlagCategory;
  priority: FlagPriority;
  principleNumber: number | null;
  description: string;
  suggestedAction: string;
}

export interface GradingResult {
  answeredCount: number;
  meanScore: number | null;          // unweighted mean (kept for trend continuity)
  weightedMeanScore: number | null;  // weighted mean (= meanScore when no weights customised)
  weightsCustomised: boolean;        // true if any weight differs from 1.0
  maturity: Maturity;                // derived from weightedMeanScore
  perPrincipleBands: PrincipleBand[];
  firedRules: FiredRule[];
  additionalFlags: AdditionalFlag[];
}
