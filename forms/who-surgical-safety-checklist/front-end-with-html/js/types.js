// Plain-JavaScript / JSDoc type definitions for the WHO Surgical Safety
// Checklist. Mirrors the canonical column list in
// sql/04_create_table_who_surgical_safety_checklist.sql and
// the team-member roster in sql/05_create_table_team_member.sql.
//
// Builds the canonical empty checklist shape so newly-added fields
// default correctly when older saved state is rehydrated from
// localStorage. Wrapped in an IIFE; published via
// `window.WhoSurgicalSafetyChecklist`.

/**
 * Build a fresh, fully-blank WHO Surgical Safety Checklist record.
 * Strings default to ''; numeric fields default to null; the team-member
 * roster defaults to an empty array.
 */
function emptyChecklist() {
  return {
    // Case identification — Step 0
    caseDetails: {
      patientName: '',
      patientBirthDate: '',
      patientNhsNumber: '',
      patientMedicalRecordNumber: '',
      patientWeightKg: null,
      isPaediatric: '',

      surgeonName: '',
      anaesthetistName: '',
      leadNurseName: '',

      plannedProcedure: '',
      surgicalSpecialty: '',
      urgency: '',
      laterality: '',

      siteName: '',
      operatingRoom: '',
      caseDate: '',
      caseStartAt: '',
      caseEndAt: ''
    },

    // Phase 1 — Sign In (before induction of anaesthesia)
    signIn: {
      identitySiteProcedureConsent: '',     // 'yes' | ''
      siteMarked: '',                       // 'yes' | 'not-applicable' | ''
      anaesthesiaCheckComplete: '',         // 'yes' | ''
      pulseOximeterOnPatient: '',           // 'yes' | ''
      knownAllergy: '',                     // 'no' | 'yes' | ''
      knownAllergyDetail: '',
      difficultAirwayAspirationRisk: '',    // 'no' | 'yes-equipment-available' | ''
      bloodLossRisk: '',                    // 'no' | 'yes-two-ivs-and-fluids-planned' | ''
      coordinatorName: '',
      coordinatorRole: '',
      completedAt: ''
    },

    // Phase 2 — Time Out (before skin incision)
    timeOut: {
      teamIntroductionsConfirmed: '',           // 'yes' | ''
      patientProcedureIncisionConfirmed: '',    // 'yes' | ''
      antibioticProphylaxisWithin60Min: '',     // 'yes' | 'not-applicable' | ''
      surgeonCriticalSteps: '',
      surgeonCaseDurationMinutes: null,
      surgeonAnticipatedBloodLossMl: null,
      anaesthetistPatientConcerns: '',
      nursingSterilityConfirmed: '',            // 'yes' | ''
      nursingEquipmentConcerns: '',
      essentialImagingDisplayed: '',            // 'yes' | 'not-applicable' | ''
      coordinatorName: '',
      coordinatorRole: '',
      completedAt: ''
    },

    // Phase 3 — Sign Out (before patient leaves operating room)
    signOut: {
      procedureNameConfirmed: '',         // 'yes' | ''
      countsConfirmed: '',                // 'yes' | 'no' | ''
      specimensLabelled: '',              // 'yes' | 'no' | 'not-applicable' | ''
      equipmentProblems: '',
      recoveryConcerns: '',
      coordinatorName: '',
      coordinatorRole: '',
      completedAt: ''
    },

    // Operating-team roster (Time Out introductions)
    teamMembers: [],

    // Summary / lifecycle
    summary: {
      abandonedReason: ''
    }
  };
}

/** Build a fresh blank team-member row. */
function emptyTeamMember() {
  return {
    name: '',
    role: '',
    introducedDuringTimeOut: '',
    notes: ''
  };
}

/**
 * Derive the overall checklist `status` from the answered fields.
 * Returns one of: 'not-started' | 'sign-in-complete' | 'time-out-complete' |
 * 'sign-out-complete' | 'completed' | 'abandoned'.
 */
function deriveStatus(c) {
  if (c.summary.abandonedReason && c.summary.abandonedReason.trim() !== '') {
    return 'abandoned';
  }
  const signInDone = isSignInComplete(c);
  const timeOutDone = isTimeOutComplete(c);
  const signOutDone = isSignOutComplete(c);
  if (signInDone && timeOutDone && signOutDone) return 'completed';
  if (signOutDone) return 'sign-out-complete';
  if (timeOutDone) return 'time-out-complete';
  if (signInDone) return 'sign-in-complete';
  return 'not-started';
}

function isSignInComplete(c) {
  const s = c.signIn;
  // Every required item answered, plus coordinator sign-off.
  return (
    s.identitySiteProcedureConsent !== '' &&
    s.siteMarked !== '' &&
    s.anaesthesiaCheckComplete !== '' &&
    s.pulseOximeterOnPatient !== '' &&
    s.knownAllergy !== '' &&
    s.difficultAirwayAspirationRisk !== '' &&
    s.bloodLossRisk !== '' &&
    s.coordinatorName !== '' &&
    s.completedAt !== ''
  );
}

function isTimeOutComplete(c) {
  const t = c.timeOut;
  return (
    t.teamIntroductionsConfirmed !== '' &&
    t.patientProcedureIncisionConfirmed !== '' &&
    t.antibioticProphylaxisWithin60Min !== '' &&
    t.nursingSterilityConfirmed !== '' &&
    t.essentialImagingDisplayed !== '' &&
    t.coordinatorName !== '' &&
    t.completedAt !== ''
  );
}

function isSignOutComplete(c) {
  const o = c.signOut;
  return (
    o.procedureNameConfirmed !== '' &&
    o.countsConfirmed !== '' &&
    o.specimensLabelled !== '' &&
    o.coordinatorName !== '' &&
    o.completedAt !== ''
  );
}

/** Pretty label for a status enum value. */
function statusLabel(status) {
  switch (status) {
    case 'not-started': return 'Not started';
    case 'sign-in-complete': return 'Sign In complete';
    case 'time-out-complete': return 'Time Out complete';
    case 'sign-out-complete': return 'Sign Out complete';
    case 'completed': return 'Completed';
    case 'abandoned': return 'Abandoned';
    default: return '';
  }
}

export { emptyChecklist, emptyTeamMember, deriveStatus, isSignInComplete, isTimeOutComplete, isSignOutComplete, statusLabel };
