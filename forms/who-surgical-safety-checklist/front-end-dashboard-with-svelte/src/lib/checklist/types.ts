/**
 * TypeScript types mirroring the SQL columns of `who_surgical_safety_checklist`
 * (see `../../../../sql-migrations/04_create_table_who_surgical_safety_checklist.sql`).
 *
 * Conventions:
 *   - camelCase property names.
 *   - Empty string '' for unanswered enum/text fields.
 *   - null for unanswered numeric / timestamp fields.
 */

/** Overall checklist lifecycle status. */
export type ChecklistStatus =
  | 'not-started'
  | 'sign-in-complete'
  | 'time-out-complete'
  | 'sign-out-complete'
  | 'completed'
  | 'abandoned';

/** Procedure urgency (NCEPOD). */
export type Urgency = 'elective' | 'urgent' | 'emergency' | 'immediate' | '';

/** Side of the body. */
export type Laterality = 'left' | 'right' | 'bilateral' | 'midline' | 'na' | '';

/** Yes / blank tri-state for required confirmation items. */
export type YesBlank = 'yes' | '';

/** Yes / not-applicable / blank for conditional confirmation items. */
export type YesNaBlank = 'yes' | 'not-applicable' | '';

/** No / yes / blank for binary risk items. */
export type NoYesBlank = 'no' | 'yes' | '';

/** Yes / no / blank for binary confirmation items. */
export type YesNoBlank = 'yes' | 'no' | '';

/** Yes / no / not-applicable / blank for conditional confirmation items. */
export type YesNoNaBlank = 'yes' | 'no' | 'not-applicable' | '';

/** Difficult airway / aspiration risk answer. */
export type DifficultAirwayRisk = 'no' | 'yes-equipment-available' | '';

/** Blood-loss risk answer. */
export type BloodLossRisk = 'no' | 'yes-two-ivs-and-fluids-planned' | '';

/** Yes / no / blank for paediatric flag. */
export type PaediatricFlag = 'yes' | 'no' | '';

/** Safety-flag severity. */
export type FlagSeverity = 'low' | 'medium' | 'high';

/** A safety flag computed from checklist responses. */
export interface SafetyFlag {
  code: string;
  label: string;
  severity: FlagSeverity;
}

/** A team-member roster entry captured during Time Out introductions. */
export interface TeamMember {
  id: string;
  checklistId: string;
  name: string;
  role:
    | 'surgeon'
    | 'assistant-surgeon'
    | 'anaesthetist'
    | 'circulating-nurse'
    | 'scrub-nurse'
    | 'anaesthetic-assistant'
    | 'perfusionist'
    | 'technician'
    | 'observer'
    | 'other'
    | '';
  introducedDuringTimeOut: YesNoBlank;
}

/**
 * A complete WHO Surgical Safety Checklist row, mirroring every SQL column in
 * camelCase. This is the canonical shape exchanged between the front-end and
 * backend.
 */
export interface WhoSurgicalSafetyChecklist {
  // Core record metadata
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  // Case identification
  patientId: string;
  surgeonId: string | null;
  anaesthetistId: string | null;
  leadNurseId: string | null;
  status: ChecklistStatus;
  siteName: string;
  operatingRoom: string;
  caseDate: string | null;
  caseStartAt: string | null;
  caseEndAt: string | null;
  plannedProcedure: string;
  surgicalSpecialty: string;
  urgency: Urgency;
  laterality: Laterality;
  isPaediatric: PaediatricFlag;
  abandonedReason: string;

  // Phase 1 — Sign In
  signInIdentitySiteProcedureConsent: YesBlank;
  signInSiteMarked: YesNaBlank;
  signInAnaesthesiaCheckComplete: YesBlank;
  signInPulseOximeterOnPatient: YesBlank;
  signInKnownAllergy: NoYesBlank;
  signInKnownAllergyDetail: string;
  signInDifficultAirwayAspirationRisk: DifficultAirwayRisk;
  signInBloodLossRisk: BloodLossRisk;
  signInCoordinatorId: string | null;
  signInCompletedAt: string | null;

  // Phase 2 — Time Out
  timeOutTeamIntroductionsConfirmed: YesBlank;
  timeOutPatientProcedureIncisionConfirmed: YesBlank;
  timeOutAntibioticProphylaxisWithin60Min: YesNaBlank;
  timeOutSurgeonCriticalSteps: string;
  timeOutSurgeonCaseDurationMinutes: number | null;
  timeOutSurgeonAnticipatedBloodLossMl: number | null;
  timeOutAnaesthetistPatientConcerns: string;
  timeOutNursingSterilityConfirmed: YesBlank;
  timeOutNursingEquipmentConcerns: string;
  timeOutEssentialImagingDisplayed: YesNaBlank;
  timeOutCoordinatorId: string | null;
  timeOutCompletedAt: string | null;

  // Phase 3 — Sign Out
  signOutProcedureNameConfirmed: YesBlank;
  signOutCountsConfirmed: YesNoBlank;
  signOutSpecimensLabelled: YesNoNaBlank;
  signOutEquipmentProblems: string;
  signOutRecoveryConcerns: string;
  signOutCoordinatorId: string | null;
  signOutCompletedAt: string | null;
}

/**
 * Row shape consumed by the SVAR DataGrid. Wraps the raw checklist with
 * denormalised display fields (patient name, surgeon name, computed safety
 * flags) so the grid can sort/filter without extra joins.
 */
export interface ChecklistRow {
  checklist: WhoSurgicalSafetyChecklist;

  id: string;
  caseDate: string;
  patientName: string;
  patientNhsNumber: string;
  surgeonName: string;
  anaesthetistName: string;
  leadNurseName: string;
  siteName: string;
  operatingRoom: string;
  plannedProcedure: string;
  surgicalSpecialty: string;
  urgency: Urgency;
  laterality: Laterality;
  status: ChecklistStatus;

  /** Number of completed phases (0–3). */
  phasesCompleted: number;
  /** Safety flags computed from the responses. */
  flags: SafetyFlag[];
  /** Count of flags. */
  flagCount: number;
  /** Count of high-severity flags. */
  highFlagCount: number;
  /** Pre-joined comma list of flag labels for table display. */
  flagSummary: string;

  teamMembers: TeamMember[];
}

/** Response from a `GET /api/dashboard/checklists` endpoint. */
export interface DashboardChecklistsResponse {
  items: ChecklistRow[];
  total: number;
}
