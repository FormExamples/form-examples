/** Fitness advice recorded on the note. */
export type FitnessAdvice = '' | 'not-fit-for-work' | 'may-be-fit-for-work';

/** Approval outcome of the engine; worst effect wins. */
export type ApprovalStatus = 'approved' | 'needs-completion' | 'blocked';

/** Flag priority. */
export type FlagPriority = 'high' | 'medium' | 'low';

/**
 * The fields the approval engine reads. Unanswered text and enum fields are
 * `''`; unanswered numeric and date fields are `null`.
 */
export interface FitNoteEngineState {
  status: string;
  assessmentDate: string | null;
  assessmentMethod: string;
  diagnosisPrimary: string;
  diagnosisAdditional: string;
  fitnessAdvice: FitnessAdvice | string;
  periodFrom: string | null;
  periodTo: string | null;
  periodDurationDays: number | null;
  reassessmentRequired: string;
  adjustmentPhasedReturn: string;
  adjustmentAlteredHours: string;
  adjustmentAmendedDuties: string;
  adjustmentWorkplaceAdaptations: string;
  functionalEffects: string;
  comments: string;
  employeeConsentToShare: string;
  clinicianDeclaration: string;
  clinicianRegistrationBody: string;
  clinicianRegistrationNumber: string;
}

/**
 * The full wizard state: the engine fields plus the employee and clinician
 * identification fields the engine ignores.
 */
export interface FitNoteAssessment extends FitNoteEngineState {
  employeeName: string;
  employeeBirthDate: string | null;
  employeeNhsNumber: string;
  employerName: string;
  jobTitle: string;
  clinicianName: string;
  clinicianRole: string;
}

/** A rule that fired (R-01 to R-09). */
export interface FiredRule {
  ruleId: string;
  category: string;
  description: string;
}

/** A flag raised by a fired rule, or the standalone consent flag. */
export interface FitNoteFlag {
  flagId: string;
  category: string;
  priority: FlagPriority;
  description: string;
  suggestedAction: string;
}

/** The engine's grade for one fit note. */
export interface FitNoteGrade {
  outcome: string;
  approvalStatus: ApprovalStatus;
  durationDays: number | null;
  adjustmentCount: number;
  firedRules: FiredRule[];
  additionalFlags: FitNoteFlag[];
}

/** One row of the clinician dashboard. */
export interface DashboardRow {
  id: string;
  date: string;
  employee: string;
  employer: string;
  advice: string;
  durationDays: number | null;
  adjustments: number;
  approval: ApprovalStatus;
  flagCount: number;
  flags: string;
  clinician: string;
}
