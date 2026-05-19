/**
 * TypeScript types for the WHO Surgical Safety Checklist, mapping the
 * snake_case SQL columns of `who_surgical_safety_checklist` and `team_member`
 * to camelCase properties.
 *
 * Conventions:
 * - Empty string `''` for unanswered text / enum fields.
 * - `null` for unanswered numeric fields.
 */

export type YesEmpty = 'yes' | '';
export type YesNoEmpty = 'yes' | 'no' | '';
export type YesNaEmpty = 'yes' | 'not-applicable' | '';
export type YesNoNaEmpty = 'yes' | 'no' | 'not-applicable' | '';

export type Urgency = 'elective' | 'urgent' | 'emergency' | 'immediate' | '';
export type Laterality = 'left' | 'right' | 'bilateral' | 'midline' | 'na' | '';
export type IsPaediatric = 'yes' | 'no' | '';

export type ChecklistStatus =
  | 'not-started'
  | 'sign-in-complete'
  | 'time-out-complete'
  | 'sign-out-complete'
  | 'completed'
  | 'abandoned';

export type AllergyAnswer = 'no' | 'yes' | '';
export type DifficultAirwayAnswer = 'no' | 'yes-equipment-available' | '';
export type BloodLossAnswer = 'no' | 'yes-two-ivs-and-fluids-planned' | '';

export type TeamRole =
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

export interface TeamMember {
  id: string;
  checklistId: string;
  clinicianId: string;
  name: string;
  role: TeamRole;
  introducedDuringTimeOut: YesNoEmpty;
  notes: string;
}

export interface WhoSurgicalSafetyChecklist {
  id: string;

  // Case identification
  patientId: string;
  surgeonId: string;
  anaesthetistId: string;
  leadNurseId: string;
  status: ChecklistStatus;
  siteName: string;
  operatingRoom: string;
  caseDate: string;
  caseStartAt: string;
  caseEndAt: string;
  plannedProcedure: string;
  surgicalSpecialty: string;
  urgency: Urgency;
  laterality: Laterality;
  isPaediatric: IsPaediatric;
  abandonedReason: string;

  // Phase 1 — Sign In
  signInIdentitySiteProcedureConsent: YesEmpty;
  signInSiteMarked: YesNaEmpty;
  signInAnaesthesiaCheckComplete: YesEmpty;
  signInPulseOximeterOnPatient: YesEmpty;
  signInKnownAllergy: AllergyAnswer;
  signInKnownAllergyDetail: string;
  signInDifficultAirwayAspirationRisk: DifficultAirwayAnswer;
  signInBloodLossRisk: BloodLossAnswer;
  signInCoordinatorId: string;
  signInCoordinatorName: string;
  signInCoordinatorRole: TeamRole;
  signInCompletedAt: string;

  // Phase 2 — Time Out
  timeOutTeamIntroductionsConfirmed: YesEmpty;
  timeOutPatientProcedureIncisionConfirmed: YesEmpty;
  timeOutAntibioticProphylaxisWithin60Min: YesNaEmpty;
  timeOutSurgeonCriticalSteps: string;
  timeOutSurgeonCaseDurationMinutes: number | null;
  timeOutSurgeonAnticipatedBloodLossMl: number | null;
  timeOutAnaesthetistPatientConcerns: string;
  timeOutNursingSterilityConfirmed: YesEmpty;
  timeOutNursingEquipmentConcerns: string;
  timeOutEssentialImagingDisplayed: YesNaEmpty;
  timeOutCoordinatorId: string;
  timeOutCoordinatorName: string;
  timeOutCoordinatorRole: TeamRole;
  timeOutCompletedAt: string;

  // Phase 3 — Sign Out
  signOutProcedureNameConfirmed: YesEmpty;
  signOutCountsConfirmed: YesNoEmpty;
  signOutSpecimensLabelled: YesNoNaEmpty;
  signOutEquipmentProblems: string;
  signOutRecoveryConcerns: string;
  signOutCoordinatorId: string;
  signOutCoordinatorName: string;
  signOutCoordinatorRole: TeamRole;
  signOutCompletedAt: string;

  // Team roster captured during Time Out introductions
  teamMembers: TeamMember[];
}

export type SafetyFlagPriority = 'high' | 'medium' | 'low';

export type SafetyFlagCode =
  | 'identity-not-confirmed'
  | 'site-not-marked'
  | 'anaesthesia-check-incomplete'
  | 'pulse-oximeter-not-functioning'
  | 'known-allergy-flagged'
  | 'difficult-airway-risk'
  | 'high-blood-loss-risk'
  | 'antibiotic-prophylaxis-missed'
  | 'sterility-not-confirmed'
  | 'imaging-missing'
  | 'count-discrepancy'
  | 'specimen-labelling-missed'
  | 'equipment-problem';

export interface SafetyFlag {
  flag: SafetyFlagCode;
  priority: SafetyFlagPriority;
  message: string;
}
