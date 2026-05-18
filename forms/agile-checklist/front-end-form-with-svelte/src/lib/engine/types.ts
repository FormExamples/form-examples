import type { SectionId } from '$lib/config/items.js';

export type Answer = 'yes' | 'no' | 'not-applicable' | '';

export type Maturity =
  | 'optimising'
  | 'mature'
  | 'developing'
  | 'initial'
  | 'ad-hoc'
  | 'insufficient-data';

export type Band = 'high' | 'mid' | 'low' | 'unanswered';

export type FlagPriority = 'low' | 'medium' | 'high';

export type FlagCategory =
  | 'teams-autonomy-risk'
  | 'stakeholders-trust-risk'
  | 'practices-discipline-risk'
  | 'section-imbalance'
  | 'finished-work-risk'
  | 'experimentation-blocked'
  | 'learning-stalled'
  | 'psychological-safety-risk'
  | 'insufficient-data'
  | 'other';

export interface Respondent {
  fullName: string;
  email: string;
  role:
    | 'team-member'
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

export interface ActionPlan {
  topAction1: string;
  topAction2: string;
  topAction3: string;
  coachNotes: string;
  signedAt: string;
  overallNotes: string;
}

export interface AgileChecklist {
  respondent: Respondent;
  /** Map of item-id (e.g. 't08') → answer */
  answers: Record<string, Answer>;
  actionPlan: ActionPlan;
}

export interface SectionScore {
  section: SectionId;
  yesCount: number;
  noCount: number;
  notApplicableCount: number;
  unansweredCount: number;
  applicableCount: number; // yes + no
  percent: number | null;  // null when applicableCount === 0
  band: Band;
}

export interface FiredRule {
  ruleId: string;
  section: SectionId | '';
  band: Band;
  description: string;
}

export interface AdditionalFlag {
  flagId: string;
  category: FlagCategory;
  priority: FlagPriority;
  section: SectionId | '';
  triggeringItems: string[]; // stable item ids, e.g. ['t08','p12']
  description: string;
  suggestedAction: string;
}

export interface GradingResult {
  answeredCount: number;
  teams: SectionScore;
  stakeholders: SectionScore;
  practices: SectionScore;
  overallPercent: number | null;
  maturity: Maturity;
  firedRules: FiredRule[];
  additionalFlags: AdditionalFlag[];
}
