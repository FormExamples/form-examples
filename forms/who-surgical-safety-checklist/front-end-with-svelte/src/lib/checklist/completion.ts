import type { ChecklistStatus, WhoSurgicalSafetyChecklist } from './types.js';

/**
 * Phase completion predicates and overall lifecycle status calculator for the
 * WHO Surgical Safety Checklist.
 *
 * Lifecycle (see `index.md` § "Completion status"):
 *
 * | Phase status        | Driver                                                     |
 * | ------------------- | ---------------------------------------------------------- |
 * | Not started         | No items answered                                          |
 * | Sign In complete    | All Sign In items answered + coordinator sign-off          |
 * | Time Out complete   | All Time Out items answered + coordinator sign-off         |
 * | Sign Out complete   | All Sign Out items answered + coordinator sign-off         |
 * | Completed           | All three phases completed                                 |
 * | Abandoned           | Case cancelled before sign-out, with reason                |
 *
 * Pure function — no side effects, no I/O.
 */
export function computeStatus(c: WhoSurgicalSafetyChecklist): ChecklistStatus {
  // Abandoned wins regardless of other progress.
  if (c.abandonedReason.trim() !== '') {
    return 'abandoned';
  }

  const signIn = isSignInComplete(c);
  const timeOut = isTimeOutComplete(c);
  const signOut = isSignOutComplete(c);

  if (signIn && timeOut && signOut) return 'completed';
  if (signIn && timeOut) return 'time-out-complete';
  if (signIn) return 'sign-in-complete';
  // Phases must be signed off in order. If Sign In is not yet complete, even
  // a fully-answered Time Out or Sign Out does not advance the lifecycle.
  return 'not-started';
}

export function isSignInComplete(c: WhoSurgicalSafetyChecklist): boolean {
  return (
    c.signInIdentitySiteProcedureConsent === 'yes' &&
    c.signInSiteMarked !== '' &&
    c.signInAnaesthesiaCheckComplete === 'yes' &&
    c.signInPulseOximeterOnPatient === 'yes' &&
    c.signInKnownAllergy !== '' &&
    c.signInDifficultAirwayAspirationRisk !== '' &&
    c.signInBloodLossRisk !== '' &&
    c.signInCoordinatorName.trim() !== '' &&
    c.signInCompletedAt !== ''
  );
}

export function isTimeOutComplete(c: WhoSurgicalSafetyChecklist): boolean {
  return (
    c.timeOutTeamIntroductionsConfirmed === 'yes' &&
    c.timeOutPatientProcedureIncisionConfirmed === 'yes' &&
    c.timeOutAntibioticProphylaxisWithin60Min !== '' &&
    c.timeOutNursingSterilityConfirmed === 'yes' &&
    c.timeOutEssentialImagingDisplayed !== '' &&
    c.timeOutCoordinatorName.trim() !== '' &&
    c.timeOutCompletedAt !== ''
  );
}

export function isSignOutComplete(c: WhoSurgicalSafetyChecklist): boolean {
  return (
    c.signOutProcedureNameConfirmed === 'yes' &&
    c.signOutCountsConfirmed !== '' &&
    c.signOutSpecimensLabelled !== '' &&
    c.signOutCoordinatorName.trim() !== '' &&
    c.signOutCompletedAt !== ''
  );
}

/**
 * True when at least one wizard field has been answered. Useful for the UI to
 * distinguish a brand-new draft from one that is in progress but has no phase
 * fully signed off.
 */
export function isAnythingAnswered(c: WhoSurgicalSafetyChecklist): boolean {
  return (
    c.plannedProcedure !== '' ||
    c.urgency !== '' ||
    c.signInIdentitySiteProcedureConsent !== '' ||
    c.signInSiteMarked !== '' ||
    c.signInAnaesthesiaCheckComplete !== '' ||
    c.signInPulseOximeterOnPatient !== '' ||
    c.signInKnownAllergy !== '' ||
    c.signInDifficultAirwayAspirationRisk !== '' ||
    c.signInBloodLossRisk !== '' ||
    c.timeOutTeamIntroductionsConfirmed !== '' ||
    c.timeOutPatientProcedureIncisionConfirmed !== '' ||
    c.timeOutAntibioticProphylaxisWithin60Min !== '' ||
    c.timeOutNursingSterilityConfirmed !== '' ||
    c.timeOutEssentialImagingDisplayed !== '' ||
    c.signOutProcedureNameConfirmed !== '' ||
    c.signOutCountsConfirmed !== '' ||
    c.signOutSpecimensLabelled !== ''
  );
}
