import { describe, expect, it } from 'vitest';
import {
  computeStatus,
  isSignInComplete,
  isTimeOutComplete,
  isSignOutComplete,
  isAnythingAnswered,
} from './completion.js';
import { createEmptyChecklist } from './factory.js';
import type { WhoSurgicalSafetyChecklist } from './types.js';

function fullySignIn(c: WhoSurgicalSafetyChecklist) {
  c.signInIdentitySiteProcedureConsent = 'yes';
  c.signInSiteMarked = 'yes';
  c.signInAnaesthesiaCheckComplete = 'yes';
  c.signInPulseOximeterOnPatient = 'yes';
  c.signInKnownAllergy = 'no';
  c.signInDifficultAirwayAspirationRisk = 'no';
  c.signInBloodLossRisk = 'no';
  c.signInCoordinatorName = 'A. Nurse';
  c.signInCoordinatorRole = 'circulating-nurse';
  c.signInCompletedAt = '2026-05-18T09:00:00Z';
}

function fullyTimeOut(c: WhoSurgicalSafetyChecklist) {
  c.timeOutTeamIntroductionsConfirmed = 'yes';
  c.timeOutPatientProcedureIncisionConfirmed = 'yes';
  c.timeOutAntibioticProphylaxisWithin60Min = 'yes';
  c.timeOutNursingSterilityConfirmed = 'yes';
  c.timeOutEssentialImagingDisplayed = 'yes';
  c.timeOutCoordinatorName = 'A. Nurse';
  c.timeOutCoordinatorRole = 'circulating-nurse';
  c.timeOutCompletedAt = '2026-05-18T09:30:00Z';
}

function fullySignOut(c: WhoSurgicalSafetyChecklist) {
  c.signOutProcedureNameConfirmed = 'yes';
  c.signOutCountsConfirmed = 'yes';
  c.signOutSpecimensLabelled = 'not-applicable';
  c.signOutCoordinatorName = 'A. Nurse';
  c.signOutCoordinatorRole = 'circulating-nurse';
  c.signOutCompletedAt = '2026-05-18T11:30:00Z';
}

describe('completion predicates', () => {
  it('isSignInComplete is false for an empty checklist', () => {
    expect(isSignInComplete(createEmptyChecklist())).toBe(false);
  });

  it('isSignInComplete is true when all Sign In fields and sign-off are set', () => {
    const c = createEmptyChecklist();
    fullySignIn(c);
    expect(isSignInComplete(c)).toBe(true);
  });

  it('isSignInComplete is false when coordinator name is blank', () => {
    const c = createEmptyChecklist();
    fullySignIn(c);
    c.signInCoordinatorName = '';
    expect(isSignInComplete(c)).toBe(false);
  });

  it('isSignInComplete is false when sign-off timestamp is blank', () => {
    const c = createEmptyChecklist();
    fullySignIn(c);
    c.signInCompletedAt = '';
    expect(isSignInComplete(c)).toBe(false);
  });

  it('isTimeOutComplete is true when all Time Out fields and sign-off are set', () => {
    const c = createEmptyChecklist();
    fullyTimeOut(c);
    expect(isTimeOutComplete(c)).toBe(true);
  });

  it('isSignOutComplete is true when all Sign Out fields and sign-off are set', () => {
    const c = createEmptyChecklist();
    fullySignOut(c);
    expect(isSignOutComplete(c)).toBe(true);
  });

  it('isAnythingAnswered is false for an empty checklist', () => {
    expect(isAnythingAnswered(createEmptyChecklist())).toBe(false);
  });

  it('isAnythingAnswered is true when one Sign In item is set', () => {
    const c = createEmptyChecklist();
    c.signInIdentitySiteProcedureConsent = 'yes';
    expect(isAnythingAnswered(c)).toBe(true);
  });
});

describe('computeStatus lifecycle', () => {
  it('not-started for an empty checklist', () => {
    expect(computeStatus(createEmptyChecklist())).toBe('not-started');
  });

  it('not-started while items are being filled in but no phase signed off', () => {
    const c = createEmptyChecklist();
    c.signInIdentitySiteProcedureConsent = 'yes';
    c.signInSiteMarked = 'yes';
    expect(computeStatus(c)).toBe('not-started');
  });

  it('sign-in-complete once Sign In is fully signed off', () => {
    const c = createEmptyChecklist();
    fullySignIn(c);
    expect(computeStatus(c)).toBe('sign-in-complete');
  });

  it('time-out-complete once both Sign In and Time Out are signed off', () => {
    const c = createEmptyChecklist();
    fullySignIn(c);
    fullyTimeOut(c);
    expect(computeStatus(c)).toBe('time-out-complete');
  });

  it('completed once all three phases are signed off', () => {
    const c = createEmptyChecklist();
    fullySignIn(c);
    fullyTimeOut(c);
    fullySignOut(c);
    expect(computeStatus(c)).toBe('completed');
  });

  it('phases must be signed off in order — Time Out alone does not advance lifecycle', () => {
    const c = createEmptyChecklist();
    fullyTimeOut(c);
    expect(computeStatus(c)).toBe('not-started');
  });

  it('abandoned overrides phase completion when abandoned_reason is set', () => {
    const c = createEmptyChecklist();
    fullySignIn(c);
    fullyTimeOut(c);
    c.abandonedReason = 'Patient pyrexia, cancelled';
    expect(computeStatus(c)).toBe('abandoned');
  });

  it('abandoned with only whitespace reason does not trigger abandoned', () => {
    const c = createEmptyChecklist();
    fullySignIn(c);
    c.abandonedReason = '   ';
    expect(computeStatus(c)).toBe('sign-in-complete');
  });
});
