import type { TeamMember, WhoSurgicalSafetyChecklist } from './types.js';

/**
 * Build an empty WHO Surgical Safety Checklist matching the SQL defaults:
 * empty string `''` for unanswered text / enum fields, `null` for unanswered
 * numeric fields.
 */
export function createEmptyChecklist(): WhoSurgicalSafetyChecklist {
  return {
    id: '',

    patientId: '',
    surgeonId: '',
    anaesthetistId: '',
    leadNurseId: '',
    status: 'not-started',
    siteName: '',
    operatingRoom: '',
    caseDate: '',
    caseStartAt: '',
    caseEndAt: '',
    plannedProcedure: '',
    surgicalSpecialty: '',
    urgency: '',
    laterality: '',
    isPaediatric: '',
    abandonedReason: '',

    signInIdentitySiteProcedureConsent: '',
    signInSiteMarked: '',
    signInAnaesthesiaCheckComplete: '',
    signInPulseOximeterOnPatient: '',
    signInKnownAllergy: '',
    signInKnownAllergyDetail: '',
    signInDifficultAirwayAspirationRisk: '',
    signInBloodLossRisk: '',
    signInCoordinatorId: '',
    signInCoordinatorName: '',
    signInCoordinatorRole: '',
    signInCompletedAt: '',

    timeOutTeamIntroductionsConfirmed: '',
    timeOutPatientProcedureIncisionConfirmed: '',
    timeOutAntibioticProphylaxisWithin60Min: '',
    timeOutSurgeonCriticalSteps: '',
    timeOutSurgeonCaseDurationMinutes: null,
    timeOutSurgeonAnticipatedBloodLossMl: null,
    timeOutAnaesthetistPatientConcerns: '',
    timeOutNursingSterilityConfirmed: '',
    timeOutNursingEquipmentConcerns: '',
    timeOutEssentialImagingDisplayed: '',
    timeOutCoordinatorId: '',
    timeOutCoordinatorName: '',
    timeOutCoordinatorRole: '',
    timeOutCompletedAt: '',

    signOutProcedureNameConfirmed: '',
    signOutCountsConfirmed: '',
    signOutSpecimensLabelled: '',
    signOutEquipmentProblems: '',
    signOutRecoveryConcerns: '',
    signOutCoordinatorId: '',
    signOutCoordinatorName: '',
    signOutCoordinatorRole: '',
    signOutCompletedAt: '',

    teamMembers: [],
  };
}

export function createEmptyTeamMember(): TeamMember {
  return {
    id: '',
    checklistId: '',
    clinicianId: '',
    name: '',
    role: '',
    introducedDuringTimeOut: '',
    notes: '',
  };
}
